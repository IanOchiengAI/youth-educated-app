import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'org.youtheducated.app',
  appName: 'Youth Educated',
  webDir: 'dist',
  server: { androidScheme: 'https' },
  plugins: {
    StatusBar: {
      style: 'DARK',
      backgroundColor: '#1C1C6E'
    },
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: '#1C1C6E',
      androidSplashResourceName: 'splash',
      showSpinner: false
    },
    PushNotifications: {
      presentationOptions: ['badge', 'sound', 'alert']
    }
  }
};

export default config;
