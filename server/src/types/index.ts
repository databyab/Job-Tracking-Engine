import { Request } from 'express';

export interface AuthRequest extends Request {
  userId?: string;
}

export interface ParsedJobData {
  company: string;
  role: string;
  requiredSkills: string[];
  niceToHaveSkills: string[];
  seniority: 'entry' | 'mid' | 'senior' | 'lead';
  location: string;
}

export interface ResumeSuggestions {
  bullets: string[];
}

export interface RegisterBody {
  email: string;
  password: string;
  name: string;
}

export interface LoginBody {
  email: string;
  password: string;
}

export type ApplicationStatus = 'Applied' | 'Phone Screen' | 'Interview' | 'Offer' | 'Rejected';
