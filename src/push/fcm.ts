import { Device } from '../types/models';

export interface PushNotification {
  title: string;
  body: string;
  data?: Record<string, string>;
}

export async function sendFcmNotification(
  device: Device,
  notification: PushNotification,
): Promise<void> {
  if (!process.env.FCM_SERVER_KEY) {
    console.warn('FCM_SERVER_KEY not set, skipping FCM push');
    return;
  }

  console.log('FCM push', {
    deviceId: device.id,
    title: notification.title,
    body: notification.body,
    data: notification.data ?? {},
  });
}
