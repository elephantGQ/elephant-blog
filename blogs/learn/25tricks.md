---
title: 你应该了解的 25 个 JS 技巧
date: 2020-1-15 16:59
author: Before Semicolon
link: https://www.jianshu.com/p/e161bd720e64
tags:
  - Js技巧
categories:
  - JS基础
sidebar: "auto"
---

# 你应该了解的 25 个 JS 技巧

> 写代码的时候总有一些东西是会重复出现的，次数多了你就会想找找捷径了。这类问题中有很大一部分解决起来甚至连库都不用装。下面就是我多年来收集的前 25 个捷径和小技巧。

## 1. 类型检查小工具

JavaScript 不是强类型语言，对此我推荐的最佳解决方案是 TypeScript。但有时你只是想要一个简单的类型检查，这种时候 JavaScript 允许你使用“typeof”关键字。

“typeof”的问题在于，将其用于某些原语和函数时效果很好，但对于数组和对象来说，由于它们都被视为“对象”，因此很难把握它们之间的区别。

```js
const isOfType = (() => {
  // create a plain object with no prototype
  const type = Object.create(null);

  // check for null type
  type.null = (x) => x === null;
  // check for undefined type
  type.undefined = (x) => x === undefined;
  // check for nil type. Either null or undefined
  type.nil = (x) => type.null(x) || type.undefined(x);
  // check for strings and string literal type. e.g: 's', "s", `str`, new String()
  type.string = (x) =>
    !type.nil(x) && (typeof x === "string" || x instanceof String);
  // check for number or number literal type. e.g: 12, 30.5, new Number()
  type.number = (x) =>
    !type.nil(x) && // NaN & Infinity have typeof "number" and this excludes that
    ((!isNaN(x) && isFinite(x) && typeof x === "number") ||
      x instanceof Number);
  // check for boolean or boolean literal type. e.g: true, false, new Boolean()
  type.boolean = (x) =>
    !type.nil(x) && (typeof x === "boolean" || x instanceof Boolean);
  // check for array type
  type.array = (x) => !type.nil(x) && Array.isArray(x);
  // check for object or object literal type. e.g: {}, new Object(), Object.create(null)
  type.object = (x) => ({}.toString.call(x) === "[object Object]");
  // check for provided type instance
  type.type = (x, X) => !type.nil(x) && x instanceof X;
  // check for set type
  type.set = (x) => type.type(x, Set);
  // check for map type
  type.map = (x) => type.type(x, Map);
  // check for date type
  type.date = (x) => type.type(x, Date);

  return type;
})();
```

## 2. 检查是否为空

有时你需要知道某些内容是否为空，并根据结果决定要使用的方法，例如检查长度、大小或是否包含任何子元素。下面这个工具打包了这些功能，你可以用它检查 String、Object、Array、Map 和 Set 的大小。

```js
function isEmpty(x) {
  if (Array.isArray(x) || typeof x === "string" || x instanceof String) {
    return x.length === 0;
  }

  if (x instanceof Map || x instanceof Set) {
    return x.size === 0;
  }

  if ({}.toString.call(x) === "[object Object]") {
    return Object.keys(x).length === 0;
  }

  return false;
}
```

## 3. 获取列表最后一项

其他语言里这个功能被做成了可以在数组上调用的方法或函数，但在 JavaScript 里面，你得自己做点工作。

```js
function lastItem(list) {
  if (Array.isArray(list)) {
    return list.slice(-1)[0];
  }

  if (list instanceof Set) {
    return Array.from(list).slice(-1)[0];
  }

  if (list instanceof Map) {
    return Array.from(list.values()).slice(-1)[0];
  }
}
```

## 4. 带有范围的随机数生成器

有时你需要生成随机数，但希望这些数字在一定范围内，那就可以用这个工具。

```js
function randomNumber(max = 1, min = 0) {
  if (min >= max) {
    return max;
  }

  return Math.floor(Math.random() * (max - min) + min);
}
```

## 5. 随机 ID 生成器

有时你只是需要一些 ID？除非你要的是更复杂的 ID 生成器（例如 UUID），否则用不着为此安装什么新库，下面这个选项足够了。你可以从当前时间（以毫秒为单位）或特定的整数和增量开始生成，也可以从字母生成 ID。

