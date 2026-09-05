# CPQ P1 总控回传

- 收到日期：2026-09-05；来源：`01 全局开发与项目总控`通过任务消息直接回传。
- 本文是结构化归档；P1 PLAN ONLY，不是 P2 授权。

01 确认 main/HEAD 为 `24d118f80a60ce16485a4890681ad5585f4da1ea`，工作树干净，只有原主工作树。目标 client 文件 tracked 且相对 HEAD 无差异；可安排独占，实施前由 02 列明精确文件。candidate.tgz 哈希与共享库一致，CPQ 已解析 React/React DOM 19.2.7，未安装 Fluent。

01 建议从该精确提交创建命名分支 `codex/fluent-enquiries-pilot` 的独立 worktree，将 02 工作绑定到它；不直接改 main。候选副本在 P2 获批后才安装。试点接受后的集成仍需按 CPQ 协议审查。

01 支持首包本地隔离前端 + 确定性静态 mock GET，验证现有 Enquiries 页面的搜索语义；保留 250ms 防抖、trim、编码、页码/scope/sort/pageSize 以及 generation 仅新请求启动才递增的行为。mock 记录请求 URL/时序，不替代共享 Input。真实只读 API 验收应在首包通过后、扩大第二个 Fluent 控件或合入 main 前完成。登录、公司服务器、业务写入不由 P1 自动授权。

CSP 源码检查：本地 Vite dev 配置、ASP.NET App 静态/index 响应没有配置 CSP；已知报价 HTML 的 CSP 属于另一个响应链路。实际浏览器/代理响应头未验证，不能推出运行环境无 CSP。搜索输入无需服务端报价 HTML/PDF renderer 验证；Fluent Griffel 的浏览器动态样式仍需实际验证。

01 建议的最小门禁：旧/新共同搜索合同、局部适配 focused tests、client 回归、build-separation、design-system:check、build:app、依赖及 lock 身份与唯一 React、浏览器 desktop/reduced-width、computed style/清空/IME/焦点/零误提交/console/network；01 执行 `dotnet build NidecElevatorCpq.sln --no-restore`。首包无后端合同变化，不要求为了搜索替换运行完整 PG/后端 suite；若真实 API 复验发现合同问题则另行分诊。

给 08 的交接应含精确 commit/worktree、制品/lock、变更文件、测试结果、mock 限制、真实 GET 复验路径、零业务写入和回退点。08 可先独立验收 mock 技术包，最终 CPQ 集成接受仍需真实只读 API。

01 明确剩余用户决定集中为一次 P2 授权：建立上述隔离 worktree、安装确切离线候选及 Fluent 9.74.7、官方浅色技术主题、02 局部文件修改。真实 API 验收另行授权。这与已有 P1 继续指令不同，不重复询问技术路线或已接受告警。
