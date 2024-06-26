import React, { useEffect, useState } from "react";
import axios from 'axios';
import { useLocation } from "react-router-dom";
import colores from "../../assets/Colores.js";
import Skeleton from '@mui/material/Skeleton';
import { toast } from 'react-toastify';

function Ropa() {
  const [isLoading, setIsLoading] = useState(true);
  const [ropaEBAY, setRopaEBAY] = useState([]);
  const [ropaShein, setRopaShein] = useState([]);
  const [ropaAliexpress, setRopaAliexpress] = useState([]);
  const [precioMin, setPrecioMin] = useState(0);
  const [precioMax, setPrecioMax] = useState(500);
  const [ordenPrecio, setOrdenPrecio] = useState("asc");
  const [talla, setTalla] = useState("");
  const [color, setColor] = useState("");
  const location = useLocation();
  const searchQuery = new URLSearchParams(location.search).get("searchQuery") || "camisa blanca";
  const itemsPerPage = 6;

  const uniqueColors = [...new Set(colores.match(/\b\w+\b/g))].filter((color, index, self) => {
    return self.indexOf(color) === index && !color.includes(' ');
  });

  useEffect(() => {
    async function fetchDataEBAY() {
      const ebayUrl = `https://ebay-search-result.p.rapidapi.com/search/${searchQuery}`;
      const ebayOptions = {
        method: 'GET',
        headers: {
          'x-rapidapi-key': '5ceb206ccdmsh98b125e3039cf6dp17428fjsn6ccb2d02a6a3',
          'x-rapidapi-host': 'ebay-search-result.p.rapidapi.com'
        }
      };

      try {
        const ebayResponse = await axios.get(ebayUrl, ebayOptions);
        if (ebayResponse.data.results && Array.isArray(ebayResponse.data.results)) {
          const filteredResults = ebayResponse.data.results.filter(item => item.price.length <= 6);
          setRopaEBAY(filteredResults.slice(0, 20));
        } else {
          console.error('Results is not an array:', ebayResponse.data.results);
        }
      } catch (error) {
        console.error('Error fetching eBay ropa:', error);
      } finally {
        setIsLoading(false);
      }
    }

    async function fetchDataSHEIN() {
      const options = {
        method: 'GET',
        url: 'https://unofficial-shein.p.rapidapi.com/products/search',
        params: {
          language: 'es',
          country: 'es',
          currency: 'EUR',
          keywords: `${searchQuery}`,
          max_price: '30'
        },
        headers: {
          'x-rapidapi-key': '960541c9b8mshb75ebb7fa792539p1035adjsn61aedbeedc3c',
          'x-rapidapi-host': 'unofficial-shein.p.rapidapi.com'
        }
      };

      try {
        const response = await axios.request(options);
        const sortedData = response.data.info.products.sort((a, b) => parseFloat(a.salePrice.amount) - parseFloat(b.salePrice.amount));
        setRopaShein(sortedData.slice(0, 20));

      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    }

    async function fetchDataAliexpress() {
      const options = {
        method: 'GET',
        url: 'https://aliexpress-true-api.p.rapidapi.com/api/v2/hot-products',
        params: {
          keywords: `${searchQuery}`,
          max_sale_price: '500',
          language: 'ES',
          currency: 'EUR',
          ship_to_country: 'ES'
        },
        headers: {
          'x-rapidapi-key': '514158ef80msh4d9cf3ce01071dcp173758jsn71b21d2a64a6',
          'x-rapidapi-host': 'aliexpress-true-api.p.rapidapi.com'
        }
      };

      try {
        const response = await axios.request(options);
        console.log(response.data)
        if (response.data.products) {
          const sortedData = response.data.products.sort((a, b) => parseFloat(a.target_app_sale_price) - parseFloat(b.target_app_sale_price));
          setRopaAliexpress(sortedData.slice(0, 20));
        } else {
          console.error('La propiedad products en la respuesta es undefined.');
        }
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchDataEBAY();
    fetchDataSHEIN();
    fetchDataAliexpress();
  }, [searchQuery]);

  const addFavClotheEbay = async (goods_name, amount, goods_img, goods_id) => {
    let precio2 = parseInt(amount.substring(1));

    // Limita la longitud de los datos antes de enviar la petición
    const nombre = goods_name.substring(0, 255);
    const imagen = goods_img.substring(0, 255);
    const URL = goods_id.substring(0, 255);

    const favoriteData = {
      nombre: nombre,
      precio: precio2,
      imagen: imagen,
      URL: URL
    };

    try {
      const user = JSON.parse(localStorage.getItem('user')); // Obtén el token desde el almacenamiento local
      const token = user?.token; // Asegúrate de obtener el token
      const response = await axios.post('http://localhost/proyectoDaw/public/api/add.favoriteClothes', favoriteData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      toast.success('Añadido a favoritos');
      console.log(response.data);
    } catch (error) {
      console.error(error);
      toast.error('Error al añadir a favoritos');
    }
  };



  function formatSheinURL(goods_name, goods_id) {
    const formattedName = goods_name.replace(/ /g, '-').replace(/[^\w-]/g, '');
    return `https://es.shein.com/${formattedName}-p-${goods_id}.html`;
  }

  function chunkArray(array, size) {
    if (!Array.isArray(array)) {
      console.error('chunkArray() espera una matriz como primer argumento.');
      return [];
    }
    return array.reduce((chunks, item, index) => {
      if (index % size === 0) {
        chunks.push([item]);
      } else {
        chunks[chunks.length - 1].push(item);
      }
      return chunks;
    }, []);
  }

  function transformEbayUrl(url) {
    const transformedUrl = url.replace('https://www.ebay.com/', 'https://www.ebay.es/');
    return transformedUrl;
  }

  function aplicarFiltros() {
    console.log("Filtros aplicados");
  }

  const handlePrecioMinChange = (e) => {
    const value = Number(e.target.value);
    if (value <= precioMax) {
      setPrecioMin(value);
    } else {
      setPrecioMin(precioMax);
    }
  };

  const handlePrecioMaxChange = (e) => {
    const value = Number(e.target.value);
    if (value <= 500) {
      setPrecioMax(value);
    } else {
      setPrecioMax(500);
    }
    if (value < precioMin) {
      setPrecioMin(value);
    }
  };

  return (
    <div className="flex justify-center">
      {/* Filtros */}

      <div className="w-3/4">
        {/* eBay */}
        <div className="max-w-6xl mx-auto p-8">
          <section className="mb-8">
            <h2 className="text-red-900 font-extrabold text-4xl mb-7 w-full">Artículos de eBay</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {isLoading ? (
                Array.from(new Array(6)).map((_, index) => (
                  <div key={index} className="bg-white p-6 rounded-lg shadow-lg">
                    <Skeleton variant="rectangular" width="100%" height={256} animation="wave" />
                    <Skeleton variant="text" width="80%" height={30} animation="wave" className="mt-4" />
                    <Skeleton variant="text" width="60%" height={20} animation="wave" className="mt-2" />
                  </div>
                ))
              ) : (
                ropaEBAY.map((item, index) => (
                  <div key={index} className="bg-white p-6 rounded-lg shadow-lg w-full">
                    <a
                      href={transformEbayUrl(item.url)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block w-full h-64 overflow-hidden rounded-lg shadow-lg hover:shadow-xl"
                    >
                      <img
                        src={item.image}
                        alt={`Clothing ${index}`}
                        className="w-full h-full object-cover"
                      />
                    </a>
                    <p className="text-lg font-semibold mt-4">{item.title}</p>
                    <p className="text-gray-700 text-opacity-80 bg-green-300 bg-opacity-75 text-center">{item.price.replace('$', '')}€</p>
                    
                  </div>
                ))
              )}
            </div>
          </section>

          {/* Shein */}
          <section className="mb-8">
            <h2 className="text-red-900 font-extrabold text-4xl mb-7 w-full">Artículos de Shein</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {isLoading ? (
                Array.from(new Array(6)).map((_, index) => (
                  <div key={index} className="bg-white p-6 rounded-lg shadow-lg">
                    <Skeleton variant="rectangular" width="100%" height={256} animation="wave" />
                    <Skeleton variant="text" width="80%" height={30} animation="wave" className="mt-4" />
                    <Skeleton variant="text" width="60%" height={20} animation="wave" className="mt-2" />
                  </div>
                ))
              ) : (
                ropaShein.map((item, index) => (
                  <div key={index} className="bg-white p-6 rounded-lg shadow-lg w-full">
                    <a
                      href={formatSheinURL(item.goods_name, item.goods_id)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block w-full h-64 overflow-hidden rounded-lg shadow-lg hover:shadow-xl"
                    >
                      <img
                        src={item.goods_img}
                        alt={`Clothing ${index}`}
                        className="w-full h-full object-cover"
                      />
                    </a>
                    <p className="text-lg font-semibold mt-4">{item.goods_name}</p>
                    <p className="text-gray-700 text-opacity-80 bg-green-300 bg-opacity-75 text-center">{item.salePrice.amount} €</p>
                  </div>
                ))
              )}
            </div>
          </section>

        
        </div>

      </div>
    </div>
  );
}

export default Ropa;
