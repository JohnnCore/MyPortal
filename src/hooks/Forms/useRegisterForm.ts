import { useCallback } from 'react';

import { useForm, UseFormReturn } from 'react-hook-form';

import { zodResolver } from '@hookform/resolvers/zod';

import { RegisterFormData, RegisterFormSchema } from '../../schemas/RegisterForm.schema';

interface UseRegisterFormProps {
  onSubmit?: (data: RegisterFormData) => Promise<void>;
  onCancel?: () => void;
}

interface UseRegisterFormReturn {
  form: UseFormReturn<RegisterFormData>;
  isDirty: boolean;
  isSubmitting: boolean;
  handleCancel: () => void;
  handleFormSubmit: (data: RegisterFormData) => Promise<void>;
}

const getDefaultFormData = (): RegisterFormData => ({
  username: '',
  email: '',
  password: '',
  confirmPassword: '',
});

export const useRegisterForm = ({
  onSubmit,
  onCancel,
}: UseRegisterFormProps): UseRegisterFormReturn => {
  const form = useForm<RegisterFormData>({
    defaultValues: getDefaultFormData(),
    resolver: zodResolver(RegisterFormSchema),
    mode: 'onBlur',
  });

  const { reset, formState } = form;

  const handleCancel = useCallback(() => {
    reset();
    onCancel?.();
  }, [reset, onCancel]);

  const handleFormSubmit = useCallback(
    async (data: RegisterFormData) => {
      await onSubmit?.(data);
      reset();
    },
    [onSubmit, reset]
  );

  return {
    form,
    isDirty: formState.isDirty,
    isSubmitting: formState.isSubmitting,
    handleCancel,
    handleFormSubmit,
  };
};
