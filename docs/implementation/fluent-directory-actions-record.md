# 阶段3：目录与通用操作共享批次

状态：共享技术候选已封存，02五页面指定实施正式回传已收到；本地自动验证通过，应用浏览器补证及独立验收待完成。详见`cpq-directory-actions-return.md`；下方交接中间态保留为历史，不覆盖旧证据。

最新范围决定：Locke转回02反馈，确认其只收到只读准备合同。本源任务已只读核验CPQ实际调用点，并在六阶段连续授权内生成`cpq-02-directory-actions-implementation.md`：Enquiries/Quotes/Reviews/ProjectBomQueue的指定目录控件，以及QuoteCommercialAddOns的Edit/Void。允许完成前置核验后安装精确304a5d85候选并受控实施，不再要求先重复只读回传；具体行为/占用/校验阻断仍有效。Menu/Link不为凑齐接口而新增业务交互。正式封存`.qualification/deliveries/cpq-directory-actions-implementation-1/IMPLEMENTATION.md`与manifest取代下方历史scope-pending限制，仅限任务书范围；原312文件技术候选不回写。尚未获02实际接收确认或安装结果，不声称已实施。

最新交接：Locke明确反馈02未收到工具消息，并已手动转交本文件。以此次手动转交为实际渠道，不再依据先前工具返回threadId认定接收。随后补充制品消息的调用也返回“No Codex thread found”；不再重复发送或创建替代任务。02的合同回传尚待收到，未开始新候选安装。

技术候选现已独立封存于`.qualification/deliveries/cpq-directory-actions-304a5d85/`，312文件逐项哈希回读通过，candidate仍为下述304a5d85。该目录`CANDIDATE.md`及本仓库`docs/implementation/cpq-directory-actions-candidate.md`列出公共合同、宿主标记、空值语义和02下一步要求；状态TECHNICAL_CANDIDATE_RECORDED / APPLICATION_SCOPE_PENDING。本条追加不回写既有不可变封存副本。

## 最新资格检查点

`fluent-directory-actions-1`冻结174项工作源，HEAD为`f887348015dc4557e4a26836ae21b2f360f12b17`，不是干净提交发行。两次独立Node24.20.0离线恢复各通过12文件59测试、类型/构建/CSS/边界和打包检查；9项允许归档文件、6066字节，逐字节一致。SHA256：`304a5d85e96c42d941a1c602dbc98c9927d7ecd0513d735678402292d27f7ea0`。比前一5f90a70c压缩包5601字节增加465字节；这不是应用加载增量。

Node22真实消费者验证完成（`consumer-retest-3`）：token-only、基础React、目录组合均通过严格应用类型/生产构建/安装字节/锁和单一React解析检查；React/DOM19.2.7、Fluent9.74.7。原始consumer阶段因Tab事件unknown失败，retest-1缩小到两个已声明ID后通过；retest-2因显式undefined不满足exactOptionalPropertyTypes失败，改条件展开后retest-3通过。失败全部保留；复测使用原干净安装，不冒称再次clean install。共享候选字节未改。

新增目录专用浏览器观察器与loopback探针绑定消费者dist逐项哈希；脚本在冻结之后新增，独立保存服务源码，不将它们冒充原174文件快照内容。`browser-1`绑定retest-1，`browser-2`绑定retest-3，不能交叉继承。

### 浏览器技术检查与限制

- IconButton Enter及Space各次本地计数、Tooltip描述关联、Link原生fragment导航；Menu键盘打开、动作执行、禁用项真实Enter不执行、Escape返回More actions。定位器拒绝向disabled项press的测试工具失败保留在会话，重新观察焦点后使用浏览器真实按键，未强制启用控件。
- Tabs方向键移动焦点，Enter激活对应panel；Combobox输入、选择、展开/Escape验证。非freeform模式清空后失焦恢复既有选择已观察到，这是必须显式评估的上游选择语义，不能把示例当作自由搜索/可清空选择合同；应用模式归02按既有行为确认。中文字符串填入不是OS输入法测试。
- 实际1440/1280/900/720、height900，无横向溢出；共享页及CPQ当前CSS复制对照均观察。browser-1未标记时Input min-height38px，Tab同样命中旧38px最小高度；browser-2通过支持的Tab className与Combobox input slot只添加现有排除标记，Input实际30.67px/min-height auto，Tab44px/min-height auto。无新旧皮肤叠加，无CPQ文件更改，不是CPQ全页面回归。
- 菜单portal继承绿色品牌变量`#007f3d`。axe4.13.0仍检出aria-hidden-focus，已回读节点均为data-tabster-dummy哨兵，与ADR-0004特征一致；保留为已知限制而非零违规，不自动赋予CPQ独立验收。无名称button负向可检出button-name。
- nonce正常模式生成规则；strict负向模式所有动态style规则0并有应用脚本来源CSP拦截。空白无脚本页仍复现inline135:93843环境签名，具体注入来源未知，不归因Fluent、不整体屏蔽报告。不放宽unsafe-inline。真实部署CSP未验证。
- 最新目录示例JS534402字节、CSS223、HTML373，JS较旧基础React示例407820字节多126582字节；不同场景内容，不是CPQ升级增量或预算判定。相同基础React示例本轮仍407820字节且同SHA，无未使用导出体积增长。初始与交互请求记录保留在各browser目录；未量化生产缓存/压缩/全应用加载。

