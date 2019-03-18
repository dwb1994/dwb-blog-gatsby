---
title: scroll事件及页面渲染优化
date: 2016-06-10
tags: [性能优化]
photos: [https://ws1.sinaimg.cn/large/006cGJIjly1g12qrxfqwfj31hc0zfngk.jpg]
type: blog

---

## 一、前言
首先感谢实习的导师 浩威兄 和这篇文章：[【前端性能】高性能滚动 scroll 及页面渲染优化](http://www.cnblogs.com/coco1s/archive/2016/05/17/5499469.html)

最近在实习的时候做了一个滚动加载文章列表的Demo，一开始感觉很简单，后来越做问题越多，其中最关键的就是scroll事件的优化，在优化过程中也强化了自己对于闭包、this、函数参数的理解，在此记录一下。

这个文章列表分为若干页，一开始加载第一页，列表有一些文章，向下滚动到尽头的时候判断scrollTop的值，进行一系列的比较，如果确实滚动到底部则再次发起ajax请求加载下一页。滚动到最后一页的时候不再判断，并且滚动加载的文字变为“无更多文章”。这里面前面的判断逻辑比较容易实现，滚动时候进行判断会出现一个效率的问题：页面滚动事件触发的频率非常高，每一次被触发都会执行一次判断，这个判断会获取DOM节点、节点高度，并且会进行判断，然后重新渲染页面，这样高的频率有可能会让页面的滚动动画变得很卡。（scroll和resize事件都会被高频率触发，resize甚至在最大化与最小化的时候也会被触发）

## 二、解决方案

经过指点，我使用了两种比较主要的方式来进行优化，第一种是“防抖技术”，利用setTimeout()的延时执行来减少滚动时实际触发的判断函数的执行次数。每一次滚动的时候首先清除计时器，然后再设置计时器，由于计时器的延时要大于scroll事件的触发频率，因此在滚动的时候并不会触发延时后执行的函数func，只在滚动后500ms执行，如果下一次滚动和上一次滚动的时间间隔小于500ms也不会触发，简言之就是500ms内没有连续触发两次 scroll 事件即可执行函数 func。代码如下：

``` javascript
// 简单的防抖动函数
function debounce(func, wait) {
    // 定时器变量
    var timeout;
    return function() {
        // 每次触发 scroll handler 时先清除定时器
        clearTimeout(timeout);
        // 指定 xx ms 后触发真正想进行的操作 handler
        timeout = setTimeout(func, wait);
    };
};

// 实际想绑定在 scroll 事件上的 handler
function realFunc(){
    console.log("Success");
}

// 采用了防抖动
window.addEventListener('scroll',debounce(realFunc,500));
```

这样做在滚动的时候不会执行判断函数，因此效率较高，但会存在一个使用逻辑的问题：如果用户滚动到底部在500ms内再滚回上面，则判断结果并不是页面底部，也就不会加载后面页面的内容。

为了解决这个问题，我们还要进一步完善JS的代码，这里用到了第二种方式优化scroll事件：“节流函数”，滚动之前获取一个时间戳，滚动时候持续获取当前时间戳，计算时间戳的差值，如果差值大于100ms则执行一次判断函数，在滚动结束时执行计时器。简言之就是在滚动的过程中每100ms执行一次判断函数。

``` javascript
// 简单的节流函数
function throttle(func, wait, mustRun) {
    var timeout,
    startTime = new Date();

    return function() {
        var context = this,
        args = arguments,
        curTime = new Date();

        clearTimeout(timeout);
        // 如果达到了规定的触发时间间隔，触发 handler
        if(curTime - startTime >= mustRun){
            func.apply(context,args);
            startTime = curTime;
            // 没达到触发间隔，重新设定定时器
        }else{
            timeout = setTimeout(function(){func.apply(that,args);},wait);
            //注意这里原文作者应该是写错了，这里计时器返回的函数也应该绑定this和arguments
        }
    };
};
// 实际想绑定在 scroll 事件上的 handler
function realFunc(){
    console.log("Success");
}
// 采用了节流函数
window.addEventListener('scroll',throttle(realFunc,500,100));
```

这样做变相地减少了滚动事件的执行频率，经过简单的控制台测试，滚动事件执行的频率最快可达到10ms每次，我们可以把这个频率减少到100ms每次。这样做也会有个问题，由于100ms执行一次判断函数，如果用户停留在页面底部的时间达不到100ms，则有一定几率不会执行判断函数。

我的解决方案是在判断页面是否到达底部的时候减少一定的高度数值，由于页面底部会出现一个提示文字“正在加载”，这个模块的高度即是我设置的缓冲高度数值。比如页面高度是1000px，视口高度是900px，“正在加载”模块高度为20px，则正常判断到底部应该是scrollTop值为900，我在判断的时候可以将900改为880，这样做当用户滚动到页面底部的时候有一定几率看不到“正在加载”模块，这也符合我们滚动加载的初衷：最好让用户看不到加载的文字，会给用户一种“页面渲染很快”的感觉。用户也有一定几率看得到“正在加载”模块，这个概率出现时间就在0~100ms之间。这样做也会有问题：如果用户在100ms内从“正在加载”模块出现到反向向上滚动出20px的范围，则有一定几率不会触发判断函数，但是这种情况出现的频率会非常小，我设置的20px的“缓冲高度”可以大大提高判断函数所应被正确执行的频率。

至此我对于scroll事件的优化结束，其实还有一些其他的优化，有兴趣的朋友可以看一下我在文章开头发的文章链接。

下面我要说一下防抖函数和节流函数本身的问题：

## 三、语法细节

### 1.闭包问题

这两个函数都用到了javascript的闭包，闭包是个比较难理解的概念，一开始我的理解也有偏差，正确的理解应该是：闭包存在两个条件：一个函数可以访问另一个函数作用域链中的变量；这个函数应该被return抛出并在其他地方被调用。如果闭包不被调用，那么在其他地方无法访问我们希望访问的函数的作用域链中的变量，则闭包的意义也就不存在了。

在编写节流函数的时候，在函数内部可以不用闭包编写，当我把节流函数提取成模块(commonJS规范)的时候就发现怎么写都无法实现功能，由于在不使用模块形式的时候我可以在外面初始化每次滚动的起始时间戳（用于在判断函数内部取差值），但是提取成模块后不可以在模块外部初始化每次滚动的起始时间戳，而我把初始化计时器的操作写在模块内部的时候，每次scroll事件触发的时候重新初始化起始时间戳无法进一步比较，则无法触发节流函数。

因此我们必须使用闭包的形式来实现这个功能，也就是说我们希望访问一个初始值，在scroll事件触发的时候不断用新的时间戳来对比这个初始值，唯一能实现的就是闭包的形式了：访问我们希望访问的函数的作用域链中的变量。由于传入scroll事件的函数被闭包return成另一个函数，但是仍然可以访问被return的闭包能够访问的另一个函数作用域链的变量（初始化的时间戳），而且只在每次滚动时初始化，再次触发scroll事件的时候不会再次初始化了，因为被返回后的函数并不会初始化时间戳。这就是我们在这里使用闭包的好处。

### 2.this指针和参数问题

在防抖和节流函数内部我们看到了这样一个做法：

``` javascript
var context = this;
var args = arguments;
```

将this和参数传入要执行的函数里，通过apply方法调用：

``` javascript
func.apply(context,args);
```

一开始我很不理解这样做的意义，后来仔细翻书终于搞懂原理：

函数被调用的时候会传进一个执行环境及相应的作用域链，当函数作为某个对象的方法调用时，this等于那个对象。由于匿名函数的执行环境具有全局性，因此其this通常指向window。但有时候不是window，这时需要我们手动绑定其上下文环境也就是this 的值和相应的参数。

在本例中防抖和节流函数的首个参数是一个我们实际执行的函数（realFunc）也就是本例中的判断函数，这个函数由于与我们的业务逻辑紧密相联（获取实际DOM节点并执行判断）因此不能被放入到模块中。模块和判断函数的上下文不同，其this和arguments也可能不同：

比如本例中闭包的this指向的是scroll事件的event.target也就是window，判断函数在全局中被声明，this也指向window。但是如果是非window的元素触发事件调用防抖和节流函数，则this会不同（闭包的this指向event.target是HTML的某个标签，或者是一个javascript对象，而闭包参数是event或者是人为设置的参数），下面的例子是传入this和arguments的情况，outer作为obj对象的方法调用，则this指向obj：

``` javascript
var obj = {};
outer(realFunc).call(obj,1,3);

function outer(func,another){

    return function(){
        var that = this;
        var arg = arguments;
        func.apply(this,arguments);
        console.log(that);                   // Object
        console.log(arguments);       // [1,3]
    }

}
function realFunc(value1,value2){
    console.log(this);                   // Object
    console.log(value1+value2);       // 4
}
```

我们稍微改下闭包返回的函数，这次不传入this和arguments，则闭包的this指向Obj而判断函数realFunc的this指向window

``` javascript
var obj = {name:'dwb'};
outer(realFunc).call(obj,1,3);

function outer(func,another){
    return function(){
        // var that = this;
        // var arg = arguments;
        // func.apply(this,arguments);
        func();
        console.log(this); // Object
        console.log(arguments); // [1,3]
    }
}

function realFunc(value1,value2){
    console.log(this); // Window
    console.log(value1+value2); // NaN
}
```

所以我们设置this和arguments是为了让我们真正希望执行的函数realFunc和我们scroll事件触发的函数上下文一致。在本例中传入的this值指向event.target也就是触发EventListener的那个HTML元素，arguments为event，也就是DOM元素的event对象，在实际执行的函数realFunc()中我们可以通过event获取事件的详细信息，比如event.type=”scroll”等等。
