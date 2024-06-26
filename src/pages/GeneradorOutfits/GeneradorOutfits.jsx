/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import axios from "axios";
import { Box, Button, FormControl, InputLabel, Select, MenuItem, ListItemIcon, Avatar } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

import { Skeleton } from '@mui/material';
import { FavoriteBorder } from '@mui/icons-material';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import BookmarkOutlinedIcon from '@mui/icons-material/BookmarkOutlined';
import FavoriteOutlinedIcon from '@mui/icons-material/FavoriteOutlined';


import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { NavLink } from 'react-router-dom';



export default function Outfit() {
    const [currentQuestion, setCurrentQuestion] = useState(1); // Estado inicial, mostrando la primera pregunta
    const [genero, setGenero] = useState('');
    const [tipoVestimenta, setTipoVestimenta] = useState('');
    const [longitud, setLongitud] = useState('');
    const [colorPrincipal, setColorPrincipal] = useState('');
    const [colorSecundario, setColorSecundario] = useState('');

    // Estados para controlar qué íconos mostrar
    const [isBookmarked, setIsBookmarked] = useState(false);
    const [isFavorited, setIsFavorited] = useState(false);

    const [outfit, setOutfit] = useState('')
    const [camiseta, setCamiseta] = useState([])
    const [pantalon, setPantalon] = useState('')
    const [zapatos, setZapatos] = useState('')

    const navigate = useNavigate();

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user'));
        if (!user) {
            navigate('/Login', { replace: true }); // Asegura que use la redirección como en el componente Login
        }
    }, [navigate]);

    const nextQuestion = () => {
        setCurrentQuestion(current => current + 1); // Avanza a la siguiente pregunta
    };

    const prevQuestion = () => {
        if (currentQuestion > 1) {
            setCurrentQuestion(current => current - 1); // Retrocede a la pregunta anterior
        }
    };

    const submitFilters = async () => {

        nextQuestion()

        const filters = {
            genero,
            tipoVestimenta,
            longitud,
            colorPrincipal,
            colorSecundario
        };

        try {
            const user = JSON.parse(localStorage.getItem('user')); // Obtén el token desde el almacenamiento local
            const token = user?.token; // Asegúrate de obtener el token
            const response = await axios.post('http://localhost/proyectoDaw/public/api/getOutfit', filters, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setOutfit(response.data)
            //console.log(response.data.camiseta)
            setCamiseta(response.data['camiseta'])
            setPantalon(response.data['pantalon'])
            setZapatos(response.data['zapatos'])
            console.log(response.data)
        } catch (error) {
            console.error(error);
            toast.error('Error al guardar el outfit');
        }
    };

    const handleBookmarkClick = async () => {

        console.log(camiseta)

        const outfitData = {
            camiseta: {
                camiseta_nombre: camiseta[0].nombre,
                camiseta_precio: camiseta[0].precio,
                camiseta_imagen: camiseta[0].img,
                camiseta_url: camiseta[0].url
            },
            pantalon: {
                pantalon_nombre: pantalon[0].nombre,
                pantalon_precio: pantalon[0].precio,
                pantalon_imagen: pantalon[0].img,
                pantalon_url: pantalon[0].url
            },
            zapatos: {
                zapatos_nombre: zapatos[0].nombre,
                zapatos_precio: zapatos[0].precio,
                zapatos_imagen: zapatos[0].img,
                zapatos_url: zapatos[0].url
            }
        };

        try {
            const user = JSON.parse(localStorage.getItem('user')); // Obtén el token desde el almacenamiento local
            const token = user?.token; // Asegúrate de obtener el token
            const response = await axios.post('http://localhost/proyectoDaw/public/api/create.outfit', outfitData, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            setIsBookmarked(!isBookmarked);
            if (!isBookmarked) {
                toast.success('Outfit creado correctamente');
            } else {
                toast.warn('Has eliminado el outfit');
            }
        } catch (error) {
            console.error(error);
            toast.error('Error al guardar el outfit');
        }
    }




    // Función para manejar el clic en el icono de favorito
    const handleFavoriteClick = () => {
        setIsFavorited(!isFavorited);
        if (!isFavorited) {
            toast.success('Has añadido a favoritos el outfit');

        } else {
            toast.warn('Has eliminado de favoritos el outfit');

        }
    };



    useEffect(() => {
        // Este efecto se ejecutará cada vez que colorSecundario cambie
        if (colorSecundario !== '') {
            submitFilters(); // Llama a submitFilters después de que colorSecundario se haya actualizado

        }
    }, [colorSecundario]); //



    return (
        <>

            {currentQuestion === 1 && (
                <div className='pregunta1'>
                    <h1 className='text-3xl mt-6 mb-6 font-bold'>Seleccione su Género</h1>
                    <div className="containerSelectorGeneros" style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap' }}>
                        <div style={{ margin: '0 20px' }}>
                            <div style={{ marginBottom: '10px', textAlign: 'center' }}>
                                <img src="https://www.bantoa.com/images/dimension/stilimen/outfit-category.jpg" alt="Hombre" style={{ width: '300px', height: '300px' }} />
                            </div>
                            <Button variant="contained" style={{ width: '300px', marginBottom: '30px', backgroundColor: 'white', color: 'black', borderColor: 'black' }} onClick={() => {
                                setGenero('Hombre'); // Asigna 'Hombre' al estado genero
                                nextQuestion();
                            }}>
                                Hombre
                            </Button>
                        </div>
                        <div style={{ margin: '0 20px' }}>
                            <div style={{ marginBottom: '10px', textAlign: 'center' }}>
                                <img src="https://www.bantoa.com/images/dimension/stili/outfit-category.jpg" alt="Mujer" style={{ width: '300px', height: '300px' }} />
                            </div>
                            <Button variant="contained" style={{ width: '300px', marginBottom: '30px', backgroundColor: 'white', color: 'black', borderColor: 'black' }} onClick={() => {
                                setGenero('Mujer'); // Asigna 'Mujer' al estado genero
                                nextQuestion();
                            }}>
                                Mujer
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            {currentQuestion === 2 && (
                <div className='pregunta2'>
                    <h1 className='text-3xl mt-6 mb-6 font-bold'>Seleccione el tipo de vestimenta</h1>
                    <div className="containerSelectorTipo" style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap' }}>
                        <div style={{ margin: '0 20px' }}>
                            <div style={{ marginBottom: '10px', textAlign: 'center' }}>
                                <img src="https://www.brides.com/thmb/BAkK8Sl-wCY3EQzwNiu92zcEu10=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/semi-formal-attire-recirc-REBECCA-YALE-PHOTOGRAPHY-a57b76eac9b14e4e85377c58a8df86b3.jpg" alt="Formal" style={{ width: '300px', height: '300px' }} />
                            </div>
                            <Button variant="contained" style={{ width: '300px', marginBottom: '30px', backgroundColor: 'white', color: 'black', borderColor: 'black' }} onClick={() => {
                                setTipoVestimenta('Formal'); // Asigna 'Formal' al estado tipoVestimenta
                                nextQuestion();
                            }}>
                                Formal
                            </Button>
                        </div>
                        <div style={{ margin: '0 20px' }}>
                            <div style={{ marginBottom: '10px', textAlign: 'center' }}>
                                <img src="https://i.pinimg.com/474x/be/b4/ff/beb4ff5cec2eb40a20c280adb9a69359.jpg" alt="Informal" style={{ width: '300px', height: '300px' }} />
                            </div>
                            <Button variant="contained" style={{ width: '300px', marginBottom: '30px', backgroundColor: 'white', color: 'black', borderColor: 'black' }} onClick={() => {
                                setTipoVestimenta('Informal'); // Asigna 'Informal' al estado tipoVestimenta
                                nextQuestion();
                            }}>
                                Informal
                            </Button>
                        </div>
                    </div>
                    <Button variant="contained" onClick={prevQuestion}>Anterior</Button>
                </div>
            )}

            {currentQuestion === 3 && (
                <div className='pregunta3'>
                    <h1 className='text-3xl mt-6 mb-6 font-bold'>Seleccione el largo de la vestimenta</h1>

                    <div className="containerSelectorLongitud" style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap' }}>

                        <div style={{ margin: '0 20px' }}> {/* Ajusta el ancho del contenedor para dejar espacio al margen */}
                            <div style={{ marginBottom: '10px', textAlign: 'center' }}>
                                <img src="https://s.alicdn.com/@sc04/kf/H2a6df6de322c42fba86a89f74d76732ef.jpg_300x300.jpg" alt="Longitud Corta" style={{ width: '300px', height: '300px' }} />
                            </div>
                            <Button variant="contained" style={{ width: '300px', marginBottom: '30px', backgroundColor: 'white', color: 'black', borderColor: 'black' }} onClick={() => {
                                setLongitud('Corta'); // Asigna 'Corta' al estado longitud
                                nextQuestion();
                            }}>
                                Longitud Corta
                            </Button>
                        </div>

                        <div style={{ margin: '0 20px' }}> {/* Ajusta el ancho del contenedor para dejar espacio al margen */}
                            <div style={{ marginBottom: '10px', textAlign: 'center' }}>
                                <img src="https://www.enpozuelo.es/fotos/6/202308231429069105.jpg" alt="Longitud Larga" style={{ width: '300px', height: '300px' }} />
                            </div>
                            <Button variant="contained" style={{ width: '300px', marginBottom: '30px', backgroundColor: 'white', color: 'black', borderColor: 'black' }} onClick={() => {
                                setLongitud('Larga'); // Asigna 'Larga' al estado longitud
                                nextQuestion();
                            }}>
                                Longitud Larga
                            </Button>
                        </div>
                    </div>

                    <Button variant="contained" onClick={prevQuestion}>Anterior</Button>
                </div>
            )}

            {currentQuestion === 4 && (
                <div className='pregunta4'>
                    <h1 className='text-3xl mt-6 mb-6 font-bold'>Seleccione el color Principal</h1>

                    <div className="containerSelectorColorPrincipal" style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap' }}>

                        <div style={{ margin: '0 20px' }}> {/* Ajusta el ancho del contenedor para dejar espacio al margen */}
                            <div style={{ marginBottom: '10px', textAlign: 'center' }}>
                                <div className='bg-red-600 h-20'></div>
                            </div>
                            <Button variant="contained" style={{ width: '300px', marginBottom: '30px', backgroundColor: 'white', color: 'black', borderColor: 'black' }} onClick={() => {
                                setColorPrincipal('Rojo'); // Asigna 'Rojo' al estado colorPrincipal
                                nextQuestion();
                            }}>
                                Rojo
                            </Button>
                        </div>

                        <div style={{ margin: '0 20px' }}> {/* Ajusta el ancho del contenedor para dejar espacio al margen */}
                            <div style={{ marginBottom: '10px', textAlign: 'center' }}>
                                <div className='bg-blue-600 h-20'></div>
                            </div>
                            <Button variant="contained" style={{ width: '300px', marginBottom: '30px', backgroundColor: 'white', color: 'black', borderColor: 'black' }} onClick={() => {
                                setColorPrincipal('Azul'); // Asigna 'Azul' al estado colorPrincipal
                                nextQuestion();
                            }}>
                                Azul
                            </Button>
                        </div>

                        <div style={{ margin: '0 20px' }}> {/* Ajusta el ancho del contenedor para dejar espacio al margen */}
                            <div style={{ marginBottom: '10px', textAlign: 'center' }}>
                                <div className='bg-green-600 h-20'></div>
                            </div>
                            <Button variant="contained" style={{ width: '300px', marginBottom: '30px', backgroundColor: 'white', color: 'black', borderColor: 'black' }} onClick={() => {
                                setColorPrincipal('Verde'); // Asigna 'Azul' al estado colorPrincipal
                                nextQuestion();
                            }}>
                                Verde
                            </Button>
                        </div>

                        <div style={{ margin: '0 20px' }}> {/* Ajusta el ancho del contenedor para dejar espacio al margen */}
                            <div style={{ marginBottom: '10px', textAlign: 'center' }}>
                                <div className='bg-orange-400 h-20'></div>
                            </div>
                            <Button variant="contained" style={{ width: '300px', marginBottom: '30px', backgroundColor: 'white', color: 'black', borderColor: 'black' }} onClick={() => {
                                setColorPrincipal('Naranja'); // Asigna 'Azul' al estado colorPrincipal
                                nextQuestion();
                            }}>
                                Naranja
                            </Button>
                        </div>


                        <div style={{ margin: '0 20px' }}> {/* Ajusta el ancho del contenedor para dejar espacio al margen */}
                            <div style={{ marginBottom: '10px', textAlign: 'center' }}>
                                <div className='bg-black h-20'></div>
                            </div>
                            <Button variant="contained" style={{ width: '300px', marginBottom: '30px', backgroundColor: 'white', color: 'black', borderColor: 'black' }} onClick={() => {
                                setColorPrincipal('Negro'); // Asigna 'Azul' al estado colorPrincipal
                                nextQuestion();
                            }}>
                                Negro
                            </Button>
                        </div>

                        <div style={{ margin: '0 20px' }}> {/* Ajusta el ancho del contenedor para dejar espacio al margen */}
                            <div style={{ marginBottom: '10px', textAlign: 'center' }}>
                                <div className='bg-white h-20 border border-black'></div>
                            </div>
                            <Button variant="contained" style={{ width: '300px', marginBottom: '30px', backgroundColor: 'white', color: 'black', borderColor: 'black' }} onClick={() => {
                                setColorPrincipal('Blanco'); // Asigna 'Azul' al estado colorPrincipal
                                nextQuestion();
                            }}>
                                Blanco
                            </Button>
                        </div>

                        <div style={{ margin: '0 20px' }}> {/* Ajusta el ancho del contenedor para dejar espacio al margen */}
                            <div style={{ marginBottom: '10px', textAlign: 'center' }}>
                                <div className='bg-yellow-200 h-20'></div>
                            </div>
                            <Button variant="contained" style={{ width: '300px', marginBottom: '30px', backgroundColor: 'white', color: 'black', borderColor: 'black' }} onClick={() => {
                                setColorPrincipal('Amarillo'); // Asigna 'Azul' al estado colorPrincipal
                                nextQuestion();
                            }}>
                                Amarillo
                            </Button>
                        </div>

                        <div style={{ margin: '0 20px' }}> {/* Ajusta el ancho del contenedor para dejar espacio al margen */}
                            <div style={{ marginBottom: '10px', textAlign: 'center' }}>
                                <div style={{ backgroundColor: '#b5651d' }} className='h-20'></div>
                            </div>
                            <Button variant="contained" style={{ width: '300px', marginBottom: '30px', backgroundColor: 'white', color: 'black', borderColor: 'black' }} onClick={() => {
                                setColorPrincipal('Marron'); // Asigna 'Azul' al estado colorPrincipal
                                nextQuestion();
                            }}>
                                Marrón
                            </Button>
                        </div>

                        {/*

                        <div style={{ margin: '0 20px' }}> 
                            <div style={{ marginBottom: '10px', textAlign: 'center' }}>
                                <div style={{ backgroundColor: '#800000' }} className='h-20'></div>
                            </div>
                            <Button variant="contained" style={{ width: '300px', marginBottom: '30px', backgroundColor: 'white', color: 'black', borderColor: 'black' }} onClick={() => {
                                setColorPrincipal('Granate'); // Asigna 'Azul' al estado colorPrincipal
                                nextQuestion();
                            }}>
                                Granate
                            </Button>
                        </div>

                        */}
                        <div style={{ margin: '0 20px' }}> {/* Ajusta el ancho del contenedor para dejar espacio al margen */}
                            <div style={{ marginBottom: '10px', textAlign: 'center' }}>
                                <div style={{ backgroundColor: '#f5f5dc' }} className='h-20'></div>
                            </div>
                            <Button variant="contained" style={{ width: '300px', marginBottom: '30px', backgroundColor: 'white', color: 'black', borderColor: 'black' }} onClick={() => {
                                setColorPrincipal('Beige'); // Asigna 'Azul' al estado colorPrincipal
                                nextQuestion();
                            }}>
                                Beige
                            </Button>
                        </div>

                        <div style={{ margin: '0 20px' }}> {/* Ajusta el ancho del contenedor para dejar espacio al margen */}
                            <div style={{ marginBottom: '10px', textAlign: 'center' }}>
                                <div className='bg-pink-400 h-20'></div>
                            </div>
                            <Button variant="contained" style={{ width: '300px', marginBottom: '30px', backgroundColor: 'white', color: 'black', borderColor: 'black' }} onClick={() => {
                                setColorPrincipal('Rosa'); // Asigna 'Azul' al estado colorPrincipal
                                nextQuestion();
                            }}>
                                Rosa
                            </Button>
                        </div>


                        <div style={{ margin: '0 20px' }}> {/* Ajusta el ancho del contenedor para dejar espacio al margen */}
                            <div style={{ marginBottom: '10px', textAlign: 'center' }}>
                                <div className='bg-gray-400 h-20'></div>
                            </div>
                            <Button variant="contained" style={{ width: '300px', marginBottom: '30px', backgroundColor: 'white', color: 'black', borderColor: 'black' }} onClick={() => {
                                setColorPrincipal('Gris'); // Asigna 'Azul' al estado colorPrincipal
                                nextQuestion();
                            }}>
                                Gris
                            </Button>
                        </div>
                    </div>

                    <Button variant="contained" onClick={prevQuestion}>Anterior</Button>
                </div>
            )}

            {currentQuestion === 5 && (
                <div className='pregunta5'>
                    <h1 className='text-3xl mt-6 mb-6 font-bold'>Seleccione el color Secundario</h1>

                    <div className="containerSelectorColorSecundario" style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap' }}>

                        <div style={{ margin: '0 20px' }}> {/* Ajusta el ancho del contenedor para dejar espacio al margen */}
                            <div style={{ marginBottom: '10px', textAlign: 'center' }}>
                                <div className='bg-red-600 h-20'></div>
                            </div>
                            <Button variant="contained" style={{ width: '300px', marginBottom: '30px', backgroundColor: 'white', color: 'black', borderColor: 'black' }} onClick={() => {
                                setColorSecundario('Rojo', () => {
                                    nextQuestion();
                                    submitFilters();
                                });
                            }}>
                                Rojo
                            </Button>
                        </div>

                        <div style={{ margin: '0 20px' }}> {/* Ajusta el ancho del contenedor para dejar espacio al margen */}
                            <div style={{ marginBottom: '10px', textAlign: 'center' }}>
                                <div className='bg-blue-600 h-20'></div>
                            </div>
                            <Button variant="contained" style={{ width: '300px', marginBottom: '30px', backgroundColor: 'white', color: 'black', borderColor: 'black' }} onClick={() => {
                                setColorSecundario('Azul', () => {
                                    nextQuestion();
                                    submitFilters();
                                });
                            }}>
                                Azul
                            </Button>
                        </div>

                        <div style={{ margin: '0 20px' }}> {/* Ajusta el ancho del contenedor para dejar espacio al margen */}
                            <div style={{ marginBottom: '10px', textAlign: 'center' }}>
                                <div className='bg-green-600 h-20'></div>
                            </div>
                            <Button variant="contained" style={{ width: '300px', marginBottom: '30px', backgroundColor: 'white', color: 'black', borderColor: 'black' }} onClick={() => {
                                setColorSecundario('Verde', () => {
                                    nextQuestion();
                                    submitFilters();
                                });
                            }}>
                                Verde
                            </Button>
                        </div>

                        <div style={{ margin: '0 20px' }}> {/* Ajusta el ancho del contenedor para dejar espacio al margen */}
                            <div style={{ marginBottom: '10px', textAlign: 'center' }}>
                                <div className='bg-orange-400 h-20'></div>
                            </div>
                            <Button variant="contained" style={{ width: '300px', marginBottom: '30px', backgroundColor: 'white', color: 'black', borderColor: 'black' }} onClick={() => {
                                setColorSecundario('Naranja', () => {
                                    nextQuestion();
                                    submitFilters();
                                });
                            }}>
                                Naranja
                            </Button>
                        </div>

                        <div style={{ margin: '0 20px' }}> {/* Ajusta el ancho del contenedor para dejar espacio al margen */}
                            <div style={{ marginBottom: '10px', textAlign: 'center' }}>
                                <div className='bg-black h-20'></div>
                            </div>
                            <Button variant="contained" style={{ width: '300px', marginBottom: '30px', backgroundColor: 'white', color: 'black', borderColor: 'black' }} onClick={() => {
                                setColorSecundario('Negro', () => {
                                    nextQuestion();
                                    submitFilters();
                                });
                            }}>
                                Negro
                            </Button>
                        </div>

                        <div style={{ margin: '0 20px' }}> {/* Ajusta el ancho del contenedor para dejar espacio al margen */}
                            <div style={{ marginBottom: '10px', textAlign: 'center' }}>
                                <div className='bg-white h-20 border border-black'></div>
                            </div>
                            <Button variant="contained" style={{ width: '300px', marginBottom: '30px', backgroundColor: 'white', color: 'black', borderColor: 'black' }} onClick={() => {
                                setColorSecundario('Blanco', () => {
                                    nextQuestion();
                                    submitFilters();
                                });
                            }}>
                                Blanco
                            </Button>
                        </div>

                        <div style={{ margin: '0 20px' }}> {/* Ajusta el ancho del contenedor para dejar espacio al margen */}
                            <div style={{ marginBottom: '10px', textAlign: 'center' }}>
                                <div className='bg-yellow-200 h-20'></div>
                            </div>
                            <Button variant="contained" style={{ width: '300px', marginBottom: '30px', backgroundColor: 'white', color: 'black', borderColor: 'black' }} onClick={() => {
                                setColorSecundario('Amarillo', () => {
                                    nextQuestion();
                                    submitFilters();
                                });
                            }}>
                                Amarillo
                            </Button>
                        </div>

                        <div style={{ margin: '0 20px' }}> {/* Ajusta el ancho del contenedor para dejar espacio al margen */}
                            <div style={{ marginBottom: '10px', textAlign: 'center' }}>
                                <div style={{ backgroundColor: '#b5651d' }} className='h-20'></div>
                            </div>
                            <Button variant="contained" style={{ width: '300px', marginBottom: '30px', backgroundColor: 'white', color: 'black', borderColor: 'black' }} onClick={() => {
                                setColorSecundario('Marrón', () => {
                                    nextQuestion();
                                    submitFilters();
                                });
                            }}>
                                Marrón
                            </Button>
                        </div>

                        {/* 

                        <div style={{ margin: '0 20px' }}> 
                            <div style={{ marginBottom: '10px', textAlign: 'center' }}>
                                <div style={{ backgroundColor: '#800000' }} className='h-20'></div>
                            </div>
                            <Button variant="contained" style={{ width: '300px', marginBottom: '30px', backgroundColor: 'white', color: 'black', borderColor: 'black' }} onClick={() => {
                                setColorSecundario('Granate', () => {
                                    nextQuestion();
                                    submitFilters();
                                });
                            }}>
                                Granate
                            </Button>
                        </div>

                        */}

                        <div style={{ margin: '0 20px' }}> {/* Ajusta el ancho del contenedor para dejar espacio al margen */}
                            <div style={{ marginBottom: '10px', textAlign: 'center' }}>
                                <div style={{ backgroundColor: '#f5f5dc' }} className='h-20'></div>
                            </div>
                            <Button variant="contained" style={{ width: '300px', marginBottom: '30px', backgroundColor: 'white', color: 'black', borderColor: 'black' }} onClick={() => {
                                setColorSecundario('Beige', () => {
                                    nextQuestion();
                                    submitFilters();
                                });
                            }}>
                                Beige
                            </Button>
                        </div>

                        <div style={{ margin: '0 20px' }}> {/* Ajusta el ancho del contenedor para dejar espacio al margen */}
                            <div style={{ marginBottom: '10px', textAlign: 'center' }}>
                                <div className='bg-pink-400 h-20'></div>
                            </div>
                            <Button variant="contained" style={{ width: '300px', marginBottom: '30px', backgroundColor: 'white', color: 'black', borderColor: 'black' }} onClick={() => {
                                setColorSecundario('Rosa', () => {
                                    nextQuestion();
                                    submitFilters();
                                });
                            }}>
                                Rosa
                            </Button>
                        </div>


                        <div style={{ margin: '0 20px' }}> {/* Ajusta el ancho del contenedor para dejar espacio al margen */}
                            <div style={{ marginBottom: '10px', textAlign: 'center' }}>
                                <div className='bg-gray-400 h-20'></div>
                            </div>
                            <Button variant="contained" style={{ width: '300px', marginBottom: '30px', backgroundColor: 'white', color: 'black', borderColor: 'black' }} onClick={() => {
                                setColorSecundario('Gris', () => {
                                    nextQuestion();
                                    submitFilters();
                                });
                            }}>
                                Gris
                            </Button>
                        </div>
                    </div>

                    <Button variant="contained" onClick={prevQuestion}>Anterior</Button>
                </div>
            )}





            {currentQuestion === 6 && (
                <div className='pregunta6'>
                    <h1 className='text-3xl mt-6 mb-6 font-bold'>Generador de Outfits</h1>
                    <div className="max-w-7xl mx-auto">
                        <div className="flex flex-col sm:flex-row justify-between items-center">
                            <div className="space-y-2 p-4 w-full sm:w-1/3">
                                {camiseta && pantalon && zapatos ? (
                                    <>
                                        <div className="relative w-full max-w-xs mx-auto" style={{ height: '25rem' }}>
                                            {/* Camiseta */}
                                            <div className="absolute top-0 left-0 right-0 z-10 flex justify-center">
                                                <img src={camiseta[0].img} alt={camiseta[0].nombre} className="w-full h-full object-cover rounded" />
                                            </div>
                                            {/* Pantalón */}
                                            <div className="absolute z-20 flex justify-center" style={{ transform: 'translateY(50%)', marginLeft: '6rem' }}>
                                                <img src={pantalon[0].img} alt={pantalon[0].nombre} className="w-60 h-60 object-cover rounded" />
                                            </div>
                                            {/* Zapatos */}
                                            <div className="absolute z-30 flex justify-center" style={{ transform: 'translateY(78%)' }}>
                                                <img src={zapatos[0].img} alt={zapatos[0].nombre} className="w-60 h-60 object-cover rounded" />
                                            </div>
                                        </div>

                                    </>
                                ) : (
                                    <p>Cargando...</p>
                                )}
                                <div className="relative flex items-center z-40">
                                    <div className="flex-grow border-t border-gray-500"></div>
                                    <span className="flex-shrink px-4 ml-1 mt-3">
                                        {/* Botón para bookmark */}
                                        <button className="icon-button" onClick={handleBookmarkClick}>
                                            {isBookmarked ? (
                                                <BookmarkOutlinedIcon />
                                            ) : (
                                                <BookmarkBorderIcon />
                                            )}
                                        </button>
                                    </span>
                                    <div className="flex-grow border-t border-gray-500"></div>
                                </div>
                            </div>

                            <div className="w-full sm:w-2/3">
                            <h1 className='text-2xl mb-4 font-bold text-center'>Outfits Encontrados</h1>

                                <div className="flex flex-col sm:flex-row justify-between">
                                    {camiseta && pantalon && zapatos ? (
                                        <a href={camiseta[0].url} target="_blank" style={{ textDecoration: 'none', color: 'inherit', width: '100%', marginRight: '5px', marginLeft: '5px' }}>
                                            <div className="space-y-2 p-4 border border-gray-500 shadow-lg rounded-lg bg-white mb-5 mr-5 ml-4">
                                                <img src={camiseta[0].img} alt={camiseta[0].nombre} className="h-40 mx-auto" />
                                                <div className="relative flex items-center">
                                                    <div className="flex-grow border-t border-gray-500"></div>
                                                    <span className="flex-shrink px-4 ml-1 mt-3">
                                                        <ShoppingCartOutlinedIcon />
                                                    </span>
                                                    <div className="flex-grow border-t border-gray-500"></div>
                                                </div>
                                                <div className="text-center font-bold">
                                                    <div className="text-lg">{camiseta[0].nombre}</div>
                                                    <div className="text-sm">€{camiseta[0].precio}</div>
                                                </div>
                                            </div>
                                        </a>
                                    ) : (
                                        <p>Cargando...</p>
                                    )}
                                    {pantalon && (
                                        <a href={pantalon[0].url} target="_blank" style={{ textDecoration: 'none', color: 'inherit', width: '100%', marginRight: '5px', marginLeft: '5px' }}>
                                            <div className="space-y-2 p-4 border border-gray-500 shadow-lg rounded-lg bg-white mb-5 mr-5 ml-4">
                                                <img src={pantalon[0].img} alt={pantalon[0].nombre} className="h-40 mx-auto" />
                                                <div className="relative flex items-center">
                                                    <div className="flex-grow border-t border-gray-500"></div>
                                                    <span className="flex-shrink px-4 ml-1 mt-3">
                                                        <ShoppingCartOutlinedIcon />
                                                    </span>
                                                    <div className="flex-grow border-t border-gray-500"></div>
                                                </div>
                                                <div className="text-center font-bold">
                                                    <div className="text-lg">{pantalon[0].nombre}</div>
                                                    <div className="text-sm">€{pantalon[0].precio}</div>
                                                </div>
                                            </div>
                                        </a>
                                    )}
                                    {zapatos && (
                                        <a href={zapatos[0].url} target="_blank" style={{ textDecoration: 'none', color: 'inherit', width: '100%', marginRight: '5px', marginLeft: '5px' }}>
                                            <div className="space-y-2 p-4 border border-gray-500 shadow-lg rounded-lg bg-white mb-5 mr-5 ml-4">
                                                <img src={zapatos[0].img} alt={zapatos[0].nombre} className="h-40 mx-auto" />
                                                <div className="relative flex items-center">
                                                    <div className="flex-grow border-t border-gray-500"></div>
                                                    <span className="flex-shrink px-4 ml-1 mt-3">
                                                        <ShoppingCartOutlinedIcon />
                                                    </span>
                                                    <div className="flex-grow border-t border-gray-500"></div>
                                                </div>
                                                <div className="text-center font-bold">
                                                    <div className="text-lg">{zapatos[0].nombre}</div>
                                                    <div className="text-sm">€{zapatos[0].precio}</div>
                                                </div>
                                            </div>
                                        </a>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center'}}> {/* Asegura un alto mínimo para centrado vertical también */}
                        <Card sx={{ maxWidth: 345, m: 2, backgroundColor: '#91cfb6' }}>
                            <CardContent>
                                <Typography gutterBottom variant="h5" component="div">
                                    <b>¡Acceso Limitado!</b>
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Actualmente solo puedes ver <b>UN OUTFIT</b> debido al  que tu cuenta es gratuita. <b>Si deseas ver más outfits, considera suscribirte</b> a uno de nuestros planes.
                                </Typography>
                                <NavLink to="/Subscribe" style={{ textDecoration: 'none' }}>
                                    <Typography sx={{ mt: 2, color: 'white', cursor: 'pointer', textAlign: 'center', backgroundColor:'#74a692' }}>
                                        Suscríbete Ahora
                                    </Typography>
                                </NavLink>
                            </CardContent>
                        </Card>
                    </div>

                </div>

                

                
            )}
            
        </>


    );
}
