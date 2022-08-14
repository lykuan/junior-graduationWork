<template>
  <div class="css-container">
    <h1 style="margin: 5px auto; width: max-content;font-weight:800;letter-spacing:2px;font-size:50px" >CSS几大布局</h1>

    <div><h2>一.单列布局</h2></div>

    <div class="img-container">
      <img src="../../assets/img/singleCase.png" alt="" />
    </div>

    <div>常见单列布局</div>
    <ul>
      <li>header,content和footer等宽的单列布局</li>
      <li>header与footer等宽,content略窄的单列布局</li>
    </ul>

    <div>
      对于第一种，先通过对header,content,footer统一设置width：1000px;或者max-width：1000px(这两者的区别是当屏幕小于1000px时，前者会出现滚动条，后者则不会，显示出实际宽度);然后设置margin:auto实现居中即可得到。
    </div>

    <div>{{ layout2 }}</div>

    <code
      >.header{ margin:0 auto; max-width: 960px; height:100px; background-color:
      blue;}.content{ margin: 0 auto; max-width: 960px; height: 400px;
      background-color: aquamarine;}.footer{ margin: 0 auto; max-width: 960px;
      height: 100px; background-color: aqua;}</code
    >

    <div>
      对于第二种，header、footer的内容宽度不设置，块级元素充满整个屏幕，但header、content和footer的内容区设置同一个width，并通过margin:auto实现居中。
    </div>

    <code
      >.header{ margin:0 auto; max-width: 960px; height:100px; background-color:
      blue;}.nav{ margin: 0 auto; max-width: 800px; background-color: darkgray;
      height: 50px;}.content{ margin: 0 auto; max-width: 800px; height: 400px;
      background-color: aquamarine;}.footer{ margin: 0 auto; max-width: 960px;
      height: 100px; background-color: aqua;}</code
    >

    <div><h2>二.两列自适应布局</h2></div>

    <p>两列自适应布局是指一列由内容撑开，另一列撑满剩余宽度的布局方式</p>

    <p>1.float+overflow:hidden</p>

    <p>
      如果是普通的两列布局，浮动+普通元素的margin便可以实现，但如果是自适应的两列布局，利用float+overflow:hidden便可以实现，这种办法主要通过overflow触发BFC,而BFC不会重叠浮动元素。由于设置overflow:hidden并不会触发IE6-浏览器的haslayout属性，所以需要设置zoom:1来兼容IE6-浏览器。具体代码如下：
    </p>
    <div v-text="over"></div>

    <div>{{ flow }}</div>

    <p>2.Flex布局</p>

    <p>
      Flex布局，也叫弹性盒子布局，区区简单几行代码就可以实现各种页面的的布局。
    </p>

    <p>
      //html部分同上.parent { display:flex;} .right { margin-left:20px; flex:1;}
    </p>

    <p>3.grid布局</p>

    <p>Grid布局，是一个基于网格的二维布局系统，目的是用来优化用户界面设计。</p>

    <p>
      //html部分同上.parent { display:grid; grid-template-columns:auto 1fr;
      grid-gap:20px}
    </p>

    <div><h2>三.三栏布局</h2></div>

    <p>
      特征：中间列自适应宽度，旁边两侧固定宽度，实现三栏布局有多种方式（可以猛戳实现三栏布局的几种方法),本文着重介绍圣杯布局和双飞翼布局。
    </p>

    <h3>1.圣杯布局</h3>

    <p>
      比较特殊的三栏布局，同样也是两边固定宽度，中间自适应，唯一区别是dom结构必须是先写中间列部分，这样实现中间列可以优先加载。
    </p>

    <div>
      .container { padding-left: 220px;//为左右栏腾出空间 padding-right: 220px;
      } .left { float: left; width: 200px; height: 400px; background: red;
      margin-left: -100%; position: relative; left: -220px; } .center { float:
      left; width: 100%; height: 500px; background: yellow; } .right { float:
      left; width: 200px; height: 400px; background: blue; margin-left: -200px;
      position: relative; right: -220px; }
    </div>

    <div>{{ layout3 }}</div>

    <p>实现</p>

    <p>
      三个部分都设定为左浮动，否则左右两边内容上不去，就不可能与中间列同一行。然后设置center的宽度为100%(实现中间列内容自适应)，此时，left和right部分会跳到下一行
    </p>

    <div class="img-container">
      <img src="../../assets/img/shengbei.png" alt="" />
    </div>

    <p>通过设置margin-left为负值让left和right部分回到与center部分同一行</p>

    <div class="img-container">
      <img src="../../assets/img/shengbei1.png" alt="" />
    </div>

    <p>通过设置父容器的padding-left和padding-right，让左右两边留出间隙。</p>
    <div class="img-container">
      <img src="../../assets/img/shengbei2.png" alt="" />
    </div>

    <p>通过设置相对定位，让left和right部分移动到两边。</p>
    <div class="img-container">
      <img src="../../assets/img/shengbei3.png" alt="" />
    </div>

    <p>缺点</p>
    <ul>
      <li>
        center部分的最小宽度不能小于left部分的宽度，否则会left部分掉到下一行
      </li>
      <li>
        如果其中一列内容高度拉长(如下图)，其他两列的背景并不会自动填充。(借助伪等高布局可解决)
      </li>
    </ul>
    <div class="img-container">
      <img src="../../assets/img/shengbei4.png" alt="" />
    </div>

    <p>伪等高布局</p>
    <div>
      等高布局是指子元素在父元素中高度相等的布局方式。等高布局的实现包括伪等高和真等高,伪等高只是看上去等高而已,真等高是实实在在的等高。
      此处我们通过伪等布局便可解决圣杯布局的第二点缺点，因为背景是在padding区域显示的，设置一个大数值的padding-bottom，再设置相同数值的负的margin-bottom，并在所有列外面加上一个容器，并设置overflow:hidden把溢出背景切掉。这种可能实现多列等高布局，并且也能实现列与列之间分隔线效果，结构简单，兼容所有浏览器。新增代码如下：
    </div>

    <div>
      .center, .left, .right { padding-bottom: 10000px; margin-bottom: -10000px;
      } .container { padding-left: 220px; padding-right: 220px; overflow:
      hidden;//把溢出背景切掉 }
    </div>

    <h3>2.双飞翼布局</h3>

    <p>
      同样也是三栏布局，在圣杯布局基础上进一步优化，解决了圣杯布局错乱问题，实现了内容与布局的分离。而且任何一栏都可以是最高栏，不会出问题。
    </p>

    <div>
      .container { min-width:
      600px;//确保中间内容可以显示出来，两倍left宽+right宽 } .left { float:
      left; width: 200px; height: 400px; background: red; margin-left: -100%; }
      .center { float: left; width: 100%; height: 500px; background: yellow; }
      .center .inner { margin: 0 200px; //新增部分 } .right { float: left;
      width: 200px; height: 400px; background: blue; margin-left: -200px; }
    </div>

    <div>{{ layout4 }}</div>

    <p>实现</p>

    <ul>
      <li>
        三个部分都设定为左浮动，然后设置center的宽度为100%，此时，left和right部分会跳到下一行
      </li>
      <li>
        通过设置margin-left为负值让left和right部分回到与center部分同一行；
      </li>
      <li>center部分增加一个内层div，并设margin: 0 200px</li>
    </ul>
    <p>缺点</p>
    <p>多加一层 dom 树节点，增加渲染树生成的计算量。</p>

    <h3>3.两种布局实现方式对比:</h3>

    <ul>
      <li>两种布局方式都是把主列放在文档流最前面，使主列优先加载。</li>
      <li>
        两种布局方式在实现上也有相同之处，都是让三列浮动，然后通过负外边距形成三列布局。
      </li>
      <li>两种布局方式的不同之处在于如何处理中间主列的位置：</li>
    </ul>

    <p>圣杯布局是利用父容器的左、右内边距+两个从列相对定位；</p>
    <p>
      双飞翼布局是把主列嵌套在一个新的父级块中利用主列的左、右外边距进行布局调整
    </p>

    <div><h2>四. 粘连布局</h2></div>
    <p>特点</p>

    <ul>
      <li>
        有一块内容main，当main的高康足够长的时候，紧跟在main后面的元素footer会跟在main元素的后面。
      </li>

      <li>
        当main元素比较短的时候(比如小于屏幕的高度),我们期望这个footer元素能够“粘连”在屏幕的底部
      </li>
    </ul>

    <p>当main足够长时</p>

    <div class="img-container">
      <img
        src="https://img-blog.csdnimg.cn/img_convert/0415ad6df92a54abc5d92b86c916af59.png"
        alt=""
      />
    </div>

    <p>当main比较短时</p>

    <div class="img-container">
      <img src="../../assets/img/zhanlian.png" alt="" />
    </div>

    <div>{{ zhanlian }}</div>

    <div>
      * { margin: 0; padding: 0; } html, body { height:
      100%;//高度一层层继承下来 } #wrap { min-height: 100%; background: pink;
      text-align: center; overflow: hidden; } #wrap .main { padding-bottom:
      50px; } #footer { height: 50px; line-height: 50px; background: deeppink;
      text-align: center; margin-top: -50px; }
    </div>

    <p>实现</p>

    <p>(1)footer必须是一个独立的结构，与wrap没有任何嵌套关系</p>
    <p>(2)wrap区域的高度通过设置min-height，变为视口高度</p>
    <p>(3)footer要使用margin为负来确定自己的位置</p>
    <p>
      (4)在main区域需要设置 padding-bottom。这也是为了防止负 margin 导致 footer
      覆盖任何实际内容。
    </p>
  </div>
