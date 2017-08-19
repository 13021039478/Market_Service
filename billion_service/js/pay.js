$(function() {
	//			获取订单详情并请求支付
	var orderId = getCodeString('id');
	$.ajax({
		type: "post",
		url: baseurl + "/order/getWechatPayInfo.json",
		data: { token: getCookie("token"), payUrl: window.location.href, id: orderId },
		success: function(data) {
			console.log(data);
			for(var i = 0; i < data.datas.productList.length; i++) {
				var html = '';
				html = '<div class="order_pro"><div class="img"><img src="' + data.datas.productList[i].productThumbnail + '" alt="" /></div>' +
					'<div class="text"><h4>' + data.datas.productList[i].productName + '</h4><p>' + data.datas.productList[i].productDescribe + '</p>' +
					'<p style="color: #2BC1FF;">￥<span class="price">' + data.datas.productList[i].money + '</span></p></div></div>';
				$(".account_list").append(html);
			}
			//		配置
			wx.config({
				debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
				appId: data.datas.createPayConfig.appId, // 必填，公众号的唯一标识
				timestamp: data.datas.createPayConfig.timestamp, // 必填，生成签名的时间戳
				nonceStr: data.datas.createPayConfig.nonce, // 必填，生成签名的随机串
				signature: data.datas.createPayConfig.signature, // 必填，签名，见附录1
				jsApiList: ['chooseWXPay'] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
			});

			$(".pay_btn").click(function() {
				var text = $(".checked").siblings().children().text();
				console.log(text);
				if(data.datas.saleType == 1 && text == '微信支付') {
					wx.chooseWXPay({
						appId: data.datas.createPayConfig.appId,
						timestamp: data.datas.createPayConfig.timestamp, // 支付签名时间戳，注意微信jssdk中的所有使用timestamp字段均为小写。但最新版的支付后台生成签名使用的timeStamp字段名需大写其中的S字符
						nonceStr: data.datas.createPayConfig.nonce, // 支付签名随机串，不长于 32 位
						package: "prepay_id=" + data.datas.prepayId, // 统一支付接口返回的prepay_id参数值，提交格式如：prepay_id=***）
						signType: 'MD5', // 签名方式，默认为'SHA1'，使用新版支付需传入'MD5'
						paySign: data.datas.createPayConfig.paySign, // 支付签名
						success: function(res) {
							if(res.errMsg == "chooseWXPay: ok") {
								alert("正在处理订单请稍等！")
							} else {
//								alert(res.errMsg);
							}
						},
						cancel: function(res) {
							//支付取消
						}
					});
				} else if(data.datas.saleType == 1 && text == '积分支付') {
					alert("请使用其他方式支付");
				} else if(data.datas.saleType == 2 && text == '微信支付') {
					alert("请使用其他方式支付");
				} else {
					$.ajax({
						type: "post",
						url: baseurl + "/invokingUserCenterRest/pointsPay.json",
						data: { token: getCookie("token"), id: orderId },
						success: function(data) {
							console.log(data);
							if(data.success) {
								alert("支付成功")
								window.location = 'order.html';
							}
						}
					});
				}

			})

		}
	});

})