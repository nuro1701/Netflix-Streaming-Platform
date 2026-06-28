import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import './ManagementScreen.css';
import NavBar from '../../components/NavBar'; // Import the NavBar component

const defaultPoster = 'https://cdn.pixabay.com/photo/2022/08/24/20/20/netflix-7408710_1280.png';
const defaultTrailer = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ';

function ManagementScreen() {
  const { token } = useAuth();
  const [movies, setMovies] = useState([]);
  const [categories, setCategories] = useState([]);
  const [newMovie, setNewMovie] = useState({
    name: '', year: 2025, director: '', genre: '', rating: '', description: '',
    poster: defaultPoster, trailer: defaultTrailer, filename: ''
  });
  const [newCategory, setNewCategory] = useState({ name: '', promoted: 'true' });
  const [editMovieId, setEditMovieId] = useState(null); // Track the movie being edited
  const [editCategoryId, setEditCategoryId] = useState(null); // Track the category being edited
  const [file, setFile] = useState(null);

  // Get the API base URL from environment variables
  const API_URL = 'http://localhost:8080' || process.env.REACT_APP_API_URL;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const moviesResponse = await axios.get(`${API_URL}/movies/all`);
        setMovies(moviesResponse.data);
      } catch (error) {
        console.error('Error fetching movies:', error);
        // Handle the error appropriately, e.g., show an error message to the user
      }

      try {
        const categoriesResponse = await axios.get(`${API_URL}/categories`);
        setCategories(categoriesResponse.data);
      } catch (error) {
        console.error('Error fetching categories:', error);
        // Handle the error appropriately, e.g., show an error message to the user
      }
    };

    fetchData();
  }, []);

  const handleDeleteCategory = (id) => {
    axios.delete(`${API_URL}/categories/${id}`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      }
    }).then(() => {
      setCategories(categories.filter(category => category._id !== id));
      alert('Delete successfully');
    });
  }

  const handleAddOrEditMovie = async (e) => {
    e.preventDefault();
    try {
      if (editMovieId) {
        // Update existing movie
        axios.put(`${API_URL}/movies/${editMovieId}`, newMovie, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          }
        }).then(response => {
          uploadVideo();
          alert('Edited successfully');
          setMovies(movies.map(movie => movie._id === editMovieId ? response.data : movie));
          setEditMovieId(null);
          resetNewMovieForm();
        });
      } else {
        // Add new movie
        const response = await axios.post(`${API_URL}/movies`, newMovie, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          }
        });
        await uploadVideo();
        alert('Added successfully');
        setMovies([...movies, response.data.movie]);
        resetNewMovieForm();
      }
    } catch (error) {
      alert('name, genre and File name are required');
    }
  };

  const handleDeleteMovie = (id) => {
    axios.delete(`${API_URL}/movies/${id}`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      }
    }).then(() => {
      alert('Delete successfully');
      setMovies(movies.filter(movie => movie._id !== id));
    });
  };

  const handleAddOrEditCategory = async (e) => {
    e.preventDefault();
    try {
      if (editCategoryId) {
        // Update existing category
        const response = await axios.patch(`${API_URL}/categories/${editCategoryId}`, newCategory, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          }
        });
        alert('Edited successfully');
        setCategories(categories.map(category => category._id === editCategoryId ? response.data.updatedCategory : category));
        setEditCategoryId(null);
        resetNewCategoryForm();
      } else {
        // Add new category
        const response = await axios.post(`${API_URL}/categories`, newCategory, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          }
        });
        alert('Edited successfully');
        setCategories([...categories, response.data]);
        resetNewCategoryForm();
      }
    } catch (error) {
      alert('Added successfully');
      alert("Error editing/adding movie");
    }
  };

  const handleEditMovie = (movie) => {
    setNewMovie(movie);
    setEditMovieId(movie._id);
  };

  const handleEditCategory = (category) => {
    setNewCategory(category);
    setEditCategoryId(category._id);
  };

  const resetNewMovieForm = () => {
    setNewMovie({
      name: '', year: 2025, director: '', genre: '', rating: '', description: '',
      poster: defaultPoster, trailer: defaultTrailer, filename: ''
    });
  };

  const resetNewCategoryForm = () => {
    setNewCategory({ name: '', promoted: 'true' });
  };

  const uploadVideo = async () => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('filename', newMovie.filename);

    try {
      const response = await axios.post(`${API_URL}/upload/video`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log('File uploaded successfully:', response.data);
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    setNewMovie({ ...newMovie, filename: selectedFile.name });
  };

  return (
    <div className="management-screen">
      <div className='nav-bar'>
        <NavBar />
      </div>
      <div>
        <h1>Management Screen</h1>
        <section>
          <h2>Categories</h2>
          <div className="category-list">
            {console.log(categories)}
            {categories.map(category => (
              <div key={category._id} className="category-item">
                <p>{category.name}</p>
                <button onClick={() => handleEditCategory(category)}>Edit</button>
                <button onClick={() => handleDeleteCategory(category._id)}>Delete</button>
              </div>
            ))}
          </div>
          <div>
            <form onSubmit={handleAddOrEditCategory}>
              <h3>{editCategoryId ? 'Edit Category' : 'Add New Category'}</h3>
              <input
                type="text"
                placeholder="Category Name"
                value={newCategory.name}
                onChange={e => setNewCategory({ ...newCategory, name: e.target.value })}
              />
              <label for="isPromoted">
                Promoted:
                <select name='isPromoted' onChange={e => { setNewCategory({ ...newCategory, promoted: e.target.value }) }}>
                  <option value='true'>Yes</option>
                  <option value='false'>No</option>
                </select>
              </label>
              <button type='submit'>{editCategoryId ? 'Update Category' : 'Add Category'}</button>
            </form>
          </div>
        </section>

        <section>
          <h2>Movies</h2>
          <div className="movie-list">
            {movies.map(movie => (
              <div key={movie._id} className="movie-item">
                {console.log(movie)}
                <p>{movie.name}</p>
                <button onClick={() => handleEditMovie(movie)}>Edit</button>
                <button onClick={() => handleDeleteMovie(movie._id)}>Delete</button>
              </div>
            ))}
          </div>
          <div>
            <form onSubmit={handleAddOrEditMovie}>
              <h3>{editMovieId ? 'Edit Movie' : 'Add New Movie'}</h3>
              <input
                type="text"
                placeholder="Title"
                value={newMovie.name}
                onChange={e => setNewMovie({ ...newMovie, name: e.target.value })}
              />
              <input
                type="text"
                placeholder="Genre"
                value={newMovie.genre}
                onChange={e => setNewMovie({ ...newMovie, genre: e.target.value })}
              />
              <input
                type="file"
                onChange={handleFileChange}
              />
              <label htmlFor="year-dropdown">
                Year Released:
                <select name="year-dropdown">
                  {Array.from({ length: 2025 - 1900 + 1 }, (_, index) => {
                    const year = 2025 - index; // Start from 2025
                    return <option key={year} value={year}>{year}</option>;
                  })}
                </select>
              </label>
              <input
                type="text"
                placeholder="Director"
                value={newMovie.director}
                onChange={e => setNewMovie({ ...newMovie, director: e.target.value })}
              />
              <label htmlFor="rating-dropdown">
                Rating:
                <select name="rating-dropdown">
                  {Array.from({ length: 10 - 1 + 1 }, (_, index) => {
                    const rating = 10 - index; // Start from 10
                    return <option key={rating} value={rating}>{rating}</option>;
                  })}
                </select>
              </label>
              <input
                type="text"
                placeholder="Description"
                value={newMovie.description}
                onChange={e => setNewMovie({ ...newMovie, description: e.target.value })}
              />
              <input
                type="text"
                placeholder="Poster URL"
                value={newMovie.poster}
                onChange={e => setNewMovie({ ...newMovie, poster: e.target.value })}
              />
              <input
                type="text"
                placeholder="Trailer - YouTube URL"
                value={newMovie.trailer}
                onChange={e => setNewMovie({ ...newMovie, trailer: e.target.value })}
              />
              <input
                type="number"
                placeholder="Length"
                value={newMovie.length}
                onChange={e => setNewMovie({ ...newMovie, length: e.target.value })}
              />
              <input
                type="number"
                placeholder="Age Restriction"
                value={newMovie.ageRestriction}
                onChange={e => setNewMovie({ ...newMovie, ageRestriction: e.target.value })}
              />
              {/* Other inputs for movie fields */}
              <button type="submit">{editMovieId ? 'Update Movie' : 'Add Movie'}</button>
            </form>
          </div>
        </section>
      </div>
    </div>
  );
}

export default ManagementScreen;
