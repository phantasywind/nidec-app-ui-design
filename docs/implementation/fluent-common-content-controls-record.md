# Fluent 通用内容与控件能力记录

状态：SHARED TECHNICAL CANDIDATE AND SYNTHETIC BROWSER QUALIFIED WITH RECORDED LIMITATIONS / APPLICATION ACCEPTANCE PENDING / NOT RELEASED。

资格说明：`fluent-common-content-controls-1`和`-2`保留为包合同及nonce接入的历史证据。对`-2`的首次真实浏览器复验发现独立中性Avatar使用`colorNeutralForeground3`与`colorNeutralBackground6`时只有3.94:1；该失败未覆盖或豁免。共享主题在中央映射中将已批准`textMuted`向主文字色混合12%，不改原始品牌色表、不向Avatar组件写死色值。`fluent-common-content-controls-3`重新完成全部资格和浏览器复验，现为本批权威候选。

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

- 精确公共导出白名单和上游对象身份已通过；共享验证为15个测试文件、72项测试，类型、构建、边界、CSS、颜色和采用记录治理均通过。主题回归测试现在明确检查三级文字同时位于白底和Fluent中性Avatar背景上的AA对比度。
- SSR首轮错误地要求`InfoLabel`和`PopoverSurface`的弹层内容一定出现在默认静态HTML中；该失败未被解释为组件故障。测试已调整为静态语义与inline组合合同，实际弹层生命周期仍需浏览器验证。
- 权威候选：`.qualification/runs/fluent-common-content-controls-3/build-a/candidate.tgz`；SHA-256 `33aa856decbb5f3b70bc38c17701e06cf9b9eb097e4a78276bf0edf4e72cbc92`；7377字节。两个Node 24独立恢复所得tgz逐字节一致。
- 三个Node 22.22.0真实tgz消费者通过。纯token消费者未安装React/Fluent；现有React/Vite与新增综合消费者均解析单一React/React DOM 19.2.7及Fluent 9.74.7，并通过类型检查和生产构建。
- 综合消费者JS为593240字节（gzip约165.66 kB），仍触发Vite 500 kB分块提示。共享包入口自身为9.18 kB（gzip 2.85 kB）；应用一次性导入集合和路由分块决定最终体积，不得通过抬高阈值掩盖。
- 严格nonce CSP合成消费者实测搜索输入/清空、SpinButton和Slider方向键、Toggle状态、Popover打开、Escape关闭及焦点返回。1440/1280/900/720均无水平溢出；Avatar实测前景`rgb(94,105,99)`位于`rgb(230,230,230)`时为4.58:1。
- 13次axe 4.13.0扫描无incomplete且不再出现`color-contrast`。交互后四视口只保留ADR-0004限定的`aria-hidden-focus`，每个节点均为`data-tabster-dummy`；不扩大为其他无障碍问题的豁免，也不表示完整WCAG合规。
- CSP仍记录既有`style-src-elem`、blocked inline、line 135签名；策略保持nonce且无`unsafe-inline`，请求只包含本地应用资产、审计/CSP遥测及favicon。该已披露浏览器环境签名不是部署环境CSP通过声明。
- 浏览器封存脚本机器校验交互、四视口、axe限制签名、CSP和请求边界后封存20个文件；`BROWSER-SHA256SUMS.txt`的SHA-256为`6c8439fd936d2c16b393151f3195bb3a482bdf4d457db084c437695cc96a7f6c`。
- `fluent-common-content-controls-3`封存后280个证据文件逐项回读通过，`SHA256SUMS.txt`的SHA-256为`b2616585bc44dd23284fe722da35266520ca8d253d69c56f8bc47ae0756841c7`。
- Toast/Toaster本批不开放：它需要独立的通知生命周期、可访问性、队列和浏览器验证合同。
- 本批已完成共享合成消费者的真实浏览器、四视口、键盘和严格CSP证据，但尚未完成采用应用宿主CSS、真实业务流程、部署CSP或独立验收。包级与合成消费者资格不等于任何应用安装、独立验收、发布或部署批准；接入协调归`Nidec App UI Deployment`。
- `fluent-common-content-controls-2/browser-1`的浏览器初始化失败及`browser-2`发现的对比度失败均保留且不计为通过；run3没有覆盖这些历史失败。
- 封存快照中的本记录仍显示资格进行中；本节是封存完成后的当前工作树收口记录，不改写候选源快照。

回退仅撤销本批有限导出、合同测试、fixture、资格路由和本记录，不改变先前已封存候选。
