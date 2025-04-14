import { Request } from 'express';
import { Role } from 'src/roles/role.enum';

export interface CustomRequest extends Request {
  user?: {
    userId: number;
    email: string;
    roles?: Role;
  };
}
