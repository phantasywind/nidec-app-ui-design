# CPQ 02 完整区域接入实施指令

状态：任务包已准备，尚未发送/确认接收。此文取代此前“仅只读准备、等待源任务补浏览器证据”的调度要求；不改写那些历史失败或等待记录。

## 授权与交付范围

Locke已授权六阶段连续推进，并要求持续到02改造完成。现有证据支持进入四个已盘点区域的**本地受控实现与模拟验证**，不是发布/生产资格，也不是独立应用验收。02执行前须核对下述交付包完整性，保留尚未在应用环境验证的事项并完成应用门禁，不得用共享PASS替代。

只在CPQ现有main实施；重查HEAD/status/文件占用，保护69b506f…基线上已有四文件及适配层、全局CSS、测试和manifest/lock未提交改动。禁止创建worktree/分支，禁止commit/push/publish/deploy，不登录或访问业务数据；EPM/Dark Mode/API/RBAC/业务语义不在范围。

## 精确制品与证据

- 交付目录：`D:\Documents\ChatGPT\GitHub Nidec App UI Design\.qualification\deliveries\cpq-complete-region-5f90a70c`
- 文件：`candidate.tgz`，5601 bytes；包`@phantasywind/nidec-app-ui-design@0.0.0-development`，private开发候选，不可按这个版本号推断字节一致。
- SHA256：`5f90a70c1e08724a2249f362cc0d29144f9350cc70f73b31148cd476b04573d6`。
- Fluent保持精确9.74.7；React/DOM保持CPQ原锁19.2.7。不得重解锁原Vite/TypeScript/React工具链，不用源码alias、Git/main或同版本.pack替代。
- 安装前检查交付目录SHA256SUMS每一项、manifest、包内元数据和原双打包比较；安装后再次校验tarball和node_modules内共享文件，确认单一React解析及Fluent精确版本。
- 交付包含双恢复构建、固定源清单、三消费者复测及83份浏览器补验证据快照。测试日志保留原失败；fixture类型声明、焦点和nonce/宿主标记是冻结后消费方补丁，不改变包字节。

## 四区域动作

| 目标文件 | 本轮视觉接入 | 不得改变 |
| --- | --- | --- |
| AdminPlatformBuilderPage.tsx | Identity/New Draft/History区域的普通Input、Field、文字Button、Drawer及反馈；已迁移选择族复用 | 版本历史列、链接路由、允许动作、Clone/Blank、审计/并发/保存取消 |
| AdminPlatformDefinitionForm.tsx | 普通Input、Field、文字Button、消息/加载；既有Select/Checkbox收口 | 分组、治理选择、历史值、dirty/bulk save、数值min/step/空值/解析/验证规则；保留既有待决业务文案 |
| AdminFieldGovernancePage.tsx | 确认区域的文字Button、Drawer/Dialog、字段/反馈 | GovernanceMatrix/Summary组合、适用性、switch确认前行为、同步语义和结果文案 |
| QuoteCommercialAddOns.tsx | 普通/数值输入的视觉底座、Field、文字Button、Drawer和反馈；选择族复用 | IDs、canAdd/canEdit/canVoid、服务器合计、409/retry、add/edit/void业务合同 |

应用拥有的Grid/Stack、业务表格和治理矩阵等组合无需复制进共享包；其是否仍使用旧视觉皮肤必须如实登记。共享Button目前要求文字，未交付IconButton或新NumberInput业务协议。两个旧IconButton等未覆盖项单列至阶段3，不隐藏、不强塞无文字children、不宣布整页所有旧视觉均已退役。数值输入仅在保持既有解析/校验合同情况下换其视觉底座，不能以文本输入改变数值语义。

## 必须实施的集成边界

1. NidecProvider显式使用既有nidecLightTheme，保持实例/主题稳定；Fluent负责控件字体、字重、行高和size，不叠旧.ds-input等类或固定旧38px高度。
2. Input.input、Textarea.textarea、Select.select、Checkbox.input使用已有`cpq-nidec-native-control`标记及零特异性排除。实测不加标记会重现Select双箭头和38px污染。
3. 文字共享Button已有`nidec-ui-button`标记。仅对实际命中它的旧button选择器采用`:not(:where(.nidec-ui-button))`边界，保留其他选择器、未迁移按钮匹配与特异性。测试CSS转换仅作参考，不批量运行测试转换脚本重写生产样式。必须检查hover/focus/disabled及未迁移对照，不能隐藏Fluent箭头掩盖重叠。
4. Drawer使用明确返回目标（示例为精确Fluent的useRestoreFocusTarget）；受控open、右侧、焦点限制、Escape/Cancel、未保存内容和原确认行为保持。不得自造延时抢焦点。根据原场景选Drawer或Dialog，不把所有确认改成Sheet。
5. CSP若目标本地模拟环境有nonce，参考显式RendererProvider/createDOMRenderer的响应nonce接入。不得给CPQ全局添加unsafe-inline或放宽策略。共享空白页也出现的135:93843报告仅作环境对照，不能作为忽略其他拦截的理由；部署CSP仍不属于本轮通过声明。

## 完成、回传与回退

按完整批次运行focused、相关回归、serialized full client、tsc、design-system:check、test:build-separation及原build:app。真实包不得mock掉；默认不提交、显式提交、取消不写、ref/受控输入、只读/禁用/错误关联、初始焦点/Tab/Escape/返回、背景不可交互均需覆盖。在实际宿主CSS下做1440/1280/900/720、本地粘贴/清空/键盘、装饰/几何和未迁移对照；中文真实IME未做就明示，不编造PASS。

回传HEAD/占用、实际修改文件、artifact/lock哈希、控件替换与未迁移清单、完整命令结果/历史失败、预览启动方法、资源增量、CSP限制和回退清单。接口不兼容、误操作、焦点/请求/正常build失败须修复或报告，不取消检查。

回退只撤销本轮新增制品引用及明确增量，恢复原83d2722a…消费方式，保留既有用户修改和失败证据。不整仓reset，不删除在用适配和CSS。当前任务的完成状态为“02本轮实现与模拟验证完成，独立验收待执行”，不是阶段6退役完成。
