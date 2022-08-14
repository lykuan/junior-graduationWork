<template>
  <div class="javascript-container">
    <div style="width: max-content; margin: 0 auto">
      <h1>javascript基础经典</h1>
    </div>

    <section style="border: 1px solid; width: 145px">
      function sayHi() { console.log(name); console.log(age); var name =
      "Lydia"; let age = 21; } sayHi();
    </section>
    <ul>
      <li>A: Lydia 和 undefined</li>
      <li>B: Lydia 和 ReferenceError</li>
      <li>C: ReferenceError 和 21</li>
      <li>D: undefined 和 ReferenceError</li>
    </ul>
    <div>
      <p>答案</p>
      <div class="container">
        答案: D 在函数中，我们首先使用var关键字声明了name变量。
        这意味着变量在创建阶段会被提升（JavaScript会在创建变量创建阶段为其分配内存空间），默认值为undefined，直到我们实际执行到使用该变量的行。
        我们还没有为name变量赋值，所以它仍然保持undefined的值。
        使用let关键字（和const）声明的变量也会存在变量提升，但与var不同，初始化没有被提升。
        在我们声明（初始化）它们之前，它们是不可访问的。 这被称为“暂时死区”。
        当我们在声明变量之前尝试访问变量时，JavaScript会抛出一个ReferenceError。
        译者注： 关于let的是否存在变量提升，我们何以用下面的例子来验证： let
        name = 'ConardLi' { console.log(name) // Uncaught ReferenceError: name
        is not defined let name = 'code秘密花园' } 复制代码
        let变量如果不存在变量提升，console.log(name)就会输出ConardLi，结果却抛出了ReferenceError，那么这很好的说明了，let也存在变量提升，但是它存在一个“暂时死区”，在变量未初始化或赋值前不允许访问。
        变量的赋值可以分为三个阶段： 创建变量，在内存中开辟空间
        初始化变量，将变量初始化为undefined 真正赋值 关于let、var和function：
        let 的「创建」过程被提升了，但是初始化没有提升。 var
        的「创建」和「初始化」都被提升了。 function
        的「创建」「初始化」和「赋值」都被提升了。
      </div>
    </div>

    <section style="border: 1px solid; width: 145px">
      {{ q1 }}
    </section>
    <ul>
      <li>A: 0 1 2 and 0 1 2</li>
      <li>0 1 2 and 3 3 3</li>
      <li>3 3 3 and 0 1 2</li>
    </ul>
    <div>
      <p>答案</p>
      <div class="container">
        答案: C
        由于JavaScript中的事件执行机制，setTimeout函数真正被执行时，循环已经走完。
        由于第一个循环中的变量i是使用var关键字声明的，因此该值是全局的。
        在循环期间，我们每次使用一元运算符++都会将i的值增加1。
        因此在第一个例子中，当调用setTimeout函数时，i已经被赋值为3。
        在第二个循环中，使用let关键字声明变量i：使用let（和const）关键字声明的变量是具有块作用域的（块是{}之间的任何东西）。
        在每次迭代期间，i将被创建为一个新值，并且每个值都会存在于循环内的块级作用域。
      </div>
    </div>

    <section style="border: 1px solid; width: 145px">
      const shape = { radius: 10, diameter() { return this.radius * 2; },
      perimeter: () => 2 * Math.PI * this.radius }; shape.diameter();
      shape.perimeter();
    </section>
    <ul>
      <li>A: 20 and 62.83185307179586</li>
      <li>B: 20 and NaN</li>
      <li>C: 20 and 63</li>
      <li>D: NaN and 63</li>
    </ul>
    <div>
      <p>答案</p>
      <div class="container">
        答案: B 请注意，diameter是普通函数，而perimeter是箭头函数。
        对于箭头函数，this关键字指向是它所在上下文（定义时的位置）的环境，与普通函数不同！
        这意味着当我们调用perimeter时，它不是指向shape对象，而是指其定义时的环境（window）。没有值radius属性，返回undefined。
      </div>
    </div>

    <section style="border: 1px solid; width: 145px">+true; !"Lydia";</section>
    <ul>
      <li>A: 1 and false</li>
      <li>B: false and NaN</li>
      <li>C: false and false</li>
    </ul>
    <div>
      <p>答案</p>
      <div class="container">
        答案: A 一元加号会尝试将boolean类型转换为数字类型。
        true被转换为1，false被转换为0。 字符串'Lydia'是一个真值。
        我们实际上要问的是“这个真值是假的吗？”。 这会返回false。。
      </div>
    </div>

    <section style="border: 1px solid; width: 145px">
      const bird = { size: "small" }; const mouse = { name: "Mickey", small:
      true };
    </section>
    <ul>
      <li>A: mouse.bird.size</li>
      <li>B: mouse[bird.size]</li>
      <li>C: mouse[bird["size"]]</li>
      <li>D: All of them are valid</li>
    </ul>
    <div>
      <p>答案</p>
      <div class="container">
        答案: A
        在JavaScript中，所有对象键都是字符串（除了Symbol）。尽管有时我们可能不会给定字符串类型，但它们总是被转换为字符串。
        JavaScript解释语句。当我们使用方括号表示法时，它会看到第一个左括号[，然后继续，直到找到右括号]。只有在那个时候，它才会对这个语句求值。
        mouse [bird.size]：首先它会对bird.size求值，得到small。 mouse
        [“small”]返回true。 但是，使用点表示法，这不会发生。
        mouse没有名为bird的键，这意味着mouse.bird是undefined。
        然后，我们使用点符号来询问size：mouse.bird.size。
        由于mouse.bird是undefined，我们实际上是在询问undefined.size。
        这是无效的，并将抛出Cannot read property "size" of undefined。
      </div>
    </div>

    <section style="border: 1px solid; width: 145px">
      let c = { greeting: "Hey!" }; let d; d = c; c.greeting = "Hello";
      console.log(d.greeting);
    </section>
    <ul>
      <li>A: Hello</li>
      <li>B: undefined</li>
      <li>C: ReferenceError</li>
      <li>D: TypeError</li>
    </ul>
    <div>
      <p>答案</p>
      <div class="container">
        答案: A
        在JavaScript中，当设置它们彼此相等时，所有对象都通过引用进行交互。
        首先，变量c为对象保存一个值。
        之后，我们将d指定为c与对象相同的引用。更改一个对象时，可以更改所有对象。
      </div>
    </div>

    <section style="border: 1px solid; width: 145px">
      let a = 3; let b = new Number(3); let c = 3; console.log(a == b);
      console.log(a === b); console.log(b === c);
    </section>
    <ul>
      <li>A: true false true</li>
      <li>B: false false true</li>
      <li>C: true false false</li>
      <li>D: false true true</li>
    </ul>
    <div>
      <p>答案</p>
      <div class="container">
        new Number（）是一个内置的函数构造函数。
        虽然它看起来像一个数字，但它并不是一个真正的数字：它有一堆额外的功能，是一个对象。
        当我们使用==运算符时，它只检查它是否具有相同的值。
        他们都有3的值，所以它返回true。
        译者注：==会引发隐式类型转换，右侧的对象类型会自动拆箱为Number类型。
        然而，当我们使用===操作符时，类型和值都需要相等，new
        Number()不是一个数字，是一个对象类型。两者都返回 false
      </div>
    </div>

    <section style="border: 1px solid; width: 145px">
      class Chameleon { static colorChange(newColor) { this.newColor = newColor;
      } constructor({ newColor = "green" } = {}) { this.newColor = newColor; } }
      const freddie = new Chameleon({ newColor: "purple" });
      freddie.colorChange("orange");
    </section>
    <ul>
      <li>A: orange</li>
      <li>B: purple</li>
      <li>C: green</li>
      <li>D: TypeError</li>
    </ul>
    <div>
      <p>答案</p>
      <div class="container">
        colorChange方法是静态的。
        静态方法仅在创建它们的构造函数中存在，并且不能传递给任何子级。
        由于freddie是一个子级对象，函数不会传递，所以在freddie实例上不存在freddie方法：抛出TypeError。
      </div>
    </div>

    <section style="border: 1px solid; width: 145px">
      let greeting; greetign = {}; // Typo! console.log(greetign);
    </section>
    <ul>
      <li>A: {}</li>
      <li>B: ReferenceError: greetign is not defined</li>
      <li>C: undefined</li>
    </ul>
    <div>
      <p>答案</p>
      <div class="container">
        控制台会输出空对象，因为我们刚刚在全局对象上创建了一个空对象！
        当我们错误地将greeting输入为greetign时，JS解释器实际上在浏览器中将其视为global.greetign
        = {}（或window.greetign = {}）。 为了避免这种情况，我们可以使用“use
        strict”。 这可以确保在将变量赋值之前必须声明变量
      </div>
    </div>

    <section style="border: 1px solid; width: 145px">
      function bark() { console.log("Woof!"); } bark.animal = "dog";
    </section>
    <ul>
      <li>A: Nothing, this is totally fine!</li>
      <li>B: SyntaxError. You cannot add properties to a function this way.</li>
      <li>C: undefined</li>
      <li>D: ReferenceError</li>
    </ul>
    <div>
      <p>答案</p>
      <div class="container">
        这在JavaScript中是可能的，因为函数也是对象！（原始类型之外的所有东西都是对象）
        函数是一种特殊类型的对象。您自己编写的代码并不是实际的函数。
        该函数是具有属性的对象，此属性是可调用的。
      </div>
    </div>

    <section style="border: 1px solid; width: 145px">
      function Person(firstName, lastName) { this.firstName = firstName;
      this.lastName = lastName; } const member = new Person("Lydia", "Hallie");
      Person.getFullName = () => this.firstName + this.lastName;
      console.log(member.getFullName());
    </section>
    <ul>
      <li>A: TypeError</li>
      <li>B: SyntaxError</li>
      <li>C: Lydia Hallie</li>
      <li>D: undefined undefined</li>
    </ul>
    <div>
      <p>答案</p>
      <div class="container">
        您不能像使用常规对象那样向构造函数添加属性。
        如果要一次向所有对象添加功能，则必须使用原型。
        所以在这种情况下应该这样写： Person.prototype.getFullName = function ()
        { return `${this.firstName} ${this.lastName}`; } 复制代码
        这样会使member.getFullName()是可用的，为什么样做是对的？
        假设我们将此方法添加到构造函数本身。
        也许不是每个Person实例都需要这种方法。这会浪费大量内存空间，因为它们仍然具有该属性，这占用了每个实例的内存空间。
        相反，如果我们只将它添加到原型中，我们只需将它放在内存中的一个位置，但它们都可以访问它！
      </div>
    </div>

    <section style="border: 1px solid; width: 145px">
      function Person(firstName, lastName) { this.firstName = firstName;
      this.lastName = lastName; } const lydia = new Person("Lydia", "Hallie");
      const sarah = Person("Sarah", "Smith"); console.log(lydia);
      console.log(sarah);
    </section>
    <ul>
      <li>A: Person {firstName: "Lydia", lastName: "Hallie"} and undefined</li>
      <li>
        B: Person {firstName: "Lydia", lastName: "Hallie"} and Person
        {firstName: "Sarah", lastName: "Smith"
      </li>
      <li>C: Person {firstName: "Lydia", lastName: "Hallie"} and {}</li>
      <li>
        D:Person {firstName: "Lydia", lastName: "Hallie"} and ReferenceError
      </li>
    </ul>
    <div>
      <p>答案</p>
      <div class="container">
        答案: A 对于sarah，我们没有使用new关键字。
        使用new时，它指的是我们创建的新空对象。
        但是，如果你不添加new它指的是全局对象！
        我们指定了this.firstName等于'Sarah和this.lastName等于Smith。
        我们实际做的是定义global.firstName ='Sarah'和global.lastName ='Smith。
        sarah本身的返回值是undefined
      </div>
    </div>

    <section style="border: 1px solid; width: 145px">
      12. 事件传播的三个阶段是什么？?
    </section>
    <ul>
      <li>A: 目标 > 捕获 > 冒泡</li>
      <li>B: 冒泡 > 目标 > 捕获</li>
      <li>C: 目标 > 冒泡 > 捕获</li>
      <li>D: 捕获 > 目标 > 冒泡</li>
    </ul>
    <div>
      <p>答案</p>
      <div class="container">
        答案: D 在捕获阶段，事件通过父元素向下传递到目标元素。
        然后它到达目标元素，冒泡开始。
      </div>
    </div>

    <section style="border: 1px solid; width: 145px">
      13. 所有对象都有原型.
    </section>
    <ul>
      <li>A: 对</li>
      <li>B: 错误</li>
    </ul>
    <div>
      <p>答案</p>
      <div class="container">
        答案: B 除基础对象外，所有对象都有原型。
        基础对象可以访问某些方法和属性，例如.toString。
        这就是您可以使用内置JavaScript方法的原因！
        所有这些方法都可以在原型上找到。
        虽然JavaScript无法直接在您的对象上找到它，但它会沿着原型链向下寻找并在那里找到它，这使您可以访问它。
        。
      </div>
    </div>

    <section style="border: 1px solid; width: 145px">
      let number = 0; console.log(number++); console.log(++number);
      console.log(number);
    </section>
    <ul>
      <li>A: 1 1 2</li>
      <li>B: 1 2 2</li>
      <li>C: 0 2 2</li>
      <li>D: 0 1 2</li>
    </ul>
    <div>
      <p>答案</p>
      <div class="container">
        答案: C 后缀一元运算符++： 返回值（返回0） 增加值（数字现在是1）
        前缀一元运算符++： 增加值（数字现在是2） 返回值（返回2） 所以返回0 2 2。
      </div>
    </div>

    <div class="sector">
      <section style="border: 1px solid; width: 145px">
        function getPersonInfo(one, two, three) { console.log(one);
        console.log(two); console.log(three); } const person = "Lydia"; const
        age = 21; getPersonInfo`${person} is ${age} years old`;
      </section>
      <ul>
        <li>A: Lydia 21 ["", "is", "years old"]</li>
        <li>B: ["", "is", "years old"] Lydia 21</li>
        <li>C: Lydia ["", "is", "years old"] 21</li>
      </ul>
      <div>
        <p>答案</p>
        <div class="container">
          答案: B
          如果使用标记的模板字符串，则第一个参数的值始终是字符串值的数组。
          其余参数获取传递到模板字符串中的表达式的值！
        </div>
      </div>
    </div>

    <div class="sector">
      <section style="border: 1px solid; width: 145px">
        function checkAge(data) { if (data === { age: 18 }) { console.log("You
        are an adult!"); } else if (data == { age: 18 }) { console.log("You are
        still an adult."); } else { console.log(`Hmm.. You don't have an age I
        guess`); } } checkAge({ age: 18 }); 。
      </section>
      <ul>
        <li>A: You are an adult!</li>
        <li>B: You are still an adult.</li>
        <li>C: Hmm.. You don't have an age I guess</li>
      </ul>
      <div>
        <p>答案</p>
        <div class="container">
          答案: C
          在比较相等性，原始类型通过它们的值进行比较，而对象通过它们的引用进行比较。JavaScript检查对象是否具有对内存中相同位置的引用。
          我们作为参数传递的对象和我们用于检查相等性的对象在内存中位于不同位置，所以它们的引用是不同的。
          这就是为什么{ age: 18 } === { age: 18 }和 { age: 18 } == { age: 18 }
          返回 false的原因。
        </div>
      </div>
    </div>

    <div class="sector">
      <section style="border: 1px solid; width: 145px">
        function getAge(...args) { console.log(typeof args); } getAge(21);
      </section>
      <ul>
        <li>A: "number"</li>
        <li>B: "array"</li>
        <li>C: "object"</li>
        <li>D: "NaN"</li>
      </ul>
      <div>
        <p>答案</p>
        <div class="container">
          答案: C 扩展运算符（... args）返回一个带参数的数组。
          数组是一个对象，因此typeof args返回object。
        </div>
      </div>
    </div>

    <div class="sector">
      <section style="border: 1px solid; width: 145px">
        function getAge() { "use strict"; age = 21; console.log(age); }
        getAge();
      </section>
      <ul>
        <li>A: 21</li>
        <li>B: undefined</li>
        <li>C: ReferenceError</li>
        <li>D: TypeError</li>
      </ul>
      <div>
        <p>答案</p>
        <div class="container">
          答案: C 使用“use strict”，可以确保不会意外地声明全局变量。
          我们从未声明变量age，因为我们使用``use
          strict'，它会引发一个ReferenceError。 如果我们不使用“use
          strict”，它就会起作用，因为属性age`会被添加到全局对象中。
        </div>
      </div>
    </div>

    <div class="sector">
      <section style="border: 1px solid; width: 145px">
        const sum = eval("10*10+5");
      </section>
      <ul>
        <li>A: 105</li>
        <li>B: "105"</li>
        <li>C: TypeError</li>
        <li>D: "10*10+5"</li>
      </ul>
      <div>
        <p>答案</p>
        <div class="container">
          eval会为字符串传递的代码求值。
          如果它是一个表达式，就像在这种情况下一样，它会计算表达式。 表达式为10
          * 10 + 5计算得到105。
        </div>
      </div>
    </div>
    <div class="sector">
      <section style="border: 1px solid; width: 145px">
        sessionStorage.setItem("cool_secret", 123);
      </section>
      <ul>
        <li>A：永远，数据不会丢失。</li>
        <li>B：用户关闭选项卡时。</li>
        <li>C：当用户关闭整个浏览器时，不仅是选项卡。</li>
        <li>D：用户关闭计算机时。</li>
      </ul>
      <div>
        <p>答案</p>
        <div class="container">
          答案: B 关闭选项卡后，将删除存储在sessionStorage中的数据。
          如果使用localStorage，数据将永远存在，除非例如调用localStorage.clear()。
        </div>
      </div>
    </div>
    <div class="sector">
      <section style="border: 1px solid; width: 145px">
        var num = 8; var num = 10; console.log(num);
      </section>
      <ul>
        <li>A: 8</li>
        <li>B: 10</li>
        <li>C: SyntaxError</li>
        <li>D: ReferenceError</li>
      </ul>
      <div>
        <p>答案</p>
        <div class="container">
          答案: B
          使用var关键字，您可以用相同的名称声明多个变量。然后变量将保存最新的值。
          您不能使用let或const来实现这一点，因为它们是块作用域的。
        </div>
      </div>
    </div>
    <div class="sector">
      <section style="border: 1px solid; width: 145px">
        const obj = { 1: "a", 2: "b", 3: "c" }; const set = new Set([1, 2, 3, 4,
        5]); obj.hasOwnProperty("1"); obj.hasOwnProperty(1); set.has("1");
        set.has(1);
      </section>
      <ul>
        <li>A: false true false true</li>
        <li>B: false true true true</li>
        <li>C: true true false true</li>
        <li>D: true true true true</li>
      </ul>
      <div>
        <p>答案</p>
        <div class="container">
          答案: C
          所有对象键（不包括Symbols）都会被存储为字符串，即使你没有给定字符串类型的键。
          这就是为什么obj.hasOwnProperty（'1'）也返回true。
          上面的说法不适用于Set。
          在我们的Set中没有“1”：set.has（'1'）返回false。
          它有数字类型1，set.has（1）返回true
        </div>
      </div>
    </div>
    <div class="sector">
      <section style="border: 1px solid; width: 145px">
        const obj = { a: "one", b: "two", a: "three" }; console.log(obj);
      </section>
      <ul>
        <li>A: { a: "one", b: "two" }</li>
        <li>B: { b: "two", a: "three" }</li>
        <li>C: { a: "three", b: "two" }</li>
        <li>D: SyntaxError</li>
      </ul>
      <div>
        <p>答案</p>
        <div class="container">
          答案: C
          如果对象有两个具有相同名称的键，则将替前面的键。它仍将处于第一个位置，但具有最后指定的值。
        </div>
      </div>
    </div>
    <div class="sector">
      <section style="border: 1px solid; width: 145px">
        26. JavaScript全局执行上下文为你创建了两个东西:全局对象和this关键字.
      </section>
      <ul>
        <li>A: 对</li>
        <li>B: 错误</li>
        <li>C: 视情况而定</li>
      </ul>
      <div>
        <p>答案</p>
        <div class="container">
          答案: A 基本执行上下文是全局执行上下文:它是代码中随处可访问的内容。
        </div>
      </div>
    </div>
    <div class="sector">
      <section style="border: 1px solid; width: 145px">
        String.prototype.giveLydiaPizza = () => { return "Just give Lydia pizza
        already!"; }; const name = "Lydia"; name.giveLydiaPizza();
      </section>
      <ul>
        <li>A: "Just give Lydia pizza already!"</li>
        <li>B: TypeError: not a function</li>
        <li>C: SyntaxError</li>
        <li>D: undefined</li>
      </ul>
      <div>
        <p>答案</p>
        <div class="container">
          答案: A String是一个内置的构造函数，我们可以为它添加属性。
          我刚给它的原型添加了一个方法。
          原始类型的字符串自动转换为字符串对象，由字符串原型函数生成。
          因此，所有字符串（字符串对象）都可以访问该方法！ 译者注：
          当使用基本类型的字符串调用giveLydiaPizza时，实际上发生了下面的过程：
          创建一个String的包装类型实例 在实例上调用substring方法 销毁实例
        </div>
      </div>
    </div>
    <div class="sector">
      <section style="border: 1px solid; width: 145px">
       const a = {};
const b = { key: "b" };
const c = { key: "c" };

a[b] = 123;
a[c] = 456;

console.log(a[b]);
      </section>
      <ul>
        <li>A: 123</li>
        <li>B: 456</li>
        <li>C: undefined</li>
        <li>D: ReferenceError</li>
      </ul>
      <div>
        <p>答案</p>
        <div class="container">
          答案: B
对象键自动转换为字符串。我们试图将一个对象设置为对象a的键，其值为123。
但是，当对象自动转换为字符串化时，它变成了[Object object]。 所以我们在这里说的是a["Object object"] = 123。 然后，我们可以尝试再次做同样的事情。 c对象同样会发生隐式类型转换。那么，a["Object object"] = 456。
然后，我们打印a[b]，它实际上是a["Object object"]。 我们将其设置为456，因此返回456

        </div>
      </div>
    </div>
    <div class="sector">
      <section style="border: 1px solid; width: 145px">
        const foo = () => console.log("First");
const bar = () => setTimeout(() => console.log("Second"));
const baz = () => console.log("Third");

bar();
foo();
baz();


      </section>
      <ul>
        <li>A: First Second Third</li>
        <li>B: First Third Second</li>
        <li>C: Second First Third</li>
        <li>D: Second Third First</li>
      </ul>
      <div>
        <p>答案</p>
        <div class="container">
          我们有一个setTimeout函数并首先调用它。 然而却最后打印了它。
这是因为在浏览器中，我们不只有运行时引擎，我们还有一个叫做WebAPI的东西。WebAPI为我们提供了setTimeout函数，例如DOM。
将callback推送到WebAPI后，setTimeout函数本身（但不是回调！）从堆栈中弹出


        </div>
      </div>
    </div>
    <div class="sector">
      <section style="border: 1px solid; width: 145px">
        function getPersonInfo(one, two, three) { console.log(one);
        console.log(two); console.log(three); } const person = "Lydia"; const
        age = 21; getPersonInfo`${person} is ${age} years old`;
      </section>
      <ul>
        <li>A: Lydia 21 ["", "is", "years old"]</li>
        <li>B: ["", "is", "years old"] Lydia 21</li>
        <li>C: Lydia ["", "is", "years old"] 21</li>
      </ul>
      <div>
        <p>答案</p>
        <div class="container">
          答案: B
          如果使用标记的模板字符串，则第一个参数的值始终是字符串值的数组。
          其余参数获取传递到模板字符串中的表达式的值！
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "javascript",
  data() {
    return {
      q1: ` for (var i = 0; i < 3; i++) { setTimeout(() => console.log(i), 1); } for
      (let i = 0; i <script 3; i++) { setTimeout(() => console.log(i), 1); }`,
    };
  },
};
</script>

<style lang="less" scoped>
.javascript-container {
  width: 90%;
  margin: 6px auto;
  background: #fff;
  padding: 0 5px;
  font-size: 16px;
  font-weight: 600;
  box-shadow: 0 0 2px #ccc, 0 0 4px #ccc;
}
</style>