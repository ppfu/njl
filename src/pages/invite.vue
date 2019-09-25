<template>
	<div id="invite" v-show="lang_dlg">
		<div id="poster" class="poster">
		<img class="po_img"  :src="invitation.poster" />  
		  </div>
		<div class="in_content">
			
			      <div class="code_img">
					  <img class="img_info" :src="invitation.invitation_img" />
				  </div>
				  <button>{{invitation.invitation_code}}</button>
				 
		</div>
		 <div class="in_close" @click="closeDialog()">
			<img src="../assets/img/close.png" />
		</div>
	</div>

</template>

<script>
	export default {
		components: {

		},
		data() {
			return {
				lang_dlg: true,
				invitation:[],//邀请好友数据
           
			};
		},
		created: function() {

		},
		//数据保存到session
		watch: {


		},
		mounted: function() {
          let that = this;
		  that.getInvitation();
		  	/**
		  	 * 横竖屏
		  	 * @param {Object}
		  	 */
		  function changeOrientation($print) {
		  		var width = document.documentElement.clientWidth;
		  		var height = document.documentElement.clientHeight;
				console.log(width)
				console.log(height)
		  		if(width > height) {
		  			$print.width(height);
		  			$print.height(width);
		  			$print.css('top', (height - width) / 2);
		  			$print.css('left', 0 - (height - width) / 2);
		  			$print.css('transform', 'rotate(-90deg)');
		  			$print.css('transform-origin', '50% 50%');
		  		}
		  		var evt = "onorientationchange" in window ? "orientationchange" : "resize";
		  		window.addEventListener(evt, function() {
		  			setTimeout(function() {
		  				var width = document.documentElement.clientWidth;
		  				var height = document.documentElement.clientHeight;
		  				if(width < height) {
		  					$print.width(width);
		  					$print.height(height);
		  					$print.css('top', 0);
		  					$print.css('left', 0);
		  					$print.css('transform', 'none');
		  					$print.css('transform-origin', '50% 50%');
		  				} else {
		  					$print.width(height);
		  					$print.height(width);
		  					$print.css('top', (height - width) / 2);
		  					$print.css('left', 0 - (height - width) / 2);
		  					$print.css('transform', 'rotate(-90deg)');
		  					$print.css('transform-origin', '50% 50%');
		  				}
		  			}, 300);
		  		}, false);
		  	}
		  changeOrientation($("#poster"));
		},
		methods: {
			//关闭确认弹窗
			closeDialog: function() {
				var that = this;
				that.lang_dlg = false;
				that.$router.push({
					path: '/homepage'
				})
			},
			//获取邀请好友数据
			getInvitation() {
				let that = this;
				that
					.$http({
						url: "Home/invitation",
						method: "post",
						data: {
							token: sessionStorage.getItem("token"),
						}
					})
					.then(function(res) {
						if (res.data.code == 0) {
							//成功回调
							that.invitation = res.data.data;
							console.log(that.invitation)
						} else {
							//失败
							that.$toast(res.data.msg);
						}
						// Indicator.close();
					})
					.catch(function(error) {
						// Indicator.close();
						that.$toast({
							message: "网络连接失败",
							position: "bottom",
							duration: 5000
						});
					});
			},
		}
	};
</script>

<style>

	#invite {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background-size: 100%;		
		overflow: hidden;
		z-index: 100;
		
				
	}
	/* 横竖屏 样式*/
	@media screen and (orientation: portrait) {
	  #poster {
	    -webkit-transform: rotate(-90deg);
	    -moz-transform: rotate(-90deg);
	    -ms-transform: rotate(-90deg);
	    transform: rotate(-90deg);
	    width: 100vh;
	    height: 100vw;
	  /*  去掉overflow 微信显示正常，但是浏览器有问题，竖屏时强制横屏缩小 */
	    overflow: hidden;
	  }
	}
	
	@media screen and (orientation: landscape) {
	  #poster {
	    -webkit-transform: rotate(0);
	    -moz-transform: rotate(0);
	    -ms-transform: rotate(0);
	    transform: rotate(0);
	  }
	}
	.poster{
		position: absolute;
		/* right: 50%;
		bottom: 50%; */
		width: 100%;
		/* transform: rotate(-90deg); */
		height: 100%;
	}
	.poster .po_img{
		width: 100%;
		height: 100%;
		display: block;
		
	}
	.in_content {
	width: 100%;
	 height: 100%;
	 display: flex;
	 flex-direction: column;
	 justify-content: center;
	 align-items: center;
	transform: rotate(-90deg);
	 
	}
	
	.code_img {
		width: 0.88rem;
		height: 0.88rem;
		margin-top: 2.3rem;
		background: #0086B3;
		z-index: 9999;
	}
	.code_img .img_info{
		display: block;
		width: 100%;
		height: 100%;
	}
	.in_content button{
		width: 1.04rem;
		height:0.26rem;
		margin-top: 0.22rem;
		border-radius: 1rem;
		background: none;
		border: none;
		font-size: 0.18rem;
		font-weight: bold;
		font-family: "Avenir", Helvetica, Arial, sans-serif;
	    color: #A2774D;
	}
	.in_close{
		position: absolute;
		width: 0.4rem;
		left: 0.2rem;
		top: 0.2rem;
	}
	.in_close img{
		width: 100%;
	}
	
</style>
