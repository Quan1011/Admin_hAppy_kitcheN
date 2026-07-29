import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import RestaurantInfo from './pages/RestaurantInfo';
import MenuManagement from './pages/MenuManagement';
import CategoriesManagement from './pages/CategoriesManagement';
import AllergensAdditivesManagement from './pages/AllergensAdditivesManagement'; // Import ở đây
import Login from './pages/Login';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="info" element={<RestaurantInfo />} />
            <Route path="categories" element={<CategoriesManagement />} />
            <Route path="allergens" element={<AllergensAdditivesManagement />} /> {/* Thêm Route mới */}
            <Route path="menu" element={<MenuManagement />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;