---
name: track-progress
description: Create and maintain a visible to-do checklist for a task in the current conversation when the user asks to track progress, see steps completed, or use Progress Checklist.
---

# Track progress

When the user gives a task to track, reason through its desired outcome, work stages, dependencies, and verification before choosing checklist steps. Include enough concrete steps to make meaningful progress visible and to cover the actual work. A small task may need only a few steps; a multi-stage task needs a correspondingly more detailed list. Do not force unrelated work into one broad item, omit necessary validation, or add artificial steps just to make the list longer. Make each item a distinct, verifiable outcome rather than a command-by-command log.

Show the checklist in a normal assistant message using Markdown checkboxes (`- [ ]` and `- [x]`). Include a compact count such as `2/5 complete`.

Work through checklist items in order, one item at a time. Do not start the next item until the current item is complete or explicitly blocked. After completing or blocking each item, send a normal assistant message with the updated checklist before continuing. Mark only that item as complete in that update; do not silently skip items, combine separate items into one completion, or report multiple items as completed at once. If a dependency requires changing the order, update the checklist and explain why before proceeding. Tool calls, command output, logs, and hidden reasoning do not count as showing progress. Include the latest checklist in the final answer when the task ends.

Mark an item complete only when the work is actually done or the user says it is done. Keep unfinished items unchecked. If the task changes, revise the list and explain the change briefly.

For a task the user is doing outside this chat, use their updates as the source of truth. For work the assistant performs, use the results of that work as the source of truth. Continue the task the user requested; the checklist is a progress view, not a substitute for doing the work.

The checklist lives in the conversation. It does not automatically observe external apps or update an earlier message in place. If the user wants to track a separate task, start a separate checklist with a clear title.
