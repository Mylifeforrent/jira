const middleware = (req, res, next) => {
  console.log("Middleware is called, req path:", req.path);
  console.log("Middleware is called, req method:", req.method);
  console.log("middleware req body:", req.body);
  if (req.method === "POST" && req.path === "/login") {
    console.log("Login request received");
    if (req.body.username === "jack" && req.body.password === "123456") {
      return res.status(200).json({
        user: {
          token: "123",
        },
      });
    } else {
      return res.status(400).json({
        message: "用户名或密码错误",
      });
    }
  }
  next();
};

export default middleware;

/**
 * `middleware.js` 中的 `console.log` 语句不会在 Chrome 浏览器的开发者控制台中打印日志，因为它们是在服务器端运行的，而不是在客户端运行的。`console.log` 语句会在运行服务器的终端或命令行中打印日志。
 *
 * 要查看这些日志，请检查你运行 JSON Server 的终端或命令行窗口。你应该能在其中看到 `console.log` 打印的日志。
 */
