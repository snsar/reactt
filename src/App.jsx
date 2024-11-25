import { useEffect } from 'react'
import './App.css'

function App() {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="bg-base-100 shadow-md fixed top-0 left-0 right-0 z-50">
        <div className="container mx-auto px-4">
          <div className="navbar">
            <div className="navbar-start">
              <div className="dropdown">
                <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" />
                  </svg>
                </div>
                <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
                  <li><a>Trang chủ</a></li>
                  <li><a>Sản phẩm</a></li>
                  <li><a>Khuyến mãi</a></li>
                  <li><a>Liên hệ</a></li>
                </ul>
              </div>
              <a className="btn btn-ghost text-xl">SHOP</a>
            </div>
            <div className="navbar-center hidden lg:flex">
              <ul className="menu menu-horizontal px-1">
                <li><a>Trang chủ</a></li>
                <li><a>Sản phẩm</a></li>
                <li><a>Khuyến mãi</a></li>
                <li><a>Liên hệ</a></li>
              </ul>
            </div>
            <div className="navbar-end">
              <button className="btn btn-ghost btn-circle">
                <div className="indicator">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  <span className="badge badge-sm indicator-item">0</span>
                </div>
              </button>
              <button className="btn btn-primary ml-4">Đăng nhập</button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero min-h-screen" style={{backgroundImage: 'url(https://daisyui.com/images/stock/photo-1507358522600-9f71e620c44e.jpg)'}}>
        <div className="hero-overlay bg-opacity-60"></div>
        <div className="hero-content text-center text-neutral-content">
          <div className="max-w-md">
            <h1 className="mb-5 text-5xl font-bold">Chào mừng đến với SHOP</h1>
            <p className="mb-5">Khám phá bộ sưu tập sản phẩm đa dạng với chất lượng tốt nhất và giá cả hợp lý.</p>
            <button className="btn btn-primary">Mua sắm ngay</button>
          </div>
        </div>
      </section>
      <div className="glass">Glass</div>
      {/* Featured Products */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8">Sản phẩm nổi bật</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((item) => (
              <div key={item} className="card bg-base-100 shadow-xl">
                <figure><img src="https://daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.jpg" alt="Shoes" /></figure>
                <div className="card-body">
                  <h2 className="card-title">Sản phẩm {item}</h2>
                  <p>Mô tả ngắn về sản phẩm...</p>
                  <div className="card-actions justify-end">
                    <button className="btn btn-primary">Mua ngay</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer p-10 bg-base-200 text-base-content">
        <nav>
          <h6 className="footer-title">Dịch vụ</h6> 
          <a className="link link-hover">Thương hiệu</a>
          <a className="link link-hover">Thiết kế</a>
          <a className="link link-hover">Marketing</a>
        </nav> 
        <nav>
          <h6 className="footer-title">Công ty</h6> 
          <a className="link link-hover">Về chúng tôi</a>
          <a className="link link-hover">Liên hệ</a>
          <a className="link link-hover">Tuyển dụng</a>
        </nav> 
        <nav>
          <h6 className="footer-title">Pháp lý</h6> 
          <a className="link link-hover">Điều khoản sử dụng</a>
          <a className="link link-hover">Chính sách bảo mật</a>
          <a className="link link-hover">Chính sách cookie</a>
        </nav>
      </footer>
    </div>
  )
}

export default App;
