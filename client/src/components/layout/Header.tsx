import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useApplications } from '../../hooks/useApplications';

interface HeaderProps {
  onAddClick?: () => void;
}

const Header: React.FC<HeaderProps> = ({ onAddClick }) => {
  const { user, logout } = useAuth();

  return (
    <header className="border-b border-zinc-200 bg-white/80 backdrop-blur-md sticky top-0 z-30">
      <div className="max-w-[1440px] mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-zinc-950 flex items-center justify-center text-white font-bold text-xs">JT</div>
            <h1 className="text-sm font-semibold text-zinc-900 tracking-tight">Job tracker</h1>
          </Link>
          
          <nav className="hidden md:flex items-center gap-6">
            <NavLink 
              to="/" 
              className={({ isActive }) => 
                `text-[13px] font-medium transition-colors ${isActive ? 'text-zinc-900' : 'text-zinc-400 hover:text-zinc-600'}`
              }
            >
              Applications
            </NavLink>
            <NavLink 
              to="/insights" 
              className={({ isActive }) => 
                `text-[13px] font-medium transition-colors ${isActive ? 'text-zinc-900' : 'text-zinc-400 hover:text-zinc-600'}`
              }
            >
              Insights
            </NavLink>
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden lg:flex items-center gap-3 pr-4 border-r border-zinc-200">
            <div className="flex -space-x-2">
              <div className="w-6 h-6 rounded-full border-2 border-white bg-zinc-100 flex items-center justify-center text-[10px] font-bold text-zinc-500">
                {user?.email?.[0].toUpperCase()}
              </div>
            </div>
            <span className="text-[12px] font-medium text-zinc-500">{user?.email}</span>
          </div>

          {onAddClick && (
            <button
              onClick={onAddClick}
              className="bg-zinc-950 text-white px-4 py-1.5 rounded-lg text-[13px] font-medium hover:bg-zinc-800 transition-all active:scale-[0.98]"
              id="add-application-btn-nav"
            >
              Add application
            </button>
          )}

          <button
            onClick={logout}
            className="w-8 h-8 flex items-center justify-center rounded-lg border border-zinc-200 text-zinc-400 hover:text-zinc-900 hover:border-zinc-300 transition-colors"
            title="Logout"
            id="logout-btn"
          >
            <span className="text-lg">↩</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
