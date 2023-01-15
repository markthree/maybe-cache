import { slash } from "../src/path.ts";
import { lookMayBeCacheDirs } from "../src/look.ts";
import { resolve } from "https://deno.land/std@0.172.0/path/mod.ts";
import { fromFileUrl } from "https://deno.land/std@0.172.0/path/mod.ts";
import { assertEquals } from "https://deno.land/std@0.172.0/testing/asserts.ts";

const fixture = fromFileUrl(import.meta.resolve("./fixture"));

Deno.test({
  name: "look",
  async fn() {
    const dirs = await lookMayBeCacheDirs(fixture);

    assertEquals(dirs, [{
      name: "cache",
      path: slash(resolve(fixture, "cache")),
    }, {
      name: "updater",
      path: slash(resolve(fixture, "updater")),
    }]);
  },
});
