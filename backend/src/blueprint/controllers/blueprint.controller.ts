import { Body, Controller, Get, HttpCode, Post } from '@nestjs/common';
import { BlueprintService } from '../services/blueprint.service';
import { AnswersDto } from '../dto/Answers.dto';
import { ScoreAnswersResponse } from '../entities/ScoreAnswersResponse';
import { DiagnosticScreenerBuilder } from '../entities/DiagnosticScreenerBuilder';

@Controller('blueprint')
export class BlueprintController {
  constructor(private blueprintService: BlueprintService) {}

  @Post('score-answers')
  @HttpCode(200)
  async scoreAnswers(
    @Body() answers: AnswersDto,
  ): Promise<ScoreAnswersResponse> {
    const domainMapping = await this.blueprintService.scoreScreeningByQuestions(
      answers.answers,
    );
    return { results: domainMapping };
  }

  @Get('diagnostic-screener')
  async diagnosticScreener(): Promise<DiagnosticScreenerBuilder> {
    return await this.blueprintService.getDiagnosticScreener();
  }
}
