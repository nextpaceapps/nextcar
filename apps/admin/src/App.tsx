import { Routes, Route, Link } from 'react-router-dom';
import CarsPage from './pages/CarsPage';
import EditCarPage from './pages/EditCarPage';
import CarForm from './components/cars/CarForm';
import './App.css'

function App() {
  return (
    <div className="app-container">
      <nav className="p-4 bg-gray-800 text-white mb-8">
        <ul className="flex gap-4">
          <li><Link to="/" className="hover:text-gray-300">Dashboard</Link></li>
          <li><Link to="/cars" className="hover:text-gray-300">Inventory</Link></li>
        </ul>
      </nav>

      <main className="container mx-auto p-4">
        <Routes>
          <Route path="/" element={<h1>Admin Dashboard</h1>} />
          <Route path="/cars" element={<CarsPage />} />
          <Route path="/cars/new" element={<CarForm />} />
          <Route path="/cars/:id/edit" element={<EditCarPage />} />
        </Routes>
      </main>
    </div>
  )
}

export default App
