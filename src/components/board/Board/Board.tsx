// Board.tsx (Main Page - Updated)
import { IssueResponse, MetaResponse } from "../../../types/board";
import BoardColumn from "./BoardColumn/BoardColumn";
import BoardCard from "../BoardCard/BoardCard";
import { generatePath, Link, useLocation } from "react-router";
import { ISSUE_DETAILS } from "../../../routes/paths";

interface BoardProps {
  issuesStatues: MetaResponse[] | undefined;
  issues: IssueResponse[] | undefined;
  onIssueClick?: (issue: IssueResponse) => void;
}

const Board = ({ issuesStatues, issues }: BoardProps) => {
  const location = useLocation();
  console.log(issuesStatues);

  return (
    <div className="flex flex-col md:flex-row gap-4 ">
      {issuesStatues?.map((status) => (
        <BoardColumn
          key={status.id} // Use a stable key
          status={status}
        >
          {issues
            ?.filter((item) => item.statusId === status.id)
            ?.map((item) => (
              <Link
                key={item.id}
                // to={`/issue/${item.id}`}
                to={generatePath(ISSUE_DETAILS, { id: String(item.id) })}
                state={{ background: location }}
              >
                <BoardCard key={item.id} item={item} />
              </Link>
            ))}
        </BoardColumn>
      ))}
    </div>
  );
};

export default Board;
