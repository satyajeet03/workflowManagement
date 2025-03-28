import React from 'react';
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
import { Box } from '@mui/material';

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

// Main component - no routing, contexts, or complex logic
const BasicWorkflowEditor = () => {
  // Static hardcoded data
  const initialNodes = [
    {
      id: 'start',
      type: 'start',
      position: { x: 250, y: 50 },
      data: { label: 'Start' },
    },
    {
      id: 'end',
      type: 'end',
      position: { x: 250, y: 250 },
      data: { label: 'End' },
    },
  ];
  
  const initialEdges = [
    {
      id: 'start-end',
      source: 'start',
      target: 'end',
      type: 'buttonEdge',
    },
  ];
  
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  
  // Define node types
  const nodeTypes = {
    start: StartNode,
    end: EndNode,
  };

  // Define edge types
  const edgeTypes = {
    buttonEdge: ButtonEdge,
  };

  React.useEffect(() => {
    console.log('BasicWorkflowEditor mounted');
    console.log('Initial nodes:', nodes);
    console.log('Initial edges:', edges);
    
    return () => {
      console.log('BasicWorkflowEditor unmounting');
    };
  }, []);

  return (
    <Box sx={{ width: '100%', height: '100vh', bgcolor: '#f5f5dc' }}>
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
  );
};

export default BasicWorkflowEditor; 