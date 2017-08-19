//			设置cookie
			function addCookie(name, value, expiresHours) {
				var cookieString = name + "=" + escape(value);
				//判断是否设置过期时间 
				if(expiresHours > 0) {
					var date = new Date();
					date.setTime(date.getTime + expiresHours * 3600 * 1000);
					cookieString = cookieString + "; expires=" + date.toGMTString();
				}
				document.cookie = cookieString;
			}
			//获取cookie
			function getCookie(name) {
				var strCookie = document.cookie;
				var arrCookie = strCookie.split("; ");
				for(var i = 0; i < arrCookie.length; i++) {
					var arr = arrCookie[i].split("=");
					if(arr[0] == name) return arr[1];
				}
				return "";
			}
			function clearAllCookie() {
				var keys = document.cookie.match(/[^ =;]+(?=\=)/g);
				if(keys) {
					for(var i = keys.length; i--;)
						document.cookie = keys[i] + '=0;expires=' + new Date(0).toUTCString()
				}
			}