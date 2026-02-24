import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import { useAuth } from './lib/AuthContext';
import CarsPage from './pages/CarsPage';
import EditCarPage from './pages/EditCarPage';
import CarForm from './components/cars/CarForm';
import DashboardPage from './pages/DashboardPage';
import LoginPage from './pages/LoginPage';
import ProtectedRoute from './components/ProtectedRoute';
import CustomersPage from './pages/CustomersPage';
import EditCustomerPage from './pages/EditCustomerPage';
import CustomerForm from './components/customers/CustomerForm';
import OpportunitiesPage from './pages/OpportunitiesPage';
import EditOpportunityPage from './pages/EditOpportunityPage';
import OpportunityForm from './components/opportunities/OpportunityForm';
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
            <li><Link to="/customers" className="hover:text-gray-300">Customers</Link></li>
            <li><Link to="/opportunities" className="hover:text-gray-300">Opportunities</Link></li>
          </ul>
          <button onClick={handleLogout} className="text-sm bg-red-600 px-3 py-1 rounded hover:bg-red-700">Logout</button>
        </nav>
      )}

      <main className={user ? "container mx-auto p-4" : ""}>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
          <Route path="/cars" element={<ProtectedRoute><CarsPage /></ProtectedRoute>} />
          <Route path="/cars/new" element={<ProtectedRoute><CarForm /></ProtectedRoute>} />
          <Route path="/cars/:id/edit" element={<ProtectedRoute><EditCarPage /></ProtectedRoute>} />
          <Route path="/customers" element={<ProtectedRoute><CustomersPage /></ProtectedRoute>} />
          <Route path="/customers/new" element={<ProtectedRoute><CustomerForm /></ProtectedRoute>} />
          <Route path="/customers/:id/edit" element={<ProtectedRoute><EditCustomerPage /></ProtectedRoute>} />
          <Route path="/opportunities" element={<ProtectedRoute><OpportunitiesPage /></ProtectedRoute>} />
          <Route path="/opportunities/new" element={<ProtectedRoute><OpportunityForm /></ProtectedRoute>} />
          <Route path="/opportunities/:id/edit" element={<ProtectedRoute><EditOpportunityPage /></ProtectedRoute>} />
        </Routes>
      </main>
    </div>
  )
}

export default App
