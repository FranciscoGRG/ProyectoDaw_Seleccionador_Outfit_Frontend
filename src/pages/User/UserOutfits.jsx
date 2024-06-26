import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

function UserOutfits() {
  const [outfits, setOutfits] = useState([]);

  useEffect(() => {
    const fetchOutfits = async () => {
      try {
        const user = JSON.parse(localStorage.getItem('user'));
        const token = user?.token;

        const response = await axios.get('http://localhost/proyectoDaw/public/api/show.outfit', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        setOutfits(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchOutfits();
  }, []);

  const handleDelete = async (outfit_id) => {
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

      setOutfits(updatedResponse.data);
      toast.success("Outfit eliminado correctamente")
    } catch (error) {
      console.error('Error al eliminar outfit:', error);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-8">
      <h2 className="text-3xl font-bold mb-6 text-center text-white">Estos son tus outfits</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {outfits.length > 0 ? (
          outfits.map((outfit) => (
            <div key={outfit.id} className="bg-gray-800 p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-bold text-white">Outfit</h3>
              <p className="text-gray-300"><strong>Publicado por:</strong> {outfit.user ? outfit.user.name : 'Usuario desconocido'}</p>
              <div className="flex flex-col mt-4 space-y-4">
                <div>
                  <h4 className="text-lg font-semibold text-white">Camiseta</h4>
                  <p className="text-gray-300">{outfit.camiseta.nombre}</p>
                  <p className="text-gray-300"><strong>Precio:</strong> {outfit.camiseta.precio}€</p>
                  <img src={outfit.camiseta.imagen} alt="Camiseta" className="w-32 h-32 object-cover" />
                  <a href={outfit.camiseta.url} className="text-blue-500 hover:underline">Ver producto</a>
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-white">Pantalón</h4>
                  <p className="text-gray-300">{outfit.pantalon.nombre}</p>
                  <p className="text-gray-300"><strong>Precio:</strong> {outfit.pantalon.precio}€</p>
                  <img src={outfit.pantalon.imagen} alt="Pantalón" className="w-32 h-32 object-cover" />
                  <a href={outfit.pantalon.url} className="text-blue-500 hover:underline">Ver producto</a>
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-white">Zapatos</h4>
                  <p className="text-gray-300">{outfit.zapatos.nombre}</p>
                  <p className="text-gray-300"><strong>Precio:</strong> {outfit.zapatos.precio}€</p>
                  <img src={outfit.zapatos.imagen} alt="Zapatos" className="w-32 h-32 object-cover" />
                  <a href={outfit.zapatos.url} className="text-blue-500 hover:underline">Ver producto</a>
                </div>
              </div>
              <div className="mt-4 flex items-center">
                <button
                  onClick={() => handleDelete(outfit.id)}
                  className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition duration-200"
                >
                  Eliminar
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-300 text-center">No hay outfits disponibles en este momento.</p>
        )}
      </div>
    </div>
  );
}

export default UserOutfits;
