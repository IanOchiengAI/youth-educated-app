import { supabase } from './supabase'

/**
 * Normalises phone to E.164 using the provided country code.
 * Strips leading zeros from the local part before prepending.
 */
export const normalizePhone = (phone: string, countryCode: string = '254'): string => {
  let cleaned = phone.replace(/\D/g, '')
  // Strip all leading zeros from local number (e.g. 0712... → 712...)
  cleaned = cleaned.replace(/^0+/, '')
  // If the user typed the full number with + prefix already stripped,
  // and it starts with the country code — accept it as-is only if the
  // remaining local part is a realistic length (7-12 digits).
  if (cleaned.startsWith(countryCode)) {
    const localPart = cleaned.slice(countryCode.length)
    if (localPart.length >= 7 && localPart.length <= 12) {
      return `+${cleaned}`
    }
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
