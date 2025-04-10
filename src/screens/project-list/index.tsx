import React from "react";
import { SearchPanel } from "screens/project-list/search-panel";
import { List } from "screens/project-list/list";
import { useDebounce, useDocumentTitle } from "utils";
import { useProjects } from "utils/project";
import { useUsers } from "utils/user";
import {
  useProjectModal,
  useProjectsSearchParams,
} from "screens/project-list/util";
import {
  ButtonNoPadding,
  ErrorBox,
  Row,
  ScreenContainer,
} from "components/lib";

// 状态提升可以让组件共享状态，但是容易造成 prop drilling

// 基本类型，可以放到依赖里；组件状态，可以放到依赖里；非组件状态的对象，绝不可以放到依赖里
// https://codesandbox.io/s/keen-wave-tlz9s?file=/src/App.js
/**
 * import React, { useEffect, useState } from "react";
 * import "./styles.css";
 *
 * export default function App() {
 *   // 当obj是基本类型的时候，就不会无限循环
 *   // 当 obj是对象的时候，就会无限循环
 *   // 当 obj 是对象的state时，不会无限循环
 *   //这里useEffect依赖的有obj，页面加载的时候初始化，然后num+1，num的值变了，
 *   //有一点需要注意。如果依赖像是采用useState类似的函数管理的，那么是可以避免这个问题的，因为他不会傻傻的对比对象的引用。他只会在我们调用了setXXX 类似的方法的时候才会认为是改变了
 *   就会出发状态改变之后的重新渲染。然后obj在页面加载时候又变成了一个新的引用，和老的引用不一样。obj引用改变导致useeffect又执行了一次，所以就会无限循环了
 *   const [obj, setObj] = useState({ name: "Jack" });
 *   // const obj = 1;
 *   // const obj = {name: 'Jack'}
 *   const [num, setNum] = useState(0);
 *
 *   useEffect(() => {
 *     console.log("effect");
 *     setNum(num + 1);
 *   }, [obj]);
 *
 *   return (
 *     <div className="App">
 *       {num}
 *       <h1>Hello CodeSandbox</h1>
 *       <h2>Start editing to see some magic happen!</h2>
 *     </div>
 *   );
 * }
 * @constructor
 */


// 使用 JS 的同学，大部分的错误都是在 runtime(运行时) 的时候发现的
// 我们希望，在静态代码中，就能找到其中的一些错误 -> 强类型
export const ProjectListScreen = () => {
  useDocumentTitle("项目列表", false);

  const { open } = useProjectModal();

  const [param, setParam] = useProjectsSearchParams();
  const { isLoading, error, data: list } = useProjects(useDebounce(param, 200));
  const { data: users } = useUsers();

  return (
    <ScreenContainer>
      <Row marginBottom={2} between={true}>
        <h1>项目列表</h1>
        <ButtonNoPadding onClick={open} type={"link"}>
          创建项目
        </ButtonNoPadding>
      </Row>
      <SearchPanel users={users || []} param={param} setParam={setParam} />
      <ErrorBox error={error} />
      {/*// dataSource={list || []}表示给一个默认的空数组，就不会报错undifined不能赋值给它了*/}
      <List loading={isLoading} users={users || []} dataSource={list || []} />
    </ScreenContainer>
  );
};

ProjectListScreen.whyDidYouRender = false;
