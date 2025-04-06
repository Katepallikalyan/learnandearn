
import React, { createContext, useContext, useEffect, useState } from "react";

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
});

export const useTelegram = () => useContext(TelegramContext);

export const TelegramProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tg, setTg] = useState<TelegramWebApp | null>(null);
  const [ready, setReady] = useState(false);
  const [user, setUser] = useState<TelegramContextProps["user"]>(null);

  useEffect(() => {
    // Access Telegram WebApp API
    const webApp = window.Telegram?.WebApp;
    
    if (webApp) {
      setTg(webApp);
      webApp.ready();
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
      }
      
      // Always expand the web app for better UX
      webApp.expand();
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
    if (!tg) return;
    tg.showAlert(message);
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
      }}
    >
      {children}
    </TelegramContext.Provider>
  );
};
