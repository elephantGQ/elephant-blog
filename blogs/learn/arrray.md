---
title: 常用的34个数组方法
date: 2021-09-17 21:14:21
tags:
 - 数组
categories:
 -  数据结构
sidebar: auto
publish: true
---

---
本文将会讲解数组常用的34个方法
* 我按照自己的关注点将这些方法分类（比如：sort()、reverse()和find()、findIndex()内部肯定也有遍历迭代的过程，但我这里将他们分别归类在排序和位置相关的类别中了）
* 每个例子都附上了代码和最新版本Chrome浏览器运行的结果截图

---
tip: 本文按照图中从右侧向左侧的顺序讲解

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a484169503844705a6f37e68029ac40c~tplv-k3u1fbpfcp-watermark.image)
开淦！！！

---
## 1.形式转换

### 1.1join()
* 作用：将数组转化成字符串
* 默认使用逗号作为分隔符
```
let arr = [1, 2, 3];
arr.join(); // "1,2,3"
```
* 若想使用其他符号分隔数组中的每一项（比如-）
```
let arr = [1, 2, 3];
arr.join('-');  // "1-2-3"
```
![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4224a9b4115745e9a5e5900c5b16f528~tplv-k3u1fbpfcp-watermark.image)

### 1.2.toString()
* 作用：将数组转换成字符串
```
let arr = [1, 2, 3];
arr.toString(); // "1,2,3"
```
### 1.3.toLocaleString()
* 作用：将数组转换成字符串
```
let arr = [1, 2, 3];
arr.toLocaleString(); // "1,2,3"
```
**tip：toLocaleString()和toString()看起来作用一样，有什么区别吗？**

这两个方法是继承自对象的，所以所有的对象都可以使用这两个方法，数组使用这两个方法时是没有与区别的。今天想说的是这两个方法在其他场景下使用时的区别。

* 当一个三位数字使用这俩方法的时候没有什么区别
```
let b = 123;
b.toString(); // "123"
b.toLocaleString(); "123"
```
![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e8b6b6c2f7d8416cacab8b811bbd4f72~tplv-k3u1fbpfcp-watermark.image)

* 当一个三位以上的数字使用这两个方法的时候，toLocaleString()会实现千分位加逗号的效果
```
let b = 1234567890;
b.toLocaleString(); // "1,234,567,890"
b.toString(); // "1234567890"
```
![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d01b9f6e83f34872a027dad2a9635303~tplv-k3u1fbpfcp-watermark.image)

* 当转换日期格式的时候，toLocaleString()会返回一个格式化后的日期，toString()会返回一个标准格式时间
```
let date = new Date();
date.toLocaleStrin();
date.toString();
```
![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c74a4650d6af40b3bd26de48afb456d0~tplv-k3u1fbpfcp-watermark.image)

### 1.4.from()
1、 作用：将一个类数组对象或者可遍历对象转换成一个真正的数组

2、 Array.from()的用法1：将类数组对象转换为真正数组

**先提一嘴什么是类数组？**

下面代码中的arrayLike就是一个类数组
```
let arrayLike = {
    0: 'apple', 
    1: '100',
    2: '女',
    3: ['jane','john','Mary'],
    'length': 4
}
```
* 若类数组中的键不是数字，返回length项值为undefined的数组
```
let arrayLike = {
    ’name': 'apple', 
    'age': '100',
    'sex': '女',
    'friends': ['jane','john','Mary'],
    'length': 4
}
let arr = Array.from(arrayLike); // [undefined, undefined, undefined, undefined, undefined]
```
![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/44da544207974e5e90c0127f5f1fcdc0~tplv-k3u1fbpfcp-watermark.image)

* 类数组中的键是数字的字符串，和键名为数字的类数组返回值一样
```
let arrayLike = {
    '0': 'apple', 
    '1': '100',
    '2': '女',
    '3': ['jane','john','Mary'],
    'length': 4
}
let arr = Array.from(arrayLike); 
```
![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/57ee2c09de4e4934888988b6f623059f~tplv-k3u1fbpfcp-watermark.image)

