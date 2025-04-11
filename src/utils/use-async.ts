import { useCallback, useReducer, useState } from "react";
import { useMountedRef } from "utils/index";

interface State<D> {
  error: Error | null;
  data: D | null;
  stat: "idle" | "loading" | "error" | "success";
}

const defaultInitialState: State<null> = {
  stat: "idle",
  data: null,
  error: null,
};

const defaultConfig = {
  throwOnError: false,
};

const useSafeDispatch = <T>(dispatch: (...args: T[]) => void) => {
  //用法看下面的解释 采用 mountedRef。 来检测是不是组建已经被卸载了，从而规避setdata到卸载的组件这个问题
  const mountedRef = useMountedRef();
  return useCallback(
    (...args: T[]) => (mountedRef.current ? dispatch(...args) : void 0),
    [dispatch, mountedRef]
  );
};

export const useAsync = <D>(
  initialState?: State<D>,
  initialConfig?: typeof defaultConfig
) => {
  const config = { ...defaultConfig, ...initialConfig };
  const [state, dispatch] = useReducer(
    (state: State<D>, action: Partial<State<D>>) => ({ ...state, ...action }),
    {
      ...defaultInitialState,
      ...initialState,
    }
  );
  const safeDispatch = useSafeDispatch(dispatch);
  // useState直接传入函数的含义是：惰性初始化；所以，要用useState保存函数，不能直接传入函数，不然就会直接调用了
  // https://codesandbox.io/s/blissful-water-230u4?file=/src/App.js
  const [retry, setRetry] = useState(() => () => {});

  const setData = useCallback(
    (data: D) =>
      safeDispatch({
        data,
        stat: "success",
        error: null,
      }),
    [safeDispatch]
  );

  const setError = useCallback(
    (error: Error) =>
      safeDispatch({
        error,
        stat: "error",
        data: null,
      }),
    [safeDispatch]
  );

  // run 用来触发异步请求
  const run = useCallback(
    (promise: Promise<D>, runConfig?: { retry: () => Promise<D> }) => {
      if (!promise || !promise.then) {
        throw new Error("请传入 Promise 类型数据");
      }
      //要采用惰性初始化，设置函数，采用这个方式尽管他会马上运行。但是她返回的就是一个函数，而不会直接执行我们的那个函数了
      setRetry(() => () => {
        if (runConfig?.retry) {
          run(runConfig?.retry(), runConfig);
        }
      });
      safeDispatch({ stat: "loading" });
      return promise
        .then((data) => {
          //加载页面在使用到这个函数的时候会采用promise执行函数，但是呢可能异步操作比较慢，这个操作还没有完成的时候用户切换了切面。切换页面的时候这个用户页面组建已经卸载了
          //但是此时这个函数执行完了，依然准备去setdata，发现组件已经被卸载了。那么就会控制台报错。这个问题如何解决呢？ 采用 mountedRef。 来检测是不是组建已经被卸载了，从而规避这个问题
          setData(data);
          return data;
        })
        .catch((error) => {
          // catch会消化异常，如果不主动抛出，外面是接收不到异常的
          setError(error);
          if (config.throwOnError) return Promise.reject(error);
          return error;
        });
    },
    //为什么这里添加这么多依赖呢，因为你的hook里面用到了这些函数这些状态组建，那么最好就是把依赖添加进去。但是为了防止一些不必要的无限渲染。就需要把函数采用callback包装。避免基于引用的判断导致错误的无限渲染
    //如果用到了setState，那么就需要采用另外一种方式来写，就不需要把state放到依赖想里面了。比如 setState(prevState = ({...prvState,state:"loading"})); 不过一遍尽量避免在这个hook里面采用useState
    [config.throwOnError, setData, setError, safeDispatch]
  );

  //总结useMemo useCallback主要用于非基本类型的依赖包装起来。 不然useEffect会提示你要把函数添加到依赖里去。你加进去之后就会无限循环了。 自定义hook里面如果返回函数 基本上都要加上usecallback包装

  return {
    isIdle: state.stat === "idle",
    isLoading: state.stat === "loading",
    isError: state.stat === "error",
    isSuccess: state.stat === "success",
    run,
    setData,
    setError,
    // retry 被调用时重新跑一遍run，让state刷新一遍
    retry,
    ...state,
  };
};


//useRef会有一些坑，通过它不一定可以保证页面渲染，以为你它初始化value之后，不会改变了。 所以最好采用状态组建去保存状态。这样页面就可以刷新了。可以查查资料
