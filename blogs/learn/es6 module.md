---
title: es6 module
date: 2021-01-24 02:54:02
tags:
 - es6 module
categories:
 - es6 module
sidebar: auto
publish: true
---

ES6的class只是面向对象编程的语法糖，升级了ES5的构造函数的原型链集成的写法，并没有解决模块化的问题。Module功能则是为了解决这个问题而提出的。
ES6之前，模块家在方案主要有两种。CommonJs和AMD两种。前者用于服务器，后者用于浏览器(文章最后有比较)。ES6 Module成为服务器和浏览器通用的模块解决方案。
CommonJS和AMD都只能在运行时确定依赖关系，比如CommonJS模块就是对象，输入时必须查找对象属性。
let {a, b, c} = require('fs');
以上代码的实质是整体加载fs模块(即加载fs的所有方法)，然后再使用时用到3个方法，即“运行时加载”。

ES6模块不是对象，二十通过export命令显式指定输出的代码，输入时也采用静态命令的形式。
import {a, b, c} from 'fs';
以上代码的实质是从fs陌路埃及在3个方法，其他方法不加载。即“编译时加载”。
由此可见，ES6 Module比CommonJS加载效率高。


1. 严格模式（ES5引入的）
ES6模块自动采用严格弄湿，不管有没有在模块头部加上“use strict”

主要有以下限制：
变量必须声明后再使用；
函数的参数不能有同名属性，否则报错；
不能使用with语句；
不能对只读属性赋值，否则报错；
不能使用前缀0表示八进制数，否则报错；
不能删除不可删除的属性，否则报错；
不能删除变量delete prop，会报错，只能删除属性delete global[prop]；
eval不会在它的外层作用域引入变量；
eval和arguments不能被重新赋值；
arguments不会自动反映函数参数的变化；
不能使用arguments.callee；
不能使用arguments.caller；
禁止this指向全局对象；
不能使用fn.caller和fn.arguments获取函数调用的堆栈；
增加了保留字（比如protected、static和interface）。

2. export命令

1）export关键字输出变量：

//index.js export var name = 'ly'; 
export var age = 24;
以上代码用于保存用户信息 ，ES6将其视为一个模块，对外输出3个变量。

另一种写法
//index.js
var name = 'ly';
var age = 24;
export {name, age}
以上代码与第一种写法等价 ，但是优先考虑这种写法，因为可以在脚本末尾一眼看清输出了什么变量。

2）export关键字输出函数或类(class)：
export function multiply(x, y) {
    return x * y;
}
以上代码对外输出函数multiply。

3）可以使用as关键字对导出的内容重命名
function v1() {...}
function v2() {...}
export {
    v1 as stream1,
    v2 as stream2,
    v2 as streamLastestVersion
};
以上代码使用as关键字重命名函数v1和v2的对外接口。重命名后，v2可以用不同的名字输出两次。

4）export不能出现在块级作用域中,会报错
function foo() {
    export default 'bar';// syntaxError
}

5）export语句输出户的值是动态绑定，绑定其所在的模块。
export var foo = 'bar'; function foo() { setTimeout(() => foo = 'baz', 500); }
以上代码输出变量foo，值为bar，500ms之后变成baz。


3. import命令
1）import关键字加载文件并输入变量

//main.js
import {name, age} from './index.js';
function setName(ele) {
    ele.textContent = name + 'is' + age + 'years old';
}

2）使用as对输入内容重命名
import {name as myName} from './index.js';
function XXX() {...};

3）import命令有提升效果，会提升到整个模块头部首先执行。
//不会报错
foo();
import {foo} from './index.js';

4. 模块的整体加载

除了加载某个输入值，还可以整体加载，星号(*)指定一个对象，所有输出值都加载在这个对象上。


1）circle.js输出两个方法，area()和circumference()。
//circle.js
export function area(radius) {
    return Math.PI * radius * radius;
}
export function circumference(radius) {
    return 2 * Math.PI * radius;
}

//index.js
//注意指定要加载的方法
import {area, circumference} from './circle.js';
console.log('圆面积', area(4));
console.log('圆周长', circumference(4));

2）整体加载的写法
//circle.js
export function area(radius) {
    return Math.PI * radius * radius;
}
export function circumference(radius) {
    return 2 * Math.PI * radius;
}

//index.js
//整体加载的写法
import * as circle from './circle.js';
console.log('圆面积', circle.area(4));
console.log('圆周长', circle.circumference(4));
circle是circle.js的小名，是一个对象，里面是circle.js中导出的两个方法。

5. module命令

module命令可以取代import命令，达到整体输入模块的效果。

//index.js
module circle from './circle.js';

console.log('圆面积', circle.area(4));
console.log('圆周长', circle.circumference(4));
module命令后面跟一个变量，表示输入的模块定义到该变量上。circle变量是一个对象，里面是circle.js中导出的两个方法。


6. export default命令
1）export default 为模块指定默认输出

