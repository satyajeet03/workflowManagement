import React from 'react';
import { Handle, Position } from 'reactflow';
import { Paper, Typography, Box } from '@mui/material';
import HttpIcon from '@mui/icons-material/Http';

const ApiNode = ({ data }: { data: { label: string; url?: string; method?: string } }) => {
  return (
    <Paper 
      sx={{ 
        padding: '10px',
        minWidth: '180px',
        borderRadius: '4px',
        border: '1px solid #1976d2',
        background: 'white',
      }}
      elevation={2}
    >
      <Handle type="target" position={Position.Top} />
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <HttpIcon color="primary" />
        <Typography variant="body1" fontWeight="medium">
          {data.label || 'API Call'}
        </Typography>
      </Box>
      {data.url && (
        <Typography variant="caption" sx={{ display: 'block', mt: 1, color: 'text.secondary' }}>
          {data.method || 'GET'} {data.url}
        </Typography>
      )}
      <Handle type="source" position={Position.Bottom} />
    </Paper>
  );
};

export default ApiNode; 