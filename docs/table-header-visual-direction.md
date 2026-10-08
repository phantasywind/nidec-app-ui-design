# Table header visual direction (selected, not implemented)

Locke selected this direction on 2026-09-30 after reviewing three image-based alternatives and a revision of the first alternative. This is a visual decision for a future shared UI candidate, not a change to the published `0.1.0-rc.4` package or current preview.

## Intended appearance

- Keep the compact header geometry, semibold dark labels, column alignment, table frame, white data rows and existing interaction contracts.
- Replace the current visibly gray/green-tinted header fill with an **extremely light neutral gray**, distinguishable from white rows without making the table look like a filled panel. The accepted mock used approximately `#f8f9f8`; this is an image-reference target, **not** a new approved raw component color or brand token.
- Retain the first alternative's thin green line across the bottom of the header row. Do not use a green fill, gradient, shadow or extra nested border.
- Apply the eventual shared treatment consistently to governed record Table/DataGrid headers and corresponding read-only and editable table headers where the same visual role is used. Group disclosure rows retain their distinct hierarchy; this decision does not redefine their state or controls.

## Implementation gate

The implementation must use the central theme/token ownership in ADR-0006, not a scattered literal color. First identify the correct semantic surface and divider roles; if existing roles cannot express the accepted appearance, propose the smallest central token/theme adjustment. Verify the result on the actual preview across Table, DataGrid, Editable Grid and Grouped Table, including focus/hover, sticky action columns and horizontal overflow. Recheck text and line contrast. Application data, selection, editing, sorting and navigation semantics remain unchanged.

No component code, theme token, consumer repository, release artifact or package version was changed by this decision record. Implementation, technical qualification, commit and publication remain separate future gates.
