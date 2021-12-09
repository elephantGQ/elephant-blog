---
title: Promise
date: 2021-10-29 21:14:21
tags:
 - es6
categories:
 -  es6
sidebar: auto
publish: true
---

# Promise不会？？看这里！！！史上最通俗易懂的Promise！！！


一、什么是Promise？我们用Promise来解决什么问题？
-------------------------------

> Promise 是异步编程的一种解决方案： 从语法上讲，promise是一个对象，从它可以获取异步操作的消息；从本意上讲，它是承诺，承诺它过一段时间会给你一个结果。 promise有三种状态：**pending(等待态)，fulfiled(成功态)，rejected(失败态)**；状态一旦改变，就不会再变。创造promise实例后，它会立即执行。

我相信大家经常写这样的代码：

    // 当参数a大于10且参数fn2是一个方法时 执行fn2
    function fn1(a, fn2) {
        if (a > 10 && typeof fn2 == 'function') {
            fn2()
        }
    }
    fn1(11, function() {
        console.log('this is a callback')
    })复制代码

一般来说我们会碰到的回调嵌套都不会很多，一般就一到两级，但是某些情况下，回调嵌套很多时，代码就会非常繁琐，会给我们的编程带来很多的麻烦，这种情况俗称——回调地狱。  

这时候我们的promise就应运而生、粉墨登场了

promise是用来解决两个问题的：

*   回调地狱，代码难以维护， 常常第一个的函数的输出是第二个函数的输入这种现象
    
*   promise可以支持多个并发的请求，获取并发请求中的数据
    
*   这个promise可以解决异步的问题，本身不能说promise是异步的  
    

  

二、es6 promise用法大全
-----------------

Promise是一个构造函数，自己身上有all、reject、resolve这几个眼熟的方法，原型上有then、catch等同样很眼熟的方法。

那就new一个

    let p = new Promise((resolve, reject) => {
        //做一些异步操作
        setTimeout(() => {
            console.log('执行完成');
            resolve('我是成功！！');
        }, 2000);
    });复制代码

Promise的构造函数接收一个参数：函数，并且这个函数需要传入两个参数：

*   resolve ：异步操作执行成功后的回调函数  
    
*   reject：异步操作执行失败后的回调函数

### then 链式操作的用法  

所以，从表面上看，Promise只是能够简化层层回调的写法，而实质上，Promise的精髓是“状态”，用维护状态、传递状态的方式来使得回调函数能够及时调用，它比传递callback函数要简单、灵活的多。所以使用Promise的正确场景是这样的：

    p.then((data) => {
        console.log(data);
    })
    .then((data) => {
        console.log(data);
    })
    .then((data) => {
        console.log(data);
    });复制代码

  

### reject的用法 :

把Promise的状态置为rejected，这样我们在then中就能捕捉到，然后执行“失败”情况的回调。看下面的代码。

        let p = new Promise((resolve, reject) => {
            //做一些异步操作
          setTimeout(function(){
                var num = Math.ceil(Math.random()*10); //生成1-10的随机数
                if(num<=5){
                    resolve(num);
                }
                else{
                    reject('数字太大了');
                }
          }, 2000);
        });
        p.then((data) => {
                console.log('resolved',data);
            },(err) => {
                console.log('rejected',err);
            }
        ); 
    复制代码

then中传了两个参数，then方法可以接受两个参数，第一个对应resolve的回调，第二个对应reject的回调。所以我们能够分别拿到他们传过来的数据。多次运行这段代码，你会随机得到下面两种结果：  

![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2018/5/19/16377e1df3ec16ee~tplv-t2oaga2asx-watermark.awebp)或者![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2018/5/19/16377e4fd8619228~tplv-t2oaga2asx-watermark.awebp)

### catch的用法

我们知道Promise对象除了then方法，还有一个catch方法，它是做什么用的呢？其实它和then的第二个参数一样，用来指定reject的回调。用法是这样：

    p.then((data) => {
        console.log('resolved',data);
    }).catch((err) => {
        console.log('rejected',err);
    });复制代码

