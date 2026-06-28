import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './SignUpScreen.css';

const SignUpScreen = () => {
  const [formData, setFormData] = useState({ firstName: '', lastName: '', mail: '', password: '', repeatPassword: '', profileImage: null });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Get the API base URL from environment variables
  const API_URL = 'http://localhost:8080' || process.env.REACT_APP_API_URL;

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Password validation
    if (formData.password !== formData.repeatPassword) {
      setError('Passwords do not match');
      return;
    }

    if (!/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/.test(formData.password)) {
      setError('Password must be at least 8 characters long and include both letters and numbers');
      return;
    }

    let profilePicUrl = 'https://www.gravatar.com/avatar/?d=mp'; // Default profile picture URL

    if (formData.profileImage) {
      try {
        // Upload profile image
        const formDataToSend = new FormData();
        formDataToSend.append('file', formData.profileImage);
        formDataToSend.append('filename', formData.profileImage.name);

        const uploadResponse = await axios.post(`${API_URL}/upload/profilepic`, formDataToSend, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        profilePicUrl = formData.profileImage.name; // Use the uploaded image name
      } catch (error) {
        console.error('Error uploading profile picture:', error);
      }
    }

    try {
      // Create user
      const response = await fetch(`${API_URL}/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          mail: formData.mail,
          password: formData.password,
          profilePic: profilePicUrl,
        }),
      });

      if (response.status === 400) {
        alert('Email already exists');
        setFormData({ ...formData, mail: '', password: '', repeatPassword: '' });
      } else if (!response.ok) {
        alert('Sign-up failed');
      } else {
        navigate('/login'); // Redirect to login or another page after successful sign-up
      }
    } catch (error) {
      setError(error.message);
    }
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, profileImage: e.target.files[0] });
  };

  return (
    <div className="signup-screen">
      <form onSubmit={handleSubmit} className="signup-form">
        <h1>Sign Up</h1>
        {error && <div className="error">{error}</div>}
        <input
          type="text"
          placeholder="First Name"
          value={formData.firstName}
          onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="Last Name"
          value={formData.lastName}
          onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={formData.mail}
          onChange={(e) => setFormData({ ...formData, mail: e.target.value })}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          required
        />
        <input
          type="password"
          name="repeatPassword"
          placeholder="Repeat Password"
          value={formData.repeatPassword}
          onChange={(e) => setFormData({ ...formData, repeatPassword: e.target.value })}
          required
        />
        <input
          type="file"
          name="profileImage"
          onChange={handleFileChange}
        />
        <button type="submit">Sign Up</button>
      </form>
    </div>
  );
};

export default SignUpScreen;