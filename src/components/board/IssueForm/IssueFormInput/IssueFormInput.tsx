// IssueFormInput.tsx
import { useCallback } from "react";

import {
  Control,
  Controller,
  FieldErrors,
  UseFormRegister,
  UseFormWatch,
} from "react-hook-form";

import Input from "../../../common/Input/Input";
import Select from "../../../common/Select/Select";

import { validationFunctions } from "../utils";
import { IssueFormData } from "../IssueForm.types";
import { EditableField } from "../../../common/InlineEdit/InlineEdit";
import {
  useMetaPriorities,
  useMetaStatuses,
  useMetaTypes,
} from "../../../../hooks/Meta/useMeta";

interface IssueFormInputProps {
  register: UseFormRegister<IssueFormData>;
  control: Control<IssueFormData>;
  errors: FieldErrors<IssueFormData>;
  watch: UseFormWatch<IssueFormData>;
  isDisabled: boolean;
  isDetailMode?: boolean; // true if editing an existing issue
}

// const PRIORITY_OPTIONS = ["Low", "Medium", "High", "Critical"];
// const TYPE_OPTIONS = ["Task", "Bug", "Story", "Epic"];
const ASSIGNEE_OPTIONS = ["john.doe", "jane.smith", "bob.johnson"];
// const STATUS_OPTIONS = ["To Do", "In Progress", "Done", "Blocked"];
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