### 当前交接状态

向既有02的工具已重新可用，本轮实际发送只读下一批文件/事件/空值合同确认消息，工具成功返回原threadId；一次状态读取超时单列为通信结果，未冒称02已回复。通知明确不得安装新候选、不建worktree、现有main、不改业务或依赖。待02确定精确应用范围后收口最终任务包；本checkpoint不是安装交付、完整阶段3结束或旧体系退役。共享代码、测试、工具及证据可继续，不请求重复批准已有六阶段范围。

收尾：checkpoint-1归档脚本预建dist与禁止覆盖复制冲突，失败目录保留；修正只预建父目录后checkpoint-2完成123文件哈希回读。归档后新增本通信尾注不包含在该不可变record副本中。发送工具成功之后，wait工具返回一次无可读匹配、read工具超时；list工具仍列出同ID的`02 UI设计与前端实现`、local、CPQ原目录。因此目前仅能确认发送调用成功，不能确认02已处理或回传，不重复发送同一任务、不假造回复。临时浏览器页已关闭、视口恢复；两个本地只读探针仍保留，未部署。

## 本批合同与边界

依据六阶段连续授权及02回传，集中补齐IconButton、Tooltip、Link、TabList/Tab、Menu/Trigger/Popover/List/Item/Divider、Combobox/Option/OptionGroup。所有有限转导出已从固定@fluentui/react-components9.74.7实际dist/index.d.ts核验；不以GitHub主分支代替发布接口，不整库导出，不加运行依赖。

IconButton复用Fluent Button渲染与现有ref/default type/disabled/事件桥接，但独立公共类型强制icon和aria-label，空白label运行时拒绝。不能用无名称图标按钮换掉旧动作，也不猜Edit/Void等业务标签。原Button文字children要求不变。链接保持上游语义，不把按钮强制变a；Tabs/Menu/Combobox保留原事件，不创造统一value协议。

CPQ保留分页、query、URL、scope/sort、路由、权限、allowedActions、选择和操作语义。表格/树表、Shell、服务端筛选、业务菜单及完整图标库不在本次共享实现范围；不引入Dark Mode。示例只用本地状态和中立标签。主题/样式仍由Fluent与既有显式Nidec主题负责。

官方概念参考：[Tabs](https://fluent2.microsoft.design/components/web/react/core/tablist/usage)、[Menu](https://fluent2.microsoft.design/components/web/react/core/menu/usage)、[Combobox](https://fluent2.microsoft.design/components/web/react/core/combobox/usage)、[Tooltip](https://fluent2.microsoft.design/components/web/react/core/tooltip/usage)。是否已交付由本地固定版本和制品证据决定，而非官网“Preview”标题。

## 验证与失败保留

新增6项合同测试和类型负向：图标按钮名称、非提交默认、显式提交/禁用/ref/事件、Fluent渲染、链接/Tabs、Combobox。第一轮类型检查失败两处测试写法：ref联合类型未缩小就调用，React createElement Option重载要求text；分别显式typeof判断和提供text后重跑，不关strict、不改上游声明。

最终真实打包/消费者/浏览器还需单独批次证据；当前源码自测不能自动证明02图标行操作或目录接入已通过。回退仅撤销本批接口、检查、测试、fixture和文档增补，不恢复整仓、不覆盖已交付旧候选。

本轮源verify已通过12文件59测试、类型/构建/CSS/出口边界。另新增独立`react-directory-actions-consumer`组合fixture，资格脚本为新run ID `fluent-directory-actions-1`纳入它；fixture本身还未进行真实tarball恢复、类型/生产构建及浏览器资格验证，不把源码59项PASS当作fixture已通过。没有新增依赖或修改锁，也没有CPQ改动/新候选安装通知。
