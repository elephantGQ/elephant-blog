---
title: 双指针算法与应用
date: 2021-09-30 07:46:28
tags:
 - 双指针
categories:
 -  算法
sidebar: auto
publish: true
---

其实我开始是只想分享字符串回文相关内容的，看着看着发现了左右指针算法，看着看着又发现了快慢指针算法。这两天我(╯‵□′)╯︵┻━┻   ，今天分享给哥哥们双指针算法。

---

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/29270095b21140b2b279c29cb2079c26~tplv-k3u1fbpfcp-watermark.image)
开淦！！！

---

## 一、快慢指针
快慢指针一般都初始化指向链表的头结点 head，前进时快指针 fast 在前，慢指针 slow 在后，巧妙解决一些链表中的问题。

### 1.判断链表是否有环
单链表的特点是每个节点只知道下一个节点，所以一个指针的话无法判断链表中是否含有环的。
单链表中不含环，那么指针最终会遇到空指针 null 表示链表到头了。

```js
boolean hasCycle(ListNode head) {
    while (head != null)
        head = head.next;
    return false;
}
```
若是单链表会得到一个false值，若是一个有环的链表一直在while中进入死循环，因为环形链表中没有 null 指针作为尾部节点。

所以判断链表中是否有环的经典方法是使用两个指针，一个跑得快，一个跑得慢。如果不含有环，跑得快的那个指针最终会遇到 null，说明链表不含环；如果含有环，快指针最终会超慢指针一圈，和慢指针相遇，说明链表含有环。

```js
boolean hasCycle(ListNode head) {
    ListNode fast, slow;
    fast = slow = head;
    while (fast != null && fast.next != null) {
        fast = fast.next.next;
        slow = slow.next;
        
        if (fast == slow) return true;
    }
    return false;
}

```
若是单链表会得到一个false值，若是一个有环的链表会得到一个true值。

---
### 2.含环链表，得到环起始位置

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e091277b5b644e2da45b9fb2064b0bb7~tplv-k3u1fbpfcp-watermark.image)

这个问题一点都不困难，有点类似脑筋急转弯，先直接看代码：

```js
ListNode detectCycle(ListNode head) {
    ListNode fast, slow;
    fast = slow = head;
    while (fast != null && fast.next != null) {
        fast = fast.next.next;
        slow = slow.next;
        if (fast == slow) break;
    }
    // 上面的代码类似 hasCycle 函数
    if (fast == null || fast.next == null) {
        // fast 遇到空指针说明没有环
        return null;
    }

    slow = head;
    while (slow != fast) {
        fast = fast.next;
        slow = slow.next;
    }
    return slow;
}
```
可以看到，当快慢指针相遇时，让其中任一个指针指向头节点，然后让它俩以相同速度前进，再次相遇时所在的节点位置就是环开始的位置。这是为什么呢？

第一次相遇时，假设慢指针 slow 走了 k 步，那么快指针 fast 一定走了 2k 步，也就是说比 slow 多走了 k 步（也就是环的长度）。

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ff23da03a170499c891393abe94db88e~tplv-k3u1fbpfcp-watermark.image)

设相遇点距环的起点的距离为 m，那么环的起点距头结点 head 的距离为 k - m，也就是说如果从 head 前进 k - m 步就能到达环起点。

巧的是，如果从相遇点继续前进 k - m 步，也恰好到达环起点。


![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/46115f1535c945b3bff1e082d55a84ca~tplv-k3u1fbpfcp-watermark.image)

我甚至觉得这是一道物理题

---
### 3.寻找链表中点
类似上面的思路，我们还可以让快指针一次前进两步，慢指针一次前进一步，当快指针到达链表尽头时，慢指针就处于链表的中间位置。

```js
ListNode findMid(ListNode head) {
    ListNode fast, slow;
    fast = slow = head;
    while (fast != null && fast.next != null) {
        fast = fast.next.next;
        slow = slow.next;
    }
    // slow 就在中间位置
    return slow;
}

```
当链表的长度是奇数时，slow 恰巧停在中点位置；如果长度是偶数，slow 最终的位置是中间偏右：


![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/69c73eccd86a4f4f928f998c4145f06a~tplv-k3u1fbpfcp-watermark.image)

寻找链表中点的一个重要作用是对链表进行归并排序。

回想数组的归并排序：求中点索引递归地把数组二分，最后合并两个有序数组。对于链表，合并两个有序链表是很简单的，难点就在于二分。

但是现在你学会了找到链表的中点，就能实现链表的二分了。关于归并排序的具体内容本文就不具体展开了。

---

### 4. 寻找链表的倒数第 k 个元素

我们的思路还是使用快慢指针，让快指针先走 k 步，然后快慢指针开始同速前进。这样当快指针走到链表末尾 null 时，慢指针所在的位置就是倒数第 k 个链表节点（为了简化，假设 k 不会超过链表长度）：

```js
ListNode backwardK(ListNode head) {
    ListNode slow, fast;
    slow = fast = head;
    while (k-- > 0) 
        fast = fast.next;

    while (fast != null) {
        slow = slow.next;
        fast = fast.next;
    }
    return slow;
}
```

---
## 二、左右指针

左右指针在数组中实际是指两个索引值，一般初始化为 left = 0, right = nums.length - 1 。

### 1.二分查找

这里只写最简单的二分算法，旨在突出它的双指针特性：
```js
int binarySearch(int[] nums, int target) {
    int left = 0; 
    int right = nums.length - 1;
    while(left <= right) {
        int mid = (right + left) / 2;
        if(nums[mid] == target)
            return mid; 
        else if (nums[mid] < target)
            left = mid + 1; 
        else if (nums[mid] > target)
            right = mid - 1;
    }
    return -1;
}

```
---
### 2.两数之和

