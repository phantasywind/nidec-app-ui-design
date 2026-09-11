# Fluent 复合呈现模式记录

状态：SHARED TECHNICAL QUALIFICATION COMPLETE / NOT RELEASED / NOT ADOPTED。

## 目标

补齐Fluent稳定原语之上的跨应用呈现合同：语义Collection List、Data Table型列表、响应式Card Gallery、中立Process Stage Indicator。同时规定Design System Gallery作为开发与治理页面的结构，不把任何应用业务状态机或Gallery源码搬入公共包。

## 公共与应用边界

- 不导出Fluent 9.74.7的`List`、`ListItem`：其上游包仍明确标注为非生产就绪，首轮浏览器候选也暴露出自动复选框缺少标签及可选整行嵌套按钮问题。`CollectionList`和`CollectionListItem`改用稳定的原生`ul/li`语义、Fluent主题token和显式Fluent控件槽位，只统一密度、内容槽位及响应式排列；选择控件必须由消费者提供可访问名称，选择值、导航、行操作和数据加载归消费者。
- `CardGallery`和`CardGalleryItem`提供语义列表、响应式网格与Fluent Card容器；列数随可用空间变化。媒体来源、卡片动作、筛选、分页和业务分类归消费者。
- Data Table型列表直接组合已经批准的Fluent `Table`组件族，不再创建同义公共包装器。共享规范覆盖列标题、长内容、状态Badge、元数据、行操作和有界横向滚动；列定义、排序、选择、分页、虚拟化、数据加载及业务含义归消费者。
- 阶段呈现拆分为两个不可混用的合同：`StageNavigator`以圆形编号和必需的激活回调表达可直接切换的同级工作区；`BusinessProcessFlow`以箭头表达由业务状态驱动的只读流程，公共接口不提供激活回调。阶段名称、迁移规则、权限、跳转、回退、保存和API归消费者；公共组件不计算阶段状态。
- 新Nidec CSS仅用于Fluent未提供的组合布局和连接线，全部位于`@layer nidec-ui`、`:where([data-nidec-ui])`宿主和`nidec-ui-`命名空间；颜色、字体、间距和状态均使用Fluent主题token，不叠加旧应用皮肤。
- Dark Mode、虚拟化、无限滚动、拖放、图片上传、业务BPF引擎和应用路由不在本批。

## Design System Gallery呈现标准

Gallery是开发和治理工具，不是生产业务组件。标准页面依次呈现：版本与候选身份、Foundations、组件族导航、代表状态与交互样例、响应式/无障碍证据、使用合同与反例、成熟度和采用记录。目录登记数、演示可见和迁移完成率必须分开报告；业务组合保留在应用，内部视觉原语逐步替换。

## 验证与退出条件

本批必须完成公共导出、SSR语义、事件/禁用、唯一阶段/current约束、CSS作用域与颜色检查、真实tgz消费者、1440/1280/900/720布局、键盘/焦点、严格CSP和axe扫描。自动扫描不等于完整WCAG或应用独立验收。资格完成前不得向Deployment提供安装候选。

回退只撤销本批新增导出、组件文件、样式、测试、fixture、资格路由和本记录，不影响既有基础组件候选。

## 实施与资格结果

