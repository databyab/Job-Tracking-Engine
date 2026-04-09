import React, { useState } from 'react';
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragOverEvent,
  DragEndEvent,
  DefaultAnnouncements,
} from '@dnd-kit/core';
import { arrayMove, sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import { useApplications, useUpdateApplication } from '../../hooks/useApplications';
import type { Application, ApplicationStatus } from '../../types';
import { APPLICATION_STATUSES } from '../../types';
import KanbanColumn from './KanbanColumn';
import ApplicationCard from './ApplicationCard';
import AddApplicationModal from '../modals/AddApplicationModal';
import ApplicationDetailModal from '../modals/ApplicationDetailModal';
import LoadingSpinner from '../common/LoadingSpinner';
import Header from '../layout/Header';

const KanbanBoard: React.FC = () => {
  const { data: applications = [], isLoading, error } = useApplications();
  const updateMutation = useUpdateApplication();

  const [activeId, setActiveId] = useState<string | null>(null);
  const [activeApplication, setActiveApplication] = useState<Application | null>(null);
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // dnd-kit sensors
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    setActiveId(active.id as string);
    const app = applications.find((a) => a._id === active.id);
    if (app) setActiveApplication(app);
  };

  const handleDragOver = (event: DragOverEvent) => {
    // Optional: add visual preview of drop target
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);
    setActiveApplication(null);

    if (!over) return;

    const appId = active.id as string;
    const newStatus = over.id as ApplicationStatus;

    const application = applications.find((a) => a._id === appId);
    if (application && application.status !== newStatus) {
      updateMutation.mutate({
        id: appId,
        data: { status: newStatus },
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fafafa]">
        <div className="text-center animate-fade-in">
          <LoadingSpinner size="lg" className="mb-4" />
          <p className="text-zinc-400 text-sm font-medium">Loading your applications...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fafafa]">
        <div className="premium-card p-8 max-w-md text-center">
          <h2 className="text-lg font-semibold text-zinc-950 mb-2">Something went wrong</h2>
          <p className="text-zinc-500 text-sm mb-6">Failed to load applications. Please check your connection and try again.</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-zinc-950 text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-zinc-800 transition-all"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fafafa]">
      <Header onAddClick={() => setIsAddModalOpen(true)} />

      {/* Board */}
      <main className="px-6 py-8 max-w-[1440px] mx-auto">
        {applications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 animate-fade-in text-center">
            <div className="w-16 h-16 rounded-2xl bg-zinc-100 flex items-center justify-center text-zinc-400 text-2xl mb-6">📋</div>
            <h2 className="text-xl font-semibold text-zinc-950 mb-2">No applications yet</h2>
            <p className="text-zinc-500 text-sm mb-8 max-w-xs">Start tracking your career journey by adding your first job application.</p>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="bg-zinc-950 text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-zinc-800 transition-all active:scale-[0.98]"
            >
              Add your first application
            </button>
          </div>
        ) : (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCorners}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDragEnd={handleDragEnd}
          >
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6 h-[calc(100vh-140px)]">
              {APPLICATION_STATUSES.map((status) => (
                <KanbanColumn
                  key={status}
                  status={status}
                  applications={applications.filter((a) => a.status === status)}
                  onCardClick={setSelectedApplication}
                />
              ))}
            </div>

            <DragOverlay>
              {activeApplication ? (
                <div className="scale-105 rotate-1 shadow-xl opacity-90 transition-transform">
                  <ApplicationCard application={activeApplication} onClick={() => {}} />
                </div>
              ) : null}
            </DragOverlay>
          </DndContext>
        )}
      </main>

      {/* Modals */}
      {isAddModalOpen && (
        <AddApplicationModal onClose={() => setIsAddModalOpen(false)} />
      )}

      {selectedApplication && (
        <ApplicationDetailModal
          application={selectedApplication}
          onClose={() => setSelectedApplication(null)}
        />
      )}
    </div>
  );
};

export default KanbanBoard;
