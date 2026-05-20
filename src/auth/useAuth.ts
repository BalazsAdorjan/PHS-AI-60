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
  login: () => void;
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

  // Full-page redirect — works with just the plain origin as redirect URI.
  // No popup, no blank.html, no extra portal configuration needed.
  const login = () => {
    instance.loginRedirect(loginRequest);
  };

  const logout = () => {
    instance.logoutRedirect({
      account: account ?? undefined,
      postLogoutRedirectUri: window.location.origin,
    });
  };

  return { user, isAuthenticated, isLoading, login, logout };
}

// Called once before the app mounts.
// handleRedirectPromise() processes the auth code on the way back from Entra
// and stores the account — must complete before rendering.
export async function initializeMsal() {
  await msalInstance.initialize();
  await msalInstance.handleRedirectPromise();
}
