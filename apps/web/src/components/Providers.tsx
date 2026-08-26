'use client';

import { GoogleOAuthProvider } from '@react-oauth/google';
import { ThemeProvider } from 'next-themes';

export function Providers({ children }: { children: React.ReactNode }) {
  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '';
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
      <GoogleOAuthProvider clientId={clientId}>
        {children}
      </GoogleOAuthProvider>
    </ThemeProvider>
  );
}