```js
// create unique id starting from current time in milliseconds
// incrementing it by 1 everytime requested
const uniqueId = (() => {
  const id = (function*() {
    let mil = new Date().getTime();

    while (true) yield (mil += 1);
  })();

  return () => id.next().value;
})();
// create unique incrementing id starting from provided value or zero
// good for temporary things or things that id resets
const uniqueIncrementingId = ((lastId = 0) => {
  const id = (function*() {
    let numb = lastId;

    while (true) yield (numb += 1);
  })();

  return (length = 12) => `${id.next().value}`.padStart(length, "0");
})();
// create unique id from letters and numbers
const uniqueAlphaNumericId = (() => {
  const heyStack = "0123456789abcdefghijklmnopqrstuvwxyz";
  const randomInt = () =>
    Math.floor(Math.random() * Math.floor(heyStack.length));

  return (length = 24) =>
    Array.from({ length }, () => heyStack[randomInt()]).join("");
})();
```

## 6. 创建一个范围内的数字

Python 里我很喜欢的一个功能是 range 函数，而在 JavaScript 里我经常需要自己写这个功能。下面是一个简单的实现，非常适合 for…of 循环以及需要特定范围内数字的情况。

```js
function range(maxOrStart, end = null, step = null) {
  if (!end) {
    return Array.from({ length: maxOrStart }, (_, i) => i);
  }

  if (end <= maxOrStart) {
    return [];
  }

  if (step !== null) {
    return Array.from(
      { length: Math.ceil((end - maxOrStart) / step) },
      (_, i) => i * step + maxOrStart
    );
  }

  return Array.from(
    { length: Math.ceil(end - maxOrStart) },
    (_, i) => i + maxOrStart
  );
}
```

## 7. 格式化 JSON 字符串，stringify 任何内容

我在使用 NodeJs 将对象记录到控制台时经常使用这种方法。JSON.stringify 方法需要第三个参数，该参数必须有多个空格以缩进行。第二个参数可以为 null，但你可以用它来处理 function、Set、Map、Symbol 之类 JSON.stringify 方法无法处理或完全忽略的内容。

```js
const stringify = (() => {
  const replacer = (key, val) => {
    if (typeof val === "symbol") {
      return val.toString();
    }
    if (val instanceof Set) {
      return Array.from(val);
    }
    if (val instanceof Map) {
      return Array.from(val.entries());
    }
    if (typeof val === "function") {
      return val.toString();
    }
    return val;
  };

  return (obj, spaces = 0) => JSON.stringify(obj, replacer, spaces);
})();
```

## 8. 顺序执行 promise

如果你有一堆异步或普通函数都返回 promise，要求你一个接一个地执行，这个工具就会很有用。它会获取函数或 promise 列表，并使用数组 reduce 方法按顺序解析它们。

```js
const asyncSequentializer = (() => {
  const toPromise = (x) => {
    if (x instanceof Promise) {
      // if promise just return it
      return x;
    }

    if (typeof x === "function") {
      // if function is not async this will turn its result into a promise
      // if it is async this will await for the result
      return (async () => await x())();
    }

    return Promise.resolve(x);
  };

  return (list) => {
    const results = [];

    return (
      list
        .reduce((lastPromise, currentPromise) => {
          return lastPromise.then((res) => {
            results.push(res); // collect the results
            return toPromise(currentPromise);
          });
        }, toPromise(list.shift()))
        // collect the final result and return the array of results as resolved promise
        .then((res) => Promise.resolve([...results, res]))
    );
  };
})();
```

## 9. 轮询数据

如果你需要持续检查数据更新，但系统中没有 WebSocket，则可以使用这个工具来执行操作。它非常适合上传文件时，想要持续检查文件是否已完成处理的情况，或者使用第三方 API（例如 dropbox 或 uber）并且想要持续检查过程是否完成或骑手是否到达目的地的情况。

```js
async function poll(fn, validate, interval = 2500) {
  const resolver = async (resolve, reject) => {
    try {
      // catch any error thrown by the "fn" function
      const result = await fn(); // fn does not need to be asynchronous or return promise
      // call validator to see if the data is at the state to stop the polling
      const valid = validate(result);
      if (valid === true) {
        resolve(result);
      } else if (valid === false) {
        setTimeout(resolver, interval, resolve, reject);
      } // if validator returns anything other than "true" or "false" it stops polling
    } catch (e) {
      reject(e);
    }
  };
  return new Promise(resolver);
}
```

