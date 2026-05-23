import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const MODEL = "gemini-2.0-flash";
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`;

type GeminiMessage = {
  role: "user" | "model";
  parts: { text: string }[];
};

function splitSystemPrompt(preparedHistory: GeminiMessage[]) {
  const system = preparedHistory[0]?.parts[0]?.text ?? "";
  const contents = preparedHistory.slice(1);
  return { system, contents };
}

async function geminiGenerate(system: string, contents: GeminiMessage[]): Promise<string> {
  const apiKey = Deno.env.get("GEMINI_API_KEY");
  if (!apiKey) throw new Error("GEMINI_API_KEY is not configured");

  const res = await fetch(`${GEMINI_URL}?key=${apiKey}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      systemInstruction: {
        parts: [{ text: system }],
      },
      contents,
      generationConfig: {
        maxOutputTokens: 600,
        temperature: 0.8,
      },
      safetySettings: [
        { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_ONLY_HIGH" },
        { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
        { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
        { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
      ],
    }),
  });

  const data = await res.json();
  if (!res.ok) {
    const errMsg = data?.error?.message ?? `Gemini HTTP ${res.status}`;
    console.error("[jabari-chat] Gemini error:", errMsg);
    throw new Error(errMsg);
  }

  const finishReason = data?.candidates?.[0]?.finishReason;
  if (finishReason === "SAFETY") {
    throw new Error("SAFETY_BLOCK");
  }

  return data?.candidates?.[0]?.content?.parts
    ?.map((part: { text?: string }) => part.text ?? "")
    .join("")
    .trim() ?? "";
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

  const { data: { user } } = await supabaseClient.auth.getUser();

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

      const { system, contents } = splitSystemPrompt(preparedHistory);
      const text = await geminiGenerate(system, [
        ...contents,
        { role: "user", parts: [{ text: message }] },
      ]);

      return new Response(JSON.stringify({ text }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (action === "mentor-briefing") {
      const { studentName, activityData } = body as {
        studentName: string;
        activityData: string;
      };

      const system = `You are a Mentor's Assistant at Youth Educated.
Provide a concise, professional briefing for a human mentor about their student.
Keep the entire summary under 60 words with exactly 3 bullet points.
Focus on: Recent Mood Trends, Key Topics discussed with AI, and Progress towards Goals.`;

      const text = await geminiGenerate(system, [
        { role: "user", parts: [{ text: `Student: ${studentName}\n\nData:\n${activityData}` }] },
      ]);

      return new Response(JSON.stringify({ text }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (action === "checkin-summary") {
      const { history } = body as {
        history: GeminiMessage[];
      };

      if (!Array.isArray(history) || history.length < 3) {
        return new Response(JSON.stringify({ text: null }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const system = "You analyse youth mentoring conversations and return structured summaries.";
      const text = await geminiGenerate(system, [
        ...history,
        {
          role: "user",
          parts: [{
            text: "Give a 1-sentence summary, list which goals came up, and rate the mood as positive, neutral, or concerning. Format exactly as: SUMMARY: ... | GOALS: ... | MOOD: ...",
          }],
        },
      ]);

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

    if (message === "SAFETY_BLOCK") {
      return new Response(JSON.stringify({ error: "SAFETY_BLOCK" }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
