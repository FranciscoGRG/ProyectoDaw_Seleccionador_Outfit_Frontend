import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Buy() {
  const [offers, setOffers] = useState([]);

  useEffect(() => {
    const fetchOffers = async () => {
      try {
        const response = await axios.get('http://localhost/proyectoDaw/public/api/showOffers');
        const offersWithUser = await Promise.all(response.data.map(async offer => {
          const userResponse = await axios.get(`http://localhost/proyectoDaw/public/api/getUser/${offer.user_id}`);
          return { ...offer, user: userResponse.data };
        }));
        setOffers(offersWithUser);
      } catch (error) {
        console.error(error);
      }
    };

    fetchOffers();
  }, []);

  const handleBuy = async (offer) => {
    try {

      const user = JSON.parse(localStorage.getItem('user'));
      const token = user?.token;

      const response = await axios.post('http://localhost/proyectoDaw/public/api/checkout', {
        producto: offer.name,
        precio: offer.price * 100 // Stripe expects the price in cents
      }, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      }

      );
      window.location.href = response.data; // Redirect to the Stripe checkout page
    } catch (error) {
      console.error('Error during checkout:', error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-8">
      <h2 className="text-2xl font-bold mb-6 text-center text-white">Ofertas Disponibles</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {offers.length > 0 ? (
          offers.map((offer) => (
            <div key={offer.id} className="bg-gray-800 p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-bold text-white">{offer.name}</h3>
              <p className="text-gray-300">{offer.descripcion}</p>
              <p className="text-gray-300"><strong>Fabricante:</strong> {offer.manufacturer}</p>
              <p className="text-gray-300"><strong>Talla:</strong> {offer.size}</p>
              <p className="text-gray-300"><strong>Precio:</strong> {offer.price}€</p>
              <p className="text-gray-300"><strong>Categoría:</strong> {offer.category}</p>
              <p className="text-gray-300"><strong>Usuario:</strong> {offer.user.name}</p>
              <br />
              {offer.user.profile_image ? (
                <p>Imagen de perfil:
                  <img
                    src={'http://localhost/proyectoDaw/public/storage/profile_images/' + offer.user.profile_image}
                    alt="Imagen de perfil del usuario"
                    className="w-32 h-32 object-cover mr-4"
                  />
                </p>
              ) : ("")}
              <br />
              <p>Imagenes del producto</p>
              <div className="flex justify-center mt-4">
                {JSON.parse(offer.images).map((image, index) => (
                  <img
                    key={index}
                    src={'http://localhost/proyectoDaw/public/' + image}
                    alt={`Imagen ${index}`}
                    className="w-32 h-32 object-cover mr-4"
                  />
                ))}
              </div>
              <button
                className="mt-4 bg-blue-500 text-white py-2 px-4 rounded"
                onClick={() => handleBuy(offer)}
              >
                Comprar
              </button>
            </div>
          ))
        ) : (
          <p className="text-gray-300 text-center">No hay ofertas disponibles en este momento.</p>
        )}
      </div>
    </div>
  );
}

export default Buy;
