---
title: 八大数据结构以及基本操作
date: 2021-01-31 23:33:16
tags:
 - 数据结构
categories:
 -  算法
sidebar: auto
publish: true
---
![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1b6db5cb2fa7428aa882fc2549a5afaa~tplv-k3u1fbpfcp-watermark.image)
开淦！
___ 
## 一、数据结构分类
![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d36d7a954c494ad2a55a5989074e2940~tplv-k3u1fbpfcp-watermark.image)
### 1.1 数据的逻辑结构
#### 1.1.1 集合
这里的集合就是高中数学我们学习的第一节课*集合*，集合中的元素具备三个特征：
* 确定性(集合中的元素必须是确定的)
* 唯一性(集合中的元素互不相同)
* 无序性(集合中的元素没有先后之分)
比如一个班级中的学生组成了一个集合，该结构的数据元素之间的关系是"属于同一个集合"，此外没有任何逻辑关系。
___
#### 1.1.2 线性结构
![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e9eac40191414ce3b63daa7d2732ab9e~tplv-k3u1fbpfcp-watermark.image)
* 数据元素之间存在着1对1的线性关系的数据结构
* 数据排成像一条线一样的结构。
* 每个线性表上的数据最多只有两个方向。
常见的线性结构有：数组、链表、队列、栈。
___
#### 1.1.3 非线性结构
![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ec8c6645de694ec6af862e39010688b6~tplv-k3u1fbpfcp-watermark.image)
* 树状结构：除了根节点以外每个数据元素有且仅有一个直接前驱元素，但是可以有多个直接后继元素。数据元素之间是1对多的关系。
* 网状结构：每个数据元素可以有多个直接前驱元素，也可以有多个直接后继元素。数据元素之间是多对多的关系。
在非线性结构中，数据之间并不是简单的前后关系。常见的非线性结构无包括：树、堆、图。
___
### 1.2 数据的存储结构
#### 1.2.1 顺序存储
把逻辑上相邻的节点存储在物理位置上相邻的存储单元中，结点之间的逻辑关系由存储单元的邻接关系来体现，由此得到的存储结构为顺序存储结构，常见的顺序存储区结构是数组。
>数组arr[ ]中arr既表示数组的名字，又表示这个数组在存储空间中的首位置，arr[0]中的0表示0个偏移量，即arr[0]表示数组中的第一个元素。同理arr[2]表示arr数组在存储空间偏移量为2位置上的元素。
![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1f5ee774bf284b7c9164cd3cdfac51ea~tplv-k3u1fbpfcp-watermark.image)

优点：

1.节省存储空间，因为分配给数据的存储单元全用来存放结点的数据，结点之间的逻辑没有占用额外的存储空间。

2.采用这种方法时，可以实现对节点的**随机存取**，即每一个节点对应一个序号，由该序号直接计算出来节点的存储地址。

缺点：

1.插入和删除操作需要移动元素，效率较低。
    
2.必须提前分配固定数量的空间，如果存储元素少，可能导致空间的浪费。for循环
___
#### 1.2.2 链式存储
数据元素的存储对应的是不连续的存储空间，每个存储节点对应一个需要存储的数据元素。

1.每个结点是由数据域和指针域组成。元素之间的逻辑关系通过存储结点之间的链接关系反映出来。
(每个结点中需要存储本结点的数据和下一个结点数据的指针/地址)

2.逻辑上相邻的结点物理上不必相邻
![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/17c399a9a75640048f86557805d6d80a~tplv-k3u1fbpfcp-watermark.image)
优点：

1.插入、删除灵活(不必移动结点、只要改变结点中的指针)。

2.有元素才会分配结点空间，不会有闲置的结点

缺点：

1.比顺序存储结构的存储密度小(每个结点都由数据域和指针域组成，所以相同空间内假设全存满的话顺序比链式存储更多)，占内存更大。

