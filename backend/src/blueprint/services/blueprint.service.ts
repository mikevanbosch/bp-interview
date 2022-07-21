import { Injectable } from '@nestjs/common';
import { BlueprintRepository } from '../repositories/blueprint.repository';
import { QuestionAnswer } from '../entities/QuestionAnswer';
import { DomainMapping } from '../entities/DomainMapping';
import { DomainToAssessmentMapping } from '../constants/DomainToAssessmentMapping';
import {
  DiagnosticScreenerBuilder,
  Section,
  Sections,
} from '../entities/DiagnosticScreenerBuilder';
import { AnswerValueMapping } from '../constants/AnswerValueMapping';

@Injectable()
export class BlueprintService {
  constructor(private screenRepository: BlueprintRepository) {}

  getScore(domain: string, domainMapping: DomainMapping[]): number {
    return domainMapping.reduce((acc, item) => {
      if (item.domain === domain) {
        return acc + item.value;
      }
      return acc;
    }, 0);
  }

  totalScoreByDomain(domainMapping: DomainMapping[]): string[] {
    const result = DomainToAssessmentMapping.map((domainMap) => {
      if (
        this.getScore(domainMap.domain, domainMapping) >= domainMap.totalScore
      ) {
        return domainMap.assessment;
      }
    })
      .filter((item) => item)
      .sort();

    return [...new Set(result)];
  }

  mergeByQuestionId(
    domains: DomainMapping[],
    answers: QuestionAnswer[],
  ): DomainMapping[] {
    return domains.map((domain) => ({
      ...answers.find((item) => item.question_id === domain.question_id),
      ...domain,
    }));
  }

  async scoreScreeningByQuestions(
    answers: QuestionAnswer[],
  ): Promise<string[]> {
    const questions = answers.map((answer) => answer.question_id);
    const domains = await this.screenRepository.getDomainsByQuestions([
      ...new Set(questions),
    ]);

    //merge answers and domain mappings
    const merged = this.mergeByQuestionId(domains, answers);
    return this.totalScoreByDomain(merged);
  }

  async getDiagnosticScreener(): Promise<DiagnosticScreenerBuilder> {
    const questions = await this.screenRepository.getQuestions();

    return new DiagnosticScreenerBuilder()
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
              .setQuestions(questions),
          ])
          .setDisplayName('BDS'),
      );
  }
}
