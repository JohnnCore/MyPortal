// import React, {
//   useState,
//   useCallback,
//   useEffect,
//   useRef,
//   useImperativeHandle,
//   forwardRef,
//   useMemo,
//   useReducer,
// } from "react";

// // ===== GENERIC USEFORM HOOK =====
// type FormValues = Record<string, any>;

// type FormErrors<Values extends FormValues> = Record<
//   keyof Values,
//   string | undefined | Record<keyof Values, string | undefined>
// >;

// type FormTouched<Values extends FormValues> = Record<
//   keyof Values,
//   boolean | undefined | Record<keyof Values, boolean | undefined>
// >;

// type FormState<Values extends FormValues = FormValues> = {
//   values: Values;
//   errors: FormErrors<Values>;
//   touched: FormTouched<Values>;
//   isSubmitting: boolean;
//   isValid: boolean;
// };

// type FormAction<Values extends FormValues = FormValues> =
//   | {
//       type: "SET_VALUE";
//       payload: {
//         name: keyof Values;
//         value: any;
//         errors: FormErrors<Values>;
//       };
//     }
//   | {
//       type: "SET_ERRORS";
//       payload: { errors: FormErrors<Values>; isValid: boolean };
//     }
//   | {
//       type: "SET_TOUCHED";
//       payload: { name: keyof Values; touched?: any };
//     }
//   | {
//       type: "SET_ALL_TOUCHED";
//       payload: { touched: FormTouched<Values> };
//     }
//   | {
//       type: "SET_SUBMITTING";
//       payload: { isSubmitting: boolean; isValid?: boolean };
//     }
//   | { type: "RESET"; payload: { initState: FormState<Values> } }
//   | { type: "CLEAR"; payload: { initState: FormState<Values> } };

// type UseFormOnSubmit<Values extends FormValues = FormValues> =
//   | ((values: Values) => Promise<void>)
//   | ((values: Values) => void);

// type ValidationFunction<Values extends FormValues = FormValues> = (
//   value: any,
//   values?: Values
// ) => string | undefined;

// type UseFormProps<Values extends FormValues> = {
//   initialValues: Values;
//   validationFunctions?: Record<
//     keyof Values,
//     ValidationFunction<Values> | undefined
//   >;
//   onFormSubmit: UseFormOnSubmit<Values>;
//   enableReinitialize?: boolean;
// };

// const stateInitializer = <Values extends FormValues>(
//   initValue: undefined | boolean,
//   initState: Values
// ): FormTouched<Values> | FormErrors<Values> => {
//   const newState = {} as any;

//   Object.keys(initState).forEach((key) => {
//     if (
//       typeof initState[key] === "object" &&
//       initState[key] !== null &&
//       !Array.isArray(initState[key])
//     ) {
//       newState[key] = stateInitializer(initValue, initState[key]);
//     } else {
//       newState[key] = initValue;
//     }
//   });

//   return newState;
// };

// const validateFormValues = <Values extends FormValues>(
//   values: Values,
//   validationFunctions?: Record<
//     keyof Values,
//     ValidationFunction<Values> | undefined
//   >
// ): { isValid: boolean; errors: FormErrors<Values> } => {
//   const errors = {} as FormErrors<Values>;

//   if (validationFunctions) {
//     Object.keys(values).forEach((key) => {
//       const validationFn = validationFunctions[key];
//       const error = validationFn
//         ? validationFn(values[key], values)
//         : undefined;
//       (errors as any)[key] = error;
//     });
//   }

//   const hasValidationErrors = Object.values(errors).some((err) => Boolean(err));
//   return { isValid: !hasValidationErrors, errors };
// };

