import React from 'react';
import { useDraggable } from '@dnd-kit/core';
import type { Application } from '../../types';

interface ApplicationCardProps {
  application: Application;
  onClick: () => void;
}

const ApplicationCard: React.FC<ApplicationCardProps> = ({ application, onClick }) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: application._id,
    data: { application },
  });

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
        zIndex: isDragging ? 50 : undefined,
      }
    : undefined;

  const dateFormatted = new Date(application.dateApplied).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      onClick={onClick}
      className={`bg-white border border-zinc-200 rounded-lg p-3.5 cursor-grab active:cursor-grabbing select-none hover:border-zinc-900 transition-all shadow-[0_1px_2px_0_rgba(0,0,0,0.02)] group ${
        isDragging ? 'opacity-40' : ''
      }`}
      id={`app-card-${application._id}`}
    >
      <div className="flex items-start justify-between mb-2">
        <div>
          <h3 className="text-[13px] font-semibold text-zinc-900 leading-tight group-hover:underline underline-offset-2">{application.company}</h3>
          <p className="text-[12px] text-zinc-500 mt-0.5">{application.role}</p>
        </div>
      </div>

      {application.skills.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-3">
          {application.skills.slice(0, 2).map((skill, idx) => (
            <span
              key={idx}
              className="text-[10px] px-1.5 py-0.5 rounded-md bg-zinc-50 text-zinc-600 border border-zinc-200"
            >
              {skill}
            </span>
          ))}
          {application.skills.length > 2 && (
            <span className="text-[10px] text-zinc-400 self-center">
              +{application.skills.length - 2}
            </span>
          )}
        </div>
      )}

      <div className="flex items-center justify-between pt-2 border-t border-zinc-50">
        <div className="flex items-center gap-2">
          <span className="text-[11px] text-zinc-400 font-medium">{dateFormatted}</span>
          <span className="text-zinc-200">|</span>
          <span className="text-[11px] text-zinc-400 truncate max-w-[80px]">{application.location}</span>
        </div>
        {application.aiSuggestions.length > 0 && (
          <div className="w-4 h-4 rounded-full bg-zinc-50 flex items-center justify-center border border-zinc-200" title="AI Suggestions available">
            <span className="text-[9px] font-bold text-zinc-400">✧</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ApplicationCard;
