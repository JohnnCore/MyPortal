import React, { useCallback, useEffect, useMemo, useReducer } from "react";

export type FormValues = Record<string, unknown>;

export type FormErrors<Values extends FormValues> = {
  [K in keyof Values]:
    | string
    | undefined
    | FormErrors<Values[K] extends FormValues ? Values[K] : never>;
};

export type FormTouched<Values extends FormValues> = {
  [K in keyof Values]:
    | boolean
    | undefined
    | FormTouched<Values[K] extends FormValues ? Values[K] : never>;
};

export type InitialState<Values extends FormValues = FormValues> = {
  values: Values;
  errors: FormErrors<Values>;
  touched: FormTouched<Values>;
  isSubmitting: boolean;
  isValid: boolean;
};

export type ActionTypePayload<Values extends FormValues = FormValues> =
  | {
      type: "SET_VALUE";
      payload: {
        name: keyof Values;
        value: Values[keyof Values];
        errors: FormErrors<Values>;
      };
    }
  | {
      type: "SET_ERRORS";
      payload: { errors: FormErrors<Values>; isValid: boolean };
    }
  | {
      type: "SET_TOUCHED";
      payload: {
        name: keyof Values;
        touched?: FormTouched<Values>[keyof Values];
        error?: FormErrors<Values>[keyof Values];
      };
    }
  | {
      type: "SET_ALL_TOUCHED";
      payload: { touched: FormTouched<Values> };
    }
  | {
      type: "SET_SUBMITTING";
      payload: { isSubmitting: boolean; isValid?: boolean };
    }
  | { type: "RESET"; payload: { InitialState: InitialState<Values> } }
  | { type: "CLEAR"; payload: { InitialState: InitialState<Values> } };

export type UseFormOnSubmit<Values extends FormValues = FormValues> =
  | ((values: Values) => Promise<void>)
  | ((values: Values) => void);

export type UseFormProps<Values extends FormValues> = {
  initialValues: Values;
  validationFunctions?: {
    [K in keyof Values]?:
      | ((value: Values[K], values?: Values) => string | undefined)
      | undefined;
  };
  onChangeFunctions?: { [K in keyof Values]?: () => void };
  onFormSubmit: UseFormOnSubmit<Values>;
};

export const stateInitializer = <Values extends FormValues>(
  initValue: undefined | boolean,
  InitialState: Values
): FormTouched<Values> => {
  const newState = {} as FormTouched<Values>;

  Object.keys(InitialState).forEach((key) => {
    const typedKey = key as keyof Values;
    if (
      typeof InitialState[typedKey] === "object" &&
      InitialState[typedKey] !== null
    ) {
      newState[typedKey] = stateInitializer(
        initValue,
        InitialState[typedKey] as FormValues
      ) as FormTouched<Values>[keyof Values];
    } else {
      newState[typedKey] = initValue as FormTouched<Values>[keyof Values];
    }
  });

  return newState;
};

export const isFormValid = <Values extends FormValues>(
  values: Values,
  validationFunctions?: UseFormProps<Values>["validationFunctions"]
): { isValid: boolean; errors: FormErrors<Values> } => {
  const errors = {} as FormErrors<Values>;
  (Object.keys(values) as (keyof Values)[]).forEach((key) => {
    const newError =
      validationFunctions && validationFunctions[key]
        ? validationFunctions[key]!(values[key], values)
        : undefined;

    errors[key] = newError as FormErrors<Values>[keyof Values];
  });
  const haveValidationErrors = Object.values(errors).some(Boolean);
  return { isValid: !haveValidationErrors, errors };
};

export const reducer = <Values extends FormValues = FormValues>(
  state: InitialState<Values>,
  action: ActionTypePayload<Values>
): InitialState<Values> => {
  switch (action.type) {
    case "SET_VALUE":
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
    case "SET_ERRORS":
      return {
        ...state,
        errors: {
          ...state.errors,
          ...action.payload.errors,
        },
      };
    case "SET_TOUCHED":
      return {
        ...state,
        touched: {
          ...state.touched,
          [action.payload.name]: action.payload.touched!,
        },
      };
    case "SET_ALL_TOUCHED":
      return {
        ...state,
        touched: {
          ...action.payload.touched,
        },
      };
    case "SET_SUBMITTING":
      return {
        ...state,
        isSubmitting: action.payload.isSubmitting,
        isValid: action.payload.isValid ?? state.isValid,
      };
    case "RESET":
    case "CLEAR":
      return { ...action.payload.InitialState };
    default:
      return state;
  }
};

