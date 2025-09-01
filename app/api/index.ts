const apiFetch = async (path: string, options: RequestInit = {}) => {
  const headers = {
    ...options.headers,
    'Content-Type': 'application/json',
    Authorization: `Bearer ${import.meta.env.VITE_API_KEY}`,
  };
  const res = await fetch(`${import.meta.env.VITE_API_URL}/api/${path}`, {
    ...options,
    headers,
  });
  if (!res.ok) {
    throw new Error(`API request failed with status ${res.status}`);
  }
  const json = await res.json();
  return json;
};

export const api = {
  images: {
    list: async () => apiFetch('images/list'),
  },
};
