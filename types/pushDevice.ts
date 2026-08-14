// MVP는 ANDROID만 지원한다.
export type PushDevicePlatform = 'ANDROID';

// PUT /api/push-devices 요청 바디
export interface PushDeviceRegisterRequestDto {
  token: string;
  platform: PushDevicePlatform;
}

// PUT /api/push-devices 응답 data
export interface PushDeviceRegisterResponseDto {
  deviceId: number;
  platform: PushDevicePlatform;
  pushEnabled: boolean;
}
