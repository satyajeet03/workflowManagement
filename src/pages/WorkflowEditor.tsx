import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ReactFlow, 
  Node,
  Edge,
  Connection,
  addEdge,
  useNodesState,
  useEdgesState,
  ReactFlowProvider,
  Panel,
  Background,
  Controls,
  NodeTypes,
  EdgeTypes,
  Handle,
  Position,
  EdgeProps,
  getBezierPath,
  useReactFlow
} from 'reactflow';
import 'reactflow/dist/style.css';
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Stack,
  IconButton,
  Drawer,
  Paper,
  Chip,
  CircularProgress,
  Snackbar,
  Alert,
  Divider,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  FormHelperText,
  Popover,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Menu,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
  Save as SaveIcon,
  Api as ApiIcon,
  Email as EmailIcon,
  Code as CodeIcon,
  TextFields as TextFieldsIcon,
  MoreHoriz as MoreHorizIcon,
  ZoomIn as ZoomInIcon,
  ZoomOut as ZoomOutIcon,
} from '@mui/icons-material';
import { useWorkflow } from '../contexts/WorkflowContext';
import { Workflow, WorkflowStep, WorkflowConnection } from '../types/workflow';
import { v4 as uuidv4 } from 'uuid';

// Define custom node components directly here instead of importing
const StartNode = ({ data }: { data: { label: string } }) => {
  console.log('Rendering StartNode with data:', data);
  return (
    <div 
      style={{ 
        background: '#4caf50',
        color: 'white',
        width: '100px',
        height: '100px',
        borderRadius: '50%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        fontWeight: 'bold',
        fontSize: '18px',
        border: '3px solid #388e3c',
        boxShadow: '0 6px 10px rgba(0,0,0,0.3)',
        position: 'relative'
      }}
    >
      <Handle 
        type="source" 
        position={Position.Bottom} 
        style={{ 
          bottom: '-6px', 
          width: '12px', 
          height: '12px', 
          background: '#388e3c',
          border: '2px solid white'
        }} 
      />
      {data.label || 'START'}
    </div>
  );
};

const EndNode = ({ data }: { data: { label: string } }) => {
  console.log('Rendering EndNode with data:', data);
  return (
    <div 
      style={{ 
        background: '#f44336',
        color: 'white',
        width: '100px',
        height: '100px',
        borderRadius: '50%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        fontWeight: 'bold',
        fontSize: '18px',
        border: '3px solid #d32f2f',
        boxShadow: '0 6px 10px rgba(0,0,0,0.3)',
        position: 'relative'
      }}
    >
      <Handle 
        type="target" 
        position={Position.Top} 
        style={{ 
          top: '-6px', 
          width: '12px', 
          height: '12px',
          background: '#d32f2f',
          border: '2px solid white'
        }} 
      />
      {data.label || 'END'}
    </div>
  );
};

const ApiNode = ({ data }: { data: { label: string; url?: string; method?: string } }) => {
  return (
    <Paper 
      sx={{ 
        padding: '10px',
        minWidth: '180px',
        borderRadius: '4px',
        border: '1px solid #1976d2',
        background: 'white',
        position: 'relative'
      }}
      elevation={2}
    >
      <Handle type="target" position={Position.Top} style={{ top: 0 }} />
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <ApiIcon color="primary" />
          <Typography variant="body1" fontWeight="medium">
            {data.label || 'API Call'}
          </Typography>
        </Box>
        <IconButton size="small" color="error" sx={{ 
          opacity: 0.8,
          '&:hover': { opacity: 1 }
        }}>
          <DeleteIcon fontSize="small" />
        </IconButton>
      </Box>
      {data.url && (
        <Typography variant="caption" sx={{ display: 'block', mt: 1, color: 'text.secondary' }}>
          {data.method || 'GET'} {data.url}
        </Typography>
      )}
      <Handle type="source" position={Position.Bottom} style={{ bottom: 0 }} />
    </Paper>
  );
};

