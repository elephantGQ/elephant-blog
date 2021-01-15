---
title: 位运算应用
date: 2020-12-15 20:05
tags:
  - 位运算
categories:
  - JS基础
sidebar: "auto"
---

# 位运算应用

[斯坦福大学整理的位运算技巧](http://graphics.stanford.edu/~seander/bithacks.html#OperationCounting)

## 获得 型最大值

```js
function getMaxInt() {
  return (1 << 31) - 1; //2147483647， 由于优先级关系，括号不可省略
}
// 另一种写法
function getMaxInt2() {
  return ~(1 << 31); //2147483647
}

// 另一种写法
function getMaxInt3() {
  return (1 << -1) - 1; //2147483647
}
```

## 获得 型最小值

```js
function getMinInt() {
  return 1 << 31; //-2147483648
}
// 另一种写法
function getMinInt() {
  return 1 << -1; //-2147483648
}
```

## 区分两个数大小

```js
// variables
var a = 9285;
var b = 3569;

// 取大
var max = a ^ ((a ^ b) & -(a < b));//9285;

// 取小
var min =  b ^ ((a ^ b) & -(a < b);//3569

```

## 判断正负

```js
function isPos(n) {
  return n === n >>> 0 ? true : false;
}
isPos(-1); // false
isPos(1); // true
```

## >>和<< 位运算

```js
// 乘以2的运算
function mulTwo(n) {
  return n << 1;
}
// 除以2的运算
function divTwo(n) {
  return n >> 1;
}
//  乘以2的m次方
function mulTwoPower(n, m) {
  //计算n*(2^m)
  return n << m;
}
//  除以以2的m次方
function divTwoPower(n, m) {
  //计算n/(2^m)
  return n >> m;
}
```

## 使用&运算符判断一个数的奇偶

```js
// 偶数 & 1 = 0
// 奇数 & 1 = 1
console.log(2 & 1); // 0
console.log(3 & 1); // 1
```

## 使用~, >>, <<, >>>, |来取整

```js
console.log(~~6.83); // 6
console.log(6.83 >> 0); // 6
console.log(6.83 << 0); // 6
console.log(6.83 | 0); // 6
// >>>不可对负数取整
console.log(6.83 >>> 0); // 6
```

## 使用按位非~判断索引存在

```js
// 如果url含有?号，则后面拼上&符号，否则加上?号
url += ~url.indexOf("?") ? "&" : "?";
// ~-1 === 0
```

## 使用^来完成值交换

```js
var a = 5;
var b = 8;
a ^= b;
b ^= a;
a ^= b;
console.log(a); // 8
console.log(b); // 5
```

另一种写法

```js
var temp = a; a = b; b = temp; (传统，但需要借助临时变量)
a ^= b; b ^= a; a ^= b; (需要两个整数)
b = [a, a = b][0] (借助数组)
[a, b] = [b, a]; (ES6，解构赋值)
a = a + b; b = a - b; a = a - b; (小学奥赛题)
a=b + ((b=a),0);(逗号运算符）
```

## 求两个数的平均数

```js
function avarge(x, y){
	return (x & y) + ((x ^ y) >> 1);
}
function getAverage(x, y){
    return (x + y) >> 1;
｝

```

## 利用 a & (a-1)判断一个数是否是 2 的幂次

```js
a & (a - 1);
```

## 权限验证

```js
let r = 0b100;
let w = 0b010;
let x = 0b001;

// 给用户赋全部权限（使用前面讲的 | 操作）
//添加权限
let user = r | w | x;

console.log(user);
// 7

console.log(user.toString(2));
// 111

//     r = 0b100
//     w = 0b010
//     r = 0b001
// r|w|x = 0b111\

//校验权限
user = r | w;
console.log((user & r) === r); // true  有 r 权限
console.log((user & w) === w); // true  有 w 权限
console.log((user & x) === x); // false 没有 x 权限

//删除权限
// 执行异或操作，删除 r 权限
user = user ^ r;
```

## 判断符号是否相等

```js
function isSameSign(x, y) {
  //有0的情况例外
  return (x ^ y) >= 0; // true 表示 x和y有相同的符号， false表示x，y有相反的符号。
}
```

## 对二进制位的操作

```js
// 从低位到高位,取n的第m位
function getBit(n, m) {
  return (n >> (m - 1)) & 1;
}
// 从低位到高位.将n的第m位置1
function setBitToOne(n, m) {
  return n | (1 << (m - 1));
  /*将1左移m-1位找到第m位，得到000...1...000
	  n在和这个数做或运算*/
}
//从低位到高位,将n的第m位置0
function setBitToZero(n, m) {
  return n & ~(1 << (m - 1));
  /* 将1左移m-1位找到第m位，取反后变成111...0...1111
	   n再和这个数做与运算*/
}
```

## 使用二进制进行子集枚举

```js
function process(a, n) {
  for (let i = 1; i < 1 << n; i++) {
    //1<<n相当于2^n，i表示区间中的某一个整数
    let str = "";
    for (let j = 0; j < n; j++) {
      //用j遍历区间中每一个整数的每一位
      if ((i >> j) & (0x01 == 0x01))
        //该为为1,对应元素a[j]存在
        str += a[j];
    }
    console.log(str);
  }
}
```

## 二进制判断 1 的个数

```js
functon NumberOf1(n){
let cnt = 0;
 while(n)
 {
    ++count;
    n=(n-1)&n;
 }
 return cnt;
}

```

## 提升程序效率的

```js
// 计算n+1
-~n
// 计算n-1
~-n
// 取相反数
~n + 1;
// 取相反数
(n ^ -1) + 1;
// 参数为n，当n>0时候返回1，n<0时返回-1，n=0时返回0
!!n - (((unsigned)n >> 31) << 1);
```
