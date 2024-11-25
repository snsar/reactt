import { Outlet } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';
import AdminHeader from './AdminHeader';

function AdminLayout() {
  return (
    <div className="min-h-screen bg-base-200">
      <AdminHeader />
      <div className="drawer lg:drawer-open">
        <input id="admin-drawer" type="checkbox" className="drawer-toggle" />
        <div className="drawer-content p-6">
          <Outlet />
        </div>
        <AdminSidebar />
      </div>
    </div>
  );
}

export default AdminLayout;