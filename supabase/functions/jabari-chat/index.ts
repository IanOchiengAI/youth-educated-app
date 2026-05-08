import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from "https://esm.sh/@google/generative-ai@0.24.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY") ?? "";
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

const safetySettings = [
  { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH },
  { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
  { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
  { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
];

const model = genAI.getGenerativeModel({
  model: "gemini-2.0-flash",
  generationConfig: { maxOutputTokens: 600, temperature: 0.8 },
  safetySettings,
});

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  // Require an authorization header — anon key is accepted (dev/test)
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

  // Try to get authenticated user — null is allowed (anon / dev bypass)
  const { data: { user } } = await supabaseClient.auth.getUser();

  // Rate limit authenticated users only (2 seconds between requests)
  if (user) {
    const { data: lastMsg } = await supabaseClient
      .from('ai_conversations')
      .select('updated_at')
      .eq('user_id', user.id)
      .maybeSingle();

    if (lastMsg?.updated_at) {
      const msSinceLastMsg = Date.now() - new Date(lastMsg.updated_at).getTime();
      if (msSinceLastMsg < 2000) {
        return new Response(JSON.stringify({ error: 'TOO_FAST' }), {
          status: 429,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
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
        preparedHistory: { role: "user" | "model"; parts: { text: string }[] }[];
      };

      const chat = model.startChat({ history: preparedHistory });
      const result = await chat.sendMessage(message);
      const text = result.response.text();

      return new Response(JSON.stringify({ text }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (action === "mentor-briefing") {
      const { studentName, activityData } = body as { studentName: string; activityData: string };

      const prompt = `You are a Mentor's Assistant at 'Youth Educated'.
Your job is to provide a concise, professional briefing for a human mentor about their student, ${studentName}.

DATA PROVIDED:
${activityData}

INSTRUCTIONS:
1. Summarize the student's recent status into exactly 3 bullet points.
2. Focus on: Recent Mood Trends, Key Topics discussed with AI, and Progress towards Goals.
3. Be objective, professional, and helpful.
4. Keep the entire summary under 60 words.
5. If the data is sparse, provide the best summary possible.`;

      const result = await model.generateContent(prompt);
      const text = result.response.text();

      return new Response(JSON.stringify({ text }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (action === "checkin-summary") {
      const { history } = body as {
        history: { role: "user" | "model"; parts: { text: string }[] }[];
      };

      if (history.length < 3) {
        return new Response(JSON.stringify({ text: null }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const chat = model.startChat({ history });
      const result = await chat.sendMessage(
        "Based on our conversation, give a 1-sentence summary, list which goals came up, and rate the mood as positive, neutral, or concerning. Format exactly as: SUMMARY: ... | GOALS: ... | MOOD: ..."
      );
      const text = result.response.text();

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
    const isSafety = message.includes("SAFETY") || message.includes("HarmCategory");

    return new Response(
      JSON.stringify({ error: isSafety ? "SAFETY_BLOCK" : message }),
      {
        status: isSafety ? 200 : 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
