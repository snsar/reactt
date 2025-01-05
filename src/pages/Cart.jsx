import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { clearCart, setCartItems } from '../store/slices/cartSlice';
import { createOrder } from '../store/slices/orderSlice';
import { toast } from 'react-toastify';
import cartApi from '../api/cartApi';

function Cart() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { cartId, totalPrice, totalPriceAfterDiscount, totalItems, items } = useSelector((state) => state.cart);
  const { token } = useSelector((state) => state.auth);
  const [isLoading, setIsLoading] = useState(true);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('COD');
  const [shippingInfo, setShippingInfo] = useState({
    fullName: '',
    phone: '',
    address: '',
    note: ''
  });

  useEffect(() => {
    const fetchCart = async () => {
      if (!token) {
        setIsLoading(false);
        return;
      }
      try {
        const response = await cartApi.viewCart();
        if (response.data) {
          dispatch(setCartItems(response.data));
        }
      } catch (error) {
        console.error('Failed to fetch cart:', error);
        toast.error('Không thể tải thông tin giỏ hàng');
      } finally {
        setIsLoading(false);
      }
    };
    fetchCart();
  }, [dispatch, token]);

  const handleQuantityChange = async (cartItemId, productId, newQuantity) => {
    try {
      await cartApi.updateQuantity({
        cartId,
        productId,
        quantity: newQuantity
      });
      // Refresh cart after update
      const response = await cartApi.viewCart();
      if (response.data) {
        dispatch(setCartItems(response.data));
      }
    } catch (error) {
      console.error('Failed to update quantity:', error);
      toast.error('Không thể cập nhật số lượng');
    }
  };

  const handleRemoveItem = async (productId) => {
    try {
      await cartApi.deleteCartItem(cartId, productId);
      // Refresh cart after delete
      const response = await cartApi.viewCart();
      if (response.data) {
        dispatch(setCartItems(response.data));
      }
      toast.success('Đã xóa sản phẩm khỏi giỏ hàng');
    } catch (error) {
      console.error('Failed to remove item:', error);
      toast.error('Không thể xóa sản phẩm');
    }
  };

  const calculateShippingFee = () => {
    return totalPriceAfterDiscount >= 1000000 ? 0 : 30000;
  };

  const calculateTotal = () => {
    return totalPriceAfterDiscount + calculateShippingFee();
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
      errors.phone = 'Số điện thoại không hợp lệ';
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

    if (!token) {
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
        subtotal: totalPrice,
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

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      </div>
    );
  }

  if (!token) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-4">Vui lòng đăng nhập để xem giỏ hàng</h2>
          <Link to="/login" className="btn btn-primary">
            Đăng nhập
          </Link>
        </div>
      </div>
    );
  }

  if (!items || items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-4">Giỏ hàng trống</h2>
          <Link to="/products" className="btn btn-primary">
            Tiếp tục mua sắm
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-semibold mb-4">Giỏ hàng của bạn</h2>
            <div className="space-y-4">
              {items.map((item) => (
                <motion.div
                  key={item.cartItemId}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-start space-x-4 p-4 border rounded-lg"
                >
                  <img
                    src={item.imageUrl}
                    alt={item.productName}
                    className="w-24 h-24 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <Link to={`/products/${item.productId}`}>
                      <h3 className="font-medium hover:text-primary truncate">{item.productName}</h3>
                    </Link>
                    <div className="mt-1 space-y-1">
                      {item.discount > 0 ? (
                        <>
                          <p className="text-primary font-medium">
                            {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', maximumFractionDigits: 0 }).format(item.totalPriceAfterDiscount / item.quantity)}
                          </p>
                          <p className="text-sm text-gray-500 line-through">
                            {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', maximumFractionDigits: 0 }).format(item.price)}
                          </p>
                        </>
                      ) : (
                        <p className="text-primary font-medium">
                          {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', maximumFractionDigits: 0 }).format(item.price)}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center space-x-2 mt-2">
                      <button
                        className="btn btn-sm btn-square"
                        onClick={() => handleQuantityChange(item.cartItemId, item.productId, item.quantity - 1)}
                        disabled={item.quantity <= 1 || isCheckingOut}
                      >
                        -
                      </button>
                      <span className="w-8 text-center">{item.quantity}</span>
                      <button
                        className="btn btn-sm btn-square"
                        onClick={() => handleQuantityChange(item.cartItemId, item.productId, item.quantity + 1)}
                        disabled={isCheckingOut}
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">
                      {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', maximumFractionDigits: 0 }).format(item.totalPriceAfterDiscount)}
                    </p>
                    <button
                      className="text-red-500 hover:text-red-700"
                      onClick={() => handleRemoveItem(item.productId)}
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
                <span>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', maximumFractionDigits: 0 }).format(totalPrice)}</span>
              </div>
              {totalPrice > totalPriceAfterDiscount && (
                <div className="flex justify-between text-red-500">
                  <span>Giảm giá</span>
                  <span>-{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', maximumFractionDigits: 0 }).format(totalPrice - totalPriceAfterDiscount)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-gray-600">Phí vận chuyển</span>
                <span>
                  {calculateShippingFee() === 0
                    ? 'Miễn phí'
                    : new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', maximumFractionDigits: 0 }).format(calculateShippingFee())
                  }
                </span>
              </div>
              {calculateShippingFee() > 0 && (
                <p className="text-sm text-gray-500">
                  Miễn phí vận chuyển cho đơn hàng trên {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', maximumFractionDigits: 0 }).format(1000000)}
                </p>
              )}
              <div className="border-t pt-3 mt-3">
                <div className="flex justify-between font-semibold">
                  <span>Tổng cộng</span>
                  <span className="text-primary text-lg">
                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', maximumFractionDigits: 0 }).format(calculateTotal())}
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