import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import { ToastProvider } from './context/ToastContext'
import { WalletProvider } from './context/WalletContext'
import { performanceTracker } from './utils/performanceTracking'
import { registerServiceWorker } from './utils/serviceWorkerUtils'

// Initialize performance tracking
if (typeof window !== 'undefined') {
  (window as any).__performanceTracker = performanceTracker;
}

// Register service worker for offline support and caching
registerServiceWorker();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ToastProvider>
      <WalletProvider>
        <App />
      </WalletProvider>
    </ToastProvider>
  </React.StrictMode>,
)
