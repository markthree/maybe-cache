# maybe-cache

管理电脑中的疑似缓存

<br />

## 动机

在用常规软件进行缓存清理时，可能会出现遗漏。

例如 `home` 目录下的 `AppData`，每次手动清理是费时费力的，管理电脑中的疑似缓存就变得必要了。

<br />

## 注意

目前该库只会扫描 `home` 的下 `AppData` 里所有路径以 `cache`，`updater` 和 `temp` 结尾的目录 🥵

该库会尽量找到电脑中的疑似缓存，但是很难保证不会误清重要数据 🤕

如果你在用该库，强烈你浏览一遍源码 👀

<br />

## 使用

### 安装

```shell
deno install --allow-env --allow-read --allow-write --unstable -rfn mcache https://deno.land/x/mcache/mod.ts
```

### 检索缓存

```shell
mcache --look
```

### 清理缓存

> 清理缓存需要先检索缓存，并生成临时文件

```shell
mcache --look --clear
```

<br />

## License

Made with [markthree](https://github.com/markthree)

Published under [MIT License](./LICENSE).
