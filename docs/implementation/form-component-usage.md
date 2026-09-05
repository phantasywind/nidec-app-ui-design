# 基础表单组件使用约定（批次 01）

适用 Fluent 9.74.7 与本批指定共享制品。本文不替代各应用的业务规则、品牌主题批准或验收。没有业务必填、自动保存、权限或数据接口规则进入共享包。

| 组件 | 用途与接口 | 使用边界 |
| --- | --- | --- |
| Textarea | 多行文本；`onChange(event, data.value)`；支持 ref、readOnly、disabled | 只读与禁用不同；不要把只读文本改成不可聚焦的禁用控件 |
| Select | 原生 select/option；`onChange(event, data.value)` | 本批不是可搜索 Combobox，不另造选项加载或多选协议；原生 select 没有 readOnly 合同 |
| Checkbox | `checked: boolean \| 'mixed'`，事件保留 `data.checked` | mixed 不是 Switch 的值；父子选择、全选业务逻辑由应用负责 |
| RadioGroup + Radio | 同一组互斥选择；组级 `value`/`onChange(event, data.value)` | 用组标签、稳定 name/value；选项含义及默认选择由应用决定 |
| Switch | boolean 开关；`onChange(event, data.checked)` | UI 改变不等于业务保存或后端更新；异步副作用由应用负责 |

## 通用规则

- 使用 Field 提供可理解的文字标签、hint/error 关联；错误内容来自应用，不由共享组件臆定业务规则。
- 表单提交只由显式 `type="submit"` 触发；现有 Button 默认仍是 `type="button"`。控件切换不得隐含发业务写请求。
- 受控组件使用上游 data 载荷更新状态；保持 Provider、组件 identity 和主题稳定，不随每次输入重新挂载。
- 本批 Node 22 / TypeScript 7.0.2 / exactOptionalPropertyTypes 演示中，Fluent Textarea 对象 ref 出现上游 `Ref<never>` 推断限制；演示用类型安全的回调 ref 赋给本地 ref，保留 ref focus。共享导出不隐藏或改写上游 Props。新消费者若必须采用对象 ref，需要单独核对其编译配置，不能忽略实际源码类型错误。
- Provider 必须明确传入完整主题。官方浅/深主题仅是当前演示输入，不能称为 Nidec 品牌终稿。
- 2026-09-05 更新：已批准DS浅色基准后新增 `nidecLightTheme` 候选，显式传入Provider；浅色映射等待本轮统一评审，深色仍是官方参照。不要就地修改共享theme对象、不要在组件内逐项覆盖颜色；颜色变更走ADR-0006的集中配置及映射检查。
- Provider 不隔离应用的全局 CSS；应用接入时检查实际 input/select/textarea 和包装层样式。不要借复用旧类名向 Fluent 内部 DOM 强加整套旧控件样式。
- 不整库转导出 Fluent、不依赖内部路径、不暴露 unstable 扩展。应用明确安装精确 Fluent，React/ReactDOM/Fluent 不进入共享库 bundle。
- `disabled` 的原生表单行为和 `readOnly` 不同，应用若要保留提交值须按实际业务合同处理，不能在共享组件中偷偷补字段。

## 批次演示与验证

`fixtures/react-form-batch-consumer` 使用真实 `.tgz`，把五类控件与现有 Input/Field/Button/Dialog 一起检查。它没有真实业务 API，Submit demo 只增加内存计数。

统一检查整批属性/事件、禁用/只读、标签和错误关联、焦点、单选键盘、显式提交、弹窗和双主题；自动扫描不声明完整无障碍合规。按现有 ADR-0004 处理其精确范围内已接受的历史限制，但实际操作错误或源代码/正常构建失败不能豁免。

这一批通过共享库验证并汇报后，仍须 Locke 批准才能通知 CPQ 02 在 main 接入。未经明确批准不得新建 CPQ worktree，也不逐控件要求应用试装。
