import  { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { collection, getDocs, doc, setDoc, getDoc, query, where, deleteDoc } from 'firebase/firestore';
import { db } from '../services/firebase';
import { useAuth } from './AuthContext';
import { Workflow } from '../types/workflow';
import { v4 as uuidv4 } from 'uuid';

interface WorkflowContextProps {
  workflows: Workflow[];
  loading: boolean;
  error: string | null;
  getWorkflow: (id: string) => Promise<Workflow | null>;
  createWorkflow: (name: string, description?: string) => Promise<Workflow>;
  updateWorkflow: (workflow: Workflow) => Promise<void>;
  deleteWorkflow: (id: string) => Promise<void>;
  executeWorkflow: (id: string) => Promise<boolean>;
}

const WorkflowContext = createContext<WorkflowContextProps | undefined>(undefined);

export function useWorkflow() {
  const context = useContext(WorkflowContext);
  if (!context) {
    throw new Error('useWorkflow must be used within a WorkflowProvider');
  }
  return context;
}

interface WorkflowProviderProps {
  children: ReactNode;
}

export function WorkflowProvider({ children }: WorkflowProviderProps) {
  const [workflows, setWorkflows] = useState<Workflow[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { currentUser } = useAuth();

  useEffect(() => {
    if (!currentUser) {
      setWorkflows([]);
      setLoading(false);
      return;
    }

    const fetchWorkflows = async () => {
      try {
        setLoading(true);
        const workflowQuery = query(
          collection(db, `users/${currentUser.uid}/workflows`),
          where('ownerId', '==', currentUser.uid)
        );
        const querySnapshot = await getDocs(workflowQuery);
        const workflowsList: Workflow[] = [];
        
        querySnapshot.forEach((doc) => {
          workflowsList.push(doc.data() as Workflow);
        });
        
        setWorkflows(workflowsList);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching workflows:', err);
        setError('Failed to fetch workflows');
        setLoading(false);
      }
    };

    fetchWorkflows();
  }, [currentUser]);

  const getWorkflow = async (id: string): Promise<Workflow | null> => {
    if (!currentUser) return null;
    
    try {
      const workflowDoc = await getDoc(doc(db, `users/${currentUser.uid}/workflows`, id));
      
      if (workflowDoc.exists()) {
        return workflowDoc.data() as Workflow;
      }
      
      return null;
    } catch (err) {
      console.error('Error fetching workflow:', err);
      setError('Failed to fetch workflow');
      return null;
    }
  };

  const createWorkflow = async (name: string, description?: string): Promise<Workflow> => {
    if (!currentUser) throw new Error('User not authenticated');
    
    try {
      const workflowId = uuidv4(); // Generate a unique ID
      
      // Create a reference to the workflows collection under the user's document
      const workflowRef = doc(db, `users/${currentUser.uid}/workflows`, workflowId);
      
      const newWorkflow: Workflow = {
        id: workflowId,
        name,
        description: description || '',
        createdAt: Date.now(),
        updatedAt: Date.now(),
        ownerId: currentUser.uid,
        status: 'draft',
        nodes: [
          {
            id: uuidv4(),
            type: 'start',
            position: { x: 250, y: 25 },
            data: { label: 'Start' }
          },
          {
            id: uuidv4(),
            type: 'end',
            position: { x: 250, y: 350 },
            data: { label: 'End' }
          }
        ],
        edges: []
      };
      
      // Serialize workflow for Firestore
      const serializedWorkflow = JSON.parse(JSON.stringify(newWorkflow));
      
      // Set the document with the specific ID
      await setDoc(workflowRef, serializedWorkflow);
      
      setWorkflows(prev => [...prev, newWorkflow]);
      
      return newWorkflow;
    } catch (err) {
      console.error('Error creating workflow:', err);
      throw new Error('Failed to create workflow');
    }
  };

  const updateWorkflow = async (workflow: Workflow): Promise<void> => {
    if (!currentUser) throw new Error('User not authenticated');
    
    try {
      console.log('Starting workflow update with data:', workflow);
      
      // Ensure we have all required fields
      if (!workflow.id) throw new Error('Workflow ID is required');
      if (!workflow.name) throw new Error('Workflow name is required');
      
      const workflowRef = doc(db, `users/${currentUser.uid}/workflows`, workflow.id);
      
      const updatedWorkflow = {
        ...workflow,
        updatedAt: Date.now(),
        ownerId: currentUser.uid,
        status: workflow.status || 'draft',
        createdAt: workflow.createdAt || Date.now()
      };
      
      // Serialize workflow for Firestore
      const serializedWorkflow = JSON.parse(JSON.stringify(updatedWorkflow));
      console.log('Attempting to save workflow:', serializedWorkflow);
      
      // Save to Firestore
      await setDoc(workflowRef, serializedWorkflow);
      console.log('Successfully saved to Firestore');
      
      // Update local state
      setWorkflows(prevWorkflows => {
        const exists = prevWorkflows.some(w => w.id === workflow.id);
        if (exists) {
          return prevWorkflows.map(w => w.id === workflow.id ? updatedWorkflow : w);
        } else {
          return [...prevWorkflows, updatedWorkflow];
        }
      });
      
      console.log('Successfully updated local state');
    } catch (err) {
      console.error('Error in updateWorkflow:', err);
      if (err instanceof Error) {
        throw new Error(`Failed to update workflow: ${err.message}`);
      } else {
        throw new Error('Failed to update workflow: Unknown error');
      }
    }
  };

  const deleteWorkflow = async (id: string): Promise<void> => {
    if (!currentUser) throw new Error('User not authenticated');
    
    try {
      await deleteDoc(doc(db, `users/${currentUser.uid}/workflows`, id));
      
      setWorkflows(workflows.filter(w => w.id !== id));
    } catch (err) {
      console.error('Error deleting workflow:', err);
      setError('Failed to delete workflow');
      throw err;
    }
  };

  const executeWorkflow = async (): Promise<boolean> => {
    // Implementation of executeWorkflow if needed
    return true;
  };

  const value = {
    workflows,
    loading,
    error,
    getWorkflow,
    createWorkflow,
    updateWorkflow,
    deleteWorkflow,
    executeWorkflow
  };

  return (
    <WorkflowContext.Provider value={value}>
      {children}
    </WorkflowContext.Provider>
  );
}