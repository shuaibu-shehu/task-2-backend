import jwt from "jsonwebtoken";

export const generateToken = (user: { userId: string, email: string }) => {
    const expiresIn = '1h';
    const token = jwt.sign(user, "secret", { expiresIn });
    return token;
  };


export const verifyToken = (token: string) => {
  try {
    return jwt.verify(token, 'secret');
  } catch (e) {
    return null;
  }
};