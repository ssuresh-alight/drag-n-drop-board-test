# Bug: Card Animation During Drag Not Working

## Issue Description

When dragging a task card over a lane, cards below the insertion point should smoothly animate downward to make visual space for the placeholder. Currently, the animation is not working as expected:

- Cards animate but with incorrect offset
- The preview card takes up space, but cards below animate as if there is an extra offset after it
- The preview card is added instantly and causes layout shifts, thus taking up space immediately and throwing off the animation offsets.

## Current Behavior

- Placeholder element is inserted into the DOM at the correct position and takes up physical space
- This causes cards below it to shift down due to normal flexbox layout flow
- Additionally, `shift-down` class is applied to cards below the placeholder
- This applies ANOTHER `transform: translateY(calc(var(--card-height) + var(--gap)))` on top of the layout shift
- Result: Cards move down twice as far as needed (double offset) - once from layout, once from transform

## Expected Behavior

When a placeholder is inserted:

1. Cards below the placeholder should smoothly translate downward over ~200ms
2. When placeholder moves to a different position, cards should smoothly return to original position
3. Animation should be visible and smooth, providing clear visual feedback
4. No jumpy or jarring movements
5. Cards should move by exactly one card height + gap spacing (not double)

## Root Cause Analysis

**Confirmed cause**: The placeholder element takes up physical space in the flexbox layout, which automatically pushes cards below it downward. Then, the `shift-down` transform is applied on top of this, creating a double offset.

**Why this happens**:

1. Placeholder is inserted with `min-height: var(--card-height)` and normal display
2. Flexbox layout immediately shifts cards below by that height + gap
3. `shift-down` class adds `translateY(calc(var(--card-height) + var(--gap)))` transform
4. Total offset = layout shift + transform = 2× the intended movement

This explains why cards animate too far down when the placeholder appears.

## Affected Code

- `fe/style.css` - `.card` transition rules and `.shift-down` class
- `fe/scripts/ui/kanbanBoard.js` - Logic for applying/removing `shift-down` class

## Reproduction Steps

1. Open the kanban board in a regular browser (Chrome, Firefox, etc.)
2. Start dragging a task card
3. Move it over another lane above existing cards
4. Observe: cards below the placeholder animate downward by TOO MUCH (double the expected distance)
5. The double offset is visible - cards move further than the placeholder's visual size

## Success Criteria

- Cards animate by the correct offset amount (one card height + gap, not double)
- Cards visibly and smoothly animate downward when placeholder appears above them
- Animation timing is ~200ms with ease-out easing
- Animation works consistently in all major browsers
- No visual glitches, jumps, or layout issues
- Performance remains smooth (no jank)
- Placeholder and card movements are visually synchronized

## Proposed Solutions

### Option 1: Remove shift-down transform (Simplest - RECOMMENDED)

Remove the `shift-down` class logic entirely. Let the placeholder's physical space naturally push cards down with CSS transitions on all layout changes. Cards will smoothly transition to their new positions as the placeholder is inserted/removed.

**Pros**: Simple, works with flexbox naturally, minimal code changes  
**Cons**: Need to ensure CSS transitions work on layout changes

### Option 2: Zero-height placeholder with transforms

Make placeholder have `height: 0` or `position: absolute` so it doesn't affect layout, then use transforms exclusively to create visual space.

**Pros**: Complete control over animation  
**Cons**: More complex positioning logic needed

### Option 3: Negative transform to compensate

Keep current approach but apply negative `translateY` to cards BEFORE placeholder is inserted, then remove it to animate back to natural position.

**Pros**: Maintains transform-based animation  
**Cons**: Complex state management, harder to get right

### Option 4: Absolute positioning during drag

Change cards to `position: absolute` during drag operations, calculate exact Y positions, and animate between them.

**Pros**: Full control over positions  
**Cons**: Significant refactoring, layout calculations required

### Option 5: Transition on flex-grow/order

Use flexbox order property or grid row and transition those instead of transforms.

**Pros**: Works with layout flow  
**Cons**: Limited browser support for transitioning these properties

## Priority

**P1 (High)** - Core UX feature that significantly impacts perceived polish and usability.

## Notes

- Current implementation works functionally (cards move to correct positions after animation)
- Issue is the double-offset during animation: placeholder takes layout space + transform adds more
- **Recommended approach**: Option 1 (remove shift-down, rely on layout transitions)
- VSCode Simple Browser has other drag issues, but this affects regular browsers too
- Root cause has been identified and confirmed through testing