## 10. 等待所有 promise 完成

这个算不上是代码解决方案，更多是对 Promise API 的强化。这个 API 在不断进化，以前我还为“allSettled”“race”和“any”做了代码实现，现在直接用 API 的就好了。

```js
const prom1 = Promise.reject(12);
const prom2 = Promise.resolve(24);
const prom3 = Promise.resolve(48);
const prom4 = Promise.resolve("error");

//completes when all promises resolve or at least one fail
//if all resolve it will return an array of results in the same order of each promise
//if fail it will return the error in catch
Promise.all([prom1, prom2, prom3, prom4])
  .then((res) => console.log("all", res))
  .catch((err) => console.log("all failed", err));

//completes with an array of objects with "status" and "value" or "reason" of each promise
//status can be "fullfilled" or "rejected"
//if fullfilled it will containa "value" property
//if failed it will containa "reason" property
Promise.allSettled([prom1, prom2, prom3, prom4])
  .then((res) => console.log("all settled", res))
  .catch((err) => console.log("allSettled failed", err));

//completes with the first promise that resolves
//fails if all promises fail
Promise.any([prom1, prom2, prom3, prom4])
  .then((res) => console.log("any", res))
  .catch((err) => console.log("any failed", err));

//completes with the first promise that either resolve or fail
//whichever comes first
Promise.race([prom1, prom2, prom3, prom4])
  .then((res) => console.log("race", res))
  .catch((err) => console.log("race failed", err));
```

## 11. 交换数组值的位置

ES6 开始，从数组中的不同位置交换值变得容易多了。这个做起来不难，但是了解一下也不错，

```js
const array = [12, 24, 0.48];
const swapOldWay = (arr, i, j) => {
  const arrayCopy = [...arr];
  let temp = arrayCopy[i];
  arrayCopy[i] = arrayCopy[j];
  arrayCopy[j] = temp;
  return arrayCopy;
};
const swapNewWay = (arr, i, j) => {
  const arrayCopy = [...arr];
  [arrayCopy[0], arrayCopy[2]] = [arrayCopy[2], arrayCopy[0]];
  return arrayCopy;
};
console.log(swapOldWay(array, 0, 2)); //outputs:[48,24，12]
console.log(swapNewWay(array, 0, 2)); //outputs:[48，24，12]
```

## 12. 条件对象键

我最喜欢这条技巧了，我在使用 React 更新状态时经常用它。你可以将条件包装在括号中来有条件地将一个键插入一个 spread 对象。

```js
let condition = true;
const man = {
  someProperty: "somevalue",
  // the parenthesis will execute the ternary that will
  // result in the object with the property you want to insert
  // or an emtpy object.Then its content is spreaded in the wrapper..  object
  ...(conditiontrue ? { newProperty: "value" } : {}),
};
```

## 13. 使用变量作为对象键

当你有一个字符串变量，并想将其用作对象中的键以设置一个值时可以用它。

```js
let property = "newValidProp";

const man = {
  someProperty: "some value",
  // the "square bracket"notation is a valid way to acces object key
  // like object[prop] but it is used inside to assign a property as well
  // using the 'backtick' to first change it into a string
  // but it is optional
  [`${property}`]: "value",
};
```

## 14. 检查对象里的键

这是一个很好的技巧，可以帮助你检查对象键。

```js
const sample = {
  prop: "value",
};
//using the "in" keyword will still consider proptotype keys
//which makes it unsafe and one of the issue swith "for...in" loop
console.log("prop" in sample); //prints "true"
console.log("toString" in sample); //prints "true"

//using the "hasOwnProperty" methods is safer
console.log(sample.hasOwnProperty("prop")); //prints "true"
console.log(sample.hasOwnProperty("toString")); //prints "false"
```

## 15. 删除数组重复项

数组中经常有重复的值，你可以使用 Set 数据结构来消除它。它适用于许多数据类型，并且 set 有多种检查相等性的方法，很好用。对于不同实例或对象的情况，你还是可以使用 Set 来跟踪特定事物并过滤出重复的对象。

