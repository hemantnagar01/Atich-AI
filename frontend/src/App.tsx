import { useState, useRef, useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation, useParams } from 'react-router-dom';
import { Hero } from './components/Hero';
import { PromptView } from './components/PromptView';
import { ChatPanel } from './components/ChatPanel';
import { BlueprintPanel } from './components/BlueprintPanel';
import { ExportBar } from './components/ExportBar';
import { Navbar } from './components/Navbar';
import { ProjectsView } from './components/ProjectsView';
import { LoadingScreen } from './components/LoadingScreen';
import { AuthPanel } from './components/AuthPanel';
import { SharedBlueprintView } from './components/SharedBlueprintView';
import { Footer } from './components/Footer';
import { WhatWeDo } from './components/WhatWeDo';
import { BeamsBackground } from './components/BeamsBackground';
import { AnimationTest } from './components/AnimationTest';
import { streamBlueprint, refineSections } from './api';
import { useProjects, type SavedProject } from './hooks/useProjects';
import { useAuth } from './hooks/useAuth';

// A tiny wrapper for SharedBlueprintView to grab the ID from the URL
function SharedRouteWrapper({ onNavigateHome, onOpenAuth }: { onNavigateHome: () => void, onOpenAuth: () => void }) {
  const { id } = useParams<{id: string}>();
  if (!id) return null;
  return <SharedBlueprintView id={id} onNavigateHome={onNavigateHome} onOpenAuth={onOpenAuth} />;
}

function ProtectedRoute({ children, onUnauthorized }: { children: React.ReactNode, onUnauthorized: () => void }) {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      onUnauthorized();
      navigate('/', { replace: true });
    }
  }, [user, loading, navigate, onUnauthorized]);

  if (loading) return null;
  if (!user) return null;
  
  return <>{children}</>;
}

