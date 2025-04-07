import React from "react";
import { Kanban } from "types/kanban";
import { useKanbansQueryKey, useTasksSearchParams } from "screens/kanban/util";
import styled from "@emotion/styled";
import { Button, Dropdown, Menu, Modal } from "antd";
import { useDebounce } from "utils";
import { useTasks } from "utils/task";
import { useDeleteKanban } from "utils/kanban";
import { Row } from "components/lib";
import { TaskCard } from "screens/kanban/task-card";
import { CreateTask } from "screens/kanban/create-task";

export const KanbanColumn = ({ kanban }: { kanban: Kanban }) => {
  const { data: allTasks } = useTasks(
    useDebounce(useTasksSearchParams()[0], 200)
  );
  const tasks = allTasks?.filter((task) => task.kanbanId === kanban.id);
  return (
    <Container>
      <Row between={true}>
        <h3>
          {kanban.name} {tasks?.length}
        </h3>
        <More kanban={kanban} />
      </Row>
      <TasksContainer>
        {tasks?.map((task) => (
          <TaskCard key={task.id} task={task} />
        ))}
        <CreateTask kanbanId={kanban.id} />
      </TasksContainer>
    </Container>
  );
};

const More = ({ kanban }: { kanban: Kanban }) => {
  const { mutate } = useDeleteKanban(useKanbansQueryKey());
  const overlay = (
    <Menu>
      <Menu.Item>
        <Button
          onClick={() => {
            Modal.confirm({
              okText: "确定",
              cancelText: "取消",
              title: "确定删除看板吗？",
              onOk() {
                mutate({ id: kanban.id });
              },
            });
          }}
          type={"link"}
          rel="noopener noreferrer"
        >
          删除
        </Button>
      </Menu.Item>
    </Menu>
  );
  return (
    <Dropdown overlay={overlay}>
      <Button type={"link"}>...</Button>
    </Dropdown>
  );
};

export const Container = styled.div`
  min-width: 27rem;
  border-radius: 6px;
  background-color: rgb(244, 245, 247);
  display: flex;
  flex-direction: column;
  padding: 0.7rem 0.7rem 1rem;
  margin-right: 1.5rem;
`;

const TasksContainer = styled.div`
  overflow: scroll;
  flex: 1;

  ::-webkit-scrollbar {
    display: none;
  }
`;
