import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import axios from 'axios';
import { toast } from 'react-toastify';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';

function Login({ setIsLoggedIn }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
      navigate('/Dashboard');
    }
  }, [navigate]);

  const handleEmailChange = (e) => setEmail(e.target.value);
  const handlePasswordChange = (e) => setPassword(e.target.value);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await axios.post('http://localhost/proyectoDaw/public/api/login', { email, password });
      localStorage.setItem('user', JSON.stringify(response.data));
      setIsLoggedIn(true);
      setIsLoading(false);
      toast.success('Sesión iniciada correctamente');
      navigate('/Dashboard');
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      toast.error('Credenciales inválidas');
      setIsLoading(false);
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
          backgroundColor: 'white',
          padding: 3,
          borderRadius: 2,
          boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
        }}
      >
       <Typography 
        component="h1" 
        variant="h5" 
        sx={{
          color: '#8d0000',
          fontWeight: 'bold',
        }}
      >
        Iniciar Sesión
      </Typography>

        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email"
            name="email"
            autoComplete="email"
            autoFocus
            value={email}
            onChange={handleEmailChange}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Contraseña"
            type="password"
            id="password"
            autoComplete="current-password"
            value={password}
            onChange={handlePasswordChange}
          />
         <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{
              mt: 3, 
              mb: 2, 
              bgcolor: '#8d0000', // Color de fondo estándar
              '&:hover': {
                bgcolor: '#8d0000', // Mantener el color rojo al hacer hover
                opacity: 0.9 // Puedes ajustar la opacidad para dar un efecto visual sutil al hacer hover
              }
            }}
            disabled={isLoading}
          >
            {isLoading ? <CircularProgress color="inherit" size={24} /> : "Iniciar Sesión"}
          </Button>
          <Link to="/Register" style={{ textDecoration: 'none' }}>
            <Typography variant="body2" color="textPrimary" align="center" sx={{ color: '#8d0000' }}>
              ¿No tienes cuenta? Regístrate
            </Typography>
          </Link>
        </Box>
      </Box>
    </Container>
  );
}

export default Login;
