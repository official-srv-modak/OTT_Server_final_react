import React, { useState, useEffect } from 'react';
import './Home.css';
import Navbar from '../../components/Navbar/Navbar';
import play_icon from '../../assets/play_icon.png';
import info_icon from '../../assets/info_icon.png';
import TitleCards from '../../components/TitleCards/TitleCards';
import Footer from '../../components/Footer/Footer';
import ResumeTitleCards from '../../components/ResumeTitleCards/ResumeTitleCards';
import { Link, useNavigate } from 'react-router-dom';

const Home = () => {
  const [movieData, setMovieData] = useState(null);
  const [movieList, setMovieList] = useState([]);
  const [titleCardsData, setTitleCardsData] = useState({});
  const [resumeTitleCardsData, setResumeTitleCardsData] = useState({}); // New state for ResumeTitleCards
  const [resumeData, setResumeData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentMovieIndex, setCurrentMovieIndex] = useState(0);
  const navigate = useNavigate();
  const resetInterval = import.meta.env.VITE_RESET_FILESYSTEM;
  const storedUser = localStorage.getItem("user");
  let parsedUser = null;
  let getResumeData = import.meta.env.VITE_GET_SHOWS_WATCHED
  if (storedUser) {
    parsedUser = JSON.parse(storedUser); // Parse the JSON string
    getResumeData += parsedUser.username;
  }

  const apiUrl = import.meta.env.VITE_GET_MOVIES_RANDOM_API_URL;
  const apiResetUrl = import.meta.env.VITE_RESET_DISK__URL;

  // Cache keys
  const heroCacheKey = 'moviesCache';
  const titleCardsCacheKey = 'titleCardsCache';
  const resumeTitleCardsCacheKey = 'resumeTitleCardsCache'; // Cache key for ResumeTitleCards
  const resumeDataCacheKey = 'resumeDataCache';
  const cacheExpiry = import.meta.env.VITE_AUTH_CACHE_EXPIRTY;


  // Function to check if cache is expired
  const isCacheExpired = (cacheItem) => {
    return true; // Placeholder for cache expiry logic
  };

  // Fetch ResumeTitleCards data
  const fetchResumeTitleCardsData = async (forceReload = false) => {
    const cachedResumeTitleCards = JSON.parse(localStorage.getItem(resumeTitleCardsCacheKey));

    if (!forceReload && cachedResumeTitleCards && !isCacheExpired(cachedResumeTitleCards)) {
      const { timestamp, ...restOfCachedData } = cachedResumeTitleCards;
      setResumeTitleCardsData(restOfCachedData);
    } else {

      try {
        const response = await fetch(`${getResumeData}`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();

        // Calculate progress for each card
        const processedData = data.cards.map((card) => ({
          ...card,
          progress: (parseInt(card.position, 10) / parseInt(card.duration, 10)) * 100,
        }));
        const title = 'Resume Watching';

        const resumeTitleCard = { [title]: processedData };

        localStorage.setItem(
          resumeTitleCardsCacheKey,
          JSON.stringify({ ...resumeTitleCard, timestamp: new Date().getTime() })
        );
        setResumeTitleCardsData(resumeTitleCard);
      } catch (error) {
        console.error('Error fetching resume title cards data:', error);
      }
    }
  };

  // Fetch movies
  const fetchMovieData = async (forceReload = false) => {
    const cachedData = JSON.parse(localStorage.getItem(heroCacheKey));

    if (!forceReload && cachedData && !isCacheExpired(cachedData)) {
      setMovieList(cachedData.cards);
      setMovieData(cachedData.cards[0]);
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${apiUrl}/6`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();

      localStorage.setItem(
        heroCacheKey,
        JSON.stringify({ ...data, timestamp: new Date().getTime() })
      );

      setMovieList(data.cards);
      setMovieData(data.cards[0]);
    } catch (error) {
      console.error('Error fetching movie data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch title cards data
  const fetchTitleCardsData = async (forceReload = false) => {
    const cachedTitleCards = JSON.parse(localStorage.getItem(titleCardsCacheKey));

    if (!forceReload && cachedTitleCards && !isCacheExpired(cachedTitleCards)) {
      const { timestamp, ...restOfCachedData } = cachedTitleCards;
      setTitleCardsData(restOfCachedData);
    } else {
      const endpoints = ['10', '20', '30', '40', '10'];
      const titles = ['General', 'Recommended', 'Navy', 'Army', 'Air force'];

      const titleCards = {};
      try {
        for (let i = 0; i < endpoints.length; i++) {
          const response = await fetch(`${apiUrl}${endpoints[i]}`);
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          const data = await response.json();
          titleCards[titles[i]] = data.cards;
        }

        localStorage.setItem(titleCardsCacheKey, JSON.stringify({ ...titleCards, timestamp: new Date().getTime() }));
        setTitleCardsData(titleCards);
      } catch (error) {
        console.error('Error fetching title cards data:', error);
      }
    }
  };

  useEffect(() => {
    fetchMovieData();
    fetchTitleCardsData();
    fetchResumeTitleCardsData();
    //fetchResumeData(); // Fetch resume data

    const handleRefresh = () => {
      fetchMovieData(true);
      fetchTitleCardsData(true);
      fetchResumeTitleCardsData(true);
      //fetchResumeData();
    };

    window.addEventListener('popstate', handleRefresh);

    return () => {
      window.removeEventListener('popstate', handleRefresh);
    };
  }, []);

  useEffect(() => {
    if (movieList.length > 0) {
      const intervalId = setInterval(() => {
        setCurrentMovieIndex((prevIndex) => {
          const nextIndex = (prevIndex + 1) % movieList.length;
          setMovieData(movieList[nextIndex]);
          return nextIndex;
        });
      }, 3000);

      return () => clearInterval(intervalId);
    }
  }, [movieList]);

  const callReloadDiskAPI = async () => {
    try {
      const response = await fetch(`${apiResetUrl}`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      console.log('Disk reload API called successfully');
    } catch (error) {
      console.error('Error calling reload disk API:', error);
    }
  };

  useEffect(() => {
    const idleInterval = setInterval(() => {
      callReloadDiskAPI();
    }, resetInterval);

    return () => clearInterval(idleInterval);
  }, []);

  useEffect(() => {
    const idleInterval = setInterval(() => {
      fetchResumeTitleCardsData(true);
    }, 3000);

    return () => clearInterval(idleInterval);
  }, []);

  return (
    <div className='home'>
      <Navbar />
      <div className="hero">
        {loading ? (
          <p>Loading...</p>
        ) : movieData ? (
          <>
            <img src={movieData.album_art_path} alt={movieData.name} className='banner-img' />
            <div className="hero-caption">
              <h2>{movieData.name}</h2>
              <p dangerouslySetInnerHTML={{ __html: movieData.des.replace(/\n/g, '<br />') }} />
              <div className="hero-btns">
                <Link
                  to={`/player/${movieData.id}`}
                  className='btn play-btn'
                  state={{
                    url: movieData.url,
                    name: movieData.name,
                    id: movieData.id,
                    type: "Movie"
                  }}
                >
                  <img src={play_icon} alt="Play" />Play
                </Link>
                <button className='btn dark-btn'><img src={info_icon} alt="More Info" />More Info</button>
              </div>
            </div>
          </>
        ) : (
          <p>Refreshing page...</p>
        )}
      </div>

      <div className="resume-cards">

      </div>

      <div className="more-cards">
        {Object.keys(resumeTitleCardsData).map((title, idx) => (
          <ResumeTitleCards
            key={idx}
            title={title}
            movies={resumeTitleCardsData[title]}
          />
        ))}

        {Object.keys(titleCardsData).map((title, idx) => (
          <TitleCards key={idx} title={title} movies={titleCardsData[title]} />
        ))}
      </div>

      <Footer />
    </div>
  );
};

export default Home;
