import { SerializedError } from '@reduxjs/toolkit';

import { CustomError } from '../../redux/api/apiSlice';
import { useAppSelector } from '../../hooks/reduxHooks';
import {
  selectAuthInitialized,
  selectCurrentUser,
  selectIsAuthenticated,
} from '../../redux/auth/authSelectors';
import {
  useLoginMutation,
  useLogoutMutation,
  useRegisterMutation,
} from '../../redux/api/Auth/authApiSlice';

interface UseAuthReturn {
  user: ReturnType<typeof selectCurrentUser>;
  isAuthenticated: boolean;
  isInitialized: boolean;

  // loading
  isLoading: boolean;

  // auth actions
  login: ReturnType<typeof useLoginMutation>[0];
  logout: ReturnType<typeof useLogoutMutation>[0];
  register: ReturnType<typeof useRegisterMutation>[0];

  // errors
  loginError: CustomError | SerializedError | undefined;
  logoutError: CustomError | SerializedError | undefined;
  registerError: CustomError | SerializedError | undefined;

  // API status
  isLoginSuccess: boolean;
  isLogoutSuccess: boolean;
  isRegisterSuccess: boolean;
}

export const useAuth = (): UseAuthReturn => {
  const user = useAppSelector(selectCurrentUser);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const isInitialized = useAppSelector(selectAuthInitialized);

  // ——— MUTATIONS ———
  const [login, { isLoading: isLoginLoading, error: loginError, isSuccess: isLoginSuccess }] =
    useLoginMutation();

  const [logout, { isLoading: isLogoutLoading, error: logoutError, isSuccess: isLogoutSuccess }] =
    useLogoutMutation();

  const [
    register,
    { isLoading: isRegisterLoading, error: registerError, isSuccess: isRegisterSuccess },
  ] = useRegisterMutation();

  return {
    user,
    isAuthenticated,
    isInitialized,
    isLoading: isLoginLoading || isLogoutLoading || isRegisterLoading,

    login,
    logout,
    register,

    loginError,
    logoutError,
    registerError,

    isLoginSuccess,
    isLogoutSuccess,
    isRegisterSuccess,
  };
};
