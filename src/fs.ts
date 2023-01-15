import { slash } from "./path.ts";
import { walk } from "https://deno.land/std@0.172.0/fs/walk.ts";
import { gray } from "https://deno.land/std@0.170.0/fmt/colors.ts";
import type { WalkOptions } from "https://deno.land/std@0.172.0/fs/walk.ts";
import { prettyBytes } from "https://deno.land/x/pretty_bytes@v2.0.0/mod.ts";

export async function exist(path: string) {
  try {
    await Deno.stat(path);
    return true;
  } catch (error) {
    if (error instanceof Deno.errors.NotFound) {
      return false;
    }
    throw error;
  }
}

export type ExtendWalkOptions = { log?: boolean; size?: boolean };

export type WalkFindMayBeCacheDirsOptions = WalkOptions & ExtendWalkOptions;

export interface IDir {
  name: string;
  path: string;
  size?: number;
  bytes?: string;
}

export async function walkFindMayBeCacheDirs(
  root: string,
  walkOptions: WalkFindMayBeCacheDirsOptions,
) {
  const dirs = [];
  const { log = false, size = false } = walkOptions;
  for await (
    const entry of walk(root, walkOptions)
  ) {
    const { name, path } = entry;
    const dir = { name, path: slash(path) } as IDir;

    if (size) {
      const entrySize = await calcDirSize(path);
      const entryBytes = prettyBytes(entrySize);
      dir.size = entrySize;
      dir.bytes = entryBytes;
    }

    dirs.push(dir);

    if (log) {
      const output = size ? `${dir.bytes} - ${path}` : path;
      console.log(gray(`├─ ${output}`));
    }
  }
  return dirs;
}

export async function calcDirSize(root: string) {
  let total = 0;
  for await (const entry of walk(root)) {
    const { size } = await Deno.lstat(entry.path);
    total += size;
  }
  return total;
}