const EmailNode = ({ data }: { data: { label: string; to?: string; subject?: string } }) => {
  return (
    <Paper 
      sx={{ 
        padding: '10px',
        minWidth: '180px',
        borderRadius: '4px',
        border: '1px solid #4caf50',
        background: 'white',
        position: 'relative'
      }}
      elevation={2}
    >
      <Handle type="target" position={Position.Top} style={{ top: 0 }} />
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <EmailIcon sx={{ color: '#4caf50' }} />
          <Typography variant="body1" fontWeight="medium">
            {data.label || 'Send Email'}
          </Typography>
        </Box>
        <IconButton size="small" color="error" sx={{ 
          opacity: 0.8,
          '&:hover': { opacity: 1 }
        }}>
          <DeleteIcon fontSize="small" />
        </IconButton>
      </Box>
      {data.to && (
        <Typography variant="caption" sx={{ display: 'block', mt: 1, color: 'text.secondary' }}>
          To: {data.to}
          {data.subject && (
            <Box component="span" sx={{ display: 'block' }}>
              Subject: {data.subject}
            </Box>
          )}
        </Typography>
      )}
      <Handle type="source" position={Position.Bottom} style={{ bottom: 0 }} />
    </Paper>
  );
};

const ConditionNode = ({ data }: { data: { label: string; condition?: string } }) => {
  return (
    <Paper 
      sx={{ 
        padding: '10px',
        minWidth: '180px',
        borderRadius: '4px',
        border: '1px solid #9c27b0',
        background: 'white',
        position: 'relative'
      }}
      elevation={2}
    >
      <Handle type="target" position={Position.Top} style={{ top: 0 }} />
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <CodeIcon sx={{ color: '#9c27b0' }} />
          <Typography variant="body1" fontWeight="medium">
            {data.label || 'Condition'}
          </Typography>
        </Box>
        <IconButton size="small" color="error" sx={{ 
          opacity: 0.8,
          '&:hover': { opacity: 1 }
        }}>
          <DeleteIcon fontSize="small" />
        </IconButton>
      </Box>
      {data.condition && (
        <Typography variant="caption" sx={{ display: 'block', mt: 1, color: 'text.secondary' }}>
          {data.condition}
        </Typography>
      )}
      <Handle 
        type="source" 
        position={Position.Bottom} 
        id="true" 
        style={{ left: '25%', bottom: 0 }} 
      />
      <Handle 
        type="source" 
        position={Position.Bottom} 
        id="false" 
        style={{ left: '75%', bottom: 0 }} 
      />
    </Paper>
  );
};

// Add TextNode component after the ConditionNode component
const TextNode = ({ data }: { data: { label: string; text?: string } }) => {
  return (
    <Paper 
      sx={{ 
        padding: '10px',
        minWidth: '180px',
        borderRadius: '4px',
        border: '1px solid #ff9800',
        background: 'white',
        position: 'relative'
      }}
      elevation={2}
    >
      <Handle type="target" position={Position.Top} style={{ top: 0 }} />
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <TextFieldsIcon sx={{ color: '#ff9800' }} />
          <Typography variant="body1" fontWeight="medium">
            {data.label || 'Text Box'}
          </Typography>
        </Box>
        <IconButton size="small" color="error" sx={{ 
          opacity: 0.8,
          '&:hover': { opacity: 1 }
        }}>
          <DeleteIcon fontSize="small" />
        </IconButton>
      </Box>
      {data.text && (
        <Typography variant="caption" sx={{ display: 'block', mt: 1, color: 'text.secondary' }}>
          {data.text}
        </Typography>
      )}
      <Handle type="source" position={Position.Bottom} style={{ bottom: 0 }} />
    </Paper>
  );
};

