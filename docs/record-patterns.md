# 记录列表与表单的共用件

EPM 与 CPQ 各自写过一份的共用件，从这一版起由包提供。组件只负责外观和交互；数据、权限、保存、动作名称和业务含义仍归应用。

## 列表

| 组件 | 用途 | 要点 |
| --- | --- | --- |
| `RecordLink` | 行的唯一入口（身份列） | `href` 跳转到记录页，`onClick` 打开抽屉；两种外观相同：绿色、带下划线。身份列用 `weight="semibold"`。替代两边的 `RecordLink` / `RecordButtonLink`。 |
| `CountBadge` | 模块标题、页签后的数量 | 品牌色实心圆，0 也显示，不缩写成 99+。页签里用 `size="small"`。搜索时标题写成 “Matching …”，数量是匹配条数。 |
| `WorkspaceSection count` | 模块标题后的数量 | 内部用 `CountBadge`；数量含义不明显时加 `countLabel`。 |
| `ActiveBadge` | 主数据记录的 Active / Inactive | Active 浅绿，Inactive 灰。 |
| `RowEndStatus` | 行末状态 | 放在最后一列，左边是该列自己的值，右端是状态徽标，不单独占一列。这是 Locke 定的用法（2026-10-15），不算“一格两个字段”的例外。 |
| `EmptyState` | 列表没有行、或搜索没有匹配 | 一句话说明 + 可选提示 + 可选下一步（如 Clear filters）。 |
| `MoreActionsMenu` | 低频动作 | 主按钮之后一个 “More actions” 按钮；不可用的项置灰，并在项尾写原因（`disabledReason`）。 |

## 命令不可用时说明原因

规则（EPM 2026-10-11、CPQ 规则 4）：每个模块至少一个主按钮，按实际情况启用或禁用，**不隐藏**；不可用时说明原因，原因由服务端给出。

```tsx
<Button appearance="primary" disabled={!actions.release.allowed} disabledReason={actions.release.reason}>Release</Button>
<Button appearance="primary" disabled disabledReason="Resolve 2 missing quantities first" disabledReasonDisplay="inline">Approve</Button>
<TableActionIconButton aria-label="Delete" icon={<DeleteRegular />} disabled disabledReason="Used in 3 BOMs" />
```

- 默认：悬停或键盘聚焦时提示原因。按钮置灰但仍能聚焦，键盘用户也能看到原因。
- `disabledReasonDisplay="inline"`：原因常显在按钮下方。只用于推进流程的关键命令（审批、提交、发布），让人一眼看到为什么还不能做。
- 禁用的主按钮是中性灰（不再显示为浅绿），一眼可以看出不可点。

## 模块标题行放控件

“选择器 + 状态 + 操作”式的模块标题行（如 BOM Templates：模板下拉、版本下拉、状态徽标、Released by，右侧命令）用 `WorkspaceSection headerContent`：标题改为正文字号，控件与标题同一行，窄屏换行；命令仍放 `actions`。不要再用样式把标题字号改回正文。

## 表单

### FormGrid

```tsx
<FormDrawer …>
  <FormGrid>
    <Field label="Name" required><Input /></Field>
    <Field label="Platform" hint="…"><SingleSelectDropdown … /></Field>
    <FormGridItem wide><Field label="Notes"><Textarea /></Field></FormGridItem>
  </FormGrid>
</FormDrawer>
```

- 同一组字段同宽（默认 20rem，即抽屉字段宽度），每行顶部对齐：一个字段下的提示或错误不会把旁边的字段撑低。
- `columns` 为整行最多几列（页面里的长表单可用 2 或 3），空间不够时自动减少列数。长文本用 `FormGridItem wide` 占满一行。
- 输入框、下拉、日期、数字输入在网格里填满字段宽度；单位放进输入框（`BusinessNumberInput unit`）。必填星号只在字段标签上。

### BusinessNumberInput

```tsx
<BusinessNumberInput value={weight} onValueChange={setWeight} unit="kg" decimals={3} min={0} />
<BusinessNumberInput value={price} onValueChange={setPrice} unit="CNY" fixedDecimals />
```

- 值为 `number | null`，可以为空。输入时保留打出的文字，“0.”“1.7”“-” 不会被改回；只回调能用的数字。
- 不在焦点时显示千分位（`thousandsSeparator`，默认开）；`fixedDecimals` 让金额总是显示两位小数。可以直接粘贴 “12,000”。
- 离开字段时，无法识别或超出 `min` / `max` 的文字恢复为上一个值，并通过 `onInvalidInput` 告诉应用原因。
- 小的整数步进（如数量 1–10）仍可用 Fluent `SpinButton`；其他业务数字一律用本组件，不再用 `Input type="number"`。

## 变更历史

```tsx
<FormDrawer title="History" …>
  <ChangeHistoryTable aria-label="Component history" entries={entries} />
</FormDrawer>
```

- 每条：时间、操作人、动作、每个变化字段（旧值删除线灰色 → 新值）、原因（斜体）。时间格式和动作名称由应用给出。
- 历史放在 History 按钮后的抽屉里，不常驻页面。

## 未保存离开提醒

```tsx
<UnsavedChangesProvider>
  <App />
</UnsavedChangesProvider>

function ComponentForm() {
  useUnsavedChanges(isDirty);
  …
}

function StageTabs() {
  const { confirmDiscard } = useConfirmDiscard();
  const select = async (next: string) => { if (await confirmDiscard()) setStage(next); };
}
```

- 有任何表单上报未保存时：关闭或刷新浏览器标签会先询问；页内切换（页签、阶段、另一条记录）调用 `confirmDiscard()`，弹出 “Discard unsaved changes?”，默认焦点在 Keep editing。
- 路由跳转由应用接入，例如 React Router：

```tsx
const { hasUnsavedChanges, confirmDiscard } = useConfirmDiscard();
const blocker = useBlocker(hasUnsavedChanges);
useEffect(() => {
  if (blocker.state === 'blocked') void confirmDiscard().then(discard => (discard ? blocker.proceed() : blocker.reset()));
}, [blocker, confirmDiscard]);
```

- 长页面有未保存修改时，用 `StickySaveBar` 把保存条吸附在窗口底部；有未保存修改时推进命令置灰并说明原因（`disabledReason`）。

## 页内分组导航

`SectionNavigation` 的项可以显示 “已填 / 总数”（`count` + `total`，读屏文字用 `countLabel`），`sticky` 让导航在页面滚动时留在视野内（顶部偏移用 `--nidec-ui-section-navigation-top`）。不要再借用 `ApplicationNavigation` 并覆盖它的内部类名。

## 打印文档（规范，组件留待单独一轮）

Packing List、BOM List 这类打印 / 存 PDF 的文档暂由应用自己排版（Locke 2026-10-26 定为单独一轮做组件）。在此之前统一：

- 纸张 A4 纵向，`@page { size: A4 portrait; margin: 0 }`，页面内边距 12–15mm。
- 字体用应用的基础字体；正文 9–10pt，表头 9pt 粗体，页头标题 14pt。
- 表格线 0.5pt，颜色只用黑、灰（#000 / #666 / #bbb 一类），不用主题色；打印页不在应用外框里。
- 长表跨页时每页重复页头和表头，页脚写 “Page n of N”；屏幕上灰底预览，打印按钮不打印。
