import React, { useState } from 'react';
import { Container, TextField, Button, Typography, Box } from '@mui/material';
import { auth } from '../api/firebaseConfig';
import { signInWithEmailAndPassword } from 'firebase/auth';
const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async(e) => {
    e.preventDefault();
    // 在这里添加登录逻辑，例如使用Firebase auth或其他认证服务
    console.log(email, password);
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      console.log('Logged in successfully!');
      // 处理登录成功的情况，例如跳转到主页
    } catch (error) {
      console.error("Error logging in: ", error.message);
      // 处理登录失败的情况
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography component="h1" variant="h5">
          Sign in
        </Typography>
        <Box component="form" onSubmit={handleLogin} noValidate sx={{ mt: 1 }}>
          <TextField
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
      </Box>
    </Container>
  );
};

export default LoginPage;
