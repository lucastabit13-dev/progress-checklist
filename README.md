# Progress Checklist

Progress Checklist is a server-free plugin for ChatGPT and Codex. It turns a task into a short checklist, then posts an updated checklist in the chat as steps are completed.

## Install through npm

Published on npm as [@lucastabit13/progress-checklist](https://www.npmjs.com/package/@lucastabit13/progress-checklist), version 0.3.1. Registry installation and packaged marketplace files have been verified.

Requires Node.js 20 or newer and a Codex CLI with plugin support on PATH.

```sh
npm install -g @lucastabit13/progress-checklist
progress-checklist install
```

The explicit install command registers the marketplace inside the npm package, then installs the plugin. Restart the desktop app and open a fresh chat to use it. On Windows the installer uses codex.exe; set CODEX_BIN to the full Codex executable path if it is not on PATH.

To update, run the same two commands again. Keep the npm package installed while using its local marketplace. Run `progress-checklist path` to print the marketplace root for manual registration. npm installation alone does not activate the plugin.

To remove the plugin, run `codex plugin remove progress-checklist@progress-checklist-local`, then `codex plugin marketplace remove progress-checklist-local` and `npm uninstall -g @lucastabit13/progress-checklist`.


## Example

```text
Prepare a presentation — 1/3 complete
- [x] Draft the outline
- [ ] Build the slides
- [ ] Rehearse
```

The checklist appears in normal assistant messages. Tool logs and command output do not count as a progress update. The plugin uses a packaged skill, so it needs no HTTPS server, API key, or account connection.

## Install from GitHub

Requirements: the ChatGPT desktop app or Codex with plugin support, and the `codex` CLI available in your terminal.

Register the GitHub marketplace:

```sh
codex plugin marketplace add lucastabit13-dev/progress-checklist
codex plugin add progress-checklist@progress-checklist-local
```

Restart the ChatGPT desktop app. Open the Plugins Directory, find **Progress Checklist**, and make sure it is enabled. In a new chat, select it from the composer or type `@Progress Checklist` where plugin mentions are available. You can also ask for a progress checklist directly; an installed skill may be selected automatically when relevant.

The marketplace identifier is `progress-checklist-local` for compatibility with earlier installations, even when the marketplace is hosted on GitHub.

### Install from a local clone

```sh
git clone https://github.com/lucastabit13-dev/progress-checklist.git
cd progress-checklist
codex plugin marketplace add .
codex plugin add progress-checklist@progress-checklist-local
```

Use the actual clone URL and folder name. You can also install through the desktop Plugins Directory after adding the marketplace.

### Update or remove

After a new version is pushed to GitHub:

```sh
codex plugin marketplace upgrade progress-checklist-local
codex plugin add progress-checklist@progress-checklist-local
```

Start a new chat to load the refreshed skill. To uninstall it:

```sh
codex plugin remove progress-checklist@progress-checklist-local
```

## Use it

Select Progress Checklist and say:

> Make a checklist for preparing my presentation and keep it updated as we work.

For a task you do outside the chat, report completed steps, such as “The outline is done.” For work ChatGPT or Codex performs, it updates steps only after the work is actually done. You can ask it to add, remove, or reorder steps.

## What this version does not do

- It does not edit an earlier message; each progress update appears in a new assistant message.
- It does not provide clickable checkboxes or a persistent cross-chat task database.
- It cannot observe external apps or detect completion without your update or another available integration.

## Repository layout

```text
.agents/plugins/marketplace.json       GitHub and local marketplace catalog
plugins/progress-checklist/plugin.json  Plugin identity and display metadata
plugins/progress-checklist/skills/track-progress/SKILL.md
scripts/validate.mjs                    Dependency-free package check
.github/workflows/validate.yml          GitHub Actions check
```

## Develop

Edit the skill or manifest, then run:

```sh
node scripts/validate.mjs
```

The validator needs Node.js 20 or newer and installs no packages. For a local installation whose marketplace points to this project directory, run the sync helper after changing package files:

```sh
node scripts/sync-installed-plugin.mjs
```

The helper reinstalls the plugin from `progress-checklist-local`, mirrors the project package into the installed version directory, and checks the installed version against `plugin.json`. This keeps the project files as the source of truth. For a GitHub marketplace install, run the marketplace update commands above instead. Bump the version in `plugin.json` for a release.

## Publish this project on GitHub

Create an empty GitHub repository, copy this folder's contents to its root (including the hidden `.agents` and `.github` directories), commit, and push. The repository is then installable with the GitHub commands above. No hosted application or deployment service is needed. This is GitHub distribution, separate from submitting to OpenAI's public Plugins Directory.

The source is licensed under [MIT](LICENSE). See [OpenAI's plugin packaging guide](https://developers.openai.com/plugins/build/plugins) for the current marketplace format and installation flow.
