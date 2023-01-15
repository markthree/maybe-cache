import { findkHomeAppDataDir, slash } from "./path.ts";
import { resolve } from "https://deno.land/std@0.172.0/path/mod.ts";
import { ensureFile } from "https://deno.land/std@0.172.0/fs/mod.ts";

export const TEMP_CACHE = slash(
  resolve(findkHomeAppDataDir(), "cache.json"),
);

await ensureFile(TEMP_CACHE);
