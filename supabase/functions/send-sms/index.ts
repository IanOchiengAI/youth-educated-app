import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

// Custom SMS hook — routes Supabase OTP through Africa's Talking
// Deploy: npx supabase functions deploy send-sms --no-verify-jwt
// Set secrets:
//   npx supabase secrets set AT_USERNAME=your_username
//   npx supabase secrets set AT_API_KEY=your_api_key
//   npx supabase secrets set AT_SENDER_ID=YthEdu  (optional, max 11 chars)

serve(async (req) => {
  try {
    const authHeader = req.headers.get("Authorization");
    const hookSecret = Deno.env.get("SMS_HOOK_SECRET");
    if (hookSecret && authHeader !== `Bearer ${hookSecret}`) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    const { phone, otp } = await req.json();

    if (!phone || !otp) {
      return new Response(JSON.stringify({ error: "Missing phone or otp" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const username  = Deno.env.get("AT_USERNAME");
    const apiKey    = Deno.env.get("AT_API_KEY");
    const senderId  = Deno.env.get("AT_SENDER_ID") || "";

    if (!username || !apiKey) {
      throw new Error("AT_USERNAME or AT_API_KEY not configured");
    }

    const message = `Your Youth Educated verification code is: ${otp}. Valid for 10 minutes. Do not share this code.`;

    const body = new URLSearchParams({
      username,
      to: phone,
      message,
      ...(senderId ? { from: senderId } : {}),
    });

    const res = await fetch("https://api.africastalking.com/version1/messaging", {
      method: "POST",
      headers: {
        "apiKey": apiKey,
        "Content-Type": "application/x-www-form-urlencoded",
        "Accept": "application/json",
      },
      body: body.toString(),
    });

    const data = await res.json();
    console.log("[send-sms] AT response:", JSON.stringify(data));

    const status = data?.SMSMessageData?.Recipients?.[0]?.status;
    if (status && status !== "Success") {
      throw new Error(`Africa's Talking error: ${status}`);
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { "Content-Type": "application/json" },
    });

  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("[send-sms] ERROR:", message);
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
});