const useForm = <Values extends FormValues = FormValues>(
  props: UseFormProps<Values>
) => {
  const initialState = useMemo<InitialState<Values>>(() => {
    return {
      values: props.initialValues || ({} as Values),
      errors: stateInitializer(
        undefined,
        props.initialValues
      ) as FormErrors<Values>,
      touched: stateInitializer(false, props.initialValues),
      isSubmitting: false,
      isValid: isFormValid(props.initialValues, props.validationFunctions)
        .isValid,
    };
  }, [props.initialValues, props.validationFunctions]);

  const [state, dispatch] = useReducer(reducer<Values>, initialState);

  const handleChange = useCallback(
    (name: keyof Values) =>
      (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        event.persist();
        const { errors } = isFormValid(
          { ...state.values, [name]: event.target.value } as Values,
          props.validationFunctions
        );

        dispatch({
          type: "SET_VALUE",
          payload: {
            name,
            value: event.target.value as Values[keyof Values],
            errors,
          },
        });
      },
    [props.validationFunctions, state.values]
  );

  const handleBlur = useCallback(
    (name: keyof Values) =>
      (event: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        event.persist();

        dispatch({
          type: "SET_TOUCHED",
          payload: {
            name,
            touched: true,
          },
        });
      },
    []
  );

  const handleSubmit = useCallback(async () => {
    try {
      const touched = stateInitializer(true, state.values);

      dispatch({
        type: "SET_ALL_TOUCHED",
        payload: {
          touched,
        },
      });

      const { isValid, errors } = isFormValid(
        state.values,
        props.validationFunctions
      );

      if (!isValid) {
        dispatch({
          type: "SET_ERRORS",
          payload: {
            errors,
            isValid,
          },
        });
        return { isValid, errors };
      }

      dispatch({
        type: "SET_SUBMITTING",
        payload: {
          isSubmitting: true,
          isValid,
        },
      });

      await props.onFormSubmit(state.values);
      return { isValid, errors };
    } catch (error) {
      console.error(error);
      return { isValid: undefined, errors: undefined };
    } finally {
      dispatch({
        type: "SET_SUBMITTING",
        payload: {
          isSubmitting: false,
        },
      });
    }
  }, [props, state.values]);

  const handleReset = useCallback(() => {
    dispatch({
      type: "RESET",
      payload: { InitialState: initialState },
    });
  }, [initialState]);

  const handleClearForm = useCallback(() => {
    dispatch({
      type: "CLEAR",
      payload: {
        InitialState: {
          ...initialState,
          values: stateInitializer(undefined, initialState.values) as Values,
          errors: stateInitializer(
            undefined,
            initialState.values
          ) as FormErrors<Values>,
          touched: stateInitializer(false, initialState.values),
        },
      },
    });
  }, [initialState]);

  const setFieldValue = useCallback(
    (name: keyof Values, value: Values[keyof Values]) => {
      const fieldError = props.validationFunctions?.[name]
        ? props.validationFunctions[name](value, {
            ...state.values,
            [name]: value,
          })
        : undefined;

      dispatch({
        type: "SET_VALUE",
        payload: {
          name,
          value,
          errors: { ...state.errors, [name]: fieldError },
        },
      });
    },
    [props.validationFunctions, state.errors, state.values]
  );

  useEffect(() => {
    dispatch({
      type: "RESET",
      payload: { InitialState: { ...initialState } },
    });
  }, [initialState]);

  return {
    isValid: state.isValid,
    values: state.values,
    errors: state.errors,
    touched: state.touched,
    isSubmitting: state.isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
    handleReset,
    handleClearForm,
    setFieldValue,
  };
};

export default useForm;
