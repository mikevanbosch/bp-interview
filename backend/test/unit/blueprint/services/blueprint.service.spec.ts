import { BlueprintService } from '../../../../src/blueprint/services/blueprint.service';
import { BlueprintRepository } from '../../../../src/blueprint/repositories/blueprint.repository';
import {
  DiagnosticScreenerBuilder,
  Question,
  Section,
  Sections,
} from '../../../../src/blueprint/entities/DiagnosticScreenerBuilder';
import { AnswerValueMapping } from '../../../../src/blueprint/constants/AnswerValueMapping';

describe('BlueprintService', () => {
  let blueprintService: BlueprintService;
  let blueprintRepository: BlueprintRepository;
  let getDomainsByQuestionsSpy: jest.SpyInstance;
  let getQuestionsSpy: jest.SpyInstance;

  describe('scoreScreeningByQuestions', () => {
    beforeEach(async () => {
      blueprintRepository = new BlueprintRepository();
      blueprintService = new BlueprintService(blueprintRepository);
      getDomainsByQuestionsSpy = jest
        .spyOn(blueprintRepository, 'getDomainsByQuestions')
        .mockResolvedValue([
          {
            question_id: 'question_a',
            domain: 'depression',
          },
        ]);
      getQuestionsSpy = jest.spyOn(blueprintRepository, 'getQuestions');
    });

    afterEach(() => {
      jest.resetAllMocks();
    });
    it('should call the blueprintRepository', async () => {
      await blueprintService.scoreScreeningByQuestions([
        {
          question_id: 'question_a',
          value: 2,
        },
      ]);

      expect(getDomainsByQuestionsSpy).toHaveBeenCalledTimes(1);
      expect(getDomainsByQuestionsSpy).toHaveBeenCalledWith(['question_a']);
    });

    it('should not call blueprintRepository with duplicate question_ids', async () => {
      await blueprintService.scoreScreeningByQuestions([
        {
          question_id: 'question_a',
          value: 2,
        },
        {
          question_id: 'question_a',
          value: 3,
        },
        {
          question_id: 'question_b',
          value: 3,
        },
      ]);

      expect(getDomainsByQuestionsSpy).toHaveBeenCalledWith([
        'question_a',
        'question_b',
      ]);
    });

    it('should return the correct assessment when given a list of questions', async () => {
      const result = await blueprintService.scoreScreeningByQuestions([
        {
          question_id: 'question_a',
          value: 2,
        },
      ]);

      expect(result).toEqual(['PHQ-9']);
    });

    it('should not return results when given a question that does not exist', async () => {
      const result = await blueprintService.scoreScreeningByQuestions([
        {
          question_id: 'question_z',
          value: 2,
        },
      ]);

      expect(result).toEqual([]);
    });

    it('should merge an array of domains and answers by question_id', async () => {
      const result = blueprintService.mergeByQuestionId(
        [
          { question_id: 'question_a', domain: 'depression' },
          { question_id: 'question_b', domain: 'anxiety' },
        ],
        [
          { question_id: 'question_a', value: 2 },
          { question_id: 'question_b', value: 1 },
        ],
      );

      expect(result).toEqual([
        { question_id: 'question_a', domain: 'depression', value: 2 },
        { question_id: 'question_b', domain: 'anxiety', value: 1 },
      ]);
    });

    it('should get score from domainMappings by domain', async () => {
      const result = blueprintService.getScore('anxiety', [
        { question_id: 'question_a', domain: 'anxiety', value: 1 },
        { question_id: 'question_b', domain: 'depression', value: 1 },
        { question_id: 'question_c', domain: 'anxiety', value: 3 },
      ]);

      expect(result).toEqual(4);
    });

    it('should get assessment from domainMappings', async () => {
      const result = blueprintService.totalScoreByDomain([
        { question_id: 'question_a', domain: 'anxiety', value: 1 },
        { question_id: 'question_b', domain: 'depression', value: 2 },
        { question_id: 'question_c', domain: 'anxiety', value: 1 },
        { question_id: 'question_d', domain: 'mania', value: 2 },
        { question_id: 'question_e', domain: 'substance_use', value: 1 },
      ]);

      expect(result).toEqual(['ASRM', 'ASSIST', 'PHQ-9']);
    });
  });

  describe('getDiagnosticScreener', () => {
    let expectedQuestions;
    beforeEach(async () => {
      blueprintRepository = new BlueprintRepository();
      blueprintService = new BlueprintService(blueprintRepository);
      expectedQuestions = [
        new Question().setTitle('question_a').setQuestionId('question_a'),
      ];
      getDomainsByQuestionsSpy = jest
        .spyOn(blueprintRepository, 'getQuestions')
        .mockResolvedValue(expectedQuestions);
      getQuestionsSpy = jest.spyOn(blueprintRepository, 'getQuestions');
    });

    afterEach(() => {
      jest.resetAllMocks();
    });

    it('should call the blueprintRepository', async () => {
      await blueprintService.getDiagnosticScreener();

      expect(getQuestionsSpy).toHaveBeenCalledTimes(1);
    });

    it('should map the result to a DiagnosticScreener', async () => {
      const result = await blueprintService.getDiagnosticScreener();

      expect(result).toEqual(
        new DiagnosticScreenerBuilder()
          .setId('abcd-123')
          .setName('BPDS')
          .setFullName('Blueprint Diagnostic Screener')
          .setDisorder('Cross-Cutting')
          .setContent(
            new Sections()
              .setSections([
                new Section()
                  .setType('standard')
                  .setTitle(
                    'During the past TWO (2) WEEKS, how much (or how often) have you been bothered by the following problems?',
                  )
                  .setAnswers(AnswerValueMapping)
                  .setQuestions(expectedQuestions),
              ])
              .setDisplayName('BDS'),
          ),
      );
    });
  });
});
