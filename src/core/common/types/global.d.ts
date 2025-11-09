import 'express';
import { User } from '../../../modules/user/schema/user.schema';
import { Account } from '../../../modules/auth/schema/account.schema';

declare module 'express' {
  interface Request {
    user: User;
    account: Account;
  }
}
