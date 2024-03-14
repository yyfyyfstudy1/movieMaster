import React, { useState } from 'react';
import { Container, TextField, Button, Typography, Box, Tab, Tabs, Dialog, DialogTitle, DialogActions, } from '@mui/material';
import { Snackbar, Alert } from '@mui/material';


import { auth } from '../api/firebaseConfig';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [tabValue, setTabValue] = useState(0);
  const [password, setPassword] = useState('');
  const [registerSuccess, setRegisterSuccess] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [errorText, setErrorText] = useState('');

  const validateForm = () => {
    let isValid = true;
    setEmailError(false);
    setPasswordError(false);
    setErrorText('');

    if (!email) {
      setEmailError(true);
      setErrorText('Email cannot be empty');
      isValid = false;
    }
    if (!password) {
      setPasswordError(true);
      setErrorText('Password cannot be empty');
      isValid = false;
    } else if (password.length < 6) {
      setPasswordError(true);
      setErrorText('Password must be at least 6 characters long');
      isValid = false;
    }
    return isValid;
  };


  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return; // 如果验证失败，则不继续执行登录逻辑
    }
    // 在这里添加登录逻辑，例如使用Firebase auth或其他认证服务
    console.log(email, password);
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      console.log('Logged in successfully!');
      // 处理登录成功的情况，例如跳转到主页
      setSnackbarOpen(true);
      setErrorMessage('')
      setSuccessMessage('Logged in successfully!');
    } catch (error) {
      // 处理登录失败的情况
      setSnackbarOpen(true); // 显示Snackbar
      setErrorMessage("Login Failed: " + error.message); // 设置错误消息
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return; // 如果验证失败，则不继续执行注册逻辑
    }
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      console.log('Registered successfully:', userCredential.user);
      setSnackbarOpen(true); // 显示注册成功的Snackbar
      setErrorMessage('')
      setSuccessMessage('Registered successfully !');
      setTabValue(0); // 切换回登录卡片
    } catch (error) {
      setSnackbarOpen(true); // 显示Snackbar
      setErrorMessage("Error registering: " + error.message); // 设置错误消息
    }
  };



  return (

    <Container component="main" maxWidth="xs">

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000} // 6秒后自动隐藏
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        {errorMessage ? (
          <Alert onClose={() => setSnackbarOpen(false)} severity="error" sx={{ width: '100%', backgroundColor: 'black', color: 'white' }}>
            {errorMessage}
          </Alert>
        ) : (
          <Alert onClose={() => setSnackbarOpen(false)} severity="success" sx={{ width: '100%', backgroundColor: 'black', color: 'white' }}>
            {successMessage}
          </Alert>
        )}
      </Snackbar>





      <Box
        sx={{
          marginTop: 18,
          marginBottom: 10,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        {/* <Typography component="h1" variant="h5">
          Sign in
        </Typography> */}
        <Box sx={{ borderBottom: 1, borderColor: 'divider', width: '100%' }}>
          <Tabs value={tabValue} onChange={handleTabChange} aria-label="basic tabs example">
            <Tab label="Sign In" />
            <Tab label="Sign Up" />
          </Tabs>
        </Box>
        <TabPanel value={tabValue} index={0}>
          <Box component="form" onSubmit={handleLogin} noValidate sx={{ mt: 1 }}>
            <TextField
              error={emailError}
              helperText={emailError ? errorText : ''}
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <TextField
              error={passwordError}
              helperText={passwordError ? errorText : ''}
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign In
            </Button>
          </Box>
        </TabPanel>
        <TabPanel value={tabValue} index={1}>
          <Box component="form" onSubmit={handleRegister} noValidate sx={{ mt: 1 }}>
            <TextField
              error={emailError}
              helperText={emailError ? errorText : ''}
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="register-email"
              label="Email Address"
              name="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <TextField
              error={passwordError}
              helperText={passwordError ? errorText : ''}
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="register-password"
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign Up
            </Button>
          </Box>
        </TabPanel>




      </Box>
    </Container>
  );
};

export default LoginPage;
