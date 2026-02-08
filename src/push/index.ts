import { Device } from '../types/models';
import { sendApnsNotification } from './apns';
import { PushNotification, sendFcmNotification } from './fcm';

export async function sendPushNotification(
  device: Device,
  notification: PushNotification,
): Promise<void> {
  if (device.platform === 'ios') {
    await sendApnsNotification(device, notification);
    return;
  }

  await sendFcmNotification(device, notification);
}