//export-default.js
export default function() {
    console.log('foo');
}

//import-default.js
//这里的name是给export-default.js导出的方法随便起的名字，
import name from './export-default.js';
name();
一个模块只有一个默认输出，一个模块只能有一个exp ort default, 所以import命令后面不用加大括号，因为只能对应到一个方法。

2）正是因为export default命令其实只是输出一个叫做default的变量，所以它后面不能跟变量声明语句。
// 正确
export var a = 1;

// 正确
var a = 1;
export default a;

// 错误
export default var a = 1;
上面代码中，export default a的含义是将变量a的值赋给变量default。所以，最后一种写法会报错。
同样地，因为export default命令的本质是将后面的值，赋给default变量，所以可以直接将一个值写在export default之后。
// 正确
export default 42;

// 报错
export 42;
注：
//child.js
var a = 10;
setTimeout(() => {
    a++;
    console.log('setTimeout中的a', a);
}, 500);

//这里是将a的值10付给default，再导出
export default a;

//a.js
import a from './child.js'
export default a;

//b.js
import b from './child.js'
export default b;

//index.js
import a from './a.js';
import b from './b.js';

console.log(a);
console.log(b);
console.log(a === b);

setTimeout(() => {
    console.log('index.js中');
    console.log(a);
    console.log(b);
    console.log(a === b);
}, 1000);




child.js中是将a的值10付给default，再导出，500ms后a的值变化，其他文件中的值不会跟着变。

export导出
//child.js
var a = 10;
setTimeout(() => {
    a++;
    console.log('setTimeout中的a', a);
}, 500);

//这里是将a的值10付给default，再导出
export {a};

//a.js
import {a} from './child.js'
export {a};

//b.js
import {a as b} from './child.js'
export {b};

//index.js
import {a} from './a.js';
import {b} from './b.js';

console.log(a);
console.log(b);
console.log(a === b);

setTimeout(() => {
    console.log('index.js中');
    console.log(a);
    console.log(b);
    console.log(a === b);
}, 1000);



child.js中导出变量a，值是10，再导出，500ms后a的值变化，其他文件中的值也跟着变。

7. 模块的继承

circleplus.js继承circle.js
// circle.js
export var a = 1;

// circleplus.js 当前模块继承了 circle 模块的所有输出
// 此处只是继承了输出，并不能直接使用
export * from 'circle';
export var e = 2.71828182846;
export default function(x) {
  return Math.exp(x);
}

// 继承之后，circleplus.js 相当于下面代码
export var a = 1;
export var e = 2.71828182846;
export default function(x) {
  return Math.exp(x);
}

8. ES6模块加载的实质
1）CommonJS模块输出的是一个值的拷贝，也就是说，一单输出一个值，模块内部的变化就影响不到这个值(类似于export default)。