* 没有length属性，返回空数组
```
let arrayLike = {
    0: 'apple', 
    1: '100',
    2: '女',
    3: ['jane','john','Mary']
}
let arr = Array.from(arrayLike); // []
```

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/fdd92aa2a5ef4ae38eb5e3ed7cfb34c8~tplv-k3u1fbpfcp-watermark.image)

**所以得到类数组的特点**

* 类数组对象必须具有length属性，用于指定数组的长度。如果没有length属性，那么转换后的数组是一个空数组。
* 该类数组对象的属性名必须为数值型或字符串型的数字

3、 Array.from()的用法2：将Set结构的数据转换为真正的数组
![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c8bc37ecd5154e1fbe9d67148483c54e~tplv-k3u1fbpfcp-watermark.image)

4、Array.from()的用法3：接收第2个参数，作用类似于数组的map方法，用来对每个元素进行处理，将处理后的值放入返回的数组
```
let arr = [12,45,97,9797,564,134,45642];
let set = new Set(arr);
Array.from(set, item => item + 1);
```
![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/705dc99b0ee84853964f00a0789ac77c~tplv-k3u1fbpfcp-watermark.image)

5、Array.from()的用法4：将字符串转换为数组
```
let str = 'hello world!';
Array.from(str);
```
![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e10f74d220e84746a066b361571aa12a~tplv-k3u1fbpfcp-watermark.image)

6、参数是一个真正的数组时，返回数组本身
```
Array.from([12, 45, 47, 56, 213, 4654, 154]);
```
![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a4af7f05d73a4003b901555cf0610310~tplv-k3u1fbpfcp-watermark.image)

### 1.5.of()
* 作用：将一个或多个值转换成数组
用new Array()构造数组的时候，是有二意性的。

构造时，传一个参数，表示生成多大的数组。

构造时，传多个参数，每个参数都是数组的一个元素。
![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/bf15cb0049694d4d81c8720ad5ae4a17~tplv-k3u1fbpfcp-watermark.image)

* 而Array.of()方法，只有一个含义，of的参数就是表示转换后数组的元素
![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0f22a5285f544143bb05b1c924b7c0f3~tplv-k3u1fbpfcp-watermark.image)

### 1.6.flat()

