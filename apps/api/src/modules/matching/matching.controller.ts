import { Request, Response } from 'express';
import { MatcherService } from '../resume/matcher.service';
import { success, error } from '../../common/response/envelope';
import { aiClient } from '../ai/ai.client';
import { getSuggestionsPrompt, SuggestionsSchema } from '../ai/prompts/suggestions.prompt';

export class MatchingController {
  private matcherService = new MatcherService();

  analyze = async (req: Request, res: Response) => {
    try {
      const { candidate, job } = req.body;
      if (!candidate || !job) {
        return res.status(400).json(error('VALIDATION_ERROR', 'Both candidate (parsed resume) and job (parsed JD) are required'));
      }

      const matchResult = this.matcherService.match(candidate, job);
      res.status(200).json(success(matchResult));
    } catch (err: any) {
      console.error('Matching analysis error:', err);
      res.status(500).json(error('INTERNAL_ERROR', err.message || 'Failed to match candidate with job'));
    }
  };

  suggestions = async (req: Request, res: Response) => {
    try {
      const { candidate, job } = req.body;
      if (!candidate || !job) {
        return res.status(400).json(error('VALIDATION_ERROR', 'Both candidate and job data are required'));
      }
      
      const prompt = getSuggestionsPrompt(JSON.stringify(candidate), JSON.stringify(job));
      const suggestions = await aiClient.generateStructured(prompt, SuggestionsSchema);
      
      res.status(200).json(success(suggestions));
    } catch (err: any) {
      console.error('Suggestions error:', err);
      res.status(500).json(error('INTERNAL_ERROR', err.message || 'Failed to generate suggestions'));
    }
  };
}
