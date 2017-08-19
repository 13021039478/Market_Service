$(function() {
	//	获取code
	var codeStr = getCodeString('code');
	console.log(codeStr);

	//			授权登录获取用户信息	
	if(!getCookie("loginStatus")) {
		$.ajax({
			type: "post",
			url: baseurl + "/invokingUserCenterRest/login.json",
			data: { code: codeStr, productType: 0 },
			success: function(data) {
				console.log(data);
				if(data.success) {
					addCookie("token", data.datas.token, 8);
					addCookie("headimg", data.datas.headimgurl, 8);
					addCookie("nickname", data.datas.nickname, 8);
					addCookie("openId", data.datas.openid, 8);
					addCookie("loginStatus", 1, 8);
					addCookie("phone", data.datas.mobile);
					addCookie("currentPoints",data.datas.currentPoints,8);
					getrecommendation();
					getdiscounted();
				} else {
					alert("授权登录失败，请重新登录")
				}

			}
		});
	}
	if(getCookie("loginStatus")){
		getrecommendation();
		getdiscounted();
	}

})

//			推荐服务列表
function getrecommendation() {
	$.ajax({
		type: "post",
		url: baseurl + "/product/search.json",
		data: { token: getCookie("token"), isAdmin: 1, recommendation: 1, status: 0 },
		success: function(data) {
			console.log(data);
			var len = data.datas.list.length;
			for(var i = 0; i < len; i++) {
				if(data.datas.list[i].productSaleCount = 'null') {
					data.datas.list[i].productSaleCount = '0'
				}
				//商品积分
			var Points_html = '';
			if(data.datas.list[i].isPoints) {
				Points_html = '<span style="color: #ff3838;margin-left: 0.3rem;">积分兑换：'+data.datas.list[i].pointsNum+'</span>';
			} else {
				Points_html = '';
			}
				var html = '';
				html += '<div class="service_content"><a href="p_detail.html?id=' + data.datas.list[i].id + '"><div class="img"><img src="' + data.datas.list[i].productThumbnail + '" alt="" /></div>' +
					'<div class="text"><p>' + data.datas.list[i].productName + '</p><p>' + data.datas.list[i].productDescribe + '</p>' +
					'<p><span style="color: #ff3838;">￥' + data.datas.list[i].productUnitPrice + '</span>'+Points_html+'<span style="float: right; margin-right: 0.1rem;">成交量：' + data.datas.list[i].productSaleCount +
					'</span></p><div class="buy_now">立即购买</div></div></a></div>';
				$(".service").append(html);
			}

		}
	});
}
//			限时抢购列表
function getdiscounted() {

	$.ajax({
		type: "post",
		url: baseurl + "/product/search.json",
		data: { token: getCookie("token"), isAdmin: 1, discountedStatus: 0, status: 0 },
		success: function(data) {
			console.log(data);

			var len = data.datas.list.length;
			for(var i = 0; i < len; i++) {
				var time = (new Date(data.datas.list[i].discountedEndTime)) - (new Date()); //计算剩余的豪秒数
				var second = parseInt(time / 1000);
				console.log(second);
				if(data.datas.list[i].productSaleCount = 'null') {
					data.datas.list[i].productSaleCount = '0'
				}
				var html = '';
				html += '<div class="service_content" data-seconds="' + second + '"><a href="p_detail.html?id=' + data.datas.list[i].id + '"><div class="img"><img src="' + data.datas.list[i].productThumbnail + '" alt="" /></div>' +
					'<div class="text"><p>' + data.datas.list[i].productName + '</p><p>' + data.datas.list[i].productDescribe + '</p>' +
					'<p style="margin-top:0.1rem;"><span style="color: #ff3838;">￥' + data.datas.list[i].discountedMoney +
					'</span><span style="float: right; margin-right: 0.1rem;">成交量：' + data.datas.list[i].productSaleCount + '</span></p>' +
					'<p class="clock" style="margin-top:0.2rem;"><span class="d"></span> : <span class="h"></span> : <span class="m"></span> : <span class="s"></span> 后结束活动</p></div></a></div>';
				$(".buy").append(html);
				$(".service_content").countdown(function(s, d) {
					var items = $(this).find('.clock span');
					var D = d.day >= 10 ? d.day : "0" + d.day;
					var H = d.hour >= 10 ? d.hour : "0" + d.hour;
					var M = d.minute >= 10 ? d.minute : "0" + d.minute;
					var S = d.second >= 10 ? d.second : "0" + d.second;
					items.eq(0).text(D);
					items.eq(1).text(H);
					items.eq(2).text(M);
					items.eq(3).text(S);
				});
			}
		}

	});
}

//		7.2 获取当前地理位置
$("#location").click(function() {
	$.ajax({
		type: "post",
		url: baseurl + "/invokingUserCenterRest/getSignature.json",
		data: { token: getCookie("token"), url: location.href },
		success: function(data) {
			console.log(data);
			if(data.success) {
				wx.config({
					debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
					appId: data.datas.appid, // 必填，公众号的唯一标识
					timestamp: data.datas.timestamp, // 必填，生成签名的时间戳
					nonceStr: data.datas.noncestr, // 必填，生成签名的随机串
					signature: data.datas.signature, // 必填，签名，见附录1
					jsApiList: ['getLocation'] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
				});
			}

		}
	});
	wx.getLocation({
		success: function(res) {
			alert(JSON.stringify(res));
			var latitude = res.latitude; // 纬度，浮点数，范围为90 ~ -90
			var longitude = res.longitude; // 经度，浮点数，范围为180 ~ -180。
			//			获取地理位置名称
			$.ajax({
				type: "post",
				url: baseurl + "/invokingUserCenterRest/getAddressByLongitudeAndLatitude.json",
				data: { token: getCookie("token"), longitude: longitude, latitude: latitude },
				success: function(data) {
					console.log(data);
				}
			});

		},
		cancel: function(res) {
			alert('用户拒绝授权获取地理位置');
		}
	});
})