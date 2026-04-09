export interface User {
  _id: string;
  email: string;
  name: string;
}

export interface Application {
  _id: string;
  userId: string;
  company: string;
  role: string;
  jobDescriptionUrl?: string;
  location: string;
  status: ApplicationStatus;
  dateApplied: string;
  salaryRange?: string;
  notes?: string;
  skills: string[];
  aiSuggestions: string[];
  createdAt: string;
  updatedAt: string;
}

export type ApplicationStatus = 'Applied' | 'Phone Screen' | 'Interview' | 'Offer' | 'Rejected';

export const APPLICATION_STATUSES: ApplicationStatus[] = [
  'Applied',
  'Phone Screen',
  'Interview',
  'Offer',
  'Rejected',
];

export interface ParsedJobData {
  company: string;
  role: string;
  requiredSkills: string[];
  niceToHaveSkills: string[];
  seniority: string;
  location: string;
}

export interface AIParseResponse {
  parsedData: ParsedJobData;
  suggestions: string[];
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface CreateApplicationData {
  company: string;
  role: string;
  location: string;
  jobDescriptionUrl?: string;
  salaryRange?: string;
  notes?: string;
  skills?: string[];
  aiSuggestions?: string[];
  status?: ApplicationStatus;
  dateApplied?: string;
}

export interface Statistics {
  totalApplications: number;
  activeApplications: number;
  statusCounts: Record<ApplicationStatus, number>;
  topSkills: { name: string; count: number }[];
}

