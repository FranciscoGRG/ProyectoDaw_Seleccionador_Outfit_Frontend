/* eslint-disable no-unused-vars */
import axios from 'axios';
import React, { useState } from 'react';
import { toast } from 'react-toastify';

function TestUpdateOutfit() {

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
    const [camiseta, setCamiseta] = useState([]);
    const [pantalon, setPantalon] = useState([]);
    const [zapatos, setZapatos] = useState([]);

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
            setCamiseta(response.data['camiseta'])
            setPantalon(response.data['pantalon'])
            setZapatos(response.data['zapatos'])
        } catch (error) {
            console.error(error);
            toast.error('Error al guardar el outfit');
        }
    };


    // Función para manejar el clic en el icono de bookmark
    // const handleFavoriteClick = async () => {

    //     console.log(camiseta)

    //     const outfitData = {
    //         camiseta: {
    //             camiseta_nombre: camiseta[0].nombre,
    //             camiseta_precio: camiseta[0].precio,
    //             camiseta_imagen: camiseta[0].img,
    //             camiseta_url: camiseta[0].url
    //         },
    //         pantalon: {
    //             pantalon_nombre: pantalon[0].nombre,
    //             pantalon_precio: pantalon[0].precio,
    //             pantalon_imagen: pantalon[0].img,
    //             pantalon_url: pantalon[0].url
    //         },
    //         zapatos: {
    //             zapatos_nombre: zapatos[0].nombre,
    //             zapatos_precio: zapatos[0].precio,
    //             zapatos_imagen: zapatos[0].img,
    //             zapatos_url: zapatos[0].url
    //         }
    //     };

    //     // try {
    //     //     const user = JSON.parse(localStorage.getItem('user')); // Obtén el token desde el almacenamiento local
    //     //     const token = user?.token; // Asegúrate de obtener el token
    //     //     const response = await axios.post('https://daw08.medacarena.com.es/proyectoDaw/public/api/create.outfit', outfitData, {
    //     //         headers: {
    //     //             Authorization: `Bearer ${token}`
    //     //         }
    //     //     });
    //     //     console.log(response.data);
    //     //     // toast.success('Outfit guardado con éxito');
    //     // } catch (error) {
    //     //     console.error(error);
    //     //     // toast.error('Error al guardar el outfit');
    //     // }
    // }

    const favoritos = async () => {

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

        // try {
        //     const user = JSON.parse(localStorage.getItem('user')); // Obtén el token desde el almacenamiento local
        //     const token = user?.token; // Asegúrate de obtener el token
        //     const response = await axios.post('https://daw08.medacarena.com.es/proyectoDaw/public/api/create.outfit', outfitData, {
        //         headers: {
        //             Authorization: `Bearer ${token}`
        //         }
        //     });
        //     console.log(response.data);
        //     // toast.success('Outfit guardado con éxito');
        // } catch (error) {
        //     console.error(error);
        //     // toast.error('Error al guardar el outfit');
        // }
    }

    // Función para manejar el clic en el icono de favorito
    // const handleFavoriteClick = () => {
    //     setIsFavorited(!isFavorited);
    //     if (!isFavorited) {
    //         toast.success('Has añadido a favoritos el outfit');

    //     } else {
    //         toast.warn('Has eliminado de favoritos el outfit');

    //     }
    // };



    useEffect(() => {
        // Este efecto se ejecutará cada vez que colorSecundario cambie
        if (colorSecundario !== '') {
            submitFilters(); // Llama a submitFilters después de que colorSecundario se haya actualizado

        }
    }, [colorSecundario]); //

    return (
        <>
            <div>
                <button onClick={submitFilters}>Submit Filters</button>
                <div className="relative w-96 h-96 mx-auto">
                    {camiseta[0].img &&  pantalon[0].img && zapatos[0].img(

                    )}
            </div>
        </div >
        </>
    )
}

export default TestUpdateOutfit
