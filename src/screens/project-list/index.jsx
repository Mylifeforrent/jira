import { SearchPanel } from "./search-panel.jsx";
import { List } from "./list.jsx";
import { useEffect, useState } from "react";
import React from "react";
import { cleanObject, useDebounce, useMount } from "../../utils/index.js";
import qs from "qs";

const apiUrl = process.env.REACT_APP_API_URL;

export const ProjectListScreen = () => {
  const [param, setParam] = useState({
    name: "",
    personId: "",
  });
  const [list, setList] = useState([]);
  const [users, setUsers] = useState([]);
  const [userMap, setUserMap] = useState({});
  const deboundedValue = useDebounce(param, 500);

  useEffect(() => {
    let url = `${apiUrl}/projects?${qs.stringify(cleanObject(deboundedValue))}`;
    console.log("url is :", url);
    fetch(url).then(async (res) => {
      if (res.ok) {
        const data = await res.json();
        setList(data);
      }
    });
  }, [deboundedValue]);

  useMount(() => {
    fetch(`${apiUrl}/users`).then(async (res) => {
      if (res.ok) {
        const data = await res.json();
        console.log("apiurl:", apiUrl, "initialized users:", data);
        setUsers(data);

        const userMap = data.reduce((acc, user) => {
          acc[user.id] = user;
          return acc;
        }, {});
        console.log("userMap:", userMap);
        setUserMap(userMap);
      }
    });
  });

  return (
    <div>
      <SearchPanel param={param} setParam={setParam} users={users} />
      <List list={list} users={users} userMap={userMap} />
    </div>
  );
};
