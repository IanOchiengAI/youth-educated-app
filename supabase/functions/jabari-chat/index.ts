import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const GROQ_API_KEY = Deno.env.get("GROQ_API_KEY") ?? "";
const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";
const MODEL = "llama-3.3-70b-versatile";

console.log("[jabari-chat] GROQ_API_KEY set:", GROQ_API_KEY.length > 0);

// Convert Gemini-style history to OpenAI-style messages.
// preparedHistory[0] is the system prompt embedded as a fake user turn.
// preparedHistory[1] is the initial model greeting.
// preparedHistory[2+] is the real conversation.
function toOpenAIMessages(preparedHistory: { role: string; parts: { text: string }[] }[]) {
  const system = preparedHistory[0]?.parts[0]?.text ?? "";
  const messages = preparedHistory.slice(1).map((m) => ({
    role: m.role === "model" ? "assistant" : "user",
    content: m.parts[0]?.text ?? "",
  }));
  return { system, messages };
}

async function groqChat(
  system: string,
  messages: { role: string; content: string }[],
  userMessage: string
): Promise<string> {
  const body = {
    model: MODEL,
    max_tokens: 600,
    temperature: 0.8,
    messages: [
      { role: "system", content: system },
      ...messages,
      { role: "user", content: userMessage },
    ],
  };

  const res = await fetch(GROQ_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${GROQ_API_KEY}`,
    },
    body: JSON.stringify(body),
  });

  const data = await res.json();

  if (!res.ok) {
    const errMsg = data?.error?.message ?? `Groq HTTP ${res.status}`;
    console.error("[jabari-chat] Groq error:", errMsg);
    throw new Error(errMsg);
  }

  return data.choices?.[0]?.message?.content ?? "";
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
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

  const { data: { user } } = await supabaseClient.auth.getUser();

  // Rate-limit authenticated users: 2 s between messages
  if (user) {
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
  }

  try {
    const body = await req.json();
    const { action } = body;

    // ── Chat ──────────────────────────────────────────────────
    if (action === "chat") {
      const { message, preparedHistory } = body as {
        message: string;
        preparedHistory: { role: string; parts: { text: string }[] }[];
      };

      console.log("[jabari-chat] chat | message length:", message?.length);
      const { system, messages } = toOpenAIMessages(preparedHistory);
      const text = await groqChat(system, messages, message);
      console.log("[jabari-chat] success | response length:", text.length);

      return new Response(JSON.stringify({ text }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // ── Mentor briefing ───────────────────────────────────────
    if (action === "mentor-briefing") {
      const { studentName, activityData } = body as {
        studentName: string;
        activityData: string;
      };

      const system = `You are a Mentor's Assistant at 'Youth Educated'.
Provide a concise, professional briefing for a human mentor about their student.
Keep the entire summary under 60 words with exactly 3 bullet points.
Focus on: Recent Mood Trends, Key Topics discussed with AI, and Progress towards Goals.`;

      const text = await groqChat(system, [], `Student: ${studentName}\n\nData:\n${activityData}`);

      return new Response(JSON.stringify({ text }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // ── Check-in summary ──────────────────────────────────────
    if (action === "checkin-summary") {
      const { history } = body as {
        history: { role: string; parts: { text: string }[] }[];
      };

      if (history.length < 3) {
        return new Response(JSON.stringify({ text: null }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const system = "You analyse youth mentoring conversations and return structured summaries.";
      const messages = history.map((m) => ({
        role: m.role === "model" ? "assistant" : "user",
        content: m.parts[0]?.text ?? "",
      }));

      const text = await groqChat(
        system,
        messages,
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

    // Rate-limit passthrough
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
