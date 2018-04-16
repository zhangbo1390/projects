/**
 * Created by Administrator on 2016/3/27 0027.
 */
self.onmessage = function(ev){
    self.postMessage(ev.data + '你好哦');
};