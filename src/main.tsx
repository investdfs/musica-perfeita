
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { GOOGLE_ANALYTICS_SCRIPT } from './lib/head-scripts'

// Adicionar o script do Google Analytics ao head
const injectGoogleAnalytics = () => {
  const script = document.createElement('div');
  script.innerHTML = GOOGLE_ANALYTICS_SCRIPT;
  document.head.appendChild(script);
};

// Chamar a função para injetar o script
injectGoogleAnalytics();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
