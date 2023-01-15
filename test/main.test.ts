import { slash } from "../src/path.ts";
import { calcDirSize } from "../src/fs.ts";
import { lookMayBeCacheDirs } from "../src/look.ts";
import { resolve } from "https://deno.land/std@0.172.0/path/mod.ts";
import { fromFileUrl } from "https://deno.land/std@0.172.0/path/mod.ts";
import { assertEquals } from "https://deno.land/std@0.172.0/testing/asserts.ts";
import {
  assertType,
  IsExact,
} from "https://deno.land/std@0.172.0/testing/types.ts";
import { prettyBytes } from "https://deno.land/x/pretty_bytes@v2.0.0/mod.ts";

Deno.test({
  name: "lookMayBeCacheDirs",
  async fn() {
    const FIXTURE = fromFileUrl(import.meta.resolve("./fixture"));
    const dirs = await lookMayBeCacheDirs(FIXTURE);

    assertEquals(dirs, [{
      name: "cache",
      bytes: "0 B",
      size: 0,
      path: slash(resolve(FIXTURE, "cache")),
    }, {
      bytes: "0 B",
      size: 0,
      name: "updater",
      path: slash(resolve(FIXTURE, "updater")),
    }]);
  },
});

Deno.test({
  name: "calcDirSize",
  async fn() {
    const size = await calcDirSize(".");

    const bytes = prettyBytes(size);
    assertType<IsExact<typeof size, number>>(true);
    assertType<IsExact<typeof bytes, string>>(true);
  },
});
