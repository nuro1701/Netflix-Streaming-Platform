import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomeScreen from './screens/HomeScreen/HomeScreen';
import LoginScreen from './screens/LoginScreen/LoginScreen';
import MovieScreen from './screens/MovieScreen/MovieScreen';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext'; // Import ThemeProvider
import ProtectedRoute from './components/ProtectedRoute';
import ManagementScreen from './screens/ManagementScreen/ManagementScreen';
import SignUpScreen from './screens/SignUpScreen/SignUpScreen';

function App() {
  return (
    <Router>
      <AuthProvider>
        <ThemeProvider>
          <Routes>
            <Route path="/login" element={<LoginScreen />} />
            <Route path="/signup" element={<SignUpScreen />} /> {/* Allow access without authentication */}
            <Route path="/" element={<ProtectedRoute element={HomeScreen} />} />
            <Route path="/movies/:id" element={<ProtectedRoute element={MovieScreen} />} />
            <Route path="/admin" element={<ProtectedRoute element={ManagementScreen} />} />
            {/* other routes */}
          </Routes>
        </ThemeProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;