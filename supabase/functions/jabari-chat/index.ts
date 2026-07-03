import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Groq model — llama-3.3-70b-versatile gives best quality at free tier
const GROQ_MODEL = "llama-3.3-70b-versatile";
const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";

// Gemini message format (used by frontend — we convert internally)
type GeminiMessage = {
  role: "user" | "model";
  parts: { text: string }[];
};

type SafeguardingCategory = "A" | "B" | null;

const REDACTED_SAFEGUARDING_MESSAGE = "[REDACTED SAFEGUARDING DISCLOSURE]";

const ESCALATION_TEXT = {
  A: "What you've shared with me is important, and I want to make sure you get the right support. You are not alone. 💙 Childline Kenya: 116 (free, 24/7)",
  B: "Thank you for trusting me with this. What you're describing sounds really hard, and you deserve proper support. Childline Kenya: 116",
} as const;

const CATEGORY_A_KEYWORDS = [
  "want to hurt myself",
  "want to kill myself",
  "kujiua",
  "nitajiua",
  "kujidhuru",
  "dont want to be alive",
  "don't want to be alive",
  "nobody would miss me",
  "nothing to live for",
  "i've been cutting",
  "ninajikata",
  "i've taken pills",
  "want to disappear",
  "i have nowhere to sleep tonight",
  "scared to go home",
  "he is hurting me",
  "she is hurting me",
  "got beaten badly",
  "touches me when nobody",
];

const CATEGORY_B_KEYWORDS = [
  "being threatened",
  "forced to",
  "taking photos of me",
  "haven't eaten in days",
  "no adult at home",
  "someone is giving me money to",
  "older person wants me to",
];

function matchesKeywords(text: string, keywords: string[]): boolean {
  const lower = text.toLowerCase();
  return keywords.some((keyword) => {
    const escaped = keyword.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const regex = new RegExp(`(^|\\W)${escaped}(\\W|$)`, "i");
    return regex.test(lower);
  });
}

function detectBlockingSafeguarding(text: string, ageBracket = ""): {
  triggered: boolean;
  category: SafeguardingCategory;
  responseText: string | null;
} {
  if (matchesKeywords(text, CATEGORY_A_KEYWORDS)) {
    return { triggered: true, category: "A", responseText: ESCALATION_TEXT.A };
  }

  if (matchesKeywords(text, CATEGORY_B_KEYWORDS)) {
    if (ageBracket === "10-12") {
      return { triggered: true, category: "A", responseText: ESCALATION_TEXT.A };
    }
    return { triggered: true, category: "B", responseText: ESCALATION_TEXT.B };
  }

  return { triggered: false, category: null, responseText: null };
}

// Convert Gemini message history to OpenAI/Groq format
function toOpenAIMessages(
  system: string,
  contents: GeminiMessage[]
): { role: string; content: string }[] {
  const messages: { role: string; content: string }[] = [];

  if (system) {
    messages.push({ role: "system", content: system });
  }

  for (const msg of contents) {
    messages.push({
      role: msg.role === "model" ? "assistant" : "user",
      content: msg.parts.map((p) => p.text).join(""),
    });
  }

  return messages;
}

function splitSystemPrompt(preparedHistory: GeminiMessage[]) {
  const system = preparedHistory[0]?.parts[0]?.text ?? "";
  const contents = preparedHistory.slice(1);
  return { system, contents };
}

