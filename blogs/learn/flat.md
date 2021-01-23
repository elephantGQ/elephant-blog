---
title: 数组扁平化
date: 2018-02-18 18:26
tags:
  - 数组扁平化
categories:
  - JS基础
sidebar: "auto"
---

# 数组扁平化

数组扁平化是指将一个多维数组变为一维数组<br/>
[1, [2, 3, [4, 5]]] ------> [1, 2, 3, 4, 5]

## ES6 flat(depth)

flat(depth) 方法会按照一个可指定的深度递归遍历数组，并将所有元素与遍历到的子数组中的元素合并为一个新数组返回。
<br/>
depth:指定要提取嵌套数组的结构深度，默认值为 1。

- **如果不知道数组层级，可以使用 Infinity 来展开任意深度的潜逃数组**

```js
var arr1 = [1, 2, [3, 4]];
arr1.flat();
// [1, 2, 3, 4]

var arr2 = [1, 2, [3, 4, [5, 6]]];
arr2.flat();
// [1, 2, 3, 4, [5, 6]]

var arr3 = [1, 2, [3, 4, [5, 6]]];
arr3.flat(2);
// [1, 2, 3, 4, 5, 6]

//使用 Infinity，可展开任意深度的嵌套数组
var arr4 = [1, 2, [3, 4, [5, 6, [7, 8, [9, 10]]]]];
arr4.flat(Infinity);
// [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
```

## flatMap

flatMap() 方法首先使用映射函数映射每个元素，然后将结果压缩成一个新数组。它与 map 连着深度值为 1 的 flat 几乎相同，但 flatMap 通常在合并成一种方法的效率稍微高一些。

```js
var arr1 = [1, 2, [3, 4]];
console.log(arr.flatMap((e) => e));
```

## toString 和 split 方法或 join 和 split 方法

这种方法一般运用在全部是数字的数组

```js
var arr = [1,2,3,4,[5,6,[7,8]]]
function flatten1 = (arr) =>  {
    return arr.toString().split(',').map(item => +item);
}
function flatten2 = (arr) =>  {
    return input.join().split(',').map(item => +item);
}
console.log(flatten(arr)) // [1,2,3,4,5,6,7,8]

```

## JSON.stringify 和正则表达式

```js
const flatten = (arr) =>
  JSON.parse(`[${JSON.stringify(arr).replace(/(\[|\])/g, "")}]`);
```

## ES6 展开运算符

es6 的扩展运算符能将二维数组变为一维

```js
const flatten = (arr) => {
  while (arr.some(Array.isArray)) {
    arr = [].concat(...arr);
  }
  return arr;
};
```

## 递归实现

```js
const flatten = (arr) => {
  var res = [];
  for (var i = 0; i < arr.length; i++) {
    if (Array.isArray(arr[i])) {
      res = res.concat(flatten(arr[i]));
    } else {
      res.push(arr[i]);
    }
  }
  return res;
};
```

forEach 遍历数组会自动跳过空元素

```js
// forEach 遍历数组会自动跳过空元素
const eachFlat = (arr = [], depth = 1) => {
  const result = []; // 缓存递归结果
  // 开始递归
  (function flat(arr, depth) {
    // forEach 会自动去除数组空位
    arr.forEach((item) => {
      // 控制递归深度
      if (Array.isArray(item) && depth > 0) {
        // 递归数组
        flat(item, depth - 1);
      } else {
        // 缓存元素
        result.push(item);
      }
    });
  })(arr, depth);
  // 返回递归结果
  return result;
};
```

for of 循环不能去除数组空位，需要手动去除

```js
const forFlat = (arr = [], depth = 1) => {
  const result = [];
  (function flat(arr, depth) {
    for (let item of arr) {
      if (Array.isArray(item) && depth > 0) {
        flat(item, depth - 1);
      } else {
        // 去除空元素，添加非undefined元素
        item !== void 0 && result.push(item);
      }
    }
  })(arr, depth);
  return result;
};
```

## reduce 实现

`reduce()`方法介绍：

- 语法：`array.reduce(function(total, currentValue, currentIndex, arr), initialValue)`
- 参数：
  - function(total,currentValue, index,arr)
    - total 必需。初始值, 或者计算结束后的返回值。
    - currentValue 必需。当前元素
    - currentIndex 可选。当前元素的索引
    - arr 可选。当前元素所属的数组对象。
  - initialValue 可选。传递给函数的初始值

```js
const flatten = (arr) => {
  return arr.reduce((a, i) => {
    return a.concat(
      // Object.prototype.toString.apply(i).slice(8, -1) === "Array"
      Array.isArray(i) ? flatten(i) : i
    );
  }, []);
};
flat(arr);
```

## 使用堆栈 stack

- 无递归数组扁平化，使用堆栈
- **注意：深度的控制比较低效，因为需要检查每一个值的深度**
- 也可能在 shift / unshift 上进行 w/o 反转，但是末端的数组 OPs 更快

```js
var arr1 = [1, 2, 3, [1, 2, 3, 4, [2, 3, 4]]];
function flatten(input) {
  const stack = [...input];
  const res = [];
  while (stack.length) {
    // 使用 pop 从 stack 中取出并移除值
    const next = stack.pop();
    if (Array.isArray(next)) {
      // 使用 push 送回内层数组中的元素，不会改动原始输入
      stack.push(...next);
    } else {
      res.push(next);
    }
  }
  // 反转恢复原数组的顺序
  return res.reverse();
}
flatten(arr1); // [1, 2, 3, 1, 2, 3, 4, 2, 3, 4]
```

递归版本的反嵌套

```js
function flatten(array) {
  var flattend = [];
  (function flat(array) {
    array.forEach(function(el) {
      if (Array.isArray(el)) flat(el);
      else flattend.push(el);
    });
  })(array);
  return flattend;
}
```

## 使用 Generator

```js
function* flatten(array) {
  for (const item of array) {
    if (Array.isArray(item)) {
      yield* flatten(item);
    } else {
      yield item;
    }
  }
}

var arr = [1, 2, [3, 4, [5, 6]]];
const flattened = [...flatten(arr)];
// [1, 2, 3, 4, 5, 6]
```
