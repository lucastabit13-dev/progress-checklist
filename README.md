# Progress Checklist

Progress Checklist is a server-free plugin for ChatGPT and Codex. It turns a task into a short checklist, then posts an updated checklist in the chat as steps are completed.

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

After this repository is published to GitHub, replace `OWNER/REPO` with its actual GitHub path:

```sh
codex plugin marketplace add OWNER/REPO
codex plugin add progress-checklist@progress-checklist-local
```

Restart the ChatGPT desktop app. Open the Plugins Directory, find **Progress Checklist**, and make sure it is enabled. In a new chat, select it from the composer or type `@Progress Checklist` where plugin mentions are available. You can also ask for a progress checklist directly; an installed skill may be selected automatically when relevant.

The marketplace identifier is `progress-checklist-local` for compatibility with earlier installations, even when the marketplace is hosted on GitHub.

### Install from a local clone

```sh
git clone https://github.com/OWNER/REPO.git
cd REPO
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

The script needs Node.js 20 or newer and installs no packages. Test the plugin in a new chat after reinstalling it from the local marketplace. Bump the version in `plugin.json` for a release.

## Publish this project on GitHub

Create an empty GitHub repository, copy this folder's contents to its root (including the hidden `.agents` and `.github` directories), commit, and push. The repository is then installable with the GitHub commands above. No hosted application or deployment service is needed. This is GitHub distribution, separate from submitting to OpenAI's public Plugins Directory.

The source is licensed under [MIT](LICENSE). See [OpenAI's plugin packaging guide](https://developers.openai.com/plugins/build/plugins) for the current marketplace format and installation flow.
