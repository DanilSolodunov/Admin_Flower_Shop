const ACCESS_TOKEN_KEY = "accessToken";
const REFRESH_TOKEN_KEY = "refreshToken";
const TOKEN_TIMESTAMP_KEY = "tokenTimestamp";

export const getAccessToken = (): string | null => {
  return localStorage.getItem(ACCESS_TOKEN_KEY);
};

export const getRefreshToken = (): string | null => {
  return localStorage.getItem(REFRESH_TOKEN_KEY);
};

export const saveTokens = (accessToken: string, refreshToken: string): void => {
  localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
  localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
  localStorage.setItem(TOKEN_TIMESTAMP_KEY, Date.now().toString());
};

export const clearTokens = (): void => {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
  localStorage.removeItem(TOKEN_TIMESTAMP_KEY);
};

export const getTokenTimestamp = (): number | null => {
  const timestamp = localStorage.getItem(TOKEN_TIMESTAMP_KEY);
  return timestamp ? parseInt(timestamp, 10) : null;
};

export const isTokenExpired = (maxAgeMinutes: number = 15): boolean => {
  const timestamp = getTokenTimestamp();
  if (!timestamp) return true;
  
  const now = Date.now();
  const age = now - timestamp;
  const maxAge = maxAgeMinutes * 60 * 1000;
  
  return age >= maxAge;
};

export const hasTokens = (): boolean => {
  return !!(getAccessToken() && getRefreshToken());
};
