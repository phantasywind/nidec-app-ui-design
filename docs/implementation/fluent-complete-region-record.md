# 完整表单区域共享能力实施记录

状态：共享实现已完成首轮本地检查；制品消费者及浏览器资格验证进行中，未交付CPQ实施。

## 2026-09-06 连续推进及复测补充

Locke已接受5190共享示例的视觉，并授权六阶段连续推进；见 `fluent-six-phase-execution.md`，下文早期“再批准”的状态属于历史记录。CPQ尚未接入本候选，当前会话没有既有线程消息工具；已准备 `cpq-02-six-phase-handoff.md`，未发送。

`consumer-retest-1`独立保存原三个消费者verify复跑、manifest/lock/source/output哈希与安装制品逐文件校验，均通过；React/DOM各解析到同一19.2.7，Fluent9.74.7同一解析，token-only锁中无React/Fluent。这是原clean install上的复测，不冒充新的clean恢复，不覆盖原TS2882日志。

实际浏览器检查（1099×1165视口）发现Drawer Escape后两次返回Open confirmation而非Open editor。此时抽屉内部正反Tab循环正常，显式保存+1，但错误返回目标为真实缺陷。源fixture与已安装消费者均补入9.74.7正式导出的useRestoreFocusTarget，应用于打开按钮；未修改共享包字节、未关闭焦点管理、未新增非稳定公共API。类型与构建重跑通过，输出JS462.11kB/gzip128.18，CSS0.29kB/gzip0.18。

修正后实测：Escape→Open editor；Shift+Tab Close→Cancel，Tab Cancel→Close；受控Name可输入；Save locally计数0→1；Cancel关闭返回Open editor且计数仍1。对话框打开及Escape执行已检查，不宣称所有对话框焦点/背景测试完成。仅为工具驱动键盘证据，不冒充用户人工完整检查。四个指定实际视口、宿主CSS干扰、CSP、完整背景交互/负向扫描仍待完成。`consumer-retest-2`另存焦点补丁后的工程结果，原复测证据保留。

## 授权与起点

Locke对复盘下一步回复“按照下一步建议继续实施”，授权在共享库冻结接口、补齐能力并集中验证；应用接入仍待本轮结果汇报后的批准。不提交/推送/发布，不修改CPQ/EPM。

起点HEAD `f887348015dc4557e4a26836ae21b2f360f12b17`；已有未提交AGENTS、完整区域提案、roadmap三份文档修改保留。旧 `83d2722a…` 制品和封存证据不覆盖；新运行ID `fluent-complete-region-1`。回退只撤销本轮源接口、检查、测试、新fixture及记录增补，不恢复整仓、不覆盖用户文档。

## 冻结的本轮最小合同

- 原有Input/Field及选择族继续保留；普通单行Input明确进入完整区域示例，不再遗漏。
- Button保留文字children、原生button、默认type=button、事件/ref与禁用合同；有限增加上游appearance/size/shape/icon/iconPosition。没有href/as、多态链接、icon-only或虚构danger属性。加载演示可显式disabled+aria-busy+Spinner，不新增请求或业务状态协议。
- 有限转导出OverlayDrawer、DrawerHeader、DrawerHeaderTitle、DrawerBody、DrawerFooter及Props，用于保持右侧Sheet；不另造open/change协议、不导出不稳定hook。消费方显式position=end和受控open，现有Dialog仍用于确认，不替代右侧抽屉。
- 转导出MessageBar/Body/Title/Actions及Props；反馈intent由应用按既有业务决定，共享不推断错误或危险操作。
- 转导出Text、Body1、Caption1、Subtitle2及TextProps，Spinner及SpinnerProps。示例统一使用这些预设和medium控件，但不把演示尺寸写成全应用已批准默认值。
- 公共子路径、private/development、精确Fluent9.74.7及工具链不变。依赖仍外置，未新增依赖或改lock。颜色继续nidecLightTheme；不引入Dark Mode任务。

固定本地依赖声明从各包 `dist/index.d.ts` 核验；官方概念参考：[Drawer](https://fluent2.microsoft.design/components/web/react/core/drawer/usage)、[Button](https://fluent2.microsoft.design/components/web/react/core/button/usage)、[MessageBar](https://fluent2.microsoft.design/components/web/react/core/messagebar/usage)。官网的Preview标题不代替9.74.7实际发布接口证据。

## 当前实现与验证

后续打包回读：两次独立恢复分别完成53测试、类型/构建及包检查，5601-byte候选SHA256均为 `5f90a70c1e08724a2249f362cc0d29144f9350cc70f73b31148cd476b04573d6`，独立字节比较已通过。Node22真实消费者验证已启动；不据打包成功提前宣称浏览器通过。

用户尝试用 `file://` 打开fixture/index.html，无法直接运行React入口。现补充fixture启动说明，交付应为验证过的HTTP预览，不能把源码链接当成预览地址。此说明为冻结源之后的文档补充，不改变候选字节。

预览恢复结果：token-only和既有React消费者clean恢复/type/build已通过。新完整区域消费者首轮typecheck失败TS2882（缺少region.css副作用导入声明），日志保留在运行目录；新增标准 `src/vite-env.d.ts` 引用vite/client，同时补入该已安装的运行消费者后重跑原verify退出0。没有关闭类型检查或改候选；该fixture声明属于冻结快照后的明确补丁，原consumer-node22流程仍为失败退出，尚待整理补跑证据而非覆盖失败。

修正后示例production build为2129 modules，JS462.02kB/gzip128.15、CSS0.29kB/gzip0.18。用Node22在该运行消费者启动Vite preview，仅监听127.0.0.1:5190（工具session11073）；已在浏览器实际打开 `http://127.0.0.1:5190/` 并点击Open editor，确认右侧抽屉、普通Input、Textarea、Field错误/说明、选择、复选及保存取消可见，截图在工具输出中。此为页面可用性检查，不是完整键盘/四视口/宿主CSS或生产CSP资格验收；服务保留供用户查看。无CPQ修改。

更新src/index.ts、精确出口检查、上游identity测试、新增完整区域合同测试；新增独立 `fixtures/react-complete-region-consumer`，所有UI从包名导入，不设置源码alias；本地状态无API/登录/持久化。CSS只负责局部布局，无旧DS皮肤。颜色检查包含新fixture。

首轮本地 `npm run verify` 退出0：11测试文件/53测试、类型、构建、CSS及公共边界通过；当时新fixture及资格脚本后续调整尚未纳入该次完整运行，不能把该PASS当作最终源版本完整资格验证。新消费者的类型/构建、右侧抽屉焦点/关闭/背景隔离/窄屏、完整区域状态、真实宿主干扰及CSP仍需后续证据。

本轮不声称图标按钮、危险按钮或全站布局已交付；未实现能力不以相邻组件冒充。CPQ本批455测试与旧样式修复是其前一候选的证据，不可挪用为本次新制品验证。
