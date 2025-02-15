import { User } from '@prisma/client';
import { Request } from 'express';

export interface IRequestWithUser extends Request {
  user: Omit<User, 'password'>;
}