效果和写在then的第二个参数里面一样。不过它还有另外一个作用：在执行resolve的回调（也就是上面then中的第一个参数）时，如果抛出异常了（代码出错了），那么并不会报错卡死js，而是会进到这个catch方法中。请看下面的代码：  

    p.then((data) => {
        console.log('resolved',data);
        console.log(somedata); //此处的somedata未定义
    })
    .catch((err) => {
        console.log('rejected',err);
    });复制代码

在resolve的回调中，我们console.log(somedata);而somedata这个变量是没有被定义的。如果我们不用Promise，代码运行到这里就直接在控制台报错了，不往下运行了。但是在这里，会得到这样的结果：

![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2018/5/19/1637880bdb32bee3~tplv-t2oaga2asx-watermark.awebp)  

也就是说进到catch方法里面去了，而且把错误原因传到了reason参数中。即便是有错误的代码也不会报错了，这与我们的try/catch语句有相同的功能

### all的用法：谁跑的慢，以谁为准执行回调。all接收一个数组参数，里面的值最终都算返回Promise对象

Promise的all方法提供了并行执行异步操作的能力，并且在所有异步操作执行完后才执行回调。看下面的例子：

    let Promise1 = new Promise(function(resolve, reject){})
    let Promise2 = new Promise(function(resolve, reject){})
    let Promise3 = new Promise(function(resolve, reject){})
    
    let p = Promise.all([Promise1, Promise2, Promise3])
    
    p.then(funciton(){
      // 三个都成功则成功  
    }, function(){
      // 只要有失败，则失败 
    })
    复制代码

有了all，你就可以并行执行多个异步操作，并且在一个回调中处理所有的返回数据，是不是很酷？_有一个场景是很适合用这个的，一些游戏类的素材比较多的应用，打开网页时，预先加载需要用到的各种资源如图片、flash以及各种静态文件。所有的都加载完后，我们再进行页面的初始化。_

### race的用法：谁跑的快，以谁为准执行回调

race的使用场景：比如我们可以用race给某个异步请求设置超时时间，并且在超时后执行相应的操作，代码如下：  

     //请求某个图片资源
        function requestImg(){
            var p = new Promise((resolve, reject) => {
                var img = new Image();
                img.onload = function(){
                    resolve(img);
                }
                img.src = '图片的路径';
            });
            return p;
        }
        //延时函数，用于给请求计时
        function timeout(){
            var p = new Promise((resolve, reject) => {
                setTimeout(() => {
                    reject('图片请求超时');
                }, 5000);
            });
            return p;
        }
        Promise.race([requestImg(), timeout()]).then((data) =>{
            console.log(data);
        }).catch((err) => {
            console.log(err);
        });
    复制代码

requestImg函数会异步请求一张图片，我把地址写为"图片的路径"，所以肯定是无法成功请求到的。timeout函数是一个延时5秒的异步操作。我们把这两个返回Promise对象的函数放进race，于是他俩就会赛跑，如果5秒之内图片请求成功了，那么遍进入then方法，执行正常的流程。如果5秒钟图片还未成功返回，那么timeout就跑赢了，则进入catch，报出“图片请求超时”的信息。运行结果如下：  

![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2018/5/19/16376a95ffa3b13c~tplv-t2oaga2asx-watermark.awebp)  

好了，我相信大家对用法已经懂了，那么我们来手写一款自己的promise吧

三、根据promiseA+实现一个自己的promise
---------------------------

### 步骤一：实现成功和失败的回调方法

