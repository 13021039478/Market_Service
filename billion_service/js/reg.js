$(function() {
	var phone = getCookie("phone");
	$("#change_pwd .phone").val(phone);
	$.ajax({
		type: "post",
		url: baseurl + "/invokingUserCenterRest/checkBindMobile.json",
		data: { token: getCookie("token") },
		success: function(data) {
			console.log(data);
			//				if(!data.success || data.datas == '0') {
			//					$("#register").css("display", "block");
			//					$("#change_pwd").css("display", "none");
			//				} else {
			//					$("#register").css("display", "none");
			//					$("#change_pwd").css("display", "block");
			//				}

		}
	})
})

var c_name = $("#c-name").val();
var model = $("#model").val();
var city = $("#city").val();
var contact_p = $("#contact_p").val();
if(model == '一般纳税人') {
	model = 1
}
if(model == '小规模纳税人') {
	model = 2
}
//		获取验证码
$(".getCode").click(function() {
	var tel = $("#tel").val();
	console.log(tel);
	$.ajax({
		type: "post",
		url: baseurl + "/invokingUserCenterRest/createImageCode.json",
		data: { mobile: tel },
		success: function(data) {
			console.log(data);
			if(data.success) {
				$(".top").css("display", "block");
				$(".alter_content").css("display", "block");
			} else {
				alert("电话号码不正确")
			}
			var html = '';
			html = '<img src="' + data.datas + '"/>';
			$(".code_img").html(html);
		}
	})
})
//验证图片验证码
$("#confirm").click(function() {
	var phoneNum = $("#tel").val(); //手机号码
	var code = $(".enter_code").val();
	$.ajax({
		type: "post",
		url: baseurl + "/invokingUserCenterRest/validateImageCode.json",
		data: { mobile: phoneNum, validateCode: code, product: "BNL" },
		success: function(data) {
			console.log(data);
			if(data.success) {
				$(".top").css("display", "none");
				$(".alter_content").css("display", "none");
				var countdown = 60;
				var timer = setInterval(function() {
					if(countdown == 0) {
						$(".getCode").html("获取验证码")
						countdown = 60;
						clearInterval(timer);
					} else {
						countdown--;
						$(".getCode").html(countdown + "秒")

					}
				}, 1000)
			} else {
				alert("输入的图片验证码有误")
			}
		}
	})
})
$("#cancel").click(function() {
	$(".top").css("display", "none");
	$(".alter_content").css("display", "none");
})

//		绑定手机号
$(".bind").click(function() {
	var reg = /^1[3|4|5|7|8][0-9]{9}$/; //验证规则
	var phoneNum = $("#tel").val(); //手机号码
	var flag = reg.test(phoneNum); //true
	if($("#tel").val() == '' || flag == false) {
		alert("手机号有误，请重新输入！");
		$("#tel").val('');
	}
	if($("#pwd").val() != $("#re_pwd").val()) {
		alert("两次输入的密码不一致！")
		$("#pwd").val('');
		$("#re_pwd").val('');
	}
	var code = $("#code").val();
	var pwd = $("#re_pwd").val();
	var nickname = getCookie("nickname");
	$.ajax({
		type: "post",
		url: baseurl + "/invokingUserCenterRest/regist.json",
		data: {
			mobile: phoneNum,
			password: pwd,
			productType: "ESP",
			code: code,
			openId: getCookie("openId"),
			name: unescape(nickname),
			orgName: c_name,
			taxpayerType: model,
			cityName: city,
			orgLinkMan: contact_p
		},
		success: function(data) {
			console.log(data);
			if(data.success) {
				alert("绑定成功！");
				$("#register").css("display", "none");
				$(".bar2").css("display", "none");
				$("#sum-company").css("display", "block");
				$(".news-div .company").text(c_name);
				$(".news-div .model").text(model);
				$(".news-div .city").text(city);
				$(".news-div .contact_p").text(contact_p);
			} else if(data.resultCode == -1) {
				alert(data.message)
			} else if(data.resultCode == 1) {
				alert("登录失效，请重新授权！")
				clearAllCookie();
			} else if(data.resultCode == 2) {
				alert("参数无效")
			} else if(data.resultCode == 3) {
				alert("处理失败，请重新操作")
			}

		}
	})
})

//		修改密码
$(".save").click(function() {
	var old_pwd = $("#old_pwd").val();
	var new_pwd = $("#new_pwd").val();
	if(old_pwd == '' || new_pwd == '') {
		alert("请输入密码")
	}
	$.ajax({
		type: "post",
		url: baseurl + "/invokingUserCenterRest/modifyPwd.json",
		data: { token: getCookie("token"), password: old_pwd, newPwd: new_pwd },
		success: function(data) {
			console.log(data);
			if(data.success) {
				alert("修改成功！");
				$("#old_pwd").val('');
				$("#new_pwd").val('');
			}
		}
	})
})