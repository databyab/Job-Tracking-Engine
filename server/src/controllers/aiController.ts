import { Response } from 'express';
import { AuthRequest } from '../types';
import aiService from '../services/aiService';

// Parse job description and provide resume suggestions
export const parseJobDescription = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { jobDescription } = req.body;

    if (!jobDescription || typeof jobDescription !== 'string') {
      res.status(400).json({ message: 'Job description is required and must be a string' });
      return;
    }

    if (jobDescription.trim().length < 50) {
      res.status(400).json({
        message: 'Job description is too short. Please provide at least 50 characters for accurate parsing.'
      });
      return;
    }

    if (jobDescription.trim().length > 15000) {
      res.status(400).json({
        message: 'Job description is too long. Please limit to 15,000 characters.'
      });
      return;
    }

    // Parse the job description (now includes both parsed data and suggestions in one call)
    const { parsedData, suggestions } = await aiService.parseJobDescription(jobDescription.trim());

    res.json({
      parsedData,
      suggestions
    });
  } catch (error) {
    console.error('AI Service error:', error);
    const message = error instanceof Error ? error.message : 'AI parsing failed. Please try again.';
    res.status(500).json({ message });
  }
};
