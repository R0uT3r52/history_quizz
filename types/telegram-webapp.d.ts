interface TelegramWebApps {
  WebApp: {
    initData: string;
    initDataUnsafe: {
      query_id?: string;
      user?: {
        id: number;
        first_name: string;
        last_name?: string;
        username?: string;
        language_code?: string;
      };
      auth_date: string;
      hash: string;
    };
    ready(): void;
    expand(): void;
    close(): void;
    MainButton: {
      text: string;
      color: string;
      textColor: string;
      isVisible: boolean;
      isActive: boolean;
      show(): void;
      hide(): void;
      enable(): void;
      disable(): void;
      onClick(callback: () => void): void;
      offClick(callback: () => void): void;
    };
  };
}

interface Window {
  Telegram?: TelegramWebApps;
} 