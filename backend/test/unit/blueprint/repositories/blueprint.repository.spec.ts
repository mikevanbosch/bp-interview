import { BlueprintRepository } from '../../../../src/blueprint/repositories/blueprint.repository';
import * as config from 'config';
import * as AWS from 'aws-sdk';

describe('BlueprintRepository', () => {
  const tableName = 'some-table';
  let blueprintRepository: BlueprintRepository;
  let mockConfig;
  let mockDocumentClient;

  describe('getDomainsByQuestions', () => {
    beforeEach(async () => {
      mockConfig = jest.spyOn(config, 'get').mockReturnValue(tableName);
      const mockBatchGetResponse = {
        Responses: {
          [tableName]: [
            {
              question_id: 'question_a',
              domain: 'depression',
            },
          ],
        },
      };

      mockDocumentClient = {
        batchGet: jest.fn().mockReturnThis(),
        promise: jest.fn().mockResolvedValue(mockBatchGetResponse),
      };
      jest
        .spyOn(AWS.DynamoDB, 'DocumentClient')
        .mockReturnValue(mockDocumentClient);

      blueprintRepository = new BlueprintRepository();
    });

    afterEach(() => {
      jest.resetAllMocks();
    });

    it('should initialize BlueprintRepository', async () => {
      await blueprintRepository.getDomainsByQuestions([]);

      expect(mockConfig).toHaveBeenCalledTimes(3);
      expect(mockConfig).toHaveBeenNthCalledWith(1, 'blueprint-table');
      expect(mockConfig).toHaveBeenNthCalledWith(2, 'dynamo-endpoint');
      expect(mockConfig).toHaveBeenNthCalledWith(3, 'region');
    });

    it('should call dynamodb batchGet with the correct params', async () => {
      const expectedParams = {
        RequestItems: {
          [tableName]: {
            Keys: [{ question_id: 'question_a' }],
          },
        },
      };
      await blueprintRepository.getDomainsByQuestions(['question_a']);

      expect(mockDocumentClient.batchGet).toHaveBeenCalledTimes(1);
      expect(mockDocumentClient.batchGet).toHaveBeenCalledWith(expectedParams);
    });

    it('should return the expected domains', async () => {
      const result = await blueprintRepository.getDomainsByQuestions([
        'question_a',
      ]);

      expect(result).toEqual([
        { domain: 'depression', question_id: 'question_a' },
      ]);
    });

    it('should throw an error when dynamo call fails', async () => {
      mockDocumentClient = {
        batchGet: jest.fn().mockReturnThis(),
        promise: jest.fn().mockRejectedValue('error'),
      };
      jest
        .spyOn(AWS.DynamoDB, 'DocumentClient')
        .mockReturnValue(mockDocumentClient);

      blueprintRepository = new BlueprintRepository();
      try {
        await blueprintRepository.getDomainsByQuestions(['question_a']);
      } catch (error) {
        expect(error.message).toEqual('error');
      }
    });
  });

  describe('getQuestions', () => {
    beforeEach(async () => {
      mockConfig = jest.spyOn(config, 'get').mockReturnValue(tableName);
      const mockScanResponse = {
        Items: [{ question_id: 'question_a', title: 'Some title' }],
      };

      mockDocumentClient = {
        scan: jest.fn().mockReturnThis(),
        promise: jest.fn().mockResolvedValue(mockScanResponse),
      };
      jest
        .spyOn(AWS.DynamoDB, 'DocumentClient')
        .mockReturnValue(mockDocumentClient);

      blueprintRepository = new BlueprintRepository();
    });

    afterEach(() => {
      jest.resetAllMocks();
    });

    it('should call dynamodb scan with the correct params', async () => {
      const expectedParams = {
        TableName: tableName,
      };
      await blueprintRepository.getQuestions();

      expect(mockDocumentClient.scan).toHaveBeenCalledTimes(1);
      expect(mockDocumentClient.scan).toHaveBeenCalledWith(expectedParams);
    });

    it('should return the expected questions', async () => {
      const result = await blueprintRepository.getQuestions();

      expect(result).toEqual([
        { title: 'Some title', question_id: 'question_a' },
      ]);
    });

    it('should throw an error when dynamo call fails', async () => {
      mockDocumentClient = {
        scan: jest.fn().mockReturnThis(),
        promise: jest.fn().mockRejectedValue('error'),
      };
      jest
        .spyOn(AWS.DynamoDB, 'DocumentClient')
        .mockReturnValue(mockDocumentClient);

      blueprintRepository = new BlueprintRepository();
      try {
        await blueprintRepository.getQuestions();
      } catch (error) {
        expect(error.message).toEqual('error');
      }
    });
  });
});