[数组扁平化的其他方法](http://note.youdao.com/s/UtEqlYe7)

* 按照一个可指定的深度递归遍历数组，并将所有元素与遍历到的子数组中的元素合并为一个新数组返回
* 该方法返回一个新数组，对原数据没有影响
* 参数： 指定要提取嵌套数组的结构深度，默认值为 1

* 无参数时
```
const arr1 = [0, 1, 2, [3, 4]];
arr1.flat();
```
![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/18d91acab6ec4de7b8ff5b6d1b2013aa~tplv-k3u1fbpfcp-watermark.image)

* 有参数时，flat()的参数为2，表示要拉平两层的嵌套数组
```
const arr2 = [0, 1, 2, [[[3,4]]];
```
![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2cd248b57e5940c19aa617f4f926cbe6~tplv-k3u1fbpfcp-watermark.image)

* 不管有多少层嵌套，都要转成一维数组，可以用Infinity关键字作为参数。
```
var arr4 = [1, 2, [3, 4, [5, 6, [7, 8, [9, 10]]]]];
arr4.flat(Infinity);
```
![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5efecdc4a28f4e0695687cfab4060917~tplv-k3u1fbpfcp-watermark.image)

* 如果原数组有空位，flat()方法会跳过空位
```
var arr4 = [1 2, 3, 4];
arr4.flat();
```
![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1dc1cf955cad4090845ebe919d5ba47b~tplv-k3u1fbpfcp-watermark.image)

### 1.7.flatMap()
* 对原数组的每个成员执行一个函数，相当于执行Array.prototype.map()，然后对返回值组成的数组执行flat()方法
* 返回一个新数组，不改变原数组
* 只能展开一层数组
```
[2, 3, 4].flatMap((x) => [x, x*2])
```
![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ac2049ea5bca4aa8b594f4f79f8747b2~tplv-k3u1fbpfcp-watermark.image)
___

## 2.栈和队列方法
### 2.1.push()
* 数组末尾添加元素
![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/77f8ab6b903343279c62811771028656~tplv-k3u1fbpfcp-watermark.image)

### 2.2.pop()
* 删除数组最后一个元素
![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/244e712fbea844b486f79f751a30ecd9~tplv-k3u1fbpfcp-watermark.image)

### 2.3.shift()
* 删除数组第一个元素
![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9fae2fcefc92488cbfda5550282918da~tplv-k3u1fbpfcp-watermark.image)

### 2.4.unshift()
* 数组首个位置添加元素
![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f0f7e55ec8b647ce864cd86aeb45ca6d~tplv-k3u1fbpfcp-watermark.image)

### 添加方法和删除方法返回值区别？
* 添加元素的方法push()和unshift()返回的是添加元素后新数组的长度
* 删除元素的方法pop()和shift()返回的是删除的元素
___
## 3.排序
### 3.1.sort()
* 对数字排序
```
let arr = [1,37,32,24,5,101];
arr.sort();
```
![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/256a04062db34c16932046126327e52d~tplv-k3u1fbpfcp-watermark.image)

* 对字母排序
```
var arr = ["a", "b", "A", "B"];
arr.sort();
```
![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3df2f77b022647b8a51b7c9989b29964~tplv-k3u1fbpfcp-watermark.image)

巴特，好像和想象中的结果不一样，其实sort()
* 默认是字母序升序
* sort()的可选参数可以确定排序顺序，必须是个函数
* 没有参数，数组中的元素将按照ASCII字符顺序进行排序

如果想得到想象中的排序结果，可以sort()中传入一个比较函数
![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3b19eb3d77a84bf2b802bda6f55676f2~tplv-k3u1fbpfcp-watermark.image)

按照文档中说明的，代码如下：
```
let arr = [1, 37, 32, 24, 5, 101];
   function compare(val1, val2) {
       if (val1 < val2) {
           return -1;
       } else if (val1 > val2) {
           return 1;
       } else {
           return 0;
       }
   }
arr.sort(compare);
```
![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/073d4c3039664cb49e9df35997074599~tplv-k3u1fbpfcp-watermark.image)

* 更常见的写法：
```
let arr = [1, 37, 32, 24, 5, 101];
arr.sort(function(x, y){
    return x - y;
});
```
![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/dce04301bb0b4d95bd7ff3c771fe3b03~tplv-k3u1fbpfcp-watermark.image)

按照我的理解是，在一个数组使用sort()方法时，会逐项的将数组中的元素传入到compare函数中作为参数...

### 3.2.reverse()
* 颠倒数组中元素的顺序
```
var arr = [1, 5, 24, 32, 37, 101];
arr.reverse();
```
![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/940010844da34cd8870186d125f0e273~tplv-k3u1fbpfcp-watermark.image)
___
## 4.拼接
### 4.1.concat()
* 作用：连接两个或多个数组
* 该方法不会改变现有的数组，而仅仅会返回被连接数组的一个副本
```
var arr = [1,3, 5, 7];
var arrCopy = arr.concat(9, [11, 13]);
```
![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b53a093c98d7418ab488b948acb1c796~tplv-k3u1fbpfcp-watermark.image)

* 从上面测试结果可以发现：传入的不是数组，则直接把参数添加到数组后面。
* 如果传入的是数组，则将数组中的各个项添加到数组中。但是如果传入的是一个二维数组呢？
```
var arr = [1, 3, 5, 7];
var arrCopy2 = arr.concat([9, [[11, 13]]);
```
![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/34c5385eec484ac18ed256d39273bc46~tplv-k3u1fbpfcp-watermark.image)

会发现9被拉平到外层数组中，同事保留下内层数组[11,13]
___
## 5.创建子数组
### 5.1.slice()
* 作用：从已有的数组中返回选定的元素组成的新数组
* 当有1个参数时，slice()方法返回从该参数指定位置开始到当前数组末尾的所有项
* 当有2个参数时，该方法返回起始和结束位置之间的项，但不包括结束位置的项
* 不改变原数组

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3ed8c109b39046c4a280f5dd18753b44~tplv-k3u1fbpfcp-watermark.image)

