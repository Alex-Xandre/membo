import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App';
import { BrowserRouter, useLocation } from 'react-router-dom';
import { AuthContextProvider } from './stores/AuthContext';
import { SidebarProvider } from './components/ui/sidebar';
import { EventContextProvider } from './stores/EventContext';
import { useEffect } from 'react';
import useBaseNameStore from './stores/useThemeAndRoute';

const container = document.getElementById('root');
if (!container) throw new Error('Error');
const root = createRoot(container);

const apiBase = import.meta.env.VITE_API_URL as string;

const FetchBaseName = () => {
  const location = useLocation(); // Now safe to use
  const setBaseName = useBaseNameStore((state: any) => state.setBaseName);

  useEffect(() => {
    if (location.pathname !== '/') {
      fetch(`${apiBase}/api/auth/base-url${location.pathname}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.accountId) {
            setBaseName(data);
          }
        })
        .catch((error) => console.error('Error fetching base URL:', error));
    }
  }, [setBaseName, location.pathname]);

  return null; 
};

const Main = () => (
  <BrowserRouter>
    <FetchBaseName /> {/* Now inside BrowserRouter */}
    <AuthContextProvider>
      <EventContextProvider>
        <SidebarProvider>
          <App />
        </SidebarProvider>
      </EventContextProvider>
    </AuthContextProvider>
  </BrowserRouter>
);

root.render(<Main />);
