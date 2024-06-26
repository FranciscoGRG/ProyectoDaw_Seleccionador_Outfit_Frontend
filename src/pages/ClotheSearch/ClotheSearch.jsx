import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import ClothePoster from "../../components/ClothePoster";

function ClotheSearch() {
  const { query } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    const fetchSearchResults = async () => {
      try {
        const response = await axios.get(
          `https://api.themoviedb.org/3/search/movie?api_key=9ebbf65c80c0e6ee15f83825a6422dd5&language=en-US&query=${query}&page=1&include_adult=false`
        );
        setSearchResults(response.data.results);
        setIsLoading(false);
      } catch (error) {
        console.error("Error al intentar encontrar search results:", error);
      }
    };

    fetchSearchResults();
  }, [query]);

  return (
    <section className="">
      <h1 className="font-rubiksh text-gray-200 font-extrabold text-4xl mb-7">
        Resultados de la búsqueda
      </h1>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4 ">
        {isLoading ? (
          <p>Cargando resultados...</p>
        ) : (
          searchResults.map((Clothe) => (
            <ClothePoster
              key={Clothe.id}
              id={Clothe.id}
              title={Clothe.title}
              posterUrl={`https://image.tmdb.org/t/p/w500${Clothe.poster_path}`}
            />
          ))
        )}
      </div>
    </section>
  );
}

export default ClotheSearch;
