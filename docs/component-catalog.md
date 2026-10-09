# 组件与页面使用目录

本目录对应 `0.1.2` 英文预览，安装前请核对[发布状态](releases/0.1.2.md)。`0.1.2` 相对 `0.1.0` 仅有两处视觉调整：导航项悬停灰底，以及 Editable Grid 冻结操作列前不再绘制分隔线。轻量字重、Dropdown 和 SegmentedControl 默认 small 是相对 rc.4 的新增调整，不可推断 rc.4 已包含。预览入口为 `?view=<标识>`，旧 `elements` 入口映射到 `text`；其余原有页面 ID 保留。

## 如何查阅

先按任务选择部件，再查看关联样例。表单用于输入、动作与反馈；页面用于结构与集合；特殊部件有更严格的交互合同；样例展示组合。每页提供用途、边界、实际演示源码及相关样例。API 的子部件跟随所属组合说明，不独立出现在导航中。

| 分类 / 标识 | 部件 | 推荐场景 | 选择与禁止事项 |
| --- | --- | --- | --- |
| 表单 / `text` | Input · Textarea · Field | 输入名称、编号、描述及字段校验 | 长说明用 Textarea；标签、提示和错误统一放在 Field 内 |
| 表单 / `date` | DatePicker | 业务日期录入、范围限制和禁用日期 | 日期含义、时区、格式与可选范围由应用决定 |
| 表单 / `choice` | RadioGroup · Checkbox · Switch | 互斥选择、多项选择和即时开关 | 互斥选 Radio；批量选 Checkbox；即时二态选 Switch |
| 表单 / `select` | Dropdown · Combobox · Option | 从固定或较长选项集合中选择 | 短列表用 Dropdown；搜索或输入匹配用 Combobox |
| 表单 / `number` | SpinButton · Slider | 精确数量输入或有范围的连续调整 | 精确值用 SpinButton；估计区间用 Slider，单位与精度归应用 |
| 表单 / `actions` | Button · IconButton · TableActionIconButton · Menu | 主次操作、行末操作和低频菜单 | 导航用 Link；图标按钮必须有可访问名称和 Tooltip |
| 表单 / `modes` | SegmentedControl · InlineModeTabs | 同级模式选择、字段内部输入来源切换 | 局部编辑来源用胶囊；页面导航用 Tabs |
| 表单 / `feedback` | MessageBar · Badge · Tag · Spinner · Skeleton | 状态、局部提示、加载和进度 | 错误就近显示；Badge 不是操作按钮；加载时保留布局 |
| 表单 / `hints` | Tooltip · InfoLabel · Popover | 简短说明、字段帮助和上下文信息 | 重要错误不能只存在悬停提示；复杂编辑使用 Sheet |
| 表单 / `overlays` | Dialog · OverlayDrawer | 确认短任务或不离开目录编辑记录 | Dialog 用于聚焦确认；Sheet 用于详细编辑；处理焦点与未保存关闭 |
| 表单 / `login` | AuthenticationLayout · Field · Input | 登录入口的字段、错误和提交状态 | 只是界面组合；SSO、MFA、凭据与登录跳转由应用处理 |
| 页面 / `shell` | ApplicationFrame · ApplicationTopBar · ApplicationNavigation | 带侧栏和稳定顶部区域的企业应用 | 白色平面导航；当前项标记与路由一致；窄屏使用移动导航 |
| 页面 / `breadcrumb` | Breadcrumb · BreadcrumbItem | 显示记录与上级目录的位置关系 | 当前项不可重复跳转；不要用面包屑表达流程状态 |
| 页面 / `header` | PageHeader | 页面身份、简短说明与页面级操作 | 一个页面一个主标题；行操作留在对应行 |
| 页面 / `layout` | WorkspaceSection · RecordManagementWorkspace · DirectoryWorkspace · VersionedWorkspaceLayout | 白色模块、主内容与辅助信息的布局 | 已有外框内不嵌套重复边框；辅助信息放侧栏并在窄屏重排 |
| 页面 / `tabs` | TabList · Tab | 同一对象的并列内容视图 | 不能代替业务流程；为 Tab 绑定对应内容面板 |
| 页面 / `toolbar` | Toolbar · SearchBox · ViewModeToggle | 集合搜索、筛选、刷新与翻页 | 查询改变重置页码；视图切换保留搜索、筛选及分页 |
| 页面 / `collection` | CollectionList · CollectionListItem | 少量记录或信息条目的紧凑展示 | 需要按列比较时用 Table；不得混合行导航与重复主入口 |
| 页面 / `table` | Table · DataGrid · RecordIdentityCellLayout · RecordSelectionDataGrid | 多列比较、记录入口或同屏编辑选择 | 独立目录用主列链接；Form + List 使用整行选择 |
| 页面 / `cards` | CardGallery · ActionableCardGalleryItem · ViewModeToggle | 记录摘要与同一集合的卡片视图 | 导航卡片整体点击；展示卡片无内嵌重复边框和阴影 |
| 特殊部件 / `stage` | StageNavigator | 可提前查看的同级准备工作区 | 选中外圈只表示查看位置；节点底色保留自身状态 |
| 特殊部件 / `bpf` | BusinessProcessFlow | 有实际业务进度的流程阶段 | 只允许查看已到达阶段；查看位置不能改变真实流程位置 |
| 特殊部件 / `editable-grid` | EditableGrid · EditableGridRowActionGroup | 大量行、频繁修改、批量保存 | 列、校验、选中、草稿、保存与冲突归应用；行末操作冻结 |
| 特殊部件 / `grouped-table` | GroupedTableSectionRow · EditableGrid | 自然分组的多行集合和高频编辑 | 分组只控制展开；选中和编辑发生在叶子行，折叠保留草稿 |
| 样例 / `directory` | DirectoryWorkspace | 查找、筛选、比较并打开记录 | 主列链接或整卡入口打开 Sheet；返回保留目录状态 |
| 样例 / `form` | Field · WorkspaceSection | 分区录入、校验、提交与反馈 | 本地合成数据；接口、业务校验及保存策略归应用 |
| 样例 / `master-data` | RecordManagementWorkspace | 同一页面选择并维护定义 | 切换记录前处理未保存修改；列表不是隐藏导航 |
| 样例 / `record` | RecordManagementWorkspace · StageNavigator | 围绕单条记录的多个工作区域 | 查看位置与节点状态独立；辅助信息从属于主任务 |
| 样例 / `governance` | VersionedWorkspaceLayout · BusinessProcessFlow | 稳定对象、多版本与流程信息 | 版本算法、审批与发布命令归应用；示例不是业务规则 |
| 样例 / `authentication` | AuthenticationLayout | 独立应用登录入口 | 合成演示不校验真实凭据，不连接身份服务 |

