/**
 * Created by XbZhang on 2018/4/19.
 */
$(function(){
    var $showPass = $('#showPass');
    var $hidePass = $('#hidePass');
    var $pass = $('#password');
    $showPass.click(function(){
        $pass.attr('type','text');
        $hidePass.show();
        $showPass.hide();
    });
    $hidePass.click(function(){
        $pass.attr('type','password');
        $hidePass.hide();
        $showPass.show();
    });
});