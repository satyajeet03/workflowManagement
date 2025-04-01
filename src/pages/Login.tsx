import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  TextField,
  Typography,
  Link,
  Container,
  Paper,
  Stack,
  Snackbar,
  Alert,
  Checkbox,
  FormControlLabel,
  Divider,
} from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import { Google as GoogleIcon,  } from '@mui/icons-material';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const { login, loginWithGoogle } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      setError('Please enter both email and password.');
      setOpenSnackbar(true);
      return;
    }
    
    try {
      setIsLoading(true);
      await login(email, password);
      navigate('/workflows');
    } catch (error: any) {
      setError(error.message || 'Failed to sign in');
      setOpenSnackbar(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  const handleGoogleSignIn = async () => {
    try {
      setIsLoading(true);
      await loginWithGoogle();
      navigate('/workflows');
    } catch (error: any) {
      setError(error.message || 'Failed to sign in with Google');
      setOpenSnackbar(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box sx={{ height: '100vh', display: 'flex', flexDirection: { xs: 'column', md: 'row' } }}>
      {/* Left side - Branding */}
      <Box 
        sx={{ 
          flex: { xs: 1, md: 1 }, 
          display: 'flex', 
          flexDirection: 'column',
          p: { xs: 4, md: 6 },
          background: 'linear-gradient(135deg, #2e7d32 0%, #1b5e20 100%)',
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%23ffffff' fill-opacity='0.1' fill-rule='evenodd'/%3E%3C/svg%3E")`,
          color: 'white',
          justifyContent: 'center',
          position: 'relative',
        }}
      >
        <Box sx={{ position: 'absolute', top: 40, left: 40 }}>
          <Stack direction="row" alignItems="center" spacing={2}>
            <Box 
              component="img" 
              src="/logo.png" 
              alt="HighBridge Logo"
              sx={{ width: 48, height: 48, filter: 'brightness(0) invert(1)' }}
            />
            <Typography variant="h4" fontWeight="bold" component="div">
              HighBridge
            </Typography>
          </Stack>
        </Box>
        
        <Box sx={{ textAlign: 'left', maxWidth: '80%' }}>
          <Typography variant="h2" fontWeight="bold" sx={{ mb: 3 }}>
            Building the Future...
          </Typography>
          
          <Typography variant="body1" sx={{ mb: 4, opacity: 0.8 }}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
          </Typography>
        </Box>
      </Box>
      
      {/* Right side - Login Form */}
      <Box 
        sx={{ 
          flex: { xs: 1, md: 1 }, 
          display: 'flex', 
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          p: { xs: 2, sm: 3 },
          background: 'linear-gradient(135deg, #2e7d32 0%, #1b5e20 100%)',
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%23ffffff' fill-opacity='0.1' fill-rule='evenodd'/%3E%3C/svg%3E")`,
          overflowY: 'auto',
        }}
      >
        <Container maxWidth="xs" sx={{ py: 4 }}>
          <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
            <Typography variant="subtitle1" gutterBottom color="text.secondary" fontWeight="medium">
              WELCOME BACK!
            </Typography>
            
            <Typography variant="h4" component="h1" fontWeight="bold" sx={{ mb: 4 }}>
              Log In to your Account
            </Typography>
            
            <Box component="form" onSubmit={handleSubmit} noValidate>
              <Typography variant="subtitle2" gutterBottom>
                Email
              </Typography>
              <TextField
                margin="dense"
                required
                fullWidth
                id="email"
                name="email"
                placeholder="Type here..."
                autoComplete="email"
                autoFocus
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                variant="outlined"
                sx={{ mb: 3 }}
              />
              
              <Typography variant="subtitle2" gutterBottom>
                Password
              </Typography>
              <TextField
                margin="dense"
                required
                fullWidth
                name="password"
                placeholder="Type here..."
                type="password"
                id="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                variant="outlined"
                sx={{ mb: 2 }}
              />
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <FormControlLabel
                  control={
                    <Checkbox 
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      sx={{ 
                        color: '#f44336',
                        '&.Mui-checked': {
                          color: '#f44336',
                        },
                      }}
                    />
                  }
                  label="Remember me"
                />
                
                <Link href="#" variant="body2" sx={{ textDecoration: 'none' }}>
                  Forgot Password?
                </Link>
              </Box>
              
              <Button
                type="submit"
                fullWidth
                variant="contained"
                disabled={isLoading}
                sx={{ 
                  mt: 2, 
                  mb: 4,
                  py: 1.5,
                  borderRadius: 2,
                  bgcolor: '#f44336',
                  '&:hover': {
                    bgcolor: '#d32f2f',
                  },
                }}
              >
                {isLoading ? 'Signing In...' : 'Log In'}
              </Button>
              
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <Divider sx={{ flex: 1 }} />
                <Typography variant="body2" color="text.secondary" sx={{ px: 2 }}>
                  Or
                </Typography>
                <Divider sx={{ flex: 1 }} />
              </Box>
              
              <Stack spacing={2}>
                <Button 
                  fullWidth 
                  variant="outlined" 
                  startIcon={<GoogleIcon />}
                  onClick={handleGoogleSignIn}
                  sx={{ 
                    py: 1.2,
                    borderRadius: 2,
                    justifyContent: 'center',
                    color: '#757575',
                    borderColor: '#e0e0e0',
                    '&:hover': {
                      borderColor: '#bdbdbd',
                      bgcolor: 'rgba(0,0,0,0.01)',
                    },
                  }}
                >
                  Log in with Google
                </Button>
                
                
              </Stack>
              
              <Box sx={{ textAlign: 'center', mt: 4, p: 1, borderRadius: 1, bgcolor: '#f5f5f5' }}>
                <Typography variant="body2" component="div">
                  New User? <Link component="button" onClick={() => navigate('/signup')} sx={{ fontWeight: 'bold', textDecoration: 'none' }}>SIGN UP HERE</Link>
                </Typography>
              </Box>
            </Box>
          </Paper>
        </Container>
      </Box>
      
      {/* Snackbar for notifications */}
      <Snackbar 
        open={openSnackbar} 
        autoHideDuration={6000} 
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity="error" sx={{ width: '100%' }}>
          {error}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Login; 