import { useHttp } from "utils/http";
import { useQuery } from "react-query";
import { TaskType } from "types/task-type";

export const useTaskTypes = () => {
  const client = useHttp();
  return useQuery<TaskType[]>({
    queryKey: ["taskTypes"],
    queryFn: () => {
      return client("taskTypes");
    },
  });
};
