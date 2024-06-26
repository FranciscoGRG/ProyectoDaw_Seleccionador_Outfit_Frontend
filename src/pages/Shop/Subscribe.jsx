import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

function Subscribe() {
    const navigate = useNavigate();

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user'));
        if (!user) {
            navigate('/Login', { replace: true }); // Asegura que use la redirección como en el componente Login
        }
    }, [navigate]);

    const handleBuy = async (numero) => {
        const products = [
            { producto: 'Basico', precio: 10 * 100 },
            { producto: 'Medio', precio: 20 * 100 },
            { producto: 'Superior', precio: 30 * 100 }
        ];

        try {
            const user = JSON.parse(localStorage.getItem('user'));
            const token = user?.token;

            const response = await axios.post('http://localhost/proyectoDaw/public/api/checkout', {
                producto: products[numero - 1].producto,
                precio: products[numero - 1].precio // Stripe expects the price in cents
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            });

            window.location.href = response.data; // Redirect to the Stripe checkout page
        } catch (error) {
            console.error('Error during checkout:', error);
        }
    };

    return (
        <div className="flex flex-col sm:flex-row justify-around p-5">
        {/* Plan Básico - Bronce */}
        <Card className="flex-1 text-center m-2 p-2" sx={{ backgroundColor: '#b38969' }}>
          <CardContent>
            <Typography variant="h4" component="div">Plan Básico</Typography>
            <ul>
              <li><Typography variant="h2" className="mb-1.5" style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#333' }}>10€</Typography></li>
              <li><Typography className="mb-1.5">-Incluye soporte básico</Typography></li>
              <li><Typography className="mb-1.5">-Acceso a recursos limitados</Typography></li>
            </ul>
          </CardContent>
          <CardActions>
            <Button variant="contained" style={{ backgroundColor: '#b45309' }} onClick={() => handleBuy(1)} fullWidth>Comprar</Button>
          </CardActions>
        </Card>
      
        {/* Plan Superior - Dorado */}
        <Card className="flex-1 text-center m-2 p-2" sx={{ backgroundColor: '#dec78a' }}>
          <CardContent>
            <Typography variant="h4" component="div">Plan Superior</Typography>
            <ul>
              <li><Typography variant="h2" className="mb-1.5" style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#333' }}>30€</Typography></li>
              <li><Typography className="mb-1.5">-Incluye soporte avanzado</Typography></li>
              <li><Typography className="mb-1.5">-Acceso ilimitado a todos los recursos</Typography></li>
            </ul>
          </CardContent>
          <CardActions>
            <Button variant="contained" style={{ backgroundColor: '#ca8a04' }} onClick={() => handleBuy(3)} fullWidth>Comprar</Button>
          </CardActions>
        </Card>
      
        {/* Plan Medio - Plata */}
        <Card className="flex-1 text-center m-2 p-2" sx={{ backgroundColor: '#b3b3b3' }}>
          <CardContent>
            <Typography variant="h4" component="div">Plan Medio</Typography>
            <ul>
              <li><Typography variant="h2" className="mb-1.5" style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#333' }}>20€</Typography></li>
              <li><Typography className="mb-1.5">-Soporte moderado</Typography></li>
              <li><Typography className="mb-1.5">-Acceso a una mayor variedad de recursos</Typography></li>
            </ul>
          </CardContent>
          <CardActions>
            <Button variant="contained" style={{ backgroundColor: '#71717a' }} onClick={() => handleBuy(2)} fullWidth>Comprar</Button>
          </CardActions>
        </Card>
      </div>
      
      
    );
}

export default Subscribe;
