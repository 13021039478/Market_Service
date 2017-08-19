$(function() {
	//获取购物车商品数量
	var len = localStorage.length;
	console.log(len);
	if(len > 0) {
		var car_num = '';
		car_num = '<span class="carProductNum">' + len + '</span>'
		$(".car").append(car_num);
	}
	//获取商品详情
	var getId = getCodeString('id');
	$.ajax({
		type: "post",
		url: baseurl + "/product/search.json",
		data: { token: getCookie("token"), isAdmin: 1, id: getId, status: 0 },
		success: function(data) {
			console.log(data);
			var data = data.datas.list[0];
			//					判断是否为抢购商品
			var clock_html = '';
			var ts = (new Date(data.discountedEndTime)) - (new Date()); //计算剩余的毫秒数
			var discountedMoney, productUnitPrice;
			if(ts > 0) {
				var timer = setInterval(function() {
					var ts = (new Date(data.discountedEndTime)) - (new Date()); //计算剩余的毫秒数
					var dd = parseInt(ts / 1000 / 60 / 60 / 24, 10) //计算剩余的天数
					var hh = parseInt(ts / 1000 / 60 / 60 % 24, 10); //计算剩余的小时数
					var mm = parseInt(ts / 1000 / 60 % 60, 10); //计算剩余的分钟数
					var ss = parseInt(ts / 1000 % 60, 10); //计算剩余的秒数
					dd = dd > 10 ? dd : "0" + dd;
					hh = hh > 10 ? hh : "0" + hh;
					mm = mm > 10 ? mm : "0" + mm;
					ss = ss > 10 ? ss : "0" + ss;
					document.getElementById("d").innerHTML = dd;
					document.getElementById("h").innerHTML = hh;
					document.getElementById("m").innerHTML = mm;
					document.getElementById("s").innerHTML = ss;

				}, 1000);
				discountedMoney = data.discountedMoney;
				productUnitPrice = data.productUnitPrice
				clock_html = '<p class="clock"><span id="d"></span> : <span id="h"></span> : <span id="m"></span> : <span id="s"></span> 后结束活动</p>';
			} else {
				clock_html = '';
				discountedMoney = data.productUnitPrice;
				productUnitPrice = data.productUnitPrice;
			}
			//					商品图片轮播
			for(var i = 0; i < data.pictureList.length; i++) {
				var img_html = '';
				img_html += '<div class="swiper-slide"><img src="' + data.pictureList[i].pictureUrl + '" alt="" /></div>';
				$(".swiper-wrapper").append(img_html);
			}
			//          商品价格规格
			var p_len = data.productPriceDetail.length;
			var price;
			if(p_len > 0) {
				for(var i = 0; i < p_len; i++) {
					var price_html = '';
					price_html += '<a style="border: 1px solid ##E8E4E2;">' + data.productPriceDetail[i].model + '</a>';
					$("#type").append(price_html);
					price = data.productPriceDetail[i].money;
				}
				$("#type a").click(function() {
					$(this).addClass(".active");
					var index = $(this).index();
					price = data.productPriceDetail[index].money;
					$(".prices").text(price);
				})
			} else {
				$(".prices").text(discountedMoney);
			}
			//商品积分
			var Points_html = '';
			if(data.isPoints) {
				Points_html = '<span style="margin-left: 0.1rem;">积分兑换：' + data.pointsNum + '</span>';
			} else {
				Points_html = '';
			}

			//					商品信息
			if(data.productSaleCount = 'null') {
				data.productSaleCount = '0'
			}
			var html = '';
			html = '<h3>' + data.productName + '</h3><p>' + data.productDescribe + '</p>' +
				'<p><span>￥</span><span class="prices">' + discountedMoney + '</span>' + Points_html + '<span style="float: right;">' + data.productSaleCount + '</span>' +
				'<span style="float: right;">交易成功：</span></p>' +
				'<p><span>市场价：</span><span>' + productUnitPrice + '</span></p>' + clock_html;
			$(".p_detail").append(html);

			//			商品详情
			var pro_intro = data.productDetail;
			$(".intro").html(pro_intro);

			//					点击加入购物车将数据添加到缓存
			$(".join_car").click(function() {
				var price = $(".prices").text();
				var datas={
					id:data.id,
					productName:data.productName,
					productDescribe:data.productDescribe,
					productThumbnail:data.productThumbnail,
					isPoints:data.isPoints,
					productUnitPrice:price
				}
				console.log(datas);
				localStorage.setItem(data.id, JSON.stringify(datas));
				$(".top").css("display", "block");
				$(".alter_content").css("display", "block");
			})
			$(".content_btn").click(function() {
				location.reload();
			})
			//					生成订单
			$(".buy_now").click(function() {
				
				var price = $(".prices").text();
				console.log(price)
//				if(ts > 0) {
//					price = data.discountedMoney;
//				} else {
//					price = data.productUnitPrice;
//				}
				var type;
				if(data.isPoints == 1){
					type=2
				}else{
					type=1
				}
				var orderJson = {
					payStatus: 0,
					status: 0,
					payUrl: window.location.href,
					productDetail: [{
						productId: data.id,
						productUnitPrice: price,
						productNum: 1,
						money: price
					}],
					saleType: type,
					sumMoney: price
				};
				console.log(orderJson.sumMoney);
				if(orderJson.sumMoney > 0) {
					$.ajax({
						type: "post",
						url: baseurl + "/order/save.json",
						data: { token: getCookie("token"), orderInfoJson: JSON.stringify(orderJson) },
						success: function(data) {
							console.log(data);
							if(data.success) {
								window.location = 'account.html?id=' + data.datas.id;
							}else if(data.resultCode == -1){
								alert(data.message)
							}else if(data.resultCode == 1){
								alert("登录失效，请重新授权！")
								clearAllCookie();
							}else if(data.resultCode == 2){
								alert("参数无效")
							}else if(data.resultCode == 3){
								alert("处理失败，请重新操作")
							}
						}
					});
				}else if(orderJson.sumMoney < 0){
					alert("商品信息有误！")
				}else{
					$.ajax({
						type: "post",
						url: baseurl + "/order/save.json",
						data: { token: getCookie("token"), orderInfoJson: JSON.stringify(orderJson) },
						success: function(data) {
							console.log(data);
							if(data.success) {
								window.location = 'order.html';
							}else if(data.resultCode == -1){
								alert(data.message)
							}else if(data.resultCode == 1){
								alert("登录失效，请重新授权！")
								clearAllCookie();
							}else if(data.resultCode == 2){
								alert("参数无效")
							}else if(data.resultCode == 3){
								alert("处理失败，请重新操作")
							}
						}
					});
				}

			})
		}
	});
	//轮播
	new Swiper('.swiper-container', {
		pagination: '.swiper-pagination',
		paginationClickable: true,
		autoplay: 3000,
		observer: true
	});
})