export const officialAPIEndpoint = 'https://gateway.ai.cloudflare.com/v1/c78a0cc169ce862c120e873509f4150c/aigateway/openai/chat/completions';
export const officialAPIEndpoin1 = 'https://api.openai.com/v1/chat/completions';
const customAPIEndpoint =
  import.meta.env.VITE_CUSTOM_API_ENDPOINT || 'https://chatgpt-api.shn.hk/v1/';
export const defaultAPIEndpoint =
  import.meta.env.VITE_DEFAULT_API_ENDPOINT || officialAPIEndpoint;

export const availableEndpoints = [officialAPIEndpoint, customAPIEndpoint, officialAPIEndpoin1];
