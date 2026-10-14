---
name: track-progress
description: Create and maintain a visible to-do checklist for a task in the current conversation when the user asks to track progress, see steps completed, or use Progress Checklist.
---

# Track progress

When the user gives a task to track, break it into a short, concrete checklist. Show it in a normal assistant message using Markdown checkboxes (`- [ ]` and `- [x]`). Include a compact count such as `2/5 complete`.

As work proceeds, show the updated checklist in a new normal assistant message when a meaningful step changes state. Tool calls, command output, logs, and hidden reasoning do not count as showing the checklist to the user. If a tool or test establishes completion, report the updated checklist in the assistant message that follows. Include the latest checklist in the final answer when the task ends.

Mark an item complete only when the work is actually done or the user says it is done. Keep unfinished items unchecked. If the task changes, revise the list and explain the change briefly.

For a task the user is doing outside this chat, use their updates as the source of truth. For work the assistant performs, use the results of that work as the source of truth. Continue the task the user requested; the checklist is a progress view, not a substitute for doing the work.

The checklist lives in the conversation. It does not automatically observe external apps or update an earlier message in place. If the user wants to track a separate task, start a separate checklist with a clear title.