// Custom Edge with Add Button
const ButtonEdge = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  markerEnd,
  source,
  target
}: EdgeProps) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const reactFlowInstance = useReactFlow();

  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleAddNode = (type: string) => {
    // Create new node
    const newNode: Node = {
      id: `${type}-${Math.random()}`,
      type,
      position: {
        x: (sourceX + targetX) / 2,
        y: (sourceY + targetY) / 2
      },
      data: { 
        label: type === 'api' ? 'API Call' : 
               type === 'email' ? 'Send Email' : 
               type === 'condition' ? 'Condition' : 'Text Box' 
      }
    };

    // Create new edges
    const sourceToNewEdge: Edge = {
      id: `e${source}-${newNode.id}`,
      source: source,
      target: newNode.id,
      type: 'buttonEdge'
    };

    const newToTargetEdge: Edge = {
      id: `e${newNode.id}-${target}`,
      source: newNode.id,
      target: target,
      type: 'buttonEdge'
    };

    // Get current nodes and edges
    const { getNodes, getEdges } = reactFlowInstance;
    const currentNodes = getNodes();
    const currentEdges = getEdges();

    // Add new node and update edges
    reactFlowInstance.setNodes([...currentNodes, newNode]);
    reactFlowInstance.setEdges([
      ...currentEdges.filter(e => e.id !== id),
      sourceToNewEdge,
      newToTargetEdge
    ]);

    handleClose();
  };

  return (
    <>
      <path
        id={id}
        style={style}
        className="react-flow__edge-path"
        d={edgePath}
        markerEnd={markerEnd}
      />
      <foreignObject
        width={40}
        height={40}
        x={labelX - 20}
        y={labelY - 20}
        className="edgebutton-foreignobject"
        requiredExtensions="http://www.w3.org/1999/xhtml"
      >
        <Tooltip title="Add Node">
          <IconButton
            size="small"
            onClick={handleClick}
            sx={{
              backgroundColor: 'white',
              '&:hover': { backgroundColor: '#f5f5f5' },
              border: '1px solid #ccc',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}
          >
            <AddIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </foreignObject>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
      >
        <MenuItem onClick={() => handleAddNode('api')}>API Call</MenuItem>
        <MenuItem onClick={() => handleAddNode('email')}>Email</MenuItem>
        <MenuItem onClick={() => handleAddNode('text')}>Text Box</MenuItem>
        <MenuItem onClick={() => handleAddNode('condition')}>Condition</MenuItem>
      </Menu>
    </>
  );
};

declare global {
  interface Window {
    addNodeOnEdge?: (edgeId: string, nodeType: string) => void;
  }
}

interface WorkflowData {
  name: string;
  description: string;
  nodes: Node[];
  edges: Edge[];
  createdAt: string;
  updatedAt: string;
}

