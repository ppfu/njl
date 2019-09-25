<template>
	<div id="loader">
		<!-- <div class="logo">
			<img src="../assets/img/logo.png" />
		</div> -->
		<div class="in_load">
			<h5>游戏载入中......</h5>
			<van-progress 
			:percentage="num" 
			 pivot-color="#06cdee"
			 color="linear-gradient(to right, #68e1f5, #06cdee)" />
			<img src="../assets/img/no_text.png" />
		</div>
	</div>
</template>

<script>
	export default {
		data() {
			return {
              num : 0,
			};
		},
		created: function() {

		},
		//数据保存到session
		watch: {


		},
		mounted: function() {
			    var that = this;
             	var interval = setInterval(function() {
             	that.num = that.num + 1;
             	if (that.num >= 100) {
             		clearInterval(interval)
					that.$router.push({
						path: '/login',
					});
             	}
             }, 50);
		},
		methods: {
			
		}
	};
</script>

<style scoped="scoped">
	#loader {
		width: 100%;
		height: 100%;
		overflow: hidden;
		background: url(../assets/img/bg_loader.jpg) no-repeat center center;
		background-size: 100% 100%;
		z-index: 100;
	}

	/* .logo {
		width: 100%;
		display: flex;
		justify-content: center;
		margin-top: 0.8rem;

	}

	.logo img {
		display: block;
		width: 3.566rem;
		height: 100%;
	} */

	.in_load {
		width: 100%;
		height: 100%;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		margin-top: 0.8rem;
	}
	.in_load h5 {
		font-size: 0.18rem;
		color: #fff;
		font-weight: normal;
		font-family: "PingFangSC-regular";
		padding-bottom: 0.1rem;
	}
	.van-progress{
		height: 0.12rem;
		width: 6rem;
		border-radius: 0.3rem;
		box-shadow: 0.02rem 0.04rem 0.06rem #056979;
	}
	.in_load  img{
		width: 78%;
		padding-top: 0.2rem;
		
	}
</style>
