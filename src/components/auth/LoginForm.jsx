import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../../store/slices/authSlice';
import { useNavigate } from 'react-router-dom';

function LoginForm() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading, error } = useSelector((state) => state.auth);

  const onSubmit = async (data) => {
    const result = await dispatch(login(data));
    if (!result.error) {
      navigate('/');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="label">
            <span className="label-text">Tên đăng nhập</span>
          </label>
          <input
            type="text"
            {...register('userName', { required: 'Vui lòng nhập tên đăng nhập' })}
            className="input input-bordered w-full"
          />
          {errors.userName && <span className="text-error">{errors.userName.message}</span>}
        </div>

        <div>
          <label className="label">
            <span className="label-text">Mật khẩu</span>
          </label>
          <input
            type="password"
            {...register('password', { required: 'Vui lòng nhập mật khẩu' })}
            className="input input-bordered w-full"
          />
          {errors.password && <span className="text-error">{errors.password.message}</span>}
        </div>

        {error && <div className="text-error">{error}</div>}

        <button type="submit" className="btn btn-primary w-full" disabled={isLoading}>
          {isLoading ? 'Đang đăng nhập...' : 'Đăng nhập'}
        </button>
      </form>
    </div>
  );
}

export default LoginForm;