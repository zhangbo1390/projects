
function confirmSubmit(){
	var regex_Pwd = /^[a-zA-Z0-9]{6,20}$/;
	if($("#currentPwd").val() == ""){
		showMes("请输入原密码");
		return;
	}
	if($("#provingCode").val() == ""){
		showMes("请输入手机验证码");
		return;
	}
	if($("#newPassword").val() == ""){
		showMes("请输入新密码");
		return;
	}else{
		if(!regex_Pwd.test($("#newPassword").val())){
			showMes("请输入符合规则的新密码");
			return;
		}
	}
	if($("#reNewPassword").val() == ""){
		showMes("请输入确认密码");
		return;
	}
	if(!regex_Pwd.test($("#reNewPassword").val())){
		showMes("请输入符合规则的确认密码");
		return;
	}
	if($("#reNewPassword").val() != $("#newPassword").val()){
		showMes("新密码和确认密码不一致");
		return;
	}
	if($("#currentPwd").val() == $("#newPassword").val()){
		showMes("新密码与原密码相同，请重新设置");
		return;
	}
	var currentPwd = $("#currentPwd").val();
	var provingCode = $("#provingCode").val();
	var newPassword = $("#newPassword").val();
	$.ajax({
	    type:"POST",
	    url: getRootPath()+"/user/getChangePsd.html" ,
	    data: {
	    	currentPwd : currentPwd,
	    	provingCode : provingCode,
	    	newPassword : newPassword
	    },
	    datatype: "json",//"xml", "html", "script", "json", "jsonp", "text".
	    //成功返回之后调用的函数            
	    success:function(data){
	    	if(data.result == "ok"){
	    		layer.open({
	    			shadeClose:false,
	    		    title: '提示信息',
	    		    content: "新密码已生效，下次登录有效。",
	    		    end: function () {
	    		    	window.location.href = getRootPath()+"/user/index.html";
					}
	    		});
	    	}else if(data.result == "error"){
	    		showMes("密码修改失败");
	    	}else{
	    		showMes(data.result);
	    	}	    	
	    },
	    error:function(){
	    	showMes("请求失败");
		}
	});
}

function sendMobileCaptcha(){
	$.ajax({
	    type:"POST",
	    url: getRootPath()+"/user/userMessage/sendCaptch.html" ,
	    datatype: "xml",//"xml", "html", "script", "json", "jsonp", "text".
	    //成功返回之后调用的函数            
	    success:function(data){
	    	if(data.result == "ok"){
	    		showMes("发送成功");
	    		sendCaptchaTime();
	    	}else{
	    		showMes("发送失败");
	    	}	    	
	    },
	    error:function(){
	    	showMes("发送失败");
		}
	});
}

var maxtime = 90;
function sendCaptchaTime() {
	$("#sendCaptcha").attr("disabled",true);
	$("#sendCaptcha").attr("style","background-color:#999");
	if (maxtime > 0) {
		$("#sendCaptcha").html("重发验证码("+maxtime+"s)");
		maxtime--;
		setTimeout(sendCaptchaTime,1000);
	} else {
		$("#sendCaptcha").removeAttr("disabled");
		$("#sendCaptcha").attr("style","");
		$("#sendCaptcha").html("重发验证码(90s)");
		maxtime = 90;
	}
}
