import { TEMP_CACHE } from "./constant.ts";
import { findkHomeAppDataDir } from "./path.ts";
import { walkFindMayBeCacheDirs } from "./fs.ts";
import type { ExtendWalkOptions, IDir } from "./fs.ts";
import { ensureFile } from "https://deno.land/std@0.172.0/fs/mod.ts";
import { prettyBytes } from "https://deno.land/x/pretty_bytes@v2.0.0/mod.ts";
import {
  brightYellow,
  green,
} from "https://deno.land/std@0.172.0/fmt/colors.ts";

export function lookMayBeCacheDirs(
  root: string,
  options: ExtendWalkOptions = {},
) {
  const { log = false, size = true } = options;

  return walkFindMayBeCacheDirs(root, {
    log,
    size,
    includeFiles: false,
    match: [/(cache|updater|temp)$/i],
    skip: [/(ElevatedDiagnostics)$/, /npm/],
  });
}

export async function look() {
  const APP_DATA_PATH = findkHomeAppDataDir();

  const dirs = await lookMayBeCacheDirs(APP_DATA_PATH, {
    log: true,
    size: true,
  });

  console.log();

  if (dirs.length > 0) {
    const total = createTotal(dirs);

    console.log(
      `๐ฅต total -> ${
        brightYellow(
          normalizeTotalString(total),
        )
      }`,
    );

    console.log();

    if (
      confirm(`๐ค ้่ฆ็ๆ${brightYellow("ไธดๆถๆไปถ")}ๅ? `)
    ) {
      await ensureFile(TEMP_CACHE);

      const cache = { total, list: dirs };
      await Deno.writeTextFile(
        TEMP_CACHE,
        JSON.stringify(cache, null, 2),
      );

      console.log();

      console.log(`๐ ็ๆๆๅ: ${green(TEMP_CACHE)}`);
    }
  } else {
    console.log(`๐ ${green("ๆชๅ็ฐ")}็ผๅญ็ฎๅฝ`);
  }
}

export interface ITotal {
  size: number;
  length: number;
  bytes: string;
}

export function createTotal(dirs: IDir[]) {
  const total = {
    length: dirs.length,
  } as ITotal;

  total.size = dirs.reduce((size, dir) => {
    size += dir.size ?? 0;
    return size;
  }, 0);

  total.bytes = prettyBytes(total.size);

  return total;
}

export function normalizeTotalString(total: ITotal) {
  return JSON.stringify(total)
    .replace(/[{}'"]/g, "")
    .replace(/,/g, " ");
}

if (import.meta.main) {
  await look();
}
