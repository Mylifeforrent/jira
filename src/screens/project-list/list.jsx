import React from "react";
export const List = ({ list, users, userMap }) => {
  console.log("userMap ->", userMap);
  console.log("list ->", list);
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
