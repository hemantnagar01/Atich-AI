export interface Blueprint {
  executiveSummary?: string;
  targetUsers?: string;
  userFlow?: string;
  featureList?: {
    mustHave: string[];
    niceToHave: string[];
  };
  techStack?: {
    frontend?: string;
    backend?: string;
    database?: string;
    reasoning?: string;
    alternatives?: string;
  };
  databaseSchema?: string; // Mermaid ERD string
  apiRoutes?: Array<{ method: string; path: string; description: string }>;
  architectureDiagram?: string; // Mermaid diagram string
  dockerCompose?: string;
  awsDeploymentPlan?: string;
  risks?: string[];
  roadmap?: string[];
}
