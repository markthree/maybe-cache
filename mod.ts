export * from "./src/fs.ts";
export * from "./src/look.ts";
export * from "./src/path.ts";
export * from "./src/clear.ts";
export * from "./src/constant.ts";
export { look } from "./src/look.ts";
import { clear } from "./src/clear.ts";

import { parse } from "https://deno.land/std@0.172.0/flags/mod.ts";
import { look } from "./src/look.ts";

if (import.meta.main) {
  const args = parse(Deno.args, {
    boolean: ["look", "clear", "help"],
    default: {
      look: false,
      help: false,
      clear: false,
    },
    alias: {
      c: "clear",
      l: "look",
      h: "help",
    },
  });

  if (args.look) {
    await look();
  }

  if (args.clear) {
    await clear();
  }

  const shouldShowHelp = !(args.look || args.clear);
  if (args.help || shouldShowHelp) {
    printUsage();
  }
}

function printUsage() {
  console.log(`  maybe-cache (mcache): 管理电脑中的疑似缓存
  
  安装:
    deno install --allow-env --allow-read --allow-write --unstable -rfn mcache https://deno.land/x/mcache/mod.ts
  
  使用:
    mcache [选项]
  
  选项:
    -h, --help            查看帮助
    -l, --look            检索缓存
    -c, --clear           删除缓存`);
}