const WorkflowEditor = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getWorkflow, createWorkflow, updateWorkflow } = useWorkflow();
  
  // Debug - log the current path
  useEffect(() => {
    console.log('Current route info:', { 
      id, 
      pathname: window.location.pathname,
      fullUrl: window.location.href 
    });
    
    // Redirect to /workflows/new if there's no ID to prevent remounting issues
    if (!id && window.location.pathname !== '/workflows/new') {
      console.log('No ID provided, redirecting to /workflows/new');
      navigate('/workflows/new', { replace: true });
      return;
    }
  }, [id, navigate]);
  
  // Memoize nodeTypes and edgeTypes
  const nodeTypes = useMemo<NodeTypes>(() => ({
    start: StartNode,
    end: EndNode,
    api: ApiNode,
    email: EmailNode,
    condition: ConditionNode,
    text: TextNode,
  }), []);

  const edgeTypes = useMemo<EdgeTypes>(() => ({
    buttonEdge: ButtonEdge,
  }), []);
  
  // State management
  const [workflow, setWorkflow] = useState<Workflow | null>(null);
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [name, setName] = useState('Untitled');
  const [description, setDescription] = useState('');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [initialized, setInitialized] = useState(false);
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({
    open: false,
    message: '',
    severity: 'success',
  });
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const [reactFlowInstance, setReactFlowInstance] = useState<any>(null);
  const [zoom, setZoom] = useState(1);
  const [saveModalOpen, setSaveModalOpen] = useState(false);
  const [workflowName, setWorkflowName] = useState('');
  const [workflowDescription, setWorkflowDescription] = useState('');

  // Node click handler
  const onNodeClick = useCallback((event: React.MouseEvent, node: Node) => {
    setSelectedNode(node);
    setDrawerOpen(true);
  }, []);

  // Connection handler
  const onConnect = useCallback((params: Connection) => {
    setEdges((eds) => addEdge({ ...params, type: 'buttonEdge' }, eds));
  }, [setEdges]);

  // Load workflow effect
  useEffect(() => {
    const loadWorkflow = async () => {
      try {
        setLoading(true);
        if (!id || id === 'new') {
          // Create initial workflow structure
          const initialNodes = [
            {
              id: 'start-node',
              type: 'start',
              position: { x: 350, y: 50 },
              data: { label: 'Start' }
            },
            {
              id: 'end-node',
              type: 'end',
              position: { x: 350, y: 250 },
              data: { label: 'End' }
            }
          ];

          const initialEdges = [
            {
              id: 'edge-start-end',
              source: 'start-node',
              target: 'end-node',
              type: 'buttonEdge'
            }
          ];

          setNodes(initialNodes);
          setEdges(initialEdges);
          setName('New Workflow');
        } else {
          const workflowData = await getWorkflow(id);
          if (workflowData) {
            setNodes(workflowData.nodes || []);
            setEdges(workflowData.edges || []);
            setName(workflowData.name || 'Untitled');
            setDescription(workflowData.description || '');
          }
        }
      } catch (error) {
        console.error('Error loading workflow:', error);
      } finally {
        setLoading(false);
        setInitialized(true);
      }
    };

    loadWorkflow();
  }, [id, getWorkflow]);
  console.log('Workflow ID from params:', id);
  console.log('Workflow object ID:', workflow?.id);
  const onSave = async () => {
    try {
      setSaving(true);
      console.log('Starting workflow save process...', id);
      
      if (id === 'new') {
        console.log('Creating brand new workflow via createWorkflow function');
        const newWorkflow = await createWorkflow(name || 'New Workflow', description);
        console.log('New workflow created:', newWorkflow);
        
        // Update with current nodes and edges
        const formattedNodes = nodes.map(node => ({
          id: node.id,
          type: (node.type || 'api') as 'start' | 'end' | 'api' | 'email' | 'condition' | 'text',
          position: { 
            x: typeof node.position.x === 'number' ? node.position.x : 0,
            y: typeof node.position.y === 'number' ? node.position.y : 0 
          },
          data: node.data || { label: node.type }
        }));
        
        const formattedEdges = edges.map(edge => ({
          id: edge.id,
          source: edge.source,
          target: edge.target,
          sourceHandle: edge.sourceHandle,
          targetHandle: edge.targetHandle,
          type: edge.type || 'buttonEdge'
        }));
        
        const updatedNewWorkflow = {
          ...newWorkflow,
          nodes: formattedNodes as WorkflowStep[],
          edges: formattedEdges as WorkflowConnection[],
        };
        
        // Save the workflow with nodes and edges
        await updateWorkflow(updatedNewWorkflow);
        
        // Update local state
        setWorkflow(updatedNewWorkflow);
        
        // Redirect to the edit URL
        console.log('Redirecting to edit page with new ID:', newWorkflow.id);
        navigate(`/workflows/${newWorkflow.id}/edit`, { replace: true });
        
        setSnackbar({
          open: true,
          message: 'New workflow created and saved',
          severity: 'success',
        });
      } else {
        // Existing workflow logic
        // ...
      }
    } catch (error) {
      console.error('Error saving workflow:', error);
      setSnackbar({
        open: true,
        message: `Error saving workflow: ${error instanceof Error ? error.message : 'Unknown error'}`,
        severity: 'error',
      });
    } finally {
      setSaving(false);
    }
  };
  const handleCloseDrawer = () => {
    setDrawerOpen(false);
  };

  const onAddNode = (type: 'api' | 'email' | 'condition') => {
    const position = reactFlowInstance?.project({
      x: window.innerWidth / 2 - 100,
      y: window.innerHeight / 2 - 100,
    }) || { x: 100, y: 100 };

    const newNode = {
      id: uuidv4(),
      type,
      position,
      data: {
        label: type === 'api' ? 'API Call' : type === 'email' ? 'Send Email' : 'Condition',
      },
    };

    setNodes((nds) => [...nds, newNode]);
  };

  const onDeleteNode = useCallback(() => {
    if (!selectedNode) return;
    
    setNodes((nds) => nds.filter((node) => node.id !== selectedNode.id));
    setEdges((eds) => 
      eds.filter(
        (edge) => edge.source !== selectedNode.id && edge.target !== selectedNode.id
      )
    );
    
    setDrawerOpen(false);
  }, [selectedNode, setNodes, setEdges]);

  const updateNodeData = (data: any) => {
    if (!selectedNode) return;
    
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === selectedNode.id) {
          return {
            ...node,
            data: {
              ...node.data,
              ...data,
            },
          };
        }
        return node;
      })
    );
    
    setSelectedNode((prev) => 
      prev ? { ...prev, data: { ...prev.data, ...data } } : null
    );
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const onNodesDelete = useCallback((nodesToDelete: Node[]) => {
    nodesToDelete.forEach((node) => {
      // Find incoming and outgoing edges for the deleted node
      const incomingEdge = edges.find(edge => edge.target === node.id);
      const outgoingEdge = edges.find(edge => edge.source === node.id);

      // Only create a new connection if we have both incoming and outgoing edges
      if (incomingEdge && outgoingEdge) {
        // Create a new edge that connects the source of incoming edge to target of outgoing edge
        const newEdge: Edge = {
          id: `e${incomingEdge.source}-${outgoingEdge.target}`,
          source: incomingEdge.source,
          target: outgoingEdge.target,
          type: 'buttonEdge', // Preserve the buttonEdge type
        };

        // Update edges by removing the old edges and adding the new one
        setEdges(prevEdges => {
          const remainingEdges = prevEdges.filter(
            e => e.id !== incomingEdge.id && e.id !== outgoingEdge.id
          );
          return [...remainingEdges, newEdge];
        });
      }
    });
  }, [edges, setEdges]);

  // Add save button to the panel
  const renderSaveButton = () => (
    <Panel position="top-right">
      <Button
        variant="contained"
        color="primary"
        startIcon={<SaveIcon />}
        onClick={() => setSaveModalOpen(true)}
      >
        Save Workflow
      </Button>
    </Panel>
  );

  // Save modal component
  const renderSaveModal = () => (
    <Dialog 
      open={saveModalOpen} 
      onClose={() => setSaveModalOpen(false)}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle>Save Workflow</DialogTitle>
      <DialogContent>
        <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            label="Workflow Name"
            value={workflowName}
            onChange={(e) => setWorkflowName(e.target.value)}
            fullWidth
            required
          />
          <TextField
            label="Description"
            value={workflowDescription}
            onChange={(e) => setWorkflowDescription(e.target.value)}
            fullWidth
            multiline
            rows={4}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setSaveModalOpen(false)}>Cancel</Button>
        <Button 
          onClick={handleSaveWorkflow} 
          variant="contained" 
          color="primary"
          disabled={!workflowName}
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );

  const handleSaveWorkflow = async () => {
    try {
      if (!workflowName.trim()) {
        setSnackbar({
          open: true,
          message: 'Please enter a workflow name',
          severity: 'error',
        });
        return;
      }

      // Format nodes to match WorkflowStep type
      const formattedNodes = nodes.map(node => ({
        id: node.id,
        type: (node.type || 'api') as 'start' | 'end' | 'api' | 'email' | 'condition' | 'text',
        position: { 
          x: node.position.x, 
          y: node.position.y 
        },
        data: node.data || { label: node.type }
      })) as WorkflowStep[];

      // Format edges to match WorkflowConnection type
      const formattedEdges = edges
        .filter(edge => edge.source && edge.target)
        .map(edge => ({
          id: edge.id,
          source: edge.source,
          target: edge.target,
          sourceHandle: typeof edge.sourceHandle === 'string' ? edge.sourceHandle : undefined,
          targetHandle: typeof edge.targetHandle === 'string' ? edge.targetHandle : undefined,
          type: edge.type || 'buttonEdge'
        })) as WorkflowConnection[];

      // Create new workflow with basic info
      const savedWorkflow = await createWorkflow(workflowName, workflowDescription);

      // Update the workflow with nodes and edges
      await updateWorkflow({
        ...savedWorkflow,
        nodes: formattedNodes,
        edges: formattedEdges,
        updatedAt: Date.now()
      });

      setSaveModalOpen(false);
      setSnackbar({
        open: true,
        message: 'Workflow saved successfully',
        severity: 'success',
      });
      navigate('/workflows');
    } catch (error) {
      console.error('Error saving workflow:', error);
      setSnackbar({
        open: true,
        message: `Error saving workflow: ${error instanceof Error ? error.message : 'Unknown error'}`,
        severity: 'error',
      });
    }
  };

  // Render loading state
  if (!initialized || loading) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        width: '100vw'
      }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <ReactFlowProvider>
      <Box 
        sx={{ 
          height: '100vh', 
          display: 'flex', 
          flexDirection: 'column',
          bgcolor: '#f5f5dc', // Beige background
        }}
      >
        {/* Header */}
        <Box 
          sx={{ 
            py: 2, 
            px: 3, 
            display: 'flex', 
            alignItems: 'center',
            borderBottom: '1px solid #e0e0e0',
            bgcolor: 'white'
          }}
        >
          <Button 
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate('/workflows')}
            variant="outlined"
            sx={{ 
              mr: 2,
              borderColor: '#e0e0e0',
              color: 'text.primary',
              '&:hover': {
                borderColor: '#cccccc',
                bgcolor: '#f9f9f9'
              }
            }}
          >
            Go Back
          </Button>
          
          <Typography variant="h6" fontWeight="medium" sx={{ flex: 1 }}>
            {name}
          </Typography>
          

          <IconButton 
            sx={{ ml: 2, color: '#ffcc00' }}
            onClick={onSave}
          >
            <SaveIcon />
          </IconButton>
        </Box>
        
        {/* Main content */}
        <Box sx={{ flex: 1, position: 'relative' }}>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
              <CircularProgress />
            </Box>
          ) : (
            <div className="reactflow-wrapper" ref={reactFlowWrapper} style={{ height: '100%' }}>
              <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                onInit={(instance) => {
                  console.log('ReactFlow initialized');
                  setReactFlowInstance(instance);
                }}
                nodeTypes={nodeTypes}
                edgeTypes={edgeTypes}
                onNodeClick={onNodeClick}
                onNodesDelete={onNodesDelete}
                fitView
                snapToGrid
                snapGrid={[15, 15]}
                defaultViewport={{ x: 0, y: 0, zoom: 1.5 }}
                minZoom={0.2}
                maxZoom={4}
                onMove={(_, state) => setZoom(state.zoom)}
                proOptions={{ hideAttribution: true }}
              >
                <Background color="#e0e0e0" gap={16} size={1} />
                
                {/* Debug information */}
                <Panel position="top-left" style={{ margin: '10px' }}>
                  <Paper elevation={3} sx={{ 
                    p: 2, 
                    display: 'flex', 
                    flexDirection: 'column',
                    borderRadius: 2,
                    background: 'rgba(255, 255, 255, 0.9)',
                    fontSize: '14px'
                  }}>
                    <div><strong>Debug Info</strong></div>
                    <div>Nodes: {nodes.length}</div>
                    <div>Edges: {edges.length}</div>
                    <div style={{ marginTop: '8px' }}>
                      <Button 
                        variant="outlined" 
                        size="small"
                        onClick={() => console.log({ nodes, edges })}
                      >
                        Log Data
                      </Button>
                    </div>
                  </Paper>
                </Panel>
                
                {/* Add custom controls for better visibility */}
                <Panel position="bottom-right" style={{ margin: '10px' }}>
                  <Paper elevation={3} sx={{ p: 1, display: 'flex', alignItems: 'center', borderRadius: 2 }}>
                    <IconButton 
                      size="small"
                      onClick={() => {
                        if (reactFlowInstance) {
                          reactFlowInstance.zoomOut();
                        }
                      }}
                    >
                      <ZoomOutIcon fontSize="small" />
                    </IconButton>
                    
                    <Box 
                      sx={{ 
                        width: 100, 
                        height: 4, 
                        mx: 1, 
                        bgcolor: '#e0e0e0',
                        borderRadius: 2,
                        position: 'relative'
                      }}
                    >
                      <Box 
                        sx={{ 
                          position: 'absolute',
                          left: `${Math.min(Math.max((zoom - 0.2) / 3.8 * 100, 0), 100)}%`,
                          top: -6,
                          width: 16,
                          height: 16,
                          bgcolor: '#4caf50',
                          borderRadius: '50%',
                          border: '2px solid white'
                        }}
                      />
                    </Box>
                    
                    <IconButton 
                      size="small"
                      onClick={() => {
                        if (reactFlowInstance) {
                          reactFlowInstance.zoomIn();
                        }
                      }}
                    >
                      <ZoomInIcon fontSize="small" />
                    </IconButton>
                  </Paper>
                </Panel>
              </ReactFlow>
            </div>
          )}
        </Box>
      </Box>

      {/* Settings drawer */}
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={handleCloseDrawer}
        sx={{
          '& .MuiDrawer-paper': {
            width: '350px',
            boxSizing: 'border-box',
          },
        }}
      >
        <Box sx={{ p: 3 }}>
          <Stack direction="row" alignItems="center" spacing={1} mb={2}>
            <Typography variant="h6">
              {selectedNode?.data?.label || selectedNode?.type} Settings
            </Typography>
            <Chip 
              label={selectedNode?.type} 
              size="small" 
              color={
                selectedNode?.type === 'api' ? 'primary' : 
                selectedNode?.type === 'email' ? 'success' : 
                selectedNode?.type === 'condition' ? 'secondary' : 
                'default'
              }
            />
          </Stack>
          
          <Divider sx={{ mb: 3 }} />
          
          {selectedNode?.type === 'api' && (
            <ApiNodeSettings node={selectedNode} updateNodeData={updateNodeData} />
          )}
          {selectedNode?.type === 'email' && (
            <EmailNodeSettings node={selectedNode} updateNodeData={updateNodeData} />
          )}
          {selectedNode?.type === 'condition' && (
            <ConditionNodeSettings node={selectedNode} updateNodeData={updateNodeData} />
          )}
          {selectedNode?.type === 'text' && (
            <TextNodeSettings node={selectedNode} updateNodeData={updateNodeData} />
          )}
          {(selectedNode?.type === 'start' || selectedNode?.type === 'end') && (
            <Typography>No additional settings for this node type.</Typography>
          )}
          
          <Box sx={{ mt: 4, display: 'flex', justifyContent: 'space-between' }}>
            <Button 
              variant="outlined" 
              onClick={handleCloseDrawer}
            >
              Close
            </Button>
            
            {selectedNode?.type !== 'start' && selectedNode?.type !== 'end' && (
              <Button 
                variant="contained" 
                color="error"
                startIcon={<DeleteIcon />}
                onClick={onDeleteNode}
              >
                Delete Node
              </Button>
            )}
          </Box>
        </Box>
      </Drawer>

      {/* Snackbar messages */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>

      {renderSaveModal()}
    </ReactFlowProvider>
  );
};

