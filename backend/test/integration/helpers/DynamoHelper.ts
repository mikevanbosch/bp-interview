import * as AWS from 'aws-sdk';
import { DynamoDB } from 'aws-sdk';
import * as config from 'config';
import { CreateTableInput, DeleteTableInput } from 'aws-sdk/clients/dynamodb';
import { DomainMapping } from '../../../src/blueprint/entities/DomainMapping';

export class DynamoHelper {
  private dynamodb: DynamoDB;
  private readonly tableName: string;

  constructor() {
    this.dynamodb = new AWS.DynamoDB({
      region: config.get('region'),
      endpoint: config.get('dynamo-endpoint'),
    });
    this.tableName = config.get('blueprint-table');
  }

  async createTable() {
    const params: CreateTableInput = {
      TableName: this.tableName,
      KeySchema: [{ AttributeName: 'question_id', KeyType: 'HASH' }],
      AttributeDefinitions: [
        { AttributeName: 'question_id', AttributeType: 'S' },
      ],
      ProvisionedThroughput: {
        ReadCapacityUnits: 1,
        WriteCapacityUnits: 1,
      },
    };

    try {
      await this.dynamodb.createTable(params).promise();
    } catch (error) {}
  }

  async dropTable() {
    const params: DeleteTableInput = {
      TableName: this.tableName,
    };

    try {
      await this.dynamodb.deleteTable(params).promise();
    } catch (error) {}
  }

  async seedTable(domainMapping: DomainMapping[]) {
    try {
      await Promise.all(
        domainMapping.map(async (domainMapping) => {
          const params = {
            TableName: this.tableName,
            Item: {
              question_id: { S: domainMapping.question_id },
              domain: { S: domainMapping.domain },
              title: { S: domainMapping.title },
            },
          };
          await this.dynamodb.putItem(params).promise();
        }),
      );
    } catch (error) {}
  }
}
