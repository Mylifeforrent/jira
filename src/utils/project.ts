import { useHttp } from "utils/http";
import { QueryKey, useMutation, useQuery } from "react-query";
import {
  useAddConfig,
  useDeleteConfig,
  useEditConfig,
} from "utils/use-optimistic-options";
import { Project } from "types/project";

//Partial<Project>表示Project的所有属性都是可选的
/**
 * 这段代码使用了 `react-query` 的 `useQuery` Hook，用于从服务器获取项目列表数据，并将其与 React 组件的状态绑定。
 *
 * ### 代码解析
 * 1. **`useQuery`**:
 *    - `useQuery` 是 `react-query` 提供的一个 Hook，用于管理数据的获取、缓存和更新。
 *    - 第一个参数 `["projects", param]` 是查询的 **key**，用于标识和缓存查询结果。`param` 的变化会触发重新获取数据。
 *    - 第二个参数是一个函数，定义了如何获取数据。
 *
 * 2. **`client("projects", { data: param })`**:
 *    - `client` 是一个封装的 HTTP 请求函数（通常基于 `fetch` 或 `axios` 实现）。
 *    - 它向 `projects` 接口发送请求，��将 `param` 作为查询参数发送到服务器。
 *
 * 3. **返回值**:
 *    - `useQuery` 返回一个对象，包含查询的状态和数据，例如 `data`（查询结果）、`isLoading`（加载状态）和 `error`（错误信息）。
 *
 * ### 作用
 * 这段代码的作用是：
 * - 根据 `param` 参数从服务器获取项目列表数据。
 * - 自动管理数据的缓存和更新。
 * - 提供加载状态和错误处理的能力。
 *
 * ### 示例
 * 假设 `param` 是 `{ name: "test" }`，这段代码会向服务器发送一个类似 `GET /projects?name=test` 的请求，并将返回的数据绑定到组件中。
 * @param param
 */
export const  useProjects = (param?: Partial<Project>) => {
  const client = useHttp();

  return useQuery<Project[]>(["projects", param], () =>
    client("projects", { data: param })
  );
};
//hook function can not be called in a callback function. pls note. we can only return the function inside this hook, and then returned function can be called in callback function
export const useEditProject = (queryKey: QueryKey) => {
  const client = useHttp();
  return useMutation(
    (params: Partial<Project>) =>
      client(`projects/${params.id}`, {
        method: "PATCH",
        data: params,
      }),
    useEditConfig(queryKey)
  );
};

export const useAddProject = (queryKey: QueryKey) => {
  const client = useHttp();

  return useMutation(
    (params: Partial<Project>) =>
      client(`projects`, {
        data: params,
        method: "POST",
      }),
    useAddConfig(queryKey)
  );
};

export const useDeleteProject = (queryKey: QueryKey) => {
  const client = useHttp();

  return useMutation(
    ({ id }: { id: number }) =>
      client(`projects/${id}`, {
        method: "DELETE",
      }),
    useDeleteConfig(queryKey)
  );
};

export const useProject = (id?: number) => {
  const client = useHttp();
  return useQuery<Project>(
    ["project", { id }],
    () => client(`projects/${id}`),
    {
      enabled: Boolean(id),
    }
  );
};
