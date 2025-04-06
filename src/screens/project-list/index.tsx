import { useEffect, useState } from "react";
import React from "react";
import { cleanObject, useDebounce, useMount } from "../../utils";
import qs from "qs";
import { SearchPanel } from "./search-panel";
import { List } from "./list";

const apiUrl = process.env.REACT_APP_API_URL;

export const ProjectListScreen = () => {
  const [param, setParam] = useState({
    name: "",
    personId: "",
  });
  const [list, setList] = useState([]);
  const [users, setUsers] = useState([]);
  const [userMap, setUserMap] = useState({});
  const deboundedValue = useDebounce(param, 200);

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

        const userMap = data.reduce((acc: any, user: any) => {
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
