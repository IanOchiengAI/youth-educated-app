import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { JWT } from 'https://esm.sh/google-auth-library@9'

interface PushPayload {
  user_id: string;
  title: string;
  body: string;
}

const getAccessToken = async (serviceAccount: any) => {
  return new Promise<string>((resolve, reject) => {
    const jwtClient = new JWT(
      serviceAccount.client_email,
      undefined,
      serviceAccount.private_key.replace(/\\n/g, '\n'),
      ['https://www.googleapis.com/auth/cloud-platform'],
      undefined
    );
    jwtClient.authorize((err: any, tokens: any) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(tokens.access_token);
    });
  });
};

serve(async (req) => {
  try {
    const payload: PushPayload = await req.json()

    if (!payload.user_id || !payload.title || !payload.body) {
      return new Response(JSON.stringify({ error: 'Missing parameters' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')

    if (!supabaseUrl || !supabaseKey) {
      throw new Error("Missing Supabase Variables")
    }

    const supabase = createClient(supabaseUrl, supabaseKey)

    // Lookup FCM Token
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('push_token')
      .eq('id', payload.user_id)
      .single()

    if (error || !profile?.push_token) {
      return new Response(JSON.stringify({ error: 'User not found or no push token' }), {
        status: 404, // Use 200/404 based on pref, but this is a silent ignore essentially
        headers: { 'Content-Type': 'application/json' },
      })
    }

    const fcmSecret = Deno.env.get('FCM_SERVICE_ACCOUNT')
    if (!fcmSecret) {
      throw new Error("Missing FCM_SERVICE_ACCOUNT Secret")
    }

    const serviceAccount = JSON.parse(fcmSecret)
    const accessToken = await getAccessToken(serviceAccount)
    const fcmUrl = `https://fcm.googleapis.com/v1/projects/${serviceAccount.project_id}/messages:send`

    const fcmResponse = await fetch(fcmUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        message: {
          token: profile.push_token,
          notification: {
            title: payload.title,
            body: payload.body,
          },
        },
      }),
    })

    const result = await fcmResponse.json()

    return new Response(JSON.stringify({ success: true, result }), {
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
})
