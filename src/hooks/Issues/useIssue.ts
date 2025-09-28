import { useGetIssueByIdQuery } from "../../redux/api/Issues/issuesApiSlice";

export const useIssues = (id: number) => {
    const { data, isFetching, isError, error, isSuccess } = useGetIssueByIdQuery(id);
    return { data, isFetching, isError, error, isSuccess };
}
