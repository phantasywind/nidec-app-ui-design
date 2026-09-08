# Fluent 复合呈现模式记录

状态：SHARED TECHNICAL QUALIFICATION COMPLETE / NOT RELEASED / NOT ADOPTED。

## 目标

补齐Fluent稳定原语之上的跨应用呈现合同：语义Collection List、Data Table型列表、响应式Card Gallery、中立Process Stage Indicator。同时规定Design System Gallery作为开发与治理页面的结构，不把任何应用业务状态机或Gallery源码搬入公共包。

## 公共与应用边界

- 不导出Fluent 9.74.7的`List`、`ListItem`：其上游包仍明确标注为非生产就绪，首轮浏览器候选也暴露出自动复选框缺少标签及可选整行嵌套按钮问题。`CollectionList`和`CollectionListItem`改用稳定的原生`ul/li`语义、Fluent主题token和显式Fluent控件槽位，只统一密度、内容槽位及响应式排列；选择控件必须由消费者提供可访问名称，选择值、导航、行操作和数据加载归消费者。
- `CardGallery`和`CardGalleryItem`提供语义列表、响应式网格与Fluent Card容器；列数随可用空间变化。媒体来源、卡片动作、筛选、分页和业务分类归消费者。
- Data Table型列表直接组合已经批准的Fluent `Table`组件族，不再创建同义公共包装器。共享规范覆盖列标题、长内容、状态Badge、元数据、行操作和有界横向滚动；列定义、排序、选择、分页、虚拟化、数据加载及业务含义归消费者。
- `ProcessStageIndicator`只呈现消费者明确提供的`completed/current/upcoming/error`、本地化状态标签及可选激活动作。阶段名称、迁移规则、权限、跳转、回退、保存和API归消费者；公共组件不计算阶段状态。
- 新Nidec CSS仅用于Fluent未提供的组合布局和连接线，全部位于`@layer nidec-ui`、`:where([data-nidec-ui])`宿主和`nidec-ui-`命名空间；颜色、字体、间距和状态均使用Fluent主题token，不叠加旧应用皮肤。
- Dark Mode、虚拟化、无限滚动、拖放、图片上传、业务BPF引擎和应用路由不在本批。

## Design System Gallery呈现标准

Gallery是开发和治理工具，不是生产业务组件。标准页面依次呈现：版本与候选身份、Foundations、组件族导航、代表状态与交互样例、响应式/无障碍证据、使用合同与反例、成熟度和采用记录。目录登记数、演示可见和迁移完成率必须分开报告；业务组合保留在应用，内部视觉原语逐步替换。

## 验证与退出条件

本批必须完成公共导出、SSR语义、事件/禁用、唯一阶段/current约束、CSS作用域与颜色检查、真实tgz消费者、1440/1280/900/720布局、键盘/焦点、严格CSP和axe扫描。自动扫描不等于完整WCAG或应用独立验收。资格完成前不得向Deployment提供安装候选。

回退只撤销本批新增导出、组件文件、样式、测试、fixture、资格路由和本记录，不影响既有基础组件候选。

## 实施与资格结果

- 公共合同已实现：`CollectionList`、`CollectionListItem`、`CardGallery`、`CardGalleryItem`、`ProcessStageIndicator`及对应类型；没有引入应用阶段名称、状态推导、权限、路由或API。
- 首轮`fluent-composite-patterns-1`在浏览器中发现Fluent上游实验性List的无标签隐藏复选框和嵌套交互错误，候选`37f5e520a6c85707da4ccb66ed37788d1f1c34db6a05724058da527a05d56dbf`被拒绝并保留为失败证据。
- 修正版`fluent-composite-patterns-2`两次Node 24独立恢复均通过16个测试文件/77项测试、类型、构建、CSS/颜色及七文件边界检查，产出逐字节一致的15546-byte候选：`.qualification/runs/fluent-composite-patterns-2/build-a/candidate.tgz`，SHA-256 `84172cf51ba15a8fd8b9bcd740cadd4ee2718e46ec3e3897dfd7047ae36db6fc`。
- Node 22以真实tgz安装的token-only、通用React/Vite及本批专用消费者均完成类型与生产构建；token-only消费者没有安装React/Fluent，React消费者验证单一React及Fluent解析。
- 浏览器实际视口1440/1280/900/720均无横向溢出；Gallery列数为4/4/3/3，响应式Stage在720切为纵向。显式标签选择框通过鼠标与Space键切换；阶段焦点顺序跳过禁用项，`aria-current="step"`保持唯一；激活只回传消费者事件。
- axe 4.13.0在最终视口扫描中为0 violation。桌面横向连接线区域的自动颜色判断为incomplete；运行时逐项计算最低对比度5.12:1，作为工具限制保留，不扩大为完整WCAG声明。严格nonce CSP下动态样式均带正确nonce；保留已隔离的`style-src-elem:inline:line-135`浏览器环境签名，未加入`unsafe-inline`。
- 资格目录共313项证据通过`SHA256SUMS.txt`回读；浏览器单独清单为`BROWSER-SHA256SUMS.txt`。本结果只证明共享包合成消费者技术资格，不批准发布、应用安装、迁移、独立验收或Production。
- 2026-09-08应Locke预览反馈，综合消费者补入Data Table型列表：6列表头、3条合成记录、长名称、三种状态Badge、更新时间与行操作；720等窄屏采用表格区域内部滚动，不扩大整页宽度。当前Node 22真实tgz消费者类型及生产构建通过，并完成本地视觉/语义检查。该补充只使用候选中已资格化的Table/Badge/Button接口，因此包字节与`84172cf5...db6fc`哈希不变；不把本次示例扩展描述为新的包发布或应用验收。
- 2026-09-08发布收口修正预览发现的Stage视觉问题：可交互范围由整列缩为内容边界，Fluent按钮采用透明外观，横向/纵向连接线从当前marker边缘开始并在下一marker边缘结束，不再穿过marker或由hover底色遮盖。该变更需要绑定`0.1.0-rc.1`新候选重新进行浏览器资格验证；旧`84172cf5...db6fc`证据不转移。

## 下一道门

共享主线的List、Gallery、Design System Gallery结构和中立Process Stage视觉合同已具备。后续采用必须由`Nidec App UI Deployment`基于应用实际清单决定安装范围；业务BPF引擎、状态映射、权限和跳转仍由各应用所有。任何应用反馈若揭示共享缺陷，回到本仓库统一修复并生成新候选，不在应用侧叠加旧皮肤。