// const formReducer = <Values extends FormValues = FormValues>(
//   state: FormState<Values>,
//   action: FormAction<Values>
// ): FormState<Values> => {
//   switch (action.type) {
//     case "SET_VALUE":
//       return {
//         ...state,
//         values: {
//           ...state.values,
//           [action.payload.name]: action.payload.value,
//         },
//         errors: {
//           ...state.errors,
//           ...action.payload.errors,
//         },
//       };
//     case "SET_ERRORS":
//       return {
//         ...state,
//         errors: {
//           ...state.errors,
//           ...action.payload.errors,
//         },
//         isValid: action.payload.isValid,
//       };
//     case "SET_TOUCHED":
//       return {
//         ...state,
//         touched: {
//           ...state.touched,
//           [action.payload.name]: action.payload.touched,
//         },
//       };
//     case "SET_ALL_TOUCHED":
//       return {
//         ...state,
//         touched: action.payload.touched,
//       };
//     case "SET_SUBMITTING":
//       return {
//         ...state,
//         isSubmitting: action.payload.isSubmitting,
//         isValid: action.payload.isValid ?? state.isValid,
//       };
//     case "RESET":
//     case "CLEAR":
//       return { ...action.payload.initState };
//     default:
//       return state;
//   }
// };

// const useForm = <Values extends FormValues = FormValues>(
//   props: UseFormProps<Values>
// ) => {
//   const {
//     initialValues,
//     validationFunctions,
//     onFormSubmit,
//     enableReinitialize = true,
//   } = props;

//   const initialState = useMemo<FormState<Values>>(() => {
//     const { isValid } = validateFormValues(initialValues, validationFunctions);
//     return {
//       values: initialValues || ({} as Values),
//       errors: stateInitializer(undefined, initialValues) as FormErrors<Values>,
//       touched: stateInitializer(false, initialValues) as FormTouched<Values>,
//       isSubmitting: false,
//       isValid,
//     };
//   }, [initialValues, validationFunctions]);

//   const [state, dispatch] = useReducer(formReducer<Values>, initialState);

//   const handleChange = useCallback(
//     (name: keyof Values) => (event: React.ChangeEvent<any>) => {
//       event.persist();
//       const newValues = { ...state.values, [name]: event.target.value };
//       const { errors } = validateFormValues(newValues, validationFunctions);

//       dispatch({
//         type: "SET_VALUE",
//         payload: {
//           name,
//           value: event.target.value,
//           errors,
//         },
//       });
//     },
//     [validationFunctions, state.values]
//   );

//   const handleBlur = useCallback(
//     (name: keyof Values) => (event: React.FocusEvent<any>) => {
//       event.persist();
//       dispatch({
//         type: "SET_TOUCHED",
//         payload: {
//           name,
//           touched: true,
//         },
//       });
//     },
//     []
//   );

//   const handleSubmit = useCallback(async (): Promise<{
//     isValid: boolean;
//     errors: FormErrors<Values>;
//   }> => {
//     try {
//       const touched = stateInitializer(
//         true,
//         state.values
//       ) as FormTouched<Values>;
//       dispatch({
//         type: "SET_ALL_TOUCHED",
//         payload: { touched },
//       });

//       const { isValid, errors } = validateFormValues(
//         state.values,
//         validationFunctions
//       );

//       if (!isValid) {
//         dispatch({
//           type: "SET_ERRORS",
//           payload: { errors, isValid },
//         });
//         return { isValid, errors };
//       }

//       dispatch({
//         type: "SET_SUBMITTING",
//         payload: { isSubmitting: true, isValid },
//       });

//       await onFormSubmit(state.values);
//       return { isValid, errors };
//     } catch (error) {
//       console.error("Form submission error:", error);
//       return { isValid: false, errors: {} as FormErrors<Values> };
//     } finally {
//       dispatch({
//         type: "SET_SUBMITTING",
//         payload: { isSubmitting: false },
//       });
//     }
//   }, [onFormSubmit, state.values, validationFunctions]);

//   const handleReset = useCallback(() => {
//     dispatch({
//       type: "RESET",
//       payload: { initState: initialState },
//     });
//   }, [initialState]);

