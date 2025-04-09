import qs from "qs";
import * as auth from "auth-provider";
import { useAuth } from "context/auth-context";
import { useCallback } from "react";

const apiUrl = process.env.REACT_APP_API_URL;

interface Config extends RequestInit {
  token?: string;
  data?: object;
}

export const http = async (
  endpoint: string,
  { data, token, headers, ...customConfig }: Config = {}
) => {
  const config = {
    method: "GET",
    headers: {
      Authorization: token ? `Bearer ${token}` : "",
      "Content-Type": data ? "application/json" : "",
    },
    ...customConfig,
  };

  if (config.method.toUpperCase() === "GET") {
    endpoint += `?${qs.stringify(data)}`;
  } else {
    config.body = JSON.stringify(data || {});
  }

  // axios 和 fetch 的表现不一样，axios可以直接在返回状态不为2xx的时候抛出异常
  //fetch 在返回不是200时候， 加上catch没有效果，这里要注意
  return window
    .fetch(`${apiUrl}/${endpoint}`, config)
    .then(async (response) => {
      if (response.status === 401) {
        await auth.logout();
        window.location.reload();
        return Promise.reject({ message: "请重新登录" });
      }
      const data = await response.json();
      if (response.ok) {
        return data;
      } else {
        return Promise.reject(data);
      }
    });
};

// JS 中的typeof，是在runtime时运行的
// return typeof 1 === 'number'

// TS 中的typeof，是在静态环境运行的
// return (...[endpoint, config]: Parameters<typeof http>) =>
export const useHttp = () => {
  const { user } = useAuth();
  // utility type 的用法：用泛型给它传入一个其他类型，然后utility type对这个类型进行某种操作
  /**
   * useCallback:
   * React 的一个 Hook，用于缓存函数，避免在组件重新渲染时生成新的函数实例。
   * 第二个参数 [user?.token] 是依赖数组，表示只有当 user?.token 发生变化时，才会重新生成新的回调函数。
   * 参数解构:
   * (...[endpoint, config]: Parameters<typeof http>)：
   * 使用 TypeScript 的 Parameters 工具类型，获取 http 函数的参数类型。
   * 解构出 http 函数的两个参数��endpoint 和 config。
   * http 调用:
   * 调用 http 函数，并将 config 参数展开，同时附加 token。
   * token 的值来源于当前用户 user?.token，用于身份验证。
   * 依赖:
   * [user?.token] 确保当用户的 token 发生变化时，回调函数会更新。
   * 总结：
   * 这段代码返回一个缓存的 HTTP 请求函数，自动将用户的 token 添加到请求配置中，避免每次重新渲染时重复创建函数
   */
  return useCallback(
    /**
     * ...[endpoint, config] 是 JavaScript 解构赋值 和 剩余参数 的结合使用。
     * 具体含义
     * 解构赋值:
     * ...[endpoint, config] 表示将数组的元素解构为 endpoint 和 config 两个变量。
     * 这里的数组是函数的参数。
     * 剩余参数:
     * ... 是剩余参数语法，用于接收函数调用时传入的所有参数。
     * 在这里，...[endpoint, config] 表示将传入的参数解构为一个数组，然后再解构为 endpoint 和 config。
     * 示例
     * 以下是一个简单的例子：
     * const example = (...[a, b]: [string, number]) => {
     *   console.log(a); // 第一个参数
     *   console.log(b); // 第二个参数
     * };
     *
     * example("hello", 42);
     * // 输出:
     * // hello
     * // 42
     *
     * 在你的代码中：(...[endpoint, config]: Parameters<typeof http>) =>
     *   Parameters<typeof http> 提取了 http 函数的参数类型，返回一个元组类型。
     * ...[endpoint, config] 将这个元组解构为 endpoint 和 config，从而可以直接使用这两个变量。
     * @param endpoint
     * @param config
     */
    (...[endpoint, config]: Parameters<typeof http>) =>
      http(endpoint, { ...config, token: user?.token }),
    [user?.token]
  );
};

// 类型别名、Utility Type 讲解
// 联合类型
let myFavoriteNumber: string | number;
myFavoriteNumber = "seven";
myFavoriteNumber = 7;
// TS2322: Type '{}' is not assignable to type 'string | number'.
// myFavoriteNumber = {}
let jackFavoriteNumber: string | number;

// 类型别名在很多情况下可以和interface互换
// interface Person {
//   name: string
// }
// type Person = { name: string }
// const xiaoMing: Person = {name: 'xiaoming'}

// 类型别名, interface 在这种情况下没法替代type
type FavoriteNumber = string | number;
let roseFavoriteNumber: FavoriteNumber = "6";

// interface 也没法实现Utility type
type Person = {
  name: string;
  age: number;
};
const xiaoMing: Partial<Person> = {};
const shenMiRen: Omit<Person, "name" | "age"> = {};
type PersonKeys = keyof Person;
type PersonOnlyName = Pick<Person, "name" | "age">;
type Age = Exclude<PersonKeys, "name">;

// Partial 的实现
type Partial<T> = {
  [P in keyof T]?: T[P];
};
