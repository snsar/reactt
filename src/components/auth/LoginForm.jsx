import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { login, clearError } from '../../store/slices/authSlice';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

function LoginForm() {
  const { register, handleSubmit, formState: { errors }, setError } = useForm();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading, error, isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    // Clear any existing errors when component mounts
    dispatch(clearError());

    // Redirect if already authenticated
    if (isAuthenticated) {
      navigate('/');
    }
  }, [dispatch, isAuthenticated, navigate]);

  const onSubmit = async (data) => {
    try {
      const result = await dispatch(login(data)).unwrap();
      if (result) {
        navigate('/');
      }
    } catch (err) {
      if (err.message) {
        setError('root', {
          type: 'manual',
          message: err.message
        });
      }
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
            {...register('userName', {
              required: 'Vui lòng nhập tên đăng nhập',
              minLength: {
                value: 3,
                message: 'Tên đăng nhập phải có ít nhất 3 ký tự'
              }
            })}
            className="input input-bordered w-full"
            placeholder="Nhập tên đăng nhập"
          />
          {errors.userName && <span className="text-error text-sm">{errors.userName.message}</span>}
        </div>

        <div>
          <label className="label">
            <span className="label-text">Mật khẩu</span>
          </label>
          <input
            type="password"
            {...register('password', {
              required: 'Vui lòng nhập mật khẩu',
              minLength: {
                value: 6,
                message: 'Mật khẩu phải có ít nhất 6 ký tự'
              }
            })}
            className="input input-bordered w-full"
            placeholder="Nhập mật khẩu"
          />
          {errors.password && <span className="text-error text-sm">{errors.password.message}</span>}
        </div>

        {(error || errors.root) && (
          <div className="alert alert-error">
            <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{errors.root?.message || error}</span>
          </div>
        )}

        <button
          type="submit"
          className="btn btn-primary w-full"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <span className="loading loading-spinner"></span>
              Đang đăng nhập...
            </>
          ) : (
            'Đăng nhập'
          )}
        </button>
      </form>
    </div>
  );
}

export default LoginForm;