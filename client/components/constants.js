export const CLIENT_ID = process.env.REACT_APP_CLIENT_ID;
export const CLIENT_SECRET = process.env.REACT_APP_CLIENT_SECRET;
export const AUTHORIZATION_URL = 'https://webexapis.com/v1/authorize?client_id=Ce5d2e0f83ab03c3749c92702c1a6517820953f6236198e81806749ddb0d07bec&response_type=code&redirect_uri=https%3A%2F%2Fdevice-certifier.ngrok.io&scope=spark%3Aall%20spark%3Akms&state=state';
export const GRANT_TYPE = "authorization_code";
export const REFRESH_GRANT_TYPE = "refresh_token";
export const REDIRECT_URL = "https://device-certifier.ngrok.io";
export const WEBEX_AUTH_URL = "https://webexapis.com/v1/access_token";