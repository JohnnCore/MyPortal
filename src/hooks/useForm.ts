import { useCallback, useMemo, useReducer, useEffect, ChangeEvent, FocusEvent } from 'react';

// Types that are specific to useForm
export type FormValues = Record<string, any>;

export type FormErrors<Values extends FormValues> = Record<
  keyof Values,
  string | undefined | Record<keyof Values, string | undefined>
>;

export type FormTouched<Values extends FormValues> = Record<
  keyof Values,
  boolean | undefined | Record<keyof Values, boolean | undefined>
>;

export type FormState<Values extends FormValues = FormValues> = {
  values: Values;
  errors: FormErrors<Values>;
  touched: FormTouched<Values>;
  isSubmitting: boolean;
  isValid: boolean;
};

export type FormAction<Values extends FormValues = FormValues> =
  | {
    type: 'SET_VALUE';
    payload: {
      name: keyof Values;
      value: any;
      errors: FormErrors<Values>;
    };
  }
  | {
    type: 'SET_ERRORS';
    payload: { errors: FormErrors<Values>; isValid: boolean };
  }
  | {
    type: 'SET_TOUCHED';
    payload: { name: keyof Values; touched?: unknown };
  }
  | {
    type: 'SET_ALL_TOUCHED';
    payload: { touched: FormTouched<Values> };
  }
  | {
    type: 'SET_SUBMITTING';
    payload: { isSubmitting: boolean; isValid?: boolean };
  }
  | { type: 'RESET'; payload: { initState: FormState<Values> } }
  | { type: 'CLEAR'; payload: { initState: FormState<Values> } };

export type UseFormOnSubmit<Values extends FormValues = FormValues> =
  | ((values: Values) => Promise<void>)
  | ((values: Values) => void);

export type ValidationFunction<Values extends FormValues = FormValues> = (
  value: any,
  values?: Values
) => string | undefined;

export type UseFormProps<Values extends FormValues> = {
  initialValues: Values;
  validationFunctions?: Record<
    keyof Values,
    ValidationFunction<Values> | undefined
  >;
  enableReinitialize?: boolean;
  onFormSubmit: UseFormOnSubmit<Values>;
};

const stateInitializer = <Values extends FormValues>(
  initValue: undefined | boolean,
  initState: Values,
): FormTouched<Values> | FormErrors<Values> => {
  const newState = {} as any;

  Object.keys(initState).forEach(key => {
    if (typeof initState[key] === 'object' && initState[key] !== null && !Array.isArray(initState[key])) {
      newState[key] = stateInitializer(initValue, initState[key]);
    } else {
      newState[key] = initValue;
    }
  });

  return newState;
};

const validateFormValues = <Values extends FormValues>(
  values: Values,
  validationFunctions?: Record<keyof Values, ValidationFunction<Values> | undefined>
): { isValid: boolean; errors: FormErrors<Values> } => {
  const errors = {} as FormErrors<Values>;

  if (validationFunctions) {
    Object.keys(values).forEach(key => {
      const validationFn = validationFunctions[key];
      const error = validationFn ? validationFn(values[key], values) : undefined;
      (errors as Record<string, unknown>)[key] = error;
    });
  }

  const hasValidationErrors = Object.values(errors).some(err => Boolean(err));
  return { isValid: !hasValidationErrors, errors };
};

const formReducer = <Values extends FormValues = FormValues>(
  state: FormState<Values>,
  action: FormAction<Values>,
): FormState<Values> => {
  switch (action.type) {
    case 'SET_VALUE':
      return {
        ...state,
        values: {
          ...state.values,
          [action.payload.name]: action.payload.value,
        },
        errors: {
          ...state.errors,
          ...action.payload.errors,
        },
      };
    case 'SET_ERRORS':
      return {
        ...state,
        errors: {
          ...state.errors,
          ...action.payload.errors,
        },
        isValid: action.payload.isValid,
      };
    case 'SET_TOUCHED':
      return {
        ...state,
        touched: {
          ...state.touched,
          [action.payload.name]: action.payload.touched,
        },
      };
    case 'SET_ALL_TOUCHED':
      return {
        ...state,
        touched: action.payload.touched,
      };
    case 'SET_SUBMITTING':
      return {
        ...state,
        isSubmitting: action.payload.isSubmitting,
        isValid: action.payload.isValid ?? state.isValid,
      };
    case 'RESET':
    case 'CLEAR':
      return { ...action.payload.initState };
    default:
      return state;
  }
};

