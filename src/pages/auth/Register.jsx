import { Link } from 'react-router-dom';
import RegisterForm from '../../components/auth/RegisterForm';

function Register() {
  return (
    <div className="min-h-screen flex flex-col justify-center py-12">
      <div className="card w-[480px] bg-base-100 shadow-xl mx-auto">
        <div className="card-body">
          <h2 className="card-title justify-center text-2xl mb-4">Đăng ký tài khoản</h2>
          <RegisterForm />
          <div className="text-center mt-4">
            <p>
              Đã có tài khoản?{' '}
              <Link to="/login" className="link link-primary">
                Đăng nhập
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;