import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { map, Observable } from 'rxjs';

export interface Response<T> {
  statusCode: number;

  payload: any;
}

@Injectable()
export class FormatResponseInterceptor<T>
  implements NestInterceptor<T, Response<T>>
{
  intercept(
    context: ExecutionContext,

    next: CallHandler,
  ): Observable<Response<any>> {
    return next.handle().pipe(
      map((payload) => {
        let data = {};

        if (payload) {
          if (Array.isArray(payload)) {
            data = payload;
          } else if (typeof payload === 'object') {
            data = [payload];
          }
        } else {
          data = payload;
        }

        return {
          statusCode: context.switchToHttp().getResponse().statusCode,

          payload: data,
        };
      }),
    );
  }
}
