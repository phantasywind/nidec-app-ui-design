# CPQ Fluent P2 实施回传与证据归并

- 日期：2026-09-05。
- 来源：`02 UI设计与前端实现`（019f5a94-d339-7972-a4a7-58d96bb1ce3b）的正式实施回传。
- 状态：责任任务报告独立工作树实施及自动化/静态浏览器验证完成；来源已核对代码边界、lock 及 15 个文件的身份。已确认 UI 原始输出只保存在任务工具历史中，未另行落盘；体积增量未测。尚未关闭完整 P2 证据门，不等于集成、品牌、独立应用验收或 Production 批准。
- 历史安装失败与权限暂停保留在 [执行跟踪](cpq-fluent-p2-execution-record.md)，不被本记录覆盖。02 已补充确认收到本任务中用户直接授权继续该独立工作树，并替代此前只读限制；授权记录在其会话中，没有单独落盘。来源未绕过权限层。

## 来源本轮只读核对

- 试点目录：`D:\Documents\ChatGPT\worktrees\cpq-fluent-enquiries-pilot`；分支与基线沿用执行跟踪。
- 主 CPQ 工作区 `D:\Documents\Nidec Elevator CPQ` 的 `git status --short` 为空。
- EnquiriesPage 差异仅移除 DirectorySearch 导入、引入本页适配器并替换唯一搜索槽；原防抖/查询/generation 逻辑未改。
- 局部适配器使用真实共享 Input、显式 official webLightTheme、受控 value 和 Fluent data.value 回传；CSS 仅局部类。
- fixture 已对齐页面在全局样式之前的导入顺序；新增同源 GET allowlist、Request.method 检查和 blocked 记录；横幅明确不是 Nidec 品牌验收设计。没有 API proxy。
- 源码存在 249ms 不触发、再推进 1ms 触发的专门测试；这次只读检查不等于重新执行该测试。
- lock SHA-256 仍为 `05d6d60900c1b2aea64954428ceeecd7e6eb6e97ee7c8562bc223db43b900e22`，与暂停快照及正式回传一致。Fluent 精确 9.74.7、共享包 file tarball 不变。
- 所有本次 CPQ 变更仍未提交；主线集成、推送、发布及部署不在当前授权范围。
- 最终 15 项源码/制品的来源只读 snapshot 见 [文件身份记录](cpq-fluent-p2-source-snapshot.json)。14 项与回传完全一致；EnquiriesSearchInput.test.tsx 回传 SHA-256 少末尾 `05`（只有 62 位），本记录使用实际读回的完整 64 位 hash 并保留差异，不误报 15 项全部匹配。该 snapshot 不伪装为先前执行时生成的日志。

## 责任任务报告的执行结果

下表来自 02 正式回传，不是来源任务独立重跑。

| 检查 | 回传结果 |
| --- | --- |
| 旧搜索合同 | 1 file / 8 tests PASS |
| 最终 focused | 3 files / 12 tests PASS：页面 9、真实共享 Input 1、静态网络保护 2 |
| 串行完整 client src | 76 files / 452 tests PASS |
| 全发现式 Vitest | 77 files / 454 Vitest tests PASS，但误收集 node:test 文件导致 No test suite，命令 exit 1；不能写成该命令通过 |
| build-separation 权威独立入口 | 3/3 PASS |
| 相邻 EnquiryWorkspacePage | 首轮全负载出现一次 5 秒时序失败；隔离复跑 6 tests PASS，第二轮完整 src 通过；保留不稳定现象，不判定已修复 |
| design-system:check | PASS，19 representative pages；3 frozen / 26 governed / 0 candidate / 0 partial / 0 legacy |
| build:app | PASS，NIDEC_CPQ_APP_BUILD_OK；仍有 >500k chunk warning，无体积预算判定 |
| fixture build | PASS；生成输出已清理 |
| 依赖解析 | npm ls 报告共享包 0.0.0-development、Fluent 9.74.7、React/ReactDOM 唯一顶层 19.2.7；物理路径验证记录待定位 |
| solution build | 01 已提供可定位且 hash 验证的日志，0 errors / 65 warnings；见执行跟踪 |

02 报告浏览器实测 1440/1280/900/720，无整页溢出；720 时搜索框约 682.33 × 37px，表格在自身容器横向滚动。door 查询参数及过滤结果正确，焦点保持，dialog=0；中文“电梯”粘贴编码正确，键盘清空恢复列表，Enter 不触发弹窗或写请求。稳定标签 console 无 error/warning；测试标签、viewport override、dev server 已清理。

## 尚不能由上述结果推出的结论

- 真实中文输入法 composition/候选提交并未由“Unicode 粘贴通过”证明，仍须明确执行状态。
- 本地 Vite 响应没有 CSP，只能描述该环境；不证明部署 CSP 或 nonce 方案兼容。
- 默认全发现式测试命令确实 exit 1。分开执行两类测试并通过是分项证据，不是原入口已修复。
- 构建成功及 chunk warning 不是初始加载/交互资源增量报告；没有实测增量数字时不能填写体积通过。
- 静态 fixture 不验证真实身份、RBAC、业务 API、服务器或数据库，也不等于独立应用验收。
- official webLightTheme 只用于技术适配，不是完成的 Nidec 品牌视觉设计。

## 证据缺口与下一步

02 的只读补充已确认：磁盘原始执行日志只有两个 solution-gate 文件；focused/full-src/build/design-system/build-separation stdout 没有重定向保存，浏览器 CUA 输出没有保存 PNG/HAR。中途 HMR 标签有一次 createRoot 开发日志，责任任务报告弃用该标签并在稳定新标签重新取证为 console 0；不得隐去失败尝试或伪造截图文件。

当前来源状态是“责任任务工具输出回传 + 来源文件身份核对”，不是独立重跑；任务工具输出目前未由来源完整读回。尚缺可持久追溯的 UI 日志/浏览器记录、物理解析证据及真实 IME 执行状态，完整 P2 证据要求仍未闭合。

来源已读回当前 dist-app 最终文件体积：index.html 378 bytes，JS 1,245,099 bytes，CSS 197,526 bytes，dark/light logo 分别 90,109 / 89,925 bytes。02 没有保存相同基线/工具链的适配前产物，也没有捕获传输字节；故 build-size delta 和 network transfer-size delta 均为 **NOT MEASURED**。不能用主工作区可能陈旧的 ignored 产物反推增量，不能以最终文件大小代替增量验证。

查询、Unicode 粘贴和清空只有静态 mock 请求文本，无真实请求/响应字节记录。这些内容支持 mock 合同行为报告，不支持真实 API 或网络资源增量结论。

先补齐可追溯证据与未执行项说明，再决定是否接受本地技术试点和安排独立验收。此归档不自动派发整改、合入 main、扩大组件范围、真实 API 验证、发布或 EPM 接入。
