import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { logout } from '../../store/slices/authSlice';

function AdminHeader() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  return (
    <header className="navbar bg-base-100 shadow-lg">
      <div className="flex-1">
        <label htmlFor="admin-drawer" className="btn btn-ghost lg:hidden">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-6 h-6 stroke-current">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
          </svg>
        </label>
        <Link to="/" className="btn btn-ghost text-xl">Về trang chủ</Link>
      </div>
      <div className="flex-none gap-2">
        <div className="dropdown dropdown-end">
          <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
            <div className="w-10 rounded-full">
              <img src={user?.imageUrl || "https://via.placeholder.com/40"} alt="avatar" />
            </div>
          </label>
          <ul tabIndex={0} className="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52">
            <li><Link to="/profile">Tài khoản</Link></li>
            <li><button onClick={() => dispatch(logout())}>Đăng xuất</button></li>
          </ul>
        </div>
      </div>
    </header>
  );
}

export default AdminHeader;