- 公共合同已实现：`CollectionList`、`CollectionListItem`、`CardGallery`、`CardGalleryItem`、`StageNavigator`、`BusinessProcessFlow`及对应类型；`ProcessStageIndicator`仅作为弃用兼容入口保留，没有引入应用阶段名称、状态推导、权限、路由或API。
- 首轮`fluent-composite-patterns-1`在浏览器中发现Fluent上游实验性List的无标签隐藏复选框和嵌套交互错误，候选`37f5e520a6c85707da4ccb66ed37788d1f1c34db6a05724058da527a05d56dbf`被拒绝并保留为失败证据。
- 修正版`fluent-composite-patterns-2`两次Node 24独立恢复均通过16个测试文件/77项测试、类型、构建、CSS/颜色及七文件边界检查，产出逐字节一致的15546-byte候选：`.qualification/runs/fluent-composite-patterns-2/build-a/candidate.tgz`，SHA-256 `84172cf51ba15a8fd8b9bcd740cadd4ee2718e46ec3e3897dfd7047ae36db6fc`。
- Node 22以真实tgz安装的token-only、通用React/Vite及本批专用消费者均完成类型与生产构建；token-only消费者没有安装React/Fluent，React消费者验证单一React及Fluent解析。
- 浏览器实际视口1440/1280/900/720均无横向溢出；Gallery列数为4/4/3/3，响应式Stage在720切为纵向。显式标签选择框通过鼠标与Space键切换；阶段焦点顺序跳过禁用项，`aria-current="step"`保持唯一；激活只回传消费者事件。
- axe 4.13.0在最终视口扫描中为0 violation。桌面横向连接线区域的自动颜色判断为incomplete；运行时逐项计算最低对比度5.12:1，作为工具限制保留，不扩大为完整WCAG声明。严格nonce CSP下动态样式均带正确nonce；保留已隔离的`style-src-elem:inline:line-135`浏览器环境签名，未加入`unsafe-inline`。
- 资格目录共313项证据通过`SHA256SUMS.txt`回读；浏览器单独清单为`BROWSER-SHA256SUMS.txt`。本结果只证明共享包合成消费者技术资格，不批准发布、应用安装、迁移、独立验收或Production。
- 2026-09-08应Locke预览反馈，综合消费者补入Data Table型列表：6列表头、3条合成记录、长名称、三种状态Badge、更新时间与行操作；720等窄屏采用表格区域内部滚动，不扩大整页宽度。当前Node 22真实tgz消费者类型及生产构建通过，并完成本地视觉/语义检查。该补充只使用候选中已资格化的Table/Badge/Button接口，因此包字节与`84172cf5...db6fc`哈希不变；不把本次示例扩展描述为新的包发布或应用验收。
- 2026-09-08发布收口修正预览发现的Stage视觉问题：可交互范围由整列缩为内容边界，Fluent按钮采用透明外观，横向/纵向连接线从当前marker边缘开始并在下一marker边缘结束，不再穿过marker或由hover底色遮盖。该变更需要绑定`0.1.0-rc.1`新候选重新进行浏览器资格验证；旧`84172cf5...db6fc`证据不转移。

## 阶段语义拆分补充（主线未发布）

2026-09-11对CPQ现有Design System Gallery进行了只读视觉与合同核对，确认旧资料实际包含两种不同语义，而非同一控件的两套皮肤：

消费应用的正式选择方法、适用场景、禁止事项和迁移步骤统一记录在[阶段呈现模式选择规范](../stage-pattern-selection.md)；本实施记录不作为应用业务规则的替代。

- 圆形编号模式用于可点击的工作区导航，行为接近Tab。主线以`StageNavigator`明确该合同，并要求`onStageSelect`；应用负责当前项、导航、禁用条件和未保存变更处理。
- 箭头模式用于真正的Business Process Flow。主线新增`BusinessProcessFlow`，只接受应用已计算的显式状态，不暴露点击、跳转或阶段切换回调；应用的服务端状态、迁移命令、RBAC、验证、持久化和API仍是唯一权威。
- `ProcessStageIndicator`保留为弃用兼容入口，避免未发布主线变化无必要地破坏既有代码。新应用不得继续使用该模糊合同，既有应用须按真实语义迁移到上述二者之一。
- 箭头样式以Fluent主题token实现完成、当前、后续和错误状态；窄屏仅在组件自身形成有界横向滚动，不折行、隐藏或改变流程次序。没有复制CPQ的Quote阶段名、状态机或业务代码。

此补充是共享主线实现和自测范围，不修改已发布且不可变的`0.1.0-rc.1`，不代表应用接入、独立验收、部署或Production批准。

## 发布后Table信息层级补充（主线未发布）

2026-09-10消费端只读核对确认：`0.1.0-rc.1`中的`CollectionListItem`已治理primary/secondary层级，但Table/DataGrid只提供Fluent结构组件，Gallery示例没有把record identity、普通字段和supporting metadata的层级形成可执行公共合同。应用使用`strong`/`small`自行决定视觉层级可能令同一行多个字段同时成为primary。

