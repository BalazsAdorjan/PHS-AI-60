import { PublicClientApplication } from '@azure/msal-browser';

// This script runs inside the popup window.
// It initialises MSAL with the same config as the main app,
// calls handleRedirectPromise(), which reads the auth code from the URL,
// posts the result back to window.opener, then closes this popup.
(async () => {
  const pca = new PublicClientApplication({
    auth: {
      clientId: import.meta.env.VITE_ENTRA_CLIENT_ID as string,
      authority: `https://login.microsoftonline.com/${import.meta.env.VITE_ENTRA_TENANT_ID as string}`,
      redirectUri: `${window.location.origin}/blank.html`,
    },
    cache: { cacheLocation: 'sessionStorage' },
  });
  await pca.initialize();
  await pca.handleRedirectPromise();
  // MSAL posts the token to window.opener and closes the window automatically.
})();
