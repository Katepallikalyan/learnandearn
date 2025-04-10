
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Log Telegram web app detection
if (window.Telegram) {
  console.log("✅ Telegram WebApp detected", window.Telegram.WebApp);
} else {
  console.log("❌ Telegram WebApp not detected. Running in browser mode.");
}

createRoot(document.getElementById("root")!).render(<App />);
