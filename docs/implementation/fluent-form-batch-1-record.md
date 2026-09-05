# 基础表单组件批次 01

- 日期：2026-09-05。
- 授权：Locke 要求先在共享 UI 仓库成批修改、统一验证后汇报；取得其批准后再通知 CPQ 02 接入。不得自行新建 CPQ worktree。
- 范围：Textarea、Select、Checkbox、RadioGroup、Radio、Switch 及对应 Props，保留既有组件；见 ADR-0005。
- 状态：整批实现及集中工程/有界浏览器检查完成，附限制提交评审；未批准应用接入或发布，不声明 CSP 零告警或完整 UI 设计完成。

## 方法与回退

不逐个向 CPQ 安装。以一个完整表单演示覆盖受控事件、只读/禁用/错误、两主题与 Dialog 组合；真实 tarball 安装在本仓库 `.tmp/` 下的测试目录，**不是 Git worktree**。Node 24 独立恢复两次构建，Node 22 token-only/既有 React/新批次 React 消费者集中检查，记录原始输出和源码快照。旧 f1bca649… 候选、CPQ 已用依赖及历史证据不覆盖。

只撤销本批导出、批次测试/fixture/工具扩展和文档增量即可回退；不整仓 reset，用户原有未提交文档仍保留。新增制品仍 private、0.0.0-development，必须以新的完整 SHA-256 区分，不得拿同名文件替换 CPQ 候选。

## 集中预检观察

首次源码 verify：lint/typecheck/build/CSS 通过；39 项测试中 38 PASS、1 FAIL。失败源于新增 SSR 测试按小写 readonly 字符串匹配，而 React 原始输出为 `readOnly=""`。已改为大小写不敏感的同一属性断言，未删除只读检查、修改组件实现或放宽编译器。此记录是工具输出摘要，不冒充事先落盘的原始日志。

## 最终集中结果

证据根目录：`.qualification/runs/fluent-form-batch-1/`。源码基于 HEAD `013807572adbdaebd4c2d26cfaca2ff97989bdfc` 加明确保存的未提交快照，不是已提交发行版资格验证。

| 检查 | 结果 |
| --- | --- |
| Node24.20.0/npm11.19.0 两次独立恢复 | 两次 verify 均39测试通过，类型/构建/CSS/边界通过 |
| 真实打包 | 9个许可文件，两份4105 bytes 的 tgz 完全一致 |
| Node22.22.0/npm10.9.4 消费 | token-only、既有React、新整批表单均通过；无重复React/DOM；Fluent9.74.7 |
| 类型问题 | 首次新fixture失败已保留；补CSS模块声明及类型安全callback ref后原锁文件复测通过，未降级工具链/放宽类型检查 |
| 浏览器 | 实际1440/1280/900/720无整页横向溢出；受控值、只读/禁用、ref焦点、单选方向键、复选/开关Space、显式提交与Dialog组合完成有界观察 |
| 主题和宿主干扰 | 明暗并存、弹窗保留浅主题；有界raw元素全局样式压力下，外部对照变化而内部代表控件保留样式 |
| 负向控制 | 未命名按钮被axe检出；保留域名的外连被CSP拦截；去掉style nonce许可导致应用样式被拦截 |
| 发布阻断 | 仍按预期拒绝发布；本轮未commit/push/publish，也未向CPQ安装新批次 |

新增候选 SHA-256：`7038a7e9f164b87e0036f2632e8384d27edc7b086267dbf2bc05c0facfec5590`。

`engineering-summary.json` 绑定制品/版本/锁文件/源码快照；`consumer-retest/overlay.json` 绑定新fixture修正；`browser-review.md` 区分自动日志与浏览器人工操作观察。最终校验清单为 `SHA256SUMS.txt`，封存后不继续写入该运行目录。

封存已完成：234 个证据文件按 SHA-256 回读一致。最后的脚本 lint 和 `git diff --check` 通过；Git 仅提示既有 LF/CRLF 转换，不是测试失败。两个审计服务已停止，浏览器测试标签已关闭并恢复默认视口。

## 查看整批演示

本轮启动地址：`http://127.0.0.1:57763/`（本机临时服务，本轮已在浏览器打开）。它是共享库表单演示，不是CPQ；不含业务API、保存或代理，且不会向已封存证据写入数据。

服务停止后可从仓库运行：`.tmp/node-24.20.0/node-v24.20.0-win-x64/node.exe scripts/preview-form-batch.mjs`，使用命令输出的新地址。预览启动时逐项校验实际生产资源哈希，保持nonce策略，不加入unsafe-inline。预览本身不增加技术验收结论。

## 实测体积与请求

同一既有React fixture用旧/新候选构建，JS均406018 bytes、CSS均204 bytes，完整哈希也一致，增量为0。新表单组合JS467091 bytes、CSS1102 bytes，本地gzip分别125134/513 bytes；它是不同页面组合，不能冒充CPQ迁移增量。包从3885增至4105 bytes（+220）。没有已批准体积预算，不虚构阈值。

本地服务记录初始JS/CSS和操作时请求；未观察到交互追加应用chunk或业务请求，只有审计/CSP遥测POST。axe及审计脚本不计入应用体积。记录的是服务端响应字节，不是完整浏览器网络捕获或压缩传输字节。

## 必须披露的限制

1. 自动扫描只报告两个Tabster sentinel的 `aria-hidden-focus`，范围与ADR-0004所述同类节点一致；不代表完整WCAG合规，不豁免真正焦点/误操作缺陷。
2. 开启nonce的正常页面仍有一条 `style-src-elem` 报告（line135/column93843、无source-file）。完全没有应用/脚本的plain控制页也复现相同报告，故不能直接认定为Fluent问题；具体来源未定。不关闭CSP、不加unsafe-inline，也不写为CSP完全通过。生产环境仍需自身响应nonce/renderer验证。
3. Fluent Textarea对象ref在当前严格类型配置下出现 `Ref<never>` 推断限制；callback ref已通过类型和真实focus。未隐藏/重造上游接口；必须使用对象ref的消费者另行核对。
4. 未执行真实OS输入法composition、屏幕阅读器、跨浏览器矩阵、真实业务API/生产CSP或品牌终稿验收。截图仅在工具输出中查看，没有另存PNG。
5. 这只是五类基础表单组件与已有组件的组合，不包含Table、复杂Combobox、导航、业务表单流程或整套UI完成声明。

## 下一道门

请 Locke 评审本整批实现和上述限制；只有获得批准才向 CPQ 02 下发明确接入范围，默认在 main 执行且不得自行新建worktree。共享技术检查不自动通过 CPQ 应用验收。当前 CPQ 仅旧搜索试点已合并清理，见 `cpq-fluent-main-integration-record.md`。
