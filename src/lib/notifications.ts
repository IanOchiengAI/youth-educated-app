import { LocalNotifications } from '@capacitor/local-notifications';
import { Haptics, ImpactStyle } from '@capacitor/haptics';
import { StatusBar, Style } from '@capacitor/status-bar';
import { supabase } from './supabase'; // Assuming this exists based on previous conversations

export async function initPushNotifications() {
  console.log('Push notifications are disabled (Firebase unconfigured)');
}

export async function scheduleStreakReminder(userName: string, streakCount: number) {
  // Check local notification permissions
  let permStatus = await LocalNotifications.checkPermissions();
  if (permStatus.display === 'prompt') {
    permStatus = await LocalNotifications.requestPermissions();
  }

  if (permStatus.display !== 'granted') return;

  // Schedule daily reminder at 7 PM
  await LocalNotifications.schedule({
    notifications: [
      {
        title: 'Streak Reminder 🔥',
        body: `Hey ${userName}, your streak is waiting! Open the app to keep your ${streakCount} day streak alive.`,
        id: 1,
        schedule: {
          on: {
            hour: 19,
            minute: 0
          },
          repeats: true,
          allowWhileIdle: true
        },
        actionTypeId: '',
        extra: null
      }
    ]
  });
}

export async function triggerHaptic() {
  await Haptics.impact({ style: ImpactStyle.Medium });
}

export async function setAppStatusBar() {
  try {
    await StatusBar.setOverlaysWebView({ overlay: false });
    await StatusBar.setStyle({ style: Style.Light });
    await StatusBar.setBackgroundColor({ color: '#F5F5F5' });
  } catch (e) {
    console.warn('StatusBar not available on web', e);
  }
}

export async function sendGuardianSMS(to: string, message: string) {
  console.log(`%c[SIMULATED SMS to ${to}]: "${message}"`, 'background: #222; color: #bada55; font-size: 12px; padding: 4px; border-radius: 4px;');
  try {
    const { error } = await supabase.functions.invoke('notify-guardian', {
      body: { to, message }
    });
    if (error) {
      console.warn('Supabase notify-guardian Edge Function failed (expected in dev):', error);
    }
  } catch (err) {
    // Fail silently in development/offline
  }
}

