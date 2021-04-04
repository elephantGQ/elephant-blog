---
title: 内置Symbol属性
date: 2019-11-15 08:45
tags:
  - Symbol
categories:
  - JS基础
sidebar: "auto"
---

# 内置 Symbol 属性

- Symbol 是 ES6 引入的内置(built-in)全局函数，它自带一些内置好的属性。下面依次介绍一下。

## Symbol.hasInstance

- [Symbol.hasInstance](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol/hasInstance)用来定义一个构造对象/类(class)如何识别一个变量是否是他的实例，对应的`instanceof`命令符。

```js
// 示例
class Array1 {
  static [Symbol.hasInstance](instance) {
    return Array.isArray(instance);
  }
}

console.log([] instanceof Array1); // true
```

- 即使不是构造对象，普通对象也能定义它的 Symbol.hasInstance。这样甚至可以用`instanceof`来进行值的校验，比如判断一个字符串是否是手机号码格式，就可以改写成这样：

```js
const Ismoblie = {
  [Symbol.hasInstance]: function(text) {
    var pattern = /^1[3-9]\d{9}$/;
    return pattern.test(text);
  },
};
"abc" instanceof Ismoblie; // false
"18312345678" instanceof Ismoblie; // true
```

## Symbol.isConcatSpreadable

