import { useGetIssuesQuery } from "../../redux/api/Issues/issuesApiSlice";

export const useIssues = () => {
    const { data, isFetching, isError, error, isSuccess } = useGetIssuesQuery();
    return { data, isFetching, isError, error, isSuccess };
}
