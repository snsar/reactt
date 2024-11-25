import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { register as registerUser } from '../../store/slices/authSlice';

const schema = yup.object({
  userName: yup.string().required('Vui lòng nhập tên đăng nhập'),
  email: yup.string().email('Email không hợp lệ').required('Vui lòng nhập email'),
  password: yup.string()
    .min(6, 'Mật khẩu phải có ít nhất 6 ký tự')
    .required('Vui lòng nhập mật khẩu'),
  confirmPassword: yup.string()
    .oneOf([yup.ref('password')], 'Mật khẩu không khớp')
    .required('Vui lòng xác nhận mật khẩu'),
  phone: yup.string()
    .matches(/^[0-9]+$/, 'Số điện thoại không hợp lệ')
    .min(10, 'Số điện thoại không hợp lệ')
    .max(11, 'Số điện thoại không hợp lệ')
    .required('Vui lòng nhập số điện thoại')
}).required();

function RegisterForm() {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema)
  });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading, error } = useSelector((state) => state.auth);

  const onSubmit = async (data) => {
    const result = await dispatch(registerUser(data));
    if (!result.error) {
      navigate('/login');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="label">
          <span className="label-text">Tên đăng nhập</span>
        </label>
        <input
          type="text"
          {...register('userName')}
          className="input input-bordered w-full"
        />
        {errors.userName && (
          <span className="text-error text-sm">{errors.userName.message}</span>
        )}
      </div>

      <div>
        <label className="label">
          <span className="label-text">Email</span>
        </label>
        <input
          type="email"
          {...register('email')}
          className="input input-bordered w-full"
        />
        {errors.email && (
          <span className="text-error text-sm">{errors.email.message}</span>
        )}
      </div>

      <div>
        <label className="label">
          <span className="label-text">Số điện thoại</span>
        </label>
        <input
          type="tel"
          {...register('phone')}
          className="input input-bordered w-full"
        />
        {errors.phone && (
          <span className="text-error text-sm">{errors.phone.message}</span>
        )}
      </div>

      <div>
        <label className="label">
          <span className="label-text">Mật khẩu</span>
        </label>
        <input
          type="password"
          {...register('password')}
          className="input input-bordered w-full"
        />
        {errors.password && (
          <span className="text-error text-sm">{errors.password.message}</span>
        )}
      </div>

      <div>
        <label className="label">
          <span className="label-text">Xác nhận mật khẩu</span>
        </label>
        <input
          type="password"
          {...register('confirmPassword')}
          className="input input-bordered w-full"
        />
        {errors.confirmPassword && (
          <span className="text-error text-sm">{errors.confirmPassword.message}</span>
        )}
      </div>

      {error && <div className="text-error">{error}</div>}

      <button type="submit" className="btn btn-primary w-full" disabled={isLoading}>
        {isLoading ? 'Đang đăng ký...' : 'Đăng ký'}
      </button>
    </form>
  );
}

export default RegisterForm;