import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { applicationAPI, aiAPI } from '../../services/api';
import type { ParsedJobData, CreateApplicationData } from '../../types';
import { useToast } from '../common/Toast';
import LoadingSpinner from '../common/LoadingSpinner';

interface Props {
  onClose: () => void;
}

const AddApplicationModal: React.FC<Props> = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState<'ai' | 'manual'>('ai');
  const [jobDescription, setJobDescription] = useState('');
  const [parsedData, setParsedData] = useState<ParsedJobData | null>(null);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isParsing, setIsParsing] = useState(false);
  const [parseError, setParseError] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(true);
  const [formData, setFormData] = useState({
    company: '',
    role: '',
    location: '',
    jobDescriptionUrl: '',
    salaryRange: '',
    notes: '',
    status: 'Applied' as const,
  });

  const queryClient = useQueryClient();
  const { showToast } = useToast();

  const createMutation = useMutation({
    mutationFn: (data: CreateApplicationData) => applicationAPI.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['applications'] });
      showToast('Application added');
      onClose();
    },
    onError: () => {
      showToast('Failed to create application', 'error');
    },
  });

  const handleParseJD = async () => {
    if (jobDescription.trim().length < 50) {
      setParseError('Job description must be at least 50 characters.');
      return;
    }

    setIsParsing(true);
    setParseError('');

    try {
      const [response] = await Promise.all([
        aiAPI.parseJobDescription(jobDescription),
        new Promise((resolve) => setTimeout(resolve, 500)),
      ]);

      const { parsedData: data, suggestions: sug } = response.data;
      setParsedData(data);
      setSuggestions(sug);

      setFormData((prev) => ({
        ...prev,
        company: data.company,
        role: data.role,
        location: data.location,
      }));

      showToast('Parsed successfully');
    } catch (err: unknown) {
      const axiosError = err as { response?: { data?: { message?: string } } };
      const message = axiosError.response?.data?.message || 'Failed to parse. Please try again.';
      setParseError(message);
    } finally {
      setIsParsing(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.company || !formData.role || !formData.location) {
      showToast('Please fill in all required fields', 'error');
      return;
    }

    createMutation.mutate({
      ...formData,
      skills: parsedData
        ? [...parsedData.requiredSkills, ...parsedData.niceToHaveSkills]
        : [],
      aiSuggestions: suggestions,
      dateApplied: new Date().toISOString(),
    });
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      showToast('Copied');
    } catch {
      showToast('Failed to copy', 'error');
    }
  };

  const updateField = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 modal-backdrop" onClick={onClose}>
      <div
        className="bg-white border border-gray-200 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 z-10 bg-white px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-base font-semibold text-gray-900">Add application</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors text-lg leading-none"
            id="close-add-modal"
          >
            &times;
          </button>
        </div>

        <div className="p-6">
          {/* Tabs */}
          <div className="flex gap-1 mb-6 border-b border-gray-200">
            <button
              onClick={() => setActiveTab('ai')}
              className={`px-3 py-2 text-[13px] font-medium border-b-2 -mb-px transition-colors ${
                activeTab === 'ai'
                  ? 'border-gray-900 text-gray-900'
                  : 'border-transparent text-gray-400 hover:text-gray-600'
              }`}
            >
              AI-assisted
            </button>
            <button
              onClick={() => setActiveTab('manual')}
              className={`px-3 py-2 text-[13px] font-medium border-b-2 -mb-px transition-colors ${
                activeTab === 'manual'
                  ? 'border-gray-900 text-gray-900'
                  : 'border-transparent text-gray-400 hover:text-gray-600'
              }`}
            >
              Manual entry
            </button>
          </div>

          {/* AI Parsing */}
          {activeTab === 'ai' && (
            <div className="mb-6 animate-fade-in">
              <label className="block text-[13px] font-medium text-gray-700 mb-1.5">
                Job description
              </label>
              <textarea
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2.5 text-sm text-gray-900 placeholder-gray-400 bg-white transition-colors h-36 resize-none"
                placeholder="Paste the full job description here..."
                id="jd-textarea"
              />
              <div className="flex items-center gap-3 mt-2">
                <button
                  onClick={handleParseJD}
                  disabled={isParsing || jobDescription.trim().length < 50}
                  className="border border-gray-300 bg-white text-gray-700 px-3 py-1.5 rounded-md text-[13px] font-medium hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                  id="parse-jd-btn"
                >
                  {isParsing ? (
                    <>
                      <LoadingSpinner size="sm" />
                      Parsing...
                    </>
                  ) : (
                    'Parse with AI'
                  )}
                </button>
                {jobDescription.length > 0 && jobDescription.trim().length < 50 && (
                  <span className="text-[12px] text-gray-400">
                    {50 - jobDescription.trim().length} more characters needed
                  </span>
                )}
              </div>

              {/* Error */}
              {parseError && (
                <div className="mt-3 border border-red-200 bg-red-50 rounded-md px-3 py-2 text-sm text-red-700 animate-fade-in flex items-center justify-between">
                  <span>{parseError}</span>
                  <button
                    onClick={handleParseJD}
                    className="text-red-600 text-[12px] underline ml-3"
                  >
                    Retry
                  </button>
                </div>
              )}

              {/* Parsed result */}
              {parsedData && (
                <div className="mt-4 animate-fade-in border border-gray-200 rounded-md p-4">
                  <h4 className="text-[12px] font-semibold text-gray-500 uppercase tracking-wider mb-3">Extracted data</h4>
                  <div className="grid grid-cols-2 gap-2 text-[13px] mb-3">
                    <div>
                      <span className="text-gray-400">Seniority:</span>
                      <span className="ml-1 text-gray-700 capitalize">{parsedData.seniority}</span>
                    </div>
                    <div>
                      <span className="text-gray-400">Location:</span>
                      <span className="ml-1 text-gray-700">{parsedData.location}</span>
                    </div>
                  </div>
                  {parsedData.requiredSkills.length > 0 && (
                    <div className="mb-2">
                      <span className="text-[11px] text-gray-400 block mb-1">Required skills</span>
                      <div className="flex flex-wrap gap-1">
                        {parsedData.requiredSkills.map((skill, idx) => (
                          <span key={idx} className="text-[11px] px-1.5 py-0.5 rounded bg-gray-100 text-gray-600 border border-gray-200">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  {parsedData.niceToHaveSkills.length > 0 && (
                    <div>
                      <span className="text-[11px] text-gray-400 block mb-1">Nice to have</span>
                      <div className="flex flex-wrap gap-1">
                        {parsedData.niceToHaveSkills.map((skill, idx) => (
                          <span key={idx} className="text-[11px] px-1.5 py-0.5 rounded bg-gray-50 text-gray-500 border border-gray-200">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Resume suggestions */}
              {suggestions.length > 0 && (
                <div className="mt-4 animate-fade-in">
                  <button
                    onClick={() => setShowSuggestions(!showSuggestions)}
                    className="flex items-center gap-1.5 text-[12px] font-medium text-gray-500 hover:text-gray-700 transition-colors mb-2"
                  >
                    <span className={`transition-transform text-[10px] ${showSuggestions ? 'rotate-90' : ''}`}>&#9654;</span>
                    Resume suggestions ({suggestions.length})
                  </button>

                  {showSuggestions && (
                    <div className="border border-gray-200 rounded-md p-4 space-y-2.5">
                      {suggestions.map((bullet, idx) => (
                        <div key={idx} className="flex items-start gap-2 group">
                          <span className="text-gray-300 text-sm mt-px">&bull;</span>
                          <p className="flex-1 text-[13px] text-gray-600 leading-relaxed">{bullet}</p>
                          <button
                            onClick={() => copyToClipboard(bullet)}
                            className="opacity-0 group-hover:opacity-100 transition-opacity text-[11px] text-gray-400 hover:text-gray-600 underline whitespace-nowrap"
                          >
                            Copy
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="app-company" className="block text-[13px] font-medium text-gray-700 mb-1.5">
                  Company *
                </label>
                <input
                  id="app-company"
                  type="text"
                  required
                  value={formData.company}
                  onChange={(e) => updateField('company', e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-900 placeholder-gray-400 bg-white transition-colors"
                  placeholder="e.g. Stripe"
                />
              </div>
              <div>
                <label htmlFor="app-role" className="block text-[13px] font-medium text-gray-700 mb-1.5">
                  Role *
                </label>
                <input
                  id="app-role"
                  type="text"
                  required
                  value={formData.role}
                  onChange={(e) => updateField('role', e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-900 placeholder-gray-400 bg-white transition-colors"
                  placeholder="e.g. Frontend Engineer"
                />
              </div>
            </div>

            <div>
              <label htmlFor="app-location" className="block text-[13px] font-medium text-gray-700 mb-1.5">
                Location *
              </label>
              <input
                id="app-location"
                type="text"
                required
                value={formData.location}
                onChange={(e) => updateField('location', e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-900 placeholder-gray-400 bg-white transition-colors"
                placeholder="e.g. Remote, San Francisco"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="app-jd-url" className="block text-[13px] font-medium text-gray-700 mb-1.5">
                  Job posting URL
                </label>
                <input
                  id="app-jd-url"
                  type="url"
                  value={formData.jobDescriptionUrl}
                  onChange={(e) => updateField('jobDescriptionUrl', e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-900 placeholder-gray-400 bg-white transition-colors"
                  placeholder="https://..."
                />
              </div>
              <div>
                <label htmlFor="app-salary" className="block text-[13px] font-medium text-gray-700 mb-1.5">
                  Salary range
                </label>
                <input
                  id="app-salary"
                  type="text"
                  value={formData.salaryRange}
                  onChange={(e) => updateField('salaryRange', e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-900 placeholder-gray-400 bg-white transition-colors"
                  placeholder="e.g. $120k – $160k"
                />
              </div>
            </div>

            <div>
              <label htmlFor="app-notes" className="block text-[13px] font-medium text-gray-700 mb-1.5">
                Notes
              </label>
              <textarea
                id="app-notes"
                value={formData.notes}
                onChange={(e) => updateField('notes', e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-900 placeholder-gray-400 bg-white transition-colors h-20 resize-none"
                placeholder="Personal notes..."
              />
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-2 pt-2 border-t border-gray-100">
              <button
                type="button"
                onClick={onClose}
                className="px-3 py-1.5 rounded-md text-sm font-medium text-gray-600 border border-gray-300 bg-white hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={createMutation.isPending}
                className="bg-gray-900 text-white px-4 py-1.5 rounded-md text-sm font-medium hover:bg-gray-800 disabled:opacity-50 transition-colors flex items-center gap-2"
                id="submit-application"
              >
                {createMutation.isPending ? (
                  <>
                    <LoadingSpinner size="sm" />
                    Adding...
                  </>
                ) : (
                  'Add application'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddApplicationModal;
