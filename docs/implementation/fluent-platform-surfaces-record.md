# Fluent 数据、反馈、工作区与导航能力记录

状态：SHARED TECHNICAL CANDIDATE QUALIFIED / SHARED BROWSER CONSUMER VERIFIED / APPLICATION ACCEPTANCE PENDING / NOT RELEASED。

## 2026-09-07 并行收口授权

Locke确认不再接受逐页面“蚂蚁搬家”式推进：既有CPQ 02在唯一`main`上并行清理已经成熟的表单、操作、目录与弹层组件族；共享仓库同时补齐阶段4数据展示/反馈和阶段5工作区/导航能力。双方完成后统一处理实际缺口。该授权不允许新建CPQ worktree/branch、修改业务/API/RBAC、commit、push、发布或部署。

## 本共享批次边界

本批有限转导出Fluent 9.74.7的稳定组合接口：语义Table和DataGrid、Card、Badge、Skeleton/Progress、Breadcrumb、Toolbar、Nav、Tree和Accordion。Nidec继续负责显式主题和准入规范；消费者负责列定义、排序选择、状态含义、路由、权限过滤、业务动作和响应式组合。

不把CPQ的BusinessTable、StatusBadge映射、Empty/Error文案、工程层级、Shell路由和权限规则复制进共享包；不整库转导出，不使用`unstable`子路径，不增加Dark Mode。上游能力存在不代表每个CPQ旧组件可机械一对一替换。

## 资格结果（2026-09-07）

- 固定候选：`.qualification/runs/fluent-platform-surfaces-1/build-a/candidate.tgz`。
- SHA-256：`65b9b2d4f557995e63f122f95b0037f4aa6b30cf401d0c361c99a467933e5998`；字节数：`7042`。
- 两次独立离线恢复、完整验证与打包所得归档逐字节一致；共享验证为13个测试文件、63项测试通过，类型检查、构建、边界、CSS及颜色检查通过。
- Node 22.22.0真实tgz消费者验证通过：纯token消费者不安装React/Fluent；现有React/Vite消费者与新增平台表面消费者均锁定单一React/React DOM 19.2.7和Fluent 9.74.7，并通过类型检查及生产构建。
- 新增平台表面消费者JS为521116字节，Vite报告超过500 kB的分块提醒。该提示不是功能失败，也没有通过提高阈值隐藏；应用应按实际路由和功能边界评估代码分割。
- 封存后逐项回读238个证据文件通过；资格根目录为`.qualification/runs/fluent-platform-surfaces-1`。

## 浏览器补证（2026-09-07）

- 第一次浏览器运行`browser-1`绑定原封存消费者输出，严格nonce CSP下功能加载但Fluent动态样式被应用脚本来源的`style-src-elem`报告拦截；页面实际呈现为原生控件。该失败保留，证明Node构建通过不能替代浏览器/CSP验证。
- 原因是新增平台fixture遗漏了其他Fluent消费者已经采用的`RendererProvider/createDOMRenderer`响应nonce接入，不是候选tgz接口或主题值失败。fixture补齐后以同一候选在Node 22.22.0重新通过类型检查和生产构建；包SHA仍为`65b9b2d4…e5998`，新JS为522333字节、SHA-256为`2f5e1cb5…cf985`，500 kB分块提醒仍保留。
- `browser-2`在Codex in-app browser实际观察1440×900、1280×900、900×900、720×900。四个视口均无横向溢出；720宽导航按fixture规则转为单列。Fluent主题、Card elevation、Badge、进度、Skeleton、表格和导航外观实际生效。
- 导航Status点击后`aria-current="page"`；Accordion鼠标折叠和Space键展开保留焦点；Tree Group点击后进入selected/expanded且显示子项。初始axe 4.13.0扫描为0 violations、0 incomplete、5 passes。交互后扫描钩子在浏览器自动化执行世界不可见，因此该次不宣称通过。
- 动态样式表实际存在并可读取规则；Add按钮计算字体为Fluent Segoe UI栈。未使用`unsafe-inline`。仅保留一条既有环境签名`style-src-elem inline 135:93843`、无`source-file`，该签名此前已在完全无脚本空白对照复现；本轮没有Fluent应用脚本来源的样式拦截。
- 浏览器新增28个证据文件由`.qualification/runs/fluent-platform-surfaces-1/BROWSER-SHA256SUMS.txt`封存，其清单SHA-256为`d3a1ade88d008039264e8aea681facff38863aeb9aee7ee42ca1dcb2f23328de`。

## 尚未通过的门

- 共享合成消费者的真实浏览器、四视口和有界键盘验证已完成；尚未完成CPQ宿主CSS、真实业务页面、部署环境CSP、完整键盘路径或应用独立验收。共享浏览器证据不能替代这些应用门。
- 候选未发布，不得依据同版本文件名推断可安装版本，也不得从本任务直接通知CPQ 02安装。
- 封存快照中的本记录仍显示资格进行中；本节是封存完成后的当前工作树收口记录，不改写候选源快照。

回退仅撤销本记录、本批有限导出和测试，不改变既有候选或CPQ工作树。
