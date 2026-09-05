# CPQ P0 回传归档与 P1 建议

- 日期：2026-09-04
- 来源：Locke 在本任务手动粘贴 `02 UI设计与前端实现` 的 P0 最终回复。本记录为结构化归档，不是逐字副本；没有重新执行目标任务的全部检查。
- 状态：P0 READ-ONLY ASSESSMENT COMPLETE / P1 INPUTS PENDING / NO IMPLEMENTATION。

2026-09-05 更新：Locke 已要求继续至真正需确认的问题；已沿用本建议推进 P1 制品校验和 01/02 只读协调。见 [P1 执行说明](cpq-fluent-p1-execution-sheet.md)。下文“待批准”是当时提案状态，不再要求重复批准 P1 方案协调；P2 应用安装/改动仍需明确授权。
- 结论：单个 Enquiries 搜索框适合作为候选；当前没有安装或实施条件。收到回传不等于批准 P1/P2。

## 已收取的 P0 事实与建议

1. CPQ 回传 HEAD 为 `e481cd0051265e2e5517f7f6de09da1a9e16a37e`、main。目标页面、manifest/lock 与 HEAD 一致，client 无已跟踪修改；全仓有 Quote Revision 相关 API/Domain/后端测试及未跟踪记录等并行改动。实施时必须重新确认占用与基线，不整仓回退。
2. 候选为 EnquiriesPage 唯一搜索槽。建议局部 `EnquiriesSearchInput` 适配器内使用 NidecProvider + 共享 Input，保持实例/主题稳定；保留 type=search、aria-label、placeholder，用 Fluent data.value 接原 setQuery。不引入 form、不包整页、不改创建 Sheet、全局 DirectorySearch/Toolbar/barrel，不把旧 `.ds-input` 类强加到 Fluent 根节点。
3. 现有 DirectorySearch 只是原 Input 的 type=search 包装，无自定义搜索图标/清空按钮。原生清空、输入法和视觉一致性要在浏览器验证。
4. 保留原防抖/trim/编码/页码/scope/sort/pageSize/generation 行为。特别是 generation 在新请求启动时递增，不是每次按键递增。旧请求在下一次防抖请求启动前返回的行为需按旧版记录，不能借迁移修改策略。
5. 当前页面有三项测试，覆盖初始查询/切换、模拟创建/Owner、布局/视图/数量。新增搜索合同测试应先在旧实现建立，再在新实现重跑，不能 mock 掉实际共享 Input。建议补齐防抖边界、清空/编码、分页、请求乱序成功/失败、焦点和零误提交。
6. 未来验证需要 focused/相关回归、serialized full client、design-system:check、test:build-separation、build:app；solution 门禁由 01 安排。本次回传未运行这些检查，不产生新 PASS。
7. CPQ 全局 CSS 会匹配 Fluent 内部 input，局部 Provider 不是 CSS 隔离边界。默认/hover/focus/disabled、内外高度及清空状态要看 computed style；若需要全局 CSS 修改，超出首包范围，必须先回报。
8. 主题建议为隔离非生产的官方浅色主题，明确不是品牌验收稿；若要求 CPQ 品牌映射，先确认。nginx/index.html 未配置 CSP 不代表部署没有 CSP；报价 HTML 的后端 CSP 不是 Enquiries 宿主 CSP。实际响应头、代理、nonce 和运行结果仍未知。
9. 回退只涉及本包页面适配、局部主题/样式、manifest/lock、测试/UI 记录；保留 Quote 并行工作和失败证据，部署另走授权流程。

回传声明未安装、构建、修改文件、登录、访问业务数据或通知其他任务。这里按来源声明归档，不将其描述为本任务独立审计了所有操作。

## 制品差异：本任务已独立复核

