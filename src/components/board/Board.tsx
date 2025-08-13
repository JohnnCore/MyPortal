import CardBoard from "./Card/CardBoard";
import { issuesStatues, issues } from "../../mocks";

const Board = () => {
  return (
    <div className="p-6 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">
        Work Items Board
      </h1>
      <div className="flex flex-col md:flex-row gap-4 min-h-screen">
        {issuesStatues.map((status) => (
          <div
            key={status}
            className="flex-1 min-w-[250px] p-2 rounded-md bg-gray-200 dark:bg-gray-950"
          >
            <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
              {status}
            </h2>
            <div className="space-y-4">
              {issues
                .filter((item) => item.status === status)
                .map((item) => (
                  <CardBoard key={item.id} item={item} />
                ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Board;