- `Symbol.isConcatSpreadable`用来配置一个数组对象，表示他在使用[`Array.prototype.concat()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/concat)  
  方法时，数组元素是否能够被展开。对应的值为真值 true 时就可以，false 时就不展开。

```js
const alpha = ["a", "b", "c"];
const numeric = [1, 2, 3];
let alphaNumeric = alpha.concat(numeric);

console.log(alphaNumeric);
// expected output: Array ["a", "b", "c", 1, 2, 3]

numeric[Symbol.isConcatSpreadable] = false;
alphaNumeric = alpha.concat(numeric);

console.log(alphaNumeric);
// expected output: Array ["a", "b", "c", Array [1, 2, 3]]
```

- Symbol.isConcatSpreadable 属性只能规定在调用 concat 函数时不能展开，使用`...`时仍然还是能够展开然后拼接的。

```js
var arr1 = [1, 2];
var arr2 = [3, 4];
arr1[Symbol.isConcatSpreadable] = false;
arr1[Symbol.isConcatSpreadable] = false;
console.log([...arr1, ...arr2]);
// expected output: Array [1,2,3,4]
```

## Symbol.iterator

- Symbol.iterator 用来声明一个对象的默认遍历器(iterator)，主要结合`for...of`使用，`for...of`会遍历那些可遍历(Iterable)的对象，执行对象的 Symbol.iterator 所对应的`generator`函数。普通对象是没有遍历器接口的，为它指定了 Symbol.iterator 之后，就可以用`for...of`遍历它了，注意 Symbol.iterator 对应的一定是一个 generator 函数。

```js
const iterable1 = new Object();

iterable1[Symbol.iterator] = function*() {
  yield 1;
  yield 2;
  yield 3;
};

console.log([...iterable1]);
// expected output: Array [1, 2, 3]
```

- 更多关于`Symbol.iterator`和`for...of`的内容，参考[Iterator 和 for...of 循环](http://es6.ruanyifeng.com/?search=find&x=0&y=0#docs/iterator#Iterator-%E6%8E%A5%E5%8F%A3%E4%B8%8E-Generator-%E5%87%BD%E6%95%B0)

## Symbol.match

- 定义了 Symbol.match 属性的对象，在执行`*.match(obj)`时，就会调用 Symbol.match 对应的函数，如果不是函数，则会报错。(这个 Symbol 感觉没什么用)

```js
let str = new String("123");
str[Symbol.match] = function(arg) {
  console.log(arg);
  return false;
};
"123".match(str);
// console 输出 123，返回值为 false
```

## Symbol.replace

- 与 Symbol.match 类似，定义了 Symbol.replace 属性的对象，在执行`string.replace(obj)`时，就会调用 Symbol.match 对应的函数，如果不是函数，则会报错。(这个 Symbol 感觉没什么用)

```js
class Replace1 {
  constructor(value) {
    this.value = value;
  }
  [Symbol.replace](string) {
    return `s/${string}/${this.value}/g`;
  }
}

console.log("foo".replace(new Replace1("bar")));
// expected output: "s/foo/bar/g"
```

## Symbol.search

- 同上，定义了 Symbol.search 属性的对象，再执行 String.prototype.search 方法时，会调用 Symbol.search 指向的函数。

```js
class Search1 {
  constructor(value) {
    this.value = value;
  }
  [Symbol.search](string) {
    return string.indexOf(this.value);
  }
}

console.log("foobar".search(new Search1("bar")));
// expected output: 3
```

## Symbol.species

- `Symbol.species`指向一个构造函数。创建衍生对象时，会使用该函数返回的属性。正常情况下，例如一个类 Array1 继承自 Array，那么 Array1 的实例对象产生的衍生对象，既是 Array1 的实例，又是 Array 的实例。如果像下面这样定义 Symbol.species 之后则会这样：

```js
  class Array1 extends Array {
  static get [Symbol.species]() { return Array; }
  }

  const a = new Array1(1, 2, 3);
  const mapped = a.map(x => x \* x);

  console.log(mapped instanceof Array1);
  // expected output: false

  console.log(mapped instanceof Array);
  // expected output: true
```

- 所谓产生衍生对象，对于数组对象来说，包括了`filter`、`map`、`slice`这些函数生成的对象。而对于`promise`对象，`then`、`catch`函数返回的都是一个新的`promise`对象，这也是衍生对象。

```js
class T1 extends Promise {}

class T2 extends Promise {
  static get [Symbol.species]() {
    return Promise;
  }
}

new T1((r) => r()).then((v) => v) instanceof T1; // true
new T2((r) => r()).then((v) => v) instanceof T2; // false
```

- 至此 Symbol.species 的主要作用就在于，子类的实例生成衍生对象时，可以通过修改 Symbol.species，让衍生对象通过父类来创造，不通过子类。

## Symbol.split

- 对象的 Symbol.split 属性，指向一个方法，当该对象被 String.prototype.split 方法调用时，会返回该方法的返回值。

```js
class Split1 {
  constructor(value) {
    this.value = value;
  }
  [Symbol.split](string) {
    var index = string.indexOf(this.value);
    return (
      this.value +
      string.substr(0, index) +
      "/" +
      string.substr(index + this.value.length)
    );
  }
}

console.log("foobar".split(new Split1("foo")));
// expected output: "foo/bar"
```

## Symbol.toPrimitive

- Symbol.toPrimitive 用于声明一个值为函数的属性，当一个对象要转换为一个相应的原始(primitive)值时，会调用该函数，该函数接收一个字符串参数，根据场景有不同的值：

  - Number：该场合需要转成数值
  - String：该场合需要转成字符串
  - Default：该场合可以转成数值，也可以转成字符串

```js
let a = {
  valueOf:()=> {
  return 0;
  },
  toString:()=> {
  return '1';
  },
  [Symbol.toPrimitive]:(hint)=>{
    switch (hint) {
    case 'number':
    return 123;
    case 'string':
    return 'str';
    case 'default':
    return 'default';
    default:
    throw new Error();
    }
    }
  }
  2 \* a // 246
  3 + a // '3default'
  a == 'default' // true
  String(a) // 'str'
```

- 注意上面代码中，我同时还为 a 对象定义了`valueOf`和`toString`函数，但实际发生 toPrimitive 类型转换时，实际执行的是 Symbol.toPrimitive 对应的函数，也就是说 Symbol.toPrimitive 的优先级更高。

## Symbol.toStringTag

- 对象的 Symbol.toStringTag 属性，指向一个方法。在该对象上面调用 Object.prototype.toString 方法时，如果这个属性存在，它的返回值会出现在 toString 方法返回的字符串之中，表示对象的类型。也就是说，这个属性可以用来定制\[object Object\]或\[object Array\]中 object 后面的那个字符串。

```js
class ValidatorClass {
  get [Symbol.toStringTag]() {
    return "Validator";
  }
}

console.log(Object.prototype.toString.call(new ValidatorClass()));
// expected output: "[object Validator]"
let c = {};
c[Symbol.toStringTag] = "nike sb";
c.toString();
// expected output: "[object nike sb]"
```