## 尺寸与状态

输入、选择与按钮采用所支持的 Fluent size 选项；表单默认 medium，密集行编辑 small。局部 InlineModeTabs 保持已批准的小胶囊；SegmentedControl 在本地候选默认 small，显式 medium 仍可用。图标行操作使用 TableActionIconButton 固定 small。不能给全部控件强加统一高度。

Field 支持提示、必填与校验反馈；原生 readonly 仅用于支持该属性的输入，不以 disabled 冒充可复制的只读数据。Checkbox 的 mixed 表示部分选择；Radio 表示互斥；Switch 表示二态切换。加载使用 Spinner/Skeleton，进度使用 ProgressBar；按钮 busy 由应用禁用并显示进度，避免重复提交。空集合和请求错误使用就近可见反馈。

## 公共子部件与补充能力覆盖

以下不是遗漏控件，而是跟随主部件的组合能力。使用时遵守同页推荐场景与上游 Fluent 合同。

| 公共能力 | 对应页面 / 使用边界 |
| --- | --- |
| Text、Body1、Caption1、Subtitle2、Label、Divider | 文本输入与字段；正文、次级说明、字段标签及分隔。不要用原生标题默认粗体代替指定角色。 |
| ToggleButton、MenuButton、SplitButton、MenuTrigger、MenuPopover、MenuList、MenuItem、MenuDivider | 按钮与图标操作；切换动作、主动作带备选项、低频操作菜单。不要把互斥字段选项伪装成命令菜单。 |
| Option、OptionGroup | 下拉与可搜索选择；选项分组，键值与过滤由应用提供。 |
| MessageBarBody、MessageBarTitle、MessageBarActions、CounterBadge、PresenceBadge、TagGroup | 反馈与状态；分别用于消息结构、数量、在线状态与标签集合；状态语义由应用决定。 |
| DialogTrigger、DialogSurface、DialogBody、DialogTitle、DialogContent、DialogActions | Dialog 与 Sheet；保持标题、焦点陷阱、Escape 和触发器返回焦点。 |
| DrawerHeader、DrawerHeaderTitle、DrawerBody、DrawerFooter | Dialog 与 Sheet；详情头、可滚动正文、底部操作，busy 与脏数据关闭由应用守卫。 |
| TableHeader、TableBody、TableRow、TableHeaderCell、TableCell、TableCellLayout、TableSelectionCell、TableCellActions、RecordTableHeader | Data Table / DataGrid；显示数据、复选框和行操作各自独立。 |
| DataGridHeader、DataGridBody、DataGridRow、DataGridHeaderCell、DataGridCell、RecordDataGridHeader | Data Table / DataGrid；需要键盘网格、选择等交互时采用，排序和加载仍归应用。 |
| RecordSelectionRegion、RecordSelectionDataGridRow | Data Table / DataGrid、Form + List；选择加载同屏表单，不用于独立目录跳转。 |
| Card、CardHeader、CardPreview、CardFooter、CardGalleryItem | 卡片与 List/Card；一个对象的摘要，嵌套在模块内时不重复边框。 |
| BreadcrumbItem、BreadcrumbDivider、BreadcrumbButton | 面包屑；层级位置，当前项与可返回上级分开。 |
| ToolbarButton、ToolbarDivider、ToolbarGroup | 工具栏、搜索与分页；动作按任务组合，不插入字段业务状态。 |
| Nav、NavItem、NavCategory、NavCategoryItem、NavSubItem、NavSubItemGroup、NavDrawer、NavDrawerHeader、NavDrawerBody、NavDrawerFooter、NavDivider、AppItem、AppItemStatic、Hamburger | 应用框架与导航；底层 Fluent 组合能力。普通页面优先 ApplicationNavigation，避免重复实现导航皮肤。 |
| Tree、TreeItem、TreeItemLayout | 应用框架与导航；真实父子资源层级使用 Tree，普通并列页面不用 Tree。 |
| Accordion、AccordionItem、AccordionHeader、AccordionPanel | 模块与分栏布局；次要详情的展开折叠；必填内容和关键错误不可默认藏起。 |
| Avatar、AvatarGroup、AvatarGroupItem、AvatarGroupPopover、Persona | Collection List；人员身份、协作者摘要，不将头像颜色当业务状态。 |
| NidecProvider、nidecLightTheme | 所有页面前置；显式主题与样式导入，见接入指南。 |
| ProcessStageIndicator | 已弃用兼容出口；新实现选择 StageNavigator 或 BusinessProcessFlow。 |

所有子部件的 Props 类型跟随对应组件；布局类型和 DatePicker 类型跟随独立子路径。共享包不接管业务状态机、API、授权和保存。

## 样例选择

集合查找 → 企业目录；创建或修改单记录 → 完整表单；定义集合与编辑器常驻 → Form + List；单记录多个工作区 → 记录工作区；稳定身份与多个版本 → 版本治理；认证入口 → 登录页。大量重复行编辑 → Editable Grid；自然分组集合 → Grouped Table。

## 文档与版本

- [应用接入与原 UI 替换](consumer-ui-adoption.md)
- [页面原型](page-archetypes.md)、[阶段选择](stage-pattern-selection.md)、[Editable Grid](editable-grid.md)、[分组表格](grouped-table.md)
- [rc.4 发布记录](releases/0.1.0-rc.4.md)
- [rc.4 对应源文档](https://github.com/phantasywind/nidec-app-ui-design/tree/v0.1.0-rc.4/docs)

当前主线文档不能当成已发布版本证据。预览中的内存保存刷新即重置，登录不接入身份服务。
