import { Request } from 'express';
import { Role } from 'src/role.enum';

export interface CustomRequest extends Request {
  user?: {
    userId: number;
    email: string;
    roles?: Role[];
  };
}
