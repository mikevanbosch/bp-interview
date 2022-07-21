import { Answer } from '../entities/DiagnosticScreenerBuilder';

export const AnswerValueMapping: Answer[] = [
  new Answer().setTitle('Not at all').setValue(0),
  new Answer().setTitle('Rare, less than a day or two').setValue(1),
  new Answer().setTitle('Several days').setValue(2),
  new Answer().setTitle('More than half the days').setValue(3),
  new Answer().setTitle('Nearly every day').setValue(4),
];
