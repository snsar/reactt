import { Link, useLocation } from 'react-router-dom';

function AdminSidebar() {
  const location = useLocation();
  
  const menuItems = [
    { path: '/admin', icon: '📊', label: 'Tổng quan' },
    { path: '/admin/products', icon: '📦', label: 'Sản phẩm' },
    { path: '/admin/orders', icon: '📝', label: 'Đơn hàng' },
    { path: '/admin/users', icon: '👥', label: 'Người dùng' },
    { path: '/admin/categories', icon: '📑', label: 'Danh mục' }
  ];

  return (
    <div className="drawer-side">
      <label htmlFor="admin-drawer" className="drawer-overlay"></label>
      <aside className="bg-base-100 w-80 min-h-full">
        <div className="p-4">
          <h2 className="text-2xl font-bold text-center mb-6">Admin Panel</h2>
          <ul className="menu menu-lg">
            {menuItems.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={location.pathname === item.path ? 'active' : ''}
                >
                  <span className="text-xl">{item.icon}</span>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </aside>
    </div>
  );
}

export default AdminSidebar;