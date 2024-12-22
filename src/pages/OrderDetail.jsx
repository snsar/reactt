import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';

function OrderDetail() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // TODO: Implement fetch order detail
    setIsLoading(false);
  }, [id]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="py-8 text-center">
        <h1 className="text-2xl font-bold mb-4">Không tìm thấy đơn hàng</h1>
        <Link to="/orders" className="btn btn-primary">
          Quay lại danh sách đơn hàng
        </Link>
      </div>
    );
  }

  return (
    <div className="py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Chi tiết đơn hàng #{id}</h1>
        <Link to="/orders" className="btn btn-ghost">
          Quay lại
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="col-span-2">
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-semibold mb-4">Sản phẩm</h2>
            <div className="space-y-4">
              {order.items.map((item) => (
                <div key={item.id} className="flex items-center space-x-4">
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="w-20 h-20 object-cover rounded"
                  />
                  <div className="flex-1">
                    <h3 className="font-medium">{item.product.name}</h3>
                    <p className="text-gray-600">
                      {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.price)} x {item.quantity}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">
                      {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.price * item.quantity)}
                    </p>
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
                <span className="text-gray-600">Trạng thái</span>
                <span className={`badge ${getStatusBadgeColor(order.status)}`}>
                  {getStatusText(order.status)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Ngày đặt</span>
                <span>{new Date(order.createdAt).toLocaleDateString('vi-VN')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Tổng tiền hàng</span>
                <span>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(order.subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Phí vận chuyển</span>
                <span>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(order.shippingFee)}</span>
              </div>
              <div className="flex justify-between font-semibold">
                <span>Tổng cộng</span>
                <span>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(order.total)}</span>
              </div>
            </div>
          </div>

          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-semibold mb-4">Thông tin giao hàng</h2>
            <div className="space-y-2">
              <p>
                <span className="text-gray-600">Người nhận:</span> {order.shippingAddress.fullName}
              </p>
              <p>
                <span className="text-gray-600">Số điện thoại:</span> {order.shippingAddress.phone}
              </p>
              <p>
                <span className="text-gray-600">Địa chỉ:</span> {order.shippingAddress.address}
              </p>
            </div>
          </div>

          {order.status === 'PENDING' && (
            <button className="btn btn-error w-full">Hủy đơn hàng</button>
          )}
        </div>
      </div>
    </div>
  );
}

function getStatusBadgeColor(status) {
  switch (status) {
    case 'PENDING':
      return 'badge-warning';
    case 'CONFIRMED':
      return 'badge-info';
    case 'SHIPPING':
      return 'badge-primary';
    case 'DELIVERED':
      return 'badge-success';
    case 'CANCELLED':
      return 'badge-error';
    default:
      return 'badge-ghost';
  }
}

function getStatusText(status) {
  switch (status) {
    case 'PENDING':
      return 'Chờ xác nhận';
    case 'CONFIRMED':
      return 'Đã xác nhận';
    case 'SHIPPING':
      return 'Đang giao';
    case 'DELIVERED':
      return 'Đã giao';
    case 'CANCELLED':
      return 'Đã hủy';
    default:
      return status;
  }
}

export default OrderDetail; 