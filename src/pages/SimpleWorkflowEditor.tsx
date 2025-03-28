import React from 'react';
import { useNavigate } from 'react-router-dom';
import ReactFlow, {
  ReactFlowProvider,
  Background,
  Handle,
  Position,
  useNodesState,
  useEdgesState,
  getBezierPath,
  EdgeProps,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { Box, Button, Typography, Paper } from '@mui/material';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';

// Simple Start Node
const StartNode = ({ data }: { data: { label: string } }) => {
  return (
    <div style={{
      width: '100px',
      height: '100px',
      borderRadius: '50%',
      backgroundColor: '#4caf50',
      color: 'white',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      fontWeight: 'bold',
      fontSize: '18px',
      border: '3px solid #388e3c',
      boxShadow: '0 6px 10px rgba(0,0,0,0.3)',
    }}>
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
      START
    </div>
  );
};

// Simple End Node
const EndNode = ({ data }: { data: { label: string } }) => {
  return (
    <div style={{
      width: '100px',
      height: '100px',
      borderRadius: '50%',
      backgroundColor: '#f44336',
      color: 'white',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      fontWeight: 'bold',
      fontSize: '18px',
      border: '3px solid #d32f2f',
      boxShadow: '0 6px 10px rgba(0,0,0,0.3)',
    }}>
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
      END
    </div>
  );
};

// API Node
const ApiNode = ({ data }: { data: { label: string } }) => {
  return (
    <div style={{
      width: '200px',
      padding: '12px',
      borderRadius: '4px',
      backgroundColor: 'white',
      border: '2px solid #1976d2',
      boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      fontWeight: 'bold',
      color: '#1976d2',
    }}>
      <Handle 
        type="target" 
        position={Position.Top} 
        style={{ 
          width: '12px', 
          height: '12px',
          top: '-6px',
          background: '#1976d2',
          border: '2px solid white'
        }} 
      />
      API CALL
      <Handle 
        type="source" 
        position={Position.Bottom} 
        style={{ 
          width: '12px', 
          height: '12px',
          bottom: '-6px',
          background: '#1976d2',
          border: '2px solid white'
        }} 
      />
    </div>
  );
};

// Simple Button Edge
const ButtonEdge = (props: EdgeProps) => {
  const { id, sourceX, sourceY, targetX, targetY, sourcePosition, targetPosition } = props;
  
  // Calculate path
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  const handleAddNode = () => {
    console.log('+ button clicked on edge:', id);
    // This is a simplified version, so we won't implement node adding
  };

  return (
    <>
      <path
        id={id}
        style={{ strokeWidth: 3, stroke: '#555' }}
        className="react-flow__edge-path"
        d={edgePath}
      />
      
      {/* Simple + button */}
      <foreignObject
        width={40}
        height={40}
        x={labelX - 20}
        y={labelY - 20}
        requiredExtensions="http://www.w3.org/1999/xhtml"
      >
        <div
          onClick={handleAddNode}
          style={{
            backgroundColor: '#2196f3',
            color: 'white',
            width: '100%',
            height: '100%',
            borderRadius: '50%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            fontSize: '24px',
            fontWeight: 'bold',
            cursor: 'pointer',
            border: '3px solid white',
            boxShadow: '0 4px 8px rgba(0,0,0,0.4)',
            userSelect: 'none',
          }}
        >
          +
        </div>
      </foreignObject>
    </>
  );
};

// Main component
const SimpleWorkflowEditor = () => {
  const navigate = useNavigate();
  
  // Hardcoded initial nodes
  const initialNodes = [
    {
      id: 'start',
      type: 'start',
      position: { x: 400, y: 100 },
      data: { label: 'Start' },
    },
    {
      id: 'api',
      type: 'api',
      position: { x: 400, y: 250 },
      data: { label: 'API Call' },
    },
    {
      id: 'end',
      type: 'end',
      position: { x: 400, y: 400 },
      data: { label: 'End' },
    },
  ];
  
  // Hardcoded initial edges
  const initialEdges = [
    {
      id: 'start-api',
      source: 'start',
      target: 'api',
      type: 'buttonEdge',
    },
    {
      id: 'api-end',
      source: 'api',
      target: 'end',
      type: 'buttonEdge',
    },
  ];
  
  // Use React Flow hooks
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  
  // Define node types
  const nodeTypes = {
    start: StartNode,
    end: EndNode,
    api: ApiNode,
  };

  // Define edge types
  const edgeTypes = {
    buttonEdge: ButtonEdge,
  };

  // Log for debugging
  React.useEffect(() => {
    console.log('SimpleWorkflowEditor mounted');
    console.log('Nodes:', nodes);
    console.log('Edges:', edges);
    console.log('Node Types:', nodeTypes);
    console.log('Edge Types:', edgeTypes);
  }, []);

  return (
    <Box sx={{ 
      height: '100vh', 
      display: 'flex', 
      flexDirection: 'column',
      bgcolor: '#f5f5dc', // Beige background
    }}>
      {/* Header */}
      <Box 
        sx={{ 
          p: 2, 
          borderBottom: '1px solid #e0e0e0',
          display: 'flex',
          alignItems: 'center',
          bgcolor: 'white'
        }}
      >
        <Button 
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/workflows')}
          variant="outlined"
          sx={{ mr: 2 }}
        >
          Go Back
        </Button>
        
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Simple Workflow Editor (Debug)
        </Typography>
      </Box>
      
      {/* Debug info */}
      <Paper 
        elevation={3} 
        sx={{ 
          position: 'absolute', 
          top: 70, 
          left: 10, 
          p: 2, 
          zIndex: 1000,
          background: 'rgba(255, 255, 255, 0.9)',
        }}
      >
        <Typography variant="subtitle2">Debug Info:</Typography>
        <Typography variant="body2">Nodes: {nodes.length}</Typography>
        <Typography variant="body2">Edges: {edges.length}</Typography>
        <Button 
          variant="outlined" 
          size="small" 
          sx={{ mt: 1 }}
          onClick={() => console.log({ nodes, edges })}
        >
          Log Data
        </Button>
      </Paper>
      
      {/* Main content */}
      <Box sx={{ flex: 1 }}>
        <ReactFlowProvider>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            nodeTypes={nodeTypes}
            edgeTypes={edgeTypes}
            fitView
          >
            <Background color="#e0e0e0" gap={16} />
          </ReactFlow>
        </ReactFlowProvider>
      </Box>
    </Box>
  );
};

export default SimpleWorkflowEditor; 