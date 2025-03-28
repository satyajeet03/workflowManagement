import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Container,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  InputAdornment,
  CircularProgress,
  Snackbar,
  Alert,
  Menu,
  MenuItem,
  Pagination,
  Stack,
} from '@mui/material';
import {
  Search as SearchIcon,
  Add as AddIcon,
  Edit as EditIcon,
  PlayArrow as PlayArrowIcon,
  Star as StarIcon,
  StarBorder as StarBorderIcon,
  MoreVert as MoreVertIcon,
  Download as DownloadIcon,
  Menu as MenuIcon,
} from '@mui/icons-material';
import { useWorkflow } from '../contexts/WorkflowContext';
import { Workflow } from '../types/workflow';

const WorkflowList = () => {
  const { workflows, loading, executeWorkflow } = useWorkflow();
  const [filteredWorkflows, setFilteredWorkflows] = useState<Workflow[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedWorkflow, setSelectedWorkflow] = useState<Workflow | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [executing, setExecuting] = useState(false);
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({
    open: false,
    message: '',
    severity: 'success',
  });
  const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null);
  const [currentMenuWorkflow, setCurrentMenuWorkflow] = useState<string | null>(null);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [page, setPage] = useState(1);
  const rowsPerPage = 8;
  
  const navigate = useNavigate();

  useEffect(() => {
    if (workflows) {
      setFilteredWorkflows(
        workflows.filter((workflow) =>
          workflow.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          workflow.id.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }
  }, [workflows, searchTerm]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleExecute = (workflow: Workflow) => {
    setSelectedWorkflow(workflow);
    setOpenDialog(true);
  };

  const confirmExecution = async () => {
    if (!selectedWorkflow) return;
    
    try {
      setExecuting(true);
      const success = await executeWorkflow(selectedWorkflow.id);
      
      setSnackbar({
        open: true,
        message: success ? 'Workflow executed successfully' : 'Workflow execution failed',
        severity: success ? 'success' : 'error',
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Error executing workflow',
        severity: 'error',
      });
    } finally {
      setExecuting(false);
      setOpenDialog(false);
    }
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleOpenMenu = (event: React.MouseEvent<HTMLElement>, workflowId: string) => {
    setMenuAnchorEl(event.currentTarget);
    setCurrentMenuWorkflow(workflowId);
  };

  const handleCloseMenu = () => {
    setMenuAnchorEl(null);
    setCurrentMenuWorkflow(null);
  };

  const handleDownload = (workflowId: string) => {
    // Implement workflow export/download logic
    console.log('Downloading workflow:', workflowId);
    handleCloseMenu();
  };

  const handleDelete = (workflowId: string) => {
    // Implement workflow deletion logic
    console.log('Deleting workflow:', workflowId);
    handleCloseMenu();
  };

  const handleDuplicate = (workflowId: string) => {
    // Implement workflow duplication logic
    console.log('Duplicating workflow:', workflowId);
    handleCloseMenu();
  };

  const handleToggleFavorite = (workflowId: string) => {
    if (favorites.includes(workflowId)) {
      setFavorites(favorites.filter(id => id !== workflowId));
    } else {
      setFavorites([...favorites, workflowId]);
    }
  };

  const getStatusChip = (status: string) => {
    switch (status) {
      case 'passed':
        return <Chip label="Passed" color="success" size="small" />;
      case 'failed':
        return <Chip label="Failed" color="error" size="small" />;
      case 'draft':
        return <Chip label="Draft" color="default" size="small" />;
      case 'active':
        return <Chip label="Active" color="primary" size="small" />;
      default:
        return <Chip label={status} size="small" />;
    }
  };

  const formatDate = (timestamp: number) => {
    if (!timestamp) return 'N/A';
    
    const date = new Date(timestamp);
    // Format: "22:43 IST - 28/05"
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    
    return `${hours}:${minutes} IST - ${day}/${month}`;
  };

  const handleChangePage = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  // Calculate pagination
  const paginatedWorkflows = filteredWorkflows.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage
  );

  const pageCount = Math.ceil(filteredWorkflows.length / rowsPerPage);

  return (
    <Container maxWidth="xl">
      <Box sx={{ py: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
          <IconButton sx={{ mr: 2 }}>
            <MenuIcon />
          </IconButton>
          <Typography variant="h5" component="h1" fontWeight="bold">
            Workflow Builder
          </Typography>
        </Box>

        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          mb: 4,
          gap: 2 
        }}>
          <TextField
            placeholder="Search By Workflow Name/ID"
            value={searchTerm}
            onChange={handleSearch}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            sx={{ maxWidth: 400, flexGrow: 1 }}
            size="small"
            variant="outlined"
          />
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => navigate('/workflows/new')}
            sx={{ 
              bgcolor: 'black',
              '&:hover': {
                bgcolor: '#333',
              }
            }}
          >
            Create New Process
          </Button>
        </Box>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
            <CircularProgress />
          </Box>
        ) : filteredWorkflows.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 10 }}>
            <Typography variant="body1" color="text.secondary">
              No workflows found. Create a new workflow to get started.
            </Typography>
          </Box>
        ) : (
          <Paper sx={{ width: '100%', overflow: 'hidden', boxShadow: 'none', border: '1px solid #e0e0e0' }}>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow sx={{ borderBottom: '2px solid #f0f0f0' }}>
                    <TableCell sx={{ fontWeight: 'bold' }}>Workflow Name</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>ID</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Last Edited On</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Description</TableCell>
                    <TableCell></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {paginatedWorkflows.map((workflow) => (
                    <TableRow 
                      key={workflow.id} 
                      hover
                      sx={{ '&:hover': { cursor: 'pointer' } }}
                    >
                      <TableCell 
                        onClick={() => navigate(`/workflows/${workflow.id}`)}
                        sx={{ color: '#555', fontWeight: 'medium' }}
                      >
                        {workflow.name || 'Workflow Name here...'}
                      </TableCell>
                      <TableCell sx={{ color: '#777' }}>
                        #{workflow.id.substring(0, 3) || '494'}
                      </TableCell>
                      <TableCell sx={{ color: '#777' }}>
                        Zubin Khanna | {formatDate(workflow.updatedAt)}
                      </TableCell>
                      <TableCell sx={{ color: '#777' }}>
                        {workflow.description || 'Some Description Here Regarding The Flow...'}
                      </TableCell>
                      <TableCell align="right">
                        <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                          <IconButton 
                            size="small" 
                            onClick={() => handleToggleFavorite(workflow.id)}
                          >
                            {favorites.includes(workflow.id) ? (
                              <StarIcon sx={{ color: '#f1c40f' }} />
                            ) : (
                              <StarBorderIcon />
                            )}
                          </IconButton>
                          
                          <Button
                            size="small"
                            sx={{ 
                              minWidth: 'auto', 
                              px: 2,
                              bgcolor: '#f8f8f8',
                              color: '#555',
                              '&:hover': {
                                bgcolor: '#eee',
                              }
                            }}
                            onClick={() => handleExecute(workflow)}
                          >
                            Execute
                          </Button>
                          
                          <Button
                            size="small"
                            sx={{ 
                              minWidth: 'auto',
                              px: 2,
                              bgcolor: '#f8f8f8',
                              color: '#555',
                              '&:hover': {
                                bgcolor: '#eee',
                              }
                            }}
                            onClick={() => navigate(`/workflows/${workflow.id}/edit`)}
                          >
                            Edit
                          </Button>

                          <IconButton
                            size="small"
                            onClick={(e) => handleOpenMenu(e, workflow.id)}
                          >
                            <MoreVertIcon />
                          </IconButton>

                          <IconButton
                            size="small"
                            onClick={() => handleDownload(workflow.id)}
                          >
                            <DownloadIcon />
                          </IconButton>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            
            {pageCount > 1 && (
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'center', 
                py: 2,
                borderTop: '1px solid #f0f0f0' 
              }}>
                <Stack direction="row" spacing={1} alignItems="center">
                  <IconButton
                    size="small"
                    disabled={page === 1}
                    onClick={(e) => handleChangePage(e, page - 1)}
                  >
                    &#10094;
                  </IconButton>
                  
                  {[...Array(pageCount)].map((_, index) => (
                    <Button
                      key={index}
                      size="small"
                      variant={page === index + 1 ? "contained" : "text"}
                      sx={{ 
                        minWidth: 30,
                        bgcolor: page === index + 1 ? 'black' : 'transparent',
                        color: page === index + 1 ? 'white' : '#777',
                        '&:hover': {
                          bgcolor: page === index + 1 ? '#333' : '#f5f5f5',
                        }
                      }}
                      onClick={(e) => handleChangePage(e, index + 1)}
                    >
                      {index + 1}
                    </Button>
                  ))}
                  
                  {pageCount > 7 && <Typography>...</Typography>}
                  
                  {pageCount > 7 && (
                    <Button
                      size="small"
                      variant={page === pageCount ? "contained" : "text"}
                      sx={{ 
                        minWidth: 30,
                        bgcolor: page === pageCount ? 'black' : 'transparent',
                        color: page === pageCount ? 'white' : '#777',
                        '&:hover': {
                          bgcolor: page === pageCount ? '#333' : '#f5f5f5',
                        }
                      }}
                      onClick={(e) => handleChangePage(e, pageCount)}
                    >
                      {pageCount}
                    </Button>
                  )}
                  
                  <IconButton
                    size="small"
                    disabled={page === pageCount}
                    onClick={(e) => handleChangePage(e, page + 1)}
                  >
                    &#10095;
                  </IconButton>
                </Stack>
              </Box>
            )}
          </Paper>
        )}
      </Box>

      {/* Execution Confirmation Dialog */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          Execute Workflow
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to execute the workflow "{selectedWorkflow?.name}"?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} disabled={executing}>
            Cancel
          </Button>
          <Button 
            onClick={confirmExecution} 
            color="success" 
            variant="contained"
            autoFocus
            disabled={executing}
          >
            {executing ? <CircularProgress size={24} /> : 'Execute'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Options Menu */}
      <Menu
        anchorEl={menuAnchorEl}
        open={Boolean(menuAnchorEl)}
        onClose={handleCloseMenu}
      >
        <MenuItem onClick={() => currentMenuWorkflow && handleDuplicate(currentMenuWorkflow)}>
          Duplicate
        </MenuItem>
        <MenuItem onClick={() => currentMenuWorkflow && handleDelete(currentMenuWorkflow)}>
          Delete
        </MenuItem>
      </Menu>

      {/* Snackbar for notifications */}
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
    </Container>
  );
};

export default WorkflowList; 