关门上easy！ <a href="https://leetcode-cn.com/problems/two-sum/">两数之和</a>

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2bc737a5710e41bba6b2d44a93e22486~tplv-k3u1fbpfcp-watermark.image)

只要数组有序，就应该想到双指针技巧。这道题的解法有点类似二分查找，通过调节 left 和 right 可以调整 sum 的大小：

```js
int[] twoSum(int[] nums, int target) {
    int left = 0, right = nums.length - 1;
    while (left < right) {
        int sum = nums[left] + nums[right];
        if (sum == target) {
            // 题目要求的索引是从 1 开始的
            return new int[]{left + 1, right + 1};
        } else if (sum < target) {
            left++; // 让 sum 大一点
        } else if (sum > target) {
            right--; // 让 sum 小一点
        }
    }
    return new int[]{-1, -1};
}
```
---
### 3.反转数组
```js
void reverse(int[] nums) {
    int left = 0;
    int right = nums.length - 1;
    while (left < right) {
        // swap(nums[left], nums[right])
        int temp = nums[left];
        nums[left] = nums[right];
        nums[right] = temp;
        left++; right--;
    }
}
```
---
### 4.寻找最长回文子串（面试高频题！！！）

关门上middle！ <a href="https://leetcode-cn.com/problems/longest-palindromic-substring/">最长回文子串</a>

回文是什么？
-- 回文串就是正着读和反着读都一样的字符串。
比如说字符串 aba 和 abba 都是回文串，因为它们对称，反过来还是和本身一样。反之，字符串 abac 就不是回文串。

可以看到回文串的的长度可能是奇数，也可能是偶数，这就添加了回文串问题的难度，解决该类问题的核心是双指针。下面就通过一道最长回文子串的问题来具体理解一下回文串问题：

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f05f0d6a1df94f77afb8c1dd76221cec~tplv-k3u1fbpfcp-watermark.image)

---

**思考** 

对于这个问题，我们首先应该思考的是，给一个字符串 s，如何在 s 中找到一个回文子串？

有一个很有趣的思路：既然回文串是一个正着反着读都一样的字符串，那么如果我们把 s 反转，称为 s'，然后在 s 和 s' 中寻找最长公共子串，这样应该就能找到最长回文子串。

比如说字符串 abacd，反过来是 dcaba，它的最长公共子串是 aba，也就是最长回文子串。
但是这个思路是错误的，比如说字符串 aacxycaa，反转之后是 aacyxcaa，最长公共子串是 aac，但是最长回文子串应该是 aa。
虽然这个思路不正确，但是这种把问题转化为其他形式的思考方式是非常值得提倡的。

下面，就来说一下正确的思路，如何使用双指针。

寻找回文串的问题核心思想是：从中间开始向两边扩散来判断回文串。对于最长回文子串，就是这个意思：

```js
// 找到以 s[i] 为中心的回文串
for 0 <= i < len(s):
```
但是呢，我们刚才也说了，回文串的长度可能是奇数也可能是偶数，如果是 abba这种情况，没有一个中心字符，上面的算法就没辙了。所以我们可以修改一下：
```js
// 找到以 s[i] 和 s[i+1] 为中心的回文串
for 0 <= i < len(s):
```

**代码实现**

按照上面的思路，先要实现一个函数来寻找最长回文串，这个函数是有点技巧的：
```js
string palindrome(string& s, int l, int r) {
    // 防止索引越界
    while (l >= 0 && r < s.size()
            && s[l] == s[r]) {
        // 向两边展开
        l--; r++;
    }
    // 返回以 s[l] 和 s[r] 为中心的最长回文串
    return s.substr(l + 1, r - l - 1);
}
```
为什么要传入两个指针 l 和 r 呢？因为这样实现可以同时处理回文串长度为奇数和偶数的情况：
```js
for 0 <= i < len(s):
    # 找到以 s[i] 为中心的回文串
    palindrome(s, i, i)
    # 找到以 s[i] 和 s[i+1] 为中心的回文串
    palindrome(s, i, i + 1)
```
下面看下 longestPalindrome 的完整代码：

```js
string longestPalindrome(string s) {
    string res;
    for (int i = 0; i < s.size(); i++) {
        // 以 s[i] 为中心的最长回文子串
        string s1 = palindrome(s, i, i);
        // 以 s[i] 和 s[i+1] 为中心的最长回文子串
        string s2 = palindrome(s, i, i + 1);
        // res = longest(res, s1, s2)
        res = res.size() > s1.size() ? res : s1;
        res = res.size() > s2.size() ? res : s2;
    }
    return res;
}
```
至此，这道最长回文子串的问题就解决了，时间复杂度 O(N^2)，空间复杂度 O(1)。

---
转载自 
1. <a href="https://github.com/labuladong/fucking-algorithm/blob/master/%E7%AE%97%E6%B3%95%E6%80%9D%E7%BB%B4%E7%B3%BB%E5%88%97/%E5%8F%8C%E6%8C%87%E9%92%88%E6%8A%80%E5%B7%A7.md">labuladong fucking-algorithm 双指针技巧</a>  
 
2. <a href="https://github.com/labuladong/fucking-algorithm/blob/master/%E9%AB%98%E9%A2%91%E9%9D%A2%E8%AF%95%E7%B3%BB%E5%88%97/%E6%9C%80%E9%95%BF%E5%9B%9E%E6%96%87%E5%AD%90%E4%B8%B2.md">寻找最长回文子串</a>

【侵删】

---

从零开始学算法，他娘的，太难了！！！

我是洋洋李，一个前端搬砖小弟

一万年太久，只争朝夕，下次见

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f768074415b24e35b959c8cd57e6f33f~tplv-k3u1fbpfcp-watermark.image)
