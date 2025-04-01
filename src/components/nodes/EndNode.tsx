
import { Handle, Position } from 'reactflow';
import { Paper, Typography } from '@mui/material';

const EndNode = ({ data }: { data: { label: string } }) => {
  return (
    <Paper 
      sx={{ 
        padding: '10px', 
        borderRadius: '50%', 
        width: '60px', 
        height: '60px', 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center',
        background: '#f44336',
        color: 'white'
      }}
      elevation={4}
    >
      <Handle type="target" position={Position.Top} />
      <Typography variant="body2" align="center">
        {data.label || 'End'}
      </Typography>
    </Paper>
  );
};

export default EndNode; 