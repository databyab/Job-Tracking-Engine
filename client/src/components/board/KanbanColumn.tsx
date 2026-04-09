import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import type { Application, ApplicationStatus } from '../../types';
import ApplicationCard from './ApplicationCard';

interface KanbanColumnProps {
  status: ApplicationStatus;
  applications: Application[];
  onCardClick: (application: Application) => void;
}

const columnStyleMap: Record<string, string> = {
  'Applied': 'column-applied',
  'Phone Screen': 'column-phone-screen',
  'Interview': 'column-interview',
  'Offer': 'column-offer',
  'Rejected': 'column-rejected',
};

const KanbanColumn: React.FC<KanbanColumnProps> = ({ status, applications, onCardClick }) => {
  const { isOver, setNodeRef } = useDroppable({
    id: status,
  });

  return (
    <div
      ref={setNodeRef}
      className={`flex flex-col rounded-xl bg-zinc-100/50 border border-zinc-200 transition-colors h-full ${
        isOver ? 'bg-zinc-200/50 border-zinc-300' : ''
      }`}
      id={`column-${status.toLowerCase().replace(/\s+/g, '-')}`}
    >
      {/* Column Header */}
      <div className="px-3.5 py-3 flex items-center justify-between border-b border-zinc-200/50">
        <div className="flex items-center gap-2">
          <h2 className="text-[12px] font-semibold text-zinc-900 tracking-tight">{status}</h2>
          <span className="text-[10px] font-bold text-zinc-400 bg-white border border-zinc-200 px-1.5 py-0.5 rounded-full">
            {applications.length}
          </span>
        </div>
        <button className="text-zinc-400 hover:text-zinc-900 transition-colors font-bold">+</button>
      </div>

      {/* Cards */}
      <div className="flex-1 p-2 space-y-2 min-h-[500px] overflow-y-auto">

        {applications.length === 0 ? (
          <div className="flex items-center justify-center py-8">
            <p className="text-[12px] text-gray-400">
              {isOver ? 'Drop here' : 'No applications'}
            </p>
          </div>
        ) : (
          applications.map((app) => (
            <ApplicationCard
              key={app._id}
              application={app}
              onClick={() => onCardClick(app)}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default KanbanColumn;