2.查找结点时链式存储要比顺序存储慢。
___
#### 1.2.3 索引存储
![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/59987f98c5b9485a99dd4249f86250f0~tplv-k3u1fbpfcp-watermark.image)
除建立存储结点信息外，还建立附加的索引表来标识结点的地址。
比如图书、字典的目录。海量数据。
___
#### 1.2.4 散列存储
![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4350acf34dc74aa9b94dd7be56044a39~tplv-k3u1fbpfcp-watermark.image)

散列表就是常说的哈希表，根据每个结点的关键字直接计算出该结点的存储地址HashSet、HashMap。将数组和链表的特点结合起来，是一种寻址容易，插入删除也容易的数据结构,就像在数组中按索引查找元素。是一种神奇的结构，添加、查询速度快。

左边很明显是个数组，数组的每个成员包括一个指针，指向一个链表的头，当然这个链表可能为空，也可能元素很多。我们根据元素的一些特征把元素分配到不同的链表中去，也是根据这些特征，找到正确的链表，再从链表中找出这个元素。

应用：
* Hash主要用于信息安全领域中加密算法，它把一些不同长度的信息转化成杂乱的128位的编码,这些编码值叫做Hash值. 也可以说，Hash就是找到一种数据内容和数据存放地址之间的映射关系。
* 查找：是一种更加快捷的查找技术。我们之前的查找，都是这样一种思路：集合中拿出来一个元素，看看是否与我们要找的相等，如果不等，缩小范围，继续查找。而哈希表是完全另外一种思路：当我知道key值以后，我就可以直接计算出这个元素在集合中的位置，根本不需要一次又一次的查找！
> 举一个例子，假如我的数组A中，第i个元素里面装的key就是i，那么数字3肯定是在第3个位置，数字10肯定是在第10个位置。哈希表就是利用利用这种基本的思想，建立一个从key到位置的函数，然后进行直接计算查找。
* Hash表在海量数据处理中有着广泛应用。
 
