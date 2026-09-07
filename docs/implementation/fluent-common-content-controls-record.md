# Fluent 通用内容与控件能力记录

状态：SHARED TECHNICAL CANDIDATE QUALIFIED / BROWSER AND APPLICATION ACCEPTANCE PENDING / NOT RELEASED。

资格说明：`fluent-common-content-controls-1`在消费者补齐nonce-aware Fluent renderer之前截取快照，随后实际完成了双构建、三消费者及253文件封存；它证明包级合同成立，但冻结fixture不适合作为严格CSP浏览器正向样例。`fluent-common-content-controls-2`包含明确renderer接入，已完成同样的双构建、三消费者和253文件封存，是本批当前权威资格运行。两个运行产生完全相同的候选tgz。

## 目的

在已完成表单、目录操作、数据表面和导航底座之后，补齐采用应用普遍需要的身份呈现、分类标签、搜索与数值输入、组合动作和轻量上下文披露。旧CPQ Gallery用于识别能力类别和视觉连续性，不作为公共源码或业务语义来源。

## 有限公共能力

- 搜索与数值：`SearchBox`、`SpinButton`、`Slider`。
- 动作：`ToggleButton`、`MenuButton`、`SplitButton`。
- 标签与说明：`Label`、`InfoLabel`、`Divider`。
- 身份：`Avatar`、`AvatarGroup`、`AvatarGroupItem`、`AvatarGroupPopover`、`Persona`。
- 分类：`Tag`、`TagGroup`。
- 上下文披露：`Popover`、`PopoverTrigger`、`PopoverSurface`。

这些接口保持Fluent 9.74.7上游合同。共享包不定义搜索请求、防抖、数值单位/精度、人员权限、标签状态含义、主次动作行为或弹层业务内容。没有整库转导出、不使用`unstable`入口、不增加Dark Mode。

## 验证和限制

- 精确公共导出白名单和上游对象身份已通过；共享验证为14个测试文件、67项测试，类型、构建、边界、CSS和颜色治理均通过。
- SSR首轮错误地要求`InfoLabel`和`PopoverSurface`的弹层内容一定出现在默认静态HTML中；该失败未被解释为组件故障。测试已调整为静态语义与inline组合合同，实际弹层生命周期仍需浏览器验证。
- 权威候选：`.qualification/runs/fluent-common-content-controls-2/build-a/candidate.tgz`；SHA-256 `5b2c2c28b48acddae66340b3f2a6b3f93671984cec9cdb1b9bfe006c046e100c`；7358字节。两个Node 24独立恢复所得tgz逐字节一致。
- 三个Node 22.22.0真实tgz消费者通过。纯token消费者未安装React/Fluent；现有React/Vite与新增综合消费者均解析单一React/React DOM 19.2.7及Fluent 9.74.7，并通过类型检查和生产构建。
- 综合消费者JS为593226字节（gzip约165.15 kB），触发Vite 500 kB分块提示。共享包入口自身为9.17 kB（gzip 2.85 kB）；应用一次性导入集合和路由分块决定最终体积，不得通过抬高阈值掩盖。
- `fluent-common-content-controls-2`封存后253个证据文件逐项回读通过，`SHA256SUMS.txt`的SHA-256为`5fd43d804786113f860975618967ffeebb748d4fc5c72948c60a679ef942da28`。
- Toast/Toaster本批不开放：它需要独立的通知生命周期、可访问性、队列和浏览器验证合同。
- 本批尚未完成真实浏览器、宿主CSS、四视口、键盘、CSP或应用独立验收。包级资格不等于任何应用安装、独立验收、发布或部署批准；接入协调归`Nidec App UI Deployment`。
- 浏览器专项`browser-1`仅创建了绑定、服务和审计脚本，尚未产生任何页面请求或审计结果；应用内浏览器控制连续两次初始化超时后按工具恢复规则停止。该尝试不封存、不计为通过或组件失败；下次应使用新编号重试。
- 封存快照中的本记录仍显示资格进行中；本节是封存完成后的当前工作树收口记录，不改写候选源快照。

回退仅撤销本批有限导出、合同测试、fixture、资格路由和本记录，不改变先前已封存候选。
