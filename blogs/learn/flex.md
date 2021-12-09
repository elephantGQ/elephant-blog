---
title: flex多列布局
date: 2021-08-30 04:54:02
tags:
 - flex
categories:
 -  flex
sidebar: auto
publish: true
---

## 基本的等分三列布局
    .container{
            display: flex;
            width: 500px;
            height: 200px;
        }
        .left{
            flex:1;
            background: red;
        }
        .middle{
            flex:1;
            background: green;
        }
        .right{
            flex:1;
            background: blue;
        }
    <div class="container">
        <div class="left"></div>
        <div class="middle"></div>
        <div class="right"></div>
    </div>
    
    
![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5c1ab38c09734cdfaaffb74b44a9b66f~tplv-k3u1fbpfcp-zoom-1.image)

## 三列 左中定宽 右侧自适应 ##
        .container{
            display: flex;
            height: 300px;
        }
        .left{
            flex: 0 0 100px;
            background-color: red;
        }
        .middle{
            flex: 0 0 100px;
            background-color: green;
        }
        .right{
            flex:1;
            background-color: blue;
        }
      <div class="container">
        <div class="left">qqq</div>
        <div class="middle">qqq</div>
        <div class="right">wwww</div>
    </div>
    
![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/357a6a2e700141a9975a8446c6217c1c~tplv-k3u1fbpfcp-zoom-1.image)
缩小浏览器窗口后
![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0fcf715ed0f34ad0afed1447a99ad7a4~tplv-k3u1fbpfcp-zoom-1.image)

左右固定，中间自适应
----------

 
        .container{
            display: flex;
            height: 300px;
        }
        .left{
            width: 100px;
            background-color: red;
        }
        .middle{
            flex: 1;
            background-color: green;
        }
        .right{
           width: 100px;
            background-color: blue;
        }
       <div class="container">
        <div class="left">qqq</div>
        <div class="middle">qqq</div>
        <div class="right">wwww</div>
    </div>
    
![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/be9f3f3698f04191ba8c7d2d9a25bdde~tplv-k3u1fbpfcp-zoom-1.image)
缩小浏览器窗口后

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4fb523cb3137444fa2f24ba472e21d88~tplv-k3u1fbpfcp-zoom-1.image)

## 九宫格布局 ##
        .container{
            display: flex;
            height: 300px;
            width: 300px;
            flex-direction: column;
        }
        .row{
            display: flex;
            height: 100px;
        }
        .left{
            flex: 1;
            height: 100px;
            border: 1px solid red;
        }
        .middle{
            flex: 1;
            height: 100px;
            border: 1px solid green;
        }
        .right{
            flex: 1;
            height: 100px;
            border: 1px solid blue;
        }
        <div class="container">
        <div class="row">
            <div class="left"></div>
            <div class="middle"></div>
            <div class="right"></div>
        </div>
        <div class="row">
            <div class="left"></div>
            <div class="middle"></div>
            <div class="right"></div>
        </div>
        <div class="row">
            <div class="left"></div>
            <div class="middle"></div>
            <div class="right"></div>
        </div>
    </div>
    

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/bcb4b5322eaf442bb3bb27acba27b721~tplv-k3u1fbpfcp-zoom-1.image)


## 圣杯布局 ##
        *{
            margin:0;
            padding:0;
        }
        .container{
            display: flex;
            flex-direction: column;
            min-height: 100vh;
            justify-content: space-between;
        }
        .header{
            background: red;
            flex: 0 0 100px;
        }
        .content{
            display: flex;
            flex:1;
        }
        .content-left{
            flex: 0 0 100px;
            background: green;
        }
        .content-right{
            flex: 0 0 100px;
            background: pink;
        }
        .content-middle{
            flex:1;
        }
        .footer{
            background: yellow;
            flex: 0 0 100px;
        }
        <div class="container">
        <div class="header">Header</div>
        <div class="content">
            <div class="content-left">Left</div>
            <div class="content-middle">Center</div>
            <div class="content-right">Right</div>
        </div>
        <div class="footer">Footer</div>
    </div>
    

![clipboard.png](/img/bVbigye)![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b0aa4f10b1924f7095ad2537e9e02566~tplv-k3u1fbpfcp-zoom-1.image)

缩小浏览器窗口之后
![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f94c9f753922409488c598d18f973e2f~tplv-k3u1fbpfcp-zoom-1.image)
