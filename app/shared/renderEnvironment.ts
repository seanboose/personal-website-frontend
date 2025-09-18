export const getIsClient = () => {
  return typeof window !== 'undefined';
};

export const getIsServer = () => !getIsClient();
