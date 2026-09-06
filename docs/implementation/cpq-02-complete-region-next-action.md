# CPQ 02 后续验证协调包（尚未发送）

历史协调包：后续共享浏览器补验及交付冻结已完成，本文件的“仅请求验证、禁止当前接入”调度状态由 `cpq-02-complete-region-implementation.md` 取代。历史证据限制仍保留。新实施包仅用于四区域本地受控实现/模拟，不是发布或生产许可。

源任务已收到你的完整只读盘点，确认main及四个占用区域。Locke最新要求“继续直到02改造完成”。现有六阶段范围、业务边界及不新建worktree约束不变。

当前共享候选仍为5601字节，SHA256 `5f90a70c1e08724a2249f362cc0d29144f9350cc70f73b31148cd476b04573d6`，路径 `.qualification/runs/fluent-complete-region-1/build-a/candidate.tgz`，双独立恢复一致。consumer-retest-3完成token-only/React基础/完整区域三消费者原verify及安装文件、单React、精确Fluent检查。新增fixture焦点返回和nonce renderer接入不改候选字节；源码与锁证据保留。

当前不是安装许可：四视口、宿主验证及CSP完整结论还未封存。请先回传你是否可在共享仓库隔离消费者上承担剩余浏览器验证，不修改CPQ应用源/锁，不把候选装进CPQ。需要1440/1280/900/720实际视口；完整区域默认/hover/focus/disabled/readonly；实际CPQ宿主CSS下隔离与旧控件对照；弹层主题、Tab限制、关闭返回、背景不可交互、默认不提交/显式提交。测试环境不含登录/真实API/持久化。

共享fixture：`fixtures/react-complete-region-consumer`；实际已安装消费者：`.tmp/fluent-complete-region-1/consumer-node22/react-complete-region-consumer`。受限CSP服务 `scripts/fluent-browser-probe.mjs complete-region browser-N` 的N必须为新的运行号，禁止覆盖1—4记录。当前脚本绑定consumer-retest-3输出hash。测试工具不能凭修改CSS容器宽度冒充实际视口。

CSP调查：browser-2/3报告style-src-elem inline 135:93843，browser-4完全无脚本/样式的blank对照也出现同签名，故该签名不依赖Fluent；不能借此忽略其他报告。要区分renderer nonce、Provider主题、弹层和环境注入，不加unsafe-inline。独立查看环境若不存在该注入，可用于补证；实际部署CSP仍未知。

修复示例的焦点关键接入：Open editor使用精确Fluent9.74.7的useRestoreFocusTarget；先前漏接导致Escape返回旁边Open confirmation。修复后Escape/Cancel返回正确、正反Tab循环和保存计数通过。后续应用Drawer必须保留同类明确返回目标，不自造延时抢焦点。

全部证据收口后才向02交接安装步骤；不能从该协调包推断候选已合格。02改造完成的回传须包含四完整区域差异、未迁移项、focused/full/type/DS/build separation/build:app、实际宿主视口和交互、回退清单；独立验收仍单独登记。