// Node settings components
const ApiNodeSettings = ({ node, updateNodeData }: { node: Node, updateNodeData: (data: any) => void }) => {
  const [url, setUrl] = useState(node.data.url || '');
  const [method, setMethod] = useState(node.data.method || 'GET');
  const [headers, setHeaders] = useState(node.data.headers || '');
  const [body, setBody] = useState(node.data.body || '');
  const [label, setLabel] = useState(node.data.label || 'API Call');

  const handleSave = (field: string, value: string) => {
    const update: {[key: string]: string} = {};
    update[field] = value;
    updateNodeData(update);
  };

  return (
    <Stack spacing={3}>
      <TextField
        label="Label"
        fullWidth
        value={label}
        onChange={(e) => setLabel(e.target.value)}
        onBlur={() => handleSave('label', label)}
        variant="outlined"
        size="small"
      />
      <TextField
        label="URL"
        fullWidth
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        onBlur={() => handleSave('url', url)}
        placeholder="https://api.example.com/endpoint"
        variant="outlined"
        size="small"
      />
      <FormControl fullWidth size="small">
        <InputLabel>Method</InputLabel>
        <Select
          value={method}
          label="Method"
          onChange={(e) => {
            const newValue = e.target.value;
            setMethod(newValue);
            handleSave('method', newValue);
          }}
        >
          <MenuItem value="GET">GET</MenuItem>
          <MenuItem value="POST">POST</MenuItem>
          <MenuItem value="PUT">PUT</MenuItem>
          <MenuItem value="DELETE">DELETE</MenuItem>
        </Select>
      </FormControl>
      <TextField
        label="Headers (JSON)"
        fullWidth
        value={headers}
        onChange={(e) => setHeaders(e.target.value)}
        onBlur={() => handleSave('headers', headers)}
        placeholder='{"Content-Type": "application/json"}'
        variant="outlined"
        size="small"
        multiline
        rows={2}
      />
      <TextField
        label="Body (JSON)"
        fullWidth
        value={body}
        onChange={(e) => setBody(e.target.value)}
        onBlur={() => handleSave('body', body)}
        placeholder='{"key": "value"}'
        variant="outlined"
        size="small"
        multiline
        rows={3}
      />
    </Stack>
  );
};

