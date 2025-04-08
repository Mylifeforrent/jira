/** @jsx jsx */
import {jsx} from '@emotion/react'
import React from "react";
import { Form, Input } from "antd";
import { UserSelect } from "components/user-select";
import { Project } from "types/project";
import { User } from "types/user";

interface SearchPanelProps {
  users: User[];
  param: Partial<Pick<Project, "name" | "personId">>;
  setParam: (param: SearchPanelProps["param"]) => void;
}

export const SearchPanel = ({ users, param, setParam }: SearchPanelProps) => {
  return (
    // <Form style={{ marginBottom: "2rem" }} layout={"inline"}>
    //可以尝试使用emotion的行内样式，而不是react自带的行内样式，就可以支持伪类，子元素选择之类的高级特性
    //这里会报错，因为需要指定本文件的编译器,最顶部位置添加如下
    // /** @jsx jsx */
    // import {jsx} from '@emotion/react'

    <Form css={{ marginBottom: "2rem"}} layout={"inline"}>
      <Form.Item>
        {/*setParam(Object.assign({}, param, {name:evt.target.value}))*/}
        <Input
          placeholder={"项目名"}
          type="text"
          value={param.name}
          onChange={(evt) =>
            setParam({
              ...param,
              name: evt.target.value,
            })
          }
        />
      </Form.Item>
      <Form.Item>
        <UserSelect
          defaultOptionName={"负责人"}
          value={param.personId}
          onChange={(value) =>
            setParam({
              ...param,
              personId: value,
            })
          }
        />
      </Form.Item>
    </Form>
  );
};
