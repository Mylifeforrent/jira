import React from "react";
import { Dropdown, Menu, Modal, Table } from "antd";
import dayjs from "dayjs";
import { TableProps } from "antd/es/table";
// react-router 和 react-router-dom的关系，类似于 react 和 react-dom/react-native/react-vr...
//react用来核心操作，比如dom的diff 状态管理。 react-dom用来接受react计算好的状态之类的东西来进行浏览器渲染，因为dom是浏览器使用的有依赖关系
//同样 react-native是存在于手机端android，macos上面进行各种渲染之类的。同类的react-vr是vr设备使用的
//下面的link是用来在浏览器渲染的，所以肯定是从react-dom引入
import { Link } from "react-router-dom";
import { Pin } from "components/pin";
import { useDeleteProject, useEditProject } from "utils/project";
import { ButtonNoPadding } from "components/lib";
import {
  useProjectModal,
  useProjectsQueryKey,
} from "screens/project-list/util";
import { Project } from "types/project";
import { User } from "types/user";

//这里直接把Table组建的props传递过来，当作父属性继承，这样就可以不用每次在listprops里面添加属性了。尽量减少代码改动
interface ListProps extends TableProps<Project> {
  users: User[];
}

//这里{users,...props} 分为两个部分就是说从listpropts把users取出来单独放，剩余的采用...props放到props里面去 所以此时props=Omit<ListProps, "users">
export const List = ({ users, ...props }: ListProps) => {
  const { mutate } = useEditProject(useProjectsQueryKey());
  const pinProject = (id: number) => (pin: boolean) => mutate({ id, pin });
  return (
    <Table
      rowKey={"id"}
      pagination={false}
      columns={[
        {
          title: <Pin checked={true} disabled={true} />,
          render(value, project) {
            return (
              <Pin
                checked={project.pin}
                //因为project是提前知道的变量，pin是方法里面的变量。所以这里可以采用颗粒化方式来写这个函数，
                //const pinProject = (id: number) => (pin: boolean) => mutate({ id, pin });
                //onCheckedChange={pinProject(project.id)}
                //============== 上面和下面写法一样的效果=========
                //const pinProject=(id,number,pin:boolean)=>mutate({id,pin})
                //onCheckedChange={pin => pinProject(project.id,pin)}
                onCheckedChange={pinProject(project.id)}
              />
            );
          },
        },
        {
          title: "名称",
          sorter: (a, b) => a.name.localeCompare(b.name),
          render(value, project) {
            return <Link to={String(project.id)}>{project.name}</Link>;
          },
        },
        {
          title: "部门",
          dataIndex: "organization",
        },
        {
          title: "负责人",
          render(value, project) {
            return (
              <span>
                {users.find((user) => user.id === project.personId)?.name ||
                  "未知"}
              </span>
            );
          },
        },
        {
          title: "创建时间",
          render(value, project) {
            return (
              <span>
                {project.created
                  ? dayjs(project.created).format("YYYY-MM-DD")
                  : "无"}
              </span>
            );
          },
        },
        {
          render(value, project) {
            return <More project={project} />;
          },
        },
      ]}
      {...props}//props 这里就可以把传过来的属性放进去. 这个操作符会把里面的键值对展开放进去。 类似于name={jack},age={8}
    />
  );
};

const More = ({ project }: { project: Project }) => {
  const { startEdit } = useProjectModal();
  const editProject = (id: number) => () => startEdit(id);
  const { mutate: deleteProject } = useDeleteProject(useProjectsQueryKey());
  const confirmDeleteProject = (id: number) => {
    Modal.confirm({
      title: "确定删除这个项目吗?",
      content: "点击确定删除",
      okText: "确定",
      onOk() {
        deleteProject({ id });
      },
    });
  };
  return (
    <Dropdown
      overlay={
        <Menu>
          <Menu.Item onClick={editProject(project.id)} key={"edit"}>
            编辑
          </Menu.Item>
          <Menu.Item
            onClick={() => confirmDeleteProject(project.id)}
            key={"delete"}
          >
            删除
          </Menu.Item>
        </Menu>
      }
    >
      <ButtonNoPadding type={"link"}>...</ButtonNoPadding>
    </Dropdown>
  );
};
