$(function() {
	//			读取缓存中的数据
	for(var i = 0; i < localStorage.length; i++) {
		var getKey = localStorage.key(i);
		var getVal = localStorage.getItem(getKey);
		//重新转换为对象 
		getVal = JSON.parse(getVal);
		console.log(getVal);
		var price = '';
		var time = (new Date(getVal.discountedEndTime)) - (new Date());
		if(time > 0) {
			price = getVal.discountedMoney;
		} else {
			price = getVal.productUnitPrice;
		}
		var html = '';
		html += '<div class="car_list"><div class="checked"><div class="checked_img" data="0"></div></div>' +
			'<div class="img"><img src="' + getVal.productThumbnail + '" alt="" /></div>' +
			'<div class="text"><h4>' + getVal.productName + '</h4><p>' + getVal.productDescribe + '</p>' +
			'<p style="color: #2BC1FF;">￥<span class="price">' + price + '</span></p></div>' +
			'<div class="del"><div class="del_img"><img src="img/del.png" alt="" /></div></div></div>';
		$("#car_list").append(html);
	}
	js();
	//			单选
	$(".checked_img").click(function() {
		var a = $(this).attr("data");
		if(a == 0) {
			$(this).css("background-image", "url(img/choosed.png)");
			$(this).attr("data", 1);
			$(this).addClass("choosed")
		} else {
			$(this).css("background-image", "url(img/choose.png)");
			$(this).attr("data", 0)
			$(this).removeClass("choosed");
			$(".chooseAll").attr("data", 0);
			$(".chooseAll").css("background-image", "url(img/choose.png)");
		}
		var n1 = $(".car_list").length;
		var n2 = $(".car_list .choosed").length;
		if(n1 == n2) {
			$(".chooseAll").attr("data", 1);
			$(".chooseAll").css("background-image", "url(img/choosed.png)");
		}
		js()
	})

	//			全选
	$(".chooseAll").click(function() {
		var a = $(this).attr("data");
		if(a == 0) {
			$(".checked_img").addClass("choosed")
			$(".checked_img").attr("data", 1);
			$(this).css("background-image", "url(img/choosed.png)");
			$(".checked_img").css("background-image", "url(img/choosed.png)");
			$(this).attr("data", 1);
		} else {
			$(".checked_img").attr("data", 0);
			$(this).css("background-image", "url(img/choose.png)");
			$(".checked_img").css("background-image", "url(img/choose.png)");
			$(this).attr("data", 0);
		}
		js()
	})
	//			删除商品--弹出窗
	$(".del").click(function() {
		$(".top").css("display", "block");
		$(".alter_content").css("display", "block");

		var i = $(this).parent().index();
		$(this).parent().attr("id", i);
		var getKey = localStorage.key(i);
		$("#confirm1").click(function() {
			$(".top").css("display", "none");
			$(".alter_content").css("display", "none");
			$("#" + i).remove();
			js();
			localStorage.removeItem(getKey);
		})
	})
	$("#cancel1").click(function() {
		$(".top").css("display", "none");
		$(".alter_content").css("display", "none");
	})

	//			商品价格件数计算
	function js() {
		var num = 0;
		var conut = 0;
		var b = 0
		$(".checked_img").each(function() {
			if($(this).attr("data") == 1) {
				b++;
				var jg = $(this).parent().next().next().find(".price").text();
				num = num + parseFloat(jg);
			}
		})

		$('#sum_price').html(num);
		$('#choose_num').html(b);
	}

	//			生成订单
	$(".sum_btn").click(function() {
		var n2 = $(".car_list .choosed").length;
		console.log(n2);
		if(n2 > 0) {
			$(".top").css("display", "block");
			$(".alter_order").css("display", "block");
			$("#confirm2").click(function() {
				var price = $("#sum_price").text();
				console.log(price);
				var productDetail_list = [];
				var isPoints_list = [];
				for(var i = 0; i < localStorage.length; i++) {
					var a = $(".checked_img").eq(i).attr("data");
					console.log(a);
					if(a == 1) {
						var getKey = localStorage.key(i);
						var getVal = localStorage.getItem(getKey);
						getVal = JSON.parse(getVal);
						console.log(getVal);
						var productDetail = {
							productId: getVal.productId,
							productUnitPrice: getVal.productUnitPrice,
							productNum: 1,
							money: getVal.productUnitPrice
						};
						productDetail_list.push(productDetail);
						console.log(productDetail_list);
						isPoints_list.push(getVal.isPoints);
					}

				}

				for(var i = 0; i < isPoints_list.length; i++) {
					var list0 = [],
						list1 = [];
					if(isPoints_list == 0) {
						list0.push(isPoints_list[i]);
					} else {
						list1.push(isPoints_list[i]);
					}
				}
				var type;
				if(list0.length == isPoints_list.length) {
					type = 1;
				} else if(list1.length == isPoints_list.length) {
					type = 2
				} else {
					type = 0
				}
				var orderJson = {};
				orderJson = {
					payStatus: 0,
					status: 0,
					payUrl: window.location.href,
					productDetail: productDetail_list,
					saleType: type,
					sumMoney: price
				};
				console.log(orderJson);
				console.log(JSON.stringify(orderJson))
				if(type == 1 || type == 2) {
					if(orderJson.sumMoney == 0) {
						$.ajax({
							type: "post",
							url: baseurl + "/order/save.json",
							data: {
								token: getCookie("token"),
								orderInfoJson: JSON.stringify(orderJson)
							},
							success: function(data) {
								console.log(data);
								if(data.success) {
									window.location = 'order.html';
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
						});
					} else {
						$.ajax({
							type: "post",
							url: baseurl + "/order/save.json",
							data: {
								token: getCookie("token"),
								orderInfoJson: JSON.stringify(orderJson)
							},
							success: function(data) {
								console.log(data);
								if(data.success) {
									window.location = 'account.html?id=' + data.datas.id;
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
						});
					}
				}else{
					alert("微信支付或积分支付请单独下单！")
				}
			})
		} else {
			alert("请选择商品")
		}

	})

	$("#cancel2").click(function() {
		$(".top").css("display", "none");
		$(".alter_order").css("display", "none");
	})

})