const EmailNodeSettings = ({ node, updateNodeData }: { node: Node, updateNodeData: (data: any) => void }) => {
  const [to, setTo] = useState(node.data.to || '');
  const [subject, setSubject] = useState(node.data.subject || '');
  const [body, setBody] = useState(node.data.body || '');
  const [label, setLabel] = useState(node.data.label || 'Send Email');

  const handleSave = (field: string, value: string) => {
    const update: {[key: string]: string} = {};
    update[field] = value;
    updateNodeData(update);
  };

  return (
    <Stack spacing={3}>
      <TextField
        label="Label"
        fullWidth
        value={label}
        onChange={(e) => setLabel(e.target.value)}
        onBlur={() => handleSave('label', label)}
        variant="outlined"
        size="small"
      />
      <TextField
        label="To"
        fullWidth
        value={to}
        onChange={(e) => setTo(e.target.value)}
        onBlur={() => handleSave('to', to)}
        placeholder="recipient@example.com"
        variant="outlined"
        size="small"
      />
      <TextField
        label="Subject"
        fullWidth
        value={subject}
        onChange={(e) => setSubject(e.target.value)}
        onBlur={() => handleSave('subject', subject)}
        placeholder="Email Subject"
        variant="outlined"
        size="small"
      />
      <TextField
        label="Body"
        fullWidth
        value={body}
        onChange={(e) => setBody(e.target.value)}
        onBlur={() => handleSave('body', body)}
        placeholder="Email content"
        variant="outlined"
        size="small"
        multiline
        rows={4}
      />
    </Stack>
  );
};

