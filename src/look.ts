import { prettyBytes } from "https://deno.land/x/pretty_bytes@v2.0.0/mod.ts";
import type { ExtendWalkOptions, IDir } from "./fs.ts";
import { walkFindMayBeCacheDirs } from "./fs.ts";
import { findkHomeAppDataDir, slash } from "./path.ts";
import { fromFileUrl } from "https://deno.land/std@0.172.0/path/mod.ts";
import { ensureDir } from "https://deno.land/std@0.172.0/fs/ensure_dir.ts";
import {
  brightYellow,
  green,
} from "https://deno.land/std@0.170.0/fmt/colors.ts";

const TEMP_CACHE = slash(
  fromFileUrl(import.meta.resolve("../temp/cache.json")),
);

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
    skip: [/(ElevatedDiagnostics)$/],
  });
}

if (import.meta.main) {
  const APP_DATA_PATH = findkHomeAppDataDir();

  const dirs = await lookMayBeCacheDirs(APP_DATA_PATH, {
    log: true,
    size: true,
  });

  console.log();

  if (dirs.length > 0) {
    const total = createTotal(dirs);

    console.log(
      `🥵 total -> ${
        brightYellow(
          JSON.stringify(total).replace(/[{}'"]/g, "").replace(/,/g, " "),
        )
      }`,
    );

    console.log();

    if (confirm(`🤕 生成 ${brightYellow("临时文件")} 吗? `)) {
      ensureDir("temp");
      const cache = { total, list: dirs };
      await Deno.writeTextFile(TEMP_CACHE, JSON.stringify(cache, null, 2));

      console.log();

      console.log(`😃 生成成功: ${green(TEMP_CACHE)}`);
    }
  } else {
    console.log(`👋 ${green("未发现")}缓存目录`);
  }
}

function createTotal(dirs: IDir[]) {
  const total = {
    length: dirs.length,
  } as { size: number; length: number; bytes: string };

  total.size = dirs.reduce((size, dir) => {
    size += dir.size ?? 0;
    return size;
  }, 0);

  total.bytes = prettyBytes(total.size);

  return total;
}
