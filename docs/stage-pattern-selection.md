# 阶段呈现模式选择规范

状态：已随不可变预发布版 `0.1.0-rc.2` 发布；应用仍须完成自身兼容性、独立验收与部署门。

## 目的

Nidec 应用中存在两种外观相近但业务含义不同的“阶段”呈现。本规范要求应用先确认交互语义，再选择组件；不得仅根据喜欢圆形还是箭头来选择。

## 选择规则

| 判断问题 | 应使用 | 原因 |
| --- | --- | --- |
| 用户点击某一项只是在同级页面、工作区或视图之间切换，不会改变业务流程状态 | `StageNavigator` | 它是可交互导航，行为接近 Tab。 |
| 当前阶段由服务端、审批结果、业务命令或状态机决定，用户不能直接跳到任意阶段 | `BusinessProcessFlow` | 它是只读流程呈现，不提供阶段点击接口。 |
| 点击阶段是否会改变业务状态尚未明确 | 暂不接入，记录 `Business Rule Pending` | Design System 不替应用推断业务规则。 |

最简单的判断方法：

- **只改变“用户正在看哪里”**：使用圆形编号的 `StageNavigator`。
- **代表“业务现在走到哪里”**：使用箭头形的 `BusinessProcessFlow`。
- **既要展示流程，又要执行推进动作**：箭头仍使用 `BusinessProcessFlow`；将“提交审批”“批准”“退回”等动作放在独立且明确标注的 Button 或 Menu 中，不把箭头变成按钮。

## `StageNavigator`：可点击的工作区导航

适用场景：

- 一个对象下面的 Definition、Parameters、BOM、Calculation 等同级工作区。
- 用户可以根据权限直接进入任意可用工作区。
- 切换只改变当前视图或路由，不自动写入新的业务生命周期状态。

应用必须负责：

- 提供唯一的阶段 `id`、名称、说明和当前状态。
- 实现 `onStageSelect`，并负责路由、选中状态和焦点后的页面内容。
- 决定哪些工作区禁用，以及切换前是否需要处理未保存内容。
- 保证鼠标、Enter 和 Space 最终执行相同的导航结果。

```tsx
<StageNavigator
  aria-label="Configuration workspaces"
  stages={workspaceStages}
  onStageSelect={(_, stage) => navigateToWorkspace(stage.id)}
/>
```

禁止：

- 用它显示审批、报价、发布等服务端生命周期，然后允许用户任意点击跳过业务规则。
- 在组件内部编码应用路由、保存、权限或 API 请求。
- 在整列外部再叠加一个更大的点击区域。

## `BusinessProcessFlow`：只读业务流程

适用场景：

- Quote、Approval、Release 等由业务状态机控制的真正 BPF。
- 当前阶段由服务端结果或应用权威状态决定。
- 用户只能通过明确的业务命令推进、退回或终止流程，不能点击箭头切换。

应用必须负责：

- 根据权威业务状态计算并传入 `completed`、`current`、`upcoming` 或 `error`。
- 负责允许的状态迁移、验证、RBAC、并发控制、持久化、API 和错误处理。
- 在组件之外提供明确的业务操作，并在成功返回后刷新阶段状态。
- 提供本地化的 `statusLabel`，让辅助技术理解每一步状态。

```tsx
<BusinessProcessFlow
  aria-label="Quote lifecycle"
  stages={serverReportedStages}
/>
```

禁止：

- 为箭头增加 `onClick`、链接、指针光标或透明按钮。
- 通过前端点击直接把某一步标为当前状态。
- 将状态迁移、权限判断或失败恢复逻辑复制到共享组件包。
- 在窄屏时隐藏、重排或折行改变流程顺序；组件会在自身边界内横向滚动。

## 兼容入口与迁移

旧的 `ProcessStageIndicator` 因为同时允许“可点击”和“只读”两种解释，已经标记为弃用，仅用于保持既有代码暂时可编译。新代码不得使用它。

迁移时必须先回答上述判断问题：

1. 如果它是同级导航，迁移为 `StageNavigator` 并保留应用导航合同。
2. 如果它是真正的生命周期，迁移为 `BusinessProcessFlow`，删除阶段点击入口，把业务动作放回应用拥有的 Button 或 Menu。
3. 如果语义不确定，停止迁移并由对应应用确认业务规则。

共享包只统一呈现和基础交互质量；阶段名称、流程定义、业务动作和应用验收始终由消费应用负责。