function App() {
  const navigate = useNavigate();
  const location = useLocation();

  const [projectState, setProjectState] = useState<'initial' | 'clarifying' | 'generating' | 'complete'>('initial');
  const [projectName, setProjectName] = useState('');
  const [description, setDescription] = useState('');
  const currentProjectIdRef = useRef<string | null>(null);
  const saveTimeoutRef = useRef<any>(null);
  
  // Auth State
  const { user } = useAuth();
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState<(() => void) | null>(null);
  
  // Blueprint State
  const [sections, setSections] = useState<Record<string, any>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  // To keep answers around for retries
  const [structuredAnswers, setStructuredAnswers] = useState<Record<string, string>>({});
  
  // Track specifically which sections are actively generating
  const [activeGeneratingSections, setActiveGeneratingSections] = useState<string[]>([]);
  
  const activeStreams = useRef<Set<AbortController>>(new Set());

  // Projects State
  const { projects, trashedProjects, saveProject, deleteProject, restoreProject, permanentlyDeleteProject, loadTrash, getProject } = useProjects();

  // Handle reloading on a specific project
  useEffect(() => {
    const path = location.pathname;
    if (path.startsWith('/project/')) {
      const id = path.split('/project/')[1];
      if (id && currentProjectIdRef.current !== id) {
        // Fetch the project and restore state
        getProject(id).then(proj => {
          if (proj) {
            currentProjectIdRef.current = proj.id;
            setProjectName(proj.projectName);
            setDescription(proj.description);
            setSections(proj.sections);
            setErrors({});
            setProjectState('complete');
            setActiveGeneratingSections([]);
          } else {
            // Project not found or no permission
            navigate('/projects');
          }
        });
      }
    }
  }, [location.pathname, getProject, navigate]);

  // Auto-save (only if user is logged in)
  useEffect(() => {
    if (user && Object.keys(sections).length > 0 && (projectState === 'generating' || projectState === 'complete')) {
      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
      
      saveTimeoutRef.current = setTimeout(async () => {
        const id = await saveProject(currentProjectIdRef.current, projectName, description, sections);
        if (id && !currentProjectIdRef.current) {
          currentProjectIdRef.current = id;
          // Update URL to the new project ID if we were on /new
          if (location.pathname === '/new') {
            navigate(`/project/${id}`, { replace: true });
          }
        }
      }, 1500);
    }
    
    return () => {
      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    }
  }, [sections, projectState, projectName, description, user, navigate, location.pathname]);

  const handleAuthSuccess = () => {
    if (pendingAction) {
      pendingAction();
      setPendingAction(null);
    }
  };

  const handleShare = async (): Promise<string | null> => {
    return new Promise((resolve) => {
      const executeShare = async () => {
        const id = await saveProject(currentProjectIdRef.current, projectName, description, sections);
        if (id) {
          currentProjectIdRef.current = id;
          if (location.pathname === '/new') {
             navigate(`/project/${id}`, { replace: true });
          }
        }
        
        if (id) {
          resolve(`${window.location.origin}/shared/${id}`);
        } else {
          resolve(null);
        }
      };

      if (!user) {
        setPendingAction(() => executeShare);
        setIsAuthOpen(true);
      } else {
        executeShare();
      }
    });
  };

  const startStream = (name: string, desc: string, answers: Record<string, string>, subset?: string[]) => {
    setProjectState('generating');
    setStructuredAnswers(answers);
    
    if (subset) {
      setErrors(prev => {
        const next = { ...prev };
        subset.forEach(s => delete next[s]);
        return next;
      });
      setSections(prev => {
        const next = { ...prev };
        subset.forEach(s => delete next[s]);
        return next;
      });
      setActiveGeneratingSections(prev => [...new Set([...prev, ...subset])]);
    } else {
      setSections({});
      setErrors({});
      // If it's a full generation, all possible sections are generating
      setActiveGeneratingSections([
        'executiveSummary', 'architecture', 'database', 'techStack', 
        'productVision', 'targetUsers', 'features', 'userFlow', 
        'api', 'docker', 'aws', 'risks', 'roadmap'
      ]);
      // If it's a full generation, abort all existing streams
      activeStreams.current.forEach(ctrl => ctrl.abort());
      activeStreams.current.clear();
    }

    const currentCtrl = streamBlueprint(
      name,
      desc,
      answers,
      subset,
      (sectionName, data) => {
        setSections(prev => ({ ...prev, [sectionName]: data }));
        setActiveGeneratingSections(prev => prev.filter(s => s !== sectionName));
      },
      (sectionName, errorMsg) => {
        setErrors(prev => ({ ...prev, [sectionName]: errorMsg }));
        setActiveGeneratingSections(prev => prev.filter(s => s !== sectionName));
      },
      () => {
        activeStreams.current.delete(currentCtrl);
        if (activeStreams.current.size === 0) {
          setProjectState('complete');
          setActiveGeneratingSections([]);
        }
      }
    );
    activeStreams.current.add(currentCtrl);
  };

  const handleHeroStart = (name: string, desc: string) => {
    if (!user) {
      setPendingAction(() => () => {
         currentProjectIdRef.current = null;
         setProjectName(name);
         setDescription(desc);
         setProjectState('clarifying');
         navigate('/new');
      });
      setIsAuthOpen(true);
      return;
    }
    
    currentProjectIdRef.current = null;
    setProjectName(name);
    setDescription(desc);
    setProjectState('clarifying');
    navigate('/new');
  };

  const handleChatComplete = (answers: Record<string, string>) => {
    startStream(projectName, description, answers, undefined);
  };

  const handleRetrySection = (sectionName: string) => {
    startStream(projectName, description, structuredAnswers, [sectionName]);
  };

  const handleBlueprintUpdate = async (updates: {section: string, instruction: string}[]) => {
    setProjectState('generating');
    
    for (const update of updates) {
      setActiveGeneratingSections(prev => [...new Set([...prev, update.section])]);
      try {
        const response = await refineSections([update.section], sections, update.instruction);
        setSections(prev => ({ ...prev, ...response.updatedSections }));
        setErrors(prev => {
          const next = { ...prev };
          delete next[update.section];
          return next;
        });
      } catch (err: any) {
        console.error(err);
        setErrors(prev => ({ ...prev, [update.section]: "Failed to apply AI update." }));
      } finally {
        setActiveGeneratingSections(prev => prev.filter(s => s !== update.section));
      }
    }
    
    setProjectState('complete');
  };

  const handleNavigateHome = () => {
    navigate('/');
    currentProjectIdRef.current = null;
    setProjectState('initial');
    setProjectName('');
    setDescription('');
    setSections({});
    setErrors({});
    setStructuredAnswers({});
    setActiveGeneratingSections([]);
  };

  const handleNavigateProjects = () => {
    if (!user) {
      setIsAuthOpen(true);
      setPendingAction(() => () => navigate('/projects'));
      return;
    }
    navigate('/projects');
  };

  const handleWhatWeDoGetStarted = () => {
    if (!user) {
      setIsAuthOpen(true);
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSelectProject = (proj: SavedProject) => {
    currentProjectIdRef.current = proj.id;
    setProjectName(proj.projectName);
    setDescription(proj.description);
    setSections(proj.sections);
    setErrors({});
    setProjectState('complete');
    setActiveGeneratingSections([]);
    navigate(`/project/${proj.id}`);
  };

  const renderEditor = () => (
    <>
      <Navbar 
        onOpenAuth={() => setIsAuthOpen(true)}
        onNavigateHome={handleNavigateHome}
        onNavigateProjects={handleNavigateProjects} 
      />
      <div className="pt-20 min-h-screen md:h-screen w-full flex flex-col md:flex-row bg-background md:overflow-hidden p-4 gap-4">
        <div className="w-full md:w-1/3 lg:w-1/4 flex flex-col flex-shrink-0" style={{ minHeight: projectState === 'clarifying' ? '50vh' : 'auto' }}>
          <div className="mb-4 px-2 flex-shrink-0">
            <h1 className="text-2xl font-bold tracking-tight flex items-center">
              <span className="w-4 h-4 bg-accent-start rounded-sm mr-3"></span>
              {projectName || 'New Project'}
            </h1>
            <p className="text-xs text-text-secondary mt-1">Atich Session</p>
          </div>
          
          <ChatPanel 
            projectName={projectName} 
            description={description} 
            mode={projectState === 'clarifying' ? 'clarify' : 'free'}
            blueprintData={sections}
            onComplete={handleChatComplete} 
            onBlueprintUpdate={handleBlueprintUpdate}
          />
        </div>
        
        <div className="flex-1 min-h-[50vh] md:h-full relative flex flex-col overflow-hidden">
          <div className="flex-1 overflow-y-auto overflow-x-hidden pb-20 md:pb-0">
            <BlueprintPanel 
              sections={sections} 
              errors={errors} 
              activeGeneratingSections={activeGeneratingSections}
              onRetry={handleRetrySection}
            />
          </div>
          
          {projectState === 'complete' && (
            <div className="mt-4 flex-shrink-0">
              <ExportBar 
                projectName={projectName} 
                sections={sections} 
                onShare={handleShare}
              />
            </div>
          )}
        </div>
      </div>
    </>
  );

  return (
    <>
      <LoadingScreen />
      
      <Routes>
        <Route path="/shared/:id" element={<SharedRouteWrapper onNavigateHome={handleNavigateHome} onOpenAuth={() => setIsAuthOpen(true)} />} />
        
        <Route path="/" element={
          <>
            <Navbar 
              onOpenAuth={() => setIsAuthOpen(true)}
              onNavigateHome={handleNavigateHome}
              onNavigateProjects={handleNavigateProjects}
            />
            <BeamsBackground intensity="medium">
              <Hero onStart={handleHeroStart} />
              <WhatWeDo onGetStartedClick={handleWhatWeDoGetStarted} />
              
              {/* Smooth fade transition into the Footer */}
              <div className="absolute bottom-0 left-0 w-full h-48 bg-gradient-to-b from-transparent to-[#0A0A0F] pointer-events-none z-20" />
            </BeamsBackground>
            <Footer />
          </>
        } />

        <Route path="/projects" element={
          <ProtectedRoute onUnauthorized={() => setIsAuthOpen(true)}>
            <>
              <Navbar 
                onOpenAuth={() => setIsAuthOpen(true)}
                onNavigateHome={handleNavigateHome}
                onNavigateProjects={handleNavigateProjects}
              />
              <ProjectsView 
                projects={projects} 
                trashedProjects={trashedProjects}
                onSelectProject={handleSelectProject}
                onDeleteProject={deleteProject}
                onRestoreProject={restoreProject}
                onPermanentlyDeleteProject={permanentlyDeleteProject}
                onLoadTrash={loadTrash}
              />
              <Footer />
            </>
          </ProtectedRoute>
        } />
        
        <Route path="/new" element={
          <ProtectedRoute onUnauthorized={() => setIsAuthOpen(true)}>
            {renderEditor()}
          </ProtectedRoute>
        } />
        <Route path="/project/:id" element={
          <ProtectedRoute onUnauthorized={() => setIsAuthOpen(true)}>
            {renderEditor()}
          </ProtectedRoute>
        } />
      </Routes>

      {isAuthOpen && (
        <AuthPanel 
          onClose={() => {
            setIsAuthOpen(false);
            setPendingAction(null);
          }} 
          onSuccess={handleAuthSuccess} 
        />
      )}
    </>
  );
}

export default App;
