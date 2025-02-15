import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, map } from 'rxjs';

export type ResponseFormat<T> = {
  success: boolean;
  message?: string;
  data?: T;
  timestamp: string;
};

@Injectable()
export class ResponseInterceptor<T>
  implements NestInterceptor<T, ResponseFormat<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler<T>,
  ): Observable<ResponseFormat<T>> {
    return next.handle().pipe(
      map((response) => {
        const responseObj: ResponseFormat<T> = {
          success: true,
          timestamp: new Date().toISOString(),
        };

        if (response && typeof response === 'object') {
          if ('data' in response)
            responseObj.data = (response as { data: T }).data;
          if ('message' in response)
            responseObj.message = (response as { message: string }).message;
        } else {
          responseObj.data = response as T;
        }

        return responseObj;
      }),
    );
  }
}
