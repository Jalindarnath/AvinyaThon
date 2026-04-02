import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { SiteProvider } from "./context/SiteContext";
import { AuthProvider } from "./context/AuthContext.jsx";

createRoot(document.getElementById('root')).render(
  <AuthProvider>
    <SiteProvider>
      <App />
    </SiteProvider>
  </AuthProvider>
);