```js
const numberArrays = [
  undefined,
  Infinity,
  12,
  NaN,
  false,
  5,
  7,
  null,
  12,
  false,
  5,
  undefined,
  89,
  9,
  null,
  Infinity,
  5,
  NaN,
];
const objArrays = [{ id: 1 }, { id: 4 }, { id: 1 }, { id: 5 }, { id: 4 }];

console.log(
  // prints [undefined,Infinity,12,NaN,false,5,7,null,89,9]
  Array.from(newSet(numberArrays)),
  //prints [{ id: 1 }, { id: 4 }, { id: 1 }, { id: 5 }, { id: 4 }]
  // nothing changes because even though the ids repeat in some objects
  // the objects are different instances, different objects
  Array.from(new Set(objArrays))
);
const idSet = new Set();
console.log(
  // prints [{ id: 1 }, { id: 4 }, { id: 5 }] using id to track id uniqueness
  objArrays.filter((obj) => {
    const existingId = idSet.has(obj.id);
    idSet.add(obj.id);

    return !existingId;
  })
);
```

## 16. 在 ArrayforEach 中执行“break”和“continue”

我真的很喜欢使用数组“.forEach”方法，但有时我需要提早退出或继续进行下一个循环，而不想用 for...loop。你可以复制“continue”语句行为来提前返回，但如果要复制“break”行为，则需要使用数组“.some”方法。

```js
const·numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];
// logs 1, 3 and 5
for (const number of numbers) {
  if (number % 2 === 0) {
    continue; // skip to the next item
  }

  if (number > 5) {
    break; // stops the loop}
  }
  console.log(number);
}

// logs 1, 3 and 5
numbers.some((number) => {
  if (number % 2 === 0) {
    return false; // skip to the next item}
  }
  if (number > 5) {
    return true; // stops the loop}
  }
  console.log(number);
});
```

## 17. 使用别名和默认值来销毁

Destructuring（销毁）是 JavaScript 最好用的功能之一，而且你可以使用“冒号”设置别名，并使用“等号”设置属性默认值。

```js
function demo1({ dt: data }) {
  //rename "dt" to "data"
  console.log(data); //prints {name:'sample',id:50}
}
function demo2({ dt: { name, id = 10 } }) {
  //deep destruct "dt" and if no "id" use 10 as default
  console.log(name, id); //prints'sample','10'
}
demo1({
  dt: { name: "sample", id: 50 },
});
demo2({
  dt: { name: "sample" },
});

```

## 18. 可选链和空值合并

深入检查对象属性并处理 null 和 undefined 值时，你可以使用几个非常好用的 JavaScript 功能来解决常见的问题。

```js
const obj = {
  data: {
    container: {
      name: {
        value: "sample",
      },
      int: {
        value: 0,
      },
    },
  },
};
console.log(
  // even though the "int.value" exists, it is falsy therefore fails to be printed
  obj.data.container.int.value || "no int value", //prints 'no int value'

  // the ?? make sure to fallback to the right side only if left is null or undefined
  obj.data.container.int.value ?? "no int value" // prints 0
);
console.log(
  //"wrapper" does not exist inside "data"
  obj.data.wrapper.name.value, // throws "Canot read property 'name' of undefined"

  // this is better but can be a problem if object is deep
  (obj && obj.data && obj.data.wrapper && obj.data.wrapper.name) || "no name", // prints 'no name'
  // using optional chaining "?" is better30
  obj?.data?.wrapper?.name || "no name" // prints 'no name'31
);

```

## 19. 用函数扩展类

我经常对别人讲，JavaScript 类只是构造函数和底层的原型，不是像 Java 中那样的真实概念。一个证据是，你可以只使用一个构造函数来扩展一个类。在私有内容里这个很好用，在类里“#”这些看着很奇怪，并且用于 babel 或 WebPack 时，编译出来的代码更少。

```js
function Parent() {
  const privateProp = 12;
  const privateMethod = () => privateProp + 10;
  this.publicMethod = (x = 0) => privateMethod() + x;
  this.publicProp = 10;
}
class Child extends Parent {
  myProp = 20;
}

const child = new Child();

console.log(
  child.myProp, // prints 20
  child.publicProp, // prints 10
  child.publicMethod(40), // prints 62 child.privateProp，// prints undefined
  child.privateMethod() // throws "child.privateMethod is not a function"
);

```

