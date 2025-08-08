import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import ThemeProvider from './providers/ThemeProvider.tsx';
import { Analytics } from '@vercel/analytics/react';

const queryClient = new QueryClient();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <App />
        <Analytics />
      </QueryClientProvider>
    </ThemeProvider>
  </StrictMode>,
);
