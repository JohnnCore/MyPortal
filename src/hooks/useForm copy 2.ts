import { useReducer, useCallback, ChangeEvent, FormEvent } from 'react';

// Types
export type FormValues = Record<string, unknown>;

type FieldValue = string | number | boolean | Date | null | undefined;

interface FormField<T = FieldValue> {
  value: T;
  error?: string;
  touched: boolean;
  dirty: boolean;
}

type FormState<T> = {
  [K in keyof T]: FormField<T[K]>;
};

interface FormMeta {
  isSubmitting: boolean;
  isValid: boolean;
  isDirty: boolean;
  submitCount: number;
}

interface UseFormState<T> {
  fields: FormState<T>;
  meta: FormMeta;
}

// Validation function type
type ValidationRule<T> = (value: T) => string | undefined;
type FormValidation<T> = {
  [K in keyof T]?: ValidationRule<T[K]>[];
};

// Action types
type FormAction<T> =
  | { type: 'SET_FIELD'; field: keyof T; value: T[keyof T] }
  | { type: 'SET_FIELD_ERROR'; field: keyof T; error: string | undefined }
  | { type: 'TOUCH_FIELD'; field: keyof T }
  | { type: 'SET_SUBMITTING'; isSubmitting: boolean }
  | { type: 'INCREMENT_SUBMIT_COUNT' }
  | { type: 'RESET_FORM'; initialValues: T }
  | { type: 'VALIDATE_ALL' };

// Reducer
function formReducer<T extends Record<string, FieldValue>>(
  state: UseFormState<T>,
  action: FormAction<T>
): UseFormState<T> {
  switch (action.type) {
    case 'SET_FIELD': {
      const newFields = {
        ...state.fields,
        [action.field]: {
          ...state.fields[action.field],
          value: action.value,
          dirty: true,
        },
      };

      return {
        ...state,
        fields: newFields,
        meta: {
          ...state.meta,
          isDirty: Object.values(newFields).some(field => field.dirty),
          isValid: Object.values(newFields).every(field => !field.error),
        },
      };
    }

    case 'SET_FIELD_ERROR': {
      const newFields = {
        ...state.fields,
        [action.field]: {
          ...state.fields[action.field],
          error: action.error,
        },
      };

      return {
        ...state,
        fields: newFields,
        meta: {
          ...state.meta,
          isValid: Object.values(newFields).every(field => !field.error),
        },
      };
    }

    case 'TOUCH_FIELD':
      return {
        ...state,
        fields: {
          ...state.fields,
          [action.field]: {
            ...state.fields[action.field],
            touched: true,
          },
        },
      };

    case 'SET_SUBMITTING':
      return {
        ...state,
        meta: {
          ...state.meta,
          isSubmitting: action.isSubmitting,
        },
      };

    case 'INCREMENT_SUBMIT_COUNT':
      return {
        ...state,
        meta: {
          ...state.meta,
          submitCount: state.meta.submitCount + 1,
        },
      };

    case 'RESET_FORM': {
      const resetFields = Object.keys(action.initialValues).reduce((acc, key) => {
        const fieldKey = key as keyof T;
        acc[fieldKey] = {
          value: action.initialValues[fieldKey],
          error: undefined,
          touched: false,
          dirty: false,
        };
        return acc;
      }, {} as FormState<T>);

      return {
        fields: resetFields,
        meta: {
          isSubmitting: false,
          isValid: true,
          isDirty: false,
          submitCount: 0,
        },
      };
    }

    case 'VALIDATE_ALL': {
      const touchedFields = Object.keys(state.fields).reduce((acc, key) => {
        const fieldKey = key as keyof T;
        acc[fieldKey] = {
          ...state.fields[fieldKey],
          touched: true,
        };
        return acc;
      }, {} as FormState<T>);

      return {
        ...state,
        fields: touchedFields,
      };
    }

    default:
      return state;
  }
}

// Hook options
interface UseFormOptions<T> {
  initialValues: T;
  validation?: FormValidation<T>;
  onSubmit?: (values: T) => Promise<void> | void;
}

