
import { Handle, Position } from 'reactflow';
import { Paper, Typography } from '@mui/material';

const StartNode = ({ data }: { data: { label: string } }) => {
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
        background: '#4caf50',
        color: 'white'
      }}
      elevation={4}
    >
      <Handle type="source" position={Position.Bottom} />
      <Typography variant="body2" align="center">
        {data.label || 'Start'}
      </Typography>
    </Paper>
  );
};

export default StartNode; 