# 目录与通用操作：共享技术候选交接

状态：TECHNICAL_CANDIDATE_RECORDED / APPLICATION_SCOPE_PENDING。此文件不是全应用安装或迁移指令。

## 唯一制品

- 包：`@phantasywind/nidec-app-ui-design@0.0.0-development`，private、未发布；Fluent精确`9.74.7`。
- SHA256：`304a5d85e96c42d941a1c602dbc98c9927d7ecd0513d735678402292d27f7ea0`，6066字节。
- 封存目录：`.qualification/deliveries/cpq-directory-actions-304a5d85/`；只能据manifest和SHA确认，不可凭同版本文件名猜测。
- 双Node24恢复打包一致；三Node22消费者复测、安装字节及单一React检查通过。原工作源、fixture修订、失败和浏览器对照分开记录。

## 共享合同与应用责任

| 能力 | 本批共享合同 | CPQ必须保持的原合同 |
| --- | --- | --- |
| IconButton / Tooltip | Fluent Button外观、必需可访问名称、默认非提交、禁用/ref/事件；提示不是名称替代 | 原图标含义、名称、allowedActions、触发范围；Edit/Void等业务判断仍留CPQ |
| Link | 上游链接接口，真实href语义 | 原路由、打开方式、权限和导航副作用 |
| TabList / Tab | 上游受控选中与键盘机制；事件value需要按应用合法值缩小 | scope/URL/页码/视图选择；不能把方向键移动焦点擅自改成业务请求 |
| Menu系列 | 上游打开/关闭、禁用与焦点机制 | 原动作的权限、确认、危险操作和事件冒泡；不凭共享示例发业务请求 |
| Combobox / Option / OptionGroup | 上游文本与选择事件；不创造统一value协议 | 区分自由搜索、固定选择、可清空选择；原空值、过滤、异步结果和IME合同 |

非freeform示例在失焦时会恢复既有选择，不得直接替换自由文本搜索，也不得未经确认改变空值payload。缺少应用语义时记Consumer Contract Pending，交02确认，不把业务规则迁入共享包。

## 样式边界

旧Gallery是视觉/交互基线，不是保留旧皮肤的要求。Fluent管理字体、字重、行高和size；不叠加旧`.ds-*`皮肤。

当前CPQ CSS复制对照中，Tab通过支持的className使用现有`nidec-ui-button`排除标记，Combobox通过input slot使用现有`cpq-nidec-native-control`排除标记，避免旧全局button/input规则。它们只是排除标记，不是新增视觉CSS；共享库没有导出CPQ命名或依赖CPQ样式。02仍须在真实容器中验证更高特异性/祖先/伪元素规则，不允许因示例通过省略应用检查。

## 有界验证及限制

菜单Escape返回、禁用项Enter不执行、IconButton键盘动作、Tabs、Combobox选择、Link及四实际视口已在本地组合页观察。保留Tabster哨兵aria-hidden-focus告警，不等于零违规或完整WCAG。nonce/strict/blank对照存在；部署CSP、OS输入法和独立应用验收未通过。

目录示例JS534402字节，不能把它与不同示例的差额当作CPQ体积增量。CPQ须在同一应用基线比较实际构建与交互请求。

## 02下一步回传与执行门

沿用既有`02 UI设计与前端实现`，不新建任务/分支/worktree。只读回传：当前main HEAD、文件占用、首个连贯目录/动作批次的确切路径、原事件/空值/导航/权限合同、所需验证和逐文件回退范围。尚未收到该回传，不能宣称安装已授权下发或实施完成。

确认有界合同后，本源任务依六阶段连续授权发出单独实施任务包；不需要逐控件批准，但不绕过证据门。CPQ修改由02执行，保护Sites最终lock和其他未提交改动，不重解锁React/Vite/TypeScript或回退已修复的工具链。Sites治理只保留用户确认的现有任务，本批不启动其工作。

禁止commit/push/publish/deploy、EPM、Dark Mode和业务/API/RBAC改变。回退只涉及本批适配、依赖新增及对应测试/记录；不整仓重置，保留历史与失败证据。
