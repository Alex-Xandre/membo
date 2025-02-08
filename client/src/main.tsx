import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import { AuthContextProvider } from './stores/AuthContext';
import { SidebarProvider } from './components/ui/sidebar';
import { EventContextProvider } from './stores/EventContext';

createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <AuthContextProvider>
      <EventContextProvider>
        <SidebarProvider>
          <App />
        </SidebarProvider>
      </EventContextProvider>
    </AuthContextProvider>
  </BrowserRouter>
);