const useForm = <Values extends FormValues = FormValues>(
  props: UseFormProps<Values>,
) => {
  const { initialValues, validationFunctions, enableReinitialize = false, onFormSubmit } = props;

  const initialState = useMemo<FormState<Values>>(() => {
    const { isValid } = validateFormValues(initialValues, validationFunctions);
    return {
      values: initialValues || ({} as Values),
      errors: stateInitializer(undefined, initialValues) as FormErrors<Values>,
      touched: stateInitializer(false, initialValues) as FormTouched<Values>,
      isSubmitting: false,
      isValid,
    };
  }, [initialValues, validationFunctions]);

  const [state, dispatch] = useReducer(formReducer<Values>, initialState);

  const handleChange = useCallback(
    (name: keyof Values) => (event: ChangeEvent<any>) => {
      event.persist();
      const newValues = { ...state.values, [name]: event.target.value };
      const { errors } = validateFormValues(newValues, validationFunctions);

      dispatch({
        type: 'SET_VALUE',
        payload: {
          name,
          value: event.target.value,
          errors,
        },
      });
    },
    [validationFunctions, state.values],
  );

  const handleBlur = useCallback(
    (name: keyof Values) => (event: FocusEvent<any>) => {
      event.persist();
      dispatch({
        type: 'SET_TOUCHED',
        payload: {
          name,
          touched: true,
        },
      });
    },
    [],
  );

  const handleSubmit = useCallback(async (): Promise<{ isValid: boolean; errors: FormErrors<Values> }> => {
    try {
      // Mark all fields as touched to show validation errors
      const touched = stateInitializer(true, state.values) as FormTouched<Values>;
      dispatch({
        type: 'SET_ALL_TOUCHED',
        payload: { touched },
      });

      // Validate current values
      const { isValid, errors } = validateFormValues(state.values, validationFunctions);

      // Update errors in state
      dispatch({
        type: 'SET_ERRORS',
        payload: { errors, isValid },
      });

      // Only proceed with submission if valid
      if (!isValid) {
        return { isValid, errors };
      }

      // Set submitting state
      dispatch({
        type: 'SET_SUBMITTING',
        payload: { isSubmitting: true, isValid },
      });

      await onFormSubmit(state.values);
      return { isValid, errors };
    } catch (error) {
      console.error('Form submission error:', error);
      return { isValid: false, errors: {} as FormErrors<Values> };
    } finally {
      dispatch({
        type: 'SET_SUBMITTING',
        payload: { isSubmitting: false },
      });
    }
  }, [state.values, validationFunctions, onFormSubmit]);

  const handleReset = useCallback(() => {
    dispatch({
      type: 'RESET',
      payload: { initState: initialState },
    });
  }, [initialState]);

  const setFieldValue = useCallback(
    (name: keyof Values, value: any) => {
      const newValues = { ...state.values, [name]: value };
      const { errors } = validateFormValues(newValues, validationFunctions);

      dispatch({
        type: 'SET_VALUE',
        payload: { name, value, errors },
      });
    },
    [state.values, validationFunctions],
  );

  useEffect(() => {
    if (enableReinitialize) {
      dispatch({
        type: 'RESET',
        payload: { initState: initialState },
      });
    }
  }, [initialState, enableReinitialize]);

  return {
    values: state.values,
    errors: state.errors,
    touched: state.touched,
    isSubmitting: state.isSubmitting,
    isValid: state.isValid,
    handleChange,
    handleBlur,
    handleSubmit,
    handleReset,
    setFieldValue,
  };
};

export default useForm;