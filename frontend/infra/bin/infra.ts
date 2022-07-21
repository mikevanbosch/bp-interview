#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { InfraStack } from '../lib/infra-stack';

const app = new cdk.App();
new InfraStack(app, 'InfraStackUiDev', {
    env: { region: 'us-east-1', account: '656607464701' },
    environment: 'dev',
});
