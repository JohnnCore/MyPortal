import { apiSlice } from "../apiSlice"
import { RTKQ_TAGS } from "../../../utils/constants"
import { PaginatedResponse, IssueResponse } from "../../../types/board"

const issuesApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        // Get all issues
        // getIssues: builder.query<Issue[], void>({
        //     query: () => ({ url: '/issues' }),
        //     providesTags: (result) =>
        //         result
        //             ? [
        //                 // List tag
        //                 { type: RTKQ_TAGS.issues, id: "LIST" },
        //                 // Individual item tags
        //                 ...result.map(({ id }) => ({ type: RTKQ_TAGS.issues, id })),
        //             ]
        //             : [{ type: RTKQ_TAGS.issues, id: "LIST" }],
        //     keepUnusedDataFor: 5, // Cache for 5 seconds
        // }),

        getIssues: builder.query<PaginatedResponse<IssueResponse>, void>({
            query: () => ({ url: '/issues' }),
            providesTags: (result) => {
                // Ensure result is an array before mapping
                if (Array.isArray(result?.data)) {
                    return [
                        { type: RTKQ_TAGS.issues, id: "LIST" },
                        ...result.data.map(({ id }) => ({ type: RTKQ_TAGS.issues, id })),
                    ];
                }
                return [{ type: RTKQ_TAGS.issues, id: "LIST" }];
            },
            keepUnusedDataFor: 5, // Cache for 5 seconds
        }),

        // Get issue by ID
        getIssueById: builder.query({
            query: (id) => ({ url: `/issues/${id}` }),
            providesTags: ({ id }) => [{ type: RTKQ_TAGS.issues, id }],
        }),

        // Create new issue
        createIssue: builder.mutation({
            query: (newIssue) => ({
                url: '/issues/create',
                method: 'POST',
                body: newIssue,
                headers: { 'Content-Type': 'application/json' },
            }),
            invalidatesTags: [{ type: RTKQ_TAGS.issues, id: "LIST" }], // refresh list
        }),

        // Update issue
        updateIssue: builder.mutation({
            query: ({ id, ...updatedFields }) => ({
                url: `/issues/${id}`,
                method: 'PUT',
                body: updatedFields,
            }),
            invalidatesTags: ({ id }) => [
                { type: RTKQ_TAGS.issues, id }, // refresh specific issue
            ],
        }),

        // Delete issue
        deleteIssue: builder.mutation({
            query: (id) => ({
                url: `/issues/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: (id) => [
                { type: RTKQ_TAGS.issues, id },     // refresh deleted item
                { type: RTKQ_TAGS.issues, id: "LIST" }, // refresh list
            ],
        }),
    }),
})

export const {
    useGetIssuesQuery,
    useGetIssueByIdQuery,
    useCreateIssueMutation,
    useUpdateIssueMutation,
    useDeleteIssueMutation,
} = issuesApiSlice
