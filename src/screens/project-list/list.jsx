import React from "react";
export const List = ({ list, users }) => {
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
            <td>{users.filter((user) => user.id === item.id)?.name}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};
