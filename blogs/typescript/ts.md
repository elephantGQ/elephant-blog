---
title: 接近天花板的TS类型体操，看懂你就能玩转TS了
date: 2022-04-18 17:25
author: 夜尽灬天明丶
tags:
  - 类型体操
categories:
  - Typescript
sidebar: "auto"
---
文章来自[https://juejin.cn/post/7061556434692997156](https://juejin.cn/post/7061556434692997156)

## TS 类型体操基本原理

### if 和 else

条件类型，条件类型冒号左边为 `if` 右边为 `else`

```ts
type A = 1
type B = 2
type Example = A extends B ? true : false // false
复制代码
```

`type Example = A extends B ? true : false` 中的 `true` 和 `false` 即可以理解成它们分别为 `if` 分支和 `else` 分支中要写的代码

而 `if` 中的条件即为 `A extends B`，`A` 是否可以分配给 `B`

要实现 `else if` 则需要多个这样的条件类型进行组合

### 模式匹配

```ts
type A = [1, 2, 3]
type ExampleA = A extends [infer First, ...infer Rest] ? First : never // 1
type B = "123"
type ExampleB = B extends `${infer FirstChar}${infer Rest}` ? FirstChar : never // '1'
复制代码
```

模式匹配是我们要利用的最有用的 `ts` 特性之一，之后我们要实现的字符串的增删改查和元组的增删改查都要基于它

如果你想知道更多，可以参考这篇文章：[模式匹配-让你 ts 类型体操水平暴增的套路](https://juejin.cn/post/7045536402112512007 "https://juejin.cn/post/7045536402112512007")

关于条件类型中 `infer` 的官方文档：[Inferring Within Conditional Types](https://link.juejin.cn?target=https%3A%2F%2Fwww.typescriptlang.org%2Fdocs%2Fhandbook%2F2%2Fconditional-types.html%23inferring-within-conditional-types "https://www.typescriptlang.org/docs/handbook/2/conditional-types.html#inferring-within-conditional-types")

### 与或非

基于条件类型可以轻松实现与或非

```ts
// C 意为 Condition，条件
// common
// 与，即 C1，C2 同为真
type And<C1 extends boolean, C2 extends boolean> = C1 extends true
  ? C2 extends true
    ? true
    : false
  : false

// common
// 与，即 C1，C2 有一个为真
type Or<C1 extends boolean, C2 extends boolean> = C1 extends true
  ? true
  : C2 extends true
  ? true
  : false

// common
// 非，即反转 C 的真假状态
type Not<C extends boolean> = C extends true ? false : true
复制代码
```

`ts` 目前不支持动态个数的泛型参数，因此如果有多个条件，我们需要定义多个不同的，比如

```ts
// common
// 有三个条件的情况
type And3<C1 extends boolean, C2 extends boolean, C3 extends boolean> = And<
  And<C1, C2>,
  C3
>

// common
// 有四个条件的情况
type And4<
  C1 extends boolean,
  C2 extends boolean,
  C3 extends boolean,
  C4 extends boolean
> = And<And3<C1, C2, C3>, C4>
复制代码
```

现在，我们已经封装了若干个类型工具 `And Or Not`，要达成基于 `ts` 的类型系统实现加法器的目标

我们需要很多个这样的类型工具

为了方便管理，我们需要给它分模块，比如上面的与或非，我们划分在 `common` 里

我们还需要 `function、array、number、object、string` 这另外的五个，用于处理函数类型、元组类型、数字类型、对象类型、字符类型

### 判断相等

在 js 的运算操作符中，有 `==` 和 `===`

在 ts 类型系统中，也可以实现类似的判断

```ts
// common
// 判断左侧类型是否可以分配给右侧类型
type CheckLeftIsExtendsRight<T extends any, R extends any> = T extends R
  ? true
  : false

// common
// 判断左侧类型是否和右侧类型一致
type IsEqual<A, B> = (<T>() => T extends A ? 1 : 2) extends <
  T1
>() => T1 extends B ? 1 : 2
  ? true
  : false
复制代码
```

`CheckLeftIsExtendsRight` 即校验左侧类型是否可分配给右侧类型，和 `==` 不同的是，`==` 会进行类型转换后的比较，而条件类型 `Left extends Right ? xxx : xxx` 只会进行结构性兼容的检查

如

```ts
type Example1 = { a: 1; b: 2 } extends { a: 1 } ? true : false // true
type Example2 = 1 | 2 extends 1 ? true : false // true
复制代码
```

虽然两个类型长的不一样，但是可以通过约束校验

`IsEqual` 参考 [github - typescript issue：\[Feature request\]type level equal operator](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fmicrosoft%2FTypeScript%2Fissues%2F27024%23issuecomment-510924206 "https://github.com/microsoft/TypeScript/issues/27024#issuecomment-510924206")

### toString

要实现 ts 的数学运算过于麻烦，因为数字是无法进行 infer 的，如何判断它（一个数字类型）为整型，浮点型？还是正数，或者负数？是不是仅仅有一个数字类型没有任何办法？

这都需要基于字符类型（或元组类型）的模式匹配

```ts
// string
// 将类型转为字符串有一定的限制，仅支持下面的类型
type CanStringified = string | number | bigint | boolean | null | undefined

// string
// 将支持的类型转化为字符串
type Stringify<T extends CanStringified> = `${T}`
复制代码
```

效果

```ts
type Example1 = Stringify<0> // "0"

type Example2 = Stringify<-1> // "-1"

type Example3 = Stringify<0.1> // "0.1"

type Example4 = Stringify<"0.2"> // "0.2"
复制代码
```

### 循环

在 js 中，我们可以通过 `for、while、do...while` 等循环进行可迭代对象的遍历，这些都离不开一个东西，那就是循环条件

比如在 for 循环中 `for (初始化; 条件; 循环后逻辑)` 我们一般用一个变量 `i` ，每一次循环后进行自增，循环条件一般是将 `i` 与另一个数比较大小

那么我们还需要实现一个数字类型大小比较，数字类型累加的工具类型

`ts` 中的循环可以通过递归来实现，`ts` 的类型系统中不存在类型赋值的概念

```ts
type Example = 1
Example = 2 // 没有这种写法
复制代码
```

只有通过每次递归时，把当前泛型参数处理后，当做下一次递归的泛型参数，终止递归时，返回当前某一个泛型参数的类型

通过一个最简单的递归类型例子来看一下这个过程

```ts
type Example<
  C extends boolean = true,
  Tuple extends unknown[] = [1]
> = C extends true ? Example<false, [...Tuple, 1]> : Tuple

type Result = Example // [1, 1]

// Example 的两个泛型参数
复制代码
```

如上示例，`Result` 得到的类型是 `[1, 1]`

第一次：C 是默认类型 true， 则会走到 `Example<false, [...Tuple, 1]>`，其中 `[...Tuple, 1]` 的结果为 `[...[1], 1]`，即 `[1, 1]`

第二次：C 传入了 false，会走到 `Tuple`，Tuple 的值为上次传入的值 `[1, 1]`，最后的返回类型为 `[1, 1]`

除了递归，还有两种方式可以循环，一种是分布式条件类型，还有一种是映射类型，但是它们都很难传递类型

```ts
// 分布式条件类型，当泛型参数 T 为联合类型时，条件类型即为分布式条件类型，会将 T 中的每一项分别分发给 extends 进行比对
type Example1<T> = T extends number ? T : never

type Result1 = Example1<"1" | "2" | 3 | 4> // 3 | 4

// 映射类型，固定写法，in 操作符会分发 T 成为新对象类型的键
type Example2<T> = {
  [Key in T]: Key
}
type Result2 = Example2<"1" | "2" | 3 | 4> // { 1: "1"; 2: "2"; 3: 3; 4: 4; }
复制代码
```

### 基本的数学运算

#### 判断正负

在部分场景下，我们可以兼容 number 类型的数字，也可以兼容 string 类型的数字，定义其为 `NumberLike`

```ts
type NumberLike = number | `${number}`
// 可分配给 NumberLike 的类型示例：number、`${number}`、1、-1、0.1、-0.1、"1"、"-1" 等
复制代码
```

判断为 0

```ts
// N 意为 Number 数字
// number
// number类型是否为0，判断 N 是否可分配给 0 | "0"
type IsZero<N extends NumberLike> = common.CheckLeftIsExtendsRight<N, 0 | "0">

// number
// number类型是否大于0，泛型类型有限制 NumberLike，所以它一定是个数或者由数字构成的字符串，将其转为字符串后，判断最前面是不是 -，如果不是，就是大于零
type IsOverZero<N extends NumberLike> = IsZero<N> extends true
  ? false
  : common.CheckLeftIsExtendsRight<
      string.Stringify<N> extends `${"-"}${infer Rest}` ? Rest : never,
      never
    >

// number
// number类型是否小于0，对上面 IsOverZero 的结果取反
type IsLessZero<N extends NumberLike> = common.Not<IsOverZero<N>>
复制代码
```

#### 两数相加

在上面 `循环` 章节，我们讲到了，可以通过递归传递修改后的泛型参数，来创建复杂的工具类型

此场景下，我们可以生成动态的类型，最常见的有这几种，元组类型，模板字符串类型，联合类型

而元组类型的长度是可以访问的 如 `[0, 1, 2]['length']` 结果为 `3`，且元组类型是可以拼接的，如 `[...[0, 1, 2], ...[0]]['length']` 的长度为 `4`

那么我们可以动态生成两个指定长度的元组类型，然后拼接到一起，获取拼接后的元组长度，就可以得到正整数（和 0）的加法了

参考：[juejin.cn/post/705089…](https://juejin.cn/post/7050893279818317854#heading-8 "https://juejin.cn/post/7050893279818317854#heading-8")

```ts
// array
// 构造长度一定（Length）的元组
type GetTuple<Length extends number = 0> = GetTupleHelper<Length>

type GetTupleHelper<
  Length extends number = 0,
  R extends unknown[] = []
> = R["length"] extends Length ? R : GetTupleHelper<Length, [...R, unknown]>
复制代码
```

```ts
type IntAddSingleHepler<N1 extends number, N2 extends number> = [
  ...array.GetTuple<N1>,
  ...array.GetTuple<N2>
]["length"]

// number
// 正整数（和0）加法，T1，T2最大999
type IntAddSingle<N1 extends number, N2 extends number> = IntAddSingleHepler<
  N1,
  N2
> extends number
  ? IntAddSingleHepler<N1, N2>
  : number
复制代码
```

#### 比较大小

如果想要实现元组类型的排序，那就必须要能够比较数字大小

如何实现数字类型大小的比较呢？

还是得基于元组

基于两个数 `N1`、 `N2`，创建不同的元组 `T1`、`T2`，依次减少两个元组的长度（删除第一位或最后一位），当有一个元组长度为 0 时，就是这个元组对应的数字类型，比另一个数字类型小（或相等，所以也要先判断是否不相等才进行比较）

去掉数组最后一位的实现：[juejin.cn/post/704553…](https://juejin.cn/post/7045536402112512007#heading-2 "https://juejin.cn/post/7045536402112512007#heading-2")

基于模式匹配，匹配出最后一项，和剩余项，并返回剩余项

类型系统中没有改变原类型的概念，因此元组类型的增删改查都应该直接返回修改后的类型，而不是修改后的变化值

如在 js 中，`[1, 2, 3].shift()` 会返回 `1`，`[1, 2, 3].pop()` 会返回 `3`，但是 ts 类型系统中，这样返回是没有意义的，`Pop<[1, 2, 3]>` 应该得到类型 `[1, 2]`

```ts
// array
// 去掉数组的最后一位
type Pop<T extends unknown[]> = T extends [...infer LeftRest, infer Last]
  ? LeftRest
  : never
复制代码
```

```ts
// T 意为 Tuple 元组
type CompareHelper<
  N1 extends number,
  N2 extends number,
  T1 extends unknown[] = array.GetTuple<N1>,
  T2 extends unknown[] = array.GetTuple<N2>
> = IsNotEqual<N1, N2, true> extends true
  ? common.Or<IsZero<T1["length"]>, IsZero<T2["length"]>> extends true
    ? IsZero<T1["length"]> extends true
      ? false
      : true
    : CompareHelper<array.Pop<T1>["length"], array.Pop<T2>["length"]>
  : false

// number
// 比较两个数字类型大小
type Compare<N1 extends number, N2 extends number> = CompareHelper<N1, N2>
复制代码
```

#### 两数相减

两个数字类型相减的逻辑与两个数字类型比较大小的逻辑类似，但是返回类型时，会返回剩余长度多的元组的长度

这个实现受到元组类型长度的限制，只能得到正数（或 0），即结果的绝对值

且用在其他工具类型中时，会出现 `类型实例化过深，并可能无限（Type instantiation is excessively deep and possibly infinite）` 的报错，参考 [github issue](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fmicrosoft%2FTypeScript%2Fissues%2F37613 "https://github.com/microsoft/TypeScript/issues/37613")

即：目前有 50 个嵌套实例的限制，可以通过批处理规避限制 （20210714）

```ts
// 批处理示例
type GetLetters<Text> =
  Text extends `${infer C0}${infer C1}${infer C2}${infer C3}${infer C4}${infer C5}${infer C6}${infer C7}${infer C8}${infer C9}${infer Rest}`
    ? C0 | C1 | C2 | C3 | C4 | C5 | C6 | C7 | C8 | C9 | GetLetters<Rest>
    : Text extends `${infer C}${infer Rest}`
    ? C | GetLetters<Rest>
    : never
复制代码
```

减法实现

```ts
type IntMinusSingleAbsHelper<
  N1 extends number,
  N2 extends number,
  T1 extends unknown[] = array.GetTuple<N1>,
  T2 extends unknown[] = array.GetTuple<N2>
> = IsNotEqual<N1, N2, true> extends true
  ? common.Or<IsZero<T1["length"]>, IsZero<T2["length"]>> extends true
    ? IsZero<T1["length"]> extends true
      ? T2["length"]
      : T1["length"]
    : IntMinusSingleAbsHelper<array.Pop<T1>["length"], array.Pop<T2>["length"]>
  : 0

// number
// 两个数字类型相减，得到绝对值
type IntMinusSingleAbs<
  N1 extends number,
  N2 extends number
> = IntMinusSingleAbsHelper<N1, N2>
复制代码
```

虽然有嵌套深度的限制，写好的减法不能用，但是加法是很好用的，有加法我们一样可以写出很多逻辑

## 参考 js 封装工具类型

工具类型可能相互依赖，如果遇到没见过的，请跳转到对应章节查看

### 封装 string 工具类型

#### Stringify - 将类型字符串化

```ts
/**
 * 将支持的类型转化为字符串
 * @example
 * type Result = Stringify<0> // "0"
 */
type Stringify<T extends CanStringified> = `${T}`
复制代码
```

原理：TS 内置的模板字符串类型

#### GetChars - 获取字符

```ts
/**
 * @exports
 * 获取模板字符串类型中的字符
 * @see https://www.typescriptlang.org/docs/handbook/release-notes/typescript-4-5.html
 * @example
 * type Result = GetChars<'abc'> // 'a' | 'b' | 'c'
 */
type GetChars<S> = GetCharsHelper<S, never>

/**
 * 以 尾递归 tail-recursive 的方式优化 GetChars，不导出为工具类型
 */
type GetCharsHelper<S, Acc> = S extends `${infer Char}${infer Rest}`
  ? GetCharsHelper<Rest, Char | Acc>
  : Acc
复制代码
```

原理：通过模板字符串类型的模式匹配，使用 `GetCharsHelper` 匹配出字符串类型的第一个字符和剩余字符，然后将剩余字符继续放入 `GetCharsHelper` 中进行处理

每次匹配的结果通过 `Acc` 参数传递，当 `S` 为空字符串时，`S` 不能分配给 `${infer Char}${infer Rest}`，走到 `false` 分支中，结束递归，即返回 `Acc` 类型

#### Split - 分割字符串

```ts
type SplitHelper<
  S extends string,
  SplitStr extends string = "",
  T extends string[] = []
> = S extends `${infer Char}${SplitStr}${infer Rest}`
  ? SplitHelper<Rest, SplitStr, array.Push<T, Char>>
  : S extends string
  ? S extends ""
    ? T
    : array.Push<T, S>
  : never

/**
 * 拆分字符串变为一个元组
 * @example
 * type Result = Split<'1,2,3', ','> // [1, 2, 3]
 */
type Split<S extends string, SplitStr extends string = ""> = SplitHelper<
  S,
  SplitStr
>
复制代码
```

原理：分割字符串类型，是把字符串类型转为元组类型，参数中需要设置一个元组类型用作返回结果

模板字符串类型的模式匹配是从左往右的，如果字符类型 `S` 为 `'1,2,3'`，`${infer Char}${','}${infer Rest}` 中 `Char` 即为 `'1'`，`Rest` 即为 `'2,3'`，同理，如果 `S` 为 `'2,3'`，`${infer Char}${','}${infer Rest}` 中 `Char` 即为 `'2'`，`Rest` 即为 `'3'`

这样的话，我们只需要把每次匹配出的 `Char` 放到元组类型参数 `T` 中的最后一项，在匹配结束后，返回 `T` 的类型即可

注：`array.Push` 见下文

#### GetStringLength - 获取字符串长度

```ts
/**
 * 获取字符串的长度
 * @example
 * type Result = GetStringLength<"123"> // 3
 */
type GetStringLength<S extends string> = Split<S>["length"]
复制代码
```

原理：元组的长度是可以获取的，通过上文的 `Split` 可以将字符串类型按照 `''` 分割成元组类型，再取元组的 `length` 即为字符串类型的长度

#### CharAt - 获取字符串在索引位 I 下的 字符

```ts
/**
 * 获取字符串在索引位 I 下的 字符
 * @example
 * type Result = CharAt<"123", 1> // "2"
 */
type CharAt<S extends string, I extends number> = Split<S>[I]
复制代码
```

原理：元组类型可以进行索引访问，可以将字符串类型按照 `''` 分割成元组类型，然后通过 `索引访问`，得到索引位 `I` 处的字符

#### Concat - 拼接两个字符串

```ts
/**
 * 拼接两个字符串
 * @example
 * type Result = Concat<"123", "456"> // "123456"
 */
type Concat<S1 extends string, S2 extends string> = `${S1}${S2}`
复制代码
```

原理：TS 模板字符串类型用法

#### Includes - 判断字符串是否包含子串

```ts
/**
 * 判断字符串是否包含子串
 * @example
 * type Result = Includes<"123", "12"> // true
 */
type Includes<
  S1 extends string,
  S2 extends string
> = S1 extends `${infer Left}${S2}${infer Right}` ? true : false
复制代码
```

原理：模式匹配可判断字符串类型中是否含有子串

#### StartsWith - 判断字符串是否以子串为起始

```ts
/**
 * 判断字符串是否以子串为起始
 * @example
 * type Result = StartsWith<"123", "12"> // true
 */
type StartsWith<
  S1 extends string,
  S2 extends string
> = S1 extends `${S2}${infer Right}` ? true : false
复制代码
```

原理：模式匹配时，左侧不写 `infer Left`，代表左侧只包含空字符串，不存在任何有长度的子串，即 `StartsWith`

#### EndsWith - 判断字符串是否以子串为结束

```ts
/**
 * 判断字符串是否以子串为结束
 * @example
 * type Result = EndsWith<"123", "23"> // true
 */
type EndsWith<
  S1 extends string,
  S2 extends string
> = S1 extends `${infer Left}${S2}` ? true : false
复制代码
```

原理：模式匹配时，右侧不写 `infer Right`，代表右侧只包含空字符串，不存在任何有长度的子串，即 `EndsWith`

#### IndexOf - 从左往右查找子串的位置

```ts
type IndexOfHelper<
  S1 extends string,
  S2 extends string,
  Len1 extends number = GetStringLength<S1>,
  Len2 extends number = GetStringLength<S2>
> = common.Or<
  number.Compare<Len1, Len2>,
  number.IsEqual<Len1, Len2>
> extends true
  ? S1 extends `${infer Left}${S2}${infer Right}`
    ? GetStringLength<Left>
    : -1
  : -1

/**
 * 从左往右查找子串的位置
 * @example
 * type Result = IndexOf<"123", "23"> // 1
 */
type IndexOf<S1 extends string, S2 extends string> = IndexOfHelper<S1, S2>
复制代码
```

原理：匹配出 `${infer Left}${S2}${infer Right}` 中 `Left`，求其长度，则索引位即为 `Left` 的长度，如果匹配不到，返回 -1

可以先比较父串和子串的长度，如果子串比父串还长，那就不需要匹配了，直接返回 -1

#### LastIndexOf - 从右往左查找子串的位置

```ts
type LastIndexOfHelper<
  S1 extends string,
  S2 extends string,
  Index extends number = -1 /** 当前从左往右匹配最大的值，匹配不到以后，上一次匹配的索引就是从右往左第一个的索引 */,
  AddOffset extends number = 0 /** 每次从左往右匹配并替换成空串后，下次循序需要累加的值 */
> = S1 extends `${infer Left}${S2}${infer Right}`
  ? LastIndexOfHelper<
      Replace<S1, S2, "">,
      S2,
      number.IntAddSingle<GetStringLength<Left>, AddOffset>,
      number.IntAddSingle<AddOffset, GetStringLength<S2>>
    >
  : Index

/**
 * 从右往左查找子串的位置
 * @example
 * type Result = LastIndexOf<"23123", "23"> // 3
 */
type LastIndexOf<S1 extends string, S2 extends string> = LastIndexOfHelper<
  S1,
  S2
>
复制代码
```

原理：模板字符串类型的模式匹配是从左往右的，而 `LastIndexOf` 是从右往左的，所以在匹配时，仍然基于从左往右匹配，但是每次匹配后，替换掉匹配过的子串为空串

然后把删掉的部分的长度累计起来，结果就是模拟从右往左匹配到的索引值

注：`Replace` 见下文

#### Replace - 在字符串中查找并替换一处子串

```ts
/**
 * 在字符串中查找并替换一处子串
 * @example
 * type Result = Replace<"23123", "23", "xx"> // "xx123"
 */
type Replace<
  S extends string,
  MatchStr extends string,
  ReplaceStr extends string
> = S extends `${infer Left}${MatchStr}${infer Right}`
  ? `${Left}${ReplaceStr}${Right}`
  : S
复制代码
```

原理：基于模板字符串的模式匹配，匹配到了就用 `ReplaceStr` 换掉 `MatchStr`

#### ReplaceAll - 在字符串中查找并替换所有子串

```ts
/**
 * 在字符串中查找并替换所有子串
 * @example
 * type Result = Replace<"23123", "23", "xx"> // "xx1xx"
 */
type ReplaceAll<
  S extends string,
  MatchStr extends string,
  ReplaceStr extends string
> = Includes<S, MatchStr> extends true
  ? ReplaceAll<Replace<S, MatchStr, ReplaceStr>, MatchStr, ReplaceStr>
  : S
复制代码
```

原理：基于 `Replace`，递归进行替换，替换掉所有 `MatchStr`，终止条件是 `S` 是否包含 `MatchStr`

#### Repeat - 重复 Times 次数的字符串

```ts
type RepeatHelper<
  S extends string,
  Times extends number,
  OriginStr extends string = S,
  Offset extends number = 1
> = Times extends 0
  ? ""
  : number.IsEqual<Times, Offset> extends true
  ? S
  : `${OriginStr}${RepeatHelper<
      S,
      Times,
      OriginStr,
      number.IntAddSingle<Offset, 1>
    >}`

/**
 * 重复 Times 次数的字符串
 * @example
 * type Result = Repeat<"1", 5> // "11111"
 */
type Repeat<S extends string, Times extends number = 1> = RepeatHelper<S, Times>
复制代码
```

原理：当重复次数 `Times` 为 `0` 时，直接返回空字符串

在参数中传递循环条件 `Offset` （每次传递时加 1，即 `number.IntAddSingle<Offset, 1>`），当循环条件 `Offset` 和循环次数 `Times` 相等时，结束递归

每次递归中，都在字符串的起始位置插入一个字符串 `S`，即

```txt
`${第一次的S}${`${第二次的S}${`${第三次的S}${剩下的...}`}`}`
复制代码
```

注：`number.IntAddSingle、number.IsEqual` 见下文

#### PadStart - 在字符串前面填充

```ts
type PadHelper<
  S extends string,
  N extends number = 0,
  FillS extends string = " ",
  IsStart extends boolean = true,
  Len extends number = GetStringLength<S>,
  Offset extends number = Len
> = number.Compare<N, Len> extends true
  ? number.IsEqual<N, Offset> extends true
    ? S
    : PadHelper<
        `${IsStart extends true ? FillS : ""}${S}${IsStart extends false
          ? FillS
          : ""}`,
        N,
        FillS,
        IsStart,
        Len,
        number.IntAddSingle<Offset, 1>
      >
  : S

/**
 * 当字符串不满足给定的长度时，在字符串前面填充使其满足长度
 * @example
 * type Result = PadStart<'0123', 10> // '      0123'
 */
type PadStart<
  S extends string,
  N extends number = 0,
  FillS extends string = " "
> = PadHelper<S, N, FillS>
复制代码
```

原理：比较指定的长度和当前字符串类型的长度相等，如果满足长度，直接返回 `S`，每次递归时，给 `S` 左侧添加指定的字符，直到 `S` 的长度满足指定的长度时，终止递归

#### PadEnd - 在字符串后面填充

```ts
/**
 * 当字符串不满足给定的长度时，在字符串后面填充使其满足长度
 * @example
 * type Result = PadStart<'0123', 10> // '0123      '
 */
type PadEnd<
  S extends string,
  N extends number = 0,
  FillS extends string = " "
> = PadHelper<S, N, FillS, false>
复制代码
```

原理：比较给定的长度和当前字符串类型的长度相等，如果满足长度，直接返回 `S`，每次递归时，给 `S` 右侧添加指定的字符，直到 `S` 的长度满足给定的长度时，终止递归

#### TrimLeft - 去掉字符串前面的空格

```ts
/**
 * 去掉字符串类型左侧的空格
 * @see https://juejin.cn/post/7045536402112512007#heading-5
 * @example
 * type Result = PadStart<'   0123'> // '0123'
 */
type TrimLeft<S extends string> = S extends `${
  | " "
  | "\t"
  | "\n"}${infer RightRest}`
  ? TrimLeft<RightRest>
  : S
复制代码
```

原理：每次匹配 `${一个空格}${剩余字符}` 然后让 `剩余字符` 继续匹配，直到不符合 `${一个空格}${剩余字符}` 的规则时，终止递归，返回 `S`

#### TrimRight - 去掉字符串后面的空格

```ts
/**
 * 去掉字符串类型右侧的空格
 * @example
 * type Result = PadStart<'0123   '> // '0123'
 */
type TrimRight<S extends string> = S extends `${infer LeftRest}${
  | " "
  | "\t"
  | "\n"}`
  ? TrimRight<LeftRest>
  : S
复制代码
```

原理：每次匹配 `${剩余字符}${一个空格}` 然后让 `剩余字符` 继续匹配，直到不符合 `${剩余字符}${一个空格}` 的规则时，终止递归，返回 `S`

#### Trim - 去掉字符串的空格

```ts
/**
 * 去掉字符串类型两侧的空格
 * @example
 * type Result = PadStart<'   0123   '> // '0123'
 */
type Trim<S extends string> = TrimLeft<TrimRight<S>>
复制代码
```

原理：先用 `TrimRight` 去掉右侧的空格，再把前者结果交给 `TrimLeft` 去掉左侧的空格

#### ToUpperCase - 字符串转大写

```ts
/**
 * 字符串转大写
 * @example
 * type Result = ToUpperCase<'abc'> // 'ABC'
 */
type ToUpperCase<S extends string> = Uppercase<S>
复制代码
```

原理：TS 内置

#### ToLowerCase - 字符串转小写

```ts
/**
 * 字符串转小写
 * @example
 * type Result = ToUpperCase<'ABC'> // 'abc'
 */
type ToLowerCase<S extends string> = Lowercase<S>
复制代码
```

原理：TS 内置

#### SubString - 截取 start（包括）到 end（不包括）之间的字符串

```ts
type SubStringHelper<
  S extends string,
  Start extends number,
  End extends number,
  Offset extends number = 0,
  Cache extends string[] = []
> = number.IsEqual<Offset, End> extends true
  ? array.Join<Cache, "">
  : SubStringHelper<
      S,
      Start,
      End,
      number.IntAddSingle<Offset, 1>,
      common.And3<
        common.Or<number.Compare<Offset, Start>, number.IsEqual<Offset, Start>>,
        common.Or<number.Compare<End, Offset>, number.IsEqual<Offset, End>>,
        CharAt<S, Offset> extends string ? true : false
      > extends true
        ? array.Push<Cache, CharAt<S, Offset>>
        : Cache
    >
/**
 * 截取start（包括）到end（不包括）之间的字符串
 * @example
 * type Result = SubString<'123', 0, 1> // '1'
 */
type SubString<
  S extends string,
  Start extends number,
  End extends number
> = SubStringHelper<S, Start, End>
复制代码
```

原理：遍历字符串类型的每一个字符，如果当前索引大于等于 `Start`，并且小于等于 `End`，就把当前字符 push 到元组中，最后用 `array.Join`，将元组转为字符串类型

注：`array.Join` 见下文

#### SubStr - 在字符串中抽取从开始下标到结束下标的字符

```ts
/**
 * 在字符串中抽取从 开始 下标开始的指定数目的字符
 * @example
 * type Result = SubStr<'123', 1, 2> // '23'
 */
type SubStr<
  S extends string,
  Start extends number,
  Len extends number
> = SubStringHelper<S, Start, number.IntAddSingle<Start, Len>>
复制代码
```

原理：`SubString` 需要起始和结束，有 `Start` 和 `Len` 就可以先算出 `End`，就可以使用 `SubString` 了

### 封装 array 工具类型

#### GetTuple - 构造指定长度的元组

```ts
/**
 * 构造长度一定（Length）的元组
 * @example
 * type Result = GetTuple<3> // [unknown, unknown, unknown]
 */
type GetTuple<Length extends number = 0> = GetTupleHelper<Length>

type GetTupleHelper<
  Length extends number = 0,
  R extends unknown[] = []
> = R["length"] extends Length ? R : GetTupleHelper<Length, [...R, unknown]>
复制代码
```

#### ArraySet - 更改元组中指定索引位的类型

```ts
type SetHelper<
  T extends unknown[],
  Index extends number,
  Value,
  Offset extends number = 0,
  Cache extends unknown[] = []
> = Offset extends T["length"]
  ? Cache
  : SetHelper<
      T,
      Index,
      Value,
      number.IntAddSingle<Offset, 1>,
      Push<Cache, Offset extends Index ? Value : T[Offset]>
    >

/**
 * 更改元组中指定索引位的类型
 * @example
 * type Result = ArraySet<[1, 2, 3], 2, 4> // [1, 2, 4]
 */
type ArraySet<T extends unknown[], Index extends number, Value> = SetHelper<
  T,
  Index,
  Value
>
复制代码
```

原理：遍历元组类型，如果 `Offset` 等于给定的索引，则该索引对应的类型替换为给定的类型，否则用原类型

#### TupleToUnion - 从元（数）组类型构造联合类型

```ts
/**
 * 从元（数）组类型构造联合类型
 * @example
 * type Result = TupleToUnion<[1, 2, 3]> // 1 | 2 | 3
 */
type TupleToUnion<T extends unknown[]> = T[number]
复制代码
```

原理：元组（数组）类型的索引访问会得到联合类型

#### Pop - 去除元组类型的最后一位

```ts
/**
 * 去掉元组的最后一位
 * @see https://juejin.cn/post/7045536402112512007#heading-2
 * @example
 * type Result = Pop<[1, 2, 3]> // [1, 2]
 */
type Pop<T extends unknown[]> = T extends [...infer LeftRest, infer Last]
  ? LeftRest
  : never
复制代码
```

原理：基于元组的模式匹配，提取最后一项，返回剩余项

#### Shift - 去除元组类型的第一位

```ts
/**
 * 去掉数组的第一位
 * @example
 * type Result = Shift<[1, 2, 3]> // [2, 3]
 */
type Shift<T extends unknown[]> = T extends [infer First, ...infer RightRest]
  ? RightRest
  : never
复制代码
```

原理：与 `Pop` 同理

#### UnShift - 在元组前面插入一位

```ts
/**
 * 在元组前面插入一位
 * @example
 * type Result = UnShift<[1, 2, 3], 0> // [0, 1, 2, 3]
 */
type UnShift<T extends unknown[], Item> = [Item, ...T]
复制代码
```

原理：`[]` 中直接写类型可以构建新元组类型，其中写 `...Tuple`，与 js 中的扩展运算符效果一致

#### Push - 在元组后面插入一位

```ts
/**
 * 在元组最后插入一位
 * @example
 * type Result = Push<[1, 2, 3], 4> // [1, 2, 3， 4]
 */
type Push<T extends unknown[], Item> = [...T, Item]
复制代码
```

原理：同 `UnShift`

#### Concat - 合并两个元组类型

```ts
/**
 * 合并两个元组类型
 * @example
 * type Result = Concat<[1, 2, 3], [4]> // [1, 2, 3, 4]
 */
type Concat<T extends unknown[], R extends unknown[]> = [...T, ...R]
复制代码
```

原理：见 `UnShift`

#### Join - 将元组类型拼接成字符串类型

```ts
/**
 * 将元组类型拼接成字符串类型
 * @example
 * type Result = Join<[1, 2, 3]> // "1,2,3"
 */
type Join<
  T extends string.CanStringified[],
  SplitStr extends string.CanStringified = ""
> = T["length"] extends 0
  ? ""
  : T extends [infer Left, ...infer RightRest]
  ? Left extends string.CanStringified
    ? RightRest extends string.CanStringified[]
      ? `${Left}${T["length"] extends 1 ? "" : SplitStr}${Join<
          RightRest,
          SplitStr
        >}`
      : never
    : never
  : never
复制代码
```

原理：每次递归时提取元组第一个类型，然后将此类型放到模板字符串类型的第一个位置 `${第一个位置}${第二个位置}${第三个位置}`

第二个位置即转为字符串用来分隔的子串，如果元组的长度为 0，则为空串

第三个位置则是剩下部分的逻辑，即重复最开始的逻辑

#### Every - 校验元组中每个类型是否都符合条件

```ts
type EveryHelper<
  T extends unknown[],
  Check,
  Offset extends number = 0,
  CacheBool extends boolean = true
> = T["length"] extends Offset
  ? CacheBool
  : EveryHelper<
      T,
      Check,
      number.IntAddSingle<Offset, 1>,
      common.And<common.CheckLeftIsExtendsRight<T[Offset], Check>, CacheBool>
    >

/**
 * 校验元组中每个类型是否都符合条件
 * @example
 * type Result = Every<[1, 2, 3], number> // true
 */
type Every<T extends unknown[], Check> = T["length"] extends 0
  ? false
  : EveryHelper<T, Check>
复制代码
```

原理：初始类型 `CacheBool` 为 true，依次将元组中每个类型与初始类型进行 `与` 操作，如果元组长度为 0，则返回 `false`

注：`common.And、common.CheckLeftIsExtendsRight` 见下文

#### Some - 校验元组中是否有类型符合条件

```ts
type SomeHelper<
  T extends unknown[],
  Check,
  Offset extends number = 0,
  CacheBool extends boolean = false
> = T["length"] extends Offset
  ? CacheBool
  : SomeHelper<
      T,
      Check,
      number.IntAddSingle<Offset, 1>,
      common.Or<common.CheckLeftIsExtendsRight<T[Offset], Check>, CacheBool>
    >

/**
 * 校验元组中是否有类型符合条件
 * @example
 * type Result = Every<['1', '2', 3], number> // true
 */
type Some<T extends unknown[], Check> = SomeHelper<T, Check>
复制代码
```

原理：初始类型 `CacheBool` 为 false，依次将元组中每个类型与初始类型进行 `或` 操作，如果元组长度为 0，则返回 `false`

注：`common.Or、common.CheckLeftIsExtendsRight` 见下文

#### Fill - 以指定类型填充元组类型

```ts
type FillHelper<
  T extends unknown[],
  F,
  Offset extends number = 0
> = T["length"] extends 0
  ? F[]
  : Offset extends T["length"]
  ? common.IsEqual<T, F[]> extends true /** any[] -> T[] */
    ? T
    : F[]
  : FillHelper<array.Push<array.Shift<T>, F>, F, number.IntAddSingle<Offset, 1>>


/**
 * 以指定类型填充元组类型
 * @example
 * type Result = Fill<['1', '2', 3, any], 1> // [1, 1, 1, 1]
 */
type Fill<T extends unknown[], F = undefined> = FillHelper<T, F>
复制代码
```

原理：如果原元组长度为 0，则直接返回由新类型构成的元组 `F[]`

如果是数组类型如：`any[]`、`never[]`、`number[]`，也应该直接替换成 `T[]`

否则，每次在原元组中删除第一个，然后在最前面添加一个新类型，直到循环条件与 `T` 的长度一致时，终止递归

注：`commom.IsEqual` 见下文

#### Filter - 过滤出元组类型中符合条件的类型

```ts
type FilterHelper<
  T extends unknown[],
  C,
  Strict extends boolean,
  Offset extends number = 0,
  Cache extends unknown[] = []
> = Offset extends T["length"]
  ? Cache
  : FilterHelper<
      T,
      C,
      Strict,
      number.IntAddSingle<Offset, 1>,
      common.And<Strict, common.IsEqual<T[Offset], C>> extends true
        ? array.Push<Cache, T[Offset]>
        : common.And<
            common.Not<Strict>,
            common.CheckLeftIsExtendsRight<T[Offset], C>
          > extends true
        ? array.Push<Cache, T[Offset]>
        : Cache
    >

/**
 * 过滤出元组类型中符合条件的类型
 * @example
 * type Result = Filter<['1', '2', 3, any, 1], 1, true> // [1]
 */
type Filter<
  T extends unknown[],
  C,
  Strict extends boolean = false
> = FilterHelper<T, C, Strict>
复制代码
```

原理：严格模式，即 `any` 只能为 `any`，而不能为 `1`、`unknown` 这样的其他类型

如果是严格模式就用 `common.IsEqual` 进行约束校验，否则用 `common.CheckLeftIsExtendsRight` 进行约束校验

每次递归时，如果满足上述条件，则放入新的元组类型中

如果循环条件 `Offset` 等于 `T` 的长度是，终止循环，返回新的元组类型 `Cache`

注：`common.Not` 见下文

#### MapWidthIndex - 将元组类型映射为带索引的元组类型

```ts
interface IndexMappedItem<Item, Index extends number, Tuple extends unknown[]> {
  item: Item
  index: Index
  tuple: Tuple
}

type MapWidthIndexHelper<
  T extends unknown[],
  Offset extends number = 0,
  Cache extends unknown[] = []
> = T["length"] extends Offset
  ? Cache
  : MapWidthIndexHelper<
      T,
      number.IntAddSingle<Offset, 1>,
      Push<Cache, IndexMappedItem<T[Offset], Offset, T>>
    >

/**
 * 将元组类型映射为带索引的元组类型
 * @example
 * type Result = MapWidthIndex<[1, 2]> // [{ item: 1; index: 0;tuple: [1, 2]; }, { item: 2; index: 1;tuple: [1, 2]; }]
 */
type MapWidthIndex<T extends unknown[]> = MapWidthIndexHelper<T>
复制代码
```

原理：声明一个接口用于构造新的元组类型中的项，然后每次递归都向 `Cache` 中添加一个经过 `IndexMappedItem` 处理后的类型

注：由于 TS 中实现不了回调的效果，因为带泛型参数的工具类型不能直接当做类型传递，必须要先传了泛型参数才能用，所以暂时无法实现 `js` 中 `Array.prototype.map` 的效果

#### Find - 找到元组类型中第一个符合条件的类型

```ts
type FindHelper<
  T extends unknown[],
  C,
  Offset extends number = 0
> = Offset extends number.IntAddSingle<T["length"], 1>
  ? null
  : common.CheckLeftIsExtendsRight<T[Offset], C> extends true
  ? T[Offset]
  : FindHelper<T, C, number.IntAddSingle<Offset, 1>>
/** */
type Find<T extends unknown[], C> = FindHelper<T, C>
复制代码
```

原理：遍历在元组中找，如果找到了匹配的，则返回该类型，否则返回 `null` 类型

#### Reverse - 反转元组

```ts
type ReverseHelper<
  T extends unknown[],
  Offset extends number = 0,
  Cache extends unknown[] = []
> = Cache["length"] extends T["length"]
  ? Cache
  : ReverseHelper<T, number.IntAddSingle<Offset, 1>, UnShift<Cache, T[Offset]>>
/** */
type Reverse<T extends unknown[]> = ReverseHelper<T>
复制代码
```

原理：遍历老元组类型，每次在新元组类型 `Cache` 的前面插入当前类型

#### FindLast - 找到元组类型中最后一个符合条件的类型

```ts
/** */
type FindLast<T extends unknown[], C> = Find<Reverse<T>, C>
复制代码
```

原理：反转老元组类型，然后通过 `Find` 查找

#### FindIndex - 找到元组类型中第一个符合条件的类型的索引

```ts
type FindIndexHelper<
  T extends unknown[],
  C,
  Strict extends boolean = false,
  Offset extends number = 0
> = Offset extends number.IntAddSingle<T["length"], 1>
  ? -1
  : common.And<common.IsEqual<T[Offset], C>, Strict> extends true
  ? Offset
  : common.And<
      common.CheckLeftIsExtendsRight<T[Offset], C>,
      common.Not<Strict>
    > extends true
  ? Offset
  : FindIndexHelper<T, C, Strict, number.IntAddSingle<Offset, 1>>

/** */
type FindIndex<
  T extends unknown[],
  C,
  Strict extends boolean = false
> = FindIndexHelper<T, C, Strict>
复制代码
```

原理：严格模式，参考上文 `Filter`，遍历元组，符合约束校验时，返回当前 `Offset`，否则结束后返回 -1

#### FindLastIndex - 找到元组类型中最后一个符合条件的类型的索引

```ts
type FindLastIndexHelper<
  T extends unknown[],
  C,
  Item = Find<Reverse<MapWidthIndex<T>>, IndexMappedItem<C, number, T>>
> = Item extends IndexMappedItem<C, number, T> ? Item["index"] : -1

type FindLastIndex<T extends unknown[], C> = FindLastIndexHelper<T, C>
复制代码
```

原理：通过 `MapWidthIndex` 将索引记录到元组的每个类型中，使用 `Find` 匹配反转后的元组，匹配到时，返回该类型的 `Item['index']` 值即为结果

#### Flat - 扁平化元组

```ts
type FlatHelper<
  T extends unknown[],
  Offset extends number = 0,
  Cache extends unknown[] = []
> = Offset extends T["length"]
  ? Cache
  : FlatHelper<
      T,
      number.IntAddSingle<Offset, 1>,
      T[Offset] extends unknown[]
        ? Concat<Cache, T[Offset]>
        : Push<Cache, T[Offset]>
    >

type Flat<T extends unknown[]> = FlatHelper<T>
复制代码
```

原理：遍历元组类型，如果当前类型不满足 `unknown[]` 的约束，则将它 `Push` 进新元组中，否则将它 `Concat` 进去

#### Includes - 元组类型中是否存在一个符合条件的类型

```ts
type Includes<T extends unknown[], C> = common.CheckLeftIsExtendsRight<
  C,
  TupleToUnion<T>
>
复制代码
```

原理：将元组转为联合类型，如果约束条件 `C` 可以分配给该联合类型，那么就是 `true`

#### Slice - 提取元组类型中指定起始位置到指定结束位置的类型构造新元组类型

```ts
type SliceHelper<
  T extends unknown[],
  Start extends number,
  End extends number,
  Offset extends number = 0,
  Cache extends unknown[] = []
> = number.IsEqual<Offset, End> extends true
  ? Cache
  : SliceHelper<
      T,
      Start,
      End,
      number.IntAddSingle<Offset, 1>,
      common.And3<
        common.Or<number.Compare<Offset, Start>, number.IsEqual<Offset, Start>>,
        common.Or<number.Compare<End, Offset>, number.IsEqual<Offset, End>>,
        common.Or<
          number.Compare<T["length"], Offset>,
          number.IsEqual<T["length"], End>
        >
      > extends true
        ? array.Push<Cache, T[Offset]>
        : Cache
    >

type Slice<
  T extends unknown[],
  Start extends number,
  End extends number
> = SliceHelper<T, Start, End>
复制代码
```

原理：和字符串裁剪的类似，遍历老元组，当循环条件 `Offset` 大于等于 `Start` 或 小于等于 `End` 时，将这些类型 `Push` 到新元组中

#### Sort - 排序

```ts
type SortHepler2<
  T extends number[],
  Offset extends number = 0,
  Offset1 extends number = 0,
  Offset1Added extends number = number.IntAddSingle<Offset1, 1>,
  Seted1 extends unknown[] = ArraySet<T, Offset1Added, T[Offset1]>,
  Seted2 extends unknown[] = ArraySet<Seted1, Offset1, T[Offset1Added]>
> = number.IntAddSingle<
  number.IntAddSingle<Offset, Offset1>,
  1
> extends T["length"]
  ? SortHepler1<T, number.IntAddSingle<Offset, 1>>
  : SortHepler2<
      number.Compare<T[Offset1], T[Offset1Added]> extends true
        ? Seted2 extends number[]
          ? Seted2
          : never
        : T,
      number.IntAddSingle<Offset1, 1>
    >

type SortHepler1<
  T extends number[],
  Offset extends number = 0
> = Offset extends T["length"] ? T : SortHepler2<T, Offset>

type Sort<T extends number[]> = SortHepler1<T>
复制代码
```

原理：最简单的冒泡排序，每次排序时，将大的与小的置换

注：受到嵌套实例深度的限制，只能排两个类型的元组

### 封装 number 工具类型

#### IsZero - 判断类型为 0

```ts
/**
 * number类型是否为0
 * @example
 * type Result = IsZero<0> // true 
 */
type IsZero<N extends NumberLike> = common.CheckLeftIsExtendsRight<N, 0 | "0">
复制代码
```

注：原理见上文，`NumberLike` 见上文

#### IsOverZero - 是否大于 0

```ts
/**
 * number类型是否大于0
 * @example
 * type Result = IsOverZero<2> // true 
 */
type IsOverZero<N extends NumberLike> = IsZero<N> extends true
  ? false
  : common.CheckLeftIsExtendsRight<
      string.Stringify<N> extends `${"-"}${infer Rest}` ? Rest : false,
      false
    >
复制代码
```

注：原理见上文

#### IsLessZero - 是否小于 0

```ts
/**
 * number类型是否小于0
 * @example
 * type Result = IsLessZero<-2> // true 
 */
type IsLessZero<N extends NumberLike> = common.Not<IsOverZero<N>>
复制代码
```

#### IsFloat - 是否为浮点型

```ts
/**
 * number类型是否是小数
 * @example
 * type Result = IsFloat<1.2> // true 
 */
type IsFloat<
  N extends NumberLike,
  OnlyCheckPoint extends boolean = true
> = string.Stringify<N> extends `${infer Left}${"."}${infer Right}`
  ? OnlyCheckPoint extends true
    ? true
    : common.Not<array.Every<string.Split<Right>, "0">>
  : false
复制代码
```

原理：转为字符串类型后判断是否小数点

#### IsInt - 是否为整型

```ts
/**
 * number类型是否是整数
 * @example
 * type Result = IsInt<1> // true 
 */
type IsInt<
  N extends NumberLike,
  OnlyCheckPoint extends boolean = true
> = common.Not<IsFloat<N, OnlyCheckPoint>>
复制代码
```

原理：`IsFloat` 取反

#### IsEqual - 数字类型是否相等

```ts
/**
 * 两个number类型是否相等
 * @example
 * type Result = IsEqual<1, 1> // true 
 */
type IsEqual<
  L extends NumberLike,
  R extends NumberLike,
  Strict extends boolean = true
> = Strict extends true
  ? common.CheckLeftIsExtendsRight<L, R>
  : common.CheckLeftIsExtendsRight<string.Stringify<L>, string.Stringify<R>>
复制代码
```

原理：见上文

#### IsNotEqual - 数字类型是否不相等

```ts
/**
 * 两个number类型是否不相等
 * @example
 * type Result = IsNotEqual<1, 2> // true 
 */
type IsNotEqual<
  L extends NumberLike,
  R extends NumberLike,
  Strict extends boolean = true
> = common.Not<IsEqual<L, R, Strict>>
复制代码
```

原理：`IsEqual` 取反

#### IntAddSingle - 整数相加

```ts
type IntAddSingleHepler<N1 extends number, N2 extends number> = [
  ...array.GetTuple<N1>,
  ...array.GetTuple<N2>
]["length"]

/**
 * 正整数（和0）加法，A1，A2最大999
 * @see https://juejin.cn/post/7050893279818317854#heading-8
 * @example
 * type Result = IntAddSingle<1, 2> // 3 
 */
type IntAddSingle<N1 extends number, N2 extends number> = IntAddSingleHepler<
  N1,
  N2
> extends number
  ? IntAddSingleHepler<N1, N2>
  : number
复制代码
```

原理：见上文

#### Compare - 比较大小

```ts
type CompareHelper<
  N1 extends number,
  N2 extends number,
  A1 extends unknown[] = array.GetTuple<N1>,
  A2 extends unknown[] = array.GetTuple<N2>
> = IsNotEqual<N1, N2, true> extends true
  ? common.Or<IsZero<A1["length"]>, IsZero<A2["length"]>> extends true
    ? IsZero<A1["length"]> extends true
      ? false
      : true
    : CompareHelper<array.Pop<A1>["length"], array.Pop<A2>["length"]>
  : false

/**
 * 比较大小
 * @example
 * type Result = Compare<1, 2> // false 
 */
type Compare<N1 extends number, N2 extends number> = CompareHelper<N1, N2>
复制代码
```

原理：见上文

#### IntMinusSingleAbs - 两数相减

```ts
type IntMinusSingleAbsHelper<
  N1 extends number,
  N2 extends number,
  A1 extends unknown[] = array.GetTuple<N1>,
  A2 extends unknown[] = array.GetTuple<N2>
> = IsNotEqual<N1, N2, true> extends true
  ? common.Or<IsZero<A1["length"]>, IsZero<A2["length"]>> extends true
    ? IsZero<A1["length"]> extends true
      ? A2["length"]
      : A1["length"]
    : IntMinusSingleAbsHelper<array.Pop<A1>["length"], array.Pop<A2>["length"]>
  : 0

/**
 * 两数相减
 * @example
 * type Result = IntMinusSingleAbs<2, 1> // 1 
 */
type IntMinusSingleAbs<
  N1 extends number,
  N2 extends number
> = IntMinusSingleAbsHelper<N1, N2>
复制代码
```

原理：见上文

#### GetHalf - 获取当前数字类型的一半

```ts
type GetHalfHelper<N extends number, Offset extends number = 0> = IsEqual<
  IntAddSingle<Offset, Offset>,
  N
> extends true
  ? Offset
  : IsEqual<IntAddSingle<IntAddSingle<Offset, Offset>, 1>, N> extends true
  ? IntAddSingle<Offset, 1>
  : GetHalfHelper<N, IntAddSingle<Offset, 1>>

/**
 * 获取当前数字类型的一半
 * @example
 * type Result = GetHalf<4> // 2 
 */
type GetHalf<N extends number> = GetHalfHelper<N>
复制代码
```

原理：循环，当 `Offset` + `Offset` 等于 `N` 时，或 `Offset + 1` + `Offset` 等于 `N` 时，`Offset` 即为结果

#### ToNumber - 字符串类型转数字类型

```ts
/** @see https://juejin.cn/post/6999280101556748295#heading-68 */
type Map = {
  "0": []
  "1": [1]
  "2": [...Map["1"], 1]
  "3": [...Map["2"], 1]
  "4": [...Map["3"], 1]
  "5": [...Map["4"], 1]
  "6": [...Map["5"], 1]
  "7": [...Map["6"], 1]
  "8": [...Map["7"], 1]
  "9": [...Map["8"], 1]
}

type Make10Array<T extends any[]> = [
  ...T,
  ...T,
  ...T,
  ...T,
  ...T,
  ...T,
  ...T,
  ...T,
  ...T,
  ...T
]

type ToNumberHelper<
  S extends string,
  L extends any[] = []
> = S extends `${infer F}${infer R}`
  ? ToNumberHelper<
      R,
      [...Make10Array<L>, ...(F extends keyof Map ? Map[F] : never)]
    >
  : L["length"]

/**
 * 字符串类型转数字类型
 * @example
 * type Result = ToNumber<"100"> // 100
 */
type ToNumber<S extends string> = ToNumberHelper<S>
复制代码
```

原理：创建一个字符与元组的映射表，我们通过前文的探究已知数字类型可由元组的长度得到，那么就根据每个字符依次构建不同长度的元组即可得到结果

`Make10Array` 是将上一次的结果 \* 10

见 [juejin.cn/post/699928…](https://juejin.cn/post/6999280101556748295#heading-68 "https://juejin.cn/post/6999280101556748295#heading-68")

#### Add - 数字相加

见下文

### 封装 object 工具类型

#### KeysToUnion - 对象类型的所有键转联合类型

```ts
type KeysToUnion<T> = keyof T
复制代码
```

#### Values - 获取对象类型的值构成的联合类型

```ts
type Values<T> = T[KeysToUnion<T>]
复制代码
```

#### KeysToTuple - 获取对象类型键够成的元组类型

```ts
type KeysToTuple<T> = KeysToUnion<T>[]
复制代码
```

#### ExtractValues - 过滤出符合类型 V 的属性

```ts
type ExtractValues<T, V> = {
  [Key in keyof T as T[Key] extends V ? Key : never]: T[Key]
}
复制代码
```

#### ExcludeValues - 过滤出不符合类型 V 的属性

```ts
type ExcludeValues<T, V> = {
  [Key in keyof T as T[Key] extends V ? never : Key]: T[Key]
}
复制代码
```

#### GetterSetterPrefix - 向对象类型中添加 get 和 set 前缀

```ts
type GetterSetterPrefix<T> = {
  [Key in keyof T as Key extends string ? `get${Capitalize<Key>}` : never]: {
    (): T[Key]
  }
} & {
  [Key in keyof T as Key extends string ? `set${Capitalize<Key>}` : never]: {
    (val: T[Key]): void
  }
} & T
复制代码
```

#### Proxify - 将对象类型的每个属性值转为 get 和 set 形式

```ts
type Proxify<T> = {
  [P in keyof T]: {
    get(): T[P]
    set(v: T[P]): void
  }
}
复制代码
```

#### NullableValue - 将对象类型的每个属性值转为可为空的

```ts
type NullableValue<T> = {
  [Key in keyof T]?: common.Nullable<T[Key]>
}
复制代码
```

#### Include - 提取出符合类型 U 的键名构造新的对象类型

```ts
type Include<T extends object, U extends keyof any> = {
  [Key in keyof T as Key extends U ? Key : never]: T[Key]
}
复制代码
```

#### ChangeRecordType - 将对象类型的属性值填充为类型 T

```ts
type ChangeRecordType<K, T = undefined> = {
  [P in keyof K]?: T
}
复制代码
```

#### Mutable - 变为可写类型

```ts
type Mutable<T> = {
  -readonly [P in keyof T]: T[P]
}
复制代码
```

#### ReadonlyPartial - 变为只读且可选的

```ts
type ReadonlyPartial<T> = {
  readonly [P in keyof T]?: T[P]
}
复制代码
```

#### DeepPartial - 将对象类型的所有属性转为可选

```ts
type DeepPartial<T> = {
  [Key in keyof T]?: T[Key] extends object ? DeepPartial<T[Key]> : T[Key]
}
复制代码
```

#### ChainedAccessUnion - 查找对象类型的所有路径

```ts
type ChainedAccessUnion<T extends object> = ChainedAccessUnionHelper<T>

type ChainedAccessUnionHelper<
  T,
  A = {
    [Key in keyof T]: T[Key] extends string ? never : T[Key]
  },
  B = {
    [Key in keyof A]: A[Key] extends never
      ? never
      : A[Key] extends object
      ?
          | `${Extract<Key, string>}.${Extract<keyof A[Key], string>}`
          | (ChainedAccessUnionHelper<A[Key]> extends infer U
              ? `${Extract<Key, string>}.${Extract<U, string>}`
              : never)
      : never
  }
> = T extends object
  ? Exclude<keyof A | Exclude<Values<B>, never>, never>
  : never
复制代码
```

### 封装 common 工具类型

#### Not - 非

```ts
type Not<C extends boolean> = C extends true ? false : true
复制代码
```

#### And - 与

```ts
type And<C1 extends boolean, C2 extends boolean> = C1 extends true
  ? C2 extends true
    ? true
    : false
  : false
复制代码
```

#### Or - 或

```ts
type Or<C1 extends boolean, C2 extends boolean> = C1 extends true
  ? true
  : C2 extends true
  ? true
  : false
复制代码
```

#### CheckLeftIsExtendsRight - 约束校验

```ts
type CheckLeftIsExtendsRight<T extends any, R extends any> = T extends R
  ? true
  : false
复制代码
```

#### IsEqual - 类型严格相等

```ts
/**
 * https://github.com/microsoft/TypeScript/issues/27024#issuecomment-510924206
 */
type IsEqual<A, B> = (<T>() => T extends A ? 1 : 2) extends <
  T1
>() => T1 extends B ? 1 : 2
  ? true
  : false
复制代码
```

#### IsAny - 类型是否为 any

```ts
type IsAny<T> = 0 extends (1 & T) ? true : false
复制代码
```

#### Diff - 差异

```ts
type Diff<T, C> = Exclude<T, C> | Exclude<C, T>
复制代码
```

#### SumAggregate - 并集

```ts
type SumAggregate<T, U> = T | U
复制代码
```

#### Nullable - 可为空

```ts
type Nullable<T> = T | null | undefined
复制代码
```

### 封装 function 工具类型

#### Noop - 普通函数类型

```ts
type Noop = (...args: any) => any
复制代码
```

#### GetAsyncFunctionReturnType - 获取异步函数返回值

```ts
type GetAsyncFunctionReturnType<F extends Noop> = Awaited<ReturnType<F>>
复制代码
```

#### GetFunctionLength - 获取参数长度

```ts
type GetFunctionLength<F extends Noop> = F extends (...args: infer P) => any
  ? P["length"]
  : never
复制代码
```

## 实现一个加法器！

### 分析

让我们回忆一下，在小学三年级的数学计算中，10进制的小数相加要怎么做？

如 `1.8 + 1.52`

是不是要先把小数点对齐

```txt
  1.8
+ 1.52
——————
  2.32
复制代码
```

然后从右往左依次计算，如果当前位的结果大于等于 10，则需要往左边进一位

那么 ts 要如何知道 1 + 1 = 2，1 + 2 = 3 呢？

我们可以定义一个映射表，二维元组，用索引访问的方式得到一位整数加法的结果和它的进位情况

### 实现

#### 什么是一个形如数字的字符串类型

如 `"0.1"`、`"1"` 即是，用 ts 表示即 `${number}`

但是这样的数字也是符合这个条件的：`"000.1"`

如果想限制这样的数，用正则表达式很好处理，如何在 ts 类型系统中限制呢？

我们可以定义除了小数点前面有多个零的情况的类型

```ts
// 每位数
type Numbers = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9

// 开头不能是多个0
type AdvancedNumericCharacters =
  | `${0}.${number}`
  | `${Exclude<Numbers, 0>}${number | ""}.${number}`
  | `${Exclude<Numbers, 0>}${Numbers | ""}.${number}`
  | `${Exclude<Numbers, 0>}${number}`
  | `${Numbers}`
复制代码
```

#### 定义加法表

我们如果是 1 + 1，且加法表为 `AddMap`，我们想这样使用 `AddMap[1][1]`，得到相加的结果和需要进位的结果

即：

```ts
type AddMap = [
    [/* 0 + 0 */ { result: 0, add: 0 }, /* 0 + 1 */ {/* ... */} /* ... */]
    // ...
]
复制代码
```

#### 数据处理

小学三年级数学中的加法，要从右往左算，要以小数点对齐

但是在上文中我们实现的字符串或元组处理工具中，从右往左的都很麻烦，所以从左往右更简单，且元组操作要比字符串操作更方便，那么在实际的加法运算中

我们真实处理的数据应该是一个被反转的元组

1.  按小数点对齐

即按小数点分割，然后用 PadStart 和 PadEnd 补 0

```ts
// type Result = SplitByPoint<"1.02"> // ["1", "02"]
// 如果没有小数点，则小数位补 0 
type SplitByPoint<S extends AdvancedNumericCharacters> = string.Includes<
  S,
  "."
> extends true
  ? string.Split<S, ".">
  : [S, "0"]

// type Result = AddHelperSplitToArr<"1.02", "0.123"> // [["1", "02"], ["10", "123"]]
// 这里需要一起分割两个数字嘛
type AddHelperSplitToArr<
  S1 extends AdvancedNumericCharacters,
  S2 extends AdvancedNumericCharacters,
  Result = [SplitByPoint<S1>, SplitByPoint<S2>]
> = Result extends [[`${number}`, `${number}`], [`${number}`, `${number}`]]
  ? Result
  : never
复制代码
```

```ts
// type Result = AddFillZeroHelper<[["1", "02"], ["10", "123"]]> // [["01", "020"], ["10", "123"]]
// 对上面的结果用 PadStart 和 PadEnd 补 0
type AddFillZeroHelper<
  Data extends [[`${number}`, `${number}`], [`${number}`, `${number}`]],
  Result = [
    [
      string.PadStart<Data[0][0], string.GetStringLength<Data[1][0]>, "0">,
      string.PadEnd<Data[0][1], string.GetStringLength<Data[1][1]>, "0">
    ],
    [
      string.PadStart<Data[1][0], string.GetStringLength<Data[0][0]>, "0">,
      string.PadEnd<Data[1][1], string.GetStringLength<Data[0][1]>, "0">
    ]
  ]
> = Result extends [[`${number}`, `${number}`], [`${number}`, `${number}`]]
  ? Result
  : never
复制代码
```

2.  转元组后反转方便从左往右计算

```ts
// type Result = AddFillZeroHelper<[["1", "02"], ["10", "123"]]> 
// [[["1", "0"], ["0", "2", "0"]], [["0", "1"], ["3", "2", "1"]]]
type AddReverseData<
  Data extends [[`${number}`, `${number}`], [`${number}`, `${number}`]],
  Result = [
    [
      array.Reverse<string.Split<Data[0][0]>>,
      array.Reverse<string.Split<Data[0][1]>>
    ],
    [
      array.Reverse<string.Split<Data[1][0]>>,
      array.Reverse<string.Split<Data[1][1]>>
    ]
  ]
> = Result extends [
  [`${Numbers}`[], `${Numbers}`[]],
  [`${Numbers}`[], `${Numbers}`[]]
]
  ? Result
  : never
复制代码
```

#### 开始计算

单独计算小数位或整数位，减少复杂度，如果有进位，就在元组的最前面添加 `"10"`

```ts
type StepAdderHelper<
  DataLeft extends `${Numbers}`[], // 整数部分
  DataRight extends `${Numbers}`[], // 小数部分
  Curry extends `${Numbers}` = `${0}`, // 当前是否有进位
  Offset extends number = 0, // 循环的偏移量
  ResultCache extends `${number}`[] = [], // 用于缓存结果
  NextOffset extends number = number.IntAddSingle<Offset, 1>, // 偏移量加1
  Current extends AddMap[Numbers][Numbers] = AddMap[DataLeft[Offset]][DataRight[Offset]], // 当前的结果
  CurrentWidthPreCurry extends `${Numbers}` = AddMap[Current["result"]][Curry]["result"] // 当前的实际结果（加上进位）
> = DataLeft["length"] extends DataRight["length"]
  ? `${Offset}` extends `${DataLeft["length"]}`
    ? ResultCache
    : StepAdderHelper<
        DataLeft,
        DataRight,
        Current["add"],
        NextOffset,
        common.And<
          number.IsEqual<Current["add"], "1">,
          number.IsEqual<`${NextOffset}`, `${DataLeft["length"]}`>
        > extends true
          ? array.Push<["10", ...ResultCache], CurrentWidthPreCurry>
          : array.Push<ResultCache, CurrentWidthPreCurry>
      >
  : never
复制代码
```

#### 拼接结果

```ts
type NumbersWidthCurry = Numbers | 10

type MergeResultHelper<
  Data extends [
    [`${Numbers}`[], `${Numbers}`[]],
    [`${Numbers}`[], `${Numbers}`[]]
  ], // 处理后的的数据
  LeftInt extends `${Numbers}`[] = Data[0][0], // 加数的整数部分
  LeftFloat extends `${Numbers}`[] = Data[0][1], // 加数的小数部分
  RightInt extends `${Numbers}`[] = Data[1][0], // 被加数的整数部分
  RightFloat extends `${Numbers}`[] = Data[1][1], // 被加数的小数部分
  FloatAdded extends `${NumbersWidthCurry}`[] = StepAdderHelper<
    LeftFloat,
    RightFloat
  >, // 小数部分加法，附带进位的反序元组的结果
  FloatHasCurry extends boolean = FloatAdded[0] extends "10" ? true : false, // 小数是否有进位
  DeleteCurryFloatResult extends unknown[] = FloatHasCurry extends true
    ? array.Shift<FloatAdded>
    : FloatAdded, // 小数部分删除进位后的可以直接用的反序元组结果
  IntAdded extends `${NumbersWidthCurry}`[] = StepAdderHelper<
    LeftInt,
    RightInt,
    FloatHasCurry extends true ? `1` : "0"
  >, // 整数部分加法，初始会附带上小数部分的进位，结果会带上自己的进位
  IntHasCurry extends boolean = IntAdded[0] extends "10" ? true : false, // 整数部分是否还有进位
  DeleteCurryIntResult extends unknown[] = IntHasCurry extends true
    ? array.Shift<IntAdded>
    : IntAdded, // 整数部分删除进位后的可以直接用的反序元组结果
  ResultReversed = array.Reverse<
    LeftFloat["length"] extends 0
      ? DeleteCurryIntResult
      : array.Concat<
          [...DeleteCurryFloatResult, "."],
          [...DeleteCurryIntResult]
        >
  >, // 将整数小数（小数点）加入结果，并将反序的元组还原
  FloatResult = array.Join<
    ResultReversed extends string[]
      ? IntHasCurry extends true
        ? ["1", ...ResultReversed]
        : ResultReversed
      : never,
    ""
  > // 转字符串，并处理整数的进位
> = FloatResult

// 最终结果
type Add<
  S1 extends AdvancedNumericCharacters,
  S2 extends AdvancedNumericCharacters
> = MergeResultHelper<
  AddReverseData<AddFillZeroHelper<AddHelperSplitToArr<S1, S2>>>
>
复制代码
```

### 最终代码

```ts
type Numbers = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9

type AdvancedNumericCharacters =
  | `${0}.${number}`
  | `${Exclude<Numbers, 0>}${number | ""}.${number}`

type AddMap = [
  [
    { result: "0"; add: "0" }, // 00
    { result: "1"; add: "0" }, // 01
    { result: "2"; add: "0" }, // 02
    { result: "3"; add: "0" }, // 03
    { result: "4"; add: "0" }, // 04
    { result: "5"; add: "0" }, // 05
    { result: "6"; add: "0" }, // 06
    { result: "7"; add: "0" }, // 07
    { result: "8"; add: "0" }, // 08
    { result: "9"; add: "0" } // 09
  ],
  [
    { result: "1"; add: "0" }, // 10
    { result: "2"; add: "0" }, // 11
    { result: "3"; add: "0" }, // 12
    { result: "4"; add: "0" }, // 13
    { result: "5"; add: "0" }, // 14
    { result: "6"; add: "0" }, // 15
    { result: "7"; add: "0" }, // 16
    { result: "8"; add: "0" }, // 17
    { result: "9"; add: "0" }, // 18
    { result: "0"; add: "1" } // 19
  ],
  // ....
  [
    { result: "8"; add: "0" }, // 80
    { result: "9"; add: "0" }, // 81
    { result: "0"; add: "1" }, // 82
    { result: "1"; add: "1" }, // 83
    { result: "2"; add: "1" }, // 84
    { result: "3"; add: "1" }, // 85
    { result: "4"; add: "1" }, // 86
    { result: "5"; add: "1" }, // 87
    { result: "6"; add: "1" }, // 88
    { result: "7"; add: "1" } // 89
  ],
  [
    { result: "9"; add: "0" }, // 90
    { result: "0"; add: "0" }, // 91
    { result: "1"; add: "1" }, // 92
    { result: "2"; add: "1" }, // 93
    { result: "3"; add: "1" }, // 94
    { result: "4"; add: "1" }, // 95
    { result: "5"; add: "1" }, // 96
    { result: "6"; add: "1" }, // 97
    { result: "7"; add: "1" }, // 98
    { result: "8"; add: "1" } // 99
  ]
]

type SplitByPoint<S extends AdvancedNumericCharacters> = string.Includes<
  S,
  "."
> extends true
  ? string.Split<S, ".">
  : [S, "0"]

type AddHelperSplitToArr<
  S1 extends AdvancedNumericCharacters,
  S2 extends AdvancedNumericCharacters,
  Result = [SplitByPoint<S1>, SplitByPoint<S2>]
> = Result extends [[`${number}`, `${number}`], [`${number}`, `${number}`]]
  ? Result
  : never

type AddFillZeroHelper<
  Data extends [[`${number}`, `${number}`], [`${number}`, `${number}`]],
  Result = [
    [
      string.PadStart<Data[0][0], string.GetStringLength<Data[1][0]>, "0">,
      string.PadEnd<Data[0][1], string.GetStringLength<Data[1][1]>, "0">
    ],
    [
      string.PadStart<Data[1][0], string.GetStringLength<Data[0][0]>, "0">,
      string.PadEnd<Data[1][1], string.GetStringLength<Data[0][1]>, "0">
    ]
  ]
> = Result extends [[`${number}`, `${number}`], [`${number}`, `${number}`]]
  ? Result
  : never

type AddReverseData<
  Data extends [[`${number}`, `${number}`], [`${number}`, `${number}`]],
  Result = [
    [
      array.Reverse<string.Split<Data[0][0]>>,
      array.Reverse<string.Split<Data[0][1]>>
    ],
    [
      array.Reverse<string.Split<Data[1][0]>>,
      array.Reverse<string.Split<Data[1][1]>>
    ]
  ]
> = Result extends [
  [`${Numbers}`[], `${Numbers}`[]],
  [`${Numbers}`[], `${Numbers}`[]]
]
  ? Result
  : never

type StepAdderHelper<
  DataLeft extends `${Numbers}`[],
  DataRight extends `${Numbers}`[],
  Curry extends `${Numbers}` = `${0}`,
  Offset extends number = 0,
  ResultCache extends `${number}`[] = [],
  NextOffset extends number = number.IntAddSingle<Offset, 1>,
  Current extends AddMap[Numbers][Numbers] = AddMap[DataLeft[Offset]][DataRight[Offset]],
  CurrentWidthPreCurry extends `${Numbers}` = AddMap[Current["result"]][Curry]["result"]
> = DataLeft["length"] extends DataRight["length"]
  ? `${Offset}` extends `${DataLeft["length"]}`
    ? ResultCache
    : StepAdderHelper<
        DataLeft,
        DataRight,
        Current["add"],
        NextOffset,
        common.And<
          number.IsEqual<Current["add"], "1">,
          number.IsEqual<`${NextOffset}`, `${DataLeft["length"]}`>
        > extends true
          ? array.Push<["10", ...ResultCache], CurrentWidthPreCurry>
          : array.Push<ResultCache, CurrentWidthPreCurry>
      >
  : never

type NumbersWidthCurry = Numbers | 10

type MergeResultHelper<
  Data extends [
    [`${Numbers}`[], `${Numbers}`[]],
    [`${Numbers}`[], `${Numbers}`[]]
  ],
  LeftInt extends `${Numbers}`[] = Data[0][0],
  LeftFloat extends `${Numbers}`[] = Data[0][1],
  RightInt extends `${Numbers}`[] = Data[1][0],
  RightFloat extends `${Numbers}`[] = Data[1][1],
  FloatAdded extends `${NumbersWidthCurry}`[] = StepAdderHelper<
    LeftFloat,
    RightFloat
  >,
  FloatHasCurry extends boolean = FloatAdded[0] extends "10" ? true : false,
  DeleteCurryFloatResult extends unknown[] = FloatHasCurry extends true
    ? array.Shift<FloatAdded>
    : FloatAdded,
  IntAdded extends `${NumbersWidthCurry}`[] = StepAdderHelper<
    LeftInt,
    RightInt,
    FloatHasCurry extends true ? `1` : "0"
  >,
  IntHasCurry extends boolean = IntAdded[0] extends "10" ? true : false,
  DeleteCurryIntResult extends unknown[] = IntHasCurry extends true
    ? array.Shift<IntAdded>
    : IntAdded,
  ResultReversed = array.Reverse<
    LeftFloat["length"] extends 0
      ? DeleteCurryIntResult
      : array.Concat<
          [...DeleteCurryFloatResult, "."],
          [...DeleteCurryIntResult]
        >
  >,
  FloatResult = array.Join<
    ResultReversed extends string[]
      ? IntHasCurry extends true
        ? ["1", ...ResultReversed]
        : ResultReversed
      : never,
    ""
  >
> = FloatResult

type Add<
  S1 extends AdvancedNumericCharacters,
  S2 extends AdvancedNumericCharacters
> = MergeResultHelper<
  AddReverseData<AddFillZeroHelper<AddHelperSplitToArr<S1, S2>>>
>

type add = Add<"9007199254740991", "9007199254740991">
复制代码
```

> 相关文章推荐
> 
> [本文原文](https://link.juejin.cn?target=https%3A%2F%2Fyzl.xyz%2Flin%2F2022%2F01%2F%25E6%258E%25A5%25E8%25BF%2591%25E5%25A4%25A9%25E8%258A%25B1%25E6%259D%25BF%25E7%259A%2584TS%25E7%25B1%25BB%25E5%259E%258B%25E4%25BD%2593%25E6%2593%258D-%25E7%259C%258B%25E6%2587%2582%25E4%25BD%25A0%25E5%25B0%25B1%25E8%2583%25BD%25E7%258E%25A9%25E8%25BD%25ACTS%25E4%25BA%2586%2Fc7c8c77c59d1.html "https://yzl.xyz/lin/2022/01/%E6%8E%A5%E8%BF%91%E5%A4%A9%E8%8A%B1%E6%9D%BF%E7%9A%84TS%E7%B1%BB%E5%9E%8B%E4%BD%93%E6%93%8D-%E7%9C%8B%E6%87%82%E4%BD%A0%E5%B0%B1%E8%83%BD%E7%8E%A9%E8%BD%ACTS%E4%BA%86/c7c8c77c59d1.html")
> 
> [掘金：TypeScript 类型体操姿势合集<通关总结>--刷完](https://juejin.cn/post/6999280101556748295 "https://juejin.cn/post/6999280101556748295")
> 
> [掘金：Ts 高手篇：22 个示例深入讲解 Ts 最晦涩难懂的高级类型工具](https://juejin.cn/post/6994102811218673700 "https://juejin.cn/post/6994102811218673700")
> 
> [掘金：来做操吧！深入 TypeScript 高级类型和类型体操](https://juejin.cn/post/7039856272354574372 "https://juejin.cn/post/7039856272354574372")
> 
> [掘金：模式匹配-让你 ts 类型体操水平暴增的套路](https://juejin.cn/post/7045536402112512007 "https://juejin.cn/post/7045536402112512007")

.markdown-body pre,.markdown-body pre>code.hljs{color:#333;background:#f8f8f8}.hljs-comment,.hljs-quote{color:#998;font-style:italic}.hljs-keyword,.hljs-selector-tag,.hljs-subst{color:#333;font-weight:700}.hljs-literal,.hljs-number,.hljs-tag .hljs-attr,.hljs-template-variable,.hljs-variable{color:teal}.hljs-doctag,.hljs-string{color:#d14}.hljs-section,.hljs-selector-id,.hljs-title{color:#900;font-weight:700}.hljs-subst{font-weight:400}.hljs-class .hljs-title,.hljs-type{color:#458;font-weight:700}.hljs-attribute,.hljs-name,.hljs-tag{color:navy;font-weight:400}.hljs-link,.hljs-regexp{color:#009926}.hljs-bullet,.hljs-symbol{color:#990073}.hljs-built\_in,.hljs-builtin-name{color:#0086b3}.hljs-meta{color:#999;font-weight:700}.hljs-deletion{background:#fdd}.hljs-addition{background:#dfd}.hljs-emphasis{font-style:italic}.hljs-strong{font-weight:700}

分类：

[前端](/frontend)

标签：

[TypeScript](/tag/TypeScript)[JavaScript](/tag/JavaScript)

文章被收录于专栏：

![cover](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/95414745836549ce9143753e2a30facd~tplv-k3u1fbpfcp-no-mark:160:160:160:120.awebp)

TypeScript 日记

TS 的那些骚操作，你看这里就对了

关注专栏

[安装掘金浏览器插件](https://juejin.cn/extension/?utm_source=standalone&utm_medium=post&utm_campaign=extension_promotion)

多内容聚合浏览、多引擎快捷搜索、多工具便捷提效、多模式随心畅享，你想要的，这里都有！

[前往安装](https://juejin.cn/extension/?utm_source=standalone&utm_medium=post&utm_campaign=extension_promotion)

相关课程

![「可视化入门：从 0 到 1 开发一个图表库」封面](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/02abb0a465854a408fbd1a312343f21b~tplv-k3u1fbpfcp-no-mark:420:420:300:420.awebp?)

VIP

可视化入门：从 0 到 1 开发一个图表库

[数据可视化 ![lv-3](//lf3-cdn-tos.bytescm.com/obj/static/xitu_juejin_web/img/lv-3.7938ebc.png "创作等级")](/user/712139233844503)   

1813购买

¥19.9

![「微信小程序底层框架实现原理」封面](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e4cb15cbaa9746acba4ee6c0df65021d~tplv-k3u1fbpfcp-no-mark:420:420:300:420.awebp?)

VIP

微信小程序底层框架实现原理

[夜还不够黑丶 ![lv-5](//lf3-cdn-tos.bytescm.com/obj/static/xitu_juejin_web/img/lv-5.d08789d.png "创作等级")](/user/342703357565614)   

1659购买

¥29.9

评论

![](https://p3-passport.byteimg.com/img/user-avatar/b751d394f6a051f69d74a79f8617635f~100x100.awebp)

表情

图片

⌘ + Enter发表评论

热门评论

[![hugeannex的头像](https://p3-passport.byteimg.com/img/user-avatar/8dd2b1cc8ea1158614589ff2a2a7cd53~100x100.awebp)](/user/1134351732714590)

删除

[hugeannex ![lv-1](//lf3-cdn-tos.bytescm.com/obj/static/xitu_juejin_web/img/lv-1.9d93e13.png "创作等级") ![掘友等级](//lf3-cdn-tos.bytescm.com/obj/static/xitu_juejin_web/8c6985e2aa4c06f307ae3734da4b43ac.svg "掘友等级")](/user/1134351732714590)   

扫地 @ 地球修理 9月前

写得不错，但是，俺就是不懂，这类型不就是一个工具，为什么要把工具弄得这到复杂，把人绕死为佳?

展开

收起

7

5

[![](https://p3-passport.byteimg.com/img/user-avatar/64fab52397b56bf99e6431a7395015a1~100x100.awebp)](/user/712139267651623)

删除

[夜尽灬天明丶](/user/712139267651623)

（作者） 9月前

![[吃瓜群众]](//lf3-cdn-tos.bytescm.com/obj/static/xitu_juejin_web/img/jj_emoji_10.42a731c.png)这是类型体操哈，搞懂了对ts的某一方面有更高的理解，大部分是用不到的，可以了解一下

展开

收起

点赞

回复

[![](https://p3-passport.byteimg.com/img/user-avatar/8dd2b1cc8ea1158614589ff2a2a7cd53~100x100.awebp)](/user/1134351732714590)

删除

[hugeannex](/user/1134351732714590)

回复

[夜尽灬天明丶](/user/712139267651623)

9月前

俺不管，俺就要any!![[呲牙]](//lf3-cdn-tos.bytescm.com/obj/static/xitu_juejin_web/img/jj_emoji_2.cd1e2bd.png)

展开

收起

“

![[吃瓜群众]](//lf3-cdn-tos.bytescm.com/obj/static/xitu_juejin_web/img/jj_emoji_10.42a731c.png)这是类型体操哈，搞懂了对ts的某一方面有更高的理解，大部分是用不到的，可以了解一下

”

3

回复

查看更多回复

[![优弧的头像](https://p3-passport.byteimg.com/img/user-avatar/7e4a7c01e7022917f7242419f19a6c03~100x100.awebp)](/user/852876722177533)

删除

[优弧 ![lv-5](//lf3-cdn-tos.bytescm.com/obj/static/xitu_juejin_web/img/lv-5.d08789d.png "创作等级") ![掘友等级](//lf3-cdn-tos.bytescm.com/obj/static/xitu_juejin_web/70f1e5e3a2fde62e0d623009ab80cb12.svg "掘友等级")

VIP.4 融会贯通

![](//lf3-cdn-tos.bytescm.com/obj/static/xitu_juejin_web/07302452a7ad81cb43a173b5cd580237.svg)

](/user/852876722177533)

管理员| 运营负责人 @ 掘金 9月前

你好。这篇文章可以授权掘金转载吗？

展开

收起

5

5

[![](https://p3-passport.byteimg.com/img/user-avatar/64fab52397b56bf99e6431a7395015a1~100x100.awebp)](/user/712139267651623)

删除

[夜尽灬天明丶](/user/712139267651623)

（作者） 9月前

可以

展开

收起

1

回复

[![](https://p3-passport.byteimg.com/img/user-avatar/7e4a7c01e7022917f7242419f19a6c03~100x100.awebp)](/user/852876722177533)

删除

[优弧

VIP.4 融会贯通

![](//lf3-cdn-tos.bytescm.com/obj/static/xitu_juejin_web/07302452a7ad81cb43a173b5cd580237.svg)

](/user/852876722177533)

回复

[夜尽灬天明丶](/user/712139267651623)

9月前

那你加下我好友。我送你一件掘金周边。

展开

收起

“

可以

”

点赞

回复

查看更多回复

全部评论 117

最新

最热

[![小蓝11的头像](https://p3-passport.byteimg.com/img/user-avatar/5c219fa105446033fd14db513251a742~100x100.awebp)](/user/1011996486283432)

删除

[小蓝11 ![掘友等级](//lf3-cdn-tos.bytescm.com/obj/static/xitu_juejin_web/8c6985e2aa4c06f307ae3734da4b43ac.svg "掘友等级")](/user/1011996486283432)  

前端 15天前

字符串里的 replaceAll好像有点问题

展开

收起

1

4

[![](https://p3-passport.byteimg.com/img/user-avatar/5c219fa105446033fd14db513251a742~100x100.awebp)](/user/1011996486283432)

删除

[小蓝11](/user/1011996486283432)

14天前

type replaceAll<  
S extends string,  
MatchStr extends string,  
ReplaceStr extends string,  
Res extends string = ''  
\> = S extends \`${infer Left}${MatchStr}${infer Right}\`  
? replaceAll<Right, MatchStr, ReplaceStr, \`${Res}${Left}${ReplaceStr}\`>  
: \`${Res}${S}\`;

展开

收起

点赞

回复

[![](https://p3-passport.byteimg.com/img/user-avatar/64fab52397b56bf99e6431a7395015a1~100x100.awebp)](/user/712139267651623)

删除

[夜尽灬天明丶](/user/712139267651623)

（作者） 11天前

有什么问题呢~

展开

收起

点赞

回复

查看更多回复

[![raincruise的头像](https://p3-passport.byteimg.com/img/user-avatar/affac8c03ed1e5c621e084d226c30df1~100x100.awebp)](/user/3315782800121735)

删除

[raincruise ![lv-2](//lf3-cdn-tos.bytescm.com/obj/static/xitu_juejin_web/img/lv-2.99ba5b2.png "创作等级") ![掘友等级](//lf3-cdn-tos.bytescm.com/obj/static/xitu_juejin_web/cf19b122213ebdbd25b66f02500b8c27.svg "掘友等级")](/user/3315782800121735)   

前端开发工程师 @ 北京字节跳动科技有限公司 16天前

![👍](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-assets/asset/twemoji/2.6.0/svg/1f44d.svg~tplv-t2oaga2asx-image.image)

展开

收起

1

回复

[![unll的头像](https://p3-passport.byteimg.com/img/user-avatar/0a0d5a4c1e5b4b50c32b9e230e1100aa~100x100.awebp)](/user/2814346130096574)

删除

[unll ![掘友等级](//lf3-cdn-tos.bytescm.com/obj/static/xitu_juejin_web/65a6a28f15d70e5a77bf881c5ec5340d.svg "掘友等级")](/user/2814346130096574)  

19天前

去收藏夹吃灰吧![[看]](//lf3-cdn-tos.bytescm.com/obj/static/xitu_juejin_web/img/jj_emoji_97.39cdc9f.png)

展开

收起

1

1

[![](https://p3-passport.byteimg.com/img/user-avatar/64fab52397b56bf99e6431a7395015a1~100x100.awebp)](/user/712139267651623)

删除

[夜尽灬天明丶](/user/712139267651623)

（作者） 19天前

![[奸笑]](//lf3-cdn-tos.bytescm.com/obj/static/xitu_juejin_web/img/jj_emoji_17.bcebf79.png)

展开

收起

点赞

回复

[![HotLong的头像](https://p3-passport.byteimg.com/img/user-avatar/6fcf46b1307721abd3e4c721486895d7~100x100.awebp)](/user/1151943916129319)

删除

[HotLong ![lv-2](//lf3-cdn-tos.bytescm.com/obj/static/xitu_juejin_web/img/lv-2.99ba5b2.png "创作等级") ![掘友等级](//lf3-cdn-tos.bytescm.com/obj/static/xitu_juejin_web/8c6985e2aa4c06f307ae3734da4b43ac.svg "掘友等级")](/user/1151943916129319)   

前端工程师 24天前

真牛逼，日常复习![[可怜]](//lf3-cdn-tos.bytescm.com/obj/static/xitu_juejin_web/img/jj_emoji_5.ece2a96.png)

展开

收起

1

1

[![](https://p3-passport.byteimg.com/img/user-avatar/64fab52397b56bf99e6431a7395015a1~100x100.awebp)](/user/712139267651623)

删除

[夜尽灬天明丶](/user/712139267651623)

（作者） 23天前

要自己多尝试哦

展开

收起

点赞

回复

[![小宇哥哥的头像](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/mirror-assets/16ab56fe85db21227dd~tplv-t2oaga2asx-no-mark:100:100:100:100.awebp)](/user/1873223545265576)

删除

[小宇哥哥 ![掘友等级](//lf3-cdn-tos.bytescm.com/obj/static/xitu_juejin_web/cf19b122213ebdbd25b66f02500b8c27.svg "掘友等级")](/user/1873223545265576)  

fe 1月前

简直了![[赞]](//lf3-cdn-tos.bytescm.com/obj/static/xitu_juejin_web/img/jj_emoji_108.a6defc6.png)

展开

收起

点赞

回复

[![割割更健康的头像](https://p3-passport.byteimg.com/img/user-avatar/b0b4e2ced8d76e3450af4205867a620a~100x100.awebp)](/user/3386151543244654)

删除

[割割更健康 ![掘友等级](//lf3-cdn-tos.bytescm.com/obj/static/xitu_juejin_web/8c6985e2aa4c06f307ae3734da4b43ac.svg "掘友等级")](/user/3386151543244654)  

前端割图仔 @ 你割了吗 2月前

// 判断左侧类型是否和右侧类型一致  
type IsEqual<A, B> = (<T>() => T extends A ? 1 : 2) extends <  
T1  
\>() => T1 extends B ? 1 : 2  
? true  
: false  
  
这个搞不懂啊，为什么要这么写。可以解释一下吗

展开

收起

1

1

[![](https://p3-passport.byteimg.com/img/user-avatar/64fab52397b56bf99e6431a7395015a1~100x100.awebp)](/user/712139267651623)

删除

[夜尽灬天明丶](/user/712139267651623)

（作者） 2月前

展开

收起

![image](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/63ef125fa38c48a68744e7e7194b9f92~tplv-k3u1fbpfcp-no-mark:320:320:320:320.awebp?) 

1

回复

[![割割更健康的头像](https://p3-passport.byteimg.com/img/user-avatar/b0b4e2ced8d76e3450af4205867a620a~100x100.awebp)](/user/3386151543244654)

删除

[割割更健康 ![掘友等级](//lf3-cdn-tos.bytescm.com/obj/static/xitu_juejin_web/8c6985e2aa4c06f307ae3734da4b43ac.svg "掘友等级")](/user/3386151543244654)  

前端割图仔 @ 你割了吗 2月前

type Example2 = 1 | 2 extends 1 ? true : false // true  
  
这个貌似结果是 false 才对吧

展开

收起

2

1

[![](https://p3-passport.byteimg.com/img/user-avatar/64fab52397b56bf99e6431a7395015a1~100x100.awebp)](/user/712139267651623)

删除

[夜尽灬天明丶](/user/712139267651623)

（作者） 2月前

对呢

展开

收起

点赞

回复

[![CV大法的头像](https://p3-passport.byteimg.com/img/user-avatar/22aa5969b5031f48518afab5f0b2c6e3~100x100.awebp)](/user/976022057527342)

删除

[CV大法 ![掘友等级](//lf3-cdn-tos.bytescm.com/obj/static/xitu_juejin_web/65a6a28f15d70e5a77bf881c5ec5340d.svg "掘友等级")](/user/976022057527342)  

2月前

哈哈哈，看到你的头像比较炫，我也设置了一个，还在审核![[呲牙]](//lf3-cdn-tos.bytescm.com/obj/static/xitu_juejin_web/img/jj_emoji_2.cd1e2bd.png)![[呲牙]](//lf3-cdn-tos.bytescm.com/obj/static/xitu_juejin_web/img/jj_emoji_2.cd1e2bd.png)![[呲牙]](//lf3-cdn-tos.bytescm.com/obj/static/xitu_juejin_web/img/jj_emoji_2.cd1e2bd.png)

展开

收起

1

1

[![](https://p3-passport.byteimg.com/img/user-avatar/64fab52397b56bf99e6431a7395015a1~100x100.awebp)](/user/712139267651623)

删除

[夜尽灬天明丶](/user/712139267651623)

（作者） 2月前

看文章！不要看头像

展开

收起

点赞

回复

[![董哥懂不懂的头像](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/5/23/16ae258dd9521486~tplv-t2oaga2asx-no-mark:100:100:100:100.awebp)](/user/4406498336181261)

删除

[董哥懂不懂 ![lv-2](//lf3-cdn-tos.bytescm.com/obj/static/xitu_juejin_web/img/lv-2.99ba5b2.png "创作等级") ![掘友等级](//lf3-cdn-tos.bytescm.com/obj/static/xitu_juejin_web/70f1e5e3a2fde62e0d623009ab80cb12.svg "掘友等级")](/user/4406498336181261)   

2月前

学习了

展开

收起

点赞

回复

[![cd_ding的头像](https://p3-passport.byteimg.com/img/mosaic-legacy/3793/3131589739~100x100.awebp)](/user/2313028194272039)

删除

[cd\_ding ![lv-2](//lf3-cdn-tos.bytescm.com/obj/static/xitu_juejin_web/img/lv-2.99ba5b2.png "创作等级") ![掘友等级](//lf3-cdn-tos.bytescm.com/obj/static/xitu_juejin_web/cf19b122213ebdbd25b66f02500b8c27.svg "掘友等级")](/user/2313028194272039)   

前端摸鱼师 3月前

这个能做成一个类似的lodash的类型操作库放到github上面吗？

展开

收起

点赞

1

[![](https://p3-passport.byteimg.com/img/user-avatar/64fab52397b56bf99e6431a7395015a1~100x100.awebp)](/user/712139267651623)

删除

[夜尽灬天明丶](/user/712139267651623)

（作者） 3月前

文中写了：[![](//lf3-cdn-tos.bytescm.com/obj/static/xitu_juejin_web/3f843e8626a3844c624fb596dddd9674.svg)github.com](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2FkawayiLinLin%2Ftypescript-lodash "https://github.com/kawayiLinLin/typescript-lodash")

展开

收起

点赞

回复

[![maopao的头像](https://p3-passport.byteimg.com/img/user-avatar/b75c551cdbb5e24869ad262964549940~100x100.awebp)](/user/743703691668999)

删除

[maopao ![lv-1](//lf3-cdn-tos.bytescm.com/obj/static/xitu_juejin_web/img/lv-1.9d93e13.png "创作等级") ![掘友等级](//lf3-cdn-tos.bytescm.com/obj/static/xitu_juejin_web/65a6a28f15d70e5a77bf881c5ec5340d.svg "掘友等级")](/user/743703691668999)   

前端开发工程师 @ 契约锁 3月前

判断相等下面 example2 结果是false

展开

收起

点赞

1

[![](https://p3-passport.byteimg.com/img/user-avatar/64fab52397b56bf99e6431a7395015a1~100x100.awebp)](/user/712139267651623)

删除

[夜尽灬天明丶](/user/712139267651623)

（作者） 3月前

你说的对，前面评论也说了

展开

收起

点赞

回复

[![割割更健康的头像](https://p3-passport.byteimg.com/img/user-avatar/b0b4e2ced8d76e3450af4205867a620a~100x100.awebp)](/user/3386151543244654)

删除

[割割更健康 ![掘友等级](//lf3-cdn-tos.bytescm.com/obj/static/xitu_juejin_web/8c6985e2aa4c06f307ae3734da4b43ac.svg "掘友等级")](/user/3386151543244654)  

前端割图仔 @ 你割了吗 4月前

太卷了 ![😭](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-assets/asset/twemoji/2.6.0/svg/1f62d.svg~tplv-t2oaga2asx-image.image)

展开

收起

点赞

回复

[![CV大法的头像](https://p3-passport.byteimg.com/img/user-avatar/22aa5969b5031f48518afab5f0b2c6e3~100x100.awebp)](/user/976022057527342)

删除

[CV大法 ![掘友等级](//lf3-cdn-tos.bytescm.com/obj/static/xitu_juejin_web/65a6a28f15d70e5a77bf881c5ec5340d.svg "掘友等级")](/user/976022057527342)  

4月前

大佬请求个问题：[![](//lf3-cdn-tos.bytescm.com/obj/static/xitu_juejin_web/3f843e8626a3844c624fb596dddd9674.svg)www.typescriptlang.org](https://link.juejin.cn?target=https%3A%2F%2Fwww.typescriptlang.org%2Fzh%2Fplay%3F%23code%2FC4TwDgpgBAYgrgOwMZQLxQN5QM5yUibbAfgC4oAKAOhoEMAnAc3NoRAEo0A%2BKANwHsAlgBMA3FABmtQQBsylGlQbMorDtz5DhUAL6iAUKEhQA8mGCD%2BCbAB4AKj3QmAtoOD2ANFADkufIWxvKAAfHylZby4DI2gAZTwCInsoCAAPYAgEYWxMHASA%2BWo6JhY2TlQeARFdRygABUEkAGtPHz9EwKjDcGgYaRlktIysnKxwuXIipRLVMo0q7R1ahubW73HI6J76hlpnWzsU9Mzs2EQkWqx2gvJ4-ySHcXH5Ptl7Hh0oADJTc0trd4GfRpMD8ejAKBIKzYCHAeisbASMHOACC2BAyDQqnRmMGxxGZ0xPwAShAofRhDYYfRBAhGF41FwuBR9FAoPw-tDyGYLND3h5WZJzpNlOQ6rt9u9ypUtALpZhBfQIMA4PQEFAEBAAO71ej8VzYCAUChK7D8GS8CBeJUAKzJwHlGEFbLhIAVbI9QuQFCdns9ig5vOsAr9HuuREmpvlpvNlpNhHYIdDkn6kwg0YgdqQwAo6aTnp07AMBchtGASAAFpQIPQ9fROL6-bb7bna2Ci87dILCwY9EA "https://www.typescriptlang.org/zh/play?#code/C4TwDgpgBAYgrgOwMZQLxQN5QM5yUibbAfgC4oAKAOhoEMAnAc3NoRAEo0A+KANwHsAlgBMA3FABmtQQBsylGlQbMorDtz5DhUAL6iAUKEhQA8mGCD+CbAB4AKj3QmAtoOD2ANFADkufIWxvKAAfHylZby4DI2gAZTwCInsoCAAPYAgEYWxMHASA+Wo6JhY2TlQeARFdRygABUEkAGtPHz9EwKjDcGgYaRlktIysnKxwuXIipRLVMo0q7R1ahubW73HI6J76hlpnWzsU9Mzs2EQkWqx2gvJ4-ySHcXH5Ptl7Hh0oADJTc0trd4GfRpMD8ejAKBIKzYCHAeisbASMHOACC2BAyDQqnRmMGxxGZ0xPwAShAofRhDYYfRBAhGF41FwuBR9FAoPw-tDyGYLND3h5WZJzpNlOQ6rt9u9ypUtALpZhBfQIMA4PQEFAEBAAO71ej8VzYCAUChK7D8GS8CBeJUAKzJwHlGEFbLhIAVbI9QuQFCdns9ig5vOsAr9HuuREmpvlpvNlpNhHYIdDkn6kwg0YgdqQwAo6aTnp07AMBchtGASAAFpQIPQ9fROL6-bb7bna2Ci87dILCwY9EA")  
  
我想包装下函数使用async 实现：

展开

收起

![image](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0e5c94f31d4a433bbd43206e753371db~tplv-k3u1fbpfcp-no-mark:320:320:320:320.awebp?)

点赞

5

[![](https://p3-passport.byteimg.com/img/user-avatar/64fab52397b56bf99e6431a7395015a1~100x100.awebp)](/user/712139267651623)

删除

[夜尽灬天明丶](/user/712139267651623)

（作者） 4月前

你好，你把图里的内容也加到 playground 中我帮你看下

展开

收起

点赞

回复

[![](https://p3-passport.byteimg.com/img/user-avatar/22aa5969b5031f48518afab5f0b2c6e3~100x100.awebp)](/user/976022057527342)

删除

[CV大法](/user/976022057527342)

回复

[夜尽灬天明丶](/user/712139267651623)

3月前

解决了，谢谢。  
因为第三方没有导出入参的类型定义，  
我使用得到入参类型定义，之后就可以了  
type Params = Parameters<typeof JHBridge.actionSheet>\[0\];

展开

收起

“

你好，你把图里的内容也加到 playground 中我帮你看下

”

点赞

回复

查看更多回复

[![CV大法的头像](https://p3-passport.byteimg.com/img/user-avatar/22aa5969b5031f48518afab5f0b2c6e3~100x100.awebp)](/user/976022057527342)

删除

[CV大法 ![掘友等级](//lf3-cdn-tos.bytescm.com/obj/static/xitu_juejin_web/65a6a28f15d70e5a77bf881c5ec5340d.svg "掘友等级")](/user/976022057527342)  

4月前

判断全等的时候，看到一个杠精  
  
type OF4 = EqEqEq<{ (x: 0, y: null): void; (x: number, y: null): void }, { (x: number, y: null): void; (x: 0, y: null): void }>  
  
  
// false

展开

收起

1

2

[![](https://p3-passport.byteimg.com/img/user-avatar/22aa5969b5031f48518afab5f0b2c6e3~100x100.awebp)](/user/976022057527342)

删除

[CV大法](/user/976022057527342)

4月前

type EqEqEq<X, Y> =  
(<T>() => T extends X ? 1 : 2) extends (Y extends any\[\] ? (<T>() => T extends Y ? 1 : 2) :  
(Y extends Record<string, any> ? (<T>() => T extends Extract<X, Y> ? 1 : 2) : (<T>() => T extends Y ? 1 : 2))) ? true : false;  
我也加工了一下，但是没有解决 Equals<any\[\], unkown\[\]> 问题  
  
因为 any\[\] extends Record<string, any> 竟然为true  
这个能实现函数问题

展开

收起

![image](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9765174bdd374705bfd96a2b5586bc43~tplv-k3u1fbpfcp-no-mark:320:320:320:320.awebp?) 

1

回复

[![](https://p3-passport.byteimg.com/img/user-avatar/64fab52397b56bf99e6431a7395015a1~100x100.awebp)](/user/712139267651623)

删除

[夜尽灬天明丶](/user/712139267651623)

（作者）

回复

[CV大法](/user/976022057527342)

3月前

天哪，已经开始掉头发了

展开

收起

“

type EqEqEq<X, Y> =  
(<T>() => T extends X ? 1 : 2) extends (Y extends any\[\] ? (<T>() => T extends Y ? 1 : 2) :  
(Y extends Record<string, any> ? (<T>() => T extends Extract<X, Y> ? 1 : 2) : (<T>() => T extends Y ? 1 : 2))) ? true : false;  
我也加工了一下，但是没有解决 Equals<any\[\], unkown\[\]> 问题  
  
因为 any\[\] extends Record<string, any> 竟然为true  
这个能实现函数问题

”

点赞

回复

[![CV大法的头像](https://p3-passport.byteimg.com/img/user-avatar/22aa5969b5031f48518afab5f0b2c6e3~100x100.awebp)](/user/976022057527342)

删除

[CV大法 ![掘友等级](//lf3-cdn-tos.bytescm.com/obj/static/xitu_juejin_web/65a6a28f15d70e5a77bf881c5ec5340d.svg "掘友等级")](/user/976022057527342)  

4月前

我也写了一个  
type isEqual<A, B> = \[A, B\] extends \[B, A\] ? true : false;  
  
以为可以，当时看了你提供的issue发现不行。any 很恼火（既可以做子集，又类型兼容）。  
  
type isEqual = IsEqual<any, 1>; // false 全等这样不行。  
  
你写的是通过判断子集的范围来确定是否全等，挺高明的

展开

收起

1

1

[![](https://p3-passport.byteimg.com/img/user-avatar/64fab52397b56bf99e6431a7395015a1~100x100.awebp)](/user/712139267651623)

删除

[夜尽灬天明丶](/user/712139267651623)

（作者） 3月前

对

展开

收起

点赞

回复

[![CV大法的头像](https://p3-passport.byteimg.com/img/user-avatar/22aa5969b5031f48518afab5f0b2c6e3~100x100.awebp)](/user/976022057527342)

删除

[CV大法 ![掘友等级](//lf3-cdn-tos.bytescm.com/obj/static/xitu_juejin_web/65a6a28f15d70e5a77bf881c5ec5340d.svg "掘友等级")](/user/976022057527342)  

4月前

type Or<First extends boolean, Second extends boolean> = \[First, Second\] extends \[false, false\] ? false : true;  
  
type And<First extends boolean, Second extends boolean> = \[First, Second\] extends \[true, true\] ? true : false;  
  
  
这样回更好点

展开

收起

点赞

1

[![](https://p3-passport.byteimg.com/img/user-avatar/64fab52397b56bf99e6431a7395015a1~100x100.awebp)](/user/712139267651623)

删除

[夜尽灬天明丶](/user/712139267651623)

（作者） 3月前

可以可以不错

展开

收起

点赞

回复

[![写写代码_就很棒的头像](https://p3-passport.byteimg.com/img/user-avatar/b3a709bc7b610c810f6ca55743ae60b3~100x100.awebp)](/user/553809589830942)

删除

[写写代码\_就很棒 ![掘友等级](//lf3-cdn-tos.bytescm.com/obj/static/xitu_juejin_web/9b2f31c663d17de59dd9e5fff272bb85.svg "掘友等级")](/user/553809589830942)  

6月前

这样太强了叭![[泣不成声]](//lf3-cdn-tos.bytescm.com/obj/static/xitu_juejin_web/img/jj_emoji_40.348108b.png)大佬，可以请教一个问题吗[![](//lf3-cdn-tos.bytescm.com/obj/static/xitu_juejin_web/3f843e8626a3844c624fb596dddd9674.svg)stackoverflow.com](https://link.juejin.cn?target=https%3A%2F%2Fstackoverflow.com%2Fquestions%2F72416966%2Ffails-when-using-custom-nested-schema-constraints-to-return-value-attributes "https://stackoverflow.com/questions/72416966/fails-when-using-custom-nested-schema-constraints-to-return-value-attributes")

展开

收起

点赞

1

[![](https://p3-passport.byteimg.com/img/user-avatar/64fab52397b56bf99e6431a7395015a1~100x100.awebp)](/user/712139267651623)

删除

[夜尽灬天明丶](/user/712139267651623)

（作者） 5月前

看起来你的这个工具类型的结果不正确，没有产生正确顺序的结果，本身js表达式在函数参数中\["id", \["tags", \["name"\]\]\]被推导为更好的结果就是ToSchemaType<T>，故而U的类型是不准确的，最简单的解决方案就是传参时进行断言

展开

收起

![image](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/af454362d71b49f9900276d0c354a7d8~tplv-k3u1fbpfcp-no-mark:320:320:320:320.awebp?) 

点赞

回复

[![叶小污已被占用的头像](https://p3-passport.byteimg.com/img/mosaic-legacy/3795/3044413937~100x100.awebp)](/user/4406498333308077)

删除

[叶小污已被占用 ![lv-2](//lf3-cdn-tos.bytescm.com/obj/static/xitu_juejin_web/img/lv-2.99ba5b2.png "创作等级") ![掘友等级](//lf3-cdn-tos.bytescm.com/obj/static/xitu_juejin_web/8c6985e2aa4c06f307ae3734da4b43ac.svg "掘友等级")](/user/4406498333308077)   

6月前

简直了

展开

收起

点赞

1

[![](https://p3-passport.byteimg.com/img/user-avatar/64fab52397b56bf99e6431a7395015a1~100x100.awebp)](/user/712139267651623)

删除

[夜尽灬天明丶](/user/712139267651623)

（作者） 6月前

学废了吗![[奸笑]](//lf3-cdn-tos.bytescm.com/obj/static/xitu_juejin_web/img/jj_emoji_17.bcebf79.png)

展开

收起

点赞

回复

[![young_ren的头像](https://p3-passport.byteimg.com/img/mosaic-legacy/3795/3047680722~100x100.awebp)](/user/545810822994158)

删除

[young\_ren ![掘友等级](//lf3-cdn-tos.bytescm.com/obj/static/xitu_juejin_web/65a6a28f15d70e5a77bf881c5ec5340d.svg "掘友等级")](/user/545810822994158)  

7月前

一句话（告辞）

展开

收起

点赞

1

[![](https://p3-passport.byteimg.com/img/user-avatar/64fab52397b56bf99e6431a7395015a1~100x100.awebp)](/user/712139267651623)

删除

[夜尽灬天明丶](/user/712139267651623)

（作者） 7月前

好好学习天天向上

展开

收起

点赞

回复

[![doota的头像](https://p3-passport.byteimg.com/img/mosaic-legacy/3795/3044413937~100x100.awebp)](/user/1099976172912157)

删除

[doota ![掘友等级](//lf3-cdn-tos.bytescm.com/obj/static/xitu_juejin_web/8c6985e2aa4c06f307ae3734da4b43ac.svg "掘友等级")](/user/1099976172912157)  

7月前

不管你晕不晕 反正我是晕了![[我想静静]](//lf3-cdn-tos.bytescm.com/obj/static/xitu_juejin_web/img/jj_emoji_74.d954f2d.png)

展开

收起

点赞

1

[![](https://p3-passport.byteimg.com/img/user-avatar/64fab52397b56bf99e6431a7395015a1~100x100.awebp)](/user/712139267651623)

删除

[夜尽灬天明丶](/user/712139267651623)

（作者） 7月前

加油，你可以

展开

收起

点赞

回复

查看全部 117 条回复

![](//lf3-cdn-tos.bytescm.com/obj/static/xitu_juejin_web/00ba359ecd0075e59ffbc3d810af551d.svg) 639

![](//lf3-cdn-tos.bytescm.com/obj/static/xitu_juejin_web/336af4d1fafabcca3b770c8ad7a50781.svg) 117

![](//lf3-cdn-tos.bytescm.com/obj/static/xitu_juejin_web/e371749f308e0d99430a6a4943eef946.svg) 已收藏

相关推荐

+   [
    
    chaosflutter
    
    ](/user/421822768877758)
    
    1月前
    
    [TypeScript](/tag/TypeScript) [前端](/tag/%E5%89%8D%E7%AB%AF) [JavaScript](/tag/JavaScript)
    
    [用好 TypeScript，请再深入一些](/post/7154194360232312846 "用好 TypeScript，请再深入一些")
    
    [
    
    TypeScript 已经成为前端编程语言的事实标准。但我从大量的 Code Review 和面试经历中发现，真正能深入使用 TypeScript 的开发其实并不多。如果你不知道 ReturnType
    
    ](/post/7154194360232312846)
    
    +   4862
    +   130
    +   16
    
+   [
    
    Xmo
    
    ](/user/395479918051480)
    
    1月前
    
    [Promise](/tag/Promise) [TypeScript](/tag/TypeScript) [JavaScript](/tag/JavaScript)
    
    [不用防抖和节流，用更底层的方式解决JS的重复请求](/post/7155401532303753229 "不用防抖和节流，用更底层的方式解决JS的重复请求")
    
    [
    
    \`once-init\` 为解决异步函数问题而生。它从 \`Promise\` 的定义出发，用 \`Promise\` 的基础功能彻底地阻止了异步请求浪费的发生。
    
    ](/post/7155401532303753229)
    
    +   2.6w
    +   309
    +   65
    
    ![不用防抖和节流，用更底层的方式解决JS的重复请求](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4d56b83ec95c4eab99e7d3e5653da25c~tplv-k3u1fbpfcp-no-mark:240:240:240:160.awebp?)
    
+   [
    
    小丞同学
    
    ](/user/1460594842018446)
    
    3月前
    
    [前端](/tag/%E5%89%8D%E7%AB%AF) [TypeScript](/tag/TypeScript) [JavaScript](/tag/JavaScript)
    
    [TS 类型体操还能这么玩，太秀了！](/post/7128832787846529037 "TS 类型体操还能这么玩，太秀了！")
    
    [
    
    TS 类型体操，太秀了吧，数组、递归、infer 满天飞，今天就来领略一下 TS 能做什么骚操作吧！
    
    ](/post/7128832787846529037)
    
    +   9128
    +   123
    +   17
    
    ![TS 类型体操还能这么玩，太秀了！](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f79e68706ba24f18bad3e288c56aa5a6~tplv-k3u1fbpfcp-no-mark:240:240:240:160.awebp?)
    
+   [
    
    hiisea
    
    ](/user/1992763471036712)
    
    2月前
    
    [JavaScript](/tag/JavaScript) [前端](/tag/%E5%89%8D%E7%AB%AF) [TypeScript](/tag/TypeScript)
    
    [规范你的Typescript注释，一步一步教你生成API文档](/post/7140337202097029133 "规范你的Typescript注释，一步一步教你生成API文档")
    
    [
    
    话说近年来typescript作为javascript的第二语言越来越流行，听说你是TS高手，但是你的TS注释规范吗？ 规范的TS注释不仅能说明代码意图、直接生成API文档，还能为IDE工具提供更智能
    
    ](/post/7140337202097029133)
    
    +   4985
    +   117
    +   8
    
    ![规范你的Typescript注释，一步一步教你生成API文档](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5aa4ab021eb44d9bad020e14b27a81ee~tplv-k3u1fbpfcp-no-mark:240:240:240:160.awebp?)
    
+   [
    
    \_\_花花世界
    
    ](/user/1724480211391783)
    
    1年前
    
    [前端](/tag/%E5%89%8D%E7%AB%AF) [Vue.js](/tag/Vue.js)
    
    [Vue3.0+TS+Element-plus最全面后台管理系统！](/post/7034766239192842276 "Vue3.0+TS+Element-plus最全面后台管理系统！")
    
    [
    
    附上源码地址: Vue3.0+TS+Element-plus 后台管理系统模板 vue3 版本重新编写了底层的响应式系统（reactive，ref)，于是我自定义了一套store管理
    
    ](/post/7034766239192842276)
    
    +   3.4w
    +   259
    +   83
    
+   [
    
    Angus安格斯
    
    ](/user/1151943918501767)
    
    10月前
    
    [TypeScript](/tag/TypeScript) [React.js](/tag/React.js)
    
    [React中的这个TS骚操作秀到我了](/post/7052949415350239246 "React中的这个TS骚操作秀到我了")
    
    [
    
    前言 最近在写React时定义变量类型时，无意点到了ElementType，然后在node\_modules/@types/react/index.d.ts 中发现了这段代码： 牛啊，虽然我没太看懂，但
    
    ](/post/7052949415350239246)
    
    +   1.2w
    +   276
    +   45
    
    ![React中的这个TS骚操作秀到我了](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/996efd13d5294a0b914716a9d332bd8f~tplv-k3u1fbpfcp-no-mark:240:240:240:160.awebp?)
    
+   [
    
    lin嘟嘟嘟
    
    ](/user/3913917126422743)
    
    4月前
    
    [前端](/tag/%E5%89%8D%E7%AB%AF) [TypeScript](/tag/TypeScript)
    
    [一份够用的TS常用特性总结](/post/7119300462821507103 "一份够用的TS常用特性总结")
    
    [
    
    1、常用类型 1.1 交叉类型 交叉类型就是通过 & 符号，将多个类型合并为一个类型。 1.2 联合类型 联合类型就是通过 | 符号，表示一个值可以是几种类型之一。 1.3 字面量类型 字面量类型就是
    
    ](/post/7119300462821507103)
    
    +   5713
    +   177
    +   43
    
    ![一份够用的TS常用特性总结](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7752a11a31e64d1187869b4c007be434~tplv-k3u1fbpfcp-no-mark:240:240:240:160.awebp?)
    
+   [
    
    悠哉wu
    
    ](/user/289926802309400)
    
    5月前
    
    [前端](/tag/%E5%89%8D%E7%AB%AF) [Vue.js](/tag/Vue.js)
    
    [由于不好用，就用Vue3+Ts做了个视频网站](/post/7109775800915722277 "由于不好用，就用Vue3+Ts做了个视频网站")
    
    [
    
    由于 阿哔 近些年对动漫的删减以及改工🤡，其他动漫网站又长时间广告侵蚀（给我兄弟放天假吧，实在遭不住了🤧）。于是自己写了一个
    
    ](/post/7109775800915722277)
    
    +   1.8w
    +   184
    +   71
    
    ![由于不好用，就用Vue3+Ts做了个视频网站](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6ee896142d59476892403b100fb8b690~tplv-k3u1fbpfcp-no-mark:240:240:240:160.awebp?)
    
+   [
    
    阿宝哥
    
    ](/user/764915822103079)
    
    6月前
    
    [前端](/tag/%E5%89%8D%E7%AB%AF) [JavaScript](/tag/JavaScript) [TypeScript](/tag/TypeScript)
    
    [用了 TS 条件类型，同事直呼 YYDS！](/post/7096265620445986823 "用了 TS 条件类型，同事直呼 YYDS！")
    
    [
    
    以后看到 T extends U ? X : Y 再也不怕了。精心设计设计的动画，让你轻松掌握条件类型、分布式条件类型和 TS 内置工具类型的工作原理。
    
    ](/post/7096265620445986823)
    
    +   3.9w
    +   521
    +   36
    
    ![用了 TS 条件类型，同事直呼 YYDS！](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/20ce64fccff94b958491d4e8835c8b70~tplv-k3u1fbpfcp-no-mark:240:240:240:160.awebp?)
    
+   [
    
    杰出D
    
    ](/user/2981531265821416)
    
    1年前
    
    [前端](/tag/%E5%89%8D%E7%AB%AF) [算法](/tag/%E7%AE%97%E6%B3%95)
    
    [面试了十几个高级前端，竟然连（扁平数据结构转Tree）都写不出来](/post/6983904373508145189 "面试了十几个高级前端，竟然连（扁平数据结构转Tree）都写不出来")
    
    [
    
    「本文已参与好文召集令活动，点击查看：后端、大前端双赛道投稿，2万元奖池等你挑战！」 前言 招聘季节一般都在金三银四，或者金九银十。最近在这五六月份，陆陆续续面试了十几个高级前端。有一套考察算法的小题
    
    ](/post/6983904373508145189)
    
    +   24.3w
    +   3569
    +   1870
    
    ![面试了十几个高级前端，竟然连（扁平数据结构转Tree）都写不出来](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b9459a35f2c64193b5f85d87d9e71cc5~tplv-k3u1fbpfcp-no-mark:240:240:240:160.awebp)
    
+   [
    
    zxg\_神说要有光
    
    ](/user/2788017216685118)
    
    9月前
    
    [前端](/tag/%E5%89%8D%E7%AB%AF) [JavaScript](/tag/JavaScript) [TypeScript](/tag/TypeScript)
    
    [这几个 TypeScript 类型，90% 的人说不出原因](/post/7066745410194243597 "这几个 TypeScript 类型，90% 的人说不出原因")
    
    [
    
    有这样几个 TypeScript 类型，大家先试着猜下 res 都是啥： 第一个： 传入的类型参数为联合类型 1 | 'a'，问 res 是啥 第二个： 传入的类型参数为 boolean，问 res
    
    ](/post/7066745410194243597)
    
    +   1.2w
    +   178
    +   29
    
    ![这几个 TypeScript 类型，90% 的人说不出原因](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d48376cd32fc49158adcf9528401fa68~tplv-k3u1fbpfcp-no-mark:240:240:240:160.awebp?)
    
+   [
    
    19组清风
    
    ](/user/307518987049112)
    
    7月前
    
    [JavaScript](/tag/JavaScript) [TypeScript](/tag/TypeScript)
    
    [如何进阶TypeScript功底？一文带你理解TS中各种高级语法](/post/7089809919251054628 "如何进阶TypeScript功底？一文带你理解TS中各种高级语法")
    
    [
    
    「万字长文」一文带你精进TypeScript语言功底，抛开晦涩的概念结合真实案例带你掌握TS中不为人知的高级技巧。
    
    ](/post/7089809919251054628)
    
    +   5613
    +   144
    +   21
    
    ![如何进阶TypeScript功底？一文带你理解TS中各种高级语法](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c6c9d301e0a3474a92e6f775e14d2f78~tplv-k3u1fbpfcp-no-mark:240:240:240:160.awebp?)
    
+   [
    
    腾讯TNTWeb前端团队
    
    ](/user/2277843821933751)
    
    9月前
    
    [JavaScript](/tag/JavaScript) [前端](/tag/%E5%89%8D%E7%AB%AF)
    
    [你还在手写TS类型代码吗](/post/7064391251973373989 "你还在手写TS类型代码吗")
    
    [
    
    身为一个前端开发，在开发ts项目时，最繁琐的工作应该就是手写接口的数据类型和mock数据，因为这部分工作如果不做，后面写业务逻辑难受，做的话全是复制粘贴类似的重复工作，还挺费时间。下文将给大家介绍一个
    
    ](/post/7064391251973373989)
    
    +   1.6w
    +   183
    +   18
    
+   [
    
    小土狗
    
    ](/user/3667626518912040)
    
    8月前
    
    [前端](/tag/%E5%89%8D%E7%AB%AF) [Vue.js](/tag/Vue.js)
    
    [基于 VUE3+TS 开发的音乐播放器，界面模仿QQ音乐mac客户端。](/post/7074062428249522207 "基于 VUE3+TS 开发的音乐播放器，界面模仿QQ音乐mac客户端。")
    
    [
    
    基于 VUE3+TS 开发的音乐播放器，界面模仿QQ音乐mac客户端。VUE3默认版本了，搞个项目熟悉一下，以备不时之需
    
    ](/post/7074062428249522207)
    
    +   3.8w
    +   511
    +   102
    
    ![基于 VUE3+TS 开发的音乐播放器，界面模仿QQ音乐mac客户端。](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/64f71761d2b04746ad640a43706a92e4~tplv-k3u1fbpfcp-no-mark:240:240:240:160.awebp?)
    
+   [
    
    程序员依扬
    
    ](/user/3720403075993373)
    
    3年前
    
    [面试](/tag/%E9%9D%A2%E8%AF%95) [前端](/tag/%E5%89%8D%E7%AB%AF)
    
    [【1 月最新】前端 100 问：能搞懂 80% 的请把简历给我](/post/6844903885488783374 "【1 月最新】前端 100 问：能搞懂 80% 的请把简历给我")
    
    [
    
    半年时间，几千人参与，精选大厂前端面试高频 100 题，这就是「壹题」。 在 2019 年 1 月 21 日这天，「壹题」项目正式开始，在这之后每个工作日都会出一道高频面试题，主要涵盖阿里、腾讯、头条、百度、网易等大公司和常见题型。得益于大家热情参与，现在每道题都有很多答案，提…
    
    ](/post/6844903885488783374)
    
    +   59.7w
    +   10427
    +   356
    
+   [
    
    阿宝哥
    
    ](/user/764915822103079)
    
    5月前
    
    [前端](/tag/%E5%89%8D%E7%AB%AF) [TypeScript](/tag/TypeScript) [JavaScript](/tag/JavaScript)
    
    [用了模板字面量类型，同事直呼太强了！](/post/7106647263321325605 "用了模板字面量类型，同事直呼太强了！")
    
    [
    
    模板字面量类型减少重复代码的利器，结合条件类型、映射类型和infer类型推断，你就能写出功能强大的工具类型，轻松应对工作中场景！
    
    ](/post/7106647263321325605)
    
    +   5686
    +   71
    +   7
    
    ![用了模板字面量类型，同事直呼太强了！](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/bc2ea90efbb3441382833581dba44be5~tplv-k3u1fbpfcp-no-mark:240:240:240:160.awebp?)
    
+   [
    
    Jioho
    
    ](/user/571401778764206)
    
    4月前
    
    [TypeScript](/tag/TypeScript) [JavaScript](/tag/JavaScript)
    
    [成为优秀的TS体操高手 之 TS 类型体操前置知识储备](/post/7115789691810480135 "成为优秀的TS体操高手 之 TS 类型体操前置知识储备")
    
    [
    
    如果你正在学习 TS，可是像我一样仅仅停留在定义类型，定义 / 的层面的话， 这份体操类型练习题一定不要错过 ！ 让我们一起学习TS类型体操的各种姿势
    
    ](/post/7115789691810480135)
    
    +   3345
    +   59
    +   20
    
+   [
    
    vben
    
    ](/user/430664289098055)
    
    2年前
    
    [Vue.js](/tag/Vue.js)
    
    [🎉🎉🎉 一个基于vue3+vite+ts的完整项目](/post/6881795051492474893 " 🎉🎉🎉 一个基于vue3+vite+ts的完整项目")
    
    [
    
    vue-vben-admin-2.0 是一个全新的开源系统,基于ant-design-vue2.x,typescript4,vue3,vite实现的 vue3 风格的后台管理系统。 yarn > npm > cnpm: - 包管理工具. Ant Design Vue Icon …
    
    ](/post/6881795051492474893)
    
    +   6.9w
    +   1430
    +   186
    
+   [
    
    一碗周
    
    ](/user/3350967174838701)
    
    8月前
    
    [axios](/tag/axios) [TypeScript](/tag/TypeScript)
    
    [在项目中用ts封装axios，一次封装整个团队受益😁](/post/7071518211392405541 "在项目中用ts封装axios，一次封装整个团队受益😁")
    
    [
    
    这篇文章封装的axios已经满足如下功能： 无处不在的代码提示； 灵活的拦截器； 可以创建多个实例，灵活根据项目进行调整； 每个实例，或者说每个接口都可以灵活配置请求头、超时时间等。
    
    ](/post/7071518211392405541)
    
    +   9.2w
    +   1386
    +   254
    
    ![在项目中用ts封装axios，一次封装整个团队受益😁](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b605e88d5ef940df9293ab6d73535bc9~tplv-k3u1fbpfcp-no-mark:240:240:240:160.awebp?)
    
+   [
    
    阿宝哥
    
    ](/user/764915822103079)
    
    1年前
    
    [前端](/tag/%E5%89%8D%E7%AB%AF) [JavaScript](/tag/JavaScript) [TypeScript](/tag/TypeScript)
    
    [这 30 道 TS 练习题，你能答对几道？](/post/7009046640308781063 "这 30 道 TS 练习题，你能答对几道？")
    
    [
    
    这 30 道 TS 练习题，你能答对几道？学过 TS 的小伙伴，赶紧来做几道题热热身，巩固一下所学的 TS 知识。
    
    ](/post/7009046640308781063)
    
    +   3.9w
    +   741
    +   56
    
    ![这 30 道 TS 练习题，你能答对几道？](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/fdaad2f018314639a50e21879419494f~tplv-k3u1fbpfcp-no-mark:240:240:240:160.awebp?)
    

友情链接：

+   [标致3008 PHEV(进口)](https://www.dongchedi.com/auto/series/3647 "标致3008 PHEV(进口)")
+   [标致408 GT](https://www.dongchedi.com/auto/series/3648 "标致408 GT")
+   [标致608](https://www.dongchedi.com/auto/series/3649 "标致608")
+   [弗那萨利 99](https://www.dongchedi.com/auto/series/3650 "弗那萨利 99")
+   [妆前隔离霜怎么用](https://www.douyin.com/zhuanti/7146511650261239816 "妆前隔离霜怎么用")
+   [order是什么意思](https://www.douyin.com/zhuanti/7146511650261256200 "order是什么意思")
+   [制作小程序的方法如何自己制作小程序](https://www.douyin.com/zhuanti/7146511648050841631 "制作小程序的方法如何自己制作小程序")
+   [return的过去式怎么读](https://www.douyin.com/zhuanti/7146511648050726943 "return的过去式怎么读")
+   [电脑麒麟系统好用吗怎么样](https://www.douyin.com/zhuanti/7146511650261141512 "电脑麒麟系统好用吗怎么样")
+   [python字符串常用的五种方法](https://www.douyin.com/zhuanti/7146511648050743327 "python字符串常用的五种方法")

[![](https://p3-passport.byteimg.com/img/user-avatar/64fab52397b56bf99e6431a7395015a1~100x100.awebp)](/user/712139267651623)

[](/user/712139267651623)[夜尽灬天明丶 ![lv-4](//lf3-cdn-tos.bytescm.com/obj/static/xitu_juejin_web/img/lv-4.a78c420.png "创作等级")](/user/712139267651623)   

花里胡哨的前端 @ 武汉

关注[

私信

](/notification/im?participantId=712139267651623)

获得点赞  1,487

文章被阅读  71,258

[](/user/center/signin?from=item)

![](//lf3-cdn-tos.bytescm.com/obj/static/xitu_juejin_web/img/default.640d9a7.png)

相关文章

[

TS入门笔记1——TS的类型声明

24点赞

 · 

6评论



](/post/6880488222451826696 "TS入门笔记1——TS的类型声明")[

Vue3+TS，写一个逼格满满的项目

263点赞

 · 

47评论



](/post/6896748218076364814 "Vue3+TS，写一个逼格满满的项目")[

你还在手写TS类型代码吗

183点赞

 · 

18评论



](/post/7064391251973373989 "你还在手写TS类型代码吗")[

TypeScript进阶, 如何避免 any

28点赞

 · 

0评论



](/post/6961985123923263525 "TypeScript进阶, 如何避免 any")[

成为优秀的TS体操高手 之 TS 类型体操前置知识储备

59点赞

 · 

20评论



](/post/7115789691810480135 "成为优秀的TS体操高手 之 TS 类型体操前置知识储备")

目录

+   [TS 类型体操基本原理](#heading-0 "TS 类型体操基本原理")
    
    +   [if 和 else](#heading-1 "if 和 else")
        
    +   [模式匹配](#heading-2 "模式匹配")
        
    +   [与或非](#heading-3 "与或非")
        
    +   [判断相等](#heading-4 "判断相等")
        
    +   [toString](#heading-5 "toString")
        
    +   [循环](#heading-6 "循环")
        
    +   [基本的数学运算](#heading-7 "基本的数学运算")
        
        +   [判断正负](#heading-8 "判断正负")
            
        +   [两数相加](#heading-9 "两数相加")
            
        +   [比较大小](#heading-10 "比较大小")
            
        +   [两数相减](#heading-11 "两数相减")
            
+   [参考 js 封装工具类型](#heading-12 "参考 js 封装工具类型")
    
    +   [封装 string 工具类型](#heading-13 "封装 string 工具类型")
        
        +   [Stringify - 将类型字符串化](#heading-14 "Stringify - 将类型字符串化")
            
        +   [GetChars - 获取字符](#heading-15 "GetChars - 获取字符")
            
        +   [Split - 分割字符串](#heading-16 "Split - 分割字符串")
            
        +   [GetStringLength - 获取字符串长度](#heading-17 "GetStringLength - 获取字符串长度")
            
        +   [CharAt - 获取字符串在索引位 I 下的 字符](#heading-18 "CharAt - 获取字符串在索引位 I 下的 字符")
            
        +   [Concat - 拼接两个字符串](#heading-19 "Concat - 拼接两个字符串")
            
        +   [Includes - 判断字符串是否包含子串](#heading-20 "Includes - 判断字符串是否包含子串")
            
        +   [StartsWith - 判断字符串是否以子串为起始](#heading-21 "StartsWith - 判断字符串是否以子串为起始")
            
        +   [EndsWith - 判断字符串是否以子串为结束](#heading-22 "EndsWith - 判断字符串是否以子串为结束")
            
        +   [IndexOf - 从左往右查找子串的位置](#heading-23 "IndexOf - 从左往右查找子串的位置")
            
        +   [LastIndexOf - 从右往左查找子串的位置](#heading-24 "LastIndexOf - 从右往左查找子串的位置")
            
        +   [Replace - 在字符串中查找并替换一处子串](#heading-25 "Replace - 在字符串中查找并替换一处子串")
            
        +   [ReplaceAll - 在字符串中查找并替换所有子串](#heading-26 "ReplaceAll - 在字符串中查找并替换所有子串")
            
        +   [Repeat - 重复 Times 次数的字符串](#heading-27 "Repeat - 重复 Times 次数的字符串")
            
        +   [PadStart - 在字符串前面填充](#heading-28 "PadStart - 在字符串前面填充")
            
        +   [PadEnd - 在字符串后面填充](#heading-29 "PadEnd - 在字符串后面填充")
            
        +   [TrimLeft - 去掉字符串前面的空格](#heading-30 "TrimLeft - 去掉字符串前面的空格")
            
        +   [TrimRight - 去掉字符串后面的空格](#heading-31 "TrimRight - 去掉字符串后面的空格")
            
        +   [Trim - 去掉字符串的空格](#heading-32 "Trim - 去掉字符串的空格")
            
        +   [ToUpperCase - 字符串转大写](#heading-33 "ToUpperCase - 字符串转大写")
            
        +   [ToLowerCase - 字符串转小写](#heading-34 "ToLowerCase - 字符串转小写")
            
        +   [SubString - 截取 start（包括）到 end（不包括）之间的字符串](#heading-35 "SubString - 截取 start（包括）到 end（不包括）之间的字符串")
            
        +   [SubStr - 在字符串中抽取从开始下标到结束下标的字符](#heading-36 "SubStr - 在字符串中抽取从开始下标到结束下标的字符")
            
    +   [封装 array 工具类型](#heading-37 "封装 array 工具类型")
        
        +   [GetTuple - 构造指定长度的元组](#heading-38 "GetTuple - 构造指定长度的元组")
            
        +   [ArraySet - 更改元组中指定索引位的类型](#heading-39 "ArraySet - 更改元组中指定索引位的类型")
            
        +   [TupleToUnion - 从元（数）组类型构造联合类型](#heading-40 "TupleToUnion - 从元（数）组类型构造联合类型")
            
        +   [Pop - 去除元组类型的最后一位](#heading-41 "Pop - 去除元组类型的最后一位")
            
        +   [Shift - 去除元组类型的第一位](#heading-42 "Shift - 去除元组类型的第一位")
            
        +   [UnShift - 在元组前面插入一位](#heading-43 "UnShift - 在元组前面插入一位")
            
        +   [Push - 在元组后面插入一位](#heading-44 "Push - 在元组后面插入一位")
            
        +   [Concat - 合并两个元组类型](#heading-45 "Concat - 合并两个元组类型")
            
        +   [Join - 将元组类型拼接成字符串类型](#heading-46 "Join - 将元组类型拼接成字符串类型")
            
        +   [Every - 校验元组中每个类型是否都符合条件](#heading-47 "Every - 校验元组中每个类型是否都符合条件")
            
        +   [Some - 校验元组中是否有类型符合条件](#heading-48 "Some - 校验元组中是否有类型符合条件")
            
        +   [Fill - 以指定类型填充元组类型](#heading-49 "Fill - 以指定类型填充元组类型")
            
        +   [Filter - 过滤出元组类型中符合条件的类型](#heading-50 "Filter - 过滤出元组类型中符合条件的类型")
            
        +   [MapWidthIndex - 将元组类型映射为带索引的元组类型](#heading-51 "MapWidthIndex - 将元组类型映射为带索引的元组类型")
            
        +   [Find - 找到元组类型中第一个符合条件的类型](#heading-52 "Find - 找到元组类型中第一个符合条件的类型")
            
        +   [Reverse - 反转元组](#heading-53 "Reverse - 反转元组")
            
        +   [FindLast - 找到元组类型中最后一个符合条件的类型](#heading-54 "FindLast - 找到元组类型中最后一个符合条件的类型")
            
        +   [FindIndex - 找到元组类型中第一个符合条件的类型的索引](#heading-55 "FindIndex - 找到元组类型中第一个符合条件的类型的索引")
            
        +   [FindLastIndex - 找到元组类型中最后一个符合条件的类型的索引](#heading-56 "FindLastIndex - 找到元组类型中最后一个符合条件的类型的索引")
            
        +   [Flat - 扁平化元组](#heading-57 "Flat - 扁平化元组")
            
        +   [Includes - 元组类型中是否存在一个符合条件的类型](#heading-58 "Includes - 元组类型中是否存在一个符合条件的类型")
            
        +   [Slice - 提取元组类型中指定起始位置到指定结束位置的类型构造新元组类型](#heading-59 "Slice - 提取元组类型中指定起始位置到指定结束位置的类型构造新元组类型")
            
        +   [Sort - 排序](#heading-60 "Sort - 排序")
            
    +   [封装 number 工具类型](#heading-61 "封装 number 工具类型")
        
        +   [IsZero - 判断类型为 0](#heading-62 "IsZero - 判断类型为 0")
            
        +   [IsOverZero - 是否大于 0](#heading-63 "IsOverZero - 是否大于 0")
            
        +   [IsLessZero - 是否小于 0](#heading-64 "IsLessZero - 是否小于 0")
            
        +   [IsFloat - 是否为浮点型](#heading-65 "IsFloat - 是否为浮点型")
            
        +   [IsInt - 是否为整型](#heading-66 "IsInt - 是否为整型")
            
        +   [IsEqual - 数字类型是否相等](#heading-67 "IsEqual - 数字类型是否相等")
            
        +   [IsNotEqual - 数字类型是否不相等](#heading-68 "IsNotEqual - 数字类型是否不相等")
            
        +   [IntAddSingle - 整数相加](#heading-69 "IntAddSingle - 整数相加")
            
        +   [Compare - 比较大小](#heading-70 "Compare - 比较大小")
            
        +   [IntMinusSingleAbs - 两数相减](#heading-71 "IntMinusSingleAbs - 两数相减")
            
        +   [GetHalf - 获取当前数字类型的一半](#heading-72 "GetHalf - 获取当前数字类型的一半")
            
        +   [ToNumber - 字符串类型转数字类型](#heading-73 "ToNumber - 字符串类型转数字类型")
            
        +   [Add - 数字相加](#heading-74 "Add - 数字相加")
            
    +   [封装 object 工具类型](#heading-75 "封装 object 工具类型")
        
        +   [KeysToUnion - 对象类型的所有键转联合类型](#heading-76 "KeysToUnion - 对象类型的所有键转联合类型")
            
        +   [Values - 获取对象类型的值构成的联合类型](#heading-77 "Values - 获取对象类型的值构成的联合类型")
            
        +   [KeysToTuple - 获取对象类型键够成的元组类型](#heading-78 "KeysToTuple - 获取对象类型键够成的元组类型")
            
        +   [ExtractValues - 过滤出符合类型 V 的属性](#heading-79 "ExtractValues - 过滤出符合类型 V 的属性")
            
        +   [ExcludeValues - 过滤出不符合类型 V 的属性](#heading-80 "ExcludeValues - 过滤出不符合类型 V 的属性")
            
        +   [GetterSetterPrefix - 向对象类型中添加 get 和 set 前缀](#heading-81 "GetterSetterPrefix - 向对象类型中添加 get 和 set 前缀")
            
        +   [Proxify - 将对象类型的每个属性值转为 get 和 set 形式](#heading-82 "Proxify - 将对象类型的每个属性值转为 get 和 set 形式")
            
        +   [NullableValue - 将对象类型的每个属性值转为可为空的](#heading-83 "NullableValue - 将对象类型的每个属性值转为可为空的")
            
        +   [Include - 提取出符合类型 U 的键名构造新的对象类型](#heading-84 "Include - 提取出符合类型 U 的键名构造新的对象类型")
            
        +   [ChangeRecordType - 将对象类型的属性值填充为类型 T](#heading-85 "ChangeRecordType - 将对象类型的属性值填充为类型 T")
            
        +   [Mutable - 变为可写类型](#heading-86 "Mutable - 变为可写类型")
            
        +   [ReadonlyPartial - 变为只读且可选的](#heading-87 "ReadonlyPartial - 变为只读且可选的")
            
        +   [DeepPartial - 将对象类型的所有属性转为可选](#heading-88 "DeepPartial - 将对象类型的所有属性转为可选")
            
        +   [ChainedAccessUnion - 查找对象类型的所有路径](#heading-89 "ChainedAccessUnion - 查找对象类型的所有路径")
            
    +   [封装 common 工具类型](#heading-90 "封装 common 工具类型")
        
        +   [Not - 非](#heading-91 "Not - 非")
            
        +   [And - 与](#heading-92 "And - 与")
            
        +   [Or - 或](#heading-93 "Or - 或")
            
        +   [CheckLeftIsExtendsRight - 约束校验](#heading-94 "CheckLeftIsExtendsRight - 约束校验")
            
        +   [IsEqual - 类型严格相等](#heading-95 "IsEqual - 类型严格相等")
            
        +   [IsAny - 类型是否为 any](#heading-96 "IsAny - 类型是否为 any")
            
        +   [Diff - 差异](#heading-97 "Diff - 差异")
            
        +   [SumAggregate - 并集](#heading-98 "SumAggregate - 并集")
            
        +   [Nullable - 可为空](#heading-99 "Nullable - 可为空")
            
    +   [封装 function 工具类型](#heading-100 "封装 function 工具类型")
        
        +   [Noop - 普通函数类型](#heading-101 "Noop - 普通函数类型")
            
        +   [GetAsyncFunctionReturnType - 获取异步函数返回值](#heading-102 "GetAsyncFunctionReturnType - 获取异步函数返回值")
            
        +   [GetFunctionLength - 获取参数长度](#heading-103 "GetFunctionLength - 获取参数长度")
            
+   [实现一个加法器！](#heading-104 "实现一个加法器！")
    
    +   [分析](#heading-105 "分析")
        
    +   [实现](#heading-106 "实现")
        
        +   [什么是一个形如数字的字符串类型](#heading-107 "什么是一个形如数字的字符串类型")
            
        +   [定义加法表](#heading-108 "定义加法表")
            
        +   [数据处理](#heading-109 "数据处理")
            
        +   [开始计算](#heading-110 "开始计算")
            
        +   [拼接结果](#heading-111 "拼接结果")
            
    +   [最终代码](#heading-112 "最终代码")
        

下一篇

* * *

[15 个提高开发效率的 TypeScript 小技巧](/post/6972357401504645128 "15 个提高开发效率的 TypeScript 小技巧")

收藏成功！

已添加到「」， 点击更改

+   微信
    
     微信扫码分享
    
+   新浪微博
+   QQ

沉浸阅读