//   const setFieldValue = useCallback(
//     (name: keyof Values, value: any) => {
//       const newValues = { ...state.values, [name]: value };
//       const { errors } = validateFormValues(newValues, validationFunctions);

//       dispatch({
//         type: "SET_VALUE",
//         payload: { name, value, errors },
//       });
//     },
//     [state.values, validationFunctions]
//   );

//   useEffect(() => {
//     if (enableReinitialize) {
//       dispatch({
//         type: "RESET",
//         payload: { initState: initialState },
//       });
//     }
//   }, [initialState, enableReinitialize]);

//   return {
//     values: state.values,
//     errors: state.errors,
//     touched: state.touched,
//     isSubmitting: state.isSubmitting,
//     isValid: state.isValid,
//     handleChange,
//     handleBlur,
//     handleSubmit,
//     handleReset,
//     setFieldValue,
//   };
// };

// // ===== FORM TYPES =====
// interface IssueFormValues {
//   title: string;
//   description: string;
//   priority: "low" | "medium" | "high" | "";
//   category: string;
//   assignee: string;
//   dueDate: string;
//   tags: string[];
//   confirmSubmission: boolean;
// }

// interface IssueData extends Omit<IssueFormValues, "confirmSubmission"> {
//   id: string;
//   status: "open" | "in-progress" | "closed";
//   createdAt: string;
//   updatedAt: string;
// }

// interface ImperativeFormHandle {
//   handleReset: () => void;
//   handleSubmit: () => Promise<{
//     isValid: boolean;
//     errors: FormErrors<IssueFormValues>;
//   }>;
//   values: IssueFormValues;
// }

// // ===== FORM COMPONENT =====
// const IssueFormComponent = forwardRef<
//   ImperativeFormHandle,
//   {
//     initialValues: IssueFormValues;
//     validationFunctions: Record<
//       keyof IssueFormValues,
//       ValidationFunction<IssueFormValues> | undefined
//     >;
//     isDisabled: boolean;
//     onFormSubmit: () => void;
//   }
// >(({ initialValues, validationFunctions, isDisabled, onFormSubmit }, ref) => {
//   const [selectedTags, setSelectedTags] = useState<string[]>(
//     initialValues.tags || []
//   );

//   const {
//     values,
//     errors,
//     touched,
//     handleChange,
//     handleBlur,
//     handleSubmit,
//     handleReset,
//     setFieldValue,
//   } = useForm({
//     initialValues,
//     validationFunctions,
//     onFormSubmit,
//   });

//   const handleTagToggle = useCallback(
//     (tag: string) => {
//       if (isDisabled) return;

//       const newTags = selectedTags.includes(tag)
//         ? selectedTags.filter((t) => t !== tag)
//         : [...selectedTags, tag];

//       setSelectedTags(newTags);
//       setFieldValue("tags", newTags);
//     },
//     [selectedTags, setFieldValue, isDisabled]
//   );

//   useImperativeHandle(
//     ref,
//     () => ({
//       handleReset: () => {
//         handleReset();
//         setSelectedTags(initialValues.tags || []);
//       },
//       handleSubmit,
//       values,
//     }),
//     [handleReset, handleSubmit, values, initialValues.tags]
//   );

//   const getFieldError = (
//     fieldName: keyof IssueFormValues
//   ): string | undefined => {
//     return touched[fieldName] ? (errors[fieldName] as string) : undefined;
//   };

//   const hasFieldError = (fieldName: keyof IssueFormValues): boolean => {
//     return Boolean(touched[fieldName] && errors[fieldName]);
//   };

//   const PRIORITY_OPTIONS = [
//     { value: "", label: "Select Priority" },
//     { value: "low", label: "Low" },
//     { value: "medium", label: "Medium" },
//     { value: "high", label: "High" },
//   ];

//   const CATEGORY_OPTIONS = [
//     { value: "", label: "Select Category" },
//     { value: "bug", label: "Bug" },
//     { value: "feature", label: "Feature Request" },
//     { value: "enhancement", label: "Enhancement" },
//     { value: "task", label: "Task" },
//   ];

