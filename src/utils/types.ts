import { Request } from 'express';

export interface CustomRequest extends Request {
    verifiedUser?: any;
    token?: string;
}