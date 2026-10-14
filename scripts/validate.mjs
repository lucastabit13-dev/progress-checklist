import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const read = relativePath => readFileSync(resolve(root, relativePath), "utf8");
const marketplace = JSON.parse(read(".agents/plugins/marketplace.json"));
const entry = marketplace.plugins?.find(plugin => plugin.name === "progress-checklist");

assert.equal(marketplace.name, "progress-checklist-local");
assert.ok(entry, "marketplace must list progress-checklist");
assert.equal(entry.source?.source, "local");
assert.equal(entry.source?.path, "./plugins/progress-checklist");
assert.equal(entry.policy?.installation, "AVAILABLE");

const pluginRoot = resolve(root, entry.source.path);
assert.ok(pluginRoot.startsWith(root), "plugin path must stay within the repository");
const manifest = JSON.parse(read("plugins/progress-checklist/plugin.json"));
assert.equal(manifest.$schema, "https://agent-plugins.org/schemas/1.0.0/plugin.schema.json");
assert.equal(manifest.name, entry.name);
assert.match(manifest.version, /^\d+\.\d+\.\d+$/);
assert.equal(manifest.license, "MIT");
assert.ok(manifest.extensions?.["com.openai"]?.interface?.displayName);
assert.ok(existsSync(resolve(root, "LICENSE")));

const skill = read("plugins/progress-checklist/skills/track-progress/SKILL.md");
assert.match(skill, /^---\r?\nname: track-progress\r?\ndescription: .+\r?\n---\r?\n/);
assert.match(skill, /normal assistant message/);
assert.match(skill, /final answer/);
assert.ok(!existsSync(resolve(pluginRoot, "mcp.json")), "this plugin is intentionally server-free");

console.log(`Progress Checklist ${manifest.version}: package checks passed.`);
