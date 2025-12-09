export const generateToken = (payload: any): string => {

  return Buffer.from(JSON.stringify(payload)).toString('base64');
};

export const verifyToken = (token: string): any => {
  try {
    return JSON.parse(Buffer.from(token, 'base64').toString());
  } catch (error) {
    throw new Error('Token inválido');
  }
};
