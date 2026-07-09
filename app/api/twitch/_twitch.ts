type TwitchTokenResponse = {
  access_token?: string;
  expires_in?: number;
};

export const noStoreHeaders = {
  "Cache-Control": "no-store"
};

let appTokenCache: {
  accessToken: string;
  expiresAt: number;
} | null = null;

export async function getAppAccessToken(clientId: string, clientSecret: string) {
  const now = Date.now();

  if (appTokenCache && appTokenCache.expiresAt > now + 60_000) {
    return appTokenCache.accessToken;
  }

  const tokenResponse = await fetch("https://id.twitch.tv/oauth2/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body: new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      grant_type: "client_credentials"
    }),
    cache: "no-store"
  });

  if (!tokenResponse.ok) {
    throw new Error("Twitch token request failed.");
  }

  const tokenPayload = (await tokenResponse.json()) as TwitchTokenResponse;

  if (!tokenPayload.access_token) {
    throw new Error("Twitch token response did not include an access token.");
  }

  appTokenCache = {
    accessToken: tokenPayload.access_token,
    expiresAt: now + Math.max((tokenPayload.expires_in ?? 3600) - 60, 60) * 1000
  };

  return appTokenCache.accessToken;
}
