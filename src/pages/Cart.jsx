import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCart } from '../store/slices/cartSlice';
import CartItem from '../components/cart/CartItem';
import { Link } from 'react-router-dom';

function Cart() {
  const dispatch = useDispatch();
  const { items, total, isLoading } = useSelector((state) => state.cart);

  useEffect(() => {
    dispatch(fetchCart());
  }, [dispatch]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="text-center py-16">
        <h2 className="text-2xl font-bold mb-4">Giỏ hàng trống</h2>
        <Link to="/products" className="btn btn-primary">
          Tiếp tục mua sắm
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Giỏ hàng của bạn</h1>
      <div className="grid grid-cols-1 gap-4 mb-8">
        {items.map((item) => (
          <CartItem key={item.productId} item={item} />
        ))}
      </div>
      <div className="flex justify-between items-center">
        <div className="text-2xl font-bold">
          Tổng tiền: {total.toLocaleString()}đ
        </div>
        <Link to="/checkout" className="btn btn-primary">
          Thanh toán
        </Link>
      </div>
    </div>
  );
}

export default Cart;