// eslint-disable-next-line no-unused-vars
import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

function Sell() {
    const [nombre, setNombre] = useState('');
    const [descripcion, setDescripcion] = useState('');
    const [fabricante, setFabricante] = useState('');
    const [talla, setTalla] = useState('');
    const [precio, setPrecio] = useState('');
    const [imagenes, setImagenes] = useState([]);
    const [categoria, setCategoria] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const formData = new FormData();
            formData.append('nombre', nombre);
            formData.append('descripcion', descripcion);
            formData.append('fabricante', fabricante);
            formData.append('talla', talla);
            formData.append('precio', precio);
            formData.append('categoria', categoria);

            // Agrega cada archivo al FormData
            for (let i = 0; i < imagenes.length; i++) {
                formData.append('imagenes[]', imagenes[i]);
            }

            const user = JSON.parse(localStorage.getItem('user'));
            const token = user?.token;

            const response = await axios.post('http://localhost/proyectoDaw/public/api/createOffer', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${token}`
                }
            });

            console.log(response.data);
            toast.success('Oferta creada correctamente');
        } catch (error) {
            console.error(error);
            toast.error('Error al crear la oferta');
        }
    };

    const handleImagenesChange = (e) => {
        setImagenes([...e.target.files]);
    };

    return (
        <div className="min-h-screen bg-[#181717] flex items-center justify-center">
            <form onSubmit={handleSubmit} className="max-w-lg w-full mx-auto bg-gray-800 p-8 rounded-lg shadow-md">
                <h2 className="text-2xl font-bold mb-6 text-white text-center">Publicar Oferta de Producto</h2>
                <div className="mb-4">
                    <label className="block text-gray-300">Nombre:</label>
                    <input
                        type="text"
                        value={nombre}
                        onChange={(e) => setNombre(e.target.value)}
                        required
                        className="w-full px-3 py-2 bg-gray-700 text-white border rounded-lg border-gray-600 focus:outline-none focus:border-blue-500"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-300">Descripción:</label>
                    <textarea
                        value={descripcion}
                        onChange={(e) => setDescripcion(e.target.value)}
                        required
                        className="w-full px-3 py-2 bg-gray-700 text-white border rounded-lg border-gray-600 focus:outline-none focus:border-blue-500"
                    ></textarea>
                </div>
                <div className="mb-4">
                    <label className="block text-gray-300">Fabricante:</label>
                    <input
                        type="text"
                        value={fabricante}
                        onChange={(e) => setFabricante(e.target.value)}
                        required
                        className="w-full px-3 py-2 bg-gray-700 text-white border rounded-lg border-gray-600 focus:outline-none focus:border-blue-500"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-300">Talla:</label>
                    <select value={talla} onChange={(e) => setTalla(e.target.value)} required className="w-full px-3 py-2 bg-gray-700 text-white border rounded-lg border-gray-600 focus:outline-none focus:border-blue-500">
                        <option value="XS">XS</option>
                        <option value="S">S</option>
                        <option value="M">M</option>
                        <option value="L">L</option>
                        <option value="XL">XL</option>
                    </select>
                </div>
                <div className="mb-4">
                    <label className="block text-gray-300">Precio:</label>
                    <input
                        type="number"
                        value={precio}
                        onChange={(e) => setPrecio(e.target.value)}
                        required
                        className="w-full px-3 py-2 bg-gray-700 text-white border rounded-lg border-gray-600 focus:outline-none focus:border-blue-500"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-300">Imágenes:</label>
                    <input
                        type="file"
                        multiple
                        onChange={handleImagenesChange}
                        className="w-full px-3 py-2 bg-gray-700 text-white border rounded-lg border-gray-600 focus:outline-none focus:border-blue-500"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-300">Categoría:</label>
                    <select value={categoria} onChange={(e) => setCategoria(e.target.value)} required className="w-full px-3 py-2 bg-gray-700 text-white border rounded-lg border-gray-600 focus:outline-none focus:border-blue-500">
                        <option value="Hombre">Hombre</option>
                        <option value="Mujer">Mujer</option>
                        <option value="Unisex">Unisex</option>
                    </select>
                </div>
                <button
                    type="submit"
                    className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition duration-200"
                >
                    Publicar Oferta
                </button>
            </form>
        </div>
    );
}

export default Sell;
