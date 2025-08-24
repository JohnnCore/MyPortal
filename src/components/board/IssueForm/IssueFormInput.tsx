// IssueFormInput.tsx (Form Component - Updated)
import { useState, useCallback, useImperativeHandle, forwardRef } from "react";
import useForm, { ValidationFunction } from "../../../hooks/useForm";
import { IssueFormValues, ImperativeFormHandle } from "./types";

interface IssueFormComponentProps {
  initialValues: IssueFormValues;
  validationFunctions: Record<
    keyof IssueFormValues,
    ValidationFunction<IssueFormValues> | undefined
  >;
  isDisabled: boolean;
  onFormSubmit: () => void;
}

const PRIORITY_OPTIONS = [
  { value: "", label: "Select Priority" },
  { value: "Low", label: "Low" },
  { value: "Medium", label: "Medium" },
  { value: "High", label: "High" },
  { value: "Critical", label: "Critical" },
];

const TYPE_OPTIONS = [
  { value: "", label: "Select Category" },
  { value: "Task", label: "Task" },
  { value: "Bug", label: "Bug" },
  { value: "Story", label: "Story" },
  { value: "Epic", label: "Epic" },
];

const ASSIGNEE_OPTIONS = [
  { value: "", label: "Select Assignee" },
  { value: "john.doe", label: "John Doe" },
  { value: "jane.smith", label: "Jane Smith" },
  { value: "bob.johnson", label: "Bob Johnson" },
];

const STATUS_OPTIONS = [
  { value: "", label: "Select Status" },
  { value: "To Do", label: "To Do" },
  { value: "In Progress", label: "In Progress" },
  { value: "Done", label: "Done" },
  { value: "Blocked", label: "Blocked" },
];

const AVAILABLE_TAGS = [
  "urgent",
  "frontend",
  "backend",
  "database",
  "api",
  "ui",
  "ux",
  "security",
  "performance",
  "testing",
];

const IssueFormInput = forwardRef<
  ImperativeFormHandle,
  IssueFormComponentProps
