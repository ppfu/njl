<template>
	<div id="shopping" @click="closeDialog">
		<div class="shop_content" v-show="lang_dlg">
			<span>暂未开放</span>
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
				fileList: [],
			};
		},
		created: function() {

		},
		//数据保存到session
		watch: {


		},
		mounted: function() {

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
		}
	};
</script>

<style>


	#shopping {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background: rgba(0, 0, 0, 0.6);
		overflow: hidden;
		z-index: 100;
	}

	.shop_content {
		position: absolute;
		top: 50%;
		left: 50%;
		margin-left: -0.7rem;
		margin-top: -0.32rem;
		width: 1.4rem;
		height: 0.64rem;
		background: url(../assets/img/tck.png) no-repeat center center;
		background-size: 100% 100%;
		display: flex;
		justify-content: center;
		align-items: center;
	}
   .shop_content span{
	   /* position: absolute; */
	   width: 1.02rem;
	   /* top: 0.2rem;
	   left: 0.2rem; */
	   /* font-family:'FZCY'; */
	   font-size: 0.24rem;
	  color: #F7FBED;
	  text-shadow: -0.001rem 0.001rem 0.002rem #B26901, 0.001rem 0.001rem 0.008rem #B26901;
   }
	
</style>
