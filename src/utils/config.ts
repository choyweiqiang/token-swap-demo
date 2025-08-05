export const getApiKey = () => {
  const apiKey = import.meta.env.VITE_FUN_API_KEY;

  if (!apiKey) {
    throw new Error('Missing apiKey');
  }

  return apiKey;
};
