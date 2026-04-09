import mongoose, { Document, Schema } from 'mongoose';

export interface IApplication extends Document {
  userId: mongoose.Types.ObjectId;
  company: string;
  role: string;
  jobDescriptionUrl?: string;
  location: string;
  status: 'Applied' | 'Phone Screen' | 'Interview' | 'Offer' | 'Rejected';
  dateApplied: Date;
  salaryRange?: string;
  notes?: string;
  skills: string[];
  aiSuggestions: string[];
  createdAt: Date;
  updatedAt: Date;
}

const applicationSchema = new Schema<IApplication>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
      index: true
    },
    company: {
      type: String,
      required: [true, 'Company name is required'],
      trim: true
    },
    role: {
      type: String,
      required: [true, 'Role is required'],
      trim: true
    },
    jobDescriptionUrl: {
      type: String,
      trim: true
    },
    location: {
      type: String,
      required: [true, 'Location is required'],
      trim: true
    },
    status: {
      type: String,
      enum: {
        values: ['Applied', 'Phone Screen', 'Interview', 'Offer', 'Rejected'],
        message: '{VALUE} is not a valid status'
      },
      default: 'Applied'
    },
    dateApplied: {
      type: Date,
      default: Date.now
    },
    salaryRange: {
      type: String,
      trim: true
    },
    notes: {
      type: String,
      trim: true
    },
    skills: [{ type: String, trim: true }],
    aiSuggestions: [{ type: String }]
  },
  {
    timestamps: true
  }
);

// Compound index for efficient user-specific queries
applicationSchema.index({ userId: 1, status: 1 });
applicationSchema.index({ userId: 1, createdAt: -1 });

export default mongoose.model<IApplication>('Application', applicationSchema);