| 共享库相对路径 | 实测 SHA-256 | 处置 |
| --- | --- | --- |
| `.qualification/runs/fluent-adaptation/build-a/candidate.tgz` | `f1bca649bcc2828635744c9e477301fc179272b514f6588eeb122f209c07b20a` | 已验证历史候选 |
| `.qualification/runs/fluent-adaptation/build-b/candidate.tgz` | `f1bca649bcc2828635744c9e477301fc179272b514f6588eeb122f209c07b20a` | 与 build-a 字节哈希一致 |
| `.pack/phantasywind-nidec-app-ui-design-0.0.0-development.tgz` | `fe21b63b79b4a757fc1d7c8a37ed3245379d3ca5018260191a85f1220966585e` | 不属于该候选；不得用于此试点 |

同版本文件名不足以证明制品身份。没有分析差异原因，不把差异直接定性为损坏；未删除、覆盖、移动或重打包任何制品。即使有人再次运行 npm pack，也不能取最新 `.pack` 文件代替指定候选。

## P1 推荐方案（待批准，不执行安装）

建议本次不发布正式包，先为一个隔离非生产试点申请 **受控离线候选制品例外**。这只是拟议的试点路径，未改变 ADR-0001 正常 GitHub Packages + Release 分发规则。

| 决策项 | 建议冻结的选择 | 当前状态 |
| --- | --- | --- |
| 制品 | 仅上述 build-a/candidate.tgz，包内版本 0.0.0-development + 完整 SHA-256 作为共同身份；源为既有冻结快照，不冒充干净发布提交 | 待批准离线试点例外；不重打包、不改版本 |
| 保存/转交 | 原件保留在资格验证目录；未来若获安装授权，复制到批准的隔离试点制品目录前后验 SHA，并将准确 file 路径/版本/integrity 固定到 manifest/lock | 当前不复制、不安装、不更改 lock |
| 依赖 | Fluent 精确 9.74.7，保留 CPQ 原 React/React DOM/Vite/TypeScript 锁定结果；只允许经核对的新增依赖变化 | 安装后的依赖差异和单一 React 解析属 P2 验证 |
| 主题 | 局部稳定 Provider + 官方 webLightTheme，仅限隔离非生产验证；不导入 scaffold token 当品牌数据 | 待确认宿主适配，不另造品牌主题 |
| 环境 | 由 CPQ 01/02 指定可回退、不会与共享工作区并发冲突的本地/隔离非生产位置；不直接使用公司服务器或 Production | 确切位置及基线未提供，不创建 worktree 或副本 |
| CSP | 先确认该目标环境的真实页面响应策略及 renderer 需求；不能拿报价响应或仅源码配置替代 | 未验证；若需服务器/nonce 变更，由 01 另拟方案 |
| 行为验收 | 旧搜索合同先固定；迁移后逐项对照输入、请求、状态和零业务写入，08 独立验收 | P2/P3 条件，不在本轮执行 |

受控离线提案的好处是沿用已有证据，不为一个试点提前发布开发包；代价是只能在指定隔离试点使用，不能分发给正常应用或替代正式版本。若不接受这个临时例外，则走正式版本/主题与发布资格流程，不擅自改用 `.pack`、源码别名或浮动依赖。

P1 批准的含义仅是确认候选路径并允许向 01/02/08 做只读协调，补齐环境、CSP、文件占用和验收责任；不包括安装、写测试、改代码、启动/部署环境或访问业务数据。不能把“P1 方案通过”转写成“P2 IMPLEMENTATION AUTHORIZED”。

## 下一步与责任

建议请 Locke 批准 P1 按上述受控离线候选方向做方案确认；随后按 CPQ 协议取得 01 的基线/环境协调、02 的局部样式方案及 08 的验收范围。来源任务归并一次结果，避免多个任务反复询问同一已决事项。此次没有向其他任务发送消息。

只有目标环境/CSP/文件占用明确、确切制品身份和安装方案获准、旧行为对照计划可执行之后，才提交单独 P2 实施申请。实际交互缺陷、搜索错误、误提交、正常 build/API 类型失败仍阻断；ADR-0004 不覆盖这些问题。

本轮仅增加归档/建议文档和状态更新；可定向撤回文档更新，保留原始消息、P0 历史及既有制品。不执行运行时代码回退。
