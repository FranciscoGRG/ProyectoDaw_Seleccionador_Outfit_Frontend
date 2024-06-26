import axios from 'axios';
import React, { useEffect, useState } from 'react';
import Avatar from '@mui/material/Avatar';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined';
import Typography from '@mui/material/Typography';
import { toast } from 'react-toastify';
import Skeleton from '@mui/material/Skeleton';


function ShowOutfits() {
    const [outfits, setOutfits] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOutfits = async () => {
            try {
                const response = await axios.get('http://localhost/proyectoDaw/public/api/showAll.outfit');
                const outfitsWithUser = await Promise.all(response.data.map(async outfit => {
                    const userResponse = await axios.get(`http://localhost/proyectoDaw/public/api/getUser/${outfit.user_id}`);
                    const userHasLiked = JSON.parse(localStorage.getItem(`likedOutfit_${outfit.id}`)) || false;
                    return { ...outfit, user: userResponse.data, userHasLiked };
                }));

                outfitsWithUser.sort((a, b) => b.likes - a.likes);

                setOutfits(outfitsWithUser);
                console.log(outfitsWithUser);
                setLoading(false);
            } catch (error) {
                console.error(error);
            }
        };

        fetchOutfits();
    }, []);

    const handleLike = async (outfit_id, camisetaNombre, camisetaPrecio, camisetaImg, camisetaUrl, pantalonNombre, pantalonPrecio, pantalonImg, pantalonUrl,
        zapatosNombre, zapatosPrecio, zapatosImg, zapatosUrl, user_id
    ) => {
        try {
            const user = JSON.parse(localStorage.getItem('user'));
            const token = user?.token;

            const response = await axios.put(
                'http://localhost/proyectoDaw/public/api/updateLike.outfit',
                { id: outfit_id },
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            setOutfits(prevOutfits => prevOutfits.map(outfit =>
                outfit.id === outfit_id ? { ...outfit, likes: response.data.likes, userHasLiked: true } : outfit
            ));

            localStorage.setItem(`likedOutfit_${outfit_id}`, JSON.stringify(true));

            const outfitData = {
                camiseta: {
                    camiseta_nombre: camisetaNombre,
                    camiseta_precio: camisetaPrecio,
                    camiseta_imagen: camisetaImg,
                    camiseta_url: camisetaUrl
                },
                pantalon: {
                    pantalon_nombre: pantalonNombre,
                    pantalon_precio: pantalonPrecio,
                    pantalon_imagen: pantalonImg,
                    pantalon_url: pantalonUrl
                },
                zapatos: {
                    zapatos_nombre: zapatosNombre,
                    zapatos_precio: zapatosPrecio,
                    zapatos_imagen: zapatosImg,
                    zapatos_url: zapatosUrl
                },
                user_id: user_id,
                outfit_id: outfit_id,
            };

            try {
                const user = JSON.parse(localStorage.getItem('user')); // Obtén el token desde el almacenamiento local
                const token = user?.token; // Asegúrate de obtener el token
                const response = await axios.post('http://localhost/proyectoDaw/public/api/add.favoriteClothes', outfitData, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                console.log(response.data)
                toast.success('Se ha dado like correctamente');
            } catch (error) {
                console.error(error);
                toast.error('Error al guardar el outfit');
            }

        } catch (error) {
            console.error('Error al dar like:', error);
        }
    };

    const handleDeleteOutfit = async (outfit_id) => {
        try {
            const user = JSON.parse(localStorage.getItem('user'));
            const token = user?.token;

            await axios.delete(
                `http://localhost/proyectoDaw/public/api/delete.outfit/${outfit_id}`,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    }
                }
            );

            setOutfits(prevOutfits => prevOutfits.filter(outfit => outfit.id !== outfit_id));
        } catch (error) {
            console.error('Error al eliminar outfit:', error);
        }
    };

    return (
        <div className="max-w-6xl mx-auto p-8">
            <h2 className="text-4xl font-extrabold mb-8 text-center text-white">Top Outfits</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {loading ? (
                    Array.from(new Array(6)).map((_, index) => (
                        <div key={index} className="bg-white p-6 rounded-lg shadow-lg ">
                            <div className="flex items-center mb-4">
                                <Skeleton variant="circular" width={50} height={50} animation="wave" />
                                <Skeleton variant="text" width={100} height={30} animation="wave" />
                            </div>
                            <div className="flex justify-around">
                                <Skeleton variant="rectangular" width="32%" height={256} animation="wave" />
                                <Skeleton variant="rectangular" width="32%" height={256} animation="wave" />
                                <Skeleton variant="rectangular" width="32%" height={256} animation="wave" />
                            </div>
                            <div className="mt-6">
                                <Skeleton variant="rectangular" width="100%" height={40} animation="wave" />
                            </div>
                        </div>
                    ))
                ) : (
                    outfits.length > 0 ? (
                        outfits.map((outfit) => {
                            const totalPrice = outfit.camiseta.precio + outfit.pantalon.precio + outfit.zapatos.precio;
                            return (
                                <div key={outfit.id} className="bg-white p-6 rounded-lg shadow-lg w-full">
                                    <div className="flex items-center mb-4">
                                        <Avatar src={'http://localhost/proyectoDaw/public/storage/profile_images/' + outfit.user?.profile_image} alt="Imagen de Usuario" sx={{ width: 50, height: 50 }} />
                                        <p className="ml-4 font-bold">{outfit.user ? outfit.user.name : 'Usuario desconocido'}</p>
                                    </div>

                                    <hr />
                                    <div className="flex justify-around">
                                        <div className="w-1/3 p-2">
                                            <h4 className="text-lg font-semibold mt-2">Camiseta</h4>
                                            <a href={outfit.camiseta.url} target="_blank" rel="noopener noreferrer">
                                                <img src={outfit.camiseta.imagen} alt="Camiseta" className="w-full h-64 object-cover" />
                                            </a>
                                            <p className="text-gray-500 text-center bg-green-200">{outfit.camiseta.precio}€</p>
                                        </div>
                                        <div className="w-1/3 p-2">
                                            <h4 className="text-lg font-semibold mt-2">Pantalón</h4>
                                            <a href={outfit.pantalon.url} target="_blank" rel="noopener noreferrer">
                                                <img src={outfit.pantalon.imagen} alt="Pantalón" className="w-full h-64 object-cover" />
                                            </a>
                                            <p className="text-gray-500 text-center bg-green-200">{outfit.pantalon.precio}€</p>
                                        </div>
                                        <div className="w-1/3 p-2">
                                            <h4 className="text-lg font-semibold mt-2">Zapatos</h4>
                                            <a href={outfit.zapatos.url} target="_blank" rel="noopener noreferrer">
                                                <img src={outfit.zapatos.imagen} alt="Zapatos" className="w-full h-64 object-cover" />
                                            </a>
                                            <p className="text-gray-500 text-center bg-green-200">{outfit.zapatos.precio}€</p>
                                        </div>
                                    </div>
                                    <div className="mt-6 flex justify-between items-center">
                                        {outfit.user_id === JSON.parse(localStorage.getItem('user')).id && (
                                            <button
                                                onClick={() => handleDeleteOutfit(outfit.id)}
                                                className="bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 transition duration-200 mr-4"
                                            >
                                                Eliminar Outfit
                                            </button>
                                        )}
                                        <div className="flex items-center">
                                            <button
                                                onClick={() => handleLike(outfit.id, 'Camiseta', outfit.camiseta.precio, outfit.camiseta.imagen, outfit.camiseta.url, 'Pantalon', outfit.pantalon.precio, outfit.pantalon.imagen, outfit.pantalon.url,
                                                    'Zapatos', outfit.zapatos.precio, outfit.zapatos.imagen, outfit.zapatos.url, outfit.user_id
                                                )}
                                                className={`like-button flex items-center py-2 px-2 rounded-lg transition duration-200 ${!outfit.userHasLiked ? 'hover:bg-red-100' : 'bg-transparent'
                                                    }`}
                                              disabled={outfit.userHasLiked}
                                            >
                                                {outfit.userHasLiked ? (
                                                    <FavoriteIcon />
                                                ) : (
                                                    <FavoriteBorderOutlinedIcon />
                                                )}
                                            </button>
                                            <Typography variant="body2" color="textSecondary">
                                                &nbsp;{outfit.likes}
                                            </Typography>
                                        </div>

                                        <Typography variant="body2" color="textSecondary" className="ml-auto">
                                            Total: {totalPrice.toFixed(2)}€
                                        </Typography>
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <p className="text-gray-600 text-center">No hay outfits disponibles en este momento.</p>
                    )
                )}
            </div>
        </div>
    );
}

export default ShowOutfits;
