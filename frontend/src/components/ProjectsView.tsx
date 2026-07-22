import React, { useState, useEffect } from 'react';
import { type SavedProject } from '../hooks/useProjects';
import { FolderGit2, Clock, Trash2, ChevronRight, RotateCcw, AlertCircle, X } from 'lucide-react';

interface ProjectsViewProps {
  projects: SavedProject[];
  trashedProjects: SavedProject[];
  onSelectProject: (project: SavedProject) => void;
  onDeleteProject: (id: string) => Promise<{ success: boolean; error?: string }>;
  onRestoreProject: (id: string) => Promise<{ success: boolean; error?: string }>;
  onPermanentlyDeleteProject: (id: string) => Promise<{ success: boolean; error?: string }>;
  onLoadTrash: () => void;
}

export const ProjectsView: React.FC<ProjectsViewProps> = ({ 
  projects, 
  trashedProjects,
  onSelectProject, 
  onDeleteProject,
  onRestoreProject,
  onPermanentlyDeleteProject,
  onLoadTrash
}) => {
  const [view, setView] = useState<'active' | 'trash'>('active');
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    confirmText: string;
    onConfirm: () => void;
  }>({
    isOpen: false,
    title: '',
    message: '',
    confirmText: '',
    onConfirm: () => {}
  });
  
  const [alertModal, setAlertModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
  }>({
    isOpen: false,
    title: '',
    message: ''
  });

  useEffect(() => {
    if (view === 'trash') {
      onLoadTrash();
    }
  }, [view]);

  const displayedProjects = view === 'active' ? projects : trashedProjects;

  const handleAction = async (action: () => Promise<{ success: boolean; error?: string }>) => {
    const result = await action();
    if (!result.success && result.error) {
      setAlertModal({
        isOpen: true,
        title: 'Action Failed',
        message: result.error
      });
    }
  };

  return (
    <>
      <div className="pt-28 min-h-screen max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-text-primary">Your Projects</h1>
            <p className="text-text-secondary mt-2">Manage and revisit your generated blueprints</p>
          </div>
          
          <div className="flex bg-surface border border-border rounded-lg p-1">
            <button
              onClick={() => setView('active')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                view === 'active' 
                  ? 'bg-accent-start/10 text-accent-start' 
                  : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              Active
            </button>
            <button
              onClick={() => setView('trash')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center ${
                view === 'trash' 
                  ? 'bg-red-500/10 text-red-500' 
                  : 'text-text-secondary hover:text-red-400'
              }`}
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Trash
            </button>
          </div>
        </div>
        
        {displayedProjects.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-center py-20">
            <div className="w-16 h-16 bg-surface rounded-2xl flex items-center justify-center mb-6 border border-border shadow-sm">
              {view === 'active' ? (
                <FolderGit2 className="w-8 h-8 text-text-secondary" />
              ) : (
                <Trash2 className="w-8 h-8 text-text-secondary" />
              )}
            </div>
            <h2 className="text-2xl font-bold text-text-primary mb-2">
              {view === 'active' ? 'No Projects Yet' : 'Trash is Empty'}
            </h2>
            <p className="text-text-secondary max-w-md">
              {view === 'active' 
                ? "You haven't generated any blueprints yet. Head back home to start your first project!" 
                : "No deleted projects found. Items in trash will be permanently deleted after 30 days."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayedProjects.map(project => (
              <div key={project.id} className="bg-surface border border-border rounded-2xl p-6 hover:shadow-md transition-shadow group relative flex flex-col">
                
                {view === 'active' ? (
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      setConfirmModal({
                        isOpen: true,
                        title: 'Move to Trash',
                        message: 'Are you sure you want to move this project to the Trash? You can restore it from the Trash section within the next 30 days before it is permanently deleted.',
                        confirmText: 'Move to Trash',
                        onConfirm: () => handleAction(() => onDeleteProject(project.id))
                      });
                    }}
                    className="absolute top-4 right-4 p-2 text-text-secondary hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                    title="Move to Trash"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                ) : (
                  <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAction(() => onRestoreProject(project.id));
                      }}
                      className="p-2 text-accent-start hover:bg-accent-start/10 rounded-lg transition-colors"
                      title="Restore Project"
                    >
                      <RotateCcw className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        setConfirmModal({
                          isOpen: true,
                          title: 'Permanently Delete',
                          message: 'Are you sure you want to PERMANENTLY delete this project? This action cannot be undone.',
                          confirmText: 'Delete Forever',
                          onConfirm: () => handleAction(() => onPermanentlyDeleteProject(project.id))
                        });
                      }}
                      className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                      title="Permanently Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                )}
                
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-accent-start/10 flex items-center justify-center flex-shrink-0">
                    <FolderGit2 className="w-5 h-5 text-accent-start" />
                  </div>
                  <h3 className="font-bold text-lg text-text-primary truncate pr-16">{project.projectName}</h3>
                </div>
                
                <p className="text-text-secondary text-sm line-clamp-3 mb-6 flex-1">
                  {project.description}
                </p>
                
                <div className="flex items-center justify-between mt-auto pt-4 border-t border-border">
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center text-xs text-text-secondary">
                      <Clock className="w-3 h-3 mr-1" />
                      Updated: {new Date(project.updatedAt).toLocaleDateString()}
                    </div>
                    {view === 'trash' && project.deletedAt && (
                      <div className="flex items-center text-xs text-red-400">
                        <AlertCircle className="w-3 h-3 mr-1" />
                        Deleted: {new Date(project.deletedAt).toLocaleDateString()}
                      </div>
                    )}
                  </div>
                  
                  {view === 'active' && (
                    <button 
                      onClick={() => onSelectProject(project)}
                      className="flex items-center text-sm font-medium text-accent-start hover:text-accent-end transition-colors"
                    >
                      View Blueprint
                      <ChevronRight className="w-4 h-4 ml-1" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Confirm Modal */}
      {confirmModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
          <div className="bg-surface border border-border rounded-xl shadow-2xl w-full max-w-md p-6 relative animate-in fade-in zoom-in-95 duration-200">
            <button 
              onClick={() => setConfirmModal(prev => ({ ...prev, isOpen: false }))}
              className="absolute top-4 right-4 text-text-secondary hover:text-text-primary transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-xl font-bold text-text-primary mb-2">{confirmModal.title}</h3>
            <p className="text-text-secondary mb-6">{confirmModal.message}</p>
            <div className="flex justify-end gap-3">
              <button 
                onClick={() => setConfirmModal(prev => ({ ...prev, isOpen: false }))}
                className="px-4 py-2 text-sm font-medium text-text-primary bg-surface border border-border rounded-lg hover:bg-background transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={() => {
                  confirmModal.onConfirm();
                  setConfirmModal(prev => ({ ...prev, isOpen: false }));
                }}
                className="px-4 py-2 text-sm font-medium text-white bg-red-500 hover:bg-red-600 rounded-lg transition-colors"
              >
                {confirmModal.confirmText}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Alert Modal */}
      {alertModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
          <div className="bg-surface border border-border rounded-xl shadow-2xl w-full max-w-md p-6 relative animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center flex-shrink-0">
                <AlertCircle className="w-6 h-6 text-red-500" />
              </div>
              <h3 className="text-xl font-bold text-text-primary">{alertModal.title}</h3>
            </div>
            <p className="text-text-secondary mb-6">{alertModal.message}</p>
            <div className="flex justify-end">
              <button 
                onClick={() => setAlertModal(prev => ({ ...prev, isOpen: false }))}
                className="px-6 py-2 text-sm font-medium text-white bg-accent-start hover:bg-accent-end rounded-lg transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
