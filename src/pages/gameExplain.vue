<template>
	<div id="inform">
		<div class="info_content" v-show="lang_dlg">
			<img class="title" src="../assets/img/btkp.png" />
			<h2>游戏说明</h2>
			<img @click="closeDialog" class="close" src="../assets/img/gb.png" />
			<!-- 我的分店 -->
			<div class="back_info" >
			    <div class="info" v-html="explain">
					
				</div>
			</div>
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
				explain:''//游戏说明
				
			};
		},
		created: function() {

		},
		//数据保存到session
		watch: {


		},
		mounted: function() {
             var that = this;
			 that.getGameExplain();
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
			//获取游戏说明
			getGameExplain() {
				let that = this;
				that
					.$http({
						url: "Home/gameExplain",
						method: "post",
						data: {
							token: sessionStorage.getItem("token")
						}
					})
					.then(function(res) {
						if (res.data.code == 0) {
							that.explain = res.data.data; 
						} else {
							//失败
							that.$toast(res.data.msg);
						}
					})
					.catch(function(error) {
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
	#inform {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background: rgba(0, 0, 0, 0.6);
		overflow: hidden;
		z-index: 100;
	}

	.info_content {
		position: absolute;
		top: 50%;
		left: 50%;
		margin-left: -2.6rem;
		margin-top: -1.8rem;
		width: 5.2rem;
		height: 3.68rem;
		background: url(../assets/img/k-1.png) no-repeat center center;
		background-size: 110% 100%;
		display: flex;
		justify-content: center;
	}

	.info_content img.title {
		position: absolute;
		width: 4.2rem;
		top: 0.02rem;
		left: 0.44rem;
		z-index: 9;
	}

	.info_content img.close {
		position: absolute;
		width: 0.46rem;
		right: 0.14rem;
		top: 0.1rem;
	}

	.info_content h2 {
		position: absolute;
		width: 1.02rem;
		top: 0.32rem;
		left: 2.2rem;
		/* font-family:'FZCY'; */
		color: #fff;
		font-size: 0.18rem;
		/* font-weight: 600; */
		text-shadow: -0.001rem 0.001rem 0.008rem #B26901, 0.004rem 0.004rem 0.001rem #B26901;
		z-index: 10;
	
	}
	.back_info {
		width: 68%;	
		margin-top: 0.8rem;
		margin-left: -0.1rem;
		background: url(../assets/img/k-2.png) no-repeat 0 0.2rem;
		background-size: 100% 62%;
		padding-top: 0.4rem;
		padding-left: 0.04rem;
	}
	.back_info .info{
		width: 100%;
		height: 1.46rem;
		overflow-y: scroll;
		text-indent: 0.2rem;
	}
	.back_info .info p span{
		padding-top: 0.04rem;
		font-size: 0.12rem !important;
		color: #F07923;
	/* 	text-shadow: 0.004rem 0.004rem 0.01rem #4e1a0d; */
		
	}
	
</style>
