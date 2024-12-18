import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';  // Import Link and hooks
import './Search.css';
import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/Footer/Footer';

const Search = () => {
  const [query, setQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const searchUrl = import.meta.env.VITE_SPRING_MANAGEMENT_SEARCH_SHOW;


  // Retrieve the username from the profile selection stored in localStorage
  const profile = JSON.parse(localStorage.getItem('selectedProfile'));
  const username = profile ? `${profile.first_name} ${profile.last_name}` : '';

  // Hook to get the current URL query parameters (to maintain search state after navigation)
  const location = useLocation();
  const navigate = useNavigate();

  // Use the query from the URL to populate the search field on initial load
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const queryFromURL = queryParams.get('query') || '';
    setQuery(queryFromURL);
  }, [location.search]);

  // Function to handle search input change
  const handleInputChange = (e) => {
    setQuery(e.target.value);

    // Update the URL with the search query (preserve the state in the URL)
    navigate(`?query=${e.target.value}`, { replace: true });
  };

  // Fetch search results when query has at least 3 characters
  useEffect(() => {
    // Clear previous results if query is too short
    if (query.length < 3) {
      setSearchResults([]);
      return;
    }

    const fetchSearchResults = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${searchUrl}/${encodeURIComponent(query)}`);

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const textData = await response.json(); 
        let data;
        try {
          data = textData.fileSystemArrayList;  // Parse the string into an object
        } catch (error) {
          console.error('Error parsing JSON:', error);
          data = {};  // Set to an empty object if parsing fails
        }

        // Check if the response contains the 'cards' field and set the results
        setSearchResults(data || []);  // Use 'cards' instead of 'results'
      } catch (error) {
        console.error('Error fetching search results:', error);
        setSearchResults([]);  // In case of error, reset results to an empty array
      } finally {
        setLoading(false);
      }
    };

    fetchSearchResults();
  }, [query, username]);

  // Only render the results once the data is fetched
  const renderResults = () => {
    if (loading) {
      return <p>Loading search results...</p>;
    }

    if (searchResults.length === 0) {
      return query.length >= 3 ? <p>No results found.</p> : <p>Enter at least 3 characters to search.</p>;
    }

    return (
      <div className="search-results-list">
        {searchResults.map((card) => (
          <Link
            key={card.id}
            to={`/player/${card.id}`} // Navigate to the player page with the card id in the URL
            className="card"
            state={{ url: card.url, name: card.name, id:card.id }} // Pass data (URL and name) in the state
          >
            <div className="search-result-tile">
              <img src={card.albumArtPath} alt={card.name} className="search-result-image" />
              <h3>{card.name}</h3>
              {/* <p>{card.des}</p> Description for more details */}
            </div>
          </Link>
        ))}
      </div>
    );
  };

  return (
    <div className="search-page">
      <Navbar />
      <div className="search-content">
        <input
          type="text"
          placeholder="Search..."
          value={query}
          onChange={handleInputChange}
          className="search-input"
        />
        {renderResults()}
      </div>
      <Footer />
    </div>
  );
};

export default Search;
