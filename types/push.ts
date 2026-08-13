export type PushPlatform = 'WEB';

// PUT /api/push-devices, DELETE /api/push-devices/{deviceId} 응답
export interface PushDeviceDto {
  deviceId: number;
  platform: PushPlatform;
  pushEnabled: boolean;
}

// GET/PATCH /api/notification-settings 응답
export interface NotificationSettingsDto {
  pushEnabled: boolean;
}
