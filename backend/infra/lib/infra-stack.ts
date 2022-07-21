import { Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import * as cdk from 'aws-cdk-lib';
import * as acm from 'aws-cdk-lib/aws-certificatemanager';

interface MultiStackProps extends StackProps {
  environment?: string;
}

export class InfraStack extends Stack {
  constructor(scope: Construct, id: string, props?: MultiStackProps) {
    super(scope, id, props);

    new dynamodb.Table(this, 'Blueprint', {
      tableName: `blueprint-${props?.environment}`,
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      partitionKey: {
        name: 'question_id',
        type: dynamodb.AttributeType.STRING,
      },
      pointInTimeRecovery: true,
    });
  }
}
