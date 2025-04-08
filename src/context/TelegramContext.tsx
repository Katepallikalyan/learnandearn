
import React, { createContext, useContext, useEffect, useState } from "react";
import { toast } from "../hooks/use-toast";

// Define the Telegram WebApp type
declare global {
  interface Window {
    Telegram?: {
      WebApp: TelegramWebApp;
    };
  }
}

interface TelegramWebApp {
  ready: () => void;
  expand: () => void;
  close: () => void;
  showAlert: (message: string) => void;
  MainButton: {
    text: string;
    show: () => void;
    hide: () => void;
    onClick: (callback: () => void) => void;
    offClick: (callback: () => void) => void;
    enable: () => void;
    disable: () => void;
    showProgress: (leaveActive: boolean) => void;
    hideProgress: () => void;
  };
  BackButton: {
    show: () => void;
    hide: () => void;
    onClick: (callback: () => void) => void;
    offClick: (callback: () => void) => void;
  };
  initData: string;
  initDataUnsafe: {
    user?: {
      id: number;
      first_name: string;
      last_name?: string;
      username?: string;
    };
    start_param?: string;
  };
  isExpanded: boolean;
  viewportHeight: number;
  viewportStableHeight: number;
  sendData: (data: string) => void;
  openLink: (url: string) => void;
  HapticFeedback: {
    impactOccurred: (style: 'light' | 'medium' | 'heavy' | 'rigid' | 'soft') => void;
    notificationOccurred: (type: 'error' | 'success' | 'warning') => void;
    selectionChanged: () => void;
  };
}

interface TelegramContextProps {
  tg: TelegramWebApp | null;
  user: {
    id: number;
    firstName: string;
    lastName?: string;
    username?: string;
  } | null;
  ready: boolean;
  showMainButton: (text: string, callback: () => void) => void;
  hideMainButton: () => void;
  showBackButton: (callback: () => void) => void;
  hideBackButton: () => void;
  showAlert: (message: string) => void;
  closeApp: () => void;
  hapticFeedback: {
    success: () => void;
    error: () => void;
    selection: () => void;
  };
  isInsideTelegram: boolean;
  openExternalLink: (url: string) => void;
}

const TelegramContext = createContext<TelegramContextProps>({
  tg: null,
  user: null,
  ready: false,
  showMainButton: () => {},
  hideMainButton: () => {},
  showBackButton: () => {},
  hideBackButton: () => {},
  showAlert: () => {},
  closeApp: () => {},
  hapticFeedback: {
    success: () => {},
    error: () => {},
    selection: () => {},
  },
  isInsideTelegram: false,
  openExternalLink: () => {},
});

export const useTelegram = () => useContext(TelegramContext);

export const TelegramProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tg, setTg] = useState<TelegramWebApp | null>(null);
  const [ready, setReady] = useState(false);
  const [user, setUser] = useState<TelegramContextProps["user"]>(null);
  const [isInsideTelegram, setIsInsideTelegram] = useState(false);

  useEffect(() => {
    // Access Telegram WebApp API
    const webApp = window.Telegram?.WebApp;
    
    if (webApp) {
      console.log("Telegram WebApp initialized", webApp);
      setTg(webApp);
      setIsInsideTelegram(true);
      
      // Tell Telegram the WebApp is ready
      webApp.ready();
      
      // Expand the app to fit the full screen
      webApp.expand();
      setReady(true);
      
      // Extract user data if available
      if (webApp.initDataUnsafe?.user) {
        const { id, first_name, last_name, username } = webApp.initDataUnsafe.user;
        setUser({
          id,
          firstName: first_name,
          lastName: last_name,
          username,
        });
        console.log("Telegram user data loaded:", first_name);
      } else {
        // Fallback user for when running in browser but Telegram data isn't available
        console.log("Telegram user data not available. Setting fallback user.");
        setUser({
          id: 12345678,
          firstName: "Demo",
          username: "demo_user",
        });
      }
    } else {
      console.log("Telegram WebApp is not available. Running in browser mode.");
      // Mock user for development in browser
      setUser({
        id: 12345678,
        firstName: "Demo",
        username: "demo_user",
      });
      setReady(true);
    }
  }, []);

  const showMainButton = (text: string, callback: () => void) => {
    if (!tg) return;
    
    tg.MainButton.text = text;
    tg.MainButton.onClick(callback);
    tg.MainButton.show();
  };

  const hideMainButton = () => {
    if (!tg) return;
    tg.MainButton.hide();
  };

  const showBackButton = (callback: () => void) => {
    if (!tg) return;
    tg.BackButton.onClick(callback);
    tg.BackButton.show();
  };

  const hideBackButton = () => {
    if (!tg) return;
    tg.BackButton.hide();
  };

  const showAlert = (message: string) => {
    // Always use toast notifications
    toast({
      title: "Alert",
      description: message,
      duration: 3000,
    });
    
    // Try Telegram native alert as fallback but ignore errors
    if (tg) {
      try {
        tg.showAlert(message);
      } catch (error) {
        // Silently ignore errors when Telegram alert fails
        console.log("Using toast notification instead of Telegram alert");
      }
    }
  };

  const closeApp = () => {
    if (!tg) return;
    tg.close();
  };

  const openExternalLink = (url: string) => {
    if (tg) {
      // Use Telegram's openLink for external URLs
      tg.openLink(url);
    } else {
      // Fallback for browser environment
      window.open(url, '_blank');
    }
  };

  const hapticFeedback = {
    success: () => {
      if (!tg?.HapticFeedback) return;
      try {
        tg.HapticFeedback.notificationOccurred('success');
      } catch (error) {
        console.log("Haptic feedback not supported");
      }
    },
    error: () => {
      if (!tg?.HapticFeedback) return;
      try {
        tg.HapticFeedback.notificationOccurred('error');
      } catch (error) {
        console.log("Haptic feedback not supported");
      }
    },
    selection: () => {
      if (!tg?.HapticFeedback) return;
      try {
        tg.HapticFeedback.selectionChanged();
      } catch (error) {
        console.log("Haptic feedback not supported");
      }
    }
  };

  return (
    <TelegramContext.Provider
      value={{
        tg,
        user,
        ready,
        showMainButton,
        hideMainButton,
        showBackButton,
        hideBackButton,
        showAlert,
        closeApp,
        hapticFeedback,
        isInsideTelegram,
        openExternalLink,
      }}
    >
      {children}
    </TelegramContext.Provider>
  );
};
