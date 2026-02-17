import { Controller } from 'react-hook-form';

import Input from '../../../common/Input/Input';
import Select from '../../../common/Select/Select';
// import { IssueFormData } from "../IssueForm.types";
import Textarea from '../../../common/Textarea/TextArea';
import MultiSelect from '../../../common/Select/MultiSelect';
import InputErrorMessage from '../../../common/InputErrorMessage/InputErrorMessage';
import { IssueFormInputProps } from './IssueFormInput.types';

const IssueFormInput = ({
  register,
  control,
  errors,
  isDisabled,
  dropdownValues: {
    projects,
    metaData: { priorities, statuses, types, tags },
    projectMembers,
  },
}: IssueFormInputProps) => {
  // Fetch all data

  return (
    <div className="space-y-6 text-black">
      {/* Project */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Controller
            name="projectId"
            control={control}
            rules={{
              validate: (v) => (v && v !== 0) || 'Project is required',
            }}
            render={({ field }) => (
              <Select
                label="Project"
                required
                options={projects}
                disabled={isDisabled}
                error={!!errors.projectId?.message}
                {...field}
              />
            )}
          />
          <InputErrorMessage error={errors.projectId?.message} />
        </div>
      </div>

      {/* Title */}
      <div>
        <Input
          type="text"
          id="title"
          placeholder="Issue title"
          disabled={isDisabled}
          autoFocus
          label="Issue Title"
          required
          error={!!errors.title?.message}
          {...register('title')} //{
          //   required: "Title is required",
          //   validate: (value) =>
          //     value?.trim() === "" ? "Title is required" : true,
          //   minLength: {
          //     value: 3,
          //     message: "Title must be at least 3 characters",
          //   },
          //   maxLength: {
          //     value: 100,
          //     message: "Title must be less than 100 characters",
          //   },
          // })}
        />
        <InputErrorMessage error={errors?.title?.message} />
      </div>

      {/* Description */}
      <div>
        <Textarea
          id="description"
          className="w-full px-3 py-2 border rounded-md shadow-sm"
          label="Description"
          rows={4}
          required
          placeholder="Describe the issue in detail"
          disabled={isDisabled}
          error={!!errors.description?.message}
          {...register('description')}
        />
        <InputErrorMessage error={errors?.description?.message} />
      </div>

      {/* Priority & Type */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Controller
            name="priorityId"
            control={control}
            render={({ field }) => (
              <Select
                label="Priority"
                required
                options={priorities}
                disabled={isDisabled}
                error={!!errors.priorityId?.message}
                {...field}
              />
            )}
          />
          <InputErrorMessage error={errors?.priorityId?.message} />
        </div>

        <div>
          <Controller
            name="typeId"
            control={control}
            render={({ field }) => (
              <Select
                label="Type"
                required
                options={types}
                disabled={isDisabled}
                error={!!errors.typeId?.message}
                {...field}
              />
            )}
          />
          <InputErrorMessage error={errors?.typeId?.message} />
        </div>
      </div>

      {/* Assignee and Status */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Controller
            name="assigneeUser"
            control={control}
            render={({ field: { onChange, value, ...field } }) => (
              <Select
                label="Assignee"
                options={[{ id: 0, name: 'Unassigned' }, ...(projectMembers || [])]}
                disabled={isDisabled}
                error={!!errors.assigneeUser?.message}
                value={value?.id ?? 0}
                onChange={(selectedId) => {
                  const id = Number(selectedId);
                  if (!id) {
                    onChange(undefined);
                    return;
                  }
                  const member = projectMembers?.find((m) => m.id === id);
                  onChange(member ? { id: member.id, name: member.name } : undefined);
                }}
                {...field}
              />
            )}
          />
          <InputErrorMessage error={errors?.assigneeUser?.message} />
        </div>

        <div>
          <Controller
            name="statusId"
            control={control}
            render={({ field }) => (
              <Select
                label="Status"
                required
                options={statuses}
                disabled={isDisabled}
                error={!!errors.statusId?.message}
                {...field}
              />
            )}
          />
          <InputErrorMessage error={errors?.statusId?.message} />
        </div>
      </div>

      {/* Tags */}
      <div>
        <Controller
          name="tags"
          control={control}
          // rules={{
          //   required: "Select at least one tag",
          //   validate: (value) =>
          //     (Array.isArray(value) && value.length > 0) ||
          //     "At least one tag is required",
          // }}
          render={({ field }) => (
            <MultiSelect
              label="Tags"
              // required
              creatable
              options={tags}
              disabled={isDisabled}
              {...field}
            />
          )}
        />
        <InputErrorMessage error={errors?.tags?.message} />
      </div>

      {/* Confirmation */}
      <div>
        <Controller
          name="confirmSubmission"
          control={control}
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
                I confirm that all information provided is accurate and complete *
              </span>
            </label>
          )}
        />
        <InputErrorMessage error={errors?.confirmSubmission?.message} />
      </div>
    </div>
  );
};

IssueFormInput.displayName = 'IssueFormInput';

export default IssueFormInput;
