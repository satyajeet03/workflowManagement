export interface WorkflowStep {
  id: string;
  type: 'api' | 'email' | 'condition' | 'start' | 'end' | 'text';
  position: { x: number; y: number };
  data: {
    label: string;
    [key: string]: any;
  };
}

export interface WorkflowConnection {
  id: string;
  source: string;
  target: string;
  sourceHandle?: string;
  targetHandle?: string;
  label?: string;
  type?: string;
}

export interface Workflow {
  id: string;
  name: string;
  description?: string;
  createdAt: number;
  updatedAt: number;
  ownerId: string;
  status: 'draft' | 'active' | 'failed' | 'passed';
  lastExecutionTime?: number;
  nodes: WorkflowStep[];
  edges: WorkflowConnection[];
} 