要实现上面代码中的功能，也是promise最基本的功能。首先，需要创建一个构造函数promise，创建一个promisel类，在使用的时候传入了一个执行器executor，executor会传入两个参数：成功(resolve)和失败(reject)。之前说过，只要成功，就不会失败，只要失败就不会成功。所以，默认状态下，在调用成功时，就返回成功态，调用失败时，返回失败态。代码如下：

    class Promise {
        constructor (executor){
            //默认状态是等待状态
            this.status = 'panding';
            this.value = undefined;
            this.reason = undefined;
            //存放成功的回调
            this.onResolvedCallbacks = [];
            //存放失败的回调
            this.onRejectedCallbacks = [];
            let resolve = (data) => {//this指的是实例
                if(this.status === 'pending'){
                    this.value = data;
                    this.status = "resolved";
                    this.onResolvedCallbacks.forEach(fn => fn());
                }
     
            }
            let reject = (reason) => {
                if(this.status === 'pending'){
                    this.reason = reason;
                    this.status = 'rejected';
                    this.onRejectedCallbacks.forEach(fn => fn());
                }
            }
            try{//执行时可能会发生异常
                executor(resolve,reject);
            }catch (e){
                reject(e);//promise失败了
            }
           
        }复制代码

> promise A+规范规定，在有异常错误时，则执行失败函数。

    constructor (executor){
        ......      try{
            executor(resolve,reject);
          }catch(e){
            reject(e);
          }
      }
    复制代码

### 步骤二：then方法链式调用

then方法是promise的最基本的方法，返回的是两个回调，一个成功的回调，一个失败的回调，实现过程如下：  

        then(onFulFilled, onRejected) {
        if (this.status === 'resolved') { //成功状态的回调
          onFulFilled(this.value);
        }
        if (this.status === 'rejected') {//失败状态的回调
          onRejected(this.reason);
        }
      }复制代码

    let p = new Promise(function(){
        resolve('我是成功');
    })
    p.then((data) => {console.log(data);},(err) => {});
    p.then((data) => {console.log(data);},(err) => {});
    p.then((data) => {console.log(data);},(err) => {});
    复制代码

返回的结果是：  

    我是成功
    我是成功
    我是成功
    复制代码

为了实现这样的效果，则上一次的代码将要重新写过，我们可以把每次调用resolve的结果存入一个数组中，每次调用reject的结果存入一个数组。这就是**为何会在上面定义两个数组,且分别在resolve()和reject()遍历两个数组的原因**。因此，在调用resolve()或者reject()之前，我们在pending状态时，会把多次then中的结果存入数组中，则上面的代码会改变为：

      then(onFulFilled, onRejected) {
        if (this.status === 'resolved') {
          onFulFilled(this.value);
        }
        if (this.status === 'rejected') {
          onRejected(this.reason);
        }
        // 当前既没有完成 也没有失败
        if (this.status === 'pending') {
          // 存放成功的回调
          this.onResolvedCallbacks.push(() => {
            onFulFilled(this.value);
          });
          // 存放失败的回调
          this.onRejectedCallbacks.push(() => {
            onRejected(this.reason);
          });
        }
      }复制代码

> Promise A+规范中规定then方法可以链式调用

在promise中，要实现链式调用返回的结果是返回一个新的promise，第一次then中返回的结果，无论是成功或失败，都将返回到下一次then中的成功态中，但在第一次then中如果抛出异常错误，则将返回到下一次then中的失败态中  

**链式调用成功时**

链式调用成功会返回值，有多种情况，根据举的例子，大致列出可能会发生的结果。因此将链式调用返回的值单独写一个方法。方法中传入四个参数，分别是p2,x,resolve,reject,p2指的是上一次返回的promise，x表示运行promise返回的结果，resolve和reject是p2的方法。则代码写为：

    function resolvePromise(p2,x,resolve,reject){
        ....
    }
    复制代码

*   返回结果不能是自己  
    

    var p = new Promise((resovle,reject) => {
        return p;     //返回的结果不能是自己，
    })
    复制代码

当返回结果是自己时，永远也不会成功或失败，因此当返回自己时，应抛出一个错误  

    function resolvePromise(p2,x,resolve,reject){
        if(px===x){
            return reject(new TypeError('自己引用自己了'));
        }
        ....
    }
    复制代码

*   返回结果可能是promise

    function resolvePromise(promise2,x,resolve,reject){
        //判断x是不是promise
        //规范中规定：我们允许别人乱写，这个代码可以实现我们的promise和别人的promise 进行交互
        if(promise2 === x){//不能自己等待自己完成
            return reject(new TypeError('循环引用'));
        };
        // x是除了null以外的对象或者函数
        if(x !=null && (typeof x === 'object' || typeof x === 'function')){
            let called;//防止成功后调用失败
            try{//防止取then是出现异常  object.defineProperty
                let then = x.then;//取x的then方法 {then:{}}
                if(typeof then === 'function'){//如果then是函数就认为他是promise
                    //call第一个参数是this，后面的是成功的回调和失败的回调
                    then.call(x,y => {//如果Y是promise就继续递归promise
                        if(called) return;
                        called = true;
                        resolvePromise(promise2,y,resolve,reject)
                    },r => { //只要失败了就失败了
                        if(called) return;
                        called = true;
                        reject(r);  
                    });
                }else{//then是一个普通对象，就直接成功即可
                    resolve(x);
                }
            }catch (e){
                if(called) return;
                called = true;
                reject(e)
            }
        }else{//x = 123 x就是一个普通值 作为下个then成功的参数
            resolve(x)
        }
    
    }复制代码

*   返回结果可能为一个普通值，则直接   resolve(x);

*   Promise一次只能调用成功或者失败

也就是当调用成功就不能再调用失败了，如果两个都调用的时候，哪个先调用就执行哪一个。代码部分还是上面那部分  

个人认为，这个地方比较绕，需要慢慢的一步一步的理清楚。  

根据promise A+规范原理，promise在自己的框架中，封装了一系列的内置的方法。

*   捕获错误的方法 **catch()**
*   解析全部方法 **all()**
*   竞赛 **race()**
*   生成一个成功的promise  **resolve()**
*   生成一个失败的promise  **reject()**

最后给大家附上全部源码，供大家仔细品读。

    function resolvePromise(promise2,x,resolve,reject){
        //判断x是不是promise
        //规范中规定：我们允许别人乱写，这个代码可以实现我们的promise和别人的promise 进行交互
        if(promise2 === x){//不能自己等待自己完成
            return reject(new TypeError('循环引用'));
        };
        // x是除了null以外的对象或者函数
        if(x !=null && (typeof x === 'object' || typeof x === 'function')){
            let called;//防止成功后调用失败
            try{//防止取then是出现异常  object.defineProperty
                let then = x.then;//取x的then方法 {then:{}}
                if(typeof then === 'function'){//如果then是函数就认为他是promise
                    //call第一个参数是this，后面的是成功的回调和失败的回调
                    then.call(x,y => {//如果Y是promise就继续递归promise
                        if(called) return;
                        called = true;
                        resolvePromise(promise2,y,resolve,reject)
                    },r => { //只要失败了就失败了
                        if(called) return;
                        called = true;
                        reject(r);  
                    });
                }else{//then是一个普通对象，就直接成功即可
                    resolve(x);
                }
            }catch (e){
                if(called) return;
                called = true;
                reject(e)
            }
        }else{//x = 123 x就是一个普通值 作为下个then成功的参数
            resolve(x)
        }
    
    }
    
    class Promise {
        constructor (executor){
            //默认状态是等待状态
            this.status = 'panding';
            this.value = undefined;
            this.reason = undefined;
            //存放成功的回调
            this.onResolvedCallbacks = [];
            //存放失败的回调
            this.onRejectedCallbacks = [];
            let resolve = (data) => {//this指的是实例
                if(this.status === 'pending'){
                    this.value = data;
                    this.status = "resolved";
                    this.onResolvedCallbacks.forEach(fn => fn());
                }
     
            }
            let reject = (reason) => {
                if(this.status === 'pending'){
                    this.reason = reason;
                    this.status = 'rejected';
                    this.onRejectedCallbacks.forEach(fn => fn());
                }
            }
            try{//执行时可能会发生异常
                executor(resolve,reject);
            }catch (e){
                reject(e);//promise失败了
            }
           
        }
        then(onFuiFilled,onRejected){ 
            //防止值得穿透 
            onFuiFilled = typeof onFuiFilled === 'function' ? onFuiFilled : y => y;
            onRejected = typeof onRejected === 'function' ? onRejected :err => {throw err;}        
            let promise2;//作为下一次then方法的promise
           if(this.status === 'resolved'){
               promise2 = new Promise((resolve,reject) => {
                   setTimeout(() => {
                      try{
                            //成功的逻辑 失败的逻辑
                            let x = onFuiFilled(this.value);
                            //看x是不是promise 如果是promise取他的结果 作为promise2成功的的结果
                            //如果返回一个普通值，作为promise2成功的结果
                            //resolvePromise可以解析x和promise2之间的关系
                            //在resolvePromise中传入四个参数，第一个是返回的promise，第二个是返回的结果，第三个和第四个分别是resolve()和reject()的方法。
                            resolvePromise(promise2,x,resolve,reject)
                      }catch(e){
                            reject(e);
                      } 
                   },0)
               }); 
           } 
           if(this.status === 'rejected'){
                promise2 = new Promise((resolve,reject) => {
                    setTimeout(() => {
                        try{
                            let x = onRejected(this.reason);
                            //在resolvePromise中传入四个参数，第一个是返回的promise，第二个是返回的结果，第三个和第四个分别是resolve()和reject()的方法。
                            resolvePromise(promise2,x,resolve,reject)
                        }catch(e){
                            reject(e);
                        }
                    },0)
    
                });
           }
           //当前既没有完成也没有失败
           if(this.status === 'pending'){
               promise2 = new Promise((resolve,reject) => {
                   //把成功的函数一个个存放到成功回调函数数组中
                    this.onResolvedCallbacks.push( () =>{
                        setTimeout(() => {
                            try{
                                let x = onFuiFilled(this.value);
                                resolvePromise(promise2,x,resolve,reject);
                            }catch(e){
                                reject(e);
                            }
                        },0)
                    });
                    //把失败的函数一个个存放到失败回调函数数组中
                    this.onRejectedCallbacks.push( ()=>{
                        setTimeout(() => {
                            try{
                                let x = onRejected(this.reason);
                                resolvePromise(promise2,x,resolve,reject)
                            }catch(e){
                                reject(e)
                            }
                        },0)
                    })
               })
           }
           return promise2;//调用then后返回一个新的promise
        }
        catch (onRejected) {
            // catch 方法就是then方法没有成功的简写
            return this.then(null, onRejected);
        }
    }
    Promise.all = function (promises) {
        //promises是一个promise的数组
        return new Promise(function (resolve, reject) {
            let arr = []; //arr是最终返回值的结果
            let i = 0; // 表示成功了多少次
            function processData(index, data) {
                arr[index] = data;
                if (++i === promises.length) {
                    resolve(arr);
                }
            }
            for (let i = 0; i < promises.length; i++) {
                promises[i].then(function (data) {
                    processData(i, data)
                }, reject)
            }
        })
    }
    // 只要有一个promise成功了 就算成功。如果第一个失败了就失败了
    Promise.race = function (promises) {
        return new Promise((resolve, reject) => {
            for (var i = 0; i < promises.length; i++) {
                promises[i].then(resolve,reject)
            }
        })
    }
    // 生成一个成功的promise
    Promise.resolve = function(value){
        return new Promise((resolve,reject) => resolve(value);
    }
    // 生成一个失败的promise
    Promise.reject = function(reason){
        return new Promise((resolve,reject) => reject(reason));
    }
    Promise.defer = Promise.deferred = function () {
        let dfd = {};
        dfd.promise = new Promise( (resolve, reject) =>  {
            dfd.resolve = resolve;
            dfd.reject = reject;
        });
        return dfd
    }
    module.exports = Promise;
    复制代码

关于这篇promise A+规范的总结，肯定会存在很多不足的地方，欢迎各位提出宝贵的意见或建议，也希望能帮助到你从中获得一些知识！