//   const ASSIGNEE_OPTIONS = [
//     { value: "", label: "Select Assignee" },
//     { value: "john.doe", label: "John Doe" },
//     { value: "jane.smith", label: "Jane Smith" },
//     { value: "bob.johnson", label: "Bob Johnson" },
//   ];

//   const AVAILABLE_TAGS = [
//     "urgent",
//     "frontend",
//     "backend",
//     "database",
//     "api",
//     "ui",
//     "ux",
//     "security",
//     "performance",
//     "testing",
//   ];

//   return (
//     <div className="space-y-6">
//       {/* Title */}
//       <div>
//         <label
//           htmlFor="title"
//           className="block text-sm font-medium text-gray-700 mb-1"
//         >
//           Issue Title *
//         </label>
//         <input
//           type="text"
//           id="title"
//           name="title"
//           value={values.title}
//           onChange={handleChange("title")}
//           onBlur={handleBlur("title")}
//           disabled={isDisabled}
//           className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:bg-gray-50 disabled:cursor-not-allowed ${
//             hasFieldError("title")
//               ? "border-red-500 focus:border-red-500 focus:ring-red-500"
//               : "border-gray-300"
//           }`}
//           placeholder="Enter issue title"
//         />
//         {getFieldError("title") && (
//           <p className="mt-1 text-sm text-red-600">{getFieldError("title")}</p>
//         )}
//       </div>

//       {/* Description */}
//       <div>
//         <label
//           htmlFor="description"
//           className="block text-sm font-medium text-gray-700 mb-1"
//         >
//           Description *
//         </label>
//         <textarea
//           id="description"
//           name="description"
//           rows={4}
//           value={values.description}
//           onChange={handleChange("description")}
//           onBlur={handleBlur("description")}
//           disabled={isDisabled}
//           className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:bg-gray-50 disabled:cursor-not-allowed ${
//             hasFieldError("description")
//               ? "border-red-500 focus:border-red-500 focus:ring-red-500"
//               : "border-gray-300"
//           }`}
//           placeholder="Describe the issue in detail"
//         />
//         {getFieldError("description") && (
//           <p className="mt-1 text-sm text-red-600">
//             {getFieldError("description")}
//           </p>
//         )}
//       </div>

//       {/* Priority and Category */}
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//         <div>
//           <label
//             htmlFor="priority"
//             className="block text-sm font-medium text-gray-700 mb-1"
//           >
//             Priority *
//           </label>
//           <select
//             id="priority"
//             name="priority"
//             value={values.priority}
//             onChange={handleChange("priority")}
//             onBlur={handleBlur("priority")}
//             disabled={isDisabled}
//             className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:bg-gray-50 disabled:cursor-not-allowed ${
//               hasFieldError("priority")
//                 ? "border-red-500 focus:border-red-500 focus:ring-red-500"
//                 : "border-gray-300"
//             }`}
//           >
//             {PRIORITY_OPTIONS.map((option) => (
//               <option key={option.value} value={option.value}>
//                 {option.label}
//               </option>
//             ))}
//           </select>
//           {getFieldError("priority") && (
//             <p className="mt-1 text-sm text-red-600">
//               {getFieldError("priority")}
//             </p>
//           )}
//         </div>

//         <div>
//           <label
//             htmlFor="category"
//             className="block text-sm font-medium text-gray-700 mb-1"
//           >
//             Category *
//           </label>
//           <select
//             id="category"
//             name="category"
//             value={values.category}
//             onChange={handleChange("category")}
//             onBlur={handleBlur("category")}
//             disabled={isDisabled}
//             className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:bg-gray-50 disabled:cursor-not-allowed ${
//               hasFieldError("category")
//                 ? "border-red-500 focus:border-red-500 focus:ring-red-500"
//                 : "border-gray-300"
//             }`}
//           >
//             {CATEGORY_OPTIONS.map((option) => (
//               <option key={option.value} value={option.value}>
//                 {option.label}
//               </option>
//             ))}
//           </select>
//           {getFieldError("category") && (
//             <p className="mt-1 text-sm text-red-600">
//               {getFieldError("category")}
//             </p>
//           )}
//         </div>
//       </div>

