import React, { useState, useEffect } from "react";
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';

function Register({ setIsLoggedIn }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
      navigate('/Dashboard');
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await axios.post('http://localhost/proyectoDaw/public/register', {
        name, email, password, password_confirmation: passwordConfirmation
      });
      toast.success('Usuario registrado correctamente');
      const loginResponse = await axios.post('http://localhost/proyectoDaw/public/api/login', { email, password });
      localStorage.setItem('user', JSON.stringify(loginResponse.data));
      setIsLoading(false);
      setIsLoggedIn(true);
      navigate('/Dashboard');
    } catch (error) {
      console.error('Error al registrar usuario:', error);
      toast.error('Credenciales inválidas y/o en uso por otra cuenta, revíselas');
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
          Registrarse
        </Typography>

        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="name"
            label="Nombre"
            name="name"
            autoComplete="name"
            autoFocus
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email"
            name="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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
            onChange={(e) => setPassword(e.target.value)}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="passwordConfirmation"
            label="Confirmar Contraseña"
            type="password"
            id="passwordConfirmation"
            value={passwordConfirmation}
            onChange={(e) => setPasswordConfirmation(e.target.value)}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{
              mt: 3, 
              mb: 2, 
              bgcolor: '#8d0000',
              '&:hover': {
                bgcolor: '#8d0000',
                opacity: 0.9
              }
            }}
            disabled={isLoading}
          >
            {isLoading ? <CircularProgress color="inherit" size={24} /> : "Registrarse"}
          </Button>
          <Link to="/Login" style={{ textDecoration: 'none' }}>
            <Typography variant="body2" color="textPrimary" align="center" sx={{ color: '#8d0000' }}>
              ¿Ya tienes cuenta? Inicia Sesión
            </Typography>
          </Link>
        </Box>
      </Box>
    </Container>
  );
}

export default Register;
