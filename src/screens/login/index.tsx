import React from "react";
import qs from "qs";
import { cleanObject } from "../../utils";

// interface Base {
//   id: number;
// }
// interface Advance extends Base {
//   name: string;
// }
//
// const test = (p: Base) =>{
//   console.log(p);
// };
// //鸭子类型，面向接口编程，不是面向对象编程。只要你传过来的包含有id，就代表满足了我的要求。 就可以了。 注意这里和java的区别
// const a = {id:1,name:'jack'}
// test(a);

const apiUrl = process.env.REACT_APP_API_URL;

export const LoginScreen = () => {
  const login = (param: { username: string; password: string }) => {
    // 这里可以调用登录接口
    let url = `${apiUrl}/login`;
    fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(param),
    }).then(async (res) => {
      if (res.ok) {
        const data = await res.json();
      }
    });
  };

  //HTMLFormElement extends Element
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault(); // 阻止默认的表单提交行为
    const username = (event?.currentTarget?.elements[0] as HTMLInputElement)
      .value;
    const password = (event?.currentTarget?.elements[1] as HTMLInputElement)
      .value;
    console.log("用户名:", username);
    console.log("密码:", password);
    login({ username, password });
  };
  return (
    <div>
      <h2>登录</h2>
      <form onSubmit={handleSubmit}>
        <div>
          {/*htmlFor 属性用于在 label 元素中指定与之关联的表单控件的
          id。当用户点击 label 元素时，浏览器会自动将焦点移到与 htmlFor
          属性值匹配的表单控件上，从而提高用户体验。*/}
          <label htmlFor="username">用户名：</label>
          <input type="text" id="username" />
        </div>
        <div>
          <label htmlFor="password">密码：</label>
          <input type="password" id="password" />
        </div>
        <button type="submit">登录</button>
      </form>
    </div>
  );
};
