import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import { useAuth } from './lib/AuthContext';
import CarsPage from './pages/CarsPage';
import EditCarPage from './pages/EditCarPage';
import CarForm from './components/cars/CarForm';
import LoginPage from './pages/LoginPage';
import ProtectedRoute from './components/ProtectedRoute';
import './App.css'

function App() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut();
    navigate('/login');
  };

  return (
    <div className="app-container">
      {user && (
        <nav className="p-4 bg-gray-800 text-white mb-8 flex justify-between">
          <ul className="flex gap-4">
            <li><Link to="/" className="hover:text-gray-300">Dashboard</Link></li>
            <li><Link to="/cars" className="hover:text-gray-300">Inventory</Link></li>
          </ul>
          <button onClick={handleLogout} className="text-sm bg-red-600 px-3 py-1 rounded hover:bg-red-700">Logout</button>
        </nav>
      )}

      <main className={user ? "container mx-auto p-4" : ""}>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/" element={<ProtectedRoute><h1>Admin Dashboard</h1></ProtectedRoute>} />
          <Route path="/cars" element={<ProtectedRoute><CarsPage /></ProtectedRoute>} />
          <Route path="/cars/new" element={<ProtectedRoute><CarForm /></ProtectedRoute>} />
          <Route path="/cars/:id/edit" element={<ProtectedRoute><EditCarPage /></ProtectedRoute>} />
        </Routes>
      </main>
    </div>
  )
}

export default App
