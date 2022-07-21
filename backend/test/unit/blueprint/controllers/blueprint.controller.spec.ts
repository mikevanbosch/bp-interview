import { BlueprintController } from '../../../../src/blueprint/controllers/blueprint.controller';
import { BlueprintService } from '../../../../src/blueprint/services/blueprint.service';
import {
  DiagnosticScreenerBuilder,
  Question,
  Section,
  Sections,
} from '../../../../src/blueprint/entities/DiagnosticScreenerBuilder';
import { AnswerValueMapping } from '../../../../src/blueprint/constants/AnswerValueMapping';

describe('BlueprintController', () => {
  let blueprintController: BlueprintController;
  let blueprintService: BlueprintService;
  let blueprintServiceSpy;

  describe('scoreAnswers', () => {
    beforeEach(async () => {
      blueprintService = new BlueprintService(undefined);
      blueprintController = new BlueprintController(blueprintService);
      blueprintServiceSpy = jest
        .spyOn(blueprintService, 'scoreScreeningByQuestions')
        .mockResolvedValue(['ASRM']);
    });

    afterEach(() => {
      jest.resetAllMocks();
    });
    it('should call the blueprintService with answers', async () => {
      await blueprintController.scoreAnswers({ answers: [] });

      expect(blueprintServiceSpy).toHaveBeenCalledTimes(1);
    });

    it('should return answers', async () => {
      const result = await blueprintController.scoreAnswers({ answers: [] });

      expect(result).toEqual({
        results: ['ASRM'],
      });
    });
  });

  describe('diagnosticScreener', () => {
    beforeEach(async () => {
      blueprintService = new BlueprintService(undefined);
      blueprintController = new BlueprintController(blueprintService);
      blueprintServiceSpy = jest
        .spyOn(blueprintService, 'getDiagnosticScreener')
        .mockResolvedValue(
          new DiagnosticScreenerBuilder()
            .setId('abcd-123')
            .setName('BPDS')
            .setFullName('Blueprint Diagnostic Screener')
            .setDisorder('Cross-Cutting')
            .setContent(
              new Sections().setSections([
                new Section()
                  .setType('standard')
                  .setTitle('A section')
                  .setAnswers(AnswerValueMapping)
                  .setQuestions([
                    new Question()
                      .setQuestionId('question_a')
                      .setTitle('Some tile'),
                  ]),
              ]),
            ),
        );
    });

    afterEach(() => {
      jest.resetAllMocks();
    });
    it('should call the blueprintService', async () => {
      await blueprintController.diagnosticScreener();

      expect(blueprintServiceSpy).toHaveBeenCalledTimes(1);
    });

    it('should return a DiagnosticScreener', async () => {
      const result = await blueprintController.diagnosticScreener();

      expect(result).toEqual({
        content: {
          display_name: undefined,
          sections: [
            {
              answers: [
                { title: 'Not at all', value: 0 },
                { title: 'Rare, less than a day or two', value: 1 },
                { title: 'Several days', value: 2 },
                { title: 'More than half the days', value: 3 },
                { title: 'Nearly every day', value: 4 },
              ],
              questions: [{ question_id: 'question_a', title: 'Some tile' }],
              title: 'A section',
              type: 'standard',
            },
          ],
        },
        disorder: 'Cross-Cutting',
        full_name: 'Blueprint Diagnostic Screener',
        id: 'abcd-123',
        name: 'BPDS',
      });
    });
  });
});