Hash Table的查询速度非常的快，几乎是O(1)的时间复杂度。
___
## 二、数据结构-数组
数组是前端开发工程师最常接触的一种数据结构，数组方法的基本操作、不同参数的用法应该熟记于心，详情见上一篇文章：[数组常用的34个方法](https://juejin.cn/post/6921329057153941512)
___
## 三、数据结构-链表
### 3.1 链表是什么？
* 链表是一种上一个元素的引用指向下一个元素的存储结构，链表通过指针来连接元素与元素。
* 链表不是用顺序实现的，用指针实现，在内存中不连续。意思就是说，链表就是将一系列不连续的内存联系起来，将那种碎片内存进行合理的利用，解决空间的问题。
* 一条链表在存储空间中的结构可能下图是这样的。
![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/198e9dc80f6745f280b685fc7a4e73f0~tplv-k3u1fbpfcp-watermark.image)

所以，链表允许插入和删除表上任意位置上的节点，但是不允许随机存取。链表有很多种不同的类型：单向链表、双向链表及循环链表。
___
### 3.2 链表的分类
#### 3.2.1 单向链表
![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/668adf607285427e94883c9bc120f622~tplv-k3u1fbpfcp-watermark.image)

单向链表包含两个域，一个是信息域，一个是指针域。也就是单向链表的节点被分成两部分，一部分是保存或显示关于节点的信息，第二部分存储下一个节点的地址，而最后一个节点则指向一个空值。
___
#### 3.2.2 双向链表
![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a109f7f875a64abd8b161a823a7b2300~tplv-k3u1fbpfcp-watermark.image)

从上图可以很清晰的看出，每个节点有2个指针，一个是指向前一个节点（当此链接为第一个链接时，指向的是空值或空列表），另一个指针则指向后一个节点（当此链接为最后一个链接时，指向的是空值或空列表）。
___
#### 3.2.3 循环链表
![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/07e3283a13584235b26d992ef8512665~tplv-k3u1fbpfcp-watermark.image)

循环链表就是首节点和末节点被连接在一起。循环链表中第一个节点前面就是最后一个节点，反之也一样。
___
#### 3.2.4 数组和链表的异同
不同：
* 数组是顺序的存储结构，链表是链式的存储结构。
* 数组则是把所有元素按次序依次存储，链表通过指针来连接元素与元素。
* 数组查找某个元素较简单，但插入与删除比较复杂，由于最大长度需要再编程一开始时指定，故当达到最大长度时，扩充长度不如链表方便。
  链表的插入删除元素相对数组较为简单，不需要移动元素，且较为容易实现长度扩充，但是寻找某个元素较为困难。

相同：
* 两种结构均可实现数据的顺序存储，构造出来的模型呈线性结构。
___
## 四、数据结构-栈
### 4.1 栈的特点
![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/485dcc68acf44a138cc80b53d907583d~tplv-k3u1fbpfcp-watermark.image)
后进先出（LIFO-last in first out）:最后插入的元素最先出来。

四个基本操作方法在34个数组常用方法-湛河队列方法中有讲解过，详情见：[数组常用的34个方法](https://juejin.cn/post/6921329057153941512)
___

### 4.2 栈的应用
* 在二叉树的各种算法中大量地使用栈
* 将递归算法转换成非递归算法时也常常用到栈
* 成对出现的符号匹配（括号匹配、引号匹配等）
* 小型计算器：在数学计算中，我们习惯"9 + (3 - 1) * 5"这样的中缀表达形式，即数字在运算符号的两边，而对于计算机而言，更适合处理算式是后缀表达式，即类似"9 3 1 – 5 * +"这样的形式，因此必然有，从中缀表达式到后缀表达式的过程，并且计算机利用后缀表达式计算的过程，而这些都可以通过栈实现。
* 图的深度优先遍历
___

## 五、数据结构-队列
![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/763d7a1351e54b69b79530fdf38e2e71~tplv-k3u1fbpfcp-watermark.image)
先进先出（FIFO-first in first out）:最先插入的元素最先出来。
___
### 5.1 循环队列
![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e29aedfbe3924dda83295a8c56ac10cc~tplv-k3u1fbpfcp-watermark.image)

上图对应步骤解析如下：
* 初始化队列时，队首front和队尾rear都指向0；
* a入队时，队尾rear=rear+1指向1；
* bc入队后，rear=3，此时队已满。其实此时队中还有1个空位，如果这个空位继续放入一个元素，则rear=front=0，这和rear=front时队为空冲突，所以为了算法设计方便，此处空出一个位。所以判断队满的条件是(rear+1)%MaxSize == front
* ab出队，队首front=2;
* de入队，此时rear=1；满足(rear+1)%MaxSize == front，所以队满
* cde出队，此时rear=front=1，队空

注意：
* 入队：队尾指针进1
* 出队：队首指针进1
* 队空 rear == front;
* 队满 (rear + 1) % Maxsize == front;
* 当满足 rear==front时，队列为空，我们可以在出队操作后，判断此条件，如果满足则说明队列为空了，可以将rear和front重新指向0；
* 当需要入队操作时，首先通过(rear+1)%MaxSize == front判断是否队满，如果队满，则需要空充容量，否则会溢出。
___
### 5.2 队列的应用
图的广度优先遍历Breadth-First-Search
___
## 六、数据结构-树
### 6.1 什么是树？
树是由结点或顶点和边组成的且不存在着任何环的一种数据结构。没有结点的树称为空(null或empty)树。一棵非空的树包括一个根结点，多个附加结点，所有结点构成一个多级分层结构。
___
### 6.2 二叉树的类型
#### 6.2.1 二叉树
每个结点至多拥有两棵子树(即二叉树中不存在度大于2的结点)，并且，二叉树的子树有左右之分，其次序不能任意颠倒。
___
#### 6.2.2 二叉树的性质
* 若二叉树的层次从0开始，则在二叉树的第i层至多有2^i个结点(i>=0)。
* 高度为k的二叉树最多有2^(k+1) - 1个结点(k>=-1)(空树的高度为-1)。
* 对任何一棵二叉树，如果其叶子结点(度为0)数为m, 度为2的结点数为n, 则m = n + 1。
___
二叉树又分为：完美二叉树，完全二叉树，完满二叉树
#### 6.2.3 完美二叉树（满二叉树）
![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/fc77563f96a143768d2e04643efedd2f~tplv-k3u1fbpfcp-watermark.image)
___
#### 6.2.4 完全二叉树
![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9bb2022abfda41199e9f0f635c78066c~tplv-k3u1fbpfcp-watermark.image)
___
#### 6.2.5 完满二叉树
![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/117d207400d04809bbc186b1ecb2af28~tplv-k3u1fbpfcp-watermark.image)__
___
#### 6.2.6 三者的区别
![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d24270a28e4f4cd19666cbf746ba76da~tplv-k3u1fbpfcp-watermark.image)
___
#### 6.2.7 二叉树的遍历方法
* 先序遍历：即根-左-右遍历
* 中序遍历：即左-根-右遍历
* 后序遍历：即左-右-根遍历
* 层次遍历：一棵树从根节点开始，每一层从左向右依次遍历。
![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0cc5ad20199245a7a3454fefd3bc2f95~tplv-k3u1fbpfcp-watermark.image)

结果：
* 先序：1 2 4 6 7 8 3 5
* 中序：4 7 6 8 2 1 3 5
* 后序：7 8 6 4 2 5 3 1
* 层次：1 2 3 4 5 6 7 8
___
### 6.3 二叉查找树
#### 6.3.1 二叉查找树性质
也称为有序二叉查找树，二叉查找树的性质：
* 任意节点左子树不为空,则左子树的值均小于根节点的值
* 任意节点右子树不为空,则右子树的值均大于根节点的值
* 任意节点的左右子树也分别是二叉查找树
* 没有键值相等的节点
___
#### 6.3.1 局限性及应用
在经过多次插入与删除后，有可能导致不同的结构，下图中左边的搜索性能已经是线性的了。所以使用时要考虑尽可能让它保持右图的结构，并且避免左图的结构，也就是所谓的“平衡”问题。   
![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0188395754bb449fb184f628915b67ec~tplv-k3u1fbpfcp-watermark.image)

   B树的搜索，从根结点开始，如果查询的关键字与结点的关键字相等，那么就命中；否则，如果查询关键字比结点关键字小，就进入左儿子；如果比结点关键字大，就进入右儿子；如果左儿子或右儿子的指针为空，则报告找不到相应的关键字。

  如果B树的所有非叶子结点的左右子树的结点数目均保持差不多（平衡），那么B树的搜索性能逼近二分查找。
___
### 6.4 AVL树（平衡二叉树）
![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4714fc8eda594537b6108c8fa3077ddb~tplv-k3u1fbpfcp-watermark.image)
___
### 6.4.1.平衡因子
   某结点的左子树与右子树的高度(深度)差即为该结点的平衡因子（BF，Balance Factor）。平衡二叉树上所有结点的平衡因子只可能是 -1，0 或 1。如果某一结点的平衡因子绝对值大于1则说明此树不是平衡二叉树。
   比如上图中右侧橘黄色的树，对于节点10来说，他的左子树的高度为2，右子树的高度为0，两者的差为2，结点10就是不平衡的状态。
___
### 6.4.2.添加节点
往平衡二叉树中添加节点很可能会导致二叉树失去平衡，所以我们需要在每次插入节点后进行平衡的维护操作。插入节点破坏平衡性有如下四种情况：
1. LL（右旋）
 LL的意思是向左子树（L）的左孩子（L）中插入新节点后导致不平衡，这种情况下需要右旋操作。
 ![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5a0d2f63d2674501a1a67df3fbf01958~tplv-k3u1fbpfcp-watermark.image)
 
 ![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9f1ae9e4623544a2ad5ecae553b37e45~tplv-k3u1fbpfcp-watermark.image)
 
 
![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7e3449348adc43f1aa9a1f11d1fc39b7~tplv-k3u1fbpfcp-watermark.image)
___
2. RR
![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e2156928d5a749c997da07c67fab136f~tplv-k3u1fbpfcp-watermark.image)

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2a11636ec3644b33a9e2925cfbdb134d~tplv-k3u1fbpfcp-watermark.image)

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b8360c5c0805453bae379910e74de496~tplv-k3u1fbpfcp-watermark.image)
___
3. LR
![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4cfde4457f2f494b9d3f01ab1aff6f06~tplv-k3u1fbpfcp-watermark.image)

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6bd8d065c5a846a4941be7665678a71d~tplv-k3u1fbpfcp-watermark.image)

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/18bcc92ef6464774965c66b72dd31344~tplv-k3u1fbpfcp-watermark.image)
___
4. RL
![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/aadcc463beba4b8eb2bec07761a1e5b3~tplv-k3u1fbpfcp-watermark.image)

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/de74f2e5c4bb4ea58715d283f4225795~tplv-k3u1fbpfcp-watermark.image)

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b9e9550fa49b42529d7bb704caed473b~tplv-k3u1fbpfcp-watermark.image)
___
### 6.5 红黑树
#### 6.5.1 性质
* 节点是红色或黑色。
* 根是黑色。
* 所有叶子都是黑色（叶子是NIL节点）。
* 每个红色节点必须有两个黑色的子节点。(从每个叶子到根的所有路径上不能有两个连续的红色节点。)
* 从任一节点到其每个叶子的所有简单路径都包含相同数目的黑色节点。
![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0092f1259ebb49ea8557251d14680c07~tplv-k3u1fbpfcp-watermark.image)
___
### 6.5 B树
因为B树的原英文名称为B-tree，而国内很多人喜欢把B-tree译作B-树，其实，这是个非常不好的直译，很容易让人产生误解。如人们可能会以为B-树是一种树，而B树又是另一种树。而事实上是，**B-tree就是指的B树**。

