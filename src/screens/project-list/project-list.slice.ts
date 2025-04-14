import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AppDispatch, RootState } from "store";
import { Project } from "screens/project-list/list";
import { User } from "screens/project-list/search-panel";

interface State {
  projectModalOpen: boolean;
  projects: Project[];
  user: User | null;
}

const initialState: State = {
  projectModalOpen: false,
  projects: [],
  user: null,
};

export const projectListSlice = createSlice({
  name: "projectListSlice",
  initialState,
  reducers: {
    openProjectModal(state) {
      //之所以可以直接拿来state操作，而是因为底层采用了Immer，是封装了一下。给你返回的state是类似于一个影子。所以不会影响原本的state纯洁性
      state.projectModalOpen = true;
    },
    closeProjectModal(state) {
      state.projectModalOpen = false;
    },
    setProjectList(state, action: PayloadAction<Project[]>) {
      state.projects = action.payload;
    },
    setUser(state, action) {
      state.user = action.payload;
    },
  },
});

const { setProjectList } = projectListSlice.actions;

export const refreshProjects = (promise: Promise<Project[]>) => (
  dispatch: AppDispatch
) => {
  promise.then((projects) => dispatch(setProjectList(projects)));
};

export const projectListActions = projectListSlice.actions;

export const selectProjectModalOpen = (state: RootState) =>
  state.projectList.projectModalOpen;
