import { Link, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../store/slices/authSlice';

function Header() {
  const dispatch = useDispatch();
  const location = useLocation();
  const { user, isAuthenticated, isLoading } = useSelector((state) => state.auth);
  const { items } = useSelector((state) => state.cart);

  const isActive = (path) => {
    return location.pathname === path;
  };

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <header className="navbar bg-base-100 shadow-lg fixed top-0 z-50">
      <div className="navbar-start">
        <div className="dropdown">
          <label tabIndex={0} className="btn btn-ghost lg:hidden">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" />
            </svg>
          </label>
          <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
            <li>
              <Link to="/" className={isActive('/') ? 'active' : ''}>
                Trang chủ
              </Link>
            </li>
            <li>
              <Link to="/products" className={isActive('/products') ? 'active' : ''}>
                Sản phẩm
              </Link>
            </li>
          </ul>
        </div>
        <Link to="/" className="btn btn-ghost normal-case text-xl font-bold">
          <span className="text-primary">SHOP</span>
        </Link>
      </div>
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1">
          <li>
            <Link to="/" className={isActive('/') ? 'active' : ''}>
              Trang chủ
            </Link>
          </li>
          <li>
            <Link to="/products" className={isActive('/products') ? 'active' : ''}>
              Sản phẩm
            </Link>
          </li>
        </ul>
      </div>

      <div className="navbar-end">
        <Link to="/cart" className="btn btn-ghost btn-circle">
          <div className="indicator">
            <svg xmlns="http://www.w3.org/2000/svg" className="cart-icon h-5 w-5 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            {items?.length > 0 && (
              <span className="badge badge-sm indicator-item badge-primary">{items.length}</span>
            )}
          </div>
        </Link>

        {isLoading ? (
          <button className="btn btn-ghost loading">Loading...</button>
        ) : isAuthenticated ? (
          <div className="dropdown dropdown-end">
            <label tabIndex={0} className="btn btn-ghost">
              <span className="text-base font-medium">
                {user?.username || 'Người dùng'}
              </span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </label>
            <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
              <li>
                <Link to="/profile" className={isActive('/profile') ? 'active' : ''}>
                  <i className="fas fa-user"></i> Tài khoản
                </Link>
              </li>
              <li>
                <Link to="/orders" className={isActive('/orders') ? 'active' : ''}>
                  <i className="fas fa-shopping-bag"></i> Đơn hàng
                </Link>
              </li>
              <div className="divider my-0"></div>
              <li>
                <button onClick={handleLogout} className="text-error">
                  <i className="fas fa-sign-out-alt"></i> Đăng xuất
                </button>
              </li>
            </ul>
          </div>
        ) : (
          <Link to="/login" className="btn btn-primary">
            <i className="fas fa-sign-in-alt mr-2"></i>
            Đăng nhập
          </Link>
        )}
      </div>
    </header>
  );
}

export default Header;