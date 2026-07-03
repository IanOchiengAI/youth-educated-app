import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'org.youtheducated.app',
  appName: 'Youth Educated',
  webDir: 'dist',
  server: { androidScheme: 'https' },
  plugins: {
    StatusBar: {
      style: 'LIGHT',
      backgroundColor: '#F5F5F5'
    },
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: '#1C1C6E',
      androidSplashResourceName: 'splash',
      showSpinner: false
    }
  }
};

export default config;
