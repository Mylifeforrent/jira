import React, { useState } from "react";
import { Container as ColumnContainer } from "./kanban-column";
import { Button, Dropdown, Input, Menu, Modal } from "antd";
import { useKanbansQueryKey, useProjectIdInUrl } from "screens/kanban/util";
import { useAddKanban, useDeleteKanban } from "utils/kanban";
import { Kanban } from "types/kanban";

export const CreateKanban = () => {
  const [name, setName] = useState("");
  const projectId = useProjectIdInUrl();
  const { mutateAsync: addKanban } = useAddKanban(useKanbansQueryKey());

  const submit = async () => {
    addKanban({ name, projectId });
    setName("");
  };
  return (
    <ColumnContainer>
      <Input
        size={"large"}
        placeholder={"新建看板名称"}
        onPressEnter={submit}
        value={name}
        onChange={(event) => setName(event.target.value)}
      />
    </ColumnContainer>
  );
};
