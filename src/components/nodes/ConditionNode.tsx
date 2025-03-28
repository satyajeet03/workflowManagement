import React from 'react';
import { Handle, Position } from 'reactflow';
import { Paper, Typography, Box } from '@mui/material';
import CodeIcon from '@mui/icons-material/Code';

const ConditionNode = ({ data }: { data: { label: string; condition?: string } }) => {
  return (
    <Paper 
      sx={{ 
        padding: '10px',
        minWidth: '180px',
        borderRadius: '4px',
        border: '1px solid #9c27b0',
        background: 'white',
      }}
      elevation={2}
    >
      <Handle type="target" position={Position.Top} />
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <CodeIcon sx={{ color: '#9c27b0' }} />
        <Typography variant="body1" fontWeight="medium">
          {data.label || 'Condition'}
        </Typography>
      </Box>
      {data.condition && (
        <Typography variant="caption" sx={{ display: 'block', mt: 1, color: 'text.secondary' }}>
          {data.condition}
        </Typography>
      )}
      <Handle type="source" position={Position.Bottom} id="true" style={{ left: '25%' }} />
      <Handle type="source" position={Position.Bottom} id="false" style={{ left: '75%' }} />
    </Paper>
  );
};

export default ConditionNode; 