export const sectionSchemas: Record<string, any> = {
  executiveSummary: {
    type: "object",
    properties: {
      headline: { type: "string" },
      problem: { type: "string" },
      solution: { type: "string" },
      uniqueValue: { type: "string" }
    },
    required: ["headline", "problem", "solution", "uniqueValue"],
    additionalProperties: false
  },
  productVision: {
    type: "object",
    properties: {
      mission: { type: "string" },
      tagline: { type: "string" },
      goals: { type: "array", items: { type: "string" } }
    },
    required: ["mission", "tagline", "goals"],
    additionalProperties: false
  },
  targetUsers: {
    type: "object",
    properties: {
      users: {
        type: "array",
        items: {
          type: "object",
          properties: {
            role: { type: "string" },
            description: { type: "string" },
            painPoints: { type: "array", items: { type: "string" } },
            goals: { type: "array", items: { type: "string" } }
          },
          required: ["role", "description", "painPoints", "goals"],
          additionalProperties: false
        }
      }
    },
    required: ["users"],
    additionalProperties: false
  },
  features: {
    type: "object",
    properties: {
      items: {
        type: "array",
        items: {
          type: "object",
          properties: {
            id: { type: "string" },
            name: { type: "string" },
            description: { type: "string" },
            priority: { type: "string", enum: ["must", "nice"] },
            epic: { type: "string" },
            userStory: { type: "string" }
          },
          required: ["id", "name", "description", "priority", "epic", "userStory"],
          additionalProperties: false
        }
      }
    },
    required: ["items"],
    additionalProperties: false
  },
  userFlow: {
    type: "object",
    properties: {
      steps: {
        type: "array",
        items: {
          type: "object",
          properties: {
            step: { type: "number" },
            actor: { type: "string" },
            action: { type: "string" },
            outcome: { type: "string" }
          },
          required: ["step", "actor", "action", "outcome"],
          additionalProperties: false
        }
      }
    },
    required: ["steps"],
    additionalProperties: false
  },
  techStack: {
    type: "object",
    properties: {
      stack: {
        type: "array",
        items: {
          type: "object",
          properties: {
            layer: { type: "string" },
            name: { type: "string" },
            reason: { type: "string" },
            alternatives: { type: "array", items: { type: "string" } },
            docsUrl: { type: "string" }
          },
          required: ["layer", "name", "reason", "alternatives", "docsUrl"],
          additionalProperties: false
        }
      }
    },
    required: ["stack"],
    additionalProperties: false
  },
  architecture: {
    type: "object",
    properties: {
      type: { type: "string" },
      description: { type: "string" },
      diagram: { type: "string", description: "Mermaid graph TD syntax" },
      components: { type: "array", items: { type: "string" } }
    },
    required: ["type", "description", "diagram", "components"],
    additionalProperties: false
  },
  database: {
    type: "object",
    properties: {
      type: { type: "string" },
      description: { type: "string" },
      erd: { type: "string", description: "Mermaid erDiagram syntax" },
      tables: { type: "array", items: { type: "string" } }
    },
    required: ["type", "description", "erd", "tables"],
    additionalProperties: false
  },
  api: {
    type: "object",
    properties: {
      baseUrl: { type: "string" },
      version: { type: "string" },
      endpoints: {
        type: "array",
        items: {
          type: "object",
          properties: {
            method: { type: "string" },
            path: { type: "string" },
            description: { type: "string" }
          },
          required: ["method", "path", "description"],
          additionalProperties: false
        }
      }
    },
    required: ["baseUrl", "version", "endpoints"],
    additionalProperties: false
  },
  docker: {
    type: "object",
    properties: {
      services: { type: "array", items: { type: "string" } },
      composeYaml: { type: "string" },
      notes: { type: "string" }
    },
    required: ["services", "composeYaml", "notes"],
    additionalProperties: false
  },
  aws: {
    type: "object",
    properties: {
      services: { type: "array", items: { type: "string" } },
      deploymentDiagram: { type: "string" },
      region: { type: "string" },
      steps: { type: "array", items: { type: "string" } },
      notes: { type: "string" }
    },
    required: ["services", "deploymentDiagram", "region", "steps", "notes"],
    additionalProperties: false
  },
  risks: {
    type: "object",
    properties: {
      items: {
        type: "array",
        items: {
          type: "object",
          properties: {
            id: { type: "string" },
            title: { type: "string" },
            description: { type: "string" },
            severity: { type: "string" },
            category: { type: "string" },
            mitigation: { type: "string" },
            probability: { type: "string" }
          },
          required: ["id", "title", "description", "severity", "category", "mitigation", "probability"],
          additionalProperties: false
        }
      }
    },
    required: ["items"],
    additionalProperties: false
  },
  roadmap: {
    type: "object",
    properties: {
      phases: {
        type: "array",
        items: {
          type: "object",
          properties: {
            phase: { type: "string" },
            name: { type: "string" },
            duration: { type: "string" },
            description: { type: "string" },
            tasks: { type: "array", items: { type: "string" } },
            milestone: { type: "string" }
          },
          required: ["phase", "name", "duration", "description", "tasks", "milestone"],
          additionalProperties: false
        }
      }
    },
    required: ["phases"],
    additionalProperties: false
  }
};
