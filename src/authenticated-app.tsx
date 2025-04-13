import React from "react";
import { ProjectListScreen } from "screens/project-list";
import { useAuth } from "context/auth-context";
//把svg以react组建的形式引入进来，注意要大写
import { ReactComponent as SoftwareLogo } from "assets/software-logo.svg";
import styled from "@emotion/styled";
import { ButtonNoPadding, Row } from "components/lib";
import { Button, Dropdown, Menu } from "antd";
import { Navigate, Route, Routes } from "react-router";
import { BrowserRouter as Router } from "react-router-dom";
import { ProjectScreen } from "screens/project";
import { resetRoute } from "utils";
import { ProjectModal } from "screens/project-list/project-modal";
import { ProjectPopover } from "components/project-popover";
import { UserPopover } from "components/user-popover";

/**
 * grid 和 flex 各自的应用场景
 * 1. 要考虑，是一维布局 还是 二维布局
 * 一般来说，一维布局用flex，二维布局用grid
 * 2. 是从内容出发还是从布局出发？
 * 从内容出发：你先有一组内容(数量一般不固定),然后希望他们均匀的分布在容器中，由内容自己的大小决定占据的空间
 * 从布局出发：先规划网格(数量一般比较固定)，然后再把元素往里填充
 * 从内容出发，用flex
 * 从布局出发，用grid
 *
 */

/**
 * ### React 组件组合（Component Composition）示例
 *
 * 组件组合是 React 中一种强大的模式，它允许我们通过将多个组件组合在一起构建复杂的 UI，同时保持代码的可重用性和可维护性。
 *
 * #### 示例：组件组合
 *
 * 以下是一个简单的例子，展示如何使用组件组合来构建一个弹窗组件：
 *
 * ```typescriptreact
 * import React from "react";
 *
 * // 通用的容器组件
 * const Modal = ({ children }: { children: React.ReactNode }) => {
 *   return (
 *     <div style={{ border: "1px solid black", padding: "1rem", width: "300px" }}>
 *       {children}
 *     </div>
 *   );
 * };
 *
 * // 标题组件
 * const ModalHeader = ({ title }: { title: string }) => {
 *   return <h2>{title}</h2>;
 * };
 *
 * // 内容组件
 * const ModalContent = ({ content }: { content: string }) => {
 *   return <p>{content}</p>;
 * };
 *
 * // 操作按钮组件
 * const ModalActions = ({ onClose }: { onClose: () => void }) => {
 *   return <button onClick={onClose}>关闭</button>;
 * };
 *
 * // 使用组件组合构建完整的弹窗
 * const App = () => {
 *   const handleClose = () => {
 *     alert("弹窗关闭");
 *   };
 *
 *   return (
 *     <Modal>
 *       <ModalHeader title="弹窗标题" />
 *       <ModalContent content="这是弹窗的内容" />
 *       <ModalActions onClose={handleClose} />
 *     </Modal>
 *   );
 * };
 *
 * export default App;
 * ```
 *
 * #### 运行效果
 * - `Modal` 是一个通用的容器组件，负责提供弹窗的布局。
 * - `ModalHeader`、`ModalContent` 和 `ModalActions` 是具体的子组件，分别负责标题、内容和操作按钮。
 * - 通过组合这些组件，我们可以轻松构建一个功能完整的弹窗。
 *
 * ---
 *
 * ### 组件组合的好处
 *
 * 1. **高可重用性**：
 *    - 每个子组件（如 `ModalHeader`、`ModalContent`）可以在其他地方单独使用，减少重复���码。
 *
 * 2. **关注点分离**：
 *    - 每个组件只关注自己的职责（如标题、内容、操作按钮），使代码更易于理解和维护。
 *
 * 3. **灵活性**：
 *    - 父组件可以通过 `props` 向子组件传递数据，子组件的行为可以根据父组件的需求动态调整。
 *
 * 4. **可测试性**：
 *    - 每个子组件可以单独测试，确保其功能正确。
 *
 * 5. **易于扩展**：
 *    - 如果需要添加新��能（如弹窗的动画效果），可以通过扩展现有组件或添加新组件来实现，而无需修改现有代码。
 *
 * 通过组件组合，React 提供了一种模块化的方式来构建复杂的 UI，同时保持代码的简洁和可维护性。
 * @constructor
 */