* 一个参数时,表示创建一个从此参数到最后一项最后的子数组(从3到最后一项）
```
var arr = [1, 3, 5, 7, 9, 11];
var arrCopy1 = arr.slice(1);
```
![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a79845f2c249477f863e4d2d4450ce4f~tplv-k3u1fbpfcp-watermark.image)

* 有2个参数时，**创建的子数组不包括end参数这一项**
```
var arr = [1,3,5,7,9,11];
var arrCopy1 = arr.slice(1, 4);
```
![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9270368bb8434728a14b3cd38f41a267~tplv-k3u1fbpfcp-watermark.image)

* 有2个参数，2个参数都是负数时（负数表示从后往前查找）
```
var arr = [1,3,5,7,9,11];
var arrCopy1 = arr.slice(-4 -1);
```
![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1fe9d6b0863e4dd2b20d2bcf491baf54~tplv-k3u1fbpfcp-watermark.image)
___
## 6.删改
### 6.1.splice()
**我认为是非常非常强的方法，可以删除、插入和替换**
![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a4f98dc5470046b4ae434892dc80496a~tplv-k3u1fbpfcp-watermark.image)

1.删除功能
* 删除元素,并返回删除的元素
* 改变了原数组
* 可以删除任意数量的项，指定2个参数：要删除的第一项的位置和要删除的项数。
```
var arr = [1,3,5,7,9,11];
var arrRemoved = arr.splice(0, 2);
```
![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f825af8f3e6c4ed48643ae0dd4a3a031~tplv-k3u1fbpfcp-watermark.image)

2.插入功能
* 向指定索引处插入元素
* 提供3个参数：起始位置、 0（要删除的项数）和要插入的项
```
var array1 = [22, 3, 31, 12];
array1.splice(1, 0, 12, 35);
```
![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/56a63ff550f449dc9f1fbf4d54976229~tplv-k3u1fbpfcp-watermark.image)

3.替换功能
* 替换指定索引位置的元素
* 可以向指定位置插入任意数量的项，且同时删除任意数量的项，指定3个参数：
* 起始位置、要删除的项数和要插入的任意数量的项。
* 插入的项数不必与删除的项数相等。
```
var array1 = [22, 3, 31, 12];
array1.splice(1, 1, 8);
```
![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/39666f3444614273938f91dbbcac38a6~tplv-k3u1fbpfcp-watermark.image)
___
## 7.位置相关
### 7.1.indexOf()
* 返回某个指定的字符串值在字符串中首次出现的位置
* 第2个参数可选，表示开始检索的位置
![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7d2bf3b003c140e3a982c28f64152ad3~tplv-k3u1fbpfcp-watermark.image)
```
var arr = [1, 3, 5, 7, 7, 5, 3, 1];
arr.indexOf(5);
arr.indexOf(5, 2); // 表示从下标2处开始向后查找5，这一项就是5，返回5的下标2
arr.indexOf(5, 3); // 表示从下标处开始向后查找5，后面还有一个5，返回5的下标5
```
![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b001e019e5ce4eccb4c23bb4214f887f~tplv-k3u1fbpfcp-watermark.image)

### 7.2.lastIndexOf()
参数同indexOf()
返回一个指定的字符串值最后出现的位置，在一个字符串中的指定位置**从后向前**搜索
```
var arr = [1, 3, 5, 7, 7, 5, 3, 1];
arr.lastIndexOf(5); // 表示从数组末尾向前查找5，返回首次出现元素5的下标5
arr.lastIndexOf(5, 4); // 表示从下标4处开始向前查找5，返回首次出现元5的下标2
```
![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c1676fd0f2c842ad8e840a89aaacec01~tplv-k3u1fbpfcp-watermark.image)

### 7.3.find()
* 返回数组中符合测试函数条件的第一个元素，否则返回undefined
* 参数
![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/03a8c7da0357430fa5fc1ad26c511b87~tplv-k3u1fbpfcp-watermark.image)
```
var arr = [1, 3, 5, 7, 9, 11];
arr.find((value, index, arr) => {
	return value > 5;
});
```
![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/92dc3daf2943412c9fd7da08b78d3537~tplv-k3u1fbpfcp-watermark.image)

* 该回调函数应当在给定的元素满足你定义的条件时返回true

### 7.4.fiindIndex()
* 返回数组中符合测试函数条件的第一个元素的下标，否则返回undefined
* 参数
![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e32fb00adf1b46299ee80df0e8f96f22~tplv-k3u1fbpfcp-watermark.image)
```
var arr = [1, 3, 5, 7, 9, 11];
arr.findIndex((value, index, arr) => {
	return value > 5;
});
```
![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/bf4e03fd98704af5a2c0d57bed447d4a~tplv-k3u1fbpfcp-watermark.image)

### 二者的异同?
* 异：find()方法返回匹配的值，而 findIndex()返回匹配位置的索引。
* 同：find()和 findIndex()方法均会在回调函数第一次返回true时停止查找。
___
## 8.归并
### 8.1.reduce() 
* 作用： 
![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e7643e1cfe1545ed8a75447168da9737~tplv-k3u1fbpfcp-watermark.image)
* 参数
![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/da135e6291d84b9d9360ed5603ee60f1~tplv-k3u1fbpfcp-watermark.image)
```
// 初始值是10，累加1-5，结果是25
var values = [1,2,3,4,5];
var sum = values.reduceRight(function(prev, cur, index, array){
    return prev + cur;
}, 10);   //数组一开始加了一个初始值10,可以不设默认0
console.log(sum); 
```
reduce()方法可以搞定的东西，for循环，或者forEach方法有时候也可以搞定，那为啥要用reduce()？
大概是：通往成功的道路有很多，但是总有一条路是最捷径的，亦或许reduce()逼格更高...

这篇文章讲仅解reduce()最常用的累加用法，扩展用法请见 [reduce()高级用法：](http://note.youdao.com/s/HsDeQq5E)
initialVlue的作用、累加、累乘、数组去重、数组扁平化、计算数组中每个元素出现的次数
___
### 8.2.reduceRight()
* reduceRight() 方法的功能和 reduce() 功能是一样的，不同的是 reduceRight() 从数组的末尾向前将数组中的数组项做累加。
* 如果调用 reduceRight() 时提供了 initialValue 参数，则 accumulator 等于 initialValue，currentValue 等于数组中的最后一个值。如果没有提供 initialValue 参数，则 prevValue 等于数组最后一个值， currentValue 等于数组中倒数第二个值。
---
## 9.迭代
### 9.1.map()
* 方法通过对每个数组元素执行函数来创建新数组
* 方法不会对没有值的数组元素执行函数
* 方法不会更改原始数组
* 参数
![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1bfa58fb7bff43f194c7d3f505ffbb3d~tplv-k3u1fbpfcp-watermark.image)

```
var arr = [1, 2, 3, 4, 5];
var arr2 = arr.map((item) => {
	return item * 2;
});
```
![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7a52477ab3ff4bd380de7fb4ed81b738~tplv-k3u1fbpfcp-watermark.image)

### 9.2.forEach()
* 为每个数组元素调用一次函数（回调函数）
* 参数
![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/51d89186abcf4a59b5b4852c21b4872c~tplv-k3u1fbpfcp-watermark.image)
```
var arr = [1, 2, 3, 4, 5];
arr.forEach((item, index, arr) => {
	console.log(item + ' ' + index + ' ' +(a === arr));
});
```
![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f3d4da736b6a4ce0a2b7f0cde4f31868~tplv-k3u1fbpfcp-watermark.image)

### 9.3.filter()
* “过滤”功能，数组中的每一项运行给定函数，返回满足过滤条件组成的数组。
* 不改变原数组
![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d026edd653144b86ae32f86c3bb4fbdb~tplv-k3u1fbpfcp-watermark.image)
```
var arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
var arr2 = arr.filter((item, index) => {
	return item > 8 && index % 3 == 0;
});
```
![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9ebda7c3a83e474aba08672641dbdc26~tplv-k3u1fbpfcp-watermark.image)

### 9.4.every()
* 数组中所有项都满足条件，才会返回true。
* 不改变原数组
* 参数
![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/17a0e407fcc44a488c1ef8ee472ea03f~tplv-k3u1fbpfcp-watermark.image)
```
var arr = [1, 2, 3, 4, 5];
arr.every((item) => {
    return item > 0;
}):

arr.every((item) => {
   return item > 10;
}):
```
![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6b5de10f57d44421916f20c03d35c5b8~tplv-k3u1fbpfcp-watermark.image)

### 9.5.some()
* 只要有一项满足条件，就会返回 true。
* 不改变原数组
* 参数
![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/26cf85ff8001424abf28ade38863b3d4~tplv-k3u1fbpfcp-watermark.image)
```
var arr = [1, 2, 3, 4, 5];
arr.some((item) => {
    return item > 4;
}):

arr.some((item) => {
    return item > 5;
}):
```
![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8178be81f2b24982ab9bf5c76cc7bc25~tplv-k3u1fbpfcp-watermark.image)

### 9.6.keys()
* 用于遍历数组。
* 返回一个遍历器对象，可以用for…of循环进行遍历，对键名遍历
```
for(let i of (['a', 'b'].keys()) {
    console.log(i);
}
```
![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/515063b055a541569820f66f4426528c~tplv-k3u1fbpfcp-watermark.image)

### 9.7.values()
* 用于遍历数组
* 返回一个遍历器对象，可以用for…of循环进行遍历，对键值遍历
```
for(let i of (['a', 'b'].values()) {
    console.log(i);
}
```
![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/97fe893570ea4489a8721dc9d8b1fef4~tplv-k3u1fbpfcp-watermark.image)

### 9.8.entries()
* 用于遍历数组
* 返回一个遍历器对象，可以用for…of循环进行遍历，对键值对遍历
```
for(let item of (['a', 'b'].entries()) {
    console.log(item);
}
```
![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6d79e8e7dfb849fdb2a4bb65fd17175c~tplv-k3u1fbpfcp-watermark.image)

### 调用遍历器对象的next方法
![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/94b3f156b1704de3b664da2ac46686c8~tplv-k3u1fbpfcp-watermark.image)

generator中可以使用next()得到返回值，若想了解generator，请看
[generator](http://note.youdao.com/s/SnZpqm0i)
___
## 10.其他
### 10.1.isArray()
* 返回一个遍历器对象，可以用for…of循环进行遍历，对键名遍历
* 判断一个对象是否为数组，是数组返回true，否则返回false
```
Array.isArray([1,2,3]);
Array.isArray(0);
Array.isArray(true);
Array.isArray('123');
```
![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/137e104b025e400cb85ec4882312338a~tplv-k3u1fbpfcp-watermark.image)

### 10.2.fill()
* 用于将一个固定值替换数组的元素
* 参数
![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/48033067c87c4d30ad43e970916f0d3f~tplv-k3u1fbpfcp-watermark.image)

* 一个参数时
```
// 每一项都填充1
let arr = [1, 2, 3, 'cc', 5];
arr.fill(1);
```
![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/78fcc89973b94afdbec2c750f4c7f35e~tplv-k3u1fbpfcp-watermark.image)

* 两个参数时
```
// 从下标为3处开始填充1
let arr = [1, 2, 3, 'cc', 5];
arr.fill(1，3);
```
![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2bfd97f8fb1e4106a125ea3c4889dd6a~tplv-k3u1fbpfcp-watermark.image)

* 三个参数时
```
// 从下标为2到下标4（不包括4）填充1
let arr = [1, 2, 3, 'cc', 5];
arr.fill(1，2，4);
```
![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0c371407c1524850b145f8593e9b3f66~tplv-k3u1fbpfcp-watermark.image)

### 10.3.copyWIthin()
* 从数组的指定位置拷贝元素到数组的另一个指定位置中。
* 在当前数组内部，将指定位置的成员复制到其他位置（会覆盖原有成员），然后返回当前数组。也就是说，使用这个方法，会修改当前数组。
* 参数
![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5660b6dbd29d454fa23b72c6922dc9d3~tplv-k3u1fbpfcp-watermark.image)
* 2个参数时
```
// 表示从下标3处到最后拷贝到下标0处
[1, 2, 3, 4, 5].copyWithin(0, 3);
```
![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/40923117ba714fa6ae7dbdb0a74ae10a~tplv-k3u1fbpfcp-watermark.image)

* 3个参数时
```
// 表示从下标3处到下标4（不包括4）拷贝到下标0处
[1, 2, 3, 4, 5].copyWithin(0, 3, 4);
```
![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e7d97bb9662d474ba3b495b5d8650a9e~tplv-k3u1fbpfcp-watermark.image)

```
// 表示从倒数第2项处到倒数第1项（不包括倒数第1项）拷贝到下标0处
[1, 2, 3, 4, 5].copyWithin(0, -2, -1);
```
![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/69de76066a0f4144bfa6f2dea802a242~tplv-k3u1fbpfcp-watermark.image)

### 10.4.includes()
* 判断一个数组是否包含一个指定的值，如果是返回 true，否则 false。
* 参数
![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/14c21796cbfa4a80bce919e49c052ccb~tplv-k3u1fbpfcp-watermark.image)

找到元素返回true，否则返回false
```
[1, 2, 3].includes(2);
[1, 2, 3].includes(4);
[1, 2, 3].includes(3, 3);
[1, 2, 3].includes(3, -1);
```
![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3eef66defaf048e5ac716e5933221317~tplv-k3u1fbpfcp-watermark.image)

### includes和indexOf()的区别？
includes()出来之前我们判断数组包含某个元素通常使用indexOf()，但是indexOf有两个小缺点：
* 不够语义化，它返回的是元素第一次出现的下标，找不到时返回-1，通常要讲返回结果和-1比较。
* indexOf()内部使用严格等式运算符（===）进行判断，会导致NaN的误判，如果数组中存在NaN，则无法找到。
```
NaN === NaN
lett arr = [NaN, 8, "hello"];
arr.indexOf(NaN); // arr中有NaN，但是没有返回结果
arr.includes(NaN);
```
![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/55ee84227624480a855d9f4f2f51e711~tplv-k3u1fbpfcp-watermark.image)

---
整理的很匆忙，如有纰漏，欢迎指出。

[引用1](https://juejin.cn/post/6907109642917117965)
[引用2](https://www.cnblogs.com/kongxianghai/p/7474295.html)
[引用3](https://www.cnblogs.com/jf-67/p/8440758.html)

