/**
 * Created by zhangxuebo on 2016/3/14.
 */
/* banner 焦点图 */
TouchSlide({
    slideCell:"#slideBox",
    titCell:".hd ul", //开启自动分页 autoPage:true ，此时设置 titCell 为导航元素包裹层
    mainCell:".bd ul",
    effect:"leftLoop",
    autoPage:true,//自动分页
    autoPlay:true //自动播放
});
/* news tab */
TouchSlide( {
    slideCell:"#tabBox1",
    endFun:function(i){ //高度自适应
        var bd = document.getElementById("tabBox1-bd");
        bd.parentNode.style.height = bd.children[i].children[0].offsetHeight+"px";
        if(i>0)bd.parentNode.style.transition="200ms";//添加动画效果
    }
} );
<!--多图滚动-->
TouchSlide({
    slideCell:"#scrollBox",
    titCell:".hd ul", //开启自动分页 autoPage:true ，此时设置 titCell 为导航元素包裹层
    effect:"leftLoop",
    autoPage:true, //自动分页
    autoPlay:true, //自动播放
    switchLoad:"_src" //切换加载，真实图片路径为"_src"
});