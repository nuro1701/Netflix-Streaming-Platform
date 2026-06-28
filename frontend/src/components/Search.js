import React, { useState } from 'react';
import './Search.css'; // Import the CSS file

const Search = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSearchSubmit = async (e) => {
    e.preventDefault();
    if (searchTerm.trim() === '') return;

    try {
      const response = await fetch(`http://localhost:8080/movies/search/${searchTerm}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok && response.status !== 404) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      if (response.status === 404) {
        onSearch([]);
        return;
      }

      const data = await response.json();
      onSearch(data); // Pass the search results back to the parent component
    } catch (error) {
      console.error('Error fetching search results:', error);
    }
  };

  return (
    <form className="search-form" onSubmit={handleSearchSubmit}>
      <input
        type="text"
        className="search-input"
        placeholder="Search"
        value={searchTerm}
        onChange={handleSearchChange}
      />
      <button type="submit" className="search-button">
        <i className="fas fa-search"></i>
      </button>
    </form>
  );
};

export default Search;