主线新增薄组合`RecordIdentityCellLayout`，仅包装Fluent `TableCellLayout`并固定`appearance="primary"`。消费者必须显式传入`primary`，可选传入`secondary`、`media`和`truncate`等稳定上游布局属性；组件不渲染`TableCell`或`DataGridCell`，不拥有列、行、排序、选择、分页、状态映射、动作或业务字段，因此可在两类表格单元格中使用。

公共呈现规则：

- 每个数据行只指定一个primary record identity，使用Fluent primary cell layout的semibold主文本；应用负责决定哪个字段是该记录的身份。
- 其他独立业务字段保持Fluent默认regular层级；字段业务重要性不自动产生第二个视觉primary。
- 与主身份属于同一单元格的supporting metadata通过`secondary`进入Fluent description槽，使用上游Caption层级和弱化前景色。
- 状态仅使用共享导出的`Badge`表达其受控tone/appearance，不叠加页面字重或颜色。
- 表头使用共享导出的Fluent Table/DataGrid Header组件，不叠加应用字体皮肤；列名、排序和`aria-sort`仍归消费者。
- `RecordIdentityCellLayout`不能在TypeScript层跨兄弟单元格证明“一行唯一”；该约束由Gallery正例、公共测试、代码评审和消费端采用检查共同治理。不得为此创建包含业务列模型的`DirectoryTable`。

该能力位于`0.1.0-rc.1`之后的未发布主线，不能追溯声称为已发布RC合同，也不修改或覆盖该版本。现有RC消费者可临时直接使用Fluent `TableCellLayout appearance="primary"`及`description`槽而无需页面字体CSS；正式消费`RecordIdentityCellLayout`必须等待未来新版本发布。

本轮主仓完整验证通过16个测试文件/79项测试，以及lint、严格类型、生产构建、CSS/颜色、七文件公共边界和采用合同检查；生成声明包含`RecordIdentityCellLayoutProps`和组件导出。直接在源fixture目录运行其`verify`不是有效tgz消费验证：该fixture manifest按资格设计不声明共享包，必须由资格脚本在隔离副本中注入真实归档；直接运行因此无法解析共享包，并同时命中fixture既有PostCSS类型环境问题。本轮不添加源码别名或本地依赖绕过包边界，真实tgz消费者与浏览器资格留到未来新版本候选阶段。

## 发布后record-entry交互补充（主线未发布）

2026-09-10针对应用中“整行点击、专用打开按钮、主字段链接”并存的问题完成Fluent官方模式核对。Fluent List把交互项建模为一个primary action和可选secondary actions，要求使用`onAction`而不是原始`onClick`，并按单动作`items`或多动作`composite`模式提供鼠标、Enter、Space和方向键合同。Fluent Link负责资源导航；Table/DataGrid的identity cell和cell actions应分离。

共享治理采用语义规则而非要求应用理解Fluent内部模式：应用只声明静态/导航/命令、选择模式、次级动作及其业务目标；共享包决定呈现和键盘机制。单动作Collection List的目标模式是整项primary action；带选择或次级动作的List必须隔离选择、primary action和secondary actions；Table/DataGrid以唯一record identity Link进入记录，行本身不可作为隐藏链接；Dialog/Drawer等非导航命令使用显式按钮或菜单。每条记录禁止同时出现整行打开、重复identity Link和重复Open按钮。

精确基线`@fluentui/react-components@9.74.7`解析到的`@fluentui/react-list@9.6.18`仍在其随包README声明不可用于产品，因此本轮不推翻既有决定、不直接转导出该List，也不临时重建其composite焦点系统。包内README已加入上述应用消费规则，并明确临时安全边界：在新的共享actionable-list API完成资格并发布前，record navigation使用现有Fluent Link作为primary内容，外围`CollectionListItem`保持非actionable。该说明不追溯改变不可变`0.1.0-rc.1`。

README消费合同由自动测试固定；加入该检查后，完整`npm run verify`通过16个测试文件/80项测试，以及lint、严格类型、生产构建、CSS/颜色、七文件公共边界和采用记录检查。没有生成候选、修改版本或触发发布。

## 发布后Table表头层级整改（主线未发布）

2026-09-10经Locke截图复核，Data Table的首要视觉问题不是记录入口，而是白色表头与白色数据行仅依靠细线分隔，标题和数据缺少明确层级。主线新增`RecordTableHeader`和`RecordDataGridHeader`两个薄封装：分别保持Fluent `TableHeaderProps`和`DataGridHeaderProps`，只组合共享命名空间类，不拥有Table/DataGrid、列、排序、选择、数据或事件。

