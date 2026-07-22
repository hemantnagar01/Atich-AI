import React from 'react';
import { RefreshCw, CheckCircle2, AlertCircle } from 'lucide-react';
import { MermaidDiagram } from './MermaidDiagram';

interface CardProps {
  title: string;
  data: any;
  error?: string;
  isGenerating: boolean;
  onRetry?: () => void;
  children?: React.ReactNode;
}

const BaseCard: React.FC<CardProps> = ({ title, data, error, isGenerating, onRetry, children }) => {
  if (!data && !error && isGenerating) {
    return (
      <div className="glass-panel p-6 animate-pulse">
        <h3 className="text-xl font-semibold mb-4 text-text-primary flex items-center">
          <span className="w-2 h-2 rounded-full bg-accent-start mr-3 animate-ping"></span>
          {title}
        </h3>
        <div className="h-20 bg-border/20 rounded-md"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="glass-panel p-6 border-red-500/50">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold text-text-primary flex items-center">
            <AlertCircle className="w-5 h-5 text-red-400 mr-2" />
            {title}
          </h3>
          <button 
            onClick={onRetry}
            disabled={isGenerating}
            className="flex items-center text-sm text-text-secondary hover:text-white transition-colors"
          >
            <RefreshCw className={`w-4 h-4 mr-1 ${isGenerating ? 'animate-spin' : ''}`} />
            Retry
          </button>
        </div>
        <div className="text-sm text-red-300 bg-red-900/20 p-3 rounded-md border border-red-900/50">
          {error}
        </div>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="glass-panel p-6 relative overflow-hidden group">
      <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-accent-start to-accent-end opacity-0 group-hover:opacity-100 transition-opacity" />
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-text-primary flex items-center">
          <CheckCircle2 className="w-5 h-5 text-green-400 mr-2" />
          {title}
        </h3>
        {isGenerating && <RefreshCw className="w-4 h-4 text-accent-start animate-spin" />}
      </div>
      <div className="space-y-4">
        {children}
      </div>
    </div>
  );
};

export const ExecutiveSummaryCard: React.FC<Omit<CardProps, 'children'>> = (props) => (
  <BaseCard {...props}>
    <h4 className="text-2xl font-bold text-white mb-2">{props.data?.headline}</h4>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
      <div className="bg-background/50 p-4 rounded-lg border border-border">
        <div className="text-xs text-text-secondary uppercase tracking-wider mb-2">The Problem</div>
        <p className="text-sm">{props.data?.problem}</p>
      </div>
      <div className="bg-background/50 p-4 rounded-lg border border-border">
        <div className="text-xs text-text-secondary uppercase tracking-wider mb-2">The Solution</div>
        <p className="text-sm">{props.data?.solution}</p>
      </div>
    </div>
    <div className="mt-4 p-4 bg-accent-start/10 rounded-lg border border-accent-start/20">
      <div className="text-xs text-accent-start uppercase tracking-wider mb-1">Unique Value</div>
      <p className="text-sm font-medium">{props.data?.uniqueValue}</p>
    </div>
  </BaseCard>
);

export const ArchitectureCard: React.FC<Omit<CardProps, 'children'>> = (props) => (
  <BaseCard {...props}>
    <p className="text-sm text-text-secondary mb-4">{props.data?.description}</p>
    {props.data?.diagram && (
      <div className="bg-background/50 rounded-lg border border-border p-2">
        <MermaidDiagram chart={props.data.diagram} onRetry={props.onRetry} />
      </div>
    )}
    <div className="mt-4">
      <div className="text-xs text-text-secondary uppercase tracking-wider mb-2">Key Components</div>
      <div className="flex flex-wrap gap-2">
        {props.data?.components?.map((c: string, i: number) => (
          <span key={i} className="text-xs px-2 py-1 bg-surface border border-border rounded-full">{c}</span>
        ))}
      </div>
    </div>
  </BaseCard>
);

export const DatabaseCard: React.FC<Omit<CardProps, 'children'>> = (props) => (
  <BaseCard {...props}>
    <p className="text-sm text-text-secondary mb-4">{props.data?.description}</p>
    {props.data?.erd && (
      <div className="bg-background/50 rounded-lg border border-border p-2">
        <MermaidDiagram chart={props.data.erd} onRetry={props.onRetry} />
      </div>
    )}
    <div className="mt-4">
      <div className="text-xs text-text-secondary uppercase tracking-wider mb-2">Tables</div>
      <div className="flex flex-wrap gap-2">
        {props.data?.tables?.map((t: string, i: number) => (
          <span key={i} className="text-xs font-mono px-2 py-1 bg-surface border border-border rounded">{t}</span>
        ))}
      </div>
    </div>
  </BaseCard>
);

export const TechStackCard: React.FC<Omit<CardProps, 'children'>> = (props) => (
  <BaseCard {...props}>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {props.data?.stack?.map((item: any, i: number) => (
        <div key={i} className="bg-background/50 p-4 rounded-lg border border-border flex flex-col">
          <div className="flex justify-between items-start mb-2">
            <div>
              <div className="text-xs text-accent-start uppercase tracking-wider">{item.layer}</div>
              <div className="font-semibold text-white">{item.name}</div>
            </div>
            {item.docsUrl && (
              <a href={item.docsUrl} target="_blank" rel="noreferrer" className="text-xs text-text-secondary hover:text-white underline">Docs</a>
            )}
          </div>
          <p className="text-sm text-text-secondary flex-1">{item.reason}</p>
          {item.alternatives?.length > 0 && (
            <div className="mt-3 pt-3 border-t border-border/50 text-xs text-text-secondary">
              Alternatives: {item.alternatives.join(', ')}
            </div>
          )}
        </div>
      ))}
    </div>
  </BaseCard>
);

// Fallback card for other sections we haven't built custom UI for yet
export const GenericCard: React.FC<Omit<CardProps, 'children'>> = (props) => (
  <BaseCard {...props}>
    <pre className="text-xs text-text-secondary overflow-x-auto p-4 bg-background/50 rounded border border-border">
      {JSON.stringify(props.data, null, 2)}
    </pre>
  </BaseCard>
);

export const FeaturesCard: React.FC<Omit<CardProps, 'children'>> = (props) => (
  <BaseCard {...props}>
    <div className="space-y-4">
      {props.data?.items?.map((item: any, i: number) => (
        <div key={i} className="bg-background/50 p-4 rounded-lg border border-border">
          <div className="flex justify-between items-start mb-2">
            <div>
              <div className="text-xs text-accent-start uppercase tracking-wider">{item.epic}</div>
              <div className="font-semibold text-white flex items-center gap-2">
                <span className="text-xs font-mono text-text-secondary">{item.id}</span>
                {item.name}
              </div>
            </div>
            <span className={`text-xs px-2 py-1 rounded border ${item.priority === 'must' ? 'bg-red-500/10 text-red-400 border-red-500/20' : 'bg-blue-500/10 text-blue-400 border-blue-500/20'}`}>
              {item.priority === 'must' ? 'Must Have' : 'Nice to Have'}
            </span>
          </div>
          <p className="text-sm text-text-secondary mb-3">{item.description}</p>
          <div className="text-xs bg-surface p-2 rounded text-text-secondary italic border border-border/50">
            "{item.userStory}"
          </div>
        </div>
      ))}
    </div>
  </BaseCard>
);

export const UserFlowCard: React.FC<Omit<CardProps, 'children'>> = (props) => (
  <BaseCard {...props}>
    <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 md:before:mx-auto before:-translate-x-px before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-border before:to-transparent">
      {props.data?.steps?.map((step: any, i: number) => (
        <div key={i} className="relative flex items-center md:justify-between w-full">
          {/* Number (Center on desktop, left on mobile) */}
          <div className="absolute left-0 md:left-1/2 transform md:-translate-x-1/2 flex items-center justify-center w-10 h-10 rounded-full border-2 border-accent-start bg-background text-accent-start font-bold shadow-xl z-10">
            {step.step}
          </div>
          
          {/* Card */}
          <div className={`w-[calc(100%-3.5rem)] ml-14 md:ml-0 md:w-[calc(50%-3rem)] bg-background/50 p-4 rounded-lg border border-border ${i % 2 === 0 ? 'md:ml-auto' : 'md:mr-auto'}`}>
            <div className="text-xs text-accent-start uppercase tracking-wider mb-1">{step.actor}</div>
            <div className="font-medium text-white mb-2">{step.action}</div>
            <div className="text-sm text-text-secondary">Outcome: {step.outcome}</div>
          </div>
        </div>
      ))}
    </div>
  </BaseCard>
);

export const ApiEndpointsCard: React.FC<Omit<CardProps, 'children'>> = (props) => (
  <BaseCard {...props}>
    <div className="mb-4 flex gap-4">
      <div className="bg-background/50 px-3 py-2 rounded border border-border flex items-center gap-2">
        <span className="text-xs text-text-secondary uppercase">Base URL</span>
        <span className="text-sm font-mono text-white">{props.data?.baseUrl}</span>
      </div>
      <div className="bg-background/50 px-3 py-2 rounded border border-border flex items-center gap-2">
        <span className="text-xs text-text-secondary uppercase">Version</span>
        <span className="text-sm font-mono text-white">{props.data?.version}</span>
      </div>
    </div>
    <div className="space-y-3">
      {props.data?.endpoints?.map((ep: any, i: number) => (
        <div key={i} className="flex items-center justify-between bg-background/50 p-3 rounded-lg border border-border">
          <div className="flex flex-col md:flex-row md:items-center gap-3">
            <span className={`text-xs font-bold px-2 py-1 rounded w-14 text-center
              ${ep.method === 'GET' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20 border' : 
                ep.method === 'POST' ? 'bg-green-500/10 text-green-400 border-green-500/20 border' : 
                ep.method === 'PUT' ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20 border' : 
                ep.method === 'DELETE' ? 'bg-red-500/10 text-red-400 border-red-500/20 border' : 
                'bg-gray-500/10 text-gray-400 border-gray-500/20 border'}`}>
              {ep.method}
            </span>
            <span className="font-mono text-sm text-white">{ep.path}</span>
          </div>
          <div className="text-sm text-text-secondary hidden md:block">{ep.description}</div>
        </div>
      ))}
    </div>
  </BaseCard>
);

export const RoadmapCard: React.FC<Omit<CardProps, 'children'>> = (props) => (
  <BaseCard {...props}>
    <div className="grid grid-cols-1 gap-4">
      {props.data?.phases?.map((phase: any, i: number) => (
        <div key={i} className="bg-background/50 p-5 rounded-lg border border-border relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-accent-start opacity-50" />
          <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-4">
            <div>
              <div className="text-xs text-accent-start uppercase tracking-wider font-bold mb-1">{phase.phase}</div>
              <h4 className="text-lg font-bold text-white">{phase.name}</h4>
              <div className="text-sm text-text-secondary mt-1">{phase.description}</div>
            </div>
            <div className="mt-2 md:mt-0 text-xs px-2 py-1 bg-surface border border-border rounded whitespace-nowrap">
              Duration: {phase.duration}
            </div>
          </div>
          <div className="mb-4">
            <div className="text-xs text-text-secondary uppercase tracking-wider mb-2">Key Tasks</div>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {phase.tasks?.map((task: string, j: number) => (
                <li key={j} className="flex items-center text-sm text-text-primary">
                  <div className="w-1.5 h-1.5 rounded-full bg-accent-start mr-2" />
                  {task}
                </li>
              ))}
            </ul>
          </div>
          <div className="pt-3 border-t border-border/50 flex items-center">
            <div className="text-xs text-green-400 uppercase tracking-wider mr-2 font-semibold">Milestone:</div>
            <div className="text-sm font-medium text-white">{phase.milestone}</div>
          </div>
        </div>
      ))}
    </div>
  </BaseCard>
);

export const ProductVisionCard: React.FC<Omit<CardProps, 'children'>> = (props) => (
  <BaseCard {...props}>
    <div className="text-center mb-6 py-4">
      <h4 className="text-2xl md:text-3xl font-bold text-white mb-2">{props.data?.mission}</h4>
      <p className="text-accent-start font-medium text-lg italic">"{props.data?.tagline}"</p>
    </div>
    <div className="bg-background/50 p-4 rounded-lg border border-border">
      <div className="text-xs text-text-secondary uppercase tracking-wider mb-3">Key Goals</div>
      <ul className="space-y-2">
        {props.data?.goals?.map((goal: string, i: number) => (
          <li key={i} className="flex items-start text-sm text-text-primary">
            <span className="text-accent-start mr-2 mt-0.5">✦</span>
            {goal}
          </li>
        ))}
      </ul>
    </div>
  </BaseCard>
);

export const TargetUsersCard: React.FC<Omit<CardProps, 'children'>> = (props) => (
  <BaseCard {...props}>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {props.data?.users?.map((user: any, i: number) => (
        <div key={i} className="bg-background/50 p-5 rounded-lg border border-border">
          <h4 className="text-lg font-bold text-white mb-1">{user.role}</h4>
          <p className="text-sm text-text-secondary mb-4">{user.description}</p>
          
          <div className="space-y-3">
            <div>
              <div className="text-xs text-red-400/80 uppercase tracking-wider mb-1">Pain Points</div>
              <ul className="space-y-1">
                {user.painPoints?.map((pt: string, j: number) => (
                  <li key={j} className="text-xs text-text-primary flex items-start">
                    <span className="text-red-400 mr-1.5 mt-px">✕</span>
                    {pt}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <div className="text-xs text-green-400/80 uppercase tracking-wider mb-1">Goals</div>
              <ul className="space-y-1">
                {user.goals?.map((goal: string, j: number) => (
                  <li key={j} className="text-xs text-text-primary flex items-start">
                    <span className="text-green-400 mr-1.5 mt-px">✓</span>
                    {goal}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      ))}
    </div>
  </BaseCard>
);

export const DockerCard: React.FC<Omit<CardProps, 'children'>> = (props) => (
  <BaseCard {...props}>
    <div className="mb-4">
      <div className="text-xs text-text-secondary uppercase tracking-wider mb-2">Services</div>
      <div className="flex flex-wrap gap-2">
        {props.data?.services?.map((svc: string, i: number) => (
          <span key={i} className="text-xs font-mono px-2 py-1 bg-surface border border-border rounded">{svc}</span>
        ))}
      </div>
    </div>
    
    <div className="bg-[#0A0A0F] rounded-lg border border-border overflow-hidden mb-4">
      <div className="bg-surface border-b border-border px-4 py-2 text-xs font-mono text-text-secondary">docker-compose.yml</div>
      <pre className="p-4 text-xs text-text-primary overflow-x-auto whitespace-pre-wrap font-mono">
        {props.data?.composeYaml}
      </pre>
    </div>
    
    {props.data?.notes && (
      <div className="text-sm text-text-secondary bg-accent-start/10 p-3 rounded border border-accent-start/20">
        <strong className="text-accent-start text-xs uppercase block mb-1">Deployment Notes</strong>
        {props.data.notes}
      </div>
    )}
  </BaseCard>
);

export const AwsCard: React.FC<Omit<CardProps, 'children'>> = (props) => (
  <BaseCard {...props}>
    <div className="flex items-center justify-between mb-4">
      <div>
        <div className="text-xs text-text-secondary uppercase tracking-wider">Region</div>
        <div className="text-sm font-mono text-white">{props.data?.region}</div>
      </div>
    </div>

    {props.data?.deploymentDiagram && (
      <div className="bg-background/50 rounded-lg border border-border p-2 mb-4">
        <MermaidDiagram chart={props.data.deploymentDiagram} onRetry={props.onRetry} />
      </div>
    )}

    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
      <div className="bg-background/50 p-4 rounded-lg border border-border">
        <div className="text-xs text-text-secondary uppercase tracking-wider mb-2">AWS Services</div>
        <div className="flex flex-wrap gap-2">
          {props.data?.services?.map((svc: string, i: number) => (
            <span key={i} className="text-xs bg-surface border border-border rounded px-2 py-1">{svc}</span>
          ))}
        </div>
      </div>
      
      <div className="bg-background/50 p-4 rounded-lg border border-border">
        <div className="text-xs text-text-secondary uppercase tracking-wider mb-2">Deployment Steps</div>
        <ol className="list-decimal list-inside space-y-1">
          {props.data?.steps?.map((step: string, i: number) => (
            <li key={i} className="text-xs text-text-primary">{step}</li>
          ))}
        </ol>
      </div>
    </div>
    
    {props.data?.notes && (
      <div className="text-sm text-text-secondary bg-accent-start/10 p-3 rounded border border-accent-start/20">
        {props.data.notes}
      </div>
    )}
  </BaseCard>
);

export const RisksCard: React.FC<Omit<CardProps, 'children'>> = (props) => (
  <BaseCard {...props}>
    <div className="grid grid-cols-1 gap-4">
      {props.data?.items?.map((risk: any, i: number) => (
        <div key={i} className="bg-background/50 p-4 rounded-lg border border-border flex flex-col md:flex-row gap-4">
          <div className="shrink-0 w-full md:w-48">
            <div className="flex items-center gap-2 mb-2">
              <span className={`text-xs font-bold px-2 py-1 rounded 
                ${risk.severity?.toLowerCase() === 'high' ? 'bg-red-500/10 text-red-400 border-red-500/20 border' : 
                  risk.severity?.toLowerCase() === 'medium' ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20 border' : 
                  'bg-blue-500/10 text-blue-400 border-blue-500/20 border'}`}>
                {risk.severity} Risk
              </span>
              <span className="text-xs text-text-secondary">{risk.probability} Prob.</span>
            </div>
            <div className="text-xs font-mono text-text-secondary mb-1">{risk.id} • {risk.category}</div>
          </div>
          <div className="flex-1">
            <h4 className="font-semibold text-white mb-1">{risk.title}</h4>
            <p className="text-sm text-text-secondary mb-3">{risk.description}</p>
            <div className="bg-accent-start/10 p-3 rounded border border-accent-start/20">
              <div className="text-xs text-accent-start uppercase tracking-wider mb-1">Mitigation Strategy</div>
              <p className="text-sm">{risk.mitigation}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  </BaseCard>
);
