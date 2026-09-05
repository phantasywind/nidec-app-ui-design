# CPQ 单搜索框 P2 实施申请

- 日期：2026-09-05。
- 状态：2026-09-05 Locke 已明确授权，由 CPQ UI 工作流建立独立工作树、安装指定候选及 Fluent 9.74.7，仅替换 Enquiries 搜索框并完成本地模拟验证。实施请求已成功发送给 `02 UI设计与前端实现`（019f5a94-d339-7972-a4a7-58d96bb1ce3b）；实施结果待回传。
- 已完成准备：[P1 执行说明](cpq-fluent-p1-execution-sheet.md)、[制品绑定](cpq-fluent-pilot-artifact.json)、[01 总控回传](cpq-fluent-p1-owner-response.md)。

## 请求一次批准的范围

由 CPQ `02 UI设计与前端实现` 在独立 worktree 执行一个 Enquiries 搜索框的本地技术试点：

- 从提交 `24d118f80a60ce16485a4890681ad5585f4da1ea` 创建 `codex/fluent-enquiries-pilot`，拟定目录 `D:\Documents\ChatGPT\worktrees\cpq-fluent-enquiries-pilot`。准备时该路径/分支尚不存在；开工再次检查，已有目标不得覆盖，必要时回报冲突。
- 使用绑定文件指定的 `.qualification/.../build-a/candidate.tgz` 受控副本，SHA-256 `f1bca649bcc2828635744c9e477301fc179272b514f6588eeb122f209c07b20a`。批准一次性隔离非生产 `file:` 安装例外及 Fluent 精确 9.74.7，保留 CPQ 既有依赖锁定结果；所需公开依赖恢复按权限使用 npm registry。
- 局部稳定 NidecProvider、官方 webLightTheme、共享 Input 接原 setQuery，保留 type=search、标签/占位、原防抖及请求策略。
- 本地静态 mock 查询验证，禁止真实 API 代理回落；真实业务登录、写入和部署仍另行授权。

## 文件边界

拟修改 `client/src/pages/EnquiriesPage.tsx`、`EnquiriesPage.test.tsx`、`client/package.json`、`client/package-lock.json`；新增局部 `EnquiriesSearchInput.tsx`、配套测试及必要局部 CSS，建议放 `client/src/pages/`。具体名字可由 02 在开工前确定并记录，范围不超过本页适配。

隔离 mock 启动入口/配置和数据放在专用 `client/fixtures/fluent-enquiries-pilot/` 或同等专用测试目录；不修改生产 `api.ts`、会话/权限合同、全局 DirectorySearch/Toolbar/barrel、全局样式或后端。需新增启动命令时仅使用明确命名的 pilot 命令，不改变 build:app 和正常 dev 默认行为。

公开包必须真实安装使用，禁止源码别名和 mock 掉共享 Input。mock 可以提供测试会话/确定性查询结果，但不得宣称验证了真实身份权限。拦截或拒绝所有业务写请求，出现未列入范围的网络请求时测试失败。

## 开工条件及退出

01 已确认隔离前端方向、提交基线和验证要求。02 P0 已确认切入点；P1 局部 CSS/适配方案的补充请求已送达，目前自动收取超时。收到后核对是否完全落在上述文件边界；若建议改全局 CSS、共享 API 或其他页面，超出本申请，需回报，不能借条件批准扩大范围。

实施前再次确认原工作区/隔离分支和文件占用。工具对外部路径写入需要的权限按系统审批处理，不绕过；创建工作树或将现有任务切到新工作树的实际操作由 CPQ 责任工作流执行。

旧实现先建立搜索合同测试，新实现复用同一矩阵；保留 generation 仅在新请求启动时更新。检查输入、清空、焦点、IME/粘贴、请求参数、分页、乱序成功/失败、loading/error、零误提交；不得顺带纠正旧版业务时序。真实浏览器测试保留 1440/1280/900/720 及 computed style/console/network 证据。

运行 focused/相关回归、串行完整 client、design-system:check、test:build-separation、build:app，核对唯一 React 及精确制品/lock。01 按回传执行 solution build；无后端变化不新增完整 PG suite。实际无法运行的测试记为未执行，不当作通过。

成果为本地待验收的代码差异和技术报告，回传 08 安排独立验收。不授权 push、merge、发布包/Release、公司服务器部署或 EPM 迁移；不自动授权真实 API 登录验收。真实只读 API 复验必须在合入 main 或扩大第二组件前另行完成。

## 回退

保留基线和失败证据。试点在独立工作树，主工作区不接受直接覆盖；仅撤销本包页面、适配、局部 CSS、fixture、manifest/lock/test 差异。已启动本地进程按本包记录关闭，不改变公司服务器。worktree/分支清理另行确认，避免丢失尚未交接的差异。

本申请的 P2 范围已获用户明确授权，无需重复确认。超出本包的应用改动、真实身份/API验收、集成或发布仍按原边界处理。
