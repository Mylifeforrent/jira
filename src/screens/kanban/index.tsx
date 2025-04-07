import React from "react";
import { useDocumentTitle } from "utils";
import {
  useKanbanSearchParams,
  useProjectInUrl,
  useTasksSearchParams,
} from "screens/kanban/util";
import { KanbanColumn } from "screens/kanban/kanban-column";
import styled from "@emotion/styled";
import { ScreenContainer } from "components/lib";
import { SearchPanel } from "screens/kanban/search-panel";
import { CreateKanban } from "screens/kanban/create-kanban";
import { useKanbans } from "utils/kanban";
import { TaskModal } from "screens/kanban/task-modal";
import { Spin } from "antd";
import { useTasks } from "utils/task";
import { DragDropContext, Droppable } from "react-beautiful-dnd";

export const KanbanScreen = () => {
  useDocumentTitle("看板列表");

  const { data: currentProject } = useProjectInUrl();
  const { data: kanbans, isLoading: kanbanIsLoading } = useKanbans(
    useKanbanSearchParams()
  );
  const { isLoading: taskIsLoading } = useTasks(useTasksSearchParams()[0]);
  const isLoading = taskIsLoading || kanbanIsLoading;

  return (
    <DragDropContext onDragEnd={() => {}}>
      <ScreenContainer>
        <h1>{currentProject?.name}看板</h1>
        <SearchPanel />
        {!isLoading ? (
          <ColumnsContainer>
            <Droppable
              droppableId={"kanban"}
              type={"COLUMN"}
              direction={"horizontal"}
            >
              {(provided) => (
                <div {...provided.droppableProps} ref={provided.innerRef}>
                  {kanbans?.map((kanban) => (
                    <KanbanColumn kanban={kanban} key={kanban.id} />
                  ))}
                </div>
              )}
              <CreateKanban />
            </Droppable>
          </ColumnsContainer>
        ) : (
          <Spin style={{ marginTop: "10rem" }} size={"large"} />
        )}
        <TaskModal />
      </ScreenContainer>
    </DragDropContext>
  );
};

const ColumnsContainer = styled.div`
  display: flex;
  flex: 1;
  overflow-x: scroll;
  margin-top: 2rem;
`;
