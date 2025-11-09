import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import { Account } from '../schema/account.schema';

export const ActiveAccount = createParamDecorator(
  (data: keyof Account | undefined, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest<Request>();
    return data ? request.account?.[data] : request.account;
  },
);
