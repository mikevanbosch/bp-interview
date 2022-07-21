import { Assessment } from '../entities/Assessment';

export const DomainToAssessmentMapping: Assessment[] = [
  {
    domain: 'depression',
    totalScore: 2,
    assessment: 'PHQ-9',
  },
  {
    domain: 'mania',
    totalScore: 2,
    assessment: 'ASRM',
  },
  {
    domain: 'anxiety',
    totalScore: 2,
    assessment: 'PHQ-9',
  },
  {
    domain: 'substance_use',
    totalScore: 1,
    assessment: 'ASSIST',
  },
];
