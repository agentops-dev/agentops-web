import { Device } from '../types/models';
import { PushNotification } from './fcm';

export async function sendApnsNotification(
  device: Device,
  notification: PushNotification,
): Promise<void> {
  if (!process.env.APNS_KEY_ID || !process.env.APNS_TEAM_ID) {
    console.warn('APNS credentials not set, skipping APNs push');
    return;
  }

  console.log('APNs push', {
    deviceId: device.id,
    title: notification.title,
    body: notification.body,
    data: notification.data ?? {},
  });
}
