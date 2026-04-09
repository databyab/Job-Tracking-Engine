import React, { useState } from 'react';
import type { Application, ApplicationStatus } from '../../types';
import { APPLICATION_STATUSES } from '../../types';
import { useUpdateApplication, useDeleteApplication } from '../../hooks/useApplications';
import { useToast } from '../common/Toast';
import ConfirmDialog from '../common/ConfirmDialog';
import LoadingSpinner from '../common/LoadingSpinner';

interface Props {
  application: Application;
  onClose: () => void;
}

const ApplicationDetailModal: React.FC<Props> = ({ application, onClose }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [formData, setFormData] = useState({
    company: application.company,
    role: application.role,
    location: application.location,
    jobDescriptionUrl: application.jobDescriptionUrl || '',
    salaryRange: application.salaryRange || '',
    notes: application.notes || '',
    status: application.status,
  });

  const updateMutation = useUpdateApplication();
  const deleteMutation = useDeleteApplication();
  const { showToast } = useToast();

  const handleSave = () => {
    updateMutation.mutate(
      { id: application._id, data: formData },
      {
        onSuccess: () => {
          showToast('Updated');
          setIsEditing(false);
        },
        onError: () => showToast('Failed to update', 'error'),
      }
    );
  };

  const handleDelete = () => {
    deleteMutation.mutate(application._id, {
      onSuccess: () => {
        showToast('Deleted');
        onClose();
      },
      onError: () => showToast('Failed to delete', 'error'),
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

  const dateFormatted = new Date(application.dateApplied).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 modal-backdrop" onClick={onClose}>
        <div
          className="bg-white border border-gray-200 rounded-lg max-w-lg w-full max-h-[90vh] overflow-y-auto animate-slide-up"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="sticky top-0 z-10 bg-white px-6 py-4 border-b border-gray-200 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-[11px] text-gray-500 uppercase tracking-wider font-medium">
                {application.status}
              </span>
              <span className="text-[11px] text-gray-300">&middot;</span>
              <span className="text-[11px] text-gray-400">{dateFormatted}</span>
            </div>
            <div className="flex items-center gap-2">
              {!isEditing && (
                <>
                  <button
                    onClick={() => setIsEditing(true)}
                    className="text-[12px] text-gray-400 hover:text-gray-600 underline transition-colors"
                    id="edit-app-btn"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => setShowDeleteConfirm(true)}
                    className="text-[12px] text-red-500 hover:text-red-700 underline transition-colors"
                    id="delete-app-btn"
                  >
                    Delete
                  </button>
                </>
              )}
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 transition-colors text-lg leading-none ml-2"
                id="close-detail-modal"
              >
                &times;
              </button>
            </div>
          </div>

          <div className="p-6">
            {isEditing ? (
              /* Edit Mode */
              <div className="space-y-4 animate-fade-in">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[12px] font-medium text-gray-500 mb-1">Company</label>
                    <input
                      type="text"
                      value={formData.company}
                      onChange={(e) => updateField('company', e.target.value)}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-900 bg-white transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-[12px] font-medium text-gray-500 mb-1">Role</label>
                    <input
                      type="text"
                      value={formData.role}
                      onChange={(e) => updateField('role', e.target.value)}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-900 bg-white transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[12px] font-medium text-gray-500 mb-1">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => updateField('status', e.target.value as ApplicationStatus)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-900 bg-white transition-colors"
                  >
                    {APPLICATION_STATUSES.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[12px] font-medium text-gray-500 mb-1">Location</label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => updateField('location', e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-900 bg-white transition-colors"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[12px] font-medium text-gray-500 mb-1">Job URL</label>
                    <input
                      type="url"
                      value={formData.jobDescriptionUrl}
                      onChange={(e) => updateField('jobDescriptionUrl', e.target.value)}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-900 bg-white transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-[12px] font-medium text-gray-500 mb-1">Salary range</label>
                    <input
                      type="text"
                      value={formData.salaryRange}
                      onChange={(e) => updateField('salaryRange', e.target.value)}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-900 bg-white transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[12px] font-medium text-gray-500 mb-1">Notes</label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => updateField('notes', e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-900 bg-white transition-colors h-20 resize-none"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2 border-t border-gray-100">
                  <button
                    onClick={() => setIsEditing(false)}
                    className="px-3 py-1.5 rounded-md text-sm font-medium text-gray-600 border border-gray-300 bg-white hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={updateMutation.isPending}
                    className="bg-gray-900 text-white px-4 py-1.5 rounded-md text-sm font-medium hover:bg-gray-800 disabled:opacity-50 transition-colors flex items-center gap-2"
                  >
                    {updateMutation.isPending ? (
                      <>
                        <LoadingSpinner size="sm" />
                        Saving...
                      </>
                    ) : (
                      'Save'
                    )}
                  </button>
                </div>
              </div>
            ) : (
              /* View Mode */
              <div className="animate-fade-in">
                <h2 className="text-lg font-semibold text-gray-900 mb-0.5">{application.company}</h2>
                <p className="text-sm text-gray-500 mb-6">{application.role}</p>

                {/* Fields */}
                <div className="space-y-4 mb-6">
                  <FieldRow label="Location" value={application.location} />
                  <FieldRow label="Applied" value={dateFormatted} />
                  {application.salaryRange && (
                    <FieldRow label="Salary" value={application.salaryRange} />
                  )}
                  {application.jobDescriptionUrl && (
                    <div className="flex items-start">
                      <span className="text-[12px] text-gray-400 font-medium w-20 shrink-0 pt-px">Link</span>
                      <a
                        href={application.jobDescriptionUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-gray-700 underline hover:no-underline truncate"
                      >
                        View posting
                      </a>
                    </div>
                  )}
                </div>

                {/* Skills */}
                {application.skills.length > 0 && (
                  <div className="mb-6 pt-4 border-t border-gray-100">
                    <h4 className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-2">
                      Skills
                    </h4>
                    <div className="flex flex-wrap gap-1">
                      {application.skills.map((skill, idx) => (
                        <span key={idx} className="text-[12px] px-2 py-0.5 rounded bg-gray-100 text-gray-600 border border-gray-200">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Notes */}
                {application.notes && (
                  <div className="mb-6 pt-4 border-t border-gray-100">
                    <h4 className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-2">
                      Notes
                    </h4>
                    <p className="text-sm text-gray-600 leading-relaxed">{application.notes}</p>
                  </div>
                )}

                {/* AI Suggestions */}
                {application.aiSuggestions.length > 0 && (
                  <div className="pt-4 border-t border-gray-100">
                    <button
                      onClick={() => setShowSuggestions(!showSuggestions)}
                      className="flex items-center gap-1.5 text-[12px] font-medium text-gray-500 hover:text-gray-700 transition-colors mb-2"
                    >
                      <span className={`transition-transform text-[10px] ${showSuggestions ? 'rotate-90' : ''}`}>&#9654;</span>
                      Resume suggestions ({application.aiSuggestions.length})
                    </button>

                    {showSuggestions && (
                      <div className="space-y-2.5 animate-fade-in">
                        {application.aiSuggestions.map((bullet, idx) => (
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
          </div>
        </div>
      </div>

      <ConfirmDialog
        isOpen={showDeleteConfirm}
        title="Delete application"
        message={`Remove ${application.company} — ${application.role}? This cannot be undone.`}
        confirmLabel="Delete"
        variant="danger"
        onConfirm={handleDelete}
        onCancel={() => setShowDeleteConfirm(false)}
      />
    </>
  );
};

const FieldRow: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div className="flex items-start">
    <span className="text-[12px] text-gray-400 font-medium w-20 shrink-0 pt-px">{label}</span>
    <span className="text-sm text-gray-700">{value}</span>
  </div>
);

export default ApplicationDetailModal;
