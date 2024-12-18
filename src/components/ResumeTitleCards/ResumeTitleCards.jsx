import React from 'react';
import './ResumeTitleCards.css';
import { Link } from 'react-router-dom';

const ResumeTitleCards = ({ title, movies }) => {
  return (
    <div className='resume-title-cards'>
      <h2>{title ? title : "Popular on BootStream"}</h2>
      <div className="resume-card-list">
        {movies && movies.length > 0 ? (
          movies.map((card) => (
            <div className="card" key={card.id}>
              <Link
                to={`/player/${card.id}`}
                className="card-link"
                state={{ url: card.url, name: card.name, id: card.id }}
              >
                <img src={card.album_art_path} alt={card.name} />
              </Link>
              <div className="card-progress-bar-container">
                <div
                  className="card-progress-bar"
                  style={{ width: `${card.progress || 0}%` }}
                ></div>
              </div>
            </div>
          ))
        ) : (
          <p>No movies found.</p>
        )}
      </div>
    </div>
  );
};

export default ResumeTitleCards;