## 20. 扩展构造函数

类的一个问题是你只能扩展一个其他类。使用构造函数，你可以使用多个构造函数来构成一个函数，这样就会灵活多了。你可以使用函数原型的.apply 或.call 方法来实现。你甚至可以只扩展函数的一部分，只要它是一个对象即可。

```js
function Employee() {
  this.profession = "Software Engineer";
  this.salary = "$150000";
}

function DeveloperFreelancer() {
  this.programmingLanguages = ["Javascript", "Python", "Swift"];
  this.avgPerHour = "$100";
}

function Engineer(name) {
  this.name = name;
  this.freelancer = {};

  Employee.apply(this);
  DeveloperFreelancer.apply(this.freelancer);
}
const john = new Engineer("John Doe");
console.log(
  john.name, // prints "John Doe"
  john.profession, // prints "Software Engineer"
  john.salary, // prints "150000"
  john.freelancer // prints {programmingLanguages: ["Javascript", "Python", "Swift"],avgPerHour:'$100'}
);

```

## 21. 循环任何内容

有时，你需要循环任何可迭代的内容（Set、Map、Object、Array、String 等）。这个非常简单的 forEach 函数工具就可以做到这一点。如果回调返回 true，它将退出循环。

```js
function forEach(list, callback) {
  const entries = Object.entries(list);
  let i = 0;
  const len = entries.length;

  for (; i < len; i++) {
    const res = callback(entries[i][1], entries[i][0], list);

    if (res === true) break;
  }
}
```

## 22. 使函数参数为 required

这是一种确保函数调用了完成工作所需内容的绝佳方法。你可以使用默认参数值的特性来调用函数，然后就会抛出一个错误。如果调用该函数时带上了它需要的值，则该值将替换该函数，并且什么也不会发生。使用 undefined 调用也有相同的效果。

```js
function required(argName = "param") {
  throw new Error(`"${argName}" is required`);
}
function iHaveRequiredOptions(arg1 = required("arg1"), arg2 = 10) {
  console.log(arg1, arg2);
}
iHaveRequiredOptions(); // throws "arg1" is required
iHaveRequiredOptions(12); // prints 12, 10
iHaveRequiredOptions(12, 24); // prints 12, 24
iHaveRequiredOptions(undefined, 24); // throws "arg1" is required
```

## 23. 创建模块或单例

很多时候，你需要在加载时初始化某些内容，设置它需要的各种事物，然后就可以在应用程序中到处使用它，而无需再做什么补充工作。你可以使用 IIFE 函数来做到这一点，这个函数太好用了。这种模块模式用来隔离事物非常好用，它可以只暴露需要交互的内容。

```js
class Service {
  name = "service";
}
const service = (function(S) {
  // do something here like preparing data that you can use to initialize service;
  const service = new s();

  return () => service;
})(Service);

const element = (function(S) {
  const element = document.createElement("DIV");
  // do something here to grab somethin on the dom
  // or create elements with javascrip setting it all up
  // than to return it

  return () => element;
})();

```

## 24. 深度克隆对象

开发人员通常会安装一些类似“lodash”的库来执行这一操作，但使用纯 JavaScript 来实现确实也很容易。这是一个简单的递归函数：只要是一个对象，就使用函数的构造器将其重新初始化为一个克隆，然后对所有属性重复该过程。

```js
const deepClone = (obj) => {
  let clone = obj;
  if (obj && typeof obj === "object") {
    clone = new obj.constructor();

    Object.getOwnPropertyNames(obj).forEach(
      (prop) => (clone[prop] = deepClone(obj[prop]))
    );
  }
  return clone;
};
```

## 25. 深度冻结对象

如果你喜欢不变性，那么这个工具你一定要常备。

```js
const deepFreeze = (obj) => {
  if (obj && typeof obj === "object") {
    if (!Object.isFrozen(obj)) {
      Object.freeze(obj);
    }

    Object.getOwnPropertyNames(obj).forEach((prop) => deepFreeze(obj[prop]));
  }

  return obj;
};
```
