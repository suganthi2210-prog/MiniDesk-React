// Auth helpers for the React app.
// These utilities keep the login flow simple and make it easy to swap between
// a local username/password login and a proper OAuth/OIDC flow.

import api from "./api";

const TOKEN_STORAGE_KEY = "token";
const USER_STORAGE_KEY = "username";

export function getStoredToken() {
    return localStorage.getItem(TOKEN_STORAGE_KEY);
}

export function persistAuth(token, user) {
    localStorage.setItem(TOKEN_STORAGE_KEY, token);

    if (user?.name) {
        localStorage.setItem(USER_STORAGE_KEY, user.name);
    }
}

export function clearAuthState() {
    localStorage.removeItem(TOKEN_STORAGE_KEY);
    localStorage.removeItem(USER_STORAGE_KEY);
}

export async function startOAuthLogin() {
    // In production this should point to the OAuth provider configured for your app.
    const authorizationUrl = import.meta.env.VITE_OAUTH_AUTHORIZATION_URL || "";
    const clientId = import.meta.env.VITE_OAUTH_CLIENT_ID || "";
    // Amplify uses this exact callback URL after the user signs in with the identity provider.
    const redirectUri = import.meta.env.VITE_OAUTH_REDIRECT_URI || `${window.location.origin}/oauth/callback`;
    const scope = import.meta.env.VITE_OAUTH_SCOPE || "openid profile email";

    if (!authorizationUrl || !clientId) {
        throw new Error("OAuth is not configured yet. Set VITE_OAUTH_AUTHORIZATION_URL and VITE_OAUTH_CLIENT_ID in your Vite environment.");
    }

    // The browser is redirected to the identity provider with PKCE parameters.
    // Your backend should expose the authorization endpoint and accept the code exchange.
    const state = crypto.randomUUID();
    const codeVerifier = crypto.randomUUID().replace(/-/g, "");
    const codeChallenge = btoa(codeVerifier).replace(/=+$/g, "").replace(/\+/g, "-").replace(/\//g, "_");

    sessionStorage.setItem("oauth_state", state);
    sessionStorage.setItem("oauth_code_verifier", codeVerifier);

    const authorizeUrl = new URL(authorizationUrl);
    authorizeUrl.searchParams.set("response_type", "code");
    authorizeUrl.searchParams.set("client_id", clientId);
    authorizeUrl.searchParams.set("redirect_uri", redirectUri);
    authorizeUrl.searchParams.set("scope", scope);
    authorizeUrl.searchParams.set("state", state);
    authorizeUrl.searchParams.set("code_challenge", codeChallenge);
    authorizeUrl.searchParams.set("code_challenge_method", "S256");

    window.location.assign(authorizeUrl.toString());
}

export async function finishOAuthLogin(callbackUrl) {
    const params = new URL(callbackUrl).searchParams;
    const code = params.get("code");
    const state = params.get("state");

    const expectedState = sessionStorage.getItem("oauth_state");
    const codeVerifier = sessionStorage.getItem("oauth_code_verifier");

    if (!code || !state || state !== expectedState) {
        throw new Error("OAuth callback was invalid or expired.");
    }

    const redirectUri = import.meta.env.VITE_OAUTH_REDIRECT_URI || `${window.location.origin}/oauth/callback`;

    // The browser sends the authorization code to the backend so the backend can
    // exchange it securely with the identity provider and return a JWT.
    const response = await api.post("Auth/oauth/callback", {
        code,
        state,
        redirectUri,
        codeVerifier
    });

    const payload = response.data || {};
    const accessToken = payload.token || payload.accessToken || payload.access_token;

    if (!accessToken) {
        throw new Error("OAuth response did not contain a token.");
    }

    persistAuth(accessToken, { name: payload.username || payload.name || "OAuth User" });
    sessionStorage.removeItem("oauth_state");
    sessionStorage.removeItem("oauth_code_verifier");

    return accessToken;
}
