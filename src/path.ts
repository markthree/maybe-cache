import { walk } from "https://deno.land/std@0.172.0/fs/walk.ts";
import { resolve } from "https://deno.land/std@0.172.0/path/mod.ts";
import type { WalkOptions } from "https://deno.land/std@0.172.0/fs/walk.ts";
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

type WalkFindMayBeCacheDirsOptions = WalkOptions & { log?: boolean };

export async function walkFindMayBeCacheDirs(
  root: string,
  walkOptions: WalkFindMayBeCacheDirsOptions,
) {
  const dirs = [];
  const { log = false } = walkOptions;
  for await (
    const entry of walk(root, walkOptions)
  ) {
    const { name, path } = entry;
    const dir = { name, path: slash(path) };

    dirs.push(dir);

    if (log) {
      console.log(dir);
    }
  }
  return dirs;
}
