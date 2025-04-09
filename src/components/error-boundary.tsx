import React from "react";

type FallbackRender = (props: { error: Error | null }) => React.ReactElement;

//错误边界是一个很重要的概念，而且只能使用class component组建来编写
//这个地址是react官方的error boundary实现方式，更好用更强大
// https://github.com/bvaughn/react-error-boundary
export class ErrorBoundary extends React.Component<
  React.PropsWithChildren<{ fallbackRender: FallbackRender }>,
  { error: Error | null }
> {
  state = { error: null };

  // 当子组件抛出异常，这里会接收到并且调用
  static getDerivedStateFromError(error: Error) {
    return { error };
  }

  render() {
    const { error } = this.state;
    const { fallbackRender, children } = this.props;
    if (error) {
      return fallbackRender({ error });
    }
    return children;
  }
}
