import {
  brightYellow,
  cyan,
  green,
} from "https://deno.land/std@0.170.0/fmt/colors.ts";
import { fromFileUrl } from "https://deno.land/std@0.172.0/path/mod.ts";
import { ensureDir } from "https://deno.land/std@0.172.0/fs/ensure_dir.ts";
import { findkHomeAppDataDir, slash, walkFindMayBeCacheDirs } from "./path.ts";

const TEMP_LIST = slash(fromFileUrl(import.meta.resolve("../temp/list.json")));

export function lookMayBeCacheDirs(root: string, log = false) {
  return walkFindMayBeCacheDirs(root, {
    log,
    includeFiles: false,
    match: [/(cache|updater|temp)$/i],
    skip: [/(ElevatedDiagnostics)$/],
  });
}

if (import.meta.main) {
  const APP_DATA_PATH = findkHomeAppDataDir();

  const dirs = await lookMayBeCacheDirs(APP_DATA_PATH, true);
  console.log();

  if (dirs.length > 0) {
    console.log(`🥵 查询到缓存目录 ${cyan(String(dirs.length))} 条`);

    console.log();

    if (confirm(`🤕 生成 ${brightYellow("临时文件")} 吗? `)) {
      ensureDir("temp");
      await Deno.writeTextFile(TEMP_LIST, JSON.stringify(dirs, null, 2));

      console.log();

      console.log(`😃 生成成功: ${green(TEMP_LIST)}`);
    }
  } else {
    console.log(`👋 ${green("未发现")}缓存目录`);
  }
}
