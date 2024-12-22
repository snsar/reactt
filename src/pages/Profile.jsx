import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';

function Profile() {
  const { user } = useSelector((state) => state.auth);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    fullName: user?.fullName || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: user?.address || ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Implement update profile
    setIsEditing(false);
  };

  return (
    <div className="max-w-2xl mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Thông tin tài khoản</h1>
      
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center">
            <div className="w-20 h-20 rounded-full overflow-hidden">
              <img 
                src={user?.avatar || "https://via.placeholder.com/80"} 
                alt="Avatar" 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="ml-4">
              <h2 className="text-xl font-semibold">{user?.username}</h2>
              <p className="text-gray-600">{user?.email}</p>
            </div>
          </div>
          <button 
            className="btn btn-primary"
            onClick={() => setIsEditing(!isEditing)}
          >
            {isEditing ? 'Hủy' : 'Chỉnh sửa'}
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="label">Họ và tên</label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                disabled={!isEditing}
                className="input input-bordered w-full"
              />
            </div>
            
            <div>
              <label className="label">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                disabled={!isEditing}
                className="input input-bordered w-full"
              />
            </div>
            
            <div>
              <label className="label">Số điện thoại</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                disabled={!isEditing}
                className="input input-bordered w-full"
              />
            </div>
            
            <div>
              <label className="label">Địa chỉ</label>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleChange}
                disabled={!isEditing}
                className="textarea textarea-bordered w-full"
                rows="3"
              />
            </div>

            {isEditing && (
              <div className="flex justify-end">
                <button type="submit" className="btn btn-primary">
                  Lưu thay đổi
                </button>
              </div>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}

export default Profile; 