import { useIsAuthenticated, useMsal } from '@azure/msal-react';
import { AccountInfo, InteractionStatus } from '@azure/msal-browser';
import { loginRequest, msalInstance } from './msalConfig';

// Re-export so main.tsx has a single import point
export { msalInstance };

export interface AuthUser {
  id: string;       // Entra object ID (oid claim)
  name: string;     // display name
  email: string;    // UPN / preferred_username
  account: AccountInfo;
}

export function useAuth(): {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: () => Promise<void>;
  logout: () => void;
} {
  const { instance, inProgress, accounts } = useMsal();
  const isAuthenticated = useIsAuthenticated();

  const isLoading = inProgress !== InteractionStatus.None;

  const account = accounts[0] ?? null;

  const user: AuthUser | null = account
    ? {
        id: (account.idTokenClaims?.oid as string | undefined) ?? account.homeAccountId,
        name: account.name ?? account.username,
        email: account.username,
        account,
      }
    : null;

  const login = async () => {
    try {
      await instance.loginPopup(loginRequest);
    } catch (err) {
      console.warn('[Auth] login cancelled or failed', err);
    }
  };

  const logout = () => {
    instance.logoutPopup({
      account: account ?? undefined,
      postLogoutRedirectUri: window.location.origin,
    });
  };

  return { user, isAuthenticated, isLoading, login, logout };
}

// Initialise MSAL once before the app mounts.
// If running inside the popup (window.opener exists), handleRedirectPromise()
// will post the token to the opener and close this window automatically.
export async function initializeMsal() {
  await msalInstance.initialize();
  await msalInstance.handleRedirectPromise();
}
