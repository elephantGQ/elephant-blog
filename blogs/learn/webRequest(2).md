---
title: 网络请求不只是Ajax
date: 2020-10-15 19:45
tags:
  - 继承
categories:
  - JS基础
sidebar: "auto"
---

# 网络请求不只是 Ajax

介绍 Ajax 底层的 XMLHttpRequest API，近几年的新锐 fetch API 和 另一个神秘又冷门的 API

## Ajax

### 什么是 Ajax ？

维基百科上的定义是

> Ajax (also AJAX /ˈeɪdʒæks/; short for "Asynchronous JavaScript and XML")[1][2] is a set of web development techniques using many web technologies on the client side to create asynchronous web applications.

这是比较广义的定义。

狭义的 Ajax 定义实际上 —— 借助 Web API XMLHttpRequest 使前端可以跟后端进行异步通讯的技术。

（题外话：为什么频繁看到 xml ？异步通讯跟 xml 有什么关系？答：在“上古时期”前后端通讯的数据格式就是 xml，后来才开始广泛使用 json ）

关于 XMLHttpRequest 的具体文档可以查看 (XMLHttpRequest - Web APIs)[https://link.zhihu.com/?target=https%3A//developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest]

一起重点看看如何使用 XMLHttpRequest

```js
var xhr = new XMLHttpRequest(); // 新建实例
xhr.open("GET", BASE_URL + "/users", true); // 三个参数
xhr.onload = function(e) {
  // 注册事件监听的方式
  if (xhr.readyState === 4) {
    if (xhr.status === 200) {
      console.log(xhr.responseText);
    } else {
      console.error(xhr.statusText);
    }
  }
};
xhr.onerror = function(e) {
  console.error(xhr.statusText);
};
xhr.send(null); // 触发请求
```

解析：

- XMLHttpRequest 是个类，每次使用都要新建一个实例
- open 方法接受三个参数，第一个是请求的方法（如 GET、POST），第二个是目的 url，第三个先卖个关子后面再说
- 给 onload 事件注册监听回调函数，当 readyState === 4 且 status === 200 时，说明请求成功，返回的数据存放在 responseText 里
- 类似地 onerror 可以用来注册请求错误的回调函数
- 最后 send 方法触发请求，由于是 Get 请求所以参数为 null
  再看看简单的 POST 请求

```js
var xhr = new XMLHttpRequest();
xhr.open("POST", BASE_URL + "/users", true);
xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");

xhr.onload = function(e) {
  if (xhr.readyState === 4) {
    if (xhr.status === 200) {
      console.log(xhr.responseText);
    } else {
      console.error(xhr.statusText);
    }
  }
};
xhr.onerror = function(e) {
  console.error(xhr.statusText);
};

xhr.send(payload);
```

POST 请求同上面的 GET 请求类似，2 个地方略微不同

- 这个例子中前端将向后端 API 发生 json 数据，所以使用 setRequestHeader 设置了 header
- 最后 send 方法传入 json 数据

（_注意_：上面这两种写法都是异步请求）

## Fetch API

Fetch API 是个较新的 API，某些旧浏览器可能不支持 （ 兼容性参考文档 (Fetch API - Web APIs)[https://link.zhihu.com/?target=https%3A//developer.mozilla.org/en-US/docs/Web/API/Fetch_API%23Browser_compatibility]）

Fetch API 只支持异步请求

Fetch API 放弃了 XMLHttpRequest 的回调函数的方式，拥抱了 Promise

看一些示例代码：

Fetch Get 请求

```js
fetch("/users")
  .then((response) => response.json())
  .then((data) => {
    console.log(data);
  });
```

Fetch Post 请求

```js
fetch("/users", {
  mode: "cors", // 支持跨域请求
  method: "post",
  body: payload,
  headers: {
    "Content-Type": "application/json",
  },
})
  .then((response) => response.json())
  .then((data) => {
    console.log(data);
  });
```

很明显的，Fetch API 使用更简单，语法更简洁

## navigator.sendBeacon

> The navigator.sendBeacon() method asynchronously sends a small amount of data over HTTP to a web server. It’s intended to be used in combination with the visibilitychange event
> 这个 API 是专门跟 visibilitychange 事件一起使用的，通常使用它异步地发送小部分数据给服务器。

（官方文档不建议 navigator.sendBeacon 跟 window 的 unload、beforeunload 事件一起使用）

使用以下代码就能达到 在用户关闭页面时需要给服务器发送一个请求 的效果

```js
document.addEventListener("visibilitychange", function() {
  if (document.visibilityState === "visible") {
    console.log("visible");
  } else {
    console.log("invisible");
    const headers = {
      type: "application/json",
    };
    const blob = new Blob([JSON.stringify(data)], headers);
    window.navigator.sendBeacon("/users", blob);
  }
});
```

并且 navigator.sendBeacon 发起请求是异步的，不会影响用户的体验。

但在测试时，我发现使用 navigator.sendBeacon 时有 CORS 的限制 —— 在同源环境下就没问题了，这边不做赘述，有兴趣的读者可以自行测试。

![](https://pic4.zhimg.com/80/v2-94e71e1580f7acf27bb419d3e1324373_720w.png)

## 前端怎么做同步请求？

在前端应用中，几乎所有场景都建议使用异步的网络请求以避免阻塞 UI 的渲染。

但在某些特别的场景中，却希望网络请求是同步的。

上面说了，Fetch API 是不支持同步请求的；但是 XMLHttpRequest 却支持同步请求，请求是否是同步取决于上面看到的 open 方法的第三个参数 —— 这个参数是个布尔值（boolean）， 默认值是 true；true 发起异步请求，false 发起同步请求。同步请求时，当请求发送完成后 send 方法才会返回。

使用同步请求时，代码也会略微不同

同步的 post 请求

```js
function syncXmlHttpPost() {
  var xhr = new XMLHttpRequest();
  xhr.open("POST", "/users", false); // 同步请求
  xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
  xhr.send(paylod); // 请求结束时，这个方法才会返回，继续执行下一行
  console.log(xhr.responseText); // 打印出返回的结果
}
```

我自己简单写了个 demo，展示一下同步请求和异步请求在 UI 上的不同，可以留意一下我点击 SYNC XHR GET 和 SYNC XHR POST 按钮时界面停滞的效果

[视频地址](https://video.zhihu.com/video/1326596190028963840)

同步请求会导致主线程被阻塞，如果请求时间长，用户会感觉页面卡顿，因此大部分现代浏览器对同步的 XMLHttpRequest 有限制。

比如：如果在 window 的 visibilitychange 事件注册回调函数里使用了 同步的 XMLHttpRequest，浏览器会发出警告，但依然发出请求。
![](https://pic4.zhimg.com/80/v2-0c082ca52a33893914a0d07d2edf8cf7_720w.png)

而在 window 的 unload、beforeunload 事件注册回调函数里使用了 同步的 XMLHttpRequest，浏览器会直接忽略这个请求 —— 事实上，fetch 和 异步 XMLHttpRequest 在这个场景下也同样会被忽略/取消。

那么问题来了，如果在用户关闭页面时需要给服务器发送一个请求（比如 记录用户关闭页面的时间），怎么做才是正确的呢？

答案是一个冷门的 API —— navigator.sendBeacon

## 总结

本文简单介绍了三个网络请求相关的 Web API

- XMLHttpRequest —— 最古老，但兼容性最好的 API；同时支持同步请求。
- Fetch API —— 比较新的 API，某些旧浏览器不支持；只支持异步请求；返回 Promise 。
- navigator.sendBeacon —— 一个冷门但实用的 API，尤其针对页面关闭发送请求的场景。

而一些网络请求第三方库其实底层也不过是封装了上面的 API，比如 Axios 在浏览器上使用时，底层使用的就是 XMLHttpRequest