>(({ initialValues, validationFunctions, isDisabled }, ref) => {
  const [selectedTags, setSelectedTags] = useState<string[]>(
    initialValues.tags || []
  );

  const {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    handleSubmit,
    handleReset,
    setFieldValue,
  } = useForm({
    initialValues,
    validationFunctions,
  });

  const handleTagToggle = useCallback(
    (tag: string) => {
      if (isDisabled) return;

      const newTags = selectedTags.includes(tag)
        ? selectedTags.filter((t) => t !== tag)
        : [...selectedTags, tag];

      setSelectedTags(newTags);
      setFieldValue("tags", newTags);
    },
    [selectedTags, setFieldValue, isDisabled]
  );

  useImperativeHandle(
    ref,
    () => ({
      handleReset: () => {
        handleReset();
        setSelectedTags(initialValues.tags || []);
      },
      handleSubmit,
      values,
    }),
    [handleReset, handleSubmit, values, initialValues.tags]
  );

  const getFieldError = (
    fieldName: keyof IssueFormValues
  ): string | undefined => {
    return touched[fieldName] ? (errors[fieldName] as string) : undefined;
  };

  const hasFieldError = (fieldName: keyof IssueFormValues): boolean => {
    return Boolean(touched[fieldName] && errors[fieldName]);
  };

  return (
    <div className="space-y-6 text-black">
      {/* Title */}
      <div>
        <label
          htmlFor="title"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Issue Title *
        </label>
        <input
          type="text"
          id="title"
          name="title"
          value={values.title}
          onChange={handleChange("title")}
          onBlur={handleBlur("title")}
          disabled={isDisabled}
          className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:bg-gray-50 disabled:cursor-not-allowed ${
            hasFieldError("title")
              ? "border-red-500 focus:border-red-500 focus:ring-red-500"
              : "border-gray-300"
          }`}
          placeholder="Enter issue title"
        />
        {getFieldError("title") && (
          <p className="mt-1 text-sm text-red-600">{getFieldError("title")}</p>
        )}
      </div>

      {/* Description */}
      <div>
        <label
          htmlFor="description"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Description *
        </label>
        <textarea
          id="description"
          name="description"
          rows={4}
          value={values.description}
          onChange={handleChange("description")}
          onBlur={handleBlur("description")}
          disabled={isDisabled}
          className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:bg-gray-50 disabled:cursor-not-allowed ${
            hasFieldError("description")
              ? "border-red-500 focus:border-red-500 focus:ring-red-500"
              : "border-gray-300"
          }`}
          placeholder="Describe the issue in detail"
        />
        {getFieldError("description") && (
          <p className="mt-1 text-sm text-red-600">
            {getFieldError("description")}
          </p>
        )}
      </div>

      {/* Priority and Category */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label
            htmlFor="priority"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Priority *
          </label>
          <select
            id="priority"
            name="priority"
            value={values.priority}
            onChange={handleChange("priority")}
            onBlur={handleBlur("priority")}
            disabled={isDisabled}
            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:bg-gray-50 disabled:cursor-not-allowed ${
              hasFieldError("priority")
                ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                : "border-gray-300"
            }`}
          >
            {PRIORITY_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          {getFieldError("priority") && (
            <p className="mt-1 text-sm text-red-600">
              {getFieldError("priority")}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="category"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Category *
          </label>
          <select
            id="category"
            name="category"
            value={values.type}
            onChange={handleChange("type")}
            onBlur={handleBlur("type")}
            disabled={isDisabled}
            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:bg-gray-50 disabled:cursor-not-allowed ${
              hasFieldError("type")
                ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                : "border-gray-300"
            }`}
          >
            {TYPE_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          {getFieldError("type") && (
            <p className="mt-1 text-sm text-red-600">{getFieldError("type")}</p>
          )}
        </div>
      </div>

      {/* Assignee and Due Date */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label
            htmlFor="assignee"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Assignee *
          </label>
          <select
            id="assignee"
            name="assignee"
            value={values.assignee}
            onChange={handleChange("assignee")}
            onBlur={handleBlur("assignee")}
            disabled={isDisabled}
            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:bg-gray-50 disabled:cursor-not-allowed ${
              hasFieldError("assignee")
                ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                : "border-gray-300"
            }`}
          >
            {ASSIGNEE_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          {getFieldError("assignee") && (
            <p className="mt-1 text-sm text-red-600">
              {getFieldError("assignee")}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="dueDate"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Due Date *
          </label>
          <input
            type="date"
            id="dueDate"
            name="dueDate"
            value={values.dueDate}
            onChange={handleChange("dueDate")}
            onBlur={handleBlur("dueDate")}
            disabled={isDisabled}
            min={new Date().toISOString().split("T")[0]}
            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:bg-gray-50 disabled:cursor-not-allowed ${
              hasFieldError("dueDate")
                ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                : "border-gray-300"
            }`}
          />
          {getFieldError("dueDate") && (
            <p className="mt-1 text-sm text-red-600">
              {getFieldError("dueDate")}
            </p>
          )}
        </div>
      </div>

      {/* Status */}
      <div>
        <label
          htmlFor="status"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Status *
        </label>
        <select
          id="status"
          name="status"
          value={values.status}
          onChange={handleChange("status")}
          onBlur={handleBlur("status")}
          disabled={isDisabled}
          className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:bg-gray-50 disabled:cursor-not-allowed ${
            hasFieldError("status")
              ? "border-red-500 focus:border-red-500 focus:ring-red-500"
              : "border-gray-300"
          }`}
        >
          {STATUS_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {getFieldError("status") && (
          <p className="mt-1 text-sm text-red-600">{getFieldError("status")}</p>
        )}
      </div>

      {/* Tags */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Tags * (Select at least one)
        </label>
        <div className="flex flex-wrap gap-2">
          {AVAILABLE_TAGS.map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => handleTagToggle(tag)}
              disabled={isDisabled}
              className={`px-3 py-1 text-sm rounded-full border transition-colors disabled:cursor-not-allowed ${
                selectedTags.includes(tag)
                  ? "bg-blue-100 text-blue-800 border-blue-300"
                  : "bg-gray-50 text-gray-700 border-gray-300 hover:bg-gray-100"
              } ${isDisabled ? "opacity-50" : ""}`}
            >
              {tag}
              {selectedTags.includes(tag) && <span className="ml-1">✓</span>}
            </button>
          ))}
        </div>
        {selectedTags.length > 0 && (
          <p className="mt-2 text-sm text-gray-600">
            Selected: {selectedTags.join(", ")}
          </p>
        )}
        {getFieldError("tags") && (
          <p className="mt-1 text-sm text-red-600">{getFieldError("tags")}</p>
        )}
      </div>

      {/* Confirmation */}
      <div>
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="confirmSubmission"
            name="confirmSubmission"
            checked={values.confirmSubmission}
            onChange={(e) =>
              setFieldValue("confirmSubmission", e.target.checked)
            }
            onBlur={handleBlur("confirmSubmission")}
            disabled={isDisabled}
            className={`w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 disabled:cursor-not-allowed ${
              hasFieldError("confirmSubmission") ? "border-red-500" : ""
            }`}
          />
          <span className="text-sm text-gray-700">
            I confirm that all information provided is accurate and complete *
          </span>
        </label>
        {getFieldError("confirmSubmission") && (
          <p className="mt-1 text-sm text-red-600">
            {getFieldError("confirmSubmission")}
          </p>
        )}
      </div>
    </div>
  );
});

IssueFormInput.displayName = "IssueFormInput";

export default IssueFormInput;
