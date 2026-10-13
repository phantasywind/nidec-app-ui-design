SegmentedControl is a compact choice between two or more mutually exclusive peer modes or views, where switching takes effect immediately.

Do not use it for workflow stages, persistent multi-select, boolean settings, navigation between unrelated destinations, or options with long explanations (use form radios). For a local input-source switch inside a field, use InlineModeTabs; for page navigation, use Tabs.

The consumer provides an accessible group label (`aria-label`), at least two unique options with text labels, the controlled `value`, and `onValueChange`. Option values must be non-empty; `value` must match an option, or be `null` when nothing is selected yet. For an "All" choice, add it as a real option with its own value. The application owns what each value means and what switching does.

- One neutral boundary surrounds all segments. The selected segment uses the shared brand roles; the static rendition shows `brand-soft` with `brand-strong` text.
- It defaults to small (24px items) for toolbars and dense regions; pass `size="medium"` (32px) when it sits beside medium inputs, for example in a filter bar.
- Do not place a legacy selected-button skin over it or restyle single segments with raw colours.
