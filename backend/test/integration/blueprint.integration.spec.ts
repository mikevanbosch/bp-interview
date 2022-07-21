import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import * as request from 'supertest';
import { DynamoHelper } from './helpers/DynamoHelper';
import { DomainMappings } from './helpers/DomainMappings';
import { AppModule } from '../../src/app.module';

describe('Blueprint', () => {
  let app: INestApplication;
  let dynamoHelper: DynamoHelper;

  beforeAll(async () => {
    dynamoHelper = new DynamoHelper();
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());

    await dynamoHelper.createTable();
    await app.init();
    await dynamoHelper.seedTable(DomainMappings);
  });

  afterAll(async () => {
    await dynamoHelper.dropTable();
  });

  describe('score-answers', () => {
    describe('Happy path', () => {
      it('should respond 200 when a blueprint is scored', async () => {
        return request(app.getHttpServer())
          .post('/blueprint/score-answers')
          .send({
            answers: [
              {
                value: 1,
                question_id: 'question_a',
              },
            ],
          })
          .expect(HttpStatus.OK);
      });

      it('should return the correct scores given an answers input', async () => {
        return request(app.getHttpServer())
          .post('/blueprint/score-answers')
          .send({
            answers: [
              {
                value: 2,
                question_id: 'question_a',
              },
            ],
          })
          .expect(HttpStatus.OK)
          .then((response) => {
            expect(response.body.results).toEqual(['PHQ-9']);
          });
      });

      it('should return the correct scores given a full answers input', async () => {
        return request(app.getHttpServer())
          .post('/blueprint/score-answers')
          .send({
            answers: [
              {
                value: 1,
                question_id: 'question_a',
              },
              {
                value: 0,
                question_id: 'question_b',
              },
              {
                value: 2,
                question_id: 'question_c',
              },
              {
                value: 3,
                question_id: 'question_d',
              },
              {
                value: 1,
                question_id: 'question_e',
              },
              {
                value: 0,
                question_id: 'question_f',
              },
              {
                value: 1,
                question_id: 'question_g',
              },
              {
                value: 0,
                question_id: 'question_h',
              },
            ],
          })
          .expect(HttpStatus.OK)
          .then((response) => {
            expect(response.body.results).toEqual(['ASRM', 'PHQ-9']);
          });
      });

      it('should not return any scores if a question does not exist', async () => {
        return request(app.getHttpServer())
          .post('/blueprint/score-answers')
          .send({
            answers: [
              {
                value: 2,
                question_id: 'question_z',
              },
            ],
          })
          .expect(HttpStatus.OK)
          .then((response) => {
            expect(response.body.results).toEqual([]);
          });
      });
    });

    describe('Unhappy path', () => {
      const invalidAnswersTestCases = [
        {
          answers: [],
          case: ['answers should not be empty'],
        },
        {
          answers: [
            {
              question_id: 'question_a',
            },
          ],
          case: [
            'answers.0.value must not be greater than 4',
            'answers.0.value must not be less than 0',
            'answers.0.value must be an integer number',
          ],
        },
        {
          answers: [
            {
              value: 2,
              question_id: 'invalid_question',
            },
          ],
          case: [
            'answers.0.question_id must match /^question_[a-zA-Z0-9]+$/ regular expression',
          ],
        },
        {
          answers: [
            {
              value: 6,
              question_id: 'question_a',
            },
          ],
          case: ['answers.0.value must not be greater than 4'],
        },
        {
          answers: [
            {
              value: -1,
              question_id: 'question_a',
            },
          ],
          case: ['answers.0.value must not be less than 0'],
        },
      ];

      invalidAnswersTestCases.forEach((testCase) => {
        it(`should return a 400 error when ${testCase.case}`, async () => {
          return request(app.getHttpServer())
            .post('/blueprint/score-answers')
            .send(testCase)
            .expect(HttpStatus.BAD_REQUEST)
            .then((response) => {
              expect(response.body).toEqual({
                error: 'Bad Request',
                message: testCase.case,
                statusCode: HttpStatus.BAD_REQUEST,
              });
            });
        });
      });
    });
  });

  describe('diagnostic-screener', () => {
    describe('Happy path', () => {
      it('should respond 200 when asked for a diagnosticScreener', async () => {
        return request(app.getHttpServer())
          .get('/blueprint/diagnostic-screener')
          .expect(HttpStatus.OK);
      });

      it('should respond with a diagnosticScreener', async () => {
        return request(app.getHttpServer())
          .get('/blueprint/diagnostic-screener')
          .expect(HttpStatus.OK)
          .then((response) => {
            expect(response.body).toEqual({
              id: 'abcd-123',
              name: 'BPDS',
              disorder: 'Cross-Cutting',
              content: {
                sections: [
                  {
                    type: 'standard',
                    title:
                      'During the past TWO (2) WEEKS, how much (or how often) have you been bothered by the following problems?',
                    answers: [
                      {
                        title: 'Not at all',
                        value: 0,
                      },
                      {
                        title: 'Rare, less than a day or two',
                        value: 1,
                      },
                      {
                        title: 'Several days',
                        value: 2,
                      },
                      {
                        title: 'More than half the days',
                        value: 3,
                      },
                      {
                        title: 'Nearly every day',
                        value: 4,
                      },
                    ],
                    questions: [
                      {
                        question_id: 'question_a',
                        title: 'Little interest or pleasure in doing things?',
                      },
                      {
                        question_id: 'question_b',
                        title: 'Feeling down, depressed, or hopeless?',
                      },
                      {
                        question_id: 'question_c',
                        title:
                          'Sleeping less than usual, but still have a lot of energy?',
                      },
                      {
                        question_id: 'question_d',
                        title:
                          'Starting lots more projects than usual or doing more risky things than usual?',
                      },
                      {
                        question_id: 'question_e',
                        title:
                          'Feeling nervous, anxious, frightened, worried, or on edge?',
                      },
                      {
                        question_id: 'question_f',
                        title: 'Feeling panic or being frightened?',
                      },
                      {
                        question_id: 'question_g',
                        title:
                          'Avoiding situations that make you feel anxious?',
                      },
                      {
                        question_id: 'question_h',
                        title:
                          'Drinking at least 4 drinks of any kind of alcohol in a single day?',
                      },
                    ],
                  },
                ],
                display_name: 'BDS',
              },
              full_name: 'Blueprint Diagnostic Screener',
            });
          });
      });
    });
  });
});
