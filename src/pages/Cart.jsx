import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { removeFromCart, updateQuantity, clearCart } from '../store/slices/cartSlice';

function Cart() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items } = useSelector((state) => state.cart);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [shippingInfo, setShippingInfo] = useState({
    fullName: '',
    phone: '',
    address: '',
    note: ''
  });

  const handleQuantityChange = (id, newQuantity) => {
    if (newQuantity < 1) return;
    dispatch(updateQuantity({ id, quantity: newQuantity }));
  };

  const handleRemoveItem = (id) => {
    dispatch(removeFromCart(id));
  };

  const calculateSubtotal = () => {
    return items.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const calculateShippingFee = () => {
    // Có thể thay đổi logic tính phí ship ở đây
    return items.length > 0 ? 30000 : 0;
  };

  const calculateTotal = () => {
    return calculateSubtotal() + calculateShippingFee();
  };

  const handleShippingInfoChange = (e) => {
    setShippingInfo({
      ...shippingInfo,
      [e.target.name]: e.target.value
    });
  };

  const handleCheckout = async (e) => {
    e.preventDefault();
    // TODO: Implement checkout API call
    try {
      setIsCheckingOut(true);
      // Gọi API checkout ở đây
      dispatch(clearCart());
      navigate('/orders');
    } catch (error) {
      console.error('Checkout failed:', error);
    } finally {
      setIsCheckingOut(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">Giỏ hàng trống</h1>
        <p className="text-gray-600 mb-8">Bạn chưa có sản phẩm nào trong giỏ hàng</p>
        <Link to="/products" className="btn btn-primary">
          Tiếp tục mua sắm
        </Link>
      </div>
    );
  }

  return (
    <div className="py-8">
      <h1 className="text-2xl font-bold mb-6">Giỏ hàng</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="p-6 space-y-4">
              {items.map((item) => (
                <div key={item.id} className="flex items-center space-x-4 py-4 border-b last:border-0">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-24 h-24 object-cover rounded"
                  />
                  <div className="flex-1">
                    <h3 className="font-medium">{item.name}</h3>
                    <p className="text-gray-600">
                      {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.price)}
                    </p>
                    <div className="flex items-center space-x-2 mt-2">
                      <button
                        className="btn btn-sm btn-square"
                        onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                      >
                        -
                      </button>
                      <span className="w-8 text-center">{item.quantity}</span>
                      <button
                        className="btn btn-sm btn-square"
                        onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">
                      {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.price * item.quantity)}
                    </p>
                    <button
                      className="btn btn-ghost btn-sm text-error mt-2"
                      onClick={() => handleRemoveItem(item.id)}
                    >
                      Xóa
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-semibold mb-4">Thông tin đơn hàng</h2>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Tạm tính</span>
                <span>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(calculateSubtotal())}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Phí vận chuyển</span>
                <span>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(calculateShippingFee())}</span>
              </div>
              <div className="border-t pt-2 mt-2">
                <div className="flex justify-between font-semibold">
                  <span>Tổng cộng</span>
                  <span>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(calculateTotal())}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-semibold mb-4">Thông tin giao hàng</h2>
            <form onSubmit={handleCheckout} className="space-y-4">
              <div>
                <label className="label">Họ và tên</label>
                <input
                  type="text"
                  name="fullName"
                  value={shippingInfo.fullName}
                  onChange={handleShippingInfoChange}
                  required
                  className="input input-bordered w-full"
                />
              </div>
              
              <div>
                <label className="label">Số điện thoại</label>
                <input
                  type="tel"
                  name="phone"
                  value={shippingInfo.phone}
                  onChange={handleShippingInfoChange}
                  required
                  className="input input-bordered w-full"
                />
              </div>
              
              <div>
                <label className="label">Địa chỉ</label>
                <textarea
                  name="address"
                  value={shippingInfo.address}
                  onChange={handleShippingInfoChange}
                  required
                  className="textarea textarea-bordered w-full"
                  rows="2"
                />
              </div>
              
              <div>
                <label className="label">Ghi chú</label>
                <textarea
                  name="note"
                  value={shippingInfo.note}
                  onChange={handleShippingInfoChange}
                  className="textarea textarea-bordered w-full"
                  rows="2"
                />
              </div>

              <button
                type="submit"
                className="btn btn-primary w-full"
                disabled={isCheckingOut}
              >
                {isCheckingOut ? 'Đang xử lý...' : 'Đặt hàng'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Cart;