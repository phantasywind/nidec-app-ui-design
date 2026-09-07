# Nidec App UI Deployment 交接记录

状态：READY FOR DEPLOYMENT-COORDINATION HANDOFF / SHARED MAINLINE REMAINS HERE / NOT RELEASED。

日期：2026-09-07。

## 职责转移

`Nidec App UI Deployment`自本记录起负责：

- 接收共享Design System的固定候选、校验值、资格证据和已知限制；
- 与CPQ `02 UI设计与前端实现`协调现有`main`上的应用接入；
- 组织真实宿主、浏览器、四视口、键盘、CSP、应用回归及独立验收；
- 管理采用应用的实施批次、回退记录和部署门；
- 区分包级资格、应用自测、独立验收、发布和Production批准。

本`Nidec App UI Design`任务此后只负责共享主线：设计原则、主题、公共组件、接口合同、测试、候选制品和包级证据。未经Locke重新分配，不再直接联系CPQ 02、不修改应用仓库、不协调部署。

## 当前共享候选

- 运行：`fluent-platform-surfaces-1`。
- 候选文件：`.qualification/runs/fluent-platform-surfaces-1/build-a/candidate.tgz`。
- SHA-256：`65b9b2d4f557995e63f122f95b0037f4aa6b30cf401d0c361c99a467933e5998`。
- 大小：7042字节。
- 固定上游：`@fluentui/react-components@9.74.7`。
- 能力：Table/DataGrid、Card、Badge、Skeleton/Progress、Breadcrumb、Toolbar、Nav、Tree、Accordion及对应属性类型；仍使用有限公共导出，不允许整库转导出或不稳定接口。

后续通用内容与控件候选：

- 权威运行：`fluent-common-content-controls-2`。
- 候选文件：`.qualification/runs/fluent-common-content-controls-2/build-a/candidate.tgz`。
- SHA-256：`5b2c2c28b48acddae66340b3f2a6b3f93671984cec9cdb1b9bfe006c046e100c`。
- 大小：7358字节。
- 能力：SearchBox/SpinButton/Slider、ToggleButton/MenuButton/SplitButton、Label/InfoLabel/Divider、Avatar/Persona、Tag及Popover。
- 资格：两个Node24归档一致，14文件/67测试和三个Node22真实tgz消费者通过，253个证据文件封存；真实浏览器/宿主/CSP和应用验收尚未执行。
- `fluent-common-content-controls-1`产生相同包字节，但冻结fixture遗漏nonce-aware renderer；保留为历史包级证据，不作为严格CSP浏览器正向基线。

## 已通过的包级资格

- Node 24：两次独立离线恢复、完整验证和打包，两个tgz逐字节一致。
- 共享仓库：13个测试文件、63项测试通过；类型检查、生产构建、公共边界、CSS作用域和颜色治理检查通过。
- Node 22.22.0：三个真实tgz消费者通过类型检查和生产构建。
  - `token-only-consumer`未安装React或Fluent。
  - `react-vite-cpq-consumer`解析单一React/React DOM 19.2.7和Fluent 9.74.7。
  - `react-platform-surfaces-consumer`实际组合导航、工具栏、Card、表格、状态、进度与层级控件，并解析同一组React/Fluent。
- 封存后238个证据文件逐项回读通过；`SHA256SUMS.txt`为证据清单。

## 限制与不得误报事项

- 新平台演示JS为521116字节，触发Vite 500 kB分块提醒。它不是功能失败，但采用应用应按真实路由和功能边界评估代码分割，不得通过抬高阈值隐藏。
- 包级资格后已补共享合成消费者浏览器证据：1440/1280/900/720无横向溢出，导航、Accordion和Tree有界交互通过，严格nonce接入下Fluent样式生效。首次漏接renderer导致样式被CSP拦截的失败也已保留。详见`fluent-platform-surfaces-record.md`及`BROWSER-SHA256SUMS.txt`。
- 仍未完成CPQ宿主CSS、真实业务页面、完整人工键盘路径、部署环境CSP或应用独立验收；共享消费者通过不能替代这些门。
- 包级资格不等于CPQ/EPM/EIDC安装批准、应用验收、发布、部署或Production批准。
- 当前候选版本仍是开发候选且未发布；不得凭相同文件名或`main`自动安装。任何交付必须绑定精确文件、SHA和实施范围。
- Dark Mode不在范围内。
- 不得修改业务语义、API、RBAC、路由合同、请求参数或状态机；共享组件只替换视觉/交互底座。
- 每个迁移控件必须采用Fluent自身外观与状态，旧皮肤必须在边界排除，禁止新旧装饰叠加。
- CPQ实施默认在既有`main`进行，未经Locke明确授权不得创建分支或worktree。
- 不得自动commit、push、发布或部署。

## Deployment任务建议的接手顺序

1. 回读本记录、`fluent-platform-surfaces-record.md`、`fluent-six-phase-execution.md`及资格目录。
2. 在任何安装前重新确认CPQ HEAD、工作树、文件占用和未提交保护范围。
3. 依据CPQ Design System页面的活动引用建立较大但合同一致的实施批次；旧页面是视觉/交互基线与退役清单，不是继续保留旧实现的理由。
4. 只安装精确候选并冻结消费端lock；确认单一React和Fluent解析。
5. 由02在CPQ现有`main`实施，保留业务事件、空值、焦点、提交、请求和权限合同。
6. 完成实际宿主CSS、控件伪元素/背景、四视口、键盘、CSP、生产构建和应用回归；之后再安排独立验收。
7. 发现共享公共能力缺口时，将“组件/合同/证据需求”回传本设计任务；不要在CPQ内发明永久公共组件。
8. 旧体系退役必须以无活动/动态引用、应用回归、移除清单和可回退差异为证据，不得以“Fluent已导出”代替。

## 权威路径

- `docs/implementation/fluent-platform-surfaces-record.md`
- `docs/implementation/fluent-six-phase-execution.md`
- `docs/roadmap.md`
- `.qualification/runs/fluent-platform-surfaces-1/build-comparison.json`
- `.qualification/runs/fluent-platform-surfaces-1/consumer-node22/results.json`
- `.qualification/runs/fluent-platform-surfaces-1/SHA256SUMS.txt`
- `.qualification/runs/fluent-platform-surfaces-1/BROWSER-SHA256SUMS.txt`
- `docs/implementation/fluent-common-content-controls-record.md`
- `.qualification/runs/fluent-common-content-controls-2/build-comparison.json`
- `.qualification/runs/fluent-common-content-controls-2/consumer-node22/results.json`
- `.qualification/runs/fluent-common-content-controls-2/SHA256SUMS.txt`

本记录是职责与证据交接，不是安装、发布或部署命令。
