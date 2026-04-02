import { Platform } from 'react-native';
import { API_URL, SOCKET_URL, RAZORPAY_KEY_ID } from '@env';

// Fallback host — update per platform if they ever differ
const DEFAULT_HOST = Platform.select({
  android: 'http://192.168.2.221:5000',
  ios: 'http://192.168.2.221:5000',  // use localhost on iOS simulator
  default: 'http://192.168.2.221:5000',
});

export const AppConfig = {
  API_URL: API_URL || `${DEFAULT_HOST}/api`,
  SOCKET_URL: SOCKET_URL || DEFAULT_HOST!,
  RAZORPAY_KEY: RAZORPAY_KEY_ID || 'rzp_test_XXXXXXXXXXXX',
};

if (__DEV__) {
  console.log('[AppConfig]', AppConfig);
}

export default AppConfig;

