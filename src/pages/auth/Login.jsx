import { Link } from 'react-router-dom';
import LoginForm from '../../components/auth/LoginForm';

function Login() {
  return (
    <div className="min-h-screen flex flex-col justify-center">
      <div className="card w-96 bg-base-100 shadow-xl mx-auto">
        <div className="card-body">
          <h2 className="card-title justify-center text-2xl mb-4">Đăng nhập</h2>
          <LoginForm />
          <div className="divider">HOẶC</div>
          <div className="text-center space-y-2">
            <Link to="/forgot-password" className="link link-primary block">
              Quên mật khẩu?
            </Link>
            <p>
              Chưa có tài khoản?{' '}
              <Link to="/register" className="link link-primary">
                Đăng ký ngay
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;