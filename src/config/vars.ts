import { config } from 'dotenv';

config();

export const isDev = process.env.NODE_ENV === 'development';
export const port = process.env.PORT;
export const clientUrl = process.env.CLIENT_URL as string;
export const accessSecret = process.env.ACCESS_SECRET as string;
export const expirationInterval = Number(process.env.JWT_EXPIRATION_MINUTES);
