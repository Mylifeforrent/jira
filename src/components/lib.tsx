import styled from "@emotion/styled";
import React from "react";
import { Button, Spin, Typography } from "antd";
import { DevTools } from "jira-dev-tool";

/**
 * 在这个代码中，`> *` 是一个 CSS 选择器，具体含义如下：
 *
 * - `>` 是子选择器，表示只选择直接子元素。
 * - `*` 是通配符选择器，表示匹配所有元素。
 *
 * 因此，`> *` 的意思是：选择当前元素的所有直接子元素，不论它们的标签是什么。
 *
 * 在这个代码中，`> *` 的作用是为 `Row` 组件的所有直接子元素设置样式，例如 `margin-top`、`margin-bottom` 和 `margin-right` 等。在这段代码中，`> *` 是一个 CSS 选择器，具体含义如下：
 *
 * - `>` 是子选择器，表示只选择当前元素的直接子元素。
 * - `*` 是通配符选择器，表示匹配所有类型的元素。
 *
 * 因此，`> *` 的意思是：选择当前 `Row` 组件的所有直接子元素，不论它们的标签是什么。
 *
 *
 *
 */

/**
 * 是的，如果需要指定特定的子元素，可以使用类似 > div 的写法。以下是一些常见的用法示例：
 * 示例
 */
// import styled from "@emotion/styled";
//
// const Container = styled.div`
//   > div {
//     color: red; /* 只作用于直接子元素 div */
//   }
//
//   > p {
//     font-size: 16px; /* 只作用于直接子元素 p */
//   }
//
//   > span {
//     margin: 10px; /* 只作用于直接子元素 span */
//   }
// `;
//
// export const Example = () => (
//   <Container>
//     <div>这是一个 div</div>
//     <p>这是一个 p</p>
//     <span>这是一个 span</span>
//     <section>这是一个 section</section>
//   </Container>
// );
// 说明
// > div：只选择当前容器的直接子元素 div。
// > p：只选择当前容器的直接子元素 p。
// > span：只选择当前容器的直接子元素 span。
// 如果需要更复杂的选择器，也可以结合其他 CSS 选择器使用，例如 nth-child、first-child 等。
export const Row = styled.div<{
  gap?: number | boolean;
  between?: boolean;
  marginBottom?: number;
}>`
  display: flex;
  align-items: center;
  justify-content: ${(props) => (props.between ? "space-between" : undefined)};
  margin-bottom: ${(props) => props.marginBottom + "rem"};

  > * {
    margin-top: 0 !important;
    margin-bottom: 0 !important;
    margin-right: ${(props) =>
      typeof props.gap === "number"
        ? props.gap + "rem"
        : props.gap
        ? "2rem"
        : undefined};
  }
`;

const FullPage = styled.div`
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const FullPageLoading = () => (
  <FullPage>
    <Spin size={"large"} />
  </FullPage>
);

export const FullPageErrorFallback = ({ error }: { error: Error | null }) => (
  <FullPage>
    <DevTools />
    <ErrorBox error={error} />
  </FullPage>
);

// 类型守卫
const isError = (value: any): value is Error => value?.message;

export const ErrorBox = ({ error }: { error: unknown }) => {
  if (isError(error)) {
    return <Typography.Text type={"danger"}>{error?.message}</Typography.Text>;
  }
  return null;
};

export const ButtonNoPadding = styled(Button)`
  padding: 0;
`;

export const ScreenContainer = styled.div`
  padding: 3.2rem;
  width: 100%;
  display: flex;
  flex-direction: column;
`;
