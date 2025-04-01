
import { Handle, Position } from 'reactflow';
import { Paper, Typography, Box } from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';

const EmailNode = ({ data }: { data: { label: string; to?: string; subject?: string } }) => {
  return (
    <Paper 
      sx={{ 
        padding: '10px',
        minWidth: '180px',
        borderRadius: '4px',
        border: '1px solid #4caf50',
        background: 'white',
      }}
      elevation={2}
    >
      <Handle type="target" position={Position.Top} />
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <EmailIcon sx={{ color: '#4caf50' }} />
        <Typography variant="body1" fontWeight="medium">
          {data.label || 'Send Email'}
        </Typography>
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
      <Handle type="source" position={Position.Bottom} />
    </Paper>
  );
};

export default EmailNode; 