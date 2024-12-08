export function getTelegramUser() {
  // For local
  if (process.env.NODE_ENV === 'development') {
    return {
      id: 12345,
      first_name: "Test",
      username: "testuser"
    };
  }

  // Telegram user data
  if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
    const user = window.Telegram.WebApp.initDataUnsafe?.user;
    return user || null;
  }
  return null;
} 