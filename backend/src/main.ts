import { Context, Handler } from 'aws-lambda';
import { Server } from 'http';
import { createServer, proxy } from 'aws-serverless-express';
import { eventContext } from 'aws-serverless-express/middleware';

import { ExpressAdapter } from '@nestjs/platform-express';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

import * as express from 'express';
import { ValidationPipe } from '@nestjs/common';

const binaryMimeTypes: string[] = [];

let cachedServer: Server;

process.on('unhandledRejection', (reason) => {
  console.error(reason);
});

process.on('uncaughtException', (reason) => {
  console.error(reason);
});

async function bootstrapServer(): Promise<Server> {
  if (!cachedServer) {
    try {
      const expressApp = express();
      const nestApp = await NestFactory.create(
        AppModule,
        new ExpressAdapter(expressApp),
      );
      nestApp.useGlobalPipes(new ValidationPipe());
      nestApp.enableCors();
      nestApp.use(eventContext());
      await nestApp.init();
      cachedServer = createServer(expressApp, undefined, binaryMimeTypes);
    } catch (error) {
      return Promise.reject(error);
    }
  }
  return Promise.resolve(cachedServer);
}

export const handler: Handler = async (event: any, context: Context) => {
  cachedServer = await bootstrapServer();
  return proxy(cachedServer, event, context, 'PROMISE').promise;
};
