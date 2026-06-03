import { Injectable, NestInterceptor, ExecutionContext, CallHandler, Logger } from '@nestjs/common';
import { Observable, tap } from 'rxjs';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger('HTTP');

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest();
    const method: string = req.method;
    const url: string = req.url;
    const body: unknown = req.body;

    this.logger.log(`→ ${method} ${url} | body: ${JSON.stringify(body)}`);

    return next.handle().pipe(
      tap({
        next: (data: unknown) =>
          this.logger.log(`← ${method} ${url} | response: ${JSON.stringify(data)}`),
        error: (err: unknown) =>
          this.logger.error(`← ${method} ${url} | error: ${err instanceof Error ? err.message : String(err)}`),
      }),
    );
  }
}