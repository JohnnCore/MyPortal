import { useAppDispatch, useAppSelector } from "../hooks/reduxHooks";
import { RootState } from "../../../redux/store";

export const IssueForm = () => {
  const dispatch = useAppDispatch();
  const { modal } = useAppSelector((state: RootState) => state.modalSlice);
};
