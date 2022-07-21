## Backend
The backend is deployed using serverless and the aws-cdk for dynamodb.

### Dependencies
```
nodejs: 14.15.0
npm: 6.14.8
nestjs: https://docs.nestjs.com/#installation
docker: https://docs.docker.com/get-started/
serverless (optional): https://www.serverless.com/framework/docs/getting-started
```

### Available Scripts
In the project directory, you can run:

### `npm start`

Runs the nestjs api on [http://localhost:3000/blueprint](http://localhost:3000/blueprint)

Automatically seeds a dynamo database using localstack

### `npm run dev`

Runs the nestjs api on [http://localhost:3000/dev/blueprint](http://localhost:3000/dev/blueprint)

Uses the serverless-offline plugin against the dev aws resources (dynamo)

### `npm run test:unit`

Runs all unit tests using jest

### `npm run test:integration`

Runs all integration tests using jest (uses a local image of dynamodb + docker)

### `npm run coverage`

Gets test coverage using jest

### `npm run build`

Builds the app for production

### `npm run lint`

Runs eslint

### `npm run deploy:dev`

Runs serverless deployment with a stage of `dev`
