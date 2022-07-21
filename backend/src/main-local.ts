import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

import { ValidationPipe } from '@nestjs/common';
import { DynamoHelper } from '../test/integration/helpers/DynamoHelper';
import { DomainMappings } from '../test/integration/helpers/DomainMappings';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());

  await app.listen(3000);
  const helper = new DynamoHelper();
  await helper.createTable();
  await helper.seedTable(DomainMappings);
  console.log(`Application is running on: ${await app.getUrl()}`);
}

if (process.env.NODE_ENV === 'localhost') {
  bootstrap();
}
