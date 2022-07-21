import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';

@Catch()
export class ExceptionHandlerFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const status = HttpStatus.INTERNAL_SERVER_ERROR;

    console.log('Exception caught by last ditch error handler', exception);
    response.status(status).json({
      statusCode: status,
      message: 'Internal server error',
    });
  }
}
