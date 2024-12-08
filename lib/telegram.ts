import { createHash } from 'crypto';

export function validateTelegramWebAppData(initData: string, botToken: string) {
  // Parse init data
  const urlParams = new URLSearchParams(initData);
  const hash = urlParams.get('hash');
  urlParams.delete('hash');

  // Sort params as alphabet
  const sortedParams = Array.from(urlParams.entries())
    .sort(([a], [b]) => a.localeCompare(b));
  
  
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