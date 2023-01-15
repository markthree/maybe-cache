import { walk } from "https://deno.land/std@0.172.0/fs/walk.ts";
import { resolve } from "https://deno.land/std@0.172.0/path/mod.ts";
import { homedir, platform } from "https://deno.land/std@0.172.0/node/os.ts";

export function slash(path: string) {
  return path.replace(/\\/g, "/");
}

export function findkHomeAppDataDir() {
  if (platform() !== "win32") {
    throw new Deno.errors.NotSupported(
      "非 windows 系统不支持",
    );
  }

  const HOMEDIR = homedir();

  if (HOMEDIR) {
    return slash(resolve(HOMEDIR, "AppData"));
  }

  throw new Deno.errors.NotFound("home 目录未找到");
}

function defaultFilter(name: string) {
  return true;
}

export async function walkFindMayBeCacheDirs(
  root: string,
  filter = defaultFilter,
) {
  const dirs = [];
  for await (const entry of walk(root)) {
    if (entry.isDirectory) {
      const { name, path } = entry;
      if (filter(name)) {
        dirs.push({ name, path: slash(path) });
      }
    }
  }
  return dirs;
}
