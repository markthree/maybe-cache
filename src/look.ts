import { findkHomeAppDataDir, walkFindMayBeCacheDirs } from "./path.ts";

export function lookMayBeCacheDirs(root: string) {
  return walkFindMayBeCacheDirs(root, function (name: string) {
    return /cache|updater/.test(name);
  });
}

if (import.meta.main) {
  const APP_DATA_PATH = findkHomeAppDataDir();

  await lookMayBeCacheDirs(APP_DATA_PATH);
}
