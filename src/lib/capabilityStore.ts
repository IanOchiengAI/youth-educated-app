import type { DeviceCapabilityInfo } from './androidCapabilities';

let _capabilities: DeviceCapabilityInfo | null = null;

export function setDeviceCapabilities(info: DeviceCapabilityInfo) {
  _capabilities = info;
}

export function getDeviceCapabilities(): DeviceCapabilityInfo | null {
  return _capabilities;
}