共享CSS在`data-nidec-ui`宿主及`nidec-ui`级联层内，将两类表头统一映射为Fluent `colorNeutralBackground2`、`fontWeightSemibold`、`colorNeutralForeground1`及`strokeWidthThick/colorNeutralStroke1`底边。数据行不增加背景或字重覆盖，因而继续使用上游Fluent regular层级；该规则不采用原始颜色，也不使用大面积品牌绿色。综合消费者已改用`RecordTableHeader`，应用消费方法同步写入包内README。

聚焦类型检查及11项相关测试通过；随后完整`npm run verify`通过16个测试文件/81项测试，以及lint、严格类型、生产构建、CSS/颜色、七文件公共边界和采用记录检查。该结果是未发布主线自测，不是实际应用验收或发布资格。

## 发布后Table行操作治理（主线未发布）

2026-09-11经Locke确认，Data Table/DataGrid的直接行操作不得继续使用带文字的普通Button。共享主线新增`TableActionIconButton`，内部仍复用既有`IconButton`的必填非空`aria-label`和默认`type="button"`合同，同时固定Fluent `appearance="transparent"`、`size="small"`与标准圆角。按精确基线`@fluentui/react-components@9.74.7`，直接操作目标为24 x 24 CSS像素、图标20 x 20；无常驻边框、文本或填充底板，交互状态继续由Fluent管理。消费者不能覆盖appearance/size/shape，也不能叠加旧按钮皮肤。

每个直接图标操作必须放在Fluent `TableCellActions`内，并同时提供同义的非空`aria-label`与可在hover/focus显示的`Tooltip`。共享包不指定图标或业务动作，也不决定动作优先级、更多菜单、权限、确认或破坏性效果。综合消费者以官方Fluent Open图标演示该合同；图标包只属于消费者示例依赖，不成为共享包peer或运行时依赖。

完整`npm run verify`通过16个测试文件/82项测试，以及lint、严格类型、生产构建、CSS/颜色、七文件公共边界和采用记录检查。当前综合预览的浏览器语义树显示三条行操作均为只有无障碍名称的button，不含可见文字；这仍是主线自测，不是未来版本的真实tgz资格或应用验收。

首次加入三个Tooltip后，综合预览暴露了一个宿主用法缺陷：页面布局类`composite-fixture`直接挂在`NidecProvider`上，Fluent Portal为Tooltip复制Provider宿主时也复制了该类，三个带白色背景和`min-height: 100vh`的绝对定位Portal宿主覆盖页面，造成视觉空白但语义树仍存在。修复仅将布局类移至Provider内部普通容器；Provider继续只承担主题边界。测试固定该结构，防止页面布局类再次污染Portal宿主。

2026-09-11经Locke以既有Enquiry效果图复核，Data Table/DataGrid的记录入口恢复为更明确的主列超链接式呈现。共享合同不恢复整行点击：消费者仍指定唯一record identity，并在`RecordIdentityCellLayout.primary`中提供主题化Fluent `Link inline`，以Fluent支持的常驻下划线清楚区别普通字段；Link的目标、路由、权限和业务效果归消费者。右侧行操作不得重复“打开同一记录”，示例改为始终可见的More actions图标及Fluent Menu，维持主入口与次级命令分离。

同一整改将`TableActionIconButton`的共享命名空间尺寸明确固定为实际24 x 24 CSS像素，修正仅依赖Fluent small Button时实测高度约23.33px、与文档目标不一致的问题。颜色、字重、hover、focus、pressed和disabled状态继续由Fluent主题与组件机制负责，不写入Data Table页面级颜色。

## 下一道门

共享主线的List、Gallery、Design System Gallery结构、中立Process Stage和Table record-identity视觉合同已具备。各应用对照自己的实际清单在其仓库和对话中决定采用范围；业务BPF引擎、状态映射、权限和跳转仍由各应用所有。任何应用反馈若揭示共享缺陷，回到本仓库统一修复并在获批后生成新版本，不在应用侧叠加旧皮肤。本轮Table层级补充尚未发布。
