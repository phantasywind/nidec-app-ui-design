# Nidec App UI Deployment 交接记录

状态：HISTORICAL / SUPERSEDED BY DIRECT CONSUMER ADOPTION WORKFLOW。

首次交接：2026-09-07。正式发布更新：2026-09-09。

本次更新取代本文较早的“开发候选、尚未发布”身份。采用应用只能消费下述正式发布的精确版本；本文后文提到的旧运行和旧 SHA 仅保留为历史资格证据，不得安装或重新标记。

2026-09-10流程变更：Locke决定不再使用独立Deployment任务作为后续中转。共享仓库只维护README中的通用、版本化接入方法；Locke将该方法转发给各App对话，各App在自己的仓库和对话中完成安装、实施、证据、回退、验收与部署。本仓库不再新增App专属部署/交接记录。本文仅保留为职责演变和`0.1.0-rc.1`发布身份的历史证据，不再是活动任务入口。

## 2026-09-07原职责转移（历史）

当时的`Nidec App UI Deployment`职责曾定义为：

- 接收共享Design System的固定候选、校验值、资格证据和已知限制；
- 与CPQ `02 UI设计与前端实现`协调现有`main`上的应用接入；
- 组织真实宿主、浏览器、四视口、键盘、CSP、应用回归及独立验收；
- 管理采用应用的实施批次、回退记录和部署门；
- 区分包级资格、应用自测、独立验收、发布和Production批准。

本`Nidec App UI Design`任务此后只负责共享主线：设计原则、主题、公共组件、接口合同、测试、候选制品和包级证据。未经Locke重新分配，不再直接联系CPQ 02、不修改应用仓库、不协调部署。

## 唯一可安装发布身份

- npm包：`@phantasywind/nidec-app-ui-design@0.1.0-rc.1`，GitHub Packages dist-tag为`rc`；应用必须锁定完整版本号，不得安装`rc`标签本身。
- Git标签：`v0.1.0-rc.1`。
- 发布源提交：`d7445e562ed0b7e43131474a81e22b05567c42c5`。
- GitHub Release：`https://github.com/phantasywind/nidec-app-ui-design/releases/tag/v0.1.0-rc.1`。
- Release附件：`phantasywind-nidec-app-ui-design-0.1.0-rc.1.tgz`，16621字节。
- SHA-256：`66f199f1b66b34968851cd020d31be7a0b731d44457fc5135ef7f148bfeae91c`。
- npm shasum：`fb413c37204a97a7891a1ebd15196594d55bcf8e`。
- npm integrity：`sha512-oO6N+l4pZ8MMMapTyfgqd4UIkwKHy5Os3S9+vj/RRvaovo5Xxr8SiNZmsjU/oIsbGn9O39zojKAQrnOQenLr3g==`。
- 固定上游：`@fluentui/react-components@9.74.7`；React/React DOM为`>=19.2.0 <20` peer，已资格消费者固定19.2.x精确配对。
- 权威资格运行：`.qualification/runs/release-0-1-0-rc-1`。
- 发布记录：`docs/releases/0.1.0-rc.1.md`。

远端回读已经确认：peeled tag指向上述提交；Release不是draft且标记为pre-release；重新下载的Release附件及`SHA256SUMS.txt`与资格SHA一致；GitHub Packages返回同一版本、shasum和integrity。`0.1.0-rc.1`不可覆盖或复用，修正必须发布新版本。

## 已通过的发布前包级资格

- Node 24两次独立恢复与打包产生逐字节一致的tgz。
- 共享仓库16个测试文件、78项测试通过；lint、严格类型、生产构建、CSS/颜色、公共边界和采用合同检查通过。
- 九个Node 22真实tgz消费者通过恢复、类型及生产构建；纯token消费者无需React或Fluent，React消费者解析单一兼容React/React DOM与Fluent 9.74.7。
- 浏览器证据覆盖1440/1280/900/720、键盘与有界交互、CSP及包边界，axe报告零violation。
- 356个资格证据文件封存并回读。

## 限制与不得误报事项