const ConditionNodeSettings = ({ node, updateNodeData }: { node: Node, updateNodeData: (data: any) => void }) => {
  const [condition, setCondition] = useState(node.data.condition || '');
  const [label, setLabel] = useState(node.data.label || 'Condition');

  const handleSave = (field: string, value: string) => {
    const update: {[key: string]: string} = {};
    update[field] = value;
    updateNodeData(update);
  };

  return (
    <Stack spacing={3}>
      <TextField
        label="Label"
        fullWidth
        value={label}
        onChange={(e) => setLabel(e.target.value)}
        onBlur={() => handleSave('label', label)}
        variant="outlined"
        size="small"
      />
      <TextField
        label="Condition"
        fullWidth
        value={condition}
        onChange={(e) => setCondition(e.target.value)}
        onBlur={() => handleSave('condition', condition)}
        placeholder="response.status === 200"
        variant="outlined"
        size="small"
        multiline
        rows={2}
      />
      <FormHelperText>
        This condition determines which path to follow. 
        If true, flow will continue through the left output. 
        If false, flow will continue through the right output.
      </FormHelperText>
    </Stack>
  );
};

const TextNodeSettings = ({ node, updateNodeData }: { node: Node, updateNodeData: (data: any) => void }) => {
  const [text, setText] = useState(node.data.text || '');

  const handleSave = (field: string, value: string) => {
    updateNodeData({
      ...node.data,
      [field]: value
    });
  };

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>
        Text Box Settings
      </Typography>
      <Divider sx={{ mb: 2 }} />
      
      <TextField
        label="Label"
        value={node.data.label || ''}
        onChange={(e) => handleSave('label', e.target.value)}
        fullWidth
        margin="normal"
        variant="outlined"
      />
      
      <TextField
        label="Text Content"
        value={text}
        onChange={(e) => setText(e.target.value)}
        onBlur={() => handleSave('text', text)}
        fullWidth
        margin="normal"
        variant="outlined"
        multiline
        rows={4}
      />
    </Box>
  );
};

export default WorkflowEditor; 