// prop drilling

export const AuthenticatedApp = () => {
  //如果采用父组件管理状态的方案来实现子组建状态共享，那么最直接的一个方式就是把这个状态提升到子组件共同的父组件那里面去。从而实现子组建状态共享和协调
  //比如这里可以写 const[projectmodalopen,setprojectmodalopen] = useState(false)
  //注意这是采用redux组件之类的状态管理组件之外的一种原始方案
  return (
    <Container>
      <Router>
        <PageHeader />
        <Main>
          <Routes>
            <Route path={"/projects"} element={<ProjectListScreen />} />
            <Route
              path={"/projects/:projectId/*"}
              element={<ProjectScreen />}
            />
            <Navigate to={"/projects"} />
          </Routes>
        </Main>
        <ProjectModal />
      </Router>
    </Container>
  );
};

const PageHeader = () => {
  return (
    <Header between={true}>
      <HeaderLeft gap={true}>
        <ButtonNoPadding type={"link"} onClick={resetRoute}>
          {/*//logo类似组建的方式引入进来，就可以定义宽度了*/}
          <SoftwareLogo width={"18rem"} color={"rgb(38, 132, 255)"} />
        </ButtonNoPadding>
        <ProjectPopover />
        <UserPopover />
      </HeaderLeft>
      <HeaderRight>
        <User />
      </HeaderRight>
    </Header>
  );
};

const User = () => {
  const { logout, user } = useAuth();
  return (
    <Dropdown
      overlay={
        <Menu>
          <Menu.Item key={"logout"}>
            <Button onClick={logout} type={"link"}>
              登出
            </Button>
          </Menu.Item>
        </Menu>
      }
    >
      {/*preventDefault用来防止页面重新刷新*/}
      <Button type={"link"} onClick={(e) => e.preventDefault()}>
        Hi, {user?.name}
      </Button>
    </Dropdown>
  );
};

//grid布局很强大，有时候比flex box模型更好
// temporal dead zone(暂时性死区)
//为啥container定义在后面却不报错。因为页面AuthenticatedApp使用它时候他还没有定义。这是为什么呢
//举例子： 浏览器console中测试
//console.log(a); var a=1
//undefined
//var a = undefined; console.log(a);var a=1
//说明var是进行了变量提升，提升为了undefined
//console.log(b);const b=1 //报错 can not access 'b' before initialization, 貌似这个错误是浏览器知道我们后面定义的参数b是存在的
//console.log(c) //报错 c is not defined
//这里的解释就是我们只是在最上面定义了container，即使container还没有初始化。他也不会报错。因为它只是定义了，还没有运行。
// 因此不会报错。项目启动之后应该就是页面加载的时候这个container定义了。然后用户访问页面的时候才执行。 那么就管理好了执行顺序，就不会报错了
const Container = styled.div`
  display: grid;
  grid-template-rows: 6rem 1fr;
  height: 100vh;
`;

// grid-area 用来给grid子元素起名字
const Header = styled(Row)`
  padding: 3.2rem;
  box-shadow: 0 0 5px 0 rgba(0, 0, 0, 0.1);
  z-index: 1;
    //height: 6rem; header和main占据整个屏幕的高度，所以如果它是6rem，main就是calc(100vh-6rem)
`;
const HeaderLeft = styled(Row)``;
const HeaderRight = styled.div``;
const Main = styled.main`
  display: flex;
  overflow: hidden;
    //height: calc(100vh-6rem );
`;