//       {/* Assignee and Due Date */}
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//         <div>
//           <label
//             htmlFor="assignee"
//             className="block text-sm font-medium text-gray-700 mb-1"
//           >
//             Assignee *
//           </label>
//           <select
//             id="assignee"
//             name="assignee"
//             value={values.assignee}
//             onChange={handleChange("assignee")}
//             onBlur={handleBlur("assignee")}
//             disabled={isDisabled}
//             className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:bg-gray-50 disabled:cursor-not-allowed ${
//               hasFieldError("assignee")
//                 ? "border-red-500 focus:border-red-500 focus:ring-red-500"
//                 : "border-gray-300"
//             }`}
//           >
//             {ASSIGNEE_OPTIONS.map((option) => (
//               <option key={option.value} value={option.value}>
//                 {option.label}
//               </option>
//             ))}
//           </select>
//           {getFieldError("assignee") && (
//             <p className="mt-1 text-sm text-red-600">
//               {getFieldError("assignee")}
//             </p>
//           )}
//         </div>

//         <div>
//           <label
//             htmlFor="dueDate"
//             className="block text-sm font-medium text-gray-700 mb-1"
//           >
//             Due Date *
//           </label>
//           <input
//             type="date"
//             id="dueDate"
//             name="dueDate"
//             value={values.dueDate}
//             onChange={handleChange("dueDate")}
//             onBlur={handleBlur("dueDate")}
//             disabled={isDisabled}
//             min={new Date().toISOString().split("T")[0]}
//             className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:bg-gray-50 disabled:cursor-not-allowed ${
//               hasFieldError("dueDate")
//                 ? "border-red-500 focus:border-red-500 focus:ring-red-500"
//                 : "border-gray-300"
//             }`}
//           />
//           {getFieldError("dueDate") && (
//             <p className="mt-1 text-sm text-red-600">
//               {getFieldError("dueDate")}
//             </p>
//           )}
//         </div>
//       </div>

//       {/* Tags */}
//       <div>
//         <label className="block text-sm font-medium text-gray-700 mb-2">
//           Tags * (Select at least one)
//         </label>
//         <div className="flex flex-wrap gap-2">
//           {AVAILABLE_TAGS.map((tag) => (
//             <button
//               key={tag}
//               type="button"
//               onClick={() => handleTagToggle(tag)}
//               disabled={isDisabled}
//               className={`px-3 py-1 text-sm rounded-full border transition-colors disabled:cursor-not-allowed ${
//                 selectedTags.includes(tag)
//                   ? "bg-blue-100 text-blue-800 border-blue-300"
//                   : "bg-gray-50 text-gray-700 border-gray-300 hover:bg-gray-100"
//               } ${isDisabled ? "opacity-50" : ""}`}
//             >
//               {tag}
//               {selectedTags.includes(tag) && <span className="ml-1">✓</span>}
//             </button>
//           ))}
//         </div>
//         {selectedTags.length > 0 && (
//           <p className="mt-2 text-sm text-gray-600">
//             Selected: {selectedTags.join(", ")}
//           </p>
//         )}
//         {getFieldError("tags") && (
//           <p className="mt-1 text-sm text-red-600">{getFieldError("tags")}</p>
//         )}
//       </div>

