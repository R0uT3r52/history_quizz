import { createHash } from 'crypto';

export function validateTelegramWebAppData(initData: string, botToken: string) {
  // Parse the init data
  const urlParams = new URLSearchParams(initData);
  const hash = urlParams.get('hash');
  urlParams.delete('hash');

  // Sort params alphabetically
  const sortedParams = Array.from(urlParams.entries())
    .sort(([a], [b]) => a.localeCompare(b));
  
  // Create data check string
  const dataCheckString = sortedParams
    .map(([key, value]) => `${key}=${value}`)
    .join('\n');

  // Create secret key
  const secretKey = createHash('sha256')
    .update(botToken)
    .digest();

  // Calculate hash
  const calculatedHash = createHash('hmac-sha256')
    .update(dataCheckString)
    .update(secretKey)
    .digest('hex');

  return calculatedHash === hash;
} 