# CPQ Fluent P1 制品与宿主执行说明

- 日期：2026-09-05。
- 授权：Locke 要求“请继续，直到遇到需要我确认的问题才停下”，沿用上一轮受控离线候选方向推进 P1 准备及责任任务协调，无需重复确认 P0 或技术路线。
- 当前：制品准备和安装前校验完成；[01 总控回传](cpq-fluent-p1-owner-response.md)已收取，确认隔离本地 mock 技术包与具体基线；02 局部方案回复待收取。P2 应用安装/改动仍未授权。

## 已固定的制品

[机器可读记录](cpq-fluent-pilot-artifact.json) 给出源路径、镜像、大小、SHA-256 和 npm SHA-512 integrity。只使用：

`D:\Documents\ChatGPT\GitHub Nidec App UI Design\.qualification\runs\fluent-adaptation\build-a\candidate.tgz`

- 包：`@phantasywind/nidec-app-ui-design@0.0.0-development`。
- SHA-256：`f1bca649bcc2828635744c9e477301fc179272b514f6588eeb122f209c07b20a`。
- 3,885 字节，9 个允许文件；build-b 镜像一致。
- Fluent 精确版本：9.74.7。
- 仅作为指定隔离非生产试点的候选身份，正常分发仍执行 GitHub Packages + Release 规则。此开发版本不转换成正式发布版本。

新增 `scripts/verify-cpq-fluent-pilot.mjs`，默认只读校验候选及镜像、资格清单、包身份、文件内容清单、SHA-256 和 npm integrity；不安装、解压或重打包。它同时在内存中改动一个字节验证拒绝路径，并拒绝当前 `.pack` 下的错误候选。

从共享 UI 仓库根运行：

```powershell
& '.tmp/node-24.20.0/node-v24.20.0-win-x64/node.exe' scripts/verify-cpq-fluent-pilot.mjs
```

可将一个明确的 `.tgz` 路径作为参数验证未来拷贝，默认源文件不会被替换。`--record` 仅供首次建立独立证据目录，本轮已执行；不可重复覆盖。

本轮验证结果：正确候选通过、模拟损坏候选拒绝、错误 `.pack` 候选拒绝；lint 通过。原始结果、绑定记录、执行脚本和依赖的包检查脚本保留在 `.qualification/runs/cpq-fluent-p1-preflight/`，4 个文件均已校验读回。它们是本轮本地忽略证据，正式代码提交不自动包含原始制品。

## 基线更新

本任务 2026-09-05 只读检查 CPQ 得到 HEAD `24d118f80a60ce16485a4890681ad5585f4da1ea`，status --short 为空。相比 P0 提交 `e481cd0051265e2e5517f7f6de09da1a9e16a37e`，`client/` 无提交差异。

因此 P0 的 client 源码评估仍可用，但旧提交号不能直接当作新的全仓验收基线。干净状态是当时观察，不能替代文件占用确认。本轮未创建 CPQ 工作树、复制应用或更改其 Git 配置。

## P2 安装顺序（准备说明，尚未执行）

1. 01/02 确认隔离目录、精确基线和文件占用；保留原 client manifest/lock 及旧行为测试结果。不要在主工作区直接修改。
2. 用上述校验器确认原件；将确切候选复制到隔离试点下固定 `artifacts/` 位置，再校验副本。拟定相对结构为 `artifacts/nidec-ui-f1bca649.tgz` 与 `client/` 并列，最终由责任工作流确认可回退目录。
3. 只新增 shared package 的固定 `file:../artifacts/nidec-ui-f1bca649.tgz` 与 Fluent 精确 `9.74.7`。原 React/Vite/TypeScript 等 manifest 策略不趁机整治；保存 lock 差异，所有既有依赖 version/resolved/integrity 漂移须解释并先停下处理，不接受 npm 自动重解锁造成的隐含升级。
4. 在新锁中验证包内版本、固定 file 引用、SHA-512 integrity；重新恢复消费者、核对安装文件和单一物理 React 解析。file 引用只在获准隔离试点生效，不并入正式应用分发合同。
5. 先建立旧搜索合同测试，再接局部适配器，并复跑同一合同和实际共享 Input 测试。局部样式只能限定到该适配器；需要改全局 CSS 或共享公共 API 时回报。
6. 验证 build:app、design-system:check、test:build-separation、focused/相关回归/串行完整 client；solution 门禁按 01 安排。记录实际 Node/npm、锁、源和制品哈希。

“离线制品”只指共享 `.tgz` 的传递方式，不保证 Fluent 的传递依赖已经在 CPQ 缓存中；依赖恢复可能仍需访问批准的 npm registry。不得承诺完全断网安装。

## 最小宿主方案及未决项

初包建议在隔离本地前端使用静态模拟 GET 查询结果，明确标记测试数据。它用于验证输入、查询时序、样式、焦点及阻止意外写请求。真实 CPQ 登录、权限、API 和公司服务器部署另属后续应用验收，模拟结果不能替代这些结论。

本次已查看 CPQ `vite.app.config.ts`，其默认 5173 与 `/api` 代理会指向现有后端；隔离测试不可不经核对直接使用该默认配置。责任任务须确定独立回环端口、关闭或隔离真实 API 代理、固定模拟结果并拦截未列入范围的请求。实际启动会产生进程/构建环境，仍在 P2 之后执行。

使用稳定的局部 NidecProvider + webLightTheme + Input；Provider 不隔离全局 CSS。实际 input 的 min-height、padding、border、hover/focus 和外层尺寸需具体对照。主题不导入 scaffold tokens，不自行创造品牌映射。

目标宿主响应头/CSP 仍须在选定环境建立后测量。没有 CSP 的本地测试只能证明该本地配置的结果，不证明公司服务器兼容。若采用额外 nonce 测试响应，应明确是专项测试配置；不得把它写成现网 CSP 已验证。

## 跨任务协调状态

已发送 PLAN ONLY：

- `01 全局开发与项目总控`（019f5479-239d-7383-bf0b-b31805149cbc）：确认基线、隔离环境、CSP、solution 门禁和 08 交接。
- `02 UI设计与前端实现`（019f5a94-d339-7972-a4a7-58d96bb1ce3b）：补齐具体适配文件、局部 CSS 方案和旧行为合同测试顺序。

两次发送均成功返回目标 ID。状态查询曾返回“找不到可读取任务”，直接读取亦超时；随后 01 已通过任务消息主动回传，详见归档。02 结果尚待收取。未重复派发，未向 08 直接派验收；待归并方案后按 CPQ 协议处理。

若产品无法读取已发送任务的回复，需恢复任务可读状态或由用户转交最终回复。这是收取外部责任意见的障碍，不应改写为用户尚未批准 P1。

## 安装授权所需的一次具体确认

收到 01/02 的目录/基线及局部方案后，整合精确文件范围、环境和测试，提交一个 P2 实施申请。P2 将修改 CPQ 应用，仓库 AGENTS.md 明确要求此类动作获得针对性授权；此前技术路线及 P1 继续指令不能代替这个应用改动授权。

在此之前本仓库可做的制品校验、文档和协调均已推进。实际占用或 CSP 资料未知时保留未知，不制造签字或验收状态。回退本轮只需定向撤回新增绑定、校验器和说明；已发消息及证据保留，并行 CPQ 工作不受影响。
