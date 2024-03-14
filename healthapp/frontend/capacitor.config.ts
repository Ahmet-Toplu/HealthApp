import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.apps.carecompass',
  appName: 'Care Compass',
  webDir: 'build',
  bundledWebRuntime: false,
  server: {
    url: 'localhost:3000',
    cleartext: true
  }
};

export default config;
