import { useGetTypesQuery, useGetStatusQuery, useGetPrioritiesQuery }
    from "../../redux/api/Meta/metaApiSlice";

export const useMetaTypes = () => {
    const { data, isFetching, isError, error, isSuccess } = useGetTypesQuery();
    return { data, isFetching, isError, error, isSuccess };
};

export const useMetaStatuses = () => {
    const { data, isFetching, isError, error, isSuccess } = useGetStatusQuery();
    return { data, isFetching, isError, error, isSuccess };
};

export const useMetaPriorities = () => {
    const { data, isFetching, isError, error, isSuccess } = useGetPrioritiesQuery();
    return { data, isFetching, isError, error, isSuccess };
};
