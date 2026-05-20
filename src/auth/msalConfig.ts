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
    // The popup lands back on the main app. MSAL v5 detects it is running
    // inside a popup (window.opener exists), processes the auth code, posts
    // the token back to the opener, and closes itself — no blank.html needed.
    redirectUri: window.location.origin,
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
