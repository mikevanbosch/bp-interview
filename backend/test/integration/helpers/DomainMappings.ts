import { DomainMapping } from '../../../src/blueprint/entities/DomainMapping';

export const DomainMappings: DomainMapping[] = [
  {
    question_id: 'question_a',
    domain: 'depression',
    title: 'Little interest or pleasure in doing things?',
  },
  {
    question_id: 'question_b',
    domain: 'depression',
    title: 'Feeling down, depressed, or hopeless?',
  },
  {
    question_id: 'question_c',
    domain: 'mania',
    title: 'Sleeping less than usual, but still have a lot of energy?',
  },
  {
    question_id: 'question_d',
    domain: 'mania',
    title:
      'Starting lots more projects than usual or doing more risky things than usual?',
  },
  {
    question_id: 'question_e',
    domain: 'anxiety',
    title: 'Feeling nervous, anxious, frightened, worried, or on edge?',
  },
  {
    question_id: 'question_f',
    domain: 'anxiety',
    title: 'Feeling panic or being frightened?',
  },
  {
    question_id: 'question_g',
    domain: 'anxiety',
    title: 'Avoiding situations that make you feel anxious?',
  },
  {
    question_id: 'question_h',
    domain: 'substance_use',
    title: 'Drinking at least 4 drinks of any kind of alcohol in a single day?',
  },
];