const IssueFormInput = ({
  register,
  control,
  errors,
  watch,
  isDisabled,
  isDetailMode = true,
}: IssueFormInputProps) => {
  const { data: typesData, isFetching: typesFetching } = useMetaTypes();
  const { data: statusesData, isFetching: statusesFetching } =
    useMetaStatuses();
  const { data: prioritiesData, isFetching: prioritiesFetching } =
    useMetaPriorities();

  const isLoading = typesFetching || statusesFetching || prioritiesFetching;

  const selectedTags = watch("tags", []);

  const handleTagToggle = useCallback(
    (tag: string, onChange: (val: string[]) => void) => {
      const newTags = selectedTags.includes(tag)
        ? selectedTags.filter((t) => t !== tag)
        : [...selectedTags, tag];
      onChange(newTags);
    },
    [selectedTags]
  );

  console.log(typesData);

  return isLoading ? (
    <div>Loading...</div>
  ) : (
    <div className="space-y-6 text-black">
      <EditableField
        value={watch("title")}
        isDisabled={isDisabled}
        isEdit={false}
      >
        <Input
          type="text"
          id="title"
          placeholder="Enter issue title"
          disabled={isDisabled}
          autoFocus
          label="Issue Title *"
          labelClasses="block text-sm font-medium text-red-400 mb-1"
          {...register("title", {
            required: "Title is required",
            validate: validationFunctions.title,
          })}
        />
      </EditableField>
      Title
      <div>
        <label
          htmlFor="title"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Issue Title *
        </label>
        {isDetailMode ? (
          <EditableField value={watch("title")} isDisabled={isDisabled}>
            <Input
              type="text"
              id="title"
              placeholder="Enter issue title"
              disabled={isDisabled}
              autoFocus
              {...register("title", {
                required: "Title is required",
                validate: validationFunctions.title,
              })}
            />
          </EditableField>
        ) : (
          <Input
            type="text"
            id="title"
            placeholder="Enter issue title"
            disabled={isDisabled}
            {...register("title", {
              required: "Title is required",
              validate: validationFunctions.title,
            })}
          />
        )}
        {errors.title && (
          <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
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
        {isDetailMode ? (
          <EditableField value={watch("description")} isDisabled={isDisabled}>
            <textarea
              id="description"
              rows={4}
              placeholder="Describe the issue in detail"
              disabled={isDisabled}
              {...register("description", {
                required: "Description is required",
                validate: validationFunctions.description,
              })}
              className="w-full px-3 py-2 border rounded-md shadow-sm text-white"
            />
          </EditableField>
        ) : (
          <textarea
            id="description"
            rows={4}
            placeholder="Describe the issue in detail"
            disabled={isDisabled}
            {...register("description", {
              required: "Description is required",
              validate: validationFunctions.description,
            })}
            className="w-full px-3 py-2 border rounded-md shadow-sm text-white"
          />
        )}
        {errors.description && (
          <p className="mt-1 text-sm text-red-600">
            {errors.description.message}
          </p>
        )}
      </div>
      {/* Priority & Type */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Priority *
          </label>
          {isDetailMode ? (
            // <EditableField value={watch("priorityId")} isDisabled={isDisabled}>
            //   <select
            //     disabled={isDisabled}
            //     {...register("priorityId", {
            //       required: "Priority is required",
            //     })}
            //     className="w-full px-3 py-2 border rounded-md shadow-sm text-white"
            //   >
            //     {prioritiesData?.data.map((p) => (
            //       <option key={p.id} value={p.id}>
            //         {p.name}
            //       </option>
            //     ))}
            //   </select>
            // </EditableField>
            <Select label="Priority" options={prioritiesData?.data} />
          ) : (
            // <select
            //   disabled={isDisabled}
            //   {...register("priorityId", { required: "Priority is required" })}
            //   className="w-full px-3 py-2 border rounded-md shadow-sm text-white"
            // >
            //   {prioritiesData?.data.map((p) => (
            //     <option key={p.id} value={p.id}>
            //       {p.name}
            //     </option>
            //   ))}
            // </select>

            <Select label="Priority" options={prioritiesData?.data} />
          )}
          {errors.priorityId && (
            <p className="mt-1 text-sm text-red-600">
              {errors.priorityId.message}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Category *
          </label>
          {isDetailMode ? (
            <EditableField value={watch("typeId")} isDisabled={isDisabled}>
              <select
                disabled={isDisabled}
                {...register("typeId", { required: "Type is required" })}
                className="w-full px-3 py-2 border rounded-md shadow-sm text-white"
              >
                {typesData?.data.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name}
                  </option>
                ))}
              </select>
            </EditableField>
          ) : (
            <select
              disabled={isDisabled}
              {...register("typeId", { required: "Type is required" })}
              className="w-full px-3 py-2 border rounded-md shadow-sm text-white"
            >
              {typesData?.data.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
            </select>
          )}
          {errors.typeId && (
            <p className="mt-1 text-sm text-red-600">{errors.typeId.message}</p>
          )}
        </div>
      </div>
      {/* Assignee & Due Date */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Assignee *
          </label>
          {isDetailMode ? (
            <EditableField value={watch("assignee")} isDisabled={isDisabled}>
              <select
                disabled={isDisabled}
                {...register("assignee", { required: "Assignee is required" })}
                className="w-full px-3 py-2 border rounded-md shadow-sm text-white"
              >
                {ASSIGNEE_OPTIONS.map((a) => (
                  <option key={a} value={a}>
                    {a}
                  </option>
                ))}
              </select>
            </EditableField>
          ) : (
            <select
              disabled={isDisabled}
              {...register("assignee", { required: "Assignee is required" })}
              className="w-full px-3 py-2 border rounded-md shadow-sm text-white"
            >
              {ASSIGNEE_OPTIONS.map((a) => (
                <option key={a} value={a}>
                  {a}
                </option>
              ))}
            </select>
          )}
          {errors.assignee && (
            <p className="mt-1 text-sm text-red-600">
              {errors.assignee.message}
            </p>
          )}
        </div>
      </div>
      {/* Status */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Status *
        </label>
        {isDetailMode ? (
          <EditableField value={watch("statusId")} isDisabled={isDisabled}>
            <select
              disabled={isDisabled}
              {...register("statusId", { required: "Status is required" })}
              className="w-full px-3 py-2 border rounded-md shadow-sm text-white"
            >
              {statusesData?.data.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </EditableField>
        ) : (
          <select
            disabled={isDisabled}
            {...register("statusId", { required: "Status is required" })}
            className="w-full px-3 py-2 border rounded-md shadow-sm text-white"
          >
            {statusesData?.data.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
        )}
        {errors.statusId && (
          <p className="mt-1 text-sm text-red-600">{errors.statusId.message}</p>
        )}
      </div>
      {/* Tags */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Tags * (Select at least one)
        </label>
        <Controller
          name="tags"
          control={control}
          rules={{
            validate: (tags) =>
              tags && tags.length > 0 ? true : "Select at least one tag",
          }}
          render={({ field: { onChange } }) => (
            <div className="flex flex-wrap gap-2">
              {AVAILABLE_TAGS.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  disabled={isDisabled}
                  onClick={() => handleTagToggle(tag, onChange)}
                  className={`px-3 py-1 text-sm rounded-full border transition-colors ${
                    selectedTags.includes(tag)
                      ? "bg-blue-100 text-blue-800 border-blue-300"
                      : "bg-gray-50 text-gray-700 border-gray-300 hover:bg-gray-100"
                  } ${isDisabled ? "opacity-50" : ""}`}
                >
                  {tag} {selectedTags.includes(tag) && "✓"}
                </button>
              ))}
            </div>
          )}
        />
        {errors.tags && (
          <p className="mt-1 text-sm text-red-600">
            {errors.tags.message as string}
          </p>
        )}
      </div>
      {/* Confirmation */}
      <div>
        <Controller
          name="confirmSubmission"
          control={control}
          rules={{ required: "You must confirm submission" }}
          render={({ field: { onChange, value, ref } }) => (
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                ref={ref}
                checked={value || false}
                onChange={(e) => onChange(e.target.checked)}
                disabled={isDisabled}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded"
              />
              <span className="text-sm text-white">
                I confirm that all information provided is accurate and complete
                *
              </span>
            </label>
          )}
        />
        {errors.confirmSubmission && (
          <p className="mt-1 text-sm text-red-600">
            {errors.confirmSubmission.message}
          </p>
        )}
      </div>
    </div>
  );
};

export default IssueFormInput;
