import { Injectable } from '@nestjs/common';
import * as AWS from 'aws-sdk';
import * as config from 'config';
import { DomainMapping } from '../entities/DomainMapping';
import { DocumentClient } from 'aws-sdk/lib/dynamodb/document_client';
import { Question } from '../entities/DiagnosticScreenerBuilder';
import ScanOutput = DocumentClient.ScanOutput;

@Injectable()
export class BlueprintRepository {
  private readonly tableName: string;
  private db: DocumentClient;

  constructor() {
    this.tableName = config.get('blueprint-table');
    this.db = new AWS.DynamoDB.DocumentClient({
      endpoint: config.get('dynamo-endpoint'),
      region: config.get('region'),
    });
  }

  async getDomainsByQuestions(questionIds: string[]): Promise<DomainMapping[]> {
    let domains: DomainMapping[];

    const params = {
      RequestItems: {
        [`${this.tableName}`]: {
          Keys: questionIds.map((questionId) => ({ question_id: questionId })),
        },
      },
    };

    try {
      const result = await this.db.batchGet(params).promise();

      domains = result.Responses[this.tableName] as DomainMapping[];
    } catch (error) {
      throw new Error(error);
    }

    return domains;
  }

  async getQuestions(): Promise<Question[]> {
    let questions: ScanOutput;
    const params = {
      TableName: this.tableName,
    };

    try {
      questions = await this.db.scan(params).promise();
    } catch (error) {
      throw new Error(error);
    }

    return questions.Items.map((question) => {
      return new Question()
        .setTitle(question.title)
        .setQuestionId(question.question_id);
    }).sort((a, b) => a.question_id.localeCompare(b.question_id));
  }
}
