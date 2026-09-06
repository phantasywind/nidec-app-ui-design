# CPQ 02：阶段3目录与通用操作正式实施任务书

状态：READY_FOR_CONTROLLED_LOCAL_IMPLEMENTATION。此任务书在Locke批准的六阶段连续迁移范围内，取代本批先前“只读准备、不得安装”的限制，仅对下列明确范围生效。不是发布、部署或独立验收授权。

## 1. 制品与现场前置核验

唯一安装源（绝对路径）：

`D:\Documents\ChatGPT\GitHub Nidec App UI Design\.qualification\deliveries\cpq-directory-actions-304a5d85\candidate.tgz`

- SHA256：`304a5d85e96c42d941a1c602dbc98c9927d7ecd0513d735678402292d27f7ea0`；6066字节。
- 包：`@phantasywind/nidec-app-ui-design@0.0.0-development`，private未发布候选；Fluent必须精确`9.74.7`。本地离线tgz只限受控非生产验证，不改变正常发布版本政策。
- 完整技术证据：同目录`SHA256SUMS.txt`、`manifest.json`、`CANDIDATE.md`及`evidence/`，312项封存内容已回读。该技术manifest历史状态仍是scope pending；本任务书是后续范围决定，不重写原封存历史。
- 02先记录实际main HEAD、status、制品Hash、manifest/lock和文件占用。源任务本次只读观察HEAD为`69b506f423e4078d7cc3f2194d194bfafd25410b`，CPQ lock SHA256为`2e51a9304fc12a43336755f2d6248d1c60f158bb8fdb49bbaae6133399c6fe82`；若已变化，核验差异并继承最新合法基线，不恢复旧锁。
- 沿用`D:\Documents\Nidec Elevator CPQ`现有main，不创建任务、分支或worktree。用户已处理重复Sites任务，本任务不重新启动Sites治理。
- 保护包A/B安全升级及所有既有未提交改动。确认01/保留的Sites任务未占用依赖/node_modules/构建输出后，可安装精确候选并更新其引用。保留旧tgz和锁差异；不重解锁React、Vite、TypeScript或降级工具链，不用audit fix/force/legacy-peer-deps。

## 2. 本次允许实施的范围

以下路径均相对CPQ `client/src/`；只更换指定视觉控件，不重写页面业务。

| 页面 | 本批替换 |
| --- | --- |
| `pages/EnquiriesPage.tsx` | Scope切换、排序、List/Card视图按钮、分页；Active customer可搜索选择；既有Fluent EnquiriesSearchInput保持，不重复改搜索策略 |
| `pages/QuotesPage.tsx` | Scope/Queue切换、自由文本搜索、排序、List/Card视图按钮、分页；包含该页面现有pendingOnly分支 |
| `pages/ReviewsPage.tsx` | Scope切换、自由文本搜索、排序、分页 |
| `pages/ProjectBomQueuePage.tsx` | Queue切换和自由文本搜索；不新增原页面没有的分页/排序 |
| `pages/QuoteCommercialAddOns.tsx` | 行级Edit/Void图标按钮；保留现有编辑Drawer与change-reason流程 |

允许新增应用局部`integrations/nidec-ui/NidecDirectoryControls.tsx`、对应局部布局CSS/测试和`NidecIconButton`适配（可与该文件合理合并）。复用既有NidecProvider/主题、NidecInput/Select/Button；不为每个值变化重挂Provider。样式、尺寸、tone选择集中治理，不把CPQ业务协议放入共享包。

不全局替换`design-system/directory.tsx`或`controls.tsx`，避免影响本批未列出的BOM模板、选择定义Drawer及其他消费者。只改上述页面消费点；全局目录函数保留给尚未迁移页面，登记后续退役引用，不算本批失败。Gallery可增加/更新与本批有关的对照条目及已迁移调用来源；不得把全目录标记完成。对应现有测试、必要新页面测试和`docs/workstreams/02-ui-design.md`/本批证据允许更新。

Menu/Link已在共享技术候选中具备，但本次未识别到必须新增的菜单或需改变的链接合同，因此不为了用齐接口新增菜单、折叠动作或重写React Router链接；留待实际调用合同驱动后续批次。

## 3. 不得改变的行为合同