- 新平台演示JS为521116字节，触发Vite 500 kB分块提醒。它不是功能失败，但采用应用应按真实路由和功能边界评估代码分割，不得通过抬高阈值隐藏。
- 资格中保留两个有界axe incomplete信号：`axe-color-contrast-incomplete:process-stage-overlap`和`axe-color-contrast-incomplete:scrollable-table-clipping-at-720`。独立几何断言已证明stage连接线不与marker边框重叠、hover不遮线；720表头信号来自有界横向滚动中的部分遮挡。它们不是axe violation，也不得被扩大解释为完整WCAG通过。
- 仍未完成CPQ宿主CSS、真实业务页面、完整人工键盘路径、部署环境CSP或应用独立验收；共享消费者通过不能替代这些门。
- 包已经发布，但发布不等于CPQ/EPM/EIDC安装完成、应用验收、部署或Production批准。
- `0.1.0-rc.1`是pre-release，不是稳定`0.1.0`。不得从`main`、Git URL、旧本地tgz、`latest`、`rc`、`^`、`~`或其他范围安装。
- Dark Mode不在范围内。
- 不得修改业务语义、API、RBAC、路由合同、请求参数或状态机；共享组件只替换视觉/交互底座。
- 每个迁移控件必须采用Fluent自身外观与状态，旧皮肤必须在边界排除，禁止新旧装饰叠加。
- CPQ实施默认在既有`main`进行，未经Locke明确授权不得创建分支或worktree。
- 不得自动commit、push、发布或部署。

## 原Deployment任务建议接手顺序（历史）

1. 回读本记录、`docs/releases/0.1.0-rc.1.md`、`fluent-six-phase-execution.md`和权威资格目录；明确拒绝所有历史候选SHA。
2. 先做发布后渠道验证：在全新隔离消费者中从GitHub Packages安装精确`@phantasywind/nidec-app-ui-design@0.1.0-rc.1`和`@fluentui/react-components@9.74.7`，冻结lock，并比较安装内容与Release tgz。认证只能通过应用环境的凭据机制提供，不得记录token。
3. 为每个采用应用分别确认React/React DOM兼容性、单一React/Fluent解析、Node/构建工具、真实响应CSP、HEAD、工作树、文件占用、未提交保护范围和回退点。一个应用通过不能替代其他应用。
4. 按应用实际Design System清单建立较大但合同一致的迁移批次；旧Gallery是库存与视觉/交互参考，不是继续保留旧实现的理由。禁止把旧皮肤叠加在Fluent上。
5. CPQ协调交给既有02并默认在现有`main`实施；不得新建worktree。EPM、EIDC或其他应用由各自工作流实施，不把业务规则、API、RBAC、路由或状态机迁入共享包。
6. 每个应用必须完成真实宿主CSS和伪元素、四视口、Tab/Shift+Tab/Escape、表单误提交保护、弹层焦点与主题、CSP、生产构建、回归及资源/体积记录；随后进入独立验收。
7. 发现共享能力或缺陷时，把最小“组件/公共合同/复现/证据需求”回传本设计任务。不得在应用侧用永久覆盖层掩盖共享缺陷；修复需新包版本。
8. 旧体系退役必须证明无活动/动态/测试引用、应用回归通过、移除清单和可回退差异；不得以“Fluent已导出”或“页面看起来正常”代替。
9. Deployment逐应用向Locke报告：目标应用、精确版本与lock身份、实施范围、验证结果、遗留限制、回退方式及下一道授权门。没有独立验收和Production批准时不得描述为完成部署。

## 权威路径

- `docs/implementation/fluent-platform-surfaces-record.md`
- `docs/implementation/fluent-six-phase-execution.md`
- `docs/roadmap.md`
- `.qualification/runs/fluent-platform-surfaces-1/build-comparison.json`
- `.qualification/runs/fluent-platform-surfaces-1/consumer-node22/results.json`
- `.qualification/runs/fluent-platform-surfaces-1/SHA256SUMS.txt`
- `.qualification/runs/fluent-platform-surfaces-1/BROWSER-SHA256SUMS.txt`
- `docs/implementation/fluent-common-content-controls-record.md`
- `.qualification/runs/fluent-common-content-controls-3/build-comparison.json`
- `.qualification/runs/fluent-common-content-controls-3/consumer-node22/results.json`
- `.qualification/runs/fluent-common-content-controls-3/browser-summary.json`
- `.qualification/runs/fluent-common-content-controls-3/SHA256SUMS.txt`
- `.qualification/runs/fluent-common-content-controls-3/BROWSER-SHA256SUMS.txt`
- `docs/releases/0.1.0-rc.1.md`
- `.qualification/runs/release-0-1-0-rc-1/SHA256SUMS.txt`

本记录授权Deployment按既有职责组织发布后渠道验证和应用接入计划，但不自动授权任何应用修改、提交、推送、部署或Production发布；具体权限仍由Locke及各应用治理合同决定。
