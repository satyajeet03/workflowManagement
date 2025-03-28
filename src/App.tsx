import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import { AuthProvider } from './contexts/AuthContext';
import { WorkflowProvider } from './contexts/WorkflowContext';
import Login from './pages/Login';
import Signup from './pages/Signup';
import WorkflowList from './pages/WorkflowList';
import WorkflowEditor from './pages/WorkflowEditor';
import SimpleWorkflowEditor from './pages/SimpleWorkflowEditor';
import BasicWorkflowEditor from './BasicWorkflowEditor';
import PrivateRoute from './components/PrivateRoute';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
    background: {
      default: '#f5f5f5',
    },
  },
  typography: {
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
    ].join(','),
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <WorkflowProvider>
          <Router>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              
              <Route 
                path="/workflows" 
                element={
                  <PrivateRoute>
                    <WorkflowList />
                  </PrivateRoute>
                } 
              />
              
              <Route 
                path="/workflows/new" 
                element={
                  <PrivateRoute>
                    <WorkflowEditor />
                  </PrivateRoute>
                } 
              />
              
              <Route 
                path="/workflows/:id/edit" 
                element={
                  <PrivateRoute>
                    <WorkflowEditor />
                  </PrivateRoute>
                } 
              />
              
              <Route 
                path="/workflows/:id" 
                element={
                  <PrivateRoute>
                    <WorkflowEditor />
                  </PrivateRoute>
                } 
              />
              
              <Route 
                path="/simple-workflow" 
                element={
                  <PrivateRoute>
                    <SimpleWorkflowEditor />
                  </PrivateRoute>
                } 
              />
              
              <Route path="/basic" element={<BasicWorkflowEditor />} />
              
              <Route path="/" element={<Navigate to="/login" replace />} />
            </Routes>
          </Router>
        </WorkflowProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
