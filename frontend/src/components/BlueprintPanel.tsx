import React from 'react';
import { 
  ExecutiveSummaryCard, 
  ArchitectureCard, 
  DatabaseCard, 
  TechStackCard, 
  FeaturesCard,
  UserFlowCard,
  ApiEndpointsCard,
  RoadmapCard,
  ProductVisionCard,
  TargetUsersCard,
  DockerCard,
  AwsCard,
  RisksCard
} from './SectionCards';

interface BlueprintPanelProps {
  sections: Record<string, any>;
  errors: Record<string, string>;
  activeGeneratingSections?: string[];
  isGenerating?: boolean; // Keep for backward compatibility with shared view
  onRetry?: (sectionName: string) => void;
}

export const BlueprintPanel: React.FC<BlueprintPanelProps> = ({ sections, errors, activeGeneratingSections = [], isGenerating = false, onRetry }) => {
  // If we haven't started generating yet and no data exists
  const isActive = isGenerating || activeGeneratingSections.length > 0;
  if (!isActive && Object.keys(sections).length === 0 && Object.keys(errors).length === 0) {
    return (
      <div className="h-full flex items-center justify-center text-text-secondary border-2 border-dashed border-border rounded-xl">
        <p>Awaiting blueprint generation...</p>
      </div>
    );
  }

  const renderSection = (key: string, title: string, CardComponent: any) => {
    return (
      <CardComponent
        key={key}
        title={title}
        data={sections[key]}
        error={errors[key]}
        isGenerating={activeGeneratingSections.includes(key) || (isGenerating && !sections[key] && !errors[key])} // Still waiting for this one
        onRetry={onRetry ? () => onRetry(key) : undefined}
      />
    );
  };

  return (
    <div id="blueprint-content" className="h-full overflow-y-auto pr-2 space-y-6 pb-20">
      {renderSection('executiveSummary', 'Executive Summary', ExecutiveSummaryCard)}
      {renderSection('architecture', 'Architecture', ArchitectureCard)}
      {renderSection('database', 'Database Schema', DatabaseCard)}
      {renderSection('techStack', 'Tech Stack', TechStackCard)}
      
      {/* Custom Cards for remaining sections */}
      {renderSection('productVision', 'Product Vision', ProductVisionCard)}
      {renderSection('targetUsers', 'Target Users', TargetUsersCard)}
      {renderSection('features', 'Features', FeaturesCard)}
      {renderSection('userFlow', 'User Flow', UserFlowCard)}
      {renderSection('api', 'API Endpoints', ApiEndpointsCard)}
      {renderSection('docker', 'Docker & Deployment', DockerCard)}
      {renderSection('aws', 'AWS Deployment', AwsCard)}
      {renderSection('risks', 'Risks & Mitigations', RisksCard)}
      {renderSection('roadmap', 'Roadmap', RoadmapCard)}
    </div>
  );
};