B树(B-Tree)是一种自平衡的树，它是一种多路搜索树（并不是二叉的），B-树的搜索，从根结点开始，对结点内的关键字（有序）序列进行二分查找，如果命中则结束，否则进入查询关键字所属范围的儿子结点；不断重复，直到所对应的儿子指针为空，或已经是叶子结点。
![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ce38a8b7443a48b1b5e8d2fc88c0d4a9~tplv-k3u1fbpfcp-watermark.image)

B-树的特性：
* 关键字集合分布在整颗树中；
* 任何一个关键字出现且只出现在一个结点中；
* 搜索有可能在非叶子结点结束；
* 其搜索性能等价于在关键字全集内做一次二分查找；
* 自动层次控制；
应用：MongoDB 索引
___
### 6.6 B+树
B+树是B-树的变体，也是一种多路搜索树
B+的搜索与B-树也基本相同，区别是B+树只有达到叶子结点才命中（B-树可以在非叶子结点命中），其性能也等价于在关键字全集做一次二分查找。
![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/52a617531b4c40fbbdcf41226f078724~tplv-k3u1fbpfcp-watermark.image)

#### 6.6.1 特性：
* 所有关键字都出现在叶子结点的链表中（稠密索引），且链表中的关键字恰好是有序的
* 不可能在非叶子结点命中
* 非叶子结点相当于是叶子结点的索引（稀疏索引），叶子结点相当于是存储（关键字）数据的数据层
* 更适合文件索引系统

