import { useEffect, useState } from 'react';
import { Navbar } from './Navbar';
import { BlueprintPanel } from './BlueprintPanel';
import { ExportBar } from './ExportBar';
import { LoadingScreen } from './LoadingScreen';
import { BeamsBackground } from './BeamsBackground';

interface SharedBlueprintViewProps {
  id: string;
  onNavigateHome: () => void;
  onOpenAuth: () => void;
}

export function SharedBlueprintView({ id, onNavigateHome, onOpenAuth }: SharedBlueprintViewProps) {
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchShared = async () => {
      try {
        const isProd = import.meta.env.PROD;
        const apiUrl = import.meta.env.VITE_API_URL || (isProd ? '' : 'http://localhost:3001');
        const response = await fetch(`${apiUrl}/api/shared/${id}`);
        if (!response.ok) {
          throw new Error('Blueprint not found or inaccessible');
        }
        const json = await response.json();
        setData(json);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchShared();
  }, [id]);

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <>
      <BeamsBackground className="fixed inset-0 z-[-1]" />
      <Navbar 
        onOpenAuth={onOpenAuth} 
        onNavigateHome={onNavigateHome}
        onNavigateProjects={() => {}}
      />
      <div className="pt-24 pb-12 max-w-5xl mx-auto px-4 min-h-screen flex flex-col">
        {error ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center">
            <h1 className="text-3xl font-bold text-text-primary mb-4">Oops!</h1>
            <p className="text-text-secondary mb-8">{error}</p>
            <button 
              onClick={onNavigateHome}
              className="px-6 py-3 bg-accent-start hover:bg-accent-end transition-colors text-white rounded-xl font-medium"
            >
              Go Home
            </button>
          </div>
        ) : (
          <>
            <div className="mb-8">
              <h1 className="text-3xl font-bold tracking-tight text-text-primary mb-2 flex items-center">
                <span className="w-4 h-4 bg-accent-start rounded-sm mr-3"></span>
                {data.project_name}
              </h1>
              <p className="text-text-secondary">{data.description}</p>
            </div>
            
            <div className="flex-1 bg-surface/40 backdrop-blur-md rounded-2xl border border-white/5 overflow-hidden flex flex-col">
              <div className="p-1 flex-1 overflow-y-auto">
                <BlueprintPanel 
                  sections={data.sections} 
                  errors={{}} 
                  isGenerating={false} 
                />
              </div>
            </div>
            
            <div className="mt-4">
              <ExportBar 
                projectName={data.project_name} 
                sections={data.sections} 
                onShare={async () => `${window.location.origin}/shared/${id}`}
              />
            </div>
          </>
        )}
      </div>
    </>
  );
}
