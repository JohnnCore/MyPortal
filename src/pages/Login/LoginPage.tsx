import { LoginForm } from '../../components/authentication/Login/LoginForm';
import PageContainer from '../../components/common/PageContainer/PageContainer';

const LoginPage = () => {
  return (
    <PageContainer showNavbar={false}>
      <div className="min-h-screen flex items-center justify-center bg-dark py-8 px-2">
        <div className="w-full max-w-lg bg-[#22272b] rounded-lg shadow-xl border border-[#2c3e50] flex flex-col p-8 md:p-12">
          <div className="mb-8 flex flex-col items-center">
            {/* You can add a logo here if you have one */}
            <h1 className="text-3xl font-bold text-[#b6c2cf] mb-2">Sign in to MyPortal</h1>
            <p className="text-[#8c9bab] text-base text-center">
              Welcome back! Please enter your credentials to continue.
            </p>
          </div>
          <LoginForm />
        </div>
      </div>
    </PageContainer>
  );
};

export default LoginPage;
