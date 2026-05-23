import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

serve(async (req) => {
  try {
    const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    const cronSecret = Deno.env.get('FOLLOWUP_CRON_SECRET') ?? serviceRoleKey
    const authHeader = req.headers.get('Authorization') ?? ''

    if (!serviceRoleKey) {
      throw new Error('Missing SUPABASE_SERVICE_ROLE_KEY')
    }

    if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        headers: { "Content-Type": "application/json" },
        status: 401,
      })
    }

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      serviceRoleKey
    )

    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
    
    const { data: sessions, error } = await supabaseClient
      .from('mentor_sessions')
      .select('id, mentee_id, student_commitment, scheduled_at')
      .eq('status', 'completed')
      .not('student_commitment', 'is', null)
      .gte('scheduled_at', twentyFourHoursAgo)

    if (error) throw error

    return new Response(
      JSON.stringify({ success: true, processed: sessions?.length || 0 }),
      { headers: { "Content-Type": "application/json" } }
    )
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    return new Response(JSON.stringify({ error: message }), {
      headers: { "Content-Type": "application/json" },
      status: 400,
    })
  }
})
