import React from "react";

//用来检查为啥页面无限渲染的问题很有用
if (process.env.NODE_ENV === "development") {
  const whyDidYouRender = require("@welldone-software/why-did-you-render");
  whyDidYouRender(React, {
    //是不是跟踪所有的函数组建
    trackAllPureComponents: false,
  });
}
