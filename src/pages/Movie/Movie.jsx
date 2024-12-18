import React, { useEffect, useRef, useState } from 'react';
import './Movie.css';
import { Link } from 'react-router-dom';
import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/Footer/Footer';

const apiUrl = import.meta.env.VITE_GET_MOVIES_API_URL;

const Movie = ({ title }) => {
    const [apiData, setApiData] = useState([]);
    const [loading, setLoading] = useState(true);
    const cardsRef = useRef();

    const options = {
        method: 'GET',
        headers: {
            accept: 'application/json',
        }
    };

    const fetchMovies = async () => {
        try {
            const cachedData = localStorage.getItem('moviesData');
            let parsedCache = cachedData ? JSON.parse(cachedData) : [];
    
            // Set existing cache data initially, if available
            if (parsedCache.length > 0) {
                setApiData(parsedCache);
            }
    
            // Fetch new data from the API
            const response = await fetch(`${apiUrl}`, options);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
    
            const data = await response.json();
    
            // Filter new movies to exclude those already in the cache based on 'id' and 'name'
            const existingKeys = new Set(parsedCache.map(card => `${card.id}-${card.name}`));
            const newMovies = data.cards.filter(card => !existingKeys.has(`${card.id}-${card.name}`));
            const updatedMovies = [...parsedCache, ...newMovies];
    
            // Create a unique list of movies using both 'id' and 'name' as keys
            const uniqueMovies = Array.from(
                new Map(updatedMovies.map(card => [`${card.id}-${card.name}`, card])).values()
            );
    
            // Update cache and state only if the new data differs from the cached data
            if (JSON.stringify(uniqueMovies) !== JSON.stringify(parsedCache)) {
                localStorage.setItem('moviesData', JSON.stringify(uniqueMovies));
                setApiData(uniqueMovies);
            }
    
            setLoading(false);
        } catch (err) {
            console.error('Error fetching movies:', err);
            setLoading(false);
        }
    };
    
    

    useEffect(() => {
        // Initial fetch on mount
        fetchMovies();

    }, []);

    return (
        <div className='movie-cards'>
            <Navbar />
            {/* <h2>{title ? title : "Movies"}</h2> */}
            <div className="movie-list" ref={cardsRef}>
                {loading ? (
                    <p>Loading...</p>
                ) : (
                    apiData.length === 0 ? (
                        <p>No movies available.</p>
                    ) : (
                        apiData.map((card) => (
                            <Link to={`/player/${card.id}`} className="card" key={card.id} state={{ url: card.url, name: card.name, id:card.id }}>
                                <img src={card.album_art_path} alt={card.name} />
                            </Link>
                        ))
                    )
                )}
            </div>
            <Footer/>
        </div>
    );
};

export default Movie;
