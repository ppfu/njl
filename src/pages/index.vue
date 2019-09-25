<template>
	<div id="login">
		<div class="logo" @click="gotoNotice">
			<transition name="showL">
				<img v-show="show_index" src="../assets/img/logo.png" />
			</transition>
			<!-- 左边云 -->
			<!-- <div v-show="cloudShow" class="yun_left"></div> -->
              <audio autoplay="autoplay"  preload webkit-playsinline="true"  playsinline="true"  id="myaudio">
                  <source src="../assets/img/music.mp3">
                  您的浏览器不支持 audio 标签。
              </audio>
		</div>
	</div>
</template>

<script>
	export default {
		data() {
			return {
				show_index: false,
				time: 0,
			};
		},
		created: function() {

		},
		//数据保存到session
		watch: {


		},
		mounted: function() {
			let that = this;
			
			var interval = setInterval(function() {
				that.time = that.time + 1;
				that.showLogo();
				if (that.time >= 30) {
					clearInterval(interval)
					that.$router.push({
						path: '/notice',
					});
				}
			}, 100);
		},
		methods: {
			gotoNotice() {
				let that = this;
				that.$router.push({
					path: '/notice',
				});
			},
			showLogo() {
				let that = this;
				that.show_index = true;
				// that.$router.push({
				// 	path: '/notice',
				// });
			},
		}
	};
</script>

<style scoped="scoped">
	#login {
		width: 100%;
		height: 100%;
		overflow: hidden;
	}

	.logo {
		width: 100%;
		height: 100%;
		display: flex;
		justify-content: center;
		align-items: center;
	}
	.logo img {
		display: block;
		width: 3.566rem;
	}
	.showL-enter-active,
	.showL-leave-active {
		transition: all 2s linear;
		/* transform: translateX(0%); */
	}

	.showL-enter,
	.showL-leave {
		/* transform: translateX(0%); */
		opacity: 0;
	}

	.showL-leave-to {
		/* transform: translateX(-100%); */
		opacity: 1;
	}

	
</style>
