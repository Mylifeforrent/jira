import React from "react";
import { User } from "./search-panel";
interface Project {
  id: string;
  name: string;
  personId: string;
  pin: boolean;
  organization: string;
}
interface ListProps {
  list: Project[];
  users: User[];
  userMap: { [key: string]: User };
}
export const List = ({ list, users, userMap }: ListProps) => {
  // console.log("userMap ->", userMap);
  // console.log("list ->", list);
  return (
    <table>
      <thead>
        <tr>
          <th>名称</th>
          <th>负责人</th>
        </tr>
      </thead>
      <tbody>
        {list.map((item) => (
          <tr key={item.id}>
            <td>{item.name}</td>
            <td>{userMap[item.personId].name}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};
