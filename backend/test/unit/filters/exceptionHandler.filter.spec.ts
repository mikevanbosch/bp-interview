import { Test } from '@nestjs/testing';
import { ExceptionHandlerFilter } from '../../../src/filters/exceptionHandler.filter';
import { HttpStatus } from '@nestjs/common';

describe('ExceptionHandlerFilter', () => {
  let exceptionHandlerFilter: ExceptionHandlerFilter;
  let logSpy;
  let mockArgumentsHost;
  let mockStatus;
  let mockJson;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [ExceptionHandlerFilter],
    }).compile();
    exceptionHandlerFilter = moduleRef.get<ExceptionHandlerFilter>(
      ExceptionHandlerFilter,
    );

    mockJson = jest.fn();
    mockStatus = jest.fn().mockImplementation(() => ({
      json: mockJson,
    }));
    const mockGetResponse = jest.fn().mockImplementation(() => ({
      status: mockStatus,
    }));
    const mockHttpArgumentsHost = jest.fn().mockImplementation(() => ({
      getResponse: mockGetResponse,
      getRequest: jest.fn(),
    }));

    mockArgumentsHost = {
      switchToHttp: mockHttpArgumentsHost,
      getArgByIndex: jest.fn(),
      getArgs: jest.fn(),
      getType: jest.fn(),
      switchToRpc: jest.fn(),
      switchToWs: jest.fn(),
    };

    logSpy = jest.spyOn(console, 'log').mockImplementation();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should be defined', () => {
    expect(exceptionHandlerFilter).toBeDefined();
  });

  it('should log message', () => {
    const expectedError = new Error('some error');
    exceptionHandlerFilter.catch(expectedError, mockArgumentsHost);

    expect(logSpy).toHaveBeenCalledTimes(1);
    expect(logSpy).toHaveBeenCalledWith(
      'Exception caught by last ditch error handler',
      expectedError,
    );
    expect(mockStatus).toBeCalledTimes(1);
    expect(mockStatus).toBeCalledWith(HttpStatus.INTERNAL_SERVER_ERROR);
    expect(mockJson).toBeCalledTimes(1);
    expect(mockJson).toBeCalledWith({
      message: 'Internal server error',
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
    });
  });
});
