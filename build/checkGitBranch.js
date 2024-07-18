import { spawnSync } from "node:child_process";
const { stdout } = spawnSync("git", ["status"]);
const targetBranch = getArg("branch");
const expMatch = stdout.toString().match(/On branch (\S+)/);
if (expMatch) {
  const currentBranchName = expMatch[1];
  if (currentBranchName !== targetBranch) {
    console.log(`该操作只能在${targetBranch}分支进行`);
    process.exit(1);
  }
}

function getArg(name) {
  const inputs = process.argv.slice(2);
  const match = inputs.find((item) => item.startsWith(`--${name}`));
  if (!match) {
    return null;
  }
  return match.replace(`--${name}=`, "");
}
