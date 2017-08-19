$(function() {
	$.ajax({
		type: "post",
		url: baseurl + "/order/search.json",
		data: { token:getCookie("token"), currentPage: 1, pageSize: 10000 },
		success: function(data) {
			var orderData = data.datas.list;
			console.log(orderData);
			for(var i = 0; i < orderData.length; i++) {
				//时间戳转换日期
				var d = new Date(orderData[i].createTime);
				var Mo = d.getMonth() + 1;
				var D = d.getDate();
				var H = d.getHours();
				var Mi = d.getMinutes();
				var S = d.getSeconds();
				Mo = Mo >= 10 ? Mo : "0" + Mo;
				D = D >= 10 ? D : "0" + D;
				H = H >= 10 ? H : "0" + H;
				Mi = Mi >= 10 ? Mi : "0" + Mi;
				S = S >= 10 ? S : "0" + S;
				var day = (d.getFullYear()) + "-" + (Mo) + "-" + (D) + " " +
					(H) + ":" + (Mi) + ":" + (S);
				//确定订单状态
				var btn_text = "";
				var status = ""
				if(orderData[i].payStatus == 1) {
					status = "已完成";
					btn_text = "再次购买";
				} else {
					status = "等待付款";
					btn_text = "立即付款";
				}

				var html2 = '';
				for(var j = 0; j < orderData[i].productDetail.length; j++) {
					console.log(orderData[i].productDetail.length);
					html2 += '<div class="order_pro"><div class="img"><img src="' + orderData[i].productDetail[j].productThumbnail + '" alt="" /></div>' +
						'<div class="text"><h4>' + orderData[i].productDetail[j].productName + '</h4><p>' + orderData[i].productDetail[j].productDescribe + '</p>' +
						'<p style="color: #2BC1FF;">￥<span class="price">' + orderData[i].productDetail[j].productUnitPrice + '</span></p></div></div>';
				}
				var html1 = '';
				html1 += '<div class="order" id="' + orderData[i].id + '"><div class="order_info"><div class="left">' +
					'<p>订单编号：<span>' + orderData[i].orderNum + '</span></p><p>下单时间：<span>' + day + '</span></p></div>' +
					'<a class="right" href="javascript:;">' + status + '</a><div class="del" onclick="delOrder(\''+orderData[i].id+'\')"><img src="img/del.png" alt="" /></div></div><div class="pro_list">' + html2 + '</div>' +
					'<div class="pay"><span> 共' + orderData[i].productDetail.length + '件商品 需付款￥' + orderData[i].sumMoney + '</span><a  href="account.html?id=' + orderData[i].id + '">' + btn_text + '</a></div>';
				if(orderData[i].payStatus == 1) {
					$("#done_pay").append(html1);
				} else {
					$("#no_pay").append(html1);
				}
				$("#all").append(html1)

			};
		}
	});
})
//		删除订单
function delOrder(ID) {
	$(".top").css("display","block");
	$(".alter_content").css("display","block");
	//	var ID = $(this).parent().parent().attr("id");
	$("#confirm").click(function() {
		$.ajax({
			type: "post",
			url: baseurl + "/order/updateOrderStatus.json",
			data: { token:getCookie("token"),id: ID, status: 1 },
			success: function(data) {
				console.log(data);
				if(data.success) {
					$(".top").css("display", "none");
					$(".alter_content").css("display", "none");
					$("#" + ID).remove();
					location.reload();
				}
			}
		})
	})
}

$("#cancel").click(function() {
	$(".top").css("display", "none");
	$(".alter_content").css("display", "none");
})
//		切换
$('.o_tab li').click(function() {
	var li_num = $(this).index();
	$('.o_tab li').eq(li_num).addClass('active').siblings().removeClass('active')
	$('.o_content li').eq(li_num).show().siblings().hide()
})