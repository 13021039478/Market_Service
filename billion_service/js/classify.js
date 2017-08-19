$(function() {
	//首页导航跳转到相应的分类
	var classId = getCodeString('id');
	if(classId == '0') {
		$('.tab_list li').eq(0).addClass('active').siblings().removeClass('active');
		$('.tab_content li').eq(0).show().siblings().hide();
	}
	if(classId == '1') {
		$('.tab_list li').eq(1).addClass('active').siblings().removeClass('active');
		$('.tab_content li').eq(1).show().siblings().hide();
	}
	if(classId == '2') {
		$('.tab_list li').eq(2).addClass('active').siblings().removeClass('active');
		$('.tab_content li').eq(2).show().siblings().hide();
	}
	if(classId == '3') {
		$('.tab_list li').eq(3).addClass('active').siblings().removeClass('active');
		$('.tab_content li').eq(3).show().siblings().hide();
	}
	if(classId == '4') {
		$('.tab_list li').eq(4).addClass('active').siblings().removeClass('active');
		$('.tab_content li').eq(4).show().siblings().hide();
	}
	if(classId == '5') {
		$('.tab_list li').eq(5).addClass('active').siblings().removeClass('active');
		$('.tab_content li').eq(5).show().siblings().hide();
	}
	if(classId == '6') {
		$('.tab_list li').eq(6).addClass('active').siblings().removeClass('active');
		$('.tab_content li').eq(6).show().siblings().hide();
	}
	if(classId == '7') {
		$('.tab_list li').eq(7).addClass('active').siblings().removeClass('active');
		$('.tab_content li').eq(7).show().siblings().hide();
	}
	if(classId == '8') {
		$('.tab_list li').eq(8).addClass('active').siblings().removeClass('active');
		$('.tab_content li').eq(8).show().siblings().hide();
	}
	if(classId == '9') {
		$('.tab_list li').eq(9).addClass('active').siblings().removeClass('active');
		$('.tab_content li').eq(9).show().siblings().hide();
	}
	$('.tab_list li').click(function() {
		var li_num = $(this).index();
		$('.tab_list li').eq(li_num).addClass('active').siblings().removeClass('active');
		$('.tab_content li').eq(li_num).show().siblings().hide();
	})

	//请求所有商品
	$.ajax({
		type: "post",
		url: baseurl + "/product/search.json",
		data: { token: getCookie("token"), isAdmin: 1, status: 0, currentPage: 1, pageSize: 100000 },
		success: function(data) {
			console.log(data);
			var len = data.datas.list.length;
			for(var i = 0; i < len; i++) {
				//商品积分
				var Points_html = '';
				if(data.datas.list[i].isPoints) {
					Points_html = '<p style="color: #2BC1FF;font-size: 0.18rem;">积分兑换：'+data.datas.list[i].pointsNum+'</p>';
				} else {
					Points_html = '';
				}
				var html = '';
				html += '<div class="service_content"><div class="img"><img src="' + data.datas.list[i].productThumbnail + '" alt="" /></div>' +
					'<div class="text"><p>' + data.datas.list[i].productName + '</p><p>' + data.datas.list[i].productDescribe + '</p>' +
					'<p style="margin-top: 10px;"><span style="color: #2BC1FF;">￥' + data.datas.list[i].productUnitPrice + '</span>'+Points_html+'<a href="p_detail.html?id=' + data.datas.list[i].id + '">申请使用</a>' +
					'</p></div></div>';
				$('.tab_content li').eq(0).append(html);
				if(data.datas.list[i].productClassifyName == "金融") {
					$('.tab_content li').eq(1).append(html);
				}
				if(data.datas.list[i].productClassifyName == "法律") {
					$('.tab_content li').eq(2).append(html);
				}
				if(data.datas.list[i].productClassifyName == "财务") {
					$('.tab_content li').eq(3).append(html);
				}
				if(data.datas.list[i].productClassifyName == "管理") {
					$('.tab_content li').eq(4).append(html);
				}
				if(data.datas.list[i].productClassifyName == "人事") {
					$('.tab_content li').eq(5).append(html);
				}
				if(data.datas.list[i].productClassifyName == "教育") {
					$('.tab_content li').eq(6).append(html);
				}
				if(data.datas.list[i].productClassifyName == "培训") {
					$('.tab_content li').eq(7).append(html);
				}
				if(data.datas.list[i].productClassifyName == "市场拓展") {
					$('.tab_content li').eq(8).append(html);
				}
				if(data.datas.list[i].productClassifyName == "云服务") {
					$('.tab_content li').eq(9).append(html);
				}
			}

		}
	});

})