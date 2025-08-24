import { IssueFormValues } from "./types";
import { ValidationFunction } from "../../../hooks/useForm";

export const validationFunctions: Record<
    keyof IssueFormValues,
    ValidationFunction<IssueFormValues> | undefined
> = {
    title: (value: any) => {
        if (!value || typeof value !== 'string' || !value.trim()) {
            return "Title is required";
        }
        if (value.trim().length < 3) return "Title must be at least 3 characters";
        if (value.trim().length > 100) return "Title must be less than 100 characters";
        return undefined;
    },

    description: (value: any) => {
        if (!value || typeof value !== 'string' || !value.trim()) {
            return "Description is required";
        }
        if (value.trim().length < 10) {
            return "Description must be at least 10 characters";
        }
        return undefined;
    },

    priority: (value: any) => {
        if (!value || typeof value !== 'string' || value.trim() === '') {
            return "Priority is required";
        }
        const validPriorities = ['Low', 'Medium', 'High', 'Critical'];
        if (!validPriorities.includes(value)) {
            return "Please select a valid priority";
        }
        return undefined;
    },

    assignee: (value: any) => {
        if (!value || typeof value !== 'string' || !value.trim()) {
            return "Assignee is required";
        }
        return undefined;
    },

    dueDate: (value: any) => {
        if (!value || typeof value !== 'string') {
            return "Due date is required";
        }

        const date = new Date(value);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (isNaN(date.getTime())) {
            return "Please enter a valid date";
        }

        if (date < today) {
            return "Due date cannot be in the past";
        }

        return undefined;
    },

    tags: (value: any) => {
        if (!Array.isArray(value) || value.length === 0) {
            return "At least one tag is required";
        }
        return undefined;
    },

    confirmSubmission: (value: any) => {
        if (value !== true) {
            return "Please confirm your submission";
        }
        return undefined;
    },

    status: (value: any) => {
        if (!value || typeof value !== 'string' || value.trim() === '') {
            return "Status is required";
        }
        const validStatuses = ['To Do', 'In Progress', 'Done', 'Blocked'];
        if (!validStatuses.includes(value)) {
            return "Please select a valid status";
        }
        return undefined;
    },

    type: (value: any) => {
        if (!value || typeof value !== 'string' || value.trim() === '') {
            return "Type is required";
        }
        const validTypes = ['Task', 'Bug', 'Story', 'Epic'];
        if (!validTypes.includes(value)) {
            return "Please select a valid type";
        }
        return undefined;
    },
};