import { supabase } from './supabase';
import { Capacitor } from '@capacitor/core';
import { Browser } from '@capacitor/browser';

/**
 * Emails that are automatically promoted to the 'admin' role on first sign-in.
 * Add any new admin emails here.
 */
export const ADMIN_EMAILS: string[] = [
  'ianochiengai@gmail.com',
  'murimiwambuim@gmail.com',
  'nderitu.suzanne@gmail.com',
  'dylangathia@gmail.com',
  'sheilakamau0@gmail.com',
];

export const PACKAGE_NATIVE_OAUTH_REDIRECT_URL = 'org.youtheducated.app://login-callback';
export const LEGACY_NATIVE_OAUTH_REDIRECT_URL = 'io.youth.educated://login-callback';
export const DEFAULT_NATIVE_OAUTH_REDIRECT_URL = PACKAGE_NATIVE_OAUTH_REDIRECT_URL;

const getNativeOAuthRedirectUrl = () =>
  import.meta.env.VITE_NATIVE_OAUTH_REDIRECT_URL || DEFAULT_NATIVE_OAUTH_REDIRECT_URL;

/**
 * Normalises phone to E.164 using the provided country code.
 * Strips leading zeros from the local part before prepending.
 */
export const normalizePhone = (phone: string, countryCode: string = '254'): string => {
  let cleaned = phone.replace(/\D/g, '');
  // Strip all leading zeros from local number (e.g. 0712... → 712...)
  cleaned = cleaned.replace(/^0+/, '');
  // If the user typed the full number with + prefix already stripped,
  // and it starts with the country code — accept it as-is only if the
  // remaining local part is a realistic length (7-12 digits).
  if (cleaned.startsWith(countryCode)) {
    const localPart = cleaned.slice(countryCode.length);
    if (localPart.length >= 7 && localPart.length <= 12) {
      return `+${cleaned}`;
    }
  }
  return `+${countryCode}${cleaned}`;
};

export const sendOTP = async (phone: string, countryCode: string = '254') => {
  const normalized = normalizePhone(phone, countryCode);
  const { data, error } = await supabase.auth.signInWithOtp({
    phone: normalized,
  });
  return { success: !error, error, normalized };
};

export const verifyOTP = async (phone: string, token: string, countryCode: string = '254') => {
  const normalized = normalizePhone(phone, countryCode);
  const { data: { session }, error: verifyError } = await supabase.auth.verifyOtp({
    phone: normalized,
    token,
    type: 'sms',
  });

  if (verifyError || !session) {
    return { success: false, error: verifyError };
  }

  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('onboarding_completed, role')
    .eq('id', session.user.id)
    .maybeSingle();

  if (profileError) {
    return {
      success: true,
      onboardingCompleted: false,
      role: 'student',
      error: profileError,
    };
  }

  return {
    success: true,
    onboardingCompleted: profile?.onboarding_completed ?? false,
    role: profile?.role ?? 'student',
    error: null,
  };
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  if (!error) {
    localStorage.removeItem('youth_educated_state');
    window.location.href = '/signin';
  }
  return { error };
};

export const signInWithGoogle = async () => {
  const isNative = Capacitor.isNativePlatform();

  // On native Android: use in-app browser via @capacitor/browser so the
  // OAuth flow does not jump out to the system browser.
  if (isNative) {
    const redirectTo = getNativeOAuthRedirectUrl();
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo,
        skipBrowserRedirect: true,   // Supabase will NOT open a browser itself
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        },
      },
    });

    if (error) return { data, error };

    // Open the Google auth URL inside a Capacitor in-app browser sheet
    if (data?.url) {
      await Browser.open({ url: data.url });
    }

    return { data, error: null };
  }

  // On web: standard redirect behaviour (no change from before)
  const redirectTo = `${window.location.origin}/redirect`;
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo,
      queryParams: {
        access_type: 'offline',
        prompt: 'consent',
      },
    },
  });
  return { data, error };
};