async function groqGenerate(
  system: string,
  contents: GeminiMessage[],
  extraUserMessage?: string
): Promise<string> {
  const apiKey = Deno.env.get("GROQ_API_KEY");
  if (!apiKey) throw new Error("GROQ_API_KEY is not configured");

  const messages = toOpenAIMessages(system, contents);

  if (extraUserMessage) {
    messages.push({ role: "user", content: extraUserMessage });
  }

  const res = await fetch(GROQ_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: GROQ_MODEL,
      messages,
      max_tokens: 600,
      temperature: 0.8,
    }),
  });

  const data = await res.json();

  if (!res.ok) {
    const errMsg = data?.error?.message ?? `Groq HTTP ${res.status}`;
    console.error("[jabari-chat] Groq error:", errMsg);
    throw new Error(errMsg);
  }

  return data?.choices?.[0]?.message?.content?.trim() ?? "";
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const authHeader = req.headers.get("Authorization");
  if (!authHeader) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const supabaseClient = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_ANON_KEY") ?? "",
    { global: { headers: { Authorization: authHeader } } }
  );

  const { data: { user }, error: userError } = await supabaseClient.auth.getUser();
  if (userError || !user) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  // Fetch caller's profile role
  const { data: profile, error: profileError } = await supabaseClient
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profileError || !profile) {
    return new Response(JSON.stringify({ error: "Profile not found" }), {
      status: 403,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  // Per-user rate limit: 2-second cooldown between messages
  const { data: lastMsg } = await supabaseClient
    .from("ai_conversations")
    .select("updated_at")
    .eq("user_id", user.id)
    .maybeSingle();

  if (lastMsg?.updated_at) {
    const elapsed = Date.now() - new Date(lastMsg.updated_at).getTime();
    if (elapsed < 2000) {
      return new Response(JSON.stringify({ error: "TOO_FAST" }), {
        status: 429,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
  }

  try {
    const body = await req.json();
    const { action } = body;

    // ── Chat ────────────────────────────────────────────────────────────────
    if (action === "chat") {
      const { message, preparedHistory } = body as {
        message: string;
        preparedHistory: GeminiMessage[];
      };

      if (typeof message !== "string" || !Array.isArray(preparedHistory)) {
        return new Response(JSON.stringify({ error: "Invalid chat payload" }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const { data: profile } = user
        ? await supabaseClient
            .from("profiles")
            .select("age_bracket")
            .eq("id", user.id)
            .maybeSingle()
        : { data: null };

      const safeguarding = detectBlockingSafeguarding(message, profile?.age_bracket ?? "");
      if (safeguarding.triggered && safeguarding.category) {
        if (user) {
          const { error: flagError } = await supabaseClient
            .from("safeguarding_flags")
            .insert({
              user_id: user.id,
              category: safeguarding.category,
              message: REDACTED_SAFEGUARDING_MESSAGE,
              source: "jabari-chat-edge",
              status: "pending",
            });

          if (flagError) {
            console.error("[jabari-chat] Failed to record safeguarding flag:", flagError.message);
          }
        }

        return new Response(JSON.stringify({
          text: safeguarding.responseText,
          safeguarding: { blocked: true, category: safeguarding.category },
        }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const { system, contents } = splitSystemPrompt(preparedHistory);
      const text = await groqGenerate(system, contents, message);

      return new Response(JSON.stringify({ text }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // ── Mentor Briefing ─────────────────────────────────────────────────────
    if (action === "mentor-briefing") {
      if (!["mentor", "admin"].includes(profile.role)) {
        return new Response(JSON.stringify({ error: "Forbidden" }), {
          status: 403,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const { studentName, activityData } = body as {
        studentName: string;
        activityData: string;
      };

      const system = `You are a Mentor's Assistant at Youth Educated.
Provide a concise, professional briefing for a human mentor about their student.
Keep the entire summary under 60 words with exactly 3 bullet points.
Focus on: Recent Mood Trends, Key Topics discussed with AI, and Progress towards Goals.`;

      const text = await groqGenerate(system, [], `Student: ${studentName}\n\nData:\n${activityData}`);

      return new Response(JSON.stringify({ text }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // ── Check-in Summary ────────────────────────────────────────────────────
    if (action === "checkin-summary") {
      if (!["mentor", "admin", "dsl"].includes(profile.role)) {
        return new Response(JSON.stringify({ error: "Forbidden" }), {
          status: 403,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const { history } = body as {
        history: GeminiMessage[];
      };

      if (!Array.isArray(history) || history.length < 3) {
        return new Response(JSON.stringify({ text: null }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const system = "You analyse youth mentoring conversations and return structured summaries.";
      const text = await groqGenerate(
        system,
        history,
        "Give a 1-sentence summary, list which goals came up, and rate the mood as positive, neutral, or concerning. Format exactly as: SUMMARY: ... | GOALS: ... | MOOD: ..."
      );

      return new Response(JSON.stringify({ text }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ error: "Unknown action" }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("[jabari-chat] ERROR:", message);

    if (message.includes("429") || message.includes("rate_limit") || message.includes("Too Many Requests")) {
      return new Response(JSON.stringify({ error: "TOO_FAST" }), {
        status: 429,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
