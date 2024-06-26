import React from 'react';
import { useRouteError, useNavigate } from 'react-router-dom';
import { Typography, Paper, Box, Button } from '@mui/material';

export default function ErrorPage() {
  const error = useRouteError();
  const navigate = useNavigate();  // Hook for navigation

  return (
    <Box
    display="flex"
    justifyContent="center"
    alignItems="center"
    minHeight="100vh"
    sx={{ p: 4 }}
  >
    <Paper elevation={3} sx={{ maxWidth: 600, p: 4, mx: "auto", textAlign: 'center' }}>
      <Typography variant="h3" component="h1" gutterBottom>
        ¡Ups!
      </Typography>
      <Typography variant="h6" gutterBottom>
        Lo sentimos, no pudimos encontrar lo que buscabas.
      </Typography>
      <Typography variant="h6" color="textSecondary" component="i">
        Por favor, verifica la información ingresada o intenta con una búsqueda diferente.
      </Typography>
      <br/>
      <Button
        variant="contained"
        color="secondary"
        sx={{ mt: 2 }}  // Margin top for spacing
        onClick={() => navigate(-1)}  // Navigates back to the previous page
      >
        Intentar de nuevo
      </Button>
    </Paper>
  </Box>
  
  );
}
