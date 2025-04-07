import React, { useMemo } from "react";
import { Button, Input } from "antd";
import { useTasksSearchParams } from "screens/kanban/util";
import { Row } from "components/lib";
import { UserSelect } from "components/user-select";
import { TaskTypeSelect } from "components/task-type";

export const SearchPanel = () => {
  const [searchParams, setSearchParams] = useTasksSearchParams();
  const reset = () =>
    setSearchParams({
      name: undefined,
      processorId: undefined,
      typeId: undefined,
    });

  return (
    <Row style={{ marginBottom: "2rem" }} gap={true}>
      <Input
        style={{ width: "20rem" }}
        placeholder={"任务名"}
        value={searchParams.name}
        onChange={(evt) =>
          setSearchParams({
            name: evt.target.value,
          })
        }
      />
      <UserSelect
        defaultOptionName={"经办人"}
        value={searchParams.processorId}
        onChange={(value) => {
          setSearchParams({ processorId: value });
        }}
      />
      <TaskTypeSelect
        defaultOptionName={"类型"}
        value={searchParams.typeId}
        onChange={(value) => setSearchParams({ typeId: value })}
      />
      <Button onClick={reset}>清除筛选器</Button>
    </Row>
  );
};
