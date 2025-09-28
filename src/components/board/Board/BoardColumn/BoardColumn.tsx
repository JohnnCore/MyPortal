import { memo } from "react";
import { BoardColumnProps } from "./BoardColumn.types";

const BoardColumn = memo(({ status, children }: BoardColumnProps) => {
  return (
    <div className="flex-1 h-screen min-w-[250px] p-2 rounded-md bg-gray-200 dark:bg-column-background">
      <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
        {status.name}
      </h2>
      <div className="space-y-4">{children}</div>
    </div>
  );
});

BoardColumn.displayName = "BoardColumn";

export default BoardColumn;
