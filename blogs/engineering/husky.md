---
title: Git Hooks & husky
date: 2022-02-13 20:05
tags:
  - husky
  - git hooks
categories:
  - 工程化
sidebar: "auto"
---
# Git Hooks & husky

Git Hooks 的实现其实非常简单，就是就`.git/hooks`文件下，保存了一些 shell 脚本，然后在对应的钩子中执行这些脚本就行了。比如下图中，这是一个还没有配置 Git Hooks 的仓库，默认会有很多`.sample`结尾的文件，这些都是示例文件

![Untitled](https://i.328888.xyz/img/2022/11/28/RnUL.png)

我们打开`pre-commit.sample`文件看一下其中的内容，大致意思是说这是一个示例，做了一些格式方面的检测，这个脚本默认是不生效的，如果要生效，把文件名改为`pre-commit.sample`即可

![Untitled](https://i.328888.xyz/img/2022/11/28/RDLk.png)

`pre-commit`这个钩子是在`git commit`命令执行之前触发

默认情况下， hooks 目录是`$GIT_DIR/hooks`，但可以通过`core.hooksPath`配置变量更改

## hooks

| Git Hook | 调用时机 | 说明 |
| --- | --- | --- |
| pre-applypatch | git am执行前 |  |
| applypatch-msg | git am执行前 |  |
| post-applypatch | git am执行后 | 不影响git am的结果 |
| pre-commit | git commit执行前 | 可以用git commit --no-verify绕过 |
| commit-msg | git commit执行前 | 可以用git commit --no-verify绕过 |
| post-commit | git commit执行后 | 不影响git commit的结果 |
| pre-merge-commit | git merge执行前 | 可以用git merge --no-verify绕过。 |
| prepare-commit-msg | git commit执行后，编辑器打开之前 |  |
| pre-rebase | git rebase执行前 |  |
| post-checkout | git checkout或git switch执行后 | 如果不使用--no-checkout参数，则在git clone之后也会执行。 |
| post-merge | git commit执行后 | 在执行git pull时也会被调用 |
| pre-push | git push执行前 |  |
| pre-receive | git-receive-pack执行前 |  |
| update |  |  |
| post-receive | git-receive-pack执行后 | 不影响git-receive-pack的结果 |
| post-update | 当 git-receive-pack对 git push 作出反应并更新仓库中的引用时 |  |
| push-to-checkout | 当`git-receive-pack对git push做出反应并更新仓库中的引用时，以及当推送试图更新当前被签出的分支且receive.denyCurrentBranch配置被设置为updateInstead时 |  |
| pre-auto-gc | git gc --auto执行前 |  |
| post-rewrite | 执行git commit --amend或git rebase时 |  |
| sendemail-validate | git send-email执行前 |  |
| fsmonitor-watchman | 配置core.fsmonitor被设置为.git/hooks/fsmonitor-watchman或.git/hooks/fsmonitor-watchmanv2时 |  |
| p4-pre-submit | git-p4 submit执行前 | 可以用git-p4 submit --no-verify绕过 |
| p4-prepare-changelist | git-p4 submit执行后，编辑器启动前 | 可以用git-p4 submit --no-verify绕过 |
| p4-changelist | git-p4 submit执行并编辑完changelist message后 | 可以用git-p4 submit --no-verify绕过 |
| p4-post-changelist | git-p4 submit执行后 |  |
| post-index-change | 索引被写入到read-cache.c do_write_locked_index后 |  |

**PS：完整钩子说明，请参考[官网链接](https://link.segmentfault.com/?enc=OY%2B1lJHzK6naPrE6FyQdpQ%3D%3D.qxQlhw4E5GkT2XiN1QLvbk9VuKYLImktU5%2FQl%2BuS2fJDpUbXhiaKmHpxTr%2BvGiJX)**

## **本地.git/hooks的缺陷**

【不能共享】由于`.git`文件夹是不会被git跟踪的，所以`.git/hooks`目录下的hooks钩子无法提交，就不能和他人共享钩子脚本。

如果我们使用了git hooks钩子，那就需要在代码库内共享钩子。针对这一问题，接下来我们看两种可方便指定git Hooks钩子的方式。

- [Husky](https://link.juejin.cn/?target=https%3A%2F%2Ftypicode.github.io%2Fhusky%2F)
- [yorkie](https://link.juejin.cn/?target=https%3A%2F%2Fgithub.com%2Fyyx990803%2Fyorkie)
- ghooks

## Husky

`Husky`可以将`git`内置的钩子暴露出来，很方便地进行钩子命令注入，而不需要在`.git/hooks`目录下自己写shell脚本了(通过设置git config core.hooksPath`/*)。您可以使用它来`lint`您的提交消息、运行测试、`lint`代码等。当你`commit`或`push`的时候。`husky`触发所有`git`钩子脚本。

### 安装

```tsx
//Install husky
npm install husky --save-dev
//Enable Git hooks
npx husky install
//To automatically have Git hooks enabled after install, edit package.json
npm pkg set scripts.prepare="husky install"
```

或者

```tsx
// package.json
{
  "scripts": {
    "prepare": "husky install"
  }
}
```

## 配置

书写配置文件，4.2.5 版本的 Husky 共支持以下几种格式的配置文件(基于cosmiconfig获取)：

- .huskyrc
- .huskyrc.json
- .huskyrc.yaml
- .huskyrc.yml
- .huskyrc.js
- husky.config.js
    - 顺序
        - a `husky` property in `package.json`
        - a `.huskyrc` file in JSON or YAML format
        - a `.huskyrc.json`, `.huskyrc.yaml`, `.huskyrc.yml`, `.huskyrc.js`, or `.huskyrc.cjs` file
        - a `husky.config.js` or `husky.config.cjs` CommonJS module exporting an object

**`.huskyrc`，在其中书写 json 格式的配置**，如下：

```tsx
//.huskyrc
{
  "hooks": {
    "pre-commit": "git restore -W -S dist examples/dist"
  }
}
```

v8现在只支持

- .husky文件夹
- 也可以自定义文件配置
    - 需要配置
        
        ```tsx
        //配置.config文件夹 package.json
        {
          "scripts": {
            "prepare": "husky install .config/husky"
          }
        }
        ```
        

`hooks`这个对象中，**key 就是钩子名，而 value 就是需要执行的命令**。上面这个配置的含义就是，在每次执行 `git commit`之前，都会把`dist`和`examples/dit`目录下的修改回滚（这两个目录就是编译产生的代码），就不用担心误把编译后的代码提交到仓库中了

上面我们只写了一条命令，如果想执行两条命令怎么办呢？比如我还想在`git commit`之前用 EsLint 检查一下代码质量，我们可以像下面这样写：

```tsx
{
  "hooks": {
    "pre-commit": "git restore -W -S dist examples/dist && eslint ."
  }
}
```

是的，就是这么简单。如果 EsLint 检测不通过，那么`git commit`是会被阻止的，就不用担心"垃圾代码"被提交到线上仓库了。

## 使用

### **创建一个hook**

使用 `husky add` 进行添加

```bash
npx husky add .husky/commit-msg 'npx --no-install commitlint --edit "$1"'
```

### **更新hooks脚本**

修改`.husky`文件夹下的`hooks`脚本即可。

![Untitled](https://i.328888.xyz/img/2022/11/28/RAgx.png)

### **调用hooks**

运行`git`时会自动调用`husky`添加的`hook`

### **卸载并还原husky**

```bash
npm uninstall husky
// 删除.husky文件夹，并且重置core.hooksPath
rm -rf .husky && git config --unset core.hooksPath
```

## ****Husky 注意事项****

Husky 让我们可以很方便的配置 Git Hooks，同时，也提供了一些实用方便的小技巧以及一些我们需要注意的点

### **不支持的钩子**

Husky 不支持服务端 Git 的钩子：

- pre-receive
- update
- post-receive

### 跳过钩子

可以使用-n/--no-verify 或者使用HUSKY环境变量

```bash
//-n/--no-verify
git commit -m "yolo!" --no-verify
```

```bash
HUSKY=0 git push # yolo!
```

### **跳过所有钩子**

有时你可能不想运行钩子，那么可以像下面这样跳过：

```
HUSKY_SKIP_HOOKS=1 git rebase ...
```

### **禁用自动安装**

如果你不想 Husky 为你自动安装钩子（比如 clone 了一个第三方的库，想要自己开发时），可以这样做：

```
HUSKY_SKIP_INSTALL=1 npm install
```