</template>

<script>
export default {
  name: "CSS",
  data() {
    return {
      over: `<div class="parent" style="background-color: lightgrey">
      <div class="left" style="background-color: lightblue"><p>left</p></div>
      <div class="right" style="background-color: lightgreen">
        <p>right</p>
        <p>right</p>
      </div>
    </div>`,
      flow: `.parent {  overflow: hidden;  zoom: 1;}.left {  float: left;  margin-right: 20px;}.right {  overflow: hidden;  zoom: 1;}`,
      layout2: `<div class="header"></div>
    <div class="content"></div>
    <div class="footer"></div>`,
      layout3: ` <article class="container">    <div class="center">      <h2>圣杯布局</h2>    </div>    <div class="left"></div>    <div class="right"></div>  </article>`,
      layout4: `  <article class="container">        <div class="center">            <div class="inner">双飞翼布局</div>        </div>        <div class="left"></div>        <div class="right"></div>    </article>`,
      zhanlian: `    <div id="wrap">      <div class="main">        main <br />        main <br />        main <br />      </div>    </div>    <div id="footer">footer</div>`,
    };
  },
  created(){
    console.log(this.$route)

  }
};
</script>

<style lang='less' scoped>
.css-container {
  width: 90%;
  margin: 6px auto;
  background: #fff;
  padding: 0 5px;
//   border: 1px solid #aaa;
  font-size: 16px;
  font-weight: 600;
  box-shadow: 0 0 2px #ccc,0 0 4px #ccc;
  .img-container {
    width: max-content;
    margin: 20px auto;
  }
  h2 {
    font-weight: 800;
    color: #1ad;
  }
  ul > li {
    list-style-position: inside;
    margin: 20px 10px;
  }

  div {
    margin: 40px 0;
  }
  p {
    margin: 40px 0;
  }
}
</style>