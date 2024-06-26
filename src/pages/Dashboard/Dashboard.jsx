import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Importar los estilos de Toastify
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Slider from '@mui/material/Slider';
import AvatarEditor from 'react-avatar-editor';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined';
import Skeleton from '@mui/material/Skeleton'; // Importar Skeleton
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import PropTypes from 'prop-types';


import { NavLink, Link } from "react-router-dom";

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'black',
  borderRadius: '30px',
  p: 4,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center'
};

const avatarSize = 175; // Tamaño del avatar en píxeles
const textSize = avatarSize * 0.1; // Tamaño de la fuente como 50% del tamaño del avatar

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
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

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function Dashboard({ isLoggedIn, setIsLoggedIn }) {
  const [isLoading, setIsLoading] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isHovering, setIsHovering] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [editor, setEditor] = useState(null);
  const [zoom, setZoom] = useState(1.2);
  const [open, setOpen] = useState(false);
  const [outfits, setOutfits] = useState([]);
  const [userName, setUserName] = useState(""); // Nuevo estado para almacenar el nombre del usuario
  const [loadingOutfits, setLoadingOutfits] = useState(true); // Estado de carga para los outfits
  const [value, setValue] = useState(0); // Estado para los tabs
  const fileInputRef = useRef(null);
  const navigate = useNavigate();
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [userName2, setUserName2] = useState(""); // Nuevo estado para almacenar el nombre del usuario





  const fetchData = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      const token = user?.token;

      const response = await axios.get("http://localhost/proyectoDaw/public/api/getUser", {
        headers: {
          'Content-Type': 'application/json',
          "Authorization": `Bearer ${token}`
        }
      });
      setUserName2(response.data.name);
      console.log(response.data); // Aquí puedes manejar los datos recibidos
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleBuy = async (nombre, precio) => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      const token = user?.token;

      const response = await axios.post('http://localhost/proyectoDaw/public/api/checkout', {
        producto: nombre,
        precio: precio * 100 // Stripe expects the price in cents
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

  const handleLogout = async () => {
    setIsLoading(true);
    localStorage.removeItem('user');

    try {
      await axios.post('http://localhost/proyectoDaw/public/logout');
      toast.success('Sesión cerrada correctamente');
      setIsLoggedIn(false); // Actualiza el estado de inicio de sesión
      navigate('/Login');
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {

    const fetchFavorites = async () => {
      try {
        const user = JSON.parse(localStorage.getItem('user'));
        const token = user?.token;

        const response = await axios.get('http://localhost/proyectoDaw/public/api/show.favoriteClothes', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        const favorites = response.data;

        // Fetch details of each creator
        const updatedFavorites = await Promise.all(favorites.map(async (item) => {
          const creatorResponse = await axios.get(`http://localhost/proyectoDaw/public/api/getUser/${item.creador}`, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          return {
            ...item,
            user: creatorResponse.data
          };
        }));

        setFavorites(updatedFavorites);
        setLoading(false);
        console.log(updatedFavorites);
      } catch (error) {
        console.error('Error fetching favorite clothes:', error);
        setLoading(false);
      }
    };




    const user = JSON.parse(localStorage.getItem('user'));
    const token = user?.token;

    if (!user) {
      setIsLoggedIn(false); // Actualiza el estado de inicio de sesión si no hay usuario
      navigate('/Login');
    } else {
      axios.get('http://localhost/proyectoDaw/public/api/get.profile', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then(response => {
          setProfileImage(response.data.profileImage);
        })
        .catch(error => {
          console.error('Error fetching the profile image:', error);
        });

      const fetchOutfits = async () => {
        try {
          const response = await axios.get('http://localhost/proyectoDaw/public/api/show.outfit', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          const outfitsWithUser = await Promise.all(response.data.map(async outfit => {
            const userResponse = await axios.get(`http://localhost/proyectoDaw/public/api/getUser/${outfit.user_id}`);
            return { ...outfit, user: userResponse.data };
          }));

          setOutfits(outfitsWithUser);
          setLoadingOutfits(false); // Marcar como completada la carga de outfits

          // Guardar el nombre del usuario del primer outfit en el estado
          if (outfitsWithUser.length > 0) {
            setUserName(outfitsWithUser[0].user.name);
          }
        } catch (error) {
          console.error('Error fetching outfits:', error);
        }
      };

      fetchData();
      fetchOutfits();
      fetchFavorites();
    }
  }, [navigate, setIsLoggedIn, isLoggedIn]);

  const handleDeleteFavorite = async (favoriteId, outfit_id) => {

    try {
      const user = JSON.parse(localStorage.getItem('user'));
      const token = user?.token;

      await axios.delete('http://localhost/proyectoDaw/public/api/delete.favoriteClothes', {
        headers: {
          'Authorization': `Bearer ${token}`
        },
        data: {
          id: favoriteId,
          outfit_id: outfit_id
        }
      });

      // Actualizar la lista de favoritos después de eliminar
      setFavorites((prevFavorites) => prevFavorites.filter((favorite) => favorite.id !== favoriteId));
      localStorage.setItem(`likedOutfit_${outfit_id}`, JSON.stringify(false));

      // Mostrar notificación de éxito
      toast.success('Prenda favorita eliminada con éxito');
    } catch (error) {
      console.error('Error deleting favorite:', error);
      // Mostrar notificación de éxito
      toast.error('Error al intentar eliminar la prenda favorita');
    }
  };


  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);

      // Create a preview of the selected image
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        setOpen(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!editor) {
      console.error('Editor is not initialized');
      toast.error('Error: el editor no está inicializado');
      return;
    }

    const canvas = editor.getImage();
    const base64Image = canvas.toDataURL().split(',')[1];

    const user = JSON.parse(localStorage.getItem('user'));
    const token = user?.token;

    axios.put('http://localhost/proyectoDaw/public/api/update.profile', { profile_image: base64Image }, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })
      .then(response => {
        setProfileImage(response.data.profileImage);
        setImagePreview(null); // Clear the preview after successful update
        setSelectedImage(null);
        setOpen(false); // Close the modal after successful update
        toast.success('Avatar cambiado correctamente');
      })
      .catch(error => {
        console.error('Error updating the profile image:', error);
        toast.error('Error al cambiar el avatar');
      });
  };

  const handleAvatarClick = () => {
    fileInputRef.current.click();
  };

  const handleCancel = () => {
    setImagePreview(null);
    setSelectedImage(null);
    setOpen(false);
    toast.warn('Has cancelado el cambio de imagen');
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

      const updatedResponse = await axios.get('http://localhost/proyectoDaw/public/api/show.outfit', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const outfitsWithUser = await Promise.all(updatedResponse.data.map(async outfit => {
        const userResponse = await axios.get(`http://localhost/proyectoDaw/public/api/getUser/${outfit.user_id}`);
        return { ...outfit, user: userResponse.data };
      }));

      setOutfits(outfitsWithUser);
      toast.success('Outfit eliminado correctamente');
    } catch (error) {
      console.error('Error al eliminar outfit:', error);
      toast.error('Error al eliminar el outfit');
    }
  };

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const parsePrice = (price) => {
    return parseFloat(price.replace(',', '.'));
  };



  return (
    <>
      <div className="flex flex-col items-center p-4">
        <input
          type="file"
          accept="image/*"
          name="profile_image"
          id="profile_image"
          onChange={handleImageChange}
          ref={fileInputRef}
          style={{ display: 'none' }}
        />

        <div
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
          onClick={handleAvatarClick}
          style={{ position: 'relative', display: 'inline-block', cursor: 'pointer' }}
        >
          <Avatar
            src={profileImage ? `http://localhost/proyectoDaw/public/storage/profile_images/${profileImage}` : undefined}
            alt="Imagen de Perfil"
            sx={{ width: avatarSize, height: avatarSize }}
          />
          {isHovering && (
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              color: 'white',
              fontSize: textSize,
              borderRadius: '50%',
            }}>
              <span className="text-white">Cambiar Avatar</span>
            </div>
          )}
        </div>

        <Typography id="name" variant="h6" sx={{ mt: 2 }}>
          {userName2}
        </Typography>


        <div className="mt-4">
          <button
            onClick={handleLogout}
            className="bg-red-900 hover:bg-red-900/90 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            disabled={isLoading}
          >
            {isLoading ? 'Cerrando sesión...' : 'Cerrar sesión'}
          </button>
        </div>
      </div>


      <Modal
        open={open}
        onClose={handleCancel}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2" sx={{ color: 'white' }}>
            Editar Imagen de Perfil
          </Typography>
          <AvatarEditor
            ref={setEditor}
            image={imagePreview}
            width={250}
            height={250}
            border={50}
            borderRadius={175}
            color={[0, 0, 0, 0.8]} // RGBA
            scale={zoom}
            rotate={0}
            style={{ margin: '20px 0' }}
          />
          <Slider
            value={zoom}
            min={1}
            max={2}
            step={0.1}
            onChange={(e, value) => setZoom(value)}
            sx={{ width: '80%', color: 'white' }}
          />
          <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', mt: 2 }}>
            <Button variant="contained" color="secondary" onClick={handleCancel}>
              Cancelar
            </Button>
            <Button variant="contained" color="primary" onClick={handleSubmit}>
              Guardar
            </Button>
          </Box>
        </Box>
      </Modal>

      <Box sx={{ width: '100%', typography: 'body1' }}>


        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <Tabs value={value} onChange={handleChange} aria-label="basic tabs example"
            sx={{
              '.MuiTabs-indicator': {
                backgroundColor: '#8d0000', // color rojo personalizado para el indicador
              }
            }} >
            <Tab label="Outfits Creados" id="tab-0" aria-controls="tabpanel-0" sx={{
              color: 'black',
              '&.Mui-selected': {
                color: '#8d0000',
              },
            }} />
            <Tab label="Favoritos" id="tab-1" aria-controls="tabpanel-1" sx={{
              color: 'black',
              '&.Mui-selected': {
                color: '#8d0000',
              },
            }} />
          </Tabs>
        </div>
        <TabPanel value={value} index={0}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8">
            {loadingOutfits ? (
              Array.from(new Array(6)).map((_, index) => (
                <div key={index} className="bg-white p-6 rounded-lg shadow-lg">
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
                    <div key={outfit.id} className="bg-white text-center p-6 rounded-lg shadow-lg w-full">
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
                        <button
                          onClick={() => handleDeleteOutfit(outfit.id)}
                          className="bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 transition duration-200"
                        >
                          Eliminar Outfit
                        </button>
                        <Typography variant="body2" color="textSecondary" className="ml-auto">
                          Total: {totalPrice.toFixed(2)}€
                        </Typography>
                      </div>
                    </div>
                  );
                })
              ) : (
                <p className="text-gray-600 text-center">No tienes outfits disponibles en este momento.</p>
              )
            )}
          </div>
        </TabPanel>
        <TabPanel value={value} index={1}>
          <Typography>
            <div className="max-w-6xl mx-auto p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {loading ? (
                  Array.from(new Array(6)).map((_, index) => (
                    <div key={index} className="bg-white p-6 rounded-lg shadow-lg">
                      <div className="flex items-center mb-4">
                        <Skeleton variant="circular" width={50} height={50} animation="wave" />
                        <Skeleton variant="text" width={100} height={30} animation="wave" />
                      </div>
                      <Skeleton variant="rectangular" width="100%" height={256} animation="wave" />
                      <Skeleton variant="rectangular" width="100%" height={40} animation="wave" className="mt-4" />
                    </div>
                  ))
                ) : (
                  favorites.length > 0 ? (
                    favorites.map((item) => {
                      const totalPrice = item.camiseta.precio + item.pantalon.precio + item.zapatos.precio;
                      return (
                        <div key={item.id} className="bg-white p-6 rounded-lg shadow-lg w-full text-center">
                          <div className="flex items-center mb-4">
                            <Avatar src={'http://localhost/proyectoDaw/public/storage/profile_images/' + item.user?.profile_image} alt="Imagen de Usuario" sx={{ width: 50, height: 50 }} />
                            <p className="ml-4 font-bold">{item.user ? item.user.name : 'Usuario desconocido'}</p>
                          </div>

                          <hr />
                          <div className="flex justify-around">
                            <div className="w-1/3 p-2">
                              <h4 className="text-lg font-semibold mt-2">Camiseta</h4>
                              <a href={item.camiseta.url} target="_blank" rel="noopener noreferrer">
                                <img src={item.camiseta.imagen} alt="Camiseta" className="w-full h-64 object-cover" />
                              </a>
                              <p className="text-gray-500 text-center bg-green-200">{item.camiseta.precio}€</p>
                            </div>
                            <div className="w-1/3 p-2">
                              <h4 className="text-lg font-semibold mt-2">Pantalón</h4>
                              <a href={item.pantalon.url} target="_blank" rel="noopener noreferrer">
                                <img src={item.pantalon.imagen} alt="Pantalón" className="w-full h-64 object-cover" />
                              </a>
                              <p className="text-gray-500 text-center bg-green-200">{item.pantalon.precio}€</p>
                            </div>
                            <div className="w-1/3 p-2">
                              <h4 className="text-lg font-semibold mt-2">Zapatos</h4>
                              <a href={item.zapatos.url} target="_blank" rel="noopener noreferrer">
                                <img src={item.zapatos.imagen} alt="Zapatos" className="w-full h-64 object-cover" />
                              </a>
                              <p className="text-gray-500 text-center bg-green-200">{item.zapatos.precio}€</p>
                            </div>
                          </div>
                          <div className="mt-6 flex justify-between items-center">
                            <button
                              onClick={() => handleDeleteFavorite(item.id, item.outfit_id)}
                              className="bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 transition duration-200"
                            >
                              Eliminar Favorito
                            </button>
                            <Typography variant="body2" color="textSecondary" className="ml-auto">
                              Total: {totalPrice.toFixed(2)}€
                            </Typography>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <p className="text-gray-600 text-center">No tienes artículos favoritos en este momento.</p>
                  )
                )}
              </div>
            </div>
          </Typography>
        </TabPanel>
      </Box>
    </>
  );
}

export default Dashboard;
