import { slash } from "./path.ts";
import { walk } from "https://deno.land/std@0.172.0/fs/walk.ts";
import type { WalkOptions } from "https://deno.land/std@0.172.0/fs/walk.ts";

export type ExtendWalkOptions = { log?: boolean; size?: boolean };

type WalkFindMayBeCacheDirsOptions = WalkOptions & ExtendWalkOptions;

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
