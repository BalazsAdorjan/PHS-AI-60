/// <reference types="vite/client" />
import { Configuration, PublicClientApplication, LogLevel } from '@azure/msal-browser';

const clientId = import.meta.env.VITE_ENTRA_CLIENT_ID as string;
const tenantId = import.meta.env.VITE_ENTRA_TENANT_ID as string;

if (!clientId || clientId === 'your-client-id-here') {
  console.warn(
    '[MSAL] VITE_ENTRA_CLIENT_ID is not set. ' +
    'Copy .env.example to .env and fill in your Azure App Registration values.'
  );
}

export const msalConfig: Configuration = {
  auth: {
    clientId,
    authority: `https://login.microsoftonline.com/${tenantId}`,
    // Popup lands on /blank.html which is its own Vite entry point bundled
    // with msal-browser. It calls handleRedirectPromise(), posts the token
    // back to the main window, and closes itself.
    redirectUri: `${window.location.origin}/blank.html`,
    postLogoutRedirectUri: window.location.origin,
  },
  cache: {
    cacheLocation: 'sessionStorage',
  },
  system: {
    loggerOptions: {
      loggerCallback: (level, message, containsPii) => {
        if (containsPii) return;
        if (level === LogLevel.Error) console.error('[MSAL]', message);
        else if (level === LogLevel.Warning) console.warn('[MSAL]', message);
      },
      logLevel: LogLevel.Warning,
    },
  },
};

// Scopes requested at login — openid + profile gives us name & email
export const loginRequest = {
  scopes: ['openid', 'profile', 'email', 'User.Read'],
};

export const msalInstance = new PublicClientApplication(msalConfig);