#### 6.6.2 应用
文件系统和数据库系统中常用的B/B+ 树，他通过对每个节点存储个数的扩展，使得对连续的数据能够进行较快的定位和访问，能够有效减少查找时间，提高存储的空间局部性从而减少IO操作。他广泛用于文件系统及数据库中，如：
* Windows：HPFS 文件系统
* Mac：HFS，HFS+ 文件系统
* Linux：ResiserFS，XFS，Ext3FS，JFS 文件系统
* 数据库：ORACLE，MYSQL，SQLSERVER 等中
___
### 6.7 B*树
**增加内部节点中兄弟节点的指针，由左边指向右边**。

B*树是B+树的变体，在B+树的非根和非叶子结点再增加指向兄弟的指针，将结点的最低利用率从1/2提高到2/3。

所以，B*树分配新结点的概率比B+树要低，空间使用率更高。
![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a8b9de006c564ed7bbe96b62a87300a5~tplv-k3u1fbpfcp-watermark.image)
___
## 七、数据结构-图
图是由顶点集合以及顶点间的关系集合组成的一种数据结构。
### 7.1 图的分类
#### 7.1.1 无向图
![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7dcc1552e0d34124a59da23763d3886d~tplv-k3u1fbpfcp-watermark.image)
___
#### 7.1.2 有向图
![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/74dcd8e977884d9f891c8ff4b706cc88~tplv-k3u1fbpfcp-watermark.image)

