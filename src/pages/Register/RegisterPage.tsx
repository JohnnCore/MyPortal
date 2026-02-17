import PageContainer from '../../components/common/PageContainer/PageContainer';
import Input from '../../components/common/Input/Input';
import Button from '../../components/common/Button/Button';
import InputErrorMessage from '../../components/common/InputErrorMessage/InputErrorMessage';
import { useAuth } from '../../hooks/Auth/useAuth';
import { useNavigate } from 'react-router';
import { useRegisterForm } from '../../hooks/Forms/useRegisterForm';
import { RegisterFormData } from '../../schemas/RegisterForm.schema';

const RegisterPage = () => {
  const navigate = useNavigate();
  const { register: registerUser, isLoading, registerError, isRegisterSuccess } = useAuth();

  const handleSubmit = async (values: RegisterFormData) => {
    await registerUser({
      username: values.username,
      email: values.email,
      password: values.password,
    }).unwrap();

    if (isRegisterSuccess) {
      navigate('/dashboard');
    }
  };

  const { form, isSubmitting, handleFormSubmit } = useRegisterForm({
    onSubmit: handleSubmit,
  });

  const {
    register,
    formState: { errors },
  } = form;

  return (
    <PageContainer showNavbar={false}>
      <div className="min-h-screen flex items-center justify-center bg-dark py-8 px-2">
        <div className="w-full max-w-lg bg-[#22272b] rounded-lg shadow-xl border border-[#2c3e50] flex flex-col p-8 md:p-12">
          <div className="mb-8 flex flex-col items-center">
            {/* You can add a logo here if you have one */}
            <h1 className="text-3xl font-bold text-[#b6c2cf] mb-2">Sign up for MyPortal</h1>
            <p className="text-[#8c9bab] text-base text-center">
              Create your account to get started with your projects.
            </p>
          </div>
          <form
            className="flex flex-col gap-6 bg-dark p-0"
            onSubmit={form.handleSubmit(handleFormSubmit)}
            noValidate
          >
            <div>
              <Input
                id="register-username"
                label="Username"
                {...register('username')}
                error={!!errors.username}
                required
                autoComplete="username"
                className="bg-[#22272b] border-[#2c3e50] text-white focus:border-[#2684ff] focus:ring-[#2684ff]"
                labelClasses="text-[#b6c2cf]"
              />
              <InputErrorMessage error={errors.username?.message} />
            </div>
            <div>
              <Input
                id="register-email"
                label="Email"
                type="email"
                {...register('email')}
                error={!!errors.email}
                required
                autoComplete="email"
                className="bg-[#22272b] border-[#2c3e50] text-white focus:border-[#2684ff] focus:ring-[#2684ff]"
                labelClasses="text-[#b6c2cf]"
              />
              <InputErrorMessage error={errors.email?.message} />
            </div>
            <div>
              <Input
                id="register-password"
                label="Password"
                type="password"
                {...register('password')}
                error={!!errors.password}
                required
                autoComplete="new-password"
                className="bg-[#22272b] border-[#2c3e50] text-white focus:border-[#2684ff] focus:ring-[#2684ff]"
                labelClasses="text-[#b6c2cf]"
              />
              <InputErrorMessage error={errors.password?.message} />
            </div>
            <div>
              <Input
                id="register-confirm-password"
                label="Confirm Password"
                type="password"
                {...register('confirmPassword')}
                error={!!errors.confirmPassword}
                required
                autoComplete="new-password"
                className="bg-[#22272b] border-[#2c3e50] text-white focus:border-[#2684ff] focus:ring-[#2684ff]"
                labelClasses="text-[#b6c2cf]"
              />
              <InputErrorMessage error={errors.confirmPassword?.message} />
            </div>
            {registerError && (
              <div className="text-danger text-sm text-center">
                {typeof registerError === 'string'
                  ? registerError
                  : 'Registration failed. Please try again.'}
              </div>
            )}
            <Button
              type="submit"
              size="large"
              variant="primary"
              disabled={isSubmitting || isLoading}
              className="bg-[#2684ff] hover:bg-[#0052cc] text-white font-semibold rounded transition-colors duration-200 py-2 px-4 mt-2 shadow-sm"
            >
              {isSubmitting || isLoading ? 'Registering...' : 'Register'}
            </Button>
          </form>
        </div>
      </div>
    </PageContainer>
  );
};

export default RegisterPage;
