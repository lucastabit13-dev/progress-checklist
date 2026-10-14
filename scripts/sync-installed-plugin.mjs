import { spawnSync } from "node:child_process";
import { copyFile, mkdir, readdir, readFile, rm } from "node:fs/promises";
import { homedir } from "node:os";
import { dirname, join, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const packageRoot = join(projectRoot, "plugins", "progress-checklist");
const manifest = JSON.parse(await readFile(join(packageRoot, "plugin.json"), "utf8"));
const marketplaceName = "progress-checklist-local";
const cli = process.env.CODEX_CLI_PATH || "codex";

const install = spawnSync(cli, ["plugin", "add", `${manifest.name}@${marketplaceName}`, "--json"], {
  cwd: projectRoot,
  encoding: "utf8",
  windowsHide: true,
});

if (install.error) throw install.error;
if (install.status !== 0) {
  throw new Error(install.stderr.trim() || `codex plugin add exited with status ${install.status}`);
}

const jsonStart = install.stdout.indexOf("{");
if (jsonStart < 0) throw new Error(`Could not read the install result: ${install.stdout}`);
const installed = JSON.parse(install.stdout.slice(jsonStart));
if (installed.version !== manifest.version) {
  throw new Error(`Installed version ${installed.version} does not match project version ${manifest.version}.`);
}

const codexHome = process.env.CODEX_HOME || join(homedir(), ".codex");
const expectedInstallPath = resolve(
  codexHome,
  "plugins",
  "cache",
  marketplaceName,
  manifest.name,
  manifest.version,
);
const installedPath = resolve(installed.installedPath);
if (installedPath.toLowerCase() !== expectedInstallPath.toLowerCase()) {
  throw new Error(`Unexpected install path returned by Codex: ${installedPath}`);
}

async function mirrorDirectory(source, destination) {
  await mkdir(destination, { recursive: true });
  const sourceEntries = await readdir(source, { withFileTypes: true });
  const sourceNames = new Set(sourceEntries.map(entry => entry.name));

  for (const destinationEntry of await readdir(destination, { withFileTypes: true })) {
    if (!sourceNames.has(destinationEntry.name)) {
      await rm(join(destination, destinationEntry.name), { recursive: true, force: true });
    }
  }

  for (const entry of sourceEntries) {
    if (entry.isSymbolicLink()) throw new Error(`Symbolic links are not supported in the plugin package: ${entry.name}`);
    const sourcePath = join(source, entry.name);
    const destinationPath = join(destination, entry.name);
    if (entry.isDirectory()) await mirrorDirectory(sourcePath, destinationPath);
    else if (entry.isFile()) await copyFile(sourcePath, destinationPath);
    else throw new Error(`Unsupported plugin package entry: ${entry.name}`);
  }
}

async function assertDirectoriesMatch(source, destination) {
  const sourceEntries = (await readdir(source, { withFileTypes: true })).sort((a, b) => a.name.localeCompare(b.name));
  const destinationEntries = (await readdir(destination, { withFileTypes: true })).sort((a, b) => a.name.localeCompare(b.name));
  if (sourceEntries.length !== destinationEntries.length) {
    throw new Error(`Installed package contents differ at ${destination}`);
  }

  for (let index = 0; index < sourceEntries.length; index += 1) {
    const sourceEntry = sourceEntries[index];
    const destinationEntry = destinationEntries[index];
    if (sourceEntry.name !== destinationEntry.name || sourceEntry.isDirectory() !== destinationEntry.isDirectory()) {
      throw new Error(`Installed package contents differ at ${destination}`);
    }
    const sourcePath = join(source, sourceEntry.name);
    const destinationPath = join(destination, destinationEntry.name);
    if (sourceEntry.isDirectory()) await assertDirectoriesMatch(sourcePath, destinationPath);
    else if (!((await readFile(sourcePath)).equals(await readFile(destinationPath)))) {
      throw new Error(`Installed file differs from project source: ${sourceEntry.name}`);
    }
  }
}

await mirrorDirectory(packageRoot, installedPath);
await assertDirectoriesMatch(packageRoot, installedPath);
console.log(`Progress Checklist ${manifest.version} installed and verified against ${packageRoot}`);