1. 搜索仍是自由文本Input，不使用非freeform Combobox替代。保持原250ms等现有防抖、trim/编码、page重置、请求参数、generation/乱序响应策略；不借迁移修订既有并发算法。
2. Scope/Queue映射只接受原合法值；切换执行原回调，保留scope/queue/page/URL及pendingOnly逻辑。用Fluent TabList/Tab时，方向键移动焦点、Enter/Space激活，不因单纯焦点移动额外发业务请求；补完整可访问关联，不强制重挂结果列表。
3. 视图按钮保留List/Card可访问名称及aria-pressed；分页保留页码文本、前后禁用条件和回调，不变更pageSize。表格、卡片、计数与行导航仍留在原业务组合。
4. Active customer原Combobox：键入时更新query并调用`onChange('')`清除customerId；按label/description的trim小写子串过滤；只在选择合法option时回填ID和label；保留loading/error禁用、无结果文案、required与表单payload。使用Fluent受控文本/selectedOptions/freeform等受支持接口实现相同行为，不能让失焦悄悄恢复旧ID、把自由文本作为ID、Enter误提交表单。先在旧实现保存行为测试，再在实际共享组件上复跑；不得mock掉共享Combobox证明接入。
5. Edit图标保留原aria名称和event.currentTarget返回焦点目标；Void保留canVoid/canEdit、change-reason/取消、服务器能力与错误处理，不把危险操作变成立即提交。键盘/点击不触发同行导航或双执行。danger使用现有集中语义主题，不散落原始颜色。
6. 不改创建Sheet、表单业务字段、API/DTO/RBAC、路由规则、服务端状态、客户数据或商业计算。若上游接口无法保持关键行为，记录并回传具体差异，停止受影响部分，不取消检查获得通过。

## 4. 外观与CSS排除

每个已迁移控件只使用Fluent外观和状态；旧DS类名不得附到Fluent根上。通过支持的slot/className加现有排除标记：Tab根`nidec-ui-button`、Combobox input `cpq-nidec-native-control`；复用已治理NidecInput/Select排除。标记不提供旧视觉，不隐藏Fluent箭头。

在真实祖先容器检查默认/hover/focus/disabled：background-image、伪元素、border、font/weight/line-height、min-height、padding和焦点指示。特别检查`.ds-directory-*`后代规则，不以共享CSS复制页通过替代现场检查。允许仅针对本批新局部容器的布局及旧装饰排除；若需要影响未迁移区域的全局CSS改动，先报告，不扩大范围。

## 5. 整批验证与交付

- 先建立/保存旧行为合同测试，替换后执行focused（目录、customer选择、Edit/Void、局部适配）、相关回归及串行完整client source测试；不使用全仓默认发现误收Node专用测试。
- 必须通过应用类型检查、`design-system:check`、`test:build-separation`和`build:app`；Node/依赖精确版本、退出码、失败重跑及large-chunk告警如实记录。保持Sites依赖不变，不运行发布/托管；必要构建占用与保留Sites任务串行。
- 真实tgz安装字节/Hash与共享证据一致；单一React/ReactDOM/Fluent解析，新增锁差异只归属候选及必要解析，包A/B不得回退。
- 本地模拟浏览器1440/1280/900/720：键盘、焦点、控件几何、Tab/选择弹出层主题、空值与禁用、原请求参数、行操作不误触。测试API仅mock，不登录/访问真实业务或发真实写入；不通过关闭CSP或unsafe-inline解决冲突。自动a11y扫描及负向保留原结果，已知sentinel例外不扩大。
- 比较同一CPQ构建基线的体积与初始/交互资源增量，不虚构预算；共享示例体积不是CPQ结果。
- 交付修改清单、前后HEAD/锁/制品Hash、测试结果、四视口证据、未完成限制、Gallery处置、回退说明和本地可看预览方法。状态可到LOCAL IMPLEMENTED / AUTOMATED VERIFIED / LOCAL SIMULATION VERIFIED，不能写独立验收或Production-ready。

本批完成后回传本UI Design任务并同步01。无需再等待只读合同转安装的批准，但若文件占用冲突、关键行为不兼容、制品校验失败或超出上述范围，先停止相关操作并报告。

## 6. 回退

仅回退此批五页面指定消费点、局部适配/对应测试与本次候选引用差异；恢复此前精确tgz，不覆盖包A/B工具链修改。保留所有原失败和新证据，不整仓reset、不删除他人未提交文件。未授权commit/push、部署、EPM或Dark Mode。
