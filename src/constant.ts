import { slash } from "./path.ts";
import { fromFileUrl } from "https://deno.land/std@0.172.0/path/mod.ts";

export const TEMP_CACHE = slash(
  fromFileUrl(import.meta.resolve("../temp/cache.json")),
);
