---
title: 函数柯里化
date: 2020-12-15 20:05
tags:
  - 柯里化
  - 拆箱
categories:
  - JS基础
sidebar: "auto"
---

# 柯里化

> 在计算机科学中，柯里化（Currying）是把接受多个参数的函数变换成接受一个单一参数(最初函数的第一个参数)的函数，并且返回接受余下的参数且返回结果的新函数的技术。这个技术由 Christopher Strachey 以逻辑学家 Haskell Curry 命名的，尽管它是 Moses Schnfinkel 和 Gottlob Frege 发明的。

## 柯里化的实现

### 利用 Function.length 实现

这种实现方式只能在一开始固定函数的参数个数的情况下才适用,但是如果在后期函数的参数个数改变的时候就会不通用

> Function.length 属性指明函数的形参个数。 [Function.length](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Function/length)

1. ES5 的实现

```javascript
const currying = function(fn, ...args) {
  if (args.length < fn.length) {
    return function() {
      return currying(fn, ...args, ...arguments);
    };
  } else {
    return fn(...args);
  }
};
```

2. ES6 的实现

```javascript
const curryingArrow = (fn, ...args) =>
  args.length === fn.length
    ? fn(...args)
    : (...arguments) => curryingArrow(fn, ...args, ...arguments);
```

### 利用拆箱实现

#### 装箱

把原始类型值转为对应的包装对象

#### 拆箱

把包装对象转为对应的原始类型值表现形式
在进行拆箱的过程中会首先调用[Symbol.toPrimitive](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Symbol/toPrimitive) 方法,一个对象可被转换为原始值。该函数被调用时，会被传递一个字符串参数 hint ，表示要转换到的原始值的预期类型。 hint 参数的取值是 "number"、"string" 和 "default" 中的任意一个。函数会根据 hint 的值去决定**valueOf** 和**toString** 的调用顺序，

| hint    | 调用顺序            |
| ------- | ------------------- |
| number  | valueOf -> toString |
| string  | toString -> valueOf |
| default | valueOf -> toString |

```js
// 一个没有提供 Symbol.toPrimitive 属性的对象，参与运算时的输出结果
var obj1 = {};
console.log(+obj1); // NaN
console.log(`${obj1}`); // "[object Object]"
console.log(obj1 + ""); // "[object Object]"

// 接下面声明一个对象，手动赋予了 Symbol.toPrimitive 属性，再来查看输出结果
var obj2 = {
  [Symbol.toPrimitive](hint) {
    if (hint == "number") {
      return 10;
    }
    if (hint == "string") {
      return "hello";
    }
    return true;
  },
};
console.log(+obj2); // 10      -- hint 参数值是 "number"
console.log(`${obj2}`); // "hello" -- hint 参数值是 "string"
console.log(obj2 + ""); // "true"  -- hint 参数值是 "default"
```

**拆箱实现方式**

```js
const noLimitAdd = function(...args) {
  let _args = Array.prototype.slice.call(args);
  const _add = (...arg) => {
    _args.push(...arg);
    return _add;
  };
  _add.toString = () => _args.reduce((cur, next) => cur + next, 0);
  _add.valueOf = () => _args.reduce((cur, next) => cur + next, 100);
  return _add;
};
```

### 实现 aa == 1 && aa == 2 && aa == 3

利用函数拆箱的思想就可以实现这个方法

```js
let aa = {
  _value: 0,
  //   valueOf: function () {
  //     return ++this._value;
  //   },
  toString: function() {
    return ++this._value;
  },
  //   [Symbol.toPrimitive]:function () {
  //     return ++this._value;
  //   },
};
console.log(aa == 1 && aa == 2 && aa == 3); //true
```
