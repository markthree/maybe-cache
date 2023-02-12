import { build, emptyDir } from "https://deno.land/x/dnt@0.33.1/mod.ts";

await emptyDir("./npm");

await build({
  entryPoints: ["./exports.ts"],
  outDir: "./npm",
  test: false,
  typeCheck: false,
  declaration: true,
  scriptModule: false,
  shims: {
    deno: true,
  },
  package: {
    name: "maybe-cache",
    type: "module",
    version: Deno.args[0],
    description: "管理电脑中的疑似缓存",
    license: "MIT",
    files: ["esm", "types"],
    repository: {
      type: "git",
      url: "git+https://github.com/markthree/maybe-cache.git",
    },
    bugs: {
      url: "https://github.com/markthree/maybe-cache/issues",
    },
  },
});

// post build steps
Deno.copyFileSync("LICENSE", "npm/LICENSE");
Deno.copyFileSync("README.md", "npm/README.md");
