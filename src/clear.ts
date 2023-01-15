import { exist } from "./fs.ts";
import type { IDir } from "./fs.ts";
import { TEMP_CACHE } from "./constant.ts";
import { createTotal, normalizeTotalString } from "./look.ts";
import { emptyDir } from "https://deno.land/std@0.172.0/fs/mod.ts";
import { cyan, green, red } from "https://deno.land/std@0.172.0/fmt/colors.ts";

export async function clear() {
  if (!(await exist(TEMP_CACHE))) {
    console.log();
    throw new Deno.errors.NotFound(
      `${red(TEMP_CACHE)} 不存在，请先执行 ${cyan("look")} 检索`,
    );
  }

  const dirs = JSON.parse(await Deno.readTextFile(TEMP_CACHE)).list as IDir[];

  console.log(dirs.length);

  const failDirs: IDir[] = [];
  const successDirs: IDir[] = [];

  for (const dir of dirs) {
    try {
      await emptyDir(dir.path);
      successDirs.push(dir);
      console.log(green(`├─ ${dir.bytes} - ${dir.path}`));
    } catch (_) {
      failDirs.push(dir);
      console.error(red(`├─ ${dir.bytes} - ${dir.path}`));
    }
  }

  if (failDirs.length > 0) {
    console.log();
    const failTotal = createTotal(failDirs);
    console.log(`❎ fail ->`, red(normalizeTotalString(failTotal)));
  }

  if (successDirs.length > 0) {
    console.log();
    const successTotal = createTotal(successDirs);
    console.log(
      `✅ success ->`,
      green(normalizeTotalString(successTotal)),
    );
  }
}

if (import.meta.main) {
  await clear();
}
