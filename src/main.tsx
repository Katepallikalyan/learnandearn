
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

window.Telegram?.WebApp 
  ? console.log("✅ Telegram WebApp detected")
  : console.log("❌ Telegram WebApp not detected. Running in browser mode.");

createRoot(document.getElementById("root")!).render(<App />);
