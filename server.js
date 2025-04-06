import jsonServer from "json-server";
import bodyParser from "body-parser";
import customMiddleware from "./__json_server_mock__/middleware.js";

const server = jsonServer.create();
const router = jsonServer.router("__json_server_mock__/db.json");
const middlewares = jsonServer.defaults();

server.use(middlewares);
server.use(bodyParser.json()); // 添加 body-parser 中间件
server.use(customMiddleware);
server.use(router);
server.listen(3001, () => {
  console.log("JSON Server is running");
});

/**
 * CommonJS 和 ES 模块语法的主要区别如下：
 *
 * 1. **导入和导出语法**：
 *    - CommonJS 使用 `require` 导入模块，使用 `module.exports` 导出模块。
 *    - ES 模块使用 `import` 导入模块，使用 `export` 导出模块。
 *
 * 2. **加载方式**：
 *    - CommonJS 模块是同步加载的，适用于服务器端。
 *    - ES 模块是异步加载的，适用于浏览器端。
 *
 * 3. **文件扩展名**：
 *    - CommonJS 模块通常使用 `.js` 扩展名。
 *    - ES 模块可以使用 `.js` 或 `.mjs` 扩展名。
 *
 * 在你的 React 项目中，`server.js` 文件使用了 ES 模块语法：
 *
 * ```javascript
 * import jsonServer from "json-server";
 * import customMiddleware from "./__json_server_mock__/middleware.js";
 *
 * const server = jsonServer.create();
 * const router = jsonServer.router("__json_server_mock__/db.json");
 * const middlewares = jsonServer.defaults();
 *
 * server.use(middlewares);
 * server.use(customMiddleware);
 * server.use(router);
 * server.listen(3001, () => {
 *   console.log("JSON Server is running");
 * });
 * ```
 *
 * 而 `__json_server_mock__/middleware.js` 文件使用了 CommonJS 语法：
 *
 * ```javascript
 * module.exports = (req, res, next) => {
 *   if (req.method === "POST" && req.path === "/login") {
 *     if (req.body.username === "jack" && req.body.password === "123456") {
 *       return res.status(200).json({
 *         user: {
 *           token: "123",
 *         },
 *       });
 *     } else {
 *       return res.status(400).json({
 *         message: "用户名或密码错误",
 *       });
 *     }
 *   }
 *   next();
 * };
 * ```
 *
 * 在 React 项目中，通常使用 ES 模块语法，因为它是现代 JavaScript 的标准，并且与前端��具链（如 Webpack、Babel）更兼容。
 */

/**
 * `package.json` 中的 `"json-server"` 命令和 `server.js` 文件的区别如下：
 *
 * 1. **运行方式**：
 *    - `package.json` 中的 `"json-server"` 命令是通过命令行运行的脚本。你可以通过运行 `npm run json-server` 来启动 JSON Server。
 *    - `server.js` 文件是一个独立的 JavaScript 文件，你需要通过 `node server.js` 来运行它。
 *
 * 2. **配置方式**：
 *    - `package.json` 中的 `"json-server"` 命令直接在命令行参数中配置了 JSON Server 的选项，如 `--watch`、`--port`、`--middlewares` 和 `--no-cors`。
 *    - `server.js` 文件中通过代码的方式配置 JSON Server，使用 `jsonServer.create()`、`jsonServer.router()` 和 `server.use()` 等方法来设置中间件和路由。
 *
 * 3. **灵活性**：
 *    - `package.json` 中的 `"json-server"` 命令配置相对简单，适合快速启动和简单配置。
 *    - `server.js` 文件提供了更大的灵活性，可以在代码中进行复杂的逻辑处理和自定义配置。
 *
 * 总结来说，`package.json` 中的 `"json-server"` 命令适合简单的配置和快速启动，而 `server.js` 文件适合需要更多自定义逻辑和配置的场景。
 */
