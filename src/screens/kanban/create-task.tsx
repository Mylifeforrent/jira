import React, { useEffect, useState } from "react";
import { useAddTask } from "utils/task";
import { useProjectIdInUrl, useTasksQueryKey } from "screens/kanban/util";
import { Card, Input } from "antd";
import styled from "@emotion/styled";

export const CreateTask = ({ kanbanId }: { kanbanId: number }) => {
  const [name, setName] = useState("");
  const { mutateAsync: createTask } = useAddTask(useTasksQueryKey());
  const [inputMode, setInputMode] = useState(false);
  const projectId = useProjectIdInUrl();

  const submit = () => {
    createTask({ kanbanId, name, projectId }).then(() => {
      setInputMode(false);
      setName("");
    });
  };

  const toggle = () => setInputMode((mode) => !mode);

  useEffect(() => {
    if (!inputMode) {
      setName("");
    }
  }, [inputMode]);

  if (!inputMode) {
    return <Container onClick={toggle}>+创建事务</Container>;
  }

  return (
    <Card>
      <Input
        onBlur={toggle}
        placeholder={"需要做些什么"}
        autoFocus={true}
        onPressEnter={submit}
        value={name}
        onChange={(evt) => setName(evt.target.value)}
      />
    </Card>
  );
};

const Container = styled.div`
  padding-left: 0.5rem;
  padding-top: 0.5rem;
  cursor: pointer;
`;
