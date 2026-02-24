import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import { useAuth } from './lib/AuthContext';
import VehiclesPage from './pages/VehiclesPage';
import EditVehiclePage from './pages/EditVehiclePage';
import VehicleForm from './components/vehicles/VehicleForm';
import DashboardPage from './pages/DashboardPage';
import PipelinePage from './pages/PipelinePage';
import UsersPage from './pages/UsersPage';
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
  const { user, role, signOut } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut();
    navigate('/login');
  };

  return (
    <div className="app-container">
      {user && (
        <nav className="p-4 bg-gray-800 text-white mb-8 flex justify-between items-center">
          <ul className="flex gap-4">
            <li><Link to="/" className="hover:text-gray-300">Dashboard</Link></li>
            <li><Link to="/vehicles" className="hover:text-gray-300">Vehicles</Link></li>
            <li><Link to="/customers" className="hover:text-gray-300">Customers</Link></li>
            <li><Link to="/opportunities" className="hover:text-gray-300">Opportunities</Link></li>
            <li><Link to="/pipeline" className="hover:text-gray-300">Pipeline</Link></li>
            {role === 'Admin' && (
              <li><Link to="/users" className="hover:text-gray-300">Users</Link></li>
            )}
          </ul>
          <div className="flex items-center gap-3">
            {role && (
              <span className="text-xs bg-gray-700 px-2 py-1 rounded">{role}</span>
            )}
            <button onClick={handleLogout} className="text-sm bg-red-600 px-3 py-1 rounded hover:bg-red-700">Logout</button>
          </div>
        </nav>
      )}

      <main className={user ? "container mx-auto p-4" : ""}>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
          <Route path="/vehicles" element={<ProtectedRoute><VehiclesPage /></ProtectedRoute>} />
          <Route path="/vehicles/new" element={<ProtectedRoute><VehicleForm /></ProtectedRoute>} />
          <Route path="/vehicles/:id/edit" element={<ProtectedRoute><EditVehiclePage /></ProtectedRoute>} />
          <Route path="/customers" element={<ProtectedRoute><CustomersPage /></ProtectedRoute>} />
          <Route path="/customers/new" element={<ProtectedRoute><CustomerForm /></ProtectedRoute>} />
          <Route path="/customers/:id/edit" element={<ProtectedRoute><EditCustomerPage /></ProtectedRoute>} />
          <Route path="/opportunities" element={<ProtectedRoute><OpportunitiesPage /></ProtectedRoute>} />
          <Route path="/opportunities/new" element={<ProtectedRoute><OpportunityForm /></ProtectedRoute>} />
          <Route path="/opportunities/:id/edit" element={<ProtectedRoute><EditOpportunityPage /></ProtectedRoute>} />
          <Route path="/pipeline" element={<ProtectedRoute><PipelinePage /></ProtectedRoute>} />
          {role === 'Admin' && <Route path="/users" element={<ProtectedRoute><UsersPage /></ProtectedRoute>} />}
        </Routes>
      </main>
    </div>
  )
}

export default App
