import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { removeFromCart, updateQuantity, clearCart } from '../store/slices/cartSlice';
import { createOrder } from '../store/slices/orderSlice';
import { toast } from 'react-toastify';

function Cart() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items, totalAmount } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.auth);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('COD');
  const [shippingInfo, setShippingInfo] = useState({
    fullName: user?.fullName || '',
    phone: user?.phone || '',
    address: user?.address || '',
    note: ''
  });

  const handleQuantityChange = (id, newQuantity, stockQuantity) => {
    if (newQuantity < 1) return;
    if (newQuantity > stockQuantity) {
      toast.warning(`Chỉ còn ${stockQuantity} sản phẩm trong kho`);
      return;
    }
    dispatch(updateQuantity({ id, quantity: newQuantity }));
    toast.success('Đã cập nhật số lượng');
  };

  const handleRemoveItem = (id) => {
    dispatch(removeFromCart(id));
    toast.success('Đã xóa sản phẩm khỏi giỏ hàng');
  };

  const calculateSubtotal = () => {
    return items.reduce((total, item) => {
      const price = item.discount > 0 
        ? item.price * (1 - item.discount/100) 
        : item.price;
      return total + price * item.quantity;
    }, 0);
  };

  const calculateShippingFee = () => {
    const subtotal = calculateSubtotal();
    return subtotal >= 1000000 ? 0 : 30000;
  };

  const calculateTotal = () => {
    return calculateSubtotal() + calculateShippingFee();
  };

  const handleShippingInfoChange = (e) => {
    const { name, value } = e.target;
    setShippingInfo(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    const errors = {};
    if (!shippingInfo.fullName.trim()) {
      errors.fullName = 'Vui lòng nhập họ tên';
    }
    if (!shippingInfo.phone.trim()) {
      errors.phone = 'Vui lòng nhập số điện thoại';
    } else if (!/^[0-9]{10}$/.test(shippingInfo.phone.trim())) {
      errors.phone = 'S��� điện thoại không hợp lệ';
    }
    if (!shippingInfo.address.trim()) {
      errors.address = 'Vui lòng nhập địa chỉ giao hàng';
    }

    if (Object.keys(errors).length > 0) {
      Object.values(errors).forEach(error => toast.error(error));
      return false;
    }
    return true;
  };

  const handleCheckout = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    if (!user) {
      toast.warning('Vui lòng đăng nhập để đặt hàng');
      navigate('/login');
      return;
    }

    try {
      setIsCheckingOut(true);
      const orderData = {
        items: items.map(item => ({
          productId: item.id,
          quantity: item.quantity,
          price: item.price,
          discount: item.discount
        })),
        shippingInfo,
        paymentMethod,
        subtotal: calculateSubtotal(),
        shippingFee: calculateShippingFee(),
        total: calculateTotal()
      };

      const result = await dispatch(createOrder(orderData)).unwrap();
      
      if (result.success) {
        if (paymentMethod === 'VNPAY' && result.paymentUrl) {
          window.location.href = result.paymentUrl;
        } else {
          dispatch(clearCart());
          navigate(`/orders/${result.orderId}`);
          toast.success('Đặt hàng thành công!');
        }
      } else {
        toast.error(result.message || 'Đặt hàng thất bại');
      }
    } catch (error) {
      console.error('Checkout failed:', error);
      toast.error('Đặt hàng thất bại. Vui lòng thử lại sau.');
    } finally {
      setIsCheckingOut(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="py-16 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <i className="fas fa-shopping-cart text-6xl text-gray-300 mb-4"></i>
          <h1 className="text-2xl font-bold mb-4">Giỏ hàng trống</h1>
          <p className="text-gray-600 mb-8">Bạn chưa có sản phẩm nào trong giỏ hàng</p>
          <Link to="/products" className="btn btn-primary">
            <i className="fas fa-shopping-bag mr-2"></i>
            Tiếp tục mua sắm
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="py-8">
      <h1 className="text-2xl font-bold mb-6">Giỏ hàng của bạn</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="p-6 space-y-4">
              {items.map((item) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="flex items-center space-x-4 py-4 border-b last:border-0"
                >
                  <Link to={`/products/${item.id}`} className="shrink-0">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-24 h-24 object-cover rounded"
                    />
                  </Link>
                  <div className="flex-1 min-w-0">
                    <Link to={`/products/${item.id}`}>
                      <h3 className="font-medium hover:text-primary truncate">{item.name}</h3>
                    </Link>
                    <div className="mt-1 space-y-1">
                      {item.discount > 0 ? (
                        <>
                          <p className="text-primary font-medium">
                            {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.price * (1 - item.discount/100))}
                          </p>
                          <p className="text-sm text-gray-500 line-through">
                            {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.price)}
                          </p>
                        </>
                      ) : (
                        <p className="text-primary font-medium">
                          {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.price)}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center space-x-2 mt-2">
                      <button
                        className="btn btn-sm btn-square"
                        onClick={() => handleQuantityChange(item.id, item.quantity - 1, item.stockQuantity)}
                        disabled={isCheckingOut}
                      >
                        -
                      </button>
                      <span className="w-8 text-center">{item.quantity}</span>
                      <button
                        className="btn btn-sm btn-square"
                        onClick={() => handleQuantityChange(item.id, item.quantity + 1, item.stockQuantity)}
                        disabled={isCheckingOut}
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">
                      {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(
                        item.price * item.quantity * (1 - item.discount/100)
                      )}
                    </p>
                    <button
                      className="text-red-500 hover:text-red-700"
                      onClick={() => handleRemoveItem(item.id)}
                      disabled={isCheckingOut}
                    >
                      <i className="fas fa-trash-alt mr-1"></i>
                      Xóa
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white shadow rounded-lg p-6"
          >
            <h2 className="text-lg font-semibold mb-4">Thông tin đơn hàng</h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Tạm tính</span>
                <span>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(calculateSubtotal())}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Phí vận chuyển</span>
                <span>
                  {calculateShippingFee() === 0 
                    ? 'Miễn phí' 
                    : new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(calculateShippingFee())
                  }
                </span>
              </div>
              {calculateShippingFee() > 0 && (
                <p className="text-sm text-gray-500">
                  Miễn phí vận chuyển cho đơn hàng trên 1.000.000₫
                </p>
              )}
              <div className="border-t pt-3 mt-3">
                <div className="flex justify-between font-semibold">
                  <span>Tổng cộng</span>
                  <span className="text-primary text-lg">
                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(calculateTotal())}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white shadow rounded-lg p-6"
          >
            <h2 className="text-lg font-semibold mb-4">Thông tin giao hàng</h2>
            <form onSubmit={handleCheckout} className="space-y-4">
              <div>
                <label className="label">
                  <span className="label-text">Họ và tên</span>
                  <span className="label-text-alt text-error">*</span>
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={shippingInfo.fullName}
                  onChange={handleShippingInfoChange}
                  className="input input-bordered w-full"
                  placeholder="Nhập họ và tên người nhận"
                  disabled={isCheckingOut}
                />
              </div>
              
              <div>
                <label className="label">
                  <span className="label-text">Số điện thoại</span>
                  <span className="label-text-alt text-error">*</span>
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={shippingInfo.phone}
                  onChange={handleShippingInfoChange}
                  className="input input-bordered w-full"
                  placeholder="Nhập số điện thoại liên hệ"
                  disabled={isCheckingOut}
                />
              </div>
              
              <div>
                <label className="label">
                  <span className="label-text">Địa chỉ giao hàng</span>
                  <span className="label-text-alt text-error">*</span>
                </label>
                <textarea
                  name="address"
                  value={shippingInfo.address}
                  onChange={handleShippingInfoChange}
                  className="textarea textarea-bordered w-full"
                  rows="2"
                  placeholder="Nhập địa chỉ giao hàng chi tiết"
                  disabled={isCheckingOut}
                />
              </div>
              
              <div>
                <label className="label">
                  <span className="label-text">Ghi chú</span>
                </label>
                <textarea
                  name="note"
                  value={shippingInfo.note}
                  onChange={handleShippingInfoChange}
                  className="textarea textarea-bordered w-full"
                  rows="2"
                  placeholder="Ghi chú thêm về đơn hàng (nếu có)"
                  disabled={isCheckingOut}
                />
              </div>

              <div>
                <label className="label">
                  <span className="label-text">Phương thức thanh toán</span>
                </label>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 cursor-pointer p-3 border rounded-lg">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="COD"
                      checked={paymentMethod === 'COD'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="radio radio-primary"
                      disabled={isCheckingOut}
                    />
                    <span>Thanh toán khi nhận hàng (COD)</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer p-3 border rounded-lg">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="VNPAY"
                      checked={paymentMethod === 'VNPAY'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="radio radio-primary"
                      disabled={isCheckingOut}
                    />
                    <span>Thanh toán qua VNPAY</span>
                  </label>
                </div>
              </div>

              <button
                type="submit"
                className="btn btn-primary w-full"
                disabled={isCheckingOut}
              >
                {isCheckingOut ? (
                  <>
                    <span className="loading loading-spinner"></span>
                    <span className="ml-2">Đang xử lý...</span>
                  </>
                ) : (
                  <>
                    <i className="fas fa-check-circle mr-2"></i>
                    Đặt hàng ({new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(calculateTotal())})
                  </>
                )}
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default Cart;