连接顶点A到D的有向边就是弧，A是弧尾，D是弧头，<A,D>表示弧。
* 完全无向图：若有n个顶点的无向图有n(n-1)/2 条边, 则此图为完全无向图。
* 完全有向图：有n个顶点的有向图有n(n-1)条边, 则此图为完全有向图。
* 如果对于图中任意两个顶点都是连通的，则成G是连通图。
* 有向的连通图称为强连通图。
* 无向图顶点的边数叫做度。有向图顶点分为入度和出度。
* 图上的边和弧上带权则称为网。
___
### 7.2 图的存储结构
#### 7.2.1 邻接矩阵
![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/83c0be33b1e94dbe980aa39c4d293419~tplv-k3u1fbpfcp-watermark.image)
___
#### 7.2.2 邻接表
邻接矩阵是一种不错的图存储结构。 但是：对于边树相对顶点较少的图，这种结构是存在存储空间的极大浪费的。
因此我们考虑先进一步，使用邻接表存储，关于邻接表的处理办法是这样：
![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/52c9c186c62641ddb14b0c6ef71a3ac5~tplv-k3u1fbpfcp-watermark.image)
___
邻接矩阵是一种不错的图存储结构。 但是：对于边树相对顶点较少的图，这种结构是存在存储空间的极大浪费的。
因此我们考虑先进一步，使用邻接表存储，关于邻接表的处理办法是这样：
![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f3c8f53d1580472f8e0f8b85aa292878~tplv-k3u1fbpfcp-watermark.image)
___
而对于有权值的网图，可以在边表节点定义中再增加一个weight的数据域，存储权值信息即可。 如下图所示：
![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/302ecb2cfb70496387fb23fa559cf48e~tplv-k3u1fbpfcp-watermark.image)
___
### 7.3 图的遍历
#### 7.3.1 深度遍历
* 图的深度遍历结果不唯一
* 栈空结束
![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7c73c8c628cb4ca6859de2ddf891b70c~tplv-k3u1fbpfcp-watermark.image)

依次入栈可以得到一种结果：0 1 4 5 6 2 3
___
#### 7.3.2 广度遍历
* 类似于树的层次遍历
* 队列空结束

操作步骤：
* 把根节点放到队列列的末尾。
* 每次从队列列的头部取出⼀一个元素，查看这个元素所有的下⼀一级元素，把它们放到队列的末尾，并把这个元素记为下一级元素的前驱
* 找到所要找的元素时结束程序。
* 如果遍历整个树还没有找到，结束程序
![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/010a5cd834564a1f8f1b2a2248e205c8~tplv-k3u1fbpfcp-watermark.image)
___
## 八、数据结构-堆
堆就是用数组实现的二叉树，所以它没有使用父指针或者子指针。堆根据“堆属性”来排序，“堆属性”决定了树中节点的位置。

### 8.1 分类
#### 8.1.1 大顶堆
父节点的值比每一个子节点的值都要大。

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3db758887ef14b848326a780db793144~tplv-k3u1fbpfcp-watermark.image)
___
#### 8.1.2 小顶堆
父节点的值比每一个子节点的值都要小。
![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8b212f46c1b84bb8a0716e1de7fd8f1b~tplv-k3u1fbpfcp-watermark.image)
___
## 九、数据结构-散列表
见此文前部分1.2.4
___
* 整理时间匆忙，如有纰漏，欢迎指出
* 本文参考了大量书籍、网络上的文章、图片，实在找不到引用的原文章、原图片了，如有侵权请联系我删除。
![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ca53d5ec42b94fc997ad62cf82c5f90d~tplv-k3u1fbpfcp-watermark.image)
___
我是洋洋李，一个前端搬砖小弟

一万年太久，只争朝夕，下次见
