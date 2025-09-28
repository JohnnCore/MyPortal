// apiSlice.js

import {
    createApi,
    fetchBaseQuery,
    retry,
    BaseQueryFn,
    FetchArgs,
    FetchBaseQueryError,
} from '@reduxjs/toolkit/query/react';

import { RTKQ_TAGS } from '../../utils/constants';

// Base URL and configuration
const baseQuery = fetchBaseQuery({
    baseUrl: import.meta.env.VITE_APP_API_URL, // Set your base URL here
    // credentials: 'include',
});

// Error handling function
// const returnParsedApiError = (result) => {

//     if (!result?.error) return result;

//     const statusNumber = result.meta?.response?.status || 500;

//     // Handle specific error types
//     if (result.error?.data?.message) {

//         result.error = {
//             ...result.error,
//             message: result.error?.data?.message,
//             status: statusNumber,
//         };
//     }

//     return result;
// };

const returnParsedApiError = (result) => {
    if (!result?.error) return result;

    const statusNumber = result.meta?.response?.status || 500;

    let message = "Something went wrong";

    if (result.error?.data?.message) {
        message = result.error.data.message;
    } else if (typeof result.error?.error === "string") {
        message = result.error.error;
    }

    result.error = {
        ...result.error,
        message,
        status: statusNumber,
    };

    return result;
};

// Base query with retries
const baseQueryWithRetryAndBailout = retry<BaseQueryFn<FetchArgs, unknown, FetchBaseQueryError>>(
    async (args, api, extraOptions) => {
        let result = await baseQuery(args, api, extraOptions);

        if (result.error) {
            result = returnParsedApiError(result);
        }

        return result;
    },
    { maxRetries: 1 }
);

// Define the base API slice
export const apiSlice = createApi({
    reducerPath: 'api',
    baseQuery: baseQueryWithRetryAndBailout,
    tagTypes: Object.values(RTKQ_TAGS),
    endpoints: (builder) => ({
        // A generic GET endpoint can be defined here
        getData: builder.query({
            query: (endpoint) => endpoint,  // The endpoint can be passed dynamically
        }),
    }),
});
