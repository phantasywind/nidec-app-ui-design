# Date Picker 使用合同

`DatePicker` 用于选择一个日历日期，例如生效日、到期日或计划日期。共享包保留 Fluent 的输入框、日历弹层、键盘与焦点行为，不叠加旧控件皮肤。

## 公共入口

```tsx
import { DatePicker } from '@phantasywind/nidec-app-ui-design/date-picker';
import '@phantasywind/nidec-app-ui-design/styles.css';
```

消费应用必须精确安装与共享版本说明一致的 `@fluentui/react-datepicker-compat`；不得使用版本范围、Git 地址或运行时读取 Design System 仓库。

## 适用场景

- 一个字段只表达日历日期，不表达具体时刻或时区。
- 用户需要从日历选择，也可能需要键盘输入日期。
- 应用能够明确提供格式、解析、允许范围和本地化文字。

以下情况不得直接使用本合同：

- 日期时间、时区、班次或持续时间输入。
- 日期区间选择；应使用独立的起止日期组合并由应用校验先后关系，或另行治理范围控件。
- 只读摘要；应使用普通文本表达，而不是把禁用控件当作只读展示。
- 业务节假日、财务期间、工程冻结日或服务器权威有效期计算；这些规则仍由消费应用拥有。

## 值与格式

- 组件 UI 值为 `Date | null`；受控使用时以 `null` 表示没有值，避免 `undefined` 造成受控/非受控歧义。
- 日期字段跨 API、数据库或 URL 传输时，推荐使用不带时间的 `YYYY-MM-DD` 业务值。不要直接把本地日期调用 `toISOString()` 后截取日期，否则可能因时区改变日历日。
- 允许文字输入时，应用必须同时提供一致的 `formatDate` 与 `parseDateFromString`，并显示可理解的格式提示。
- `minDate`、`maxDate`、禁用日期、默认日期和“今天”的业务含义由应用决定；共享包不猜测这些规则。
- 本地化的月份、星期、首周规则和错误文字由应用按其语言环境提供，不在共享包中硬编码 CPQ、EPM 或其他领域词汇。

## 业务日期预设：BusinessDatePicker

无时区的业务日期（如交期）使用同一入口的 `BusinessDatePicker`。值为 `yyyy-MM-dd` 字符串或 `null`，显示为 `22 Oct 2026`，可键盘输入 `2026-10-22`、`22 Oct 2026`、`22 October 2026`，一周从周一开始，占位符为 `e.g. 22 Oct 2026`。转换不经过 UTC。入口同时导出 `businessDateToDate`、`dateToBusinessDate`、`formatBusinessDate`、`parseBusinessDate`。默认文字为英文；其他语言覆盖 `formatDate`、`parseDateFromString` 和 `strings`。表格行内使用 `size="small"`。

### 允许范围与手工输入

- `minDate` / `maxDate`：日历置灰，**手工输入超出范围时也拒绝**。Fluent 原生的做法是不改值、也不提示，输入框里留着用户的文字，保存时会悄悄存成旧值。`BusinessDatePicker` 在这种情况下把输入框标为无效（红色边框，`aria-invalid`），并调用 `onInvalidInput({ text, reason, value })`：`reason` 为 `out-of-bounds`（`value` 是解析出的日期）或 `invalid-input`（`value` 为 `null`）。应用把原因写进外层 `Field` 的 `validationMessage`；用户输入可接受的日期后无效标记自动清除。
- `calendar={{ maxDate }}`：只让日历置灰，手工输入照常接受，由服务端判断。只在“界面提示、服务端裁决”时使用。

```tsx
const [error, setError] = useState<string>();
<Field label="Actual date" validationMessage={error}>
  <BusinessDatePicker value={value} maxDate={today}
    onValueChange={next => { setError(undefined); setValue(next); }}
    onInvalidInput={({ reason }) => setError(reason === 'out-of-bounds' ? 'The date cannot be later than today.' : 'Enter a date such as 22 Oct 2026.')} />
</Field>
```

## 表单与交互

- 使用 `Field` 提供可见标签、提示和验证消息；图标不能替代字段名称。
- 日期选择、手工输入、清空和验证不得自动触发业务保存。应用在自己的表单或明确命令中提交。
- `disabled` 表示不可交互，不等同于只读；不可用原因应在必要时用邻近文字说明。
- 日期范围错误、必填、冲突、权限、并发和服务器拒绝均由应用处理并反馈。
- 日历弹层必须保留 Fluent 的键盘、焦点和门户行为；不要用全局 CSS 重写其内部结构。
- Fluent 的 Portal 必须与 `NidecProvider` 使用同一份 `@fluentui/react-shared-contexts` 实例，才能把主题变量带到弹层。采用工作区链接或本地源码预览的消费构建应去重该依赖；若弹层出现透明背景，应先检查 Portal 上的主题变量与依赖实例，而不是给日历内部硬编码颜色。

## 责任边界

共享包拥有 Fluent 版本绑定、公共导出、主题呈现和上述通用合同。消费应用拥有字段含义、数据持久化、时区解释、日期边界、节假日、权限、API、错误恢复和独立验收。
