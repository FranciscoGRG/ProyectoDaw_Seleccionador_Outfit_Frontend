import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import ReactPlayer from "react-player";

<style>
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400;1,500;1,600;1,700&display=swap');
</style>

function Home() {
  const videoUrls = [
    "https://static.vecteezy.com/system/resources/previews/007/660/166/mp4/close-up-hand-of-fashion-designer-or-stylist-manage-new-clothes-collection-on-rack-in-studio-woman-tailor-dressmaker-prepare-wardrobe-clothing-for-sale-free-video.mp4",
    "https://static.vecteezy.com/system/resources/previews/007/668/059/mp4/close-up-clothes-of-fashion-designer-or-stylist-manage-new-clothes-collection-on-rack-in-studio-young-man-tailor-dressmaker-prepare-wardrobe-clothing-for-sale-free-video.mp4",
    "https://static.vecteezy.com/system/resources/previews/007/668/046/mp4/close-up-clothes-of-fashion-designer-or-stylist-manage-new-clothes-collection-on-rack-in-studio-woman-tailor-dressmaker-prepare-wardrobe-clothing-for-sale-free-video.mp4",
    "https://static.vecteezy.com/system/resources/previews/001/796/865/mp4/home-wardrobe-or-clothing-shop-changing-room-asian-young-woman-choosing-her-fashion-outfit-clothes-in-closet-at-home-or-store-free-video.mp4"
  ];

  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);

  const handleEnded = () => {
    setCurrentVideoIndex((prevIndex) => (prevIndex + 1) % videoUrls.length);
  };

  return (
    <>
   
        <section className="w-full h-full relative flex items-center justify-center" style={{ height: '810px', width: '100%' }}>
          <ReactPlayer
            url={videoUrls[currentVideoIndex]}
            playing
            muted
            width="100%"
            height="100%"
            style={{ position: 'absolute', top: 0, left: 0, objectFit: 'cover', zIndex: -1, filter: 'grayscale(100%) blur(10px) opacity(0.7)' }}
            onEnded={handleEnded}
          />

          <div className="contentMaindesc">
                <div className="px-4 md:px-6 relative z-10 flex flex-col items-center space-y-4 text-center">
                  <div className="space-y-2">
                    <h1 className="text-3xl text-black font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl">
                    Clothe<span className='text-red-700'>Hub</span>
                    </h1>
                    <p className="mainDescription sm:text-1xl md:text-2xl lg:text-3xl">
                      Tu plataforma de comparación de ofertas de ropa en diversas tiendas populares
                    </p>
                  </div>

                  <div className="space-x-4">

                    <Link className="fancy" to="/Clothes">
                      
                      <span class="text">Explorar Artículos</span>
                      
                    </Link>
                  
                  </div>

                  <a><img src="https://readme-typing-svg.demolab.com?font=Cormorant+Garamond&weight=500&size=25&duration=3500&pause=1500&color=F7F7F7&center=true&vCenter=true&random=false&width=800&lines=Tu+buscador+l%C3%ADder+de+las+mejores+ofertas+en+moda;Compara+precios+de+ropa+en+tiendas+top+con+un+clic;Descubre+las+ofertas+m%C3%A1s+atractivas+en+moda+de+marca;Ahorra+en+estilo%3A+compara+ropa+en+tiendas+favoritas;Ahorra+tiempo+en+buscar+qu%C3%A9+ponerte" alt="Typing SVG" /></a>
                </div>

          </div>
        </section>
      

      <section className="flex flex-col md:flex-row items-center justify-center space-y-4 md:space-y-0 md:space-x-6 px-4 md:px-6 mt-40">
        <div className="w-full md:w-1/2">
          <img src="https://images.pexels.com/photos/3839432/pexels-photo-3839432.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" alt="Imagen de ropa" className="w-full h-auto rounded-lg shadow-lg" />
        </div>
        <div className="w-full md:w-1/2 text-center md:text-left">
          <h2 className="text-1xl text-black font-bold tracking-tighter text-3xl">
            Descubre las mejores ofertas en ropa
          </h2>
          <p className="mt-4 text-lg text-gray-500">
            Comparamos precios de tus tiendas favoritas para que encuentres la mejor oferta sin esfuerzo.
            Nuestra plataforma proporciona un servicio de comparación de ofertas de prendas de vestir entre diversas tiendas reconocidas en el mercado. 
            <br/><br/>
            A través de nuestro sistema, los usuarios tienen la capacidad de examinar y contrastar una amplia gama de productos disponibles en diferentes establecimientos, permitiéndoles tomar decisiones informadas y obtener los mejores precios y calidad en sus compras de ropa.
          </p>
        </div>
      </section>
    </>
  );
}

export default Home;