//       {/* Confirmation */}
//       <div>
//         <label className="flex items-center space-x-2">
//           <input
//             type="checkbox"
//             id="confirmSubmission"
//             name="confirmSubmission"
//             checked={values.confirmSubmission}
//             onChange={(e) =>
//               setFieldValue("confirmSubmission", e.target.checked)
//             }
//             onBlur={handleBlur("confirmSubmission")}
//             disabled={isDisabled}
//             className={`w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 disabled:cursor-not-allowed ${
//               hasFieldError("confirmSubmission") ? "border-red-500" : ""
//             }`}
//           />
//           <span className="text-sm text-gray-700">
//             I confirm that all information provided is accurate and complete *
//           </span>
//         </label>
//         {getFieldError("confirmSubmission") && (
//           <p className="mt-1 text-sm text-red-600">
//             {getFieldError("confirmSubmission")}
//           </p>
//         )}
//       </div>
//     </div>
//   );
// });

// // ===== FORM LAYER =====
// const IssueForm: React.FC<{
//   existingIssue: IssueData | null;
//   onSubmit: (values: IssueFormValues) => Promise<void>;
//   onReset: () => void;
//   isSubmitting: boolean;
// }> = ({ existingIssue, onSubmit, onReset, isSubmitting }) => {
//   const formRef = useRef<ImperativeFormHandle>(null);
//   const [showConfirmModal, setShowConfirmModal] = useState(false);

//   const defaultFormValues: IssueFormValues = {
//     title: "",
//     description: "",
//     priority: "",
//     category: "",
//     assignee: "",
//     dueDate: "",
//     tags: [],
//     confirmSubmission: false,
//   };

//   const validationFunctions = {
//     title: (value: string) => {
//       if (!value?.trim()) return "Title is required";
//       if (value.length < 3) return "Title must be at least 3 characters";
//       if (value.length > 100) return "Title must be less than 100 characters";
//       return undefined;
//     },
//     description: (value: string) => {
//       if (!value?.trim()) return "Description is required";
//       if (value.length < 10)
//         return "Description must be at least 10 characters";
//       return undefined;
//     },
//     priority: (value: string) => {
//       if (!value) return "Priority is required";
//       if (!["low", "medium", "high"].includes(value)) return "Invalid priority";
//       return undefined;
//     },
//     category: (value: string) => {
//       if (!value?.trim()) return "Category is required";
//       return undefined;
//     },
//     assignee: (value: string) => {
//       if (!value?.trim()) return "Assignee is required";
//       return undefined;
//     },
//     dueDate: (value: string) => {
//       if (!value) return "Due date is required";
//       const date = new Date(value);
//       const today = new Date();
//       today.setHours(0, 0, 0, 0);
//       if (date < today) return "Due date cannot be in the past";
//       return undefined;
//     },
//     tags: (value: string[]) => {
//       if (!value || value.length === 0) return "At least one tag is required";
//       return undefined;
//     },
//     confirmSubmission: (value: boolean) => {
//       if (!value) return "Please confirm your submission";
//       return undefined;
//     },
//   };

//   const initialValues: IssueFormValues = existingIssue
//     ? {
//         title: existingIssue.title,
//         description: existingIssue.description,
//         priority: existingIssue.priority,
//         category: existingIssue.category,
//         assignee: existingIssue.assignee,
//         dueDate: existingIssue.dueDate,
//         tags: existingIssue.tags,
//         confirmSubmission: false,
//       }
//     : defaultFormValues;

//   const handleSubmitClick = useCallback(() => {
//     if (!formRef.current) return;
//     setShowConfirmModal(true);
//   }, []);

//   const handleSubmit = useCallback(async () => {
//     if (!formRef.current) return;

//     try {
//       const { isValid, errors } = await formRef.current.handleSubmit();

//       if (isValid) {
//         setShowConfirmModal(false);
//         await onSubmit(formRef.current.values);
//       } else {
//         const errorMessages = Object.values(errors)
//           .filter(
//             (error): error is string =>
//               typeof error === "string" && error.length > 0
//           )
//           .join("\n");

//         if (errorMessages) {
//           alert(`Please fix the following errors:\n${errorMessages}`);
//         }
//         setShowConfirmModal(false);
//       }
//     } catch (error) {
//       console.error("Form submission error:", error);
//       setShowConfirmModal(false);
//     }
//   }, [onSubmit]);

