import React from 'react';
import { Link } from 'react-router-dom';

function ClothePoster({ id, title, posterUrl }) {
  return (
    <Link to={`/ClotheDetails/${id}`} className="relative overflow-hidden transition-transform duration-300 ease-out transform hover:scale-110">
      <img className="w-full" src={posterUrl} alt={title} />

      <p className="text-center TitPelis">
        {title}
      </p>
    </Link>
  );
}

export default ClothePoster;
