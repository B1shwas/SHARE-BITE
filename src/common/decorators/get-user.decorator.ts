import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { IRequestWithUser } from 'shared/types/request-with-user';

export const GetUser = createParamDecorator(
  (data: keyof IRequestWithUser['user'] | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<IRequestWithUser>();

    return data ? request.user?.[data] : request.user;
  },
);