//   const handleCancel = useCallback(() => {
//     if (!formRef.current) return;

//     const confirmReset = window.confirm(
//       "Are you sure you want to cancel and lose your changes?"
//     );

//     if (confirmReset) {
//       formRef.current.handleReset();
//       onReset();
//     }
//   }, [onReset]);

//   return (
//     <div className="space-y-6">
//       {showConfirmModal && (
//         <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
//           <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
//             <div className="mt-3">
//               <h3 className="text-lg font-medium text-gray-900 mb-4">
//                 Confirm Submission
//               </h3>
//               <div className="text-sm text-gray-600 mb-6">
//                 <p className="mb-2">
//                   Are you sure you want to submit this issue?
//                 </p>
//                 <div className="bg-gray-50 p-3 rounded border">
//                   <p>
//                     <strong>Title:</strong> {formRef.current?.values.title}
//                   </p>
//                   <p>
//                     <strong>Priority:</strong>{" "}
//                     {formRef.current?.values.priority}
//                   </p>
//                   <p>
//                     <strong>Category:</strong>{" "}
//                     {formRef.current?.values.category}
//                   </p>
//                 </div>
//               </div>
//               <div className="flex justify-end space-x-3">
//                 <button
//                   onClick={() => setShowConfirmModal(false)}
//                   className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
//                   disabled={isSubmitting}
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   onClick={handleSubmit}
//                   disabled={isSubmitting}
//                   className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 disabled:opacity-50"
//                 >
//                   {isSubmitting ? "Submitting..." : "Confirm Submit"}
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       <IssueFormComponent
//         ref={formRef}
//         initialValues={initialValues}
//         validationFunctions={validationFunctions}
//         isDisabled={isSubmitting}
//         onFormSubmit={handleSubmitClick}
//       />

//       <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
//         <button
//           type="button"
//           onClick={handleCancel}
//           disabled={isSubmitting}
//           className="px-6 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
//         >
//           Cancel
//         </button>
//         <button
//           type="button"
//           onClick={handleSubmitClick}
//           disabled={isSubmitting}
//           className="px-6 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 disabled:opacity-50"
//         >
//           {isSubmitting
//             ? "Submitting..."
//             : existingIssue
//             ? "Update Issue"
//             : "Create Issue"}
//         </button>
//       </div>
//     </div>
//   );
// };

// // ===== MAIN PAGE =====
// const IssueMainPage: React.FC = () => {
//   const [existingIssue, setExistingIssue] = useState<IssueData | null>(null);
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const [successMessage, setSuccessMessage] = useState<string | null>(null);

//   const submitIssue = useCallback(
//     async (values: IssueFormValues) => {
//       return new Promise<{
//         data: IssueData;
//         success: boolean;
//         message: string;
//       }>((resolve, reject) => {
//         setTimeout(() => {
//           if (Math.random() > 0.1) {
//             const newIssue: IssueData = {
//               id: existingIssue?.id || `issue-${Date.now()}`,
//               title: values.title,
//               description: values.description,
//               priority: values.priority as "low" | "medium" | "high",
//               category: values.category,
//               assignee: values.assignee,
//               dueDate: values.dueDate,
//               tags: values.tags,
//               status: existingIssue?.status || "open",
//               createdAt: existingIssue?.createdAt || new Date().toISOString(),
//               updatedAt: new Date().toISOString(),
//             };

//             resolve({
//               data: newIssue,
//               success: true,
//               message: existingIssue
//                 ? "Issue updated successfully"
//                 : "Issue created successfully",
//             });
//           } else {
//             reject(new Error("Failed to submit issue. Please try again."));
//           }
//         }, 1500);
//       });
//     },
//     [existingIssue]
//   );

//   const handleFormSubmit = useCallback(
//     async (values: IssueFormValues): Promise<void> => {
//       setError(null);
//       setSuccessMessage(null);
//       setIsLoading(true);

