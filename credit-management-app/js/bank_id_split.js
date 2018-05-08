/**
 * Created by XbZhang on 2018/4/17.
 */
window.onload=function()
{
    var oBankID=document.getElementById('bank_id');
    oBankID.onkeyup=function(ev)
    {
        var oBankID_value=oBankID.value;
        var oEvent=ev||event;
        if(oEvent.keyCode==8)
        {
            if(oBankID_value)
            {
                for(var i=0;i<oBankID_value.length;i++)
                {
                    var newStr=oBankID_value.replace(/\s$/g,'');
                }
                oBankID.value=newStr
            }
        }else{
            for(var i=0;i<oBankID_value.length;i++)
            {
                var arr=oBankID_value.split('');

                if((i+1)%5==0)
                {
                    arr.splice(i,0,' ');
                }
            }
            oBankID.value=arr.join('');
        }
    }
};