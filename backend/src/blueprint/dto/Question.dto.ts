import { IsInt, Matches, Max, Min } from 'class-validator';

export class QuestionDto {
  @IsInt()
  @Min(0)
  @Max(4)
  value: number;

  @Matches(/^question_[a-zA-Z0-9]+$/)
  question_id: string;
}
