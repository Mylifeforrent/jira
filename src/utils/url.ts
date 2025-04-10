import { URLSearchParamsInit, useSearchParams } from "react-router-dom";
import { useMemo, useState } from "react";
import { cleanObject, subset } from "utils/index";

/**
 * 返回页面url中，指定键的参数值
 * 别人打开你分享的链接，就可以直接自动填充过滤条件，然后输出结果了。
 */

//这里采用范型k表示传入的必须是string类型的key，然后外部使用的时候接收到的结果就会是动态变为需要的
// 类型了 比如说传入的key是['name','project']，那么返回的结果就是{ name: string, project: string }，刚好返回的这个结果是后续有约束的。那么就满足条件了
export const useUrlQueryParam = <K extends string>(keys: K[]) => {
  const [searchParams] = useSearchParams();
  const setSearchParams = useSetUrlSearchParam();
  const [stateKeys] = useState(keys);
  return [
    //这里采用useMemo主要是为了防止重复渲染，不然每次返回的都是同样的值，不过引用不一样。那么react dom diff算法发现引用变了，就会反复渲染。
    useMemo(
      () =>
        subset(Object.fromEntries(searchParams), stateKeys) as {
          [key in K]: string;
        },
      [searchParams, stateKeys]
    ),
    (params: Partial<{ [key in K]: unknown }>) => {
      return setSearchParams(params);
      // iterator
      // iterator: https://codesandbox.io/s/upbeat-wood-bum3j?file=/src/index.js
    },
  ] as const;
};

/**
 * 在 TypeScript 中，`const a = [2, 'df'] as const` 的作用是将数组 `a` 的类型设置为一个 **只读的字面量类型**，而不是普通的数组类型。
 *
 * ### 解释
 * 1. **`as const` 的作用**:
 *    - 将数组或对象的所有元素/属性变为 **只读**，并且保留它们的具体值（字面量类型）。
 *    - 例如，`[2, 'df'] as const` 的类型是 `[2, 'df']`，而不是 `(number | string)[]`。
 *
 * 2. **不使用 `as const` 的区别**:
 *    - 如果不使用 `as const`，`a` 的类型会被推断为 `(number | string)[]`，即一个可以包含 `number` 或 `string` 的数组。
 *    - 使用 `as const` 后，`a` 的类型是 `[2, 'df']`，表示一个固定的元组，且元素不可修改。
 *
 * ### 示例
 * ```typescript
 * // 使用 as const
 * const a = [2, 'df'] as const;
 * // a 的类型是 [2, 'df']，是一个只读的元组
 * // 不能修改 a 的元素
 * // a[0] = 3; // 报错：因为 a 是只读的
 *
 * // 不使用 as const
 * const b = [2, 'df'];
 * // b 的类型是 (number | string)[]
 * // 可以修改 b 的元素
 * b[0] = 3; // 不会报错
 * ```
 *
 * ### 是否会报错
 * 是否报错取决于代码的上下文：
 * - 如果你需要 `a` 的类型��固定的 `[2, 'df']`，但没有使用 `as const`，会导致类型不匹配，从而报错。
 * - 如果不需要固定类型（例如，允许修改数组），则不使用 `as const` 不会报错。
 *
 * ### 总结
 * `as const` 的主要作用是将数组或对象的类型变为 **不可变的字面量类型**。是否报错取决于代码对类型的要求。
 */

export const useSetUrlSearchParam = () => {
  const [searchParams, setSearchParam] = useSearchParams();
  return (params: { [key in string]: unknown }) => {
    const o = cleanObject({
      ...Object.fromEntries(searchParams),
      ...params,
    }) as URLSearchParamsInit;
    return setSearchParam(o);
  };
};
