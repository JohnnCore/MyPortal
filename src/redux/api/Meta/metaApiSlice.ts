import { apiSlice } from "../apiSlice"
import { RTKQ_TAGS } from "../../../utils/constants"
import { PaginatedResponse, MetaResponse } from "../../../types/board"


const URL = "/meta"

const metaApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getTypes: builder.query<PaginatedResponse<MetaResponse>, void>({
            query: () => ({ url: `${URL}/types` }),
            providesTags: [RTKQ_TAGS.types],
            // keepUnusedDataFor: 60 * 60,
        }),

        getStatus: builder.query<PaginatedResponse<MetaResponse>, void>({
            query: () => ({ url: `${URL}/statuses` }),
            providesTags: [RTKQ_TAGS.status],
            // keepUnusedDataFor: 60 * 60,
        }),

        getPriorities: builder.query<PaginatedResponse<MetaResponse>, void>({
            query: () => ({ url: `${URL}/priorities` }),
            providesTags: [RTKQ_TAGS.priorities],
            // keepUnusedDataFor: 60 * 60,
        }),
    }),
})

export const {
    useGetTypesQuery,
    useGetStatusQuery,
    useGetPrioritiesQuery,
} = metaApiSlice
