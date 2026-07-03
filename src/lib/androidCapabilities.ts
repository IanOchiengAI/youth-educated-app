import { registerPlugin } from '@capacitor/core';

export interface DeviceCapabilityInfo {
  memoryClassMB: number;
  largeMemoryClassMB: number;
  androidSdkVersion: number;
  freeStorageBytes: number;
  isAICoreAvailable: boolean;
}

export interface DeviceCapabilityPlugin {
  getCapabilities(): Promise<DeviceCapabilityInfo>;
}

const DeviceCapability = registerPlugin<DeviceCapabilityPlugin>('DeviceCapability', {
  // Web fallback — returns conservative defaults so the web build never breaks
  web: {
    getCapabilities: async (): Promise<DeviceCapabilityInfo> => ({
      memoryClassMB: 0,
      largeMemoryClassMB: 0,
      androidSdkVersion: 0,
      freeStorageBytes: 0,
      isAICoreAvailable: false,
    }),
  },
});

export { DeviceCapability };

// Helper: is this device capable enough for any on-device AI?
export function isDeviceAICapable(info: DeviceCapabilityInfo): boolean {
  return (
    info.androidSdkVersion >= 31 &&       // Android 12+
    info.memoryClassMB >= 192 &&           // at least 192 MB memory class
    info.freeStorageBytes >= 2_000_000_000 // at least 2 GB free storage
  );
}

// Helper: is AICore (Gemini Nano) specifically available?
export function isAICoreCapable(info: DeviceCapabilityInfo): boolean {
  return info.isAICoreAvailable && info.androidSdkVersion >= 34;
}