//       try {
//         const response = await submitIssue(values);

//         if (response.success) {
//           setExistingIssue(response.data);
//           setSuccessMessage(response.message);

//           setTimeout(() => {
//             setSuccessMessage(null);
//           }, 3000);
//         }
//       } catch (err: any) {
//         setError(err.message || "An unexpected error occurred");
//         console.error("Error submitting issue:", err);
//       } finally {
//         setIsLoading(false);
//       }
//     },
//     [submitIssue]
//   );

//   const handleFormReset = useCallback(() => {
//     setExistingIssue(null);
//     setError(null);
//     setSuccessMessage(null);
//   }, []);

//   const loadSampleIssue = useCallback(() => {
//     setExistingIssue({
//       id: "sample-123",
//       title: "Sample Bug Report",
//       description: "This is a sample issue for demonstration purposes.",
//       priority: "medium",
//       category: "bug",
//       assignee: "john.doe",
//       dueDate: "2024-12-31",
//       tags: ["urgent", "frontend"],
//       status: "open",
//       createdAt: "2024-01-01T00:00:00Z",
//       updatedAt: "2024-01-01T00:00:00Z",
//     });
//   }, []);

//   return (
//     <div className="max-w-4xl mx-auto p-6">
//       <div className="bg-white shadow-lg rounded-lg">
//         <div className="px-6 py-4 border-b border-gray-200">
//           <h1 className="text-2xl font-bold text-gray-900">
//             {existingIssue ? "Edit Issue" : "Create New Issue"}
//           </h1>
//           {existingIssue && (
//             <p className="text-sm text-gray-500 mt-1">
//               Issue ID: {existingIssue.id} | Status: {existingIssue.status}
//             </p>
//           )}
//         </div>

//         <div className="p-6">
//           {successMessage && (
//             <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-md">
//               <div className="flex">
//                 <div className="flex-shrink-0">
//                   <svg
//                     className="h-5 w-5 text-green-400"
//                     viewBox="0 0 20 20"
//                     fill="currentColor"
//                   >
//                     <path
//                       fillRule="evenodd"
//                       d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
//                       clipRule="evenodd"
//                     />
//                   </svg>
//                 </div>
//                 <div className="ml-3">
//                   <p className="text-sm font-medium text-green-800">
//                     {successMessage}
//                   </p>
//                 </div>
//               </div>
//             </div>
//           )}

//           {error && (
//             <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
//               <div className="flex">
//                 <div className="flex-shrink-0">
//                   <svg
//                     className="h-5 w-5 text-red-400"
//                     viewBox="0 0 20 20"
//                     fill="currentColor"
//                   >
//                     <path
//                       fillRule="evenodd"
//                       d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
//                       clipRule="evenodd"
//                     />
//                   </svg>
//                 </div>
//                 <div className="ml-3">
//                   <p className="text-sm font-medium text-red-800">{error}</p>
//                 </div>
//               </div>
//             </div>
//           )}

//           {isLoading && (
//             <div className="flex justify-center items-center py-4">
//               <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
//               <span className="ml-2 text-gray-600">Loading...</span>
//             </div>
//           )}

//           <IssueForm
//             existingIssue={existingIssue}
//             onSubmit={handleFormSubmit}
//             onReset={handleFormReset}
//             isSubmitting={isLoading}
//           />
//         </div>
//       </div>

//       <div className="mt-6 flex justify-between">
//         <button
//           onClick={() => window.history.back()}
//           className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
//         >
//           Back
//         </button>

//         <div className="flex space-x-3">
//           <button
//             onClick={loadSampleIssue}
//             className="px-4 py-2 text-sm font-medium text-blue-700 bg-blue-50 border border-blue-200 rounded-md hover:bg-blue-100"
//           >
//             Load Sample Issue
//           </button>

//           <button
//             onClick={handleFormReset}
//             className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
//           >
//             New Issue
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// // Export the main component
// export default IssueMainPage;
