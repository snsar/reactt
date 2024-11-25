import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/common/Layout';
import Home from './pages/Home';
import Products from './pages/Products';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
// import Cart from './pages/Cart';
// import AdminLayout from './components/common/AdminLayout';
// import AdminDashboard from './pages/Admin/Dashboard';
// import AdminProducts from './pages/Admin/Products';
// import AdminProductCreate from './pages/Admin/ProductCreate';
// import AdminProductEdit from './pages/Admin/ProductEdit';
// import AdminOrders from './pages/Admin/Orders';
// import AdminUsers from './pages/Admin/Users';
// import AdminCategories from './pages/Admin/Categories';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="products" element={<Products />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          {/* <Route 
            path="cart" 
            element={
              <PrivateRoute>
                <Cart />
              </PrivateRoute>
            } 
          /> */}
        </Route>
        
        {/* <Route 
          path="/admin" 
          element={
            <PrivateRoute roles={['ROLE_ADMIN']}>
              <AdminLayout />
            </PrivateRoute>
          }
        >
          <Route index element={<AdminDashboard />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="products/create" element={<AdminProductCreate />} />
          <Route path="products/edit/:id" element={<AdminProductEdit />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="categories" element={<AdminCategories />} />
        </Route> */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
