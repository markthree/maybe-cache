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
