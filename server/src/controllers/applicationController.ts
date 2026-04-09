import { Response } from 'express';
import Application from '../models/Application';
import { AuthRequest } from '../types';

// Create a new application
export const createApplication = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { company, role, location, jobDescriptionUrl, salaryRange, notes, skills, aiSuggestions, status, dateApplied } = req.body;

    if (!company || !role || !location) {
      res.status(400).json({ message: 'Company, role, and location are required' });
      return;
    }

    const application = new Application({
      userId: req.userId,
      company,
      role,
      location,
      jobDescriptionUrl: jobDescriptionUrl || undefined,
      salaryRange: salaryRange || undefined,
      notes: notes || undefined,
      skills: skills || [],
      aiSuggestions: aiSuggestions || [],
      status: status || 'Applied',
      dateApplied: dateApplied || new Date()
    });

    await application.save();
    res.status(201).json(application);
  } catch (error) {
    console.error('Create application error:', error);
    if (error instanceof Error && error.name === 'ValidationError') {
      res.status(400).json({ message: error.message });
      return;
    }
    res.status(500).json({ message: 'Failed to create application' });
  }
};

// Get all applications for the authenticated user
export const getApplications = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const applications = await Application.find({ userId: req.userId })
      .sort({ createdAt: -1 });

    res.json(applications);
  } catch (error) {
    console.error('Get applications error:', error);
    res.status(500).json({ message: 'Failed to fetch applications' });
  }
};

// Get a single application by ID
export const getApplication = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const application = await Application.findOne({
      _id: req.params.id,
      userId: req.userId
    });

    if (!application) {
      res.status(404).json({ message: 'Application not found' });
      return;
    }

    res.json(application);
  } catch (error) {
    console.error('Get application error:', error);
    res.status(500).json({ message: 'Failed to fetch application' });
  }
};

// Update an application
export const updateApplication = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const allowedUpdates = [
      'company', 'role', 'location', 'jobDescriptionUrl',
      'salaryRange', 'notes', 'skills', 'aiSuggestions',
      'status', 'dateApplied'
    ];

    const updates: Record<string, unknown> = {};
    for (const key of allowedUpdates) {
      if (req.body[key] !== undefined) {
        updates[key] = req.body[key];
      }
    }

    const application = await Application.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      updates,
      { new: true, runValidators: true }
    );

    if (!application) {
      res.status(404).json({ message: 'Application not found' });
      return;
    }

    res.json(application);
  } catch (error) {
    console.error('Update application error:', error);
    if (error instanceof Error && error.name === 'ValidationError') {
      res.status(400).json({ message: error.message });
      return;
    }
    res.status(500).json({ message: 'Failed to update application' });
  }
};

// Delete an application
export const deleteApplication = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const application = await Application.findOneAndDelete({
      _id: req.params.id,
      userId: req.userId
    });

    if (!application) {
      res.status(404).json({ message: 'Application not found' });
      return;
    }

    res.json({ message: 'Application deleted successfully' });
  } catch (error) {
    console.error('Delete application error:', error);
    res.status(500).json({ message: 'Failed to delete application' });
  }
};

// Get application statistics for insights
export const getStats = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const applications = await Application.find({ userId: req.userId });

    // 1. Status distribution (Funnel)
    const statusCounts = {
      Applied: 0,
      'Phone Screen': 0,
      Interview: 0,
      Offer: 0,
      Rejected: 0
    };

    // 2. Skill frequency
    const skillFreq: Record<string, number> = {};

    applications.forEach(app => {
      // Update status counts
      if (statusCounts[app.status as keyof typeof statusCounts] !== undefined) {
        statusCounts[app.status as keyof typeof statusCounts]++;
      }

      // Update skill frequency
      app.skills.forEach(skill => {
        skillFreq[skill] = (skillFreq[skill] || 0) + 1;
      });
    });

    // Sort skills and take top 8
    const topSkills = Object.entries(skillFreq)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8)
      .map(([name, count]) => ({ name, count }));

    res.json({
      totalApplications: applications.length,
      statusCounts,
      topSkills,
      activeApplications: statusCounts.Applied + statusCounts['Phone Screen'] + statusCounts.Interview
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ message: 'Failed to fetch statistics' });
  }
};

