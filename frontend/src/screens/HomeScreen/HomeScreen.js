import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import NavBar from '../../components/NavBar';
import { useAuth } from '../../context/AuthContext';
import './HomeScreen.css';

function HomeScreen() {
  const [categories, setCategories] = useState({});
  const [randomMovie, setRandomMovie] = useState(null);
  const [error, setError] = useState(null);
  const [preview, setPreview] = useState(null);
  const [searchMessage, setSearchMessage] = useState('');
  const [selectedMovie, setSelectedMovie] = useState(null);
  const { token, userId } = useAuth();
  const navigate = useNavigate();

  // Get the API base URL from environment variables
  const API_URL = 'http://localhost:8080' || process.env.REACT_APP_API_URL;
  console.log(process.env.REACT_APP_API_URL);
  console.log(API_URL);

  const fetchMovies = useCallback((searchResults = null) => {
    if (searchResults !== null) {
      if (searchResults.length === 0) {
        setSearchMessage('No movies found for the search term.');
        setCategories({});
        setRandomMovie(null);
      } else {
        setSearchMessage('');
        setCategories({ 'Search Results': searchResults });
        setRandomMovie(searchResults[Math.floor(Math.random() * searchResults.length)]);
      }
      return;
    }

    const url = `${API_URL}/movies?userId=${userId}`;

    fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    })
      .then(response => {
        if (response.status === 404) {
          setSearchMessage('No movies found.');
          setCategories({});
          setRandomMovie(null);
          return null;
        }
        if (response.ok) {
          return response.json();
        }
        throw new Error('Network response was not ok.');
      })
      .then(data => {
        if (data) {
          setCategories(data);
          const allMovies = Object.values(data).flat();
          setRandomMovie(allMovies[Math.floor(Math.random() * allMovies.length)]);
        }
      })
      .catch(error => {
        console.error('Error fetching movies:', error);
        setError(error.message);
      });
  }, [token, userId]);

  useEffect(() => {
    fetchMovies();
  }, [fetchMovies]);

  const handleSearch = (searchResults) => {
    fetchMovies(searchResults);
  };

  const handleMouseEnter = (movieId) => {
    setPreview(movieId);
  };

  const handleMouseLeave = () => {
    setPreview(null);
  };

  const handleThumbnailClick = (movie) => {
    setSelectedMovie(movie);
  };

  const handleCloseBubble = () => {
    setSelectedMovie(null);
  };

  const handlePlayClick = (movieId) => {
    navigate(`/movies/${movieId}`);
  };

  if (error) {
    return <div className="error-message">Error: {error}</div>;
  }

  return (
    <div className="home-screen">
      <NavBar onSearch={handleSearch} />
      {searchMessage && (
        <div className="search-message-container">
          <div className="search-message">{searchMessage}</div>
        </div>
      )}
      {randomMovie && (
        <div className="banner" style={{ backgroundImage: `url(${randomMovie.poster})` }}>
          <div className="banner-contents">
            <h1 className="banner-title">{randomMovie.name}</h1>
            <div className="banner-buttons">
              <button className="banner-button" onClick={() => handlePlayClick(randomMovie._id)}>Play</button>
            </div>
          </div>
        </div>
      )}
      {/* Render categories and movies */}
      {Object.keys(categories).map(category => (
        categories[category].length > 0 && (
          <div key={category} className="category">
            <h2 className="category-title">{category}</h2>
            <div className="category-row">
              {categories[category].map(movie => (
                <div key={movie._id} className="movie-item">
                  <div
                    className="thumbnail-container"
                    onMouseEnter={() => handleMouseEnter(movie._id)}
                    onMouseLeave={handleMouseLeave}
                    onClick={() => handleThumbnailClick(movie)}
                  >
                    <img
                      src={movie.poster}
                      alt={`${movie.name} thumbnail`}
                      className="thumbnail"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )
      ))}
      {/* Render movie bubble */}
      {selectedMovie && (
        <div className="movie-bubble">
          <div className="movie-bubble-content">
            <button className="close-button" onClick={handleCloseBubble}>X</button>
            <iframe
              width="560"
              height="315"
              src={`https://www.youtube.com/embed/${selectedMovie.trailer.split('v=')[1]}?autoplay=1&mute=1`}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              title="video preview"
            ></iframe>
            <div className="movie-info">
              <h2>{selectedMovie.name}</h2>
              <button className="play-button" onClick={() => handlePlayClick(selectedMovie._id)}>Play</button>
              <p>{selectedMovie.description}</p>
              <p><strong>Year:</strong> {selectedMovie.year}</p>
              <p><strong>Director:</strong> {selectedMovie.director}</p>
              <p><strong>Genre:</strong> {selectedMovie.genre}</p>
              <p><strong>Rating:</strong> {selectedMovie.rating}</p>
              <p><strong>Length:</strong> {selectedMovie.length} minutes</p>
              <p><strong>Age Restriction:</strong> {selectedMovie.ageRestriction}+</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default HomeScreen;
