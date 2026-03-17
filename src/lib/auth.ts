import { supabase } from './supabase'

/**
 * Normalises phone to E.164: strip leading 0, prepend +254
 */
export const normalizePhone = (phone: string): string => {
  let cleaned = phone.replace(/\D/g, '')
  if (cleaned.startsWith('0')) {
    cleaned = '254' + cleaned.substring(1)
  } else if (!cleaned.startsWith('254')) {
    cleaned = '254' + cleaned
  }
  return `+${cleaned}`
}

export const sendOTP = async (phone: string) => {
  const normalized = normalizePhone(phone)
  const { data, error } = await supabase.auth.signInWithOtp({
    phone: normalized,
  })
  
  return { success: !error, error }
}

export const verifyOTP = async (phone: string, token: string) => {
  const normalized = normalizePhone(phone)
  const { data: { session }, error: verifyError } = await supabase.auth.verifyOtp({
    phone: normalized,
    token,
    type: 'sms',
  })

  if (verifyError || !session) {
    return { success: false, error: verifyError }
  }

  // Fetch profile to check onboarding status and role
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('onboarding_completed, role')
    .eq('id', session.user.id)
    .single()

  if (profileError) {
    // If profile doesn't exist yet (trigger might be slow or failed), 
    // we return success but with default values
    return { 
      success: true, 
      onboardingCompleted: false, 
      role: 'student', 
      error: profileError 
    }
  }

  return {
    success: true,
    onboardingCompleted: profile.onboarding_completed,
    role: profile.role,
    error: null
  }
}

export const signOut = async () => {
  const { error } = await supabase.auth.signOut()
  if (!error) {
    localStorage.removeItem('youth_educated_state')
    window.location.href = '/signin'
  }
  return { error }
}