//lib.js
var counter = 3;
function incCounter() {
    counter++;
}
module.exports = {
    counter: counter;
    incCouter: incCounter;
}
上面代码输出内部变量counteer和改写这个变量的内部方法incCounter()。
然后加载上面的模块。
//main.js
var counter = require('./lib).counter;
var incCounter = require('./lib).incCounter;

console.log(counter); //3
incCounter();
console.log(counter); //3
以上代码说明，counter输出胡以后Lib.js模块内部的变化影响不到counter了。

2）ES6模块输出的是值的引用，他遇到模块加载命令import时不会去执行模块，之后hi会生成与一个一个动态的只读引用。当真正需要用到时 ，再到模块里面取值。ES6模块是动态引用，并不会缓存值模块里面的变量绑定其所在的模块。
//lib.js
export let counter = 3;
export function incCounter() {
    counter++;
}

//main.js
import {counter, incCounter} from './lib.js';
console.log(counter); //3
incCounter();
console.log(counter); //4
以上代码说明，ES6模块输入的变量counter是活的，完全反应其所在模块lib.js内部的变化。

9. 循环加载

a依赖b，b依赖a，强耦合。
1）CommonJS的加载原理
CommonJS的模块是一个脚本文件。require命令第一次加载该脚本会执行整个脚本，在内存中生成一个对象。
{
    id: '',
    export: {...},
    loaded: true,
    ...
}
以上代码中，id是模块名，exports是模块输出的各个接口，loaded表示脚本是否执行完毕，以后用到这个模块的时候就会从exports对象中取值，及时再次执行require命令，也不会再次执行该模块，而是到缓存中取值。
2）CommonJS的循环加载
一旦某个模块循环加载，就只输出已经执行的部分，未执行的部分不会输出。
//a.js
exports.done = false;
var b = require('./b.js');
console.log('在a.js中b.done是',b.done);
exports.done = true;
console.log('a.js执行完毕');

//b.js
exports.done = false;
var a = require('./a.js');
console.log('在b.js中a.done是',a.done);
exports.done = true;
console.log('b.js执行完毕');

//main.js
var a = require('./a.js');
var b = require('./b.js');
console.log('在main.js中a.done和b.done分别是', a.done, b.done);

//在b.js中a.done是false
//b.js执行完毕
//在a.js中b.done是true
//a.js执行完毕
//在main.js中a.done和b.done分别是true true
到line 3，执行的只有line 2，exports.done = false; 。
进入b.js中，line 10又引入从a.js中引入a，此刻产实例循环加载，不会再回到a.js中，会先继续往下执行。注意，此时由于foo.js还没执行完，foo的值现在仍然是undefined。

说明：1）在b.js中a.js没有执行完毕，只执行了line 2。
2）main.js中执行到line 17时，不会再次执行b.js，二叔输出缓存中b.js的执行结果，即export.done = true。(因为没有打印出b.js中的 console)。

附加例子：
// foo.js
const bar = require('./bar.js');
console.log('value of bar:', bar);
module.exports = 'This is foo.js';

// bar.js
const foo = require('./foo.js');
//若是import方式引入 这里输出undefined
console.log('value of foo:', foo);
module.exports = 'This is bar.js';

// index.js
require('./foo.js');

//value of foo: {} value of bar: This is bar.js

3）ES6的循环加载
ES6模块只是动态引用，遇到模块加载命令import时不会执行模块，只是生成一个指向被加载模块的引用。
// foo.js
import bar from './bar.js';
function foo(invoker) {
    console.log(invoker + 'invokes foo.js');
    bar('foo.js');
}
export default foo;

// bar.js
import foo from './foo.js';
let invoked = false;
function bar(invoker) {
    if(!invoked) {
        invoked = true;
        console.log(invoker + 'invokes bar.js');
        foo('bar.js');
    }
}
export default bar;

//index.js
import foo from './foo.js';
foo(index.js);

//index.js invokes foo.js
//foo.js invokes bar.js
//bar.js invokes foo.js
可以看到，foo.js 和 bar.js循环依赖的模块均获取到了正确的导出值,下面让我们分析一下代码的执行过程:
index.js作为入口导入了foo.js，此时开始执行foo.js中的代码。
从foo.js导入了bar.js，执行权交给bar.js。
在bar.js中一直执行到其结束，完成bar函数的定义。注意，此时由于foo.js还没执行完，foo的值现在仍然是undefined。
执行权回到foo.js继续执行直到其结束，完成foo函数的定义。由于ES6 Module动态映射的特性，此时在bar.js中foo的值已经从undefined成为了我们定义的函数，这是与CommonJS在解决循环依赖时的本质区别，CommonJS中导入的是值的拷贝，不会随着被夹在模块中原有值的变化而变化。
执行权回到index.js并调用foo函数，此时会依次执行foo→bar→foo，并在控制台打出正确的值。由上面的例子可以看出，ES6 Module的特性使其可以更好地支持循环依赖，只是需要由开发者来保证当导入的值被使用时已经设置好正确的导出值。

10. Common.js 、AMD、CMD 、ES6 Module的区别

1）Node.js是commonJS规范的主要实践者，commonJS用同步的方式加载模块。在服务端，模块文件都存在本地磁盘，读取非常快，所以这样做不会有问题。但是在浏览器端，限于网络原因，更合理的方案是使用异步加载。
2）AMD规范采用异步方式加载模块，模块的加载不影响它后面语句的运行，所有依赖这个模块的语句，都定义在一个回调函数中，等到加载完成之后，这个回调函数才会运行。
3）require.js在申明依赖的模块时会在第一之间加载并执行模块内的代码：CMD是另一种js模块化方案，它与AMD很类似，不同点在于：AMD 推崇依赖前置、提前执行，CMD推崇依赖就近、延迟执行。此规范其实是在sea.js推广过程中产生的。
/** AMD写法 **/
define(["a", "b", "c", "d", "e", "f"], function(a, b, c, d, e, f) { 
     // 等于在最前面声明并初始化了要用到的所有模块
    a.doSomething();
    if (false) {
        // 即便没用到某个模块 b，但 b 还是提前执行了
        b.doSomething()
    } 
});

/** CMD写法 **/
define(function(require, exports, module) {
    var a = require('./a'); //在需要时申明
    a.doSomething();
    if (false) {
        var b = require('./b');
        b.doSomething();
    }
});
4）ES6在语言标准的层面上，实现了模块功能，而且实现得相当简单，旨在成为浏览器和服务器通用的模板解决方案。更趋近于ADM的引用写法；ES6的模块不是对象，import命令会被 JavaScript 引擎静态分析，在编译时就引入模块代码，而不是在代码运行时加载，所以无法实现条件加载。也正因为这个，使得静态分析成为可能。CommonJS 加载的是一个对象（即module.exports属性），该对象只有在脚本运行完才会生成。而 ES6 模块不是对象，它的对外接口只是一种静态定义，在代码静态解析阶段就会生成

11. ES6模块的转码

ES6转成ES5出来使用babel还可以：
1）ES6 module transpiler
2）SystemJS
