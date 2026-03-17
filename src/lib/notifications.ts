import { PushNotifications } from '@capacitor/push-notifications';
import { LocalNotifications } from '@capacitor/local-notifications';
import { Haptics, ImpactStyle } from '@capacitor/haptics';
import { StatusBar, Style } from '@capacitor/status-bar';
import { supabase } from './supabase'; // Assuming this exists based on previous conversations

export async function initPushNotifications() {
  // Request permissions
  let permStatus = await PushNotifications.checkPermissions();

  if (permStatus.receive === 'prompt') {
    permStatus = await PushNotifications.requestPermissions();
  }

  if (permStatus.receive !== 'granted') {
    console.warn('User denied push notification permissions');
    return;
  }

  // Register with Apple / Google
  await PushNotifications.register();

  // On success, we should be able to receive notifications
  PushNotifications.addListener('registration', async (token) => {
    console.log('Push registration success, token: ' + token.value);
    
    // Get current user and upsert token to profile
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      await supabase
        .from('profiles')
        .update({ push_token: token.value })
        .eq('id', user.id);
    }
  });

  PushNotifications.addListener('registrationError', (error) => {
    console.error('Error on registration: ' + JSON.stringify(error));
  });

  PushNotifications.addListener('pushNotificationReceived', (notification) => {
    console.log('Push received: ' + JSON.stringify(notification));
  });

  PushNotifications.addListener('pushNotificationActionPerformed', (notification) => {
    console.log('Push action performed: ' + JSON.stringify(notification));
  });
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
    await StatusBar.setStyle({ style: Style.Dark });
    await StatusBar.setBackgroundColor({ color: '#1C1C6E' });
  } catch (e) {
    console.warn('StatusBar not available on web', e);
  }
}
