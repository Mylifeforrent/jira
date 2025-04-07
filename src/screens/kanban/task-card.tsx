import React from "react";
import { Button, Card, Dropdown, Menu, Modal } from "antd";
import { Task } from "types/task";
import { useTaskTypes } from "utils/task-type";
import taskIcon from "assets/task.svg";
import bugIcon from "assets/bug.svg";
import { Mark } from "components/mark";
import {
  useTaskModal,
  useTasksQueryKey,
  useTasksSearchParams,
} from "screens/kanban/util";
import { useDeleteTask } from "utils/task";
import { Row } from "components/lib";

const TaskTypeIcon = ({ id }: { id: number }) => {
  const { data: taskTypes } = useTaskTypes();
  const name = taskTypes?.find((taskType) => taskType.id === id)?.name;
  if (!name) {
    return null;
  }
  return <img alt={"task-type"} src={name === "task" ? taskIcon : bugIcon} />;
};

export const TaskCard = ({ task }: { task: Task }) => {
  const { name } = useTasksSearchParams()[0];
  const { startEdit } = useTaskModal();
  return (
    <Card
      onClick={() => startEdit(task.id)}
      style={{ marginBottom: "0.5rem", cursor: "pointer" }}
    >
      <Row between={true}>
        <Mark name={task.name} keyword={name} />
        <More task={task} />
      </Row>
      <TaskTypeIcon id={task.typeId} />
    </Card>
  );
};

const More = ({ task }: { task: Task }) => {
  const { mutate } = useDeleteTask(useTasksQueryKey());
  const overlay = (
    <Menu>
      <Menu.Item>
        <Button
          onClick={() => {
            Modal.confirm({
              okText: "确定",
              cancelText: "取消",
              title: "确定删除任务吗？",
              onOk() {
                mutate({ id: task.id });
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
      <span>...</span>
    </Dropdown>
  );
};
