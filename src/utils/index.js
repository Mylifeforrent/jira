import { useEffect, useState } from "react";

export const isFalsy = (value) => {
  return value === 0 ? false : !value;
};

export const cleanObject = (object) => {
  const result = { ...object };
  Object.keys(result).forEach((key) => {
    const value = result[key];
    if (isFalsy(value)) {
      delete result[key];
    }
  });
  return result;
};

//define specific hook function, const name must be start with 'use' prefix
export const useMount = (callback) => {
  useEffect(() => {
    callback();
  }, []);
};

//this function is used to get pram lately,延迟执行的函数， 避免输入过滤条件的时候频繁的call api， 这个闭包函数比较有用
//只要是连续执行的，后一个执行的函数会把前一个执行函数积累的数据全部清空，这就可以起到一个避免堆积的效果
export const debounce = (func, delay) => {
  let timeout;
  return (...args) => {
    const context = this;
    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(() => {
      func.apply(context, args);
    }, delay);
  };
};

/**
 * useDebounce Hook
 * @param {any} value - 需要防抖处理的值
 * @param {number} delay - 延迟时间（毫秒）
 * @returns {any} - 防抖处理后的值
 */
export const useDebounce = (value, delay) => {
  // 定义一个状态变量用于存储防抖处理后的值
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    // 每次 value 变化后，设置一个新的定时器
    const handler = setTimeout(() => {
      // 延迟 delay 时间后，更新 debouncedValue
      setDebouncedValue(value);
    }, delay);

    // 在 useEffect 清理阶段清除上一个定时器，
    //     具体来说，当 value 或 delay 变化时：
    // useEffect 会先执行清理函数，清除上一个定时器。
    // 然后设置一个新的定时器。
    // 这样可以确保在延迟时间内只有一个有效的定时器在运行，避免了多个定时器同时存在的问题。
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]); // 依赖项为 value 和 delay，当它们变化时重新执行 useEffect

  // 返回防抖处理后的值
  return debouncedValue;
};

/**
 * useEffect return那一段代码就是清理函数是吗， 而且清理函数是依赖想变化的时候最先执行的？
 * 是的，`useEffect` 返回的那一段代码就是清理函数。清理函数会在以下两种情况下执行：
 *
 * 1. 组件卸载时。
 * 2. 依赖项变化时，`useEffect` 会先执行清理函数，然后再执行主函数。
 *
 * 以下是一个简单的示例代码：
 *
 * ```javascript
 * import { useEffect } from "react";
 *
 * const MyComponent = () => {
 *   useEffect(() => {
 *     // 主函数
 *     console.log("Effect executed");
 *
 *     // 清理函数
 *     return () => {
 *       console.log("Cleanup executed");
 *     };
 *   }, []); // 依赖项为空数组，表示只在组件挂载和卸载时执行
 *
 *   return <div>My Component</div>;
 * };
 * ```
 *
 * 在这个示例中，当组件挂载时，会执行主函数并输出 "Effect executed"。当组件卸载时，会执行清理函数并输出 "Cleanup executed"。如果依赖项变化，清理函数会在主函数重新执行之前先执行。
 */
