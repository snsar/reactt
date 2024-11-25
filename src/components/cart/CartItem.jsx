import { useDispatch } from 'react-redux';
import { updateQuantity, removeFromCart } from '../../store/slices/cartSlice';

function CartItem({ item }) {
  const dispatch = useDispatch();

  const handleQuantityChange = (newQuantity) => {
    dispatch(updateQuantity({
      cartId: item.cartId,
      productId: item.productId,
      quantity: newQuantity
    }));
  };

  const handleRemove = () => {
    dispatch(removeFromCart({
      cartId: item.cartId,
      productId: item.productId
    }));
  };

  return (
    <div className="card card-side bg-base-100 shadow-xl mb-4">
      <figure className="w-48">
        <img src={item.product.imageUrl} alt={item.product.name} className="object-cover h-full" />
      </figure>
      <div className="card-body">
        <h2 className="card-title">{item.product.name}</h2>
        <div className="flex items-center gap-4">
          <div className="flex items-center">
            <button 
              className="btn btn-square btn-sm"
              onClick={() => handleQuantityChange(item.quantity - 1)}
              disabled={item.quantity <= 1}
            >
              -
            </button>
            <span className="mx-2">{item.quantity}</span>
            <button 
              className="btn btn-square btn-sm"
              onClick={() => handleQuantityChange(item.quantity + 1)}
            >
              +
            </button>
          </div>
          <div className="text-xl font-bold">
            {(item.product.price * item.quantity).toLocaleString()}đ
          </div>
        </div>
        <div className="card-actions justify-end">
          <button className="btn btn-error btn-sm" onClick={handleRemove}>
            Xóa
          </button>
        </div>
      </div>
    </div>
  );
}

export default CartItem;