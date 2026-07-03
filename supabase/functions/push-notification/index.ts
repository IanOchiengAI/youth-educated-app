import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { JWT } from 'https://esm.sh/google-auth-library@9'

interface PushPayload {
  user_id: string
  title: string
  body: string
}

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const getAccessToken = async (serviceAccount: any) => {
  return new Promise<string>((resolve, reject) => {
    const jwtClient = new JWT(
      serviceAccount.client_email,
      undefined,
      serviceAccount.private_key.replace(/\\n/g, '\n'),
      ['https://www.googleapis.com/auth/cloud-platform'],
      undefined
    )
    jwtClient.authorize((err: any, tokens: any) => {
      if (err) {
        reject(err)
        return
      }
      resolve(tokens.access_token)
    })
  })
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    if (req.method !== 'POST') {
      return new Response(JSON.stringify({ error: 'Method not allowed' }), {
        status: 405,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')

    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Missing Supabase variables')
    }

    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const token = authHeader.replace(/^Bearer\s+/, '')
    const isServiceRole = token === supabaseKey

    if (!isServiceRole) {
      const callerClient = createClient(
        supabaseUrl,
        Deno.env.get('SUPABASE_ANON_KEY') ?? '',
        { global: { headers: { Authorization: authHeader } } }
      )
      const { data: { user }, error: userError } = await callerClient.auth.getUser()
      if (userError || !user) {
        return new Response(JSON.stringify({ error: 'Unauthorized' }), {
          status: 401,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })
      }

      const adminClient = createClient(supabaseUrl, supabaseKey)
      const { data: callerProfile, error: callerError } = await adminClient
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()

      if (callerError || !['admin', 'dsl'].includes(callerProfile?.role)) {
        return new Response(JSON.stringify({ error: 'Forbidden' }), {
          status: 403,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })
      }
    }

    const payload: PushPayload = await req.json()
    if (!payload.user_id || !payload.title || !payload.body) {
      return new Response(JSON.stringify({ error: 'Missing parameters' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    if (payload.title.length > 120 || payload.body.length > 500) {
      return new Response(JSON.stringify({ error: 'Message too long' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const { data: profile, error } = await adminClient
      .from('profiles')
      .select('push_token')
      .eq('id', payload.user_id)
      .single()

    if (error || !profile?.push_token) {
      return new Response(JSON.stringify({ error: 'User not found or no push token' }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const fcmSecret = Deno.env.get('FCM_SERVICE_ACCOUNT')
    if (!fcmSecret) {
      throw new Error('Missing FCM_SERVICE_ACCOUNT secret')
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
    if (!fcmResponse.ok) {
      return new Response(JSON.stringify({ error: 'FCM send failed' }), {
        status: fcmResponse.status,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    return new Response(JSON.stringify({ success: true, result }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
