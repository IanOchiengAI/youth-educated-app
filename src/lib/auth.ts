import { supabase } from './supabase'

/**
 * Normalises phone to E.164 using the provided country code.
 * Strips leading zeros from the local part before prepending.
 */
export const normalizePhone = (phone: string, countryCode: string = '254'): string => {
  let cleaned = phone.replace(/\D/g, '')
  // Already a full international number — use as-is
  if (cleaned.startsWith(countryCode) && cleaned.length > countryCode.length + 5) {
    return `+${cleaned}`
  }
  // Strip leading zero from local number
  if (cleaned.startsWith('0')) {
    cleaned = cleaned.substring(1)
  }
  return `+${countryCode}${cleaned}`
}

export const sendOTP = async (phone: string, countryCode: string = '254') => {
  const normalized = normalizePhone(phone, countryCode)
  const { data, error } = await supabase.auth.signInWithOtp({
    phone: normalized,
  })
  return { success: !error, error, normalized }
}

export const verifyOTP = async (phone: string, token: string, countryCode: string = '254') => {
  const normalized = normalizePhone(phone, countryCode)
  const { data: { session }, error: verifyError } = await supabase.auth.verifyOtp({
    phone: normalized,
    token,
    type: 'sms',
  })

  if (verifyError || !session) {
    return { success: false, error: verifyError }
  }

  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('onboarding_completed, role')
    .eq('id', session.user.id)
    .single()

  if (profileError) {
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
