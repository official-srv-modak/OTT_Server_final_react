import React from 'react';
import './TitleCards.css';
import { Link } from 'react-router-dom';

const TitleCards = ({ title, movies }) => {
  return (
    <div className='title-cards'>
      <h2>{title ? title : "Popular on BootStream"}</h2>
      <div className="card-list">
        {movies && movies.length > 0 ? (
          movies.map((card) => (
            <Link to={`/player/${card.id}`} className="card" key={card.id} state={{ url: card.url, name: card.name, id: card.id }}>
              <img src={card.album_art_path} alt={card.name} />
            </Link>
          ))
        ) : (
          <p>No movies found.</p>
        )}
      </div>
    </div>
  );
}

export default TitleCards;
