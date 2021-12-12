---
title: 常用git指令以及区别
date: 2021-04-21 21:11:09
tags:
 - git
categories:
 -  git
sidebar: auto
publish: true
---

# Git

### 一、版本控制

版本控制的英文名称为（Version Control System），主要有以下几个作用。

* 记录文件的所有历史变化

* 错误恢复到某个历史版本

* 多人协作开发编辑同一个文件

---

### 二、常见的版本控制器

![image-20210919215124616](/Users/liyang105/Library/Application Support/typora-user-images/image-20210919215124616.png)

[详情传送门](https://blog.csdn.net/weixin_39723352/article/details/81606082)

---

### 三、Git和SVN的区别

##### 3.1.SVN（Subversion） 集中式版本控制

![img](https://images2018.cnblogs.com/blog/872610/201806/872610-20180607181118124-1073082108.png)

> 集中式的版本控制系统都有一个单一的集中管理的服务器，保存所有文件的修订版本，而协同工作的人们都通过客户端连到这台服务器，取出最新的文件或者提交更新。

![img](https://images2017.cnblogs.com/blog/63651/201709/63651-20170904213634085-673206677.png)

*  每个版本库有唯一的URL（官方地址），每个用户都从这个地址获取代码和数据；获取代码的更新，也只能连接到这个唯一的版本库，同步以取得最新数据。
*  所有的版本数据都保存在服务器上，协同开发者从服务器上同步更新或上传自己的修改。
*  用户的本地只有自己以前所同步的版本，必须联网工作，如果不连网的话，用户就看不到历史版本，也无法切换版本验证问题，或在不同分支工作。
*  提交并非每次都能够成功。如果有其他人先于你提交，会提示“改动基于过时的版本，先更新再提交”… 诸如此类；冲突解决是一个提交速度的竞赛：手快者，先提交，平安无事；手慢者，后提交，可能遇到麻烦的冲突解决。
*  所有数据都保存在单一的服务器上，有很大的风险这个服务器会损坏，这样就会丢失所有的数据，若备份不及时会有数据丢失的风险。且任何人在过程中都无法提交、更新代码。

---

##### 3.2.GIT 分布式版本控制

![img](https://images2018.cnblogs.com/blog/872610/201806/872610-20180607181112091-2125687140.png)

> 每一个开发人员的电脑上都有一个Local Repository，所以即使没有网络也一样可以Commit，查看历史版本记录，创建项 目分支等操作，等网络再次连接上Push到Server端。

![img](https://images2017.cnblogs.com/blog/63651/201709/63651-20170904214244944-1222535795.png)

* 所有版本信息仓库全部同步到本地的每个用户，这样就可以在本地查看所有版本历史
* 可以离线在本地提交，只需在连网时 push 到相应的服务器或其他用户那里。
* 你完全可以在脱离Git服务器所在网络的情况下，如移动办公／出差时，照常使用代码库，你只需要在能够接入Git服务器所在网络时，PULL和PUSH即可完成和服务器同步以及提交。由于每个用户那里保存的都是所有的版本数据，只要有一个用户的设备没有问题就可以恢复所有的数据，但这增加了本地存储空间的占用。
* 团队的成员将自己的改动推（PUSH）到服务器的版本库中，当其他人和版本库同步（PULL）时，会自动获取改变
* Git提供 rebase 命令，可以让你的改动看起来是基于最新的代码实现的改动

[存储方式、分支、版本号、内容完整性、版本库和工作区的区别](http://www.ttlsa.com/svn/five-basic-difference-between-git-and-svn/)

[GIT和SVN的区别传送门](https://www.cnblogs.com/Sungeek/p/9152223.html)

---

![image-20210912165852622](/Users/liyang105/Library/Application Support/typora-user-images/image-20210912165852622.png)

* Workspace：工作区，就是平时进行开发改动的地方（vsCode），是当前看到最新的内容，在开发的过程也就是对工作区的操作。
* Index：暂存区，当执行 `git add` 的命令后，工作区的文件就会被移入暂存区，暂存区标记了当前工作区中那些内容是被 Git 管理的，当完成某个需求或者功能后需要提交代码，第一步就是通过 `git add` 先提交到暂存区。
* Repository：本地仓库，位于自己的电脑上，通过 `git commit` 提交暂存区的内容，会进入本地仓库。
* Remote：远程仓库，用来托管代码的服务器（iCode、github），它提供web服务的 供大家方便下载、查看、提交、存储。文件的状态，本地仓库修改完代码后通过 `git push` 命令同步代码到远程仓库。

---

### 四、GIT基本操作

> 1.在工作区开发，添加，修改文件。
> 2.将修改后的文件放入暂存区。
> 3.将暂存区域的文件提交到本地仓库。
> 4.将本地仓库的修改推送到远程仓库。

##### 4.1.git add

添加文件到暂存区

```javascript
# 添加某个文件到暂存区，后面可以跟多个文件，以空格区分
git add xxx
# 添加当前更改的所有文件到暂存区。
git add .
```

---

##### 4.2.git commit 

```javascript
# 提交暂存的更改，会新开编辑器进行编辑
git commit 
# 提交暂存的更改，并记录下备注
git commit -m "you message"
# 等同于 git add . && git commit -m
git commit -am


修改前一次提交的方法
# 对最近一次的提交的信息进行修改,这种方式可以比较方便的保持原有的Change-Id
# 此操作会修改commit的hash值
git commit --amend


git reset HEAD ^
#重新修改
git add .
git commit -m  “MSG”
```

---

##### 4.3.git pull

```javascript
# 从远程仓库拉取代码并合并到本地，可简写为 git pull 等同于 git fetch && git merge 
git pull <远程主机名> <远程分支名>:<本地分支名>
# 如果远程分支是与当前分支合并，则冒号后面的部分可以省略：
git pull origin master
```

---

##### 4.4.git fetch

与 `git pull` 不同的是 `git fetch` 操作仅仅只会拉取远程的更改，不会自动进行 merge 操作。对你当前的代码没有影响

```javascript
# 获取远程仓库特定分支的更新
git fetch <远程主机名> <分支名>
# 获取远程仓库所有分支的更新
git fetch --all
```

[git pull和git fetch的区别](#pull&fetch)

---

##### 4.5.git branch

```javascript
# 新建本地分支，但不切换
git branch <branch-name> 
git checkout -b = git branch + git checkout
# 查看本地分支
git branch
# 查看远程分支
git branch -r
# 查看本地和远程分支
git branch -a
# 删除本地分支
git branch -D <branch-nane>
# 重新命名分支
git branch -m <old-branch-name> <new-branch-name>
```

---

### 五、GIT进阶操作

##### 5.1.git merge

* （-ff）fast-forward

	当前分支合并到另一分支时，如果没有冲突需要解决，就会直接移动文件指针。这个过程叫做fast forward。

	举例来说，开发一直在master分支进行，但忽然有一个新的想法，于是新建了一个develop的分支，并在其上进行一系列提交，完成时，回到 master分支，此时，master分支在创建develop分支之后并未产生任何新的commit。此时的合并就叫fast forward。

	--ff是指fast-forward命令。当使用fast-forward模式进行合并时，将不会创造一个新的commit节点。默认情况下，git-merge采用fast-forward模式。

	![image-20210920225833045](/Users/liyang105/Library/Application Support/typora-user-images/image-20210920225833045.png)

* —no-ff (no-fast-foward)，使得每一次的合并都创建一个新的commit记录。即使这个commit只是fast-foward，用来避免丢失信息。

<img src="/Users/liyang105/Library/Application Support/typora-user-images/image-20210920220141539.png" alt="image-20210920220141539" style="zoom: 50%;" />

![image-20210920225900695](/Users/liyang105/Library/Application Support/typora-user-images/image-20210920225900695.png)

---

##### 5.2.git rebase

rebase 翻译为变基，他的作用和 merge 很相似，用于把一个分支的修改合并到当前分支上。

![image-20210921115340655](/Users/liyang105/Library/Application Support/typora-user-images/image-20210921115340655.png)

假设我们现在有2条分支，一个为 master，一个为 feature/1，他们都基于初始的一个提交 add readme 进行检出分支，之后，master 分支增加了 3.js 和 4.js 的文件，分别进行了2次提交，feature/1 也增加了 1.js 和 2.js 的文件，分别对应以下2条提交记录。

此时，对应master分支的提交记录如下。

![image-20210913105642144](/Users/liyang105/Library/Application Support/typora-user-images/image-20210913105642144.png)

feature/1 分支如下图：

![image-20210913105711937](/Users/liyang105/Library/Application Support/typora-user-images/image-20210913105711937.png)

结合起来看是这样的

![image-20210913105731215](/Users/liyang105/Library/Application Support/typora-user-images/image-20210913105731215.png)

此时，切换到 feature/1 分支下，执行 `git rebase master`，成功之后，通过 `git log` 查看记录。

如下图所示：可以看到先是逐个应用了 mater 分支的更改，然后以 master 分支最后的提交作为基点，再逐个应用 feature/1 的每个更改。

![image-20210913105758204](/Users/liyang105/Library/Application Support/typora-user-images/image-20210913105758204.png)

所以，我们的提交记录就会非常清晰，没有分叉，上面演示的是比较顺利的情况，但是大部分情况下，rebase 的过程中会产生冲突的，此时，就需要手动解决冲突，然后使用依次 `git add ` 、`git rebase --continue ` 的方式来处理冲突，完成 rebase 的过程，如果不想要某次 rebase 的结果，那么需要使用 `git rebase --skip ` 来跳过这次 rebase 操作。

[git merge和git rebase区别](#merge&rebase)

---

##### 5.3.git cherry-pick

 获取指定的 commit

`git cherry-pick` 可以理解为”挑拣”提交，和 merge 合并一个分支的所有提交不同的是，它会获取某一个分支的单笔提交，并作为一个新的提交引入到你当前分支上。当我们需要在本地合入其他分支的提交时，如果我们不想对整个分支进行合并，而是只想将某一次提交合入到本地当前分支上，那么就要使用 `git cherry-pick` 了。

如下场景，以下有三条分支，feature/cherry-pick1 和 feature/cherry-pick2 都是基于 master 检出的两条功能性分支，对应的分支 log 记录如下

<img src="/Users/liyang105/Library/Application Support/typora-user-images/image-20210913220702268.png" alt="image-20210913220702268" style="zoom: 50%;" />

<img src="/Users/liyang105/Library/Application Support/typora-user-images/image-20210913220727779.png" alt="image-20210913220727779" style="zoom: 50%;" />

master 分支的提交如下

<img src="/Users/liyang105/Library/Application Support/typora-user-images/image-20210913220755865.png" alt="image-20210913220755865" style="zoom: 50%;" />

现在 master 只需要 feature/cherry-pick1 和 feature/cherry-pick2 有关 change 的修改，并不关心有关 fix 内容的修改。此时就可以用 cherry-pick 指令了。

> 语法： `git cherry-pick [commit-hash]`

commit-hash 表示的是某次 commit 的 hash 值。

现在，在mastter分支上依次执行以下两条指令 `git cherry-pick e0bb7f3`、`git cherry-pick c9a3101`，过程中，如果出现冲突，解决冲突后 进行 `git add `，接着执行 `git cherry-pick --continue`，最后，master 上的提交如下

<img src="/Users/liyang105/Library/Application Support/typora-user-images/image-20210913220853123.png" alt="image-20210913220853123" style="zoom: 50%;" />

此时，master 分支上应用了需要的提交，就达到了我们想要的效果。如果需要多个 cherry-pick 需要同步到目标分支，可以简写为  `git cherry-pick <first-commit-id>...<last-commit-id>`，这是一个左开右闭的区间，也就时说 `first-commit-id` 提交带来的代码的改动不会被合并过去，如果需要合并过去，可以使用 `git cherry-pick <first-commit-id>^...<last-commit-id>`，它表示包含 `first-commit-id` 到 `last-commit-id` 在内的提交都会被合并过去。

---

##### 5.4.git revert

> `git revert` 撤销某次操作，此操作不会修改原本的提交记录，而是会新增一条提交记录来抵消某次操作。
>
> 语法： `git revert <commit-id>` 针对普通 commit
>
> `git revert <commit-id> -m` 针对 merge 的 commit

当讨论 revert 时，需要分两种情况，因为 commit 分为两种：一种是常规的 commit，也就是使用 `git commit` 提交的 commit；另一种是 merge commit，在使用 `git merge` 合并两个分支之后，你将会得到一个新的 merge commit

merge commit 和普通 commit 的不同之处在于 merge commit 包含两个 parent commit，代表该 merge commit 是从哪两个 commit 合并过来的。

<img src="https://segmentfault.com/img/bV2hqE?w=2000&h=408" alt="clipboard.png" style="zoom:150%;" />

在上图所示的红框中有一个 merge commit，使用 `git show` 命令可以查看 commit 的详细信息

```javascript
➜  git show bd86846
commit bd868465569400a6b9408050643e5949e8f2b8f5
Merge: ba25a9d 1c7036f
```

这代表该 merge commit 是从 ba25a9d 和 1c7036f 两个 commit 合并过来的。

而常规的 commit 则没有 Merge 行

```javascript
➜  git show 3e853bd
commit 3e853bdcb2d8ce45be87d4f902c0ff6ad00f240a
```

* 回退常规commit

回滚某次提交，revert撤销一个提交的同时会创建一个新的提交。这是一个安全的方法，因为它不会重写提交历史。比如下边的命令将会查出倒数第二次（即当前commit的往前一次）提交的修改，并创建一个新的提交，用于撤销当前提交的上一次 `commit`。

<img src="http://justcode.ikeepstudying.com/wp-content/uploads/2016/03/06.png" alt="img" style="zoom:50%;" />

下面就用一个案例来理解一下这个命令，如下图所示，假设被红框框起来的地方是会引起 bug 的一次提交，在他的提交之后，又进行了2次提交，其中包含了其它同事的提交。

<img src="/Users/liyang105/Library/Application Support/typora-user-images/image-20210913224522330.png" alt="image-20210913224522330" style="zoom:67%;" />

此时想把引起提交的 bug 的干掉，执行 `git revert 1121932`，执行操作后，再打开查看日志，如下图所示，可以看到是新增了一条 commit 记录，这个 commit 的产生的 msg 是自动生成的，Revert 开头，后面跟撤回的 commit-msg 信息 之前的 commit 记录并没有消失，此时也达到了代码回退的效果

<img src="/Users/liyang105/Library/Application Support/typora-user-images/image-20210913224601643.png" alt="image-20210913224601643" style="zoom:67%;" />

此外 git revert 也可以回滚多次的提交

语法：`git revert [commit-id1] [commit-id2] ...` 注意这是一个前开后闭区间，即不包括 commit1 ，但包括 commit2 。

* 回退 merge commit

revert merge commit 有一些不同，这时需要添加 `-m` 选项以代表这次 revert 的是一个 merge commit<img src="/Users/liyang105/Downloads/img.png" alt="img" style="zoom:150%;" />

```javascript
git revert
```

报错：xxx is a merge but no -m option was given

 这是因为你revert的那个commit是一个merge commit，它有两个parent，git不知道base是选哪个parent，就没法diff，所以就抱怨了，所以你要显示告诉Git用哪一个parent。

我们要在master分支上 revert feature分支上的内容，即 **保留主分支，应该设置主分支为主线**，操作如下：

```javascript
➜ git revert -m 1 bd86846
```

从 git show 命令的结果中可以看到

```javascript
➜  git show bd86846commit bd868465569400a6b9408050643e5949e8f2b8f5Merge: ba25a9d 1c7036f
```

merge commit 的 parent 分别为 ba25a9d 和 1c7036f，其中 ba25a9d 代表 master 分支（从图中可以看出），1c7036f 代表 will-be-revert 分支。需要注意的是 -m 选项接收的参数是一个数字，数字取值为 1 和 2，也就是 Merge 行里面列出来的第一个还是第二个，看在哪个分支上做的merge操作。

[详情见](https://segmentfault.com/a/1190000012897697)

---

##### 5.5.git reset

用于撤销未被提交到远端的改动。除了可以移动当前分支的HEAD，你可以通过不同的标记选择修改 staged snapshot 或者 working directory。

<img src="http://justcode.ikeepstudying.com/wp-content/uploads/2016/03/02.png" alt="img" style="zoom:50%;" />



* --soft： staged snapshot 和 working directory 都未被改变 (建议在命令行执行后，再输入 git status 查看状态)

	撤销提交记录，但保留本地文件

* --mixed： staged snapshot 被更新， working directory 未被更改。【这是默认选项】（建议同上)

	add .后可以使用

* --hard： staged snapshot 和 working directory 都将回退

	不保留提交记录，将当前分支的状态恢复到某个特定提交下

	--soft在vscode中没看出变化
	--mixed(或者不加参数) vsCode中会这样，之前提交的代码前面绿了(就像新增的代码一样)，可以自己选择删除或其他操作

	￼<img src="/Users/liyang105/Library/Caches/BaiduMacHi/Share/images/26ad3c293982a2ca591059be81ba7beb.png" alt="26ad3c293982a2ca591059be81ba7beb" style="zoom:50%;" />
	--hard上次提交的代码在vsCode中被删掉了

	

	红色箭头的尾部表示内容的起点，头部表示内容的去向，箭头身体部分所经过的地方会裹带这这部分内容一起行走，像滚雪球一样。

	![img](https://img2020.cnblogs.com/blog/615156/202012/615156-20201228110755674-1288639130.png)

	![image-20210927162241943](/Users/liyang105/Library/Application Support/typora-user-images/image-20210927162241943.png)

![image2021-7-5_17-32-39](/Users/liyang105/Downloads/image2021-7-5_17-32-39.png)

[git revert、git reset、git checkout的区别](#three)

---

##### 5.6.git stash

暂存文件

小李正在branch_1上写需求。线上报了一个紧急 bug 需要修复，但是小李这部分代码还没开发完不想提交怎么办？这个时候可以用 `git stash` 命令先把工作区已经修改的文件暂存起来，然后切换到新拉的分支上修复bug，修复完成后，切换回branch_1分支，从堆栈中恢复刚刚保存的内容。

```javascript
git stash //把本地的改动暂存起来git stash save "message" 执行存储时，添加备注，方便查找。git stash pop // 应用最近一次暂存的修改，并删除暂存的记录git stash apply  // 应用某个存储,但不会把存储从存储列表中删除，默认使用第一个存储,即 stash@{0}，如果要使用其他个，git stash apply stash@{$num} 。git stash list // 查看 stash 有哪些存储git stash clear // 删除所有缓存的 stash
```

此时，我正在开发一个新功能，修改了 1.js 文件里的内容

![image-20210916102632411](/Users/liyang105/Library/Application Support/typora-user-images/image-20210916102632411.png)

还没开发完成，这个时候，我想切换到 hotfix 分支上修复 bug，得暂停下开发切换到 hotfix 分支，但是现在工作区还有内容，此时如果切换分支 Git 会报出下面的错误

```javascript
error: Your local changes to the following files would be overwritten by checkout:        1.jsPlease commit your changes or stash them before you switch branches.Aborting
```

上面那句话的意思就是说工作区有文件修改，不能提交，需要先进行 commit 或者 stash 操作，执行 `git stash`，结果如下

```javascript
Saved working directory and index state WIP on stash: 22e561c feat: add 1.js
```

此时，我们的工作区已经干净了，可以切换到 hotfix 分支进行 bug 修复的工作，假设我们现在 bug 修复完成了，继续切回 feature 分支进行原本功能的开发，此时只需要执行 `git stash pop`，之前我们暂存的修改就会恢复到工作区，如下图所示。

![image-20210916102847584](/Users/liyang105/Library/Application Support/typora-user-images/image-20210916102847584.png)

当我们想要暂存文件，切换分支做某些事的时候，可以用 `git stash` 这种机制帮助开发。

推荐在使用 stash 的相关命令时，每一次暂存的时候，不要直接使用  `git stash`  命令进行暂存下来，而是使用  `git stash save "message..."`  这种方式，给本次的提交做一个信息的记录。这样，想应用更改的时候，先通过 `git stash list` 查看一下所有的暂存列表。之后，推荐使用 `git stash apply stash@${num}` 的方式进行应用对应的 stash，这样不会清空已有的 stash 的列表项，并且能应用到当前的工作区，不需要这个暂存的话，再手动清除就可以了。

---

### 六、常见问题

##### <span id="pull&fetch">6.1.拉取：git pull 和git fetch的区别</span>

首先我们要说简单说git的运行机制。git分为本地仓库和远程仓库，我们一般情况都是写完代码，commit到本地仓库（生成本地仓的commit ID，代表当前提交代码的版本号），然后push到远程仓库（记录这个版本号），这个流程大家都熟悉。
我们本地的git文件夹里面对应也存储了git本地仓库master分支的commit ID 和 跟踪的远程分支orign/master的commit ID（可以有多个远程仓库）。那什么是跟踪的远程分支呢，打开git文件夹可以看到如下文件：

![image-20210920003508402](/Users/liyang105/Library/Application Support/typora-user-images/image-20210920003508402.png)

首先假设我们本地仓库的 master 分支上 commit ID =1 ，orign/mastter中的commit ID =1 ;这时候远程仓库有人更新了github ogirn库中master分支上的代码，新的代码版本号commit ID =2 ,那么在github上 orign/master的commitID=2，然后我们要更新代码。

![img](https://img-blog.csdn.net/20180928164519774?watermark/2/text/aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3dlaXhpbl80MTk3NTY1NQ==/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70)

* git fetch

使用git fetch更新代码，本地的库中master的commitID不变，还是等于1。但是与git上面关联的那个orign/master的commit ID变成了2。这时候我们本地相当于存储了两个代码的版本号，我们还要通过merge去合并这两个不同的代码版本，如果这两个版本都修改了同一处的代码，这时候merge就会出现冲突，然后我们解决冲突之后就生成了一个新的代码版本。
这时候本地的代码版本可能就变成了commit ID=3，即生成了一个新的代码版本。

![img](https://img-blog.csdn.net/20180928164725364?watermark/2/text/aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3dlaXhpbl80MTk3NTY1NQ==/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70)

相当于fetch的时候本地的master没有变化，但是与远程仓关联的那个版本号被更新了，我们接下来就是在本地合并这两个版本号的代码。

* git pull

git pull更新代码的话就比较简单暴力了

![img](https://img-blog.csdn.net/201809281653222?watermark/2/text/aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3dlaXhpbl80MTk3NTY1NQ==/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70)

使用git pull的会将本地的代码更新至远程仓库里面最新的代码版本



由此可见，git pull看起来像git fetch+get merge，但是根据commit ID来看的话，他们实际的实现原理是不一样的。

![image-20210920004149179](/Users/liyang105/Library/Application Support/typora-user-images/image-20210920004149179.png)

[详情传送门](https://blog.csdn.net/weixin_41975655/article/details/82887273)

---

##### <span id="merge&rebase">6.2.合并：git merge 和 git rebase 的区别</span>

不同于 `git rebase` 的是，`git merge` 在不是 fast-forward（快速合并）的情况下，会产生一条额外的合并记录，类似 `Merge branch 'xxx' into 'xxx'` 的一条提交信息。

![image-20210913213620200](/Users/liyang105/Library/Application Support/typora-user-images/image-20210913213620200.png)

另外，在解决冲突的时候，用 merge 只需要解决一次冲突即可，简单粗暴，而用 rebase 的时候 ，需要依次解决每次的冲突，才可以提交。

---

##### <span id="three">6.3.回退：git revert、git reset、git checkout的区别</span>

开发中，我们经常需要回退代码的操作，在不同的工作区域中，回退代码的方式也是不相同的。如下图所示，假设现在要在 feature/revoke 分支上进行开发,

首先通过 `git status` 查看下现在的状态。

![image-20210916103046819](/Users/liyang105/Library/Application Support/typora-user-images/image-20210916103046819.png)

目前我们的工作区是很干净的，没有任何修改的操作，此时，修改一下代码再次查看状态，可以看到，1.js 这个文件被修改了。

![image-20210916103113322](/Users/liyang105/Library/Application Support/typora-user-images/image-20210916103113322.png)

* 工作区的文件：现在我们想把 1.js 这个文件恢复到修改前的状态，即撤回工作区的修改，就可以使用  `git checkout -- <filename>` 的命令，如果要撤回多个文件的修改，文件之间使用空格隔开，如下图所示，我们撤回了 1.js 文件的修改，工作区也恢复干净了。

![image-20210916103141965](/Users/liyang105/Library/Application Support/typora-user-images/image-20210916103141965.png)

* 暂存区的文件（已经add过）：如果说现在我们对文件进行了修改，并且已经提交到暂存区了，这部分文件我们不想要的话，那么就可以通过 `git reset <filename>` 的命令来对特定的文件进行撤销，`git reset` 会撤回所有存在暂存区的文件，如下图所示，查看前后的状态可知，文件最后成功撤回到工作区了。

<img src="/Users/liyang105/Library/Application Support/typora-user-images/image-20210916103206897.png" alt="image-20210916103206897" style="zoom: 100%;" />

* git reset

	作用是修改HEAD的位置，即将HEAD指向的位置改变为之前存在的某个版本，如下图所示，假设我们要回退到版本一：

	<img src="https://imgconvert.csdnimg.cn/aHR0cDovL2ltZy5ibG9nLmNzZG4ubmV0LzIwMTgwNDE0MjEyMjIxMDMz" alt="这里写图片描述" style="zoom:50%;" />

	**适用场景：** 如果想恢复到之前某个提交的版本，且那个版本之后提交的版本我们都不要了，就可以用这种方法。

	```javascript
	git log查看想要取消的commit-idgit reset --hard commit-id# 此时如果用“git push”会报错，因为我们本地库HEAD指向的版本比远程库的要旧git push -f
	```

* git revert

	用于“反做”某一个版本，以达到撤销该版本的修改的目的。比如，我们commit了三个版本（版本一、版本二、 版本三），突然发现版本二不行（如：有bug），想要撤销版本二，但又不想影响撤销版本三的提交，就可以用 git revert 命令来反做版本二，生成新的版本四，这个版本四里会保留版本三的东西，但撤销了版本二的东西。如下图所示：

	<img src="https://imgconvert.csdnimg.cn/aHR0cDovL2ltZy5ibG9nLmNzZG4ubmV0LzIwMTgwNDE0MjA1ODE2MTg4" alt="这里写图片描述" style="zoom:50%;" />

	**适用场景：** 如果我们想撤销之前的某一版本，但是又想保留该目标版本后面的版本，记录下这整个版本变动流程，就可以用这种方法。

```javascript
git log查看想要取消的commit-idgit revert -n commit-id# 这里可能会出现冲突，那么需要手动修改冲突的文件git add 文件名git commit -mgit push
```

[详情见](https://blog.csdn.net/yxlshk/article/details/79944535)

---

### 七、总结

本次只把常见的、实际工作中能用到的部分、常见的几个指令的区别拿出来讲解

* 指令的区别只说了最关键的

* git的很多指令都有对应的多个参数可以在不同场景下使用
* 想解决某个问题可以使用多种方式实现

---

参考：

[和冉老师学git](http://wiki.baidu.com/display/~lyuran/Git)

[图解git](https://cloud.tencent.com/developer/article/1698027)

[版本控制](https://blog.csdn.net/weixin_39723352/article/details/81606082)

[git和svn的区别](https://www.cnblogs.com/Sungeek/p/9152223.html)

<a href="https://www.cnblogs.com/tugenhua0707/p/4050072.html">git使用教程</a>

<a href="https://juejin.cn/post/6974184935804534815#heading-4">我在工作中是如何使用 git 的</a>

[git指令一篇就够](https://juejin.cn/post/6844903598522908686)

[git备忘指南](https://juejin.cn/post/6967634683811069982)

[git笔记](https://juejin.cn/post/6844903877138087950)

[git使用教程](https://juejin.cn/post/6844903684476764168)

[工作不忘学git](https://juejin.cn/post/7007461125457444878?utm_source=gold_browser_extension)

[git pull和git fetch区别](https://blog.csdn.net/weixin_41975655/article/details/82887273)

