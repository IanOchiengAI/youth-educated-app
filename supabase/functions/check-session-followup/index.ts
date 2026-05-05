import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

// This function checks for completed sessions where the student has a commitment
// and creates a nudge or notification as a follow-up.

serve(async (req) => {
  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Find sessions that were yesterday and have a student commitment
    // For simplicity, we fetch completed sessions from the last 24 hours.
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
    
    const { data: sessions, error } = await supabaseClient
      .from('mentor_sessions')
      .select('id, mentee_id, student_commitment, scheduled_at')
      .eq('status', 'completed')
      .not('student_commitment', 'is', null)
      .gte('scheduled_at', twentyFourHoursAgo)

    if (error) throw error

    // Here we could insert into a notifications table or email service
    // Example: process follow-ups for each student
    if (sessions && sessions.length > 0) {
      console.log(`Processing follow-ups for ${sessions.length} sessions...`)
      for (const session of sessions) {
        console.log(`Follow-up for mentee ${session.mentee_id} regarding commitment: "${session.student_commitment}"`)
        // In a real application, you would insert into a 'notifications' or 'messages' table,
        // or trigger an email via Resend / SendGrid.
        // e.g. await supabaseClient.from('notifications').insert({ ... })
      }
    }

    return new Response(
      JSON.stringify({ success: true, processed: sessions?.length || 0 }),
      { headers: { "Content-Type": "application/json" } }
    )
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { "Content-Type": "application/json" },
      status: 400,
    })
  }
})
