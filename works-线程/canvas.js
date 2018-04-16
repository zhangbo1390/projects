/**
 * Created by Administrator on 2016/3/27 0027.
 */
function randomArr(all,newall){
    var arr = [];
    var newArr = [];
    for(var i=0;i<all;i++){
        arr.push(i);
    }
    for (var i=0;i<newall;i++){
        var index = Math.floor(Math.random()*arr.length);
        newArr.push(arr.splice(index,1));
    }
    return newArr;
}
self.onmessage = function(ev){
    var arr = randomArr(ev.data,ev.data/10);
    self.postMessage(arr);
};