// Hook return type
interface UseFormReturn<T> {
  values: T;
  errors: { [K in keyof T]?: string };
  touched: { [K in keyof T]?: boolean };
  meta: FormMeta;
  setValue: (field: keyof T, value: T[keyof T]) => void;
  setError: (field: keyof T, error: string | undefined) => void;
  touchField: (field: keyof T) => void;
  handleChange: (field: keyof T) => (e: ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (e: FormEvent) => Promise<void>;
  reset: () => void;
  validateField: (field: keyof T) => void;
  validateForm: () => boolean;
}

// Main hook
export default function useForm<T extends Record<string, FieldValue>>({
  initialValues,
  validation = {},
  onSubmit,
}: UseFormOptions<T>): UseFormReturn<T> {
  // Initialize state
  const initialState: UseFormState<T> = {
    fields: Object.keys(initialValues).reduce((acc, key) => {
      const fieldKey = key as keyof T;
      acc[fieldKey] = {
        value: initialValues[fieldKey],
        error: undefined,
        touched: false,
        dirty: false,
      };
      return acc;
    }, {} as FormState<T>),
    meta: {
      isSubmitting: false,
      isValid: true,
      isDirty: false,
      submitCount: 0,
    },
  };

  const [state, dispatch] = useReducer(formReducer<T>, initialState);

  // Validation function
  const validateField = useCallback((field: keyof T) => {
    const fieldValidation = validation[field];
    if (!fieldValidation) return;

    const value = state.fields[field].value;
    let error: string | undefined;

    for (const rule of fieldValidation) {
      error = rule(value);
      if (error) break;
    }

    dispatch({ type: 'SET_FIELD_ERROR', field, error });
  }, [validation, state.fields]);

  // Set field value
  const setValue = useCallback((field: keyof T, value: T[keyof T]) => {
    dispatch({ type: 'SET_FIELD', field, value });

    // Validate if field has been touched
    if (state.fields[field].touched) {
      setTimeout(() => validateField(field), 0);
    }
  }, [validateField, state.fields]);

  // Set field error
  const setError = useCallback((field: keyof T, error: string | undefined) => {
    dispatch({ type: 'SET_FIELD_ERROR', field, error });
  }, []);

  // Touch field
  const touchField = useCallback((field: keyof T) => {
    dispatch({ type: 'TOUCH_FIELD', field });
    validateField(field);
  }, [validateField]);

  // Handle input change
  const handleChange = useCallback((field: keyof T) => {
    return (e: ChangeEvent<HTMLInputElement>) => {
      const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
      setValue(field, value as T[keyof T]);
    };
  }, [setValue]);

  // Validate entire form
  const validateForm = useCallback(() => {
    dispatch({ type: 'VALIDATE_ALL' });

    let isFormValid = true;
    Object.keys(state.fields).forEach(key => {
      const field = key as keyof T;
      const fieldValidation = validation[field];

      if (fieldValidation) {
        const value = state.fields[field].value;
        let error: string | undefined;

        for (const rule of fieldValidation) {
          error = rule(value);
          if (error) {
            isFormValid = false;
            dispatch({ type: 'SET_FIELD_ERROR', field, error });
            break;
          }
        }
      }
    });

    return isFormValid;
  }, [state.fields, validation]);

  // Handle form submit
  const handleSubmit = useCallback(async (e: FormEvent) => {
    e.preventDefault();

    dispatch({ type: 'INCREMENT_SUBMIT_COUNT' });

    const isValid = validateForm();
    if (!isValid || !onSubmit) return;

    dispatch({ type: 'SET_SUBMITTING', isSubmitting: true });

    try {
      const values = Object.keys(state.fields).reduce((acc, key) => {
        const fieldKey = key as keyof T;
        acc[fieldKey] = state.fields[fieldKey].value;
        return acc;
      }, {} as T);

      await onSubmit(values);
    } catch (error) {
      console.error('Form submission error:', error);
    } finally {
      dispatch({ type: 'SET_SUBMITTING', isSubmitting: false });
    }
  }, [validateForm, onSubmit, state.fields]);

  // Reset form
  const reset = useCallback(() => {
    dispatch({ type: 'RESET_FORM', initialValues });
  }, [initialValues]);

  // Extract current values and errors
  const values = Object.keys(state.fields).reduce((acc, key) => {
    const fieldKey = key as keyof T;
    acc[fieldKey] = state.fields[fieldKey].value;
    return acc;
  }, {} as T);

  const errors = Object.keys(state.fields).reduce((acc, key) => {
    const fieldKey = key as keyof T;
    const error = state.fields[fieldKey].error;
    if (error) acc[fieldKey] = error;
    return acc;
  }, {} as { [K in keyof T]?: string });

  const touched = Object.keys(state.fields).reduce((acc, key) => {
    const fieldKey = key as keyof T;
    acc[fieldKey] = state.fields[fieldKey].touched;
    return acc;
  }, {} as { [K in keyof T]?: boolean });

  return {
    values,
    errors,
    touched,
    meta: state.meta,
    setValue,
    setError,
    touchField,
    handleChange,
    handleSubmit,
    reset,
    validateField,
    validateForm,
  };
}

// Common validation rules
export const validationRules = {
  required: (message = 'This field is required') =>
    (value: FieldValue): string | undefined => {
      if (value === null || value === undefined || value === '') {
        return message;
      }
      return undefined;
    },

  minLength: (min: number, message?: string) =>
    (value: FieldValue): string | undefined => {
      if (typeof value === 'string' && value.length < min) {
        return message || `Must be at least ${min} characters`;
      }
      return undefined;
    },

  maxLength: (max: number, message?: string) =>
    (value: FieldValue): string | undefined => {
      if (typeof value === 'string' && value.length > max) {
        return message || `Must be no more than ${max} characters`;
      }
      return undefined;
    },

  email: (message = 'Please enter a valid email address') =>
    (value: FieldValue): string | undefined => {
      if (typeof value === 'string' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
          return message;
        }
      }
      return undefined;
    },

  pattern: (regex: RegExp, message = 'Invalid format') =>
    (value: FieldValue): string | undefined => {
      if (typeof value === 'string' && value && !regex.test(value)) {
        return message;
      }
      return undefined;
    },
};