SegmentedControl is a compact choice between two or more mutually exclusive peer modes or views, where switching takes effect immediately.

Do not use it for workflow stages, persistent multi-select, boolean settings, navigation between unrelated destinations, or options with long explanations (use form radios). For a local input-source switch inside a field, use InlineModeTabs; for page navigation, use Tabs.

The consumer provides an accessible group label (`aria-label`), at least two unique options with text labels, the controlled `value`, and `onValueChange`. The application owns what each value means and what switching does.

- One neutral boundary surrounds all segments. The selected segment uses the shared brand roles; the static rendition shows `brand-soft` with `brand-strong` text.
- It defaults to small (24px items); pass the medium size for 32px.
- Do not place a legacy selected-button skin over it or restyle single segments with raw colours.
