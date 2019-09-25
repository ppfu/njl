<template>
	<div id="notice">
		<transition name="showN">
			<div v-show="show_notice" class="not_con"></div>
		</transition>



	</div>
</template>

<script>
	export default {
		data() {
			return {
				show_notice: false,
				time: 0,
				Dialog:true,
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
				that.showNotice();
				if (that.time >= 30) {
					clearInterval(interval)
					that.$router.push({
						path: '/loader',
					});
				}
			}, 100);
		},
		methods: {
			showNotice() {
				let that = this;
				that.show_notice = true;

			},
		}
	};
</script>

<style scoped="scoped">
	#notice {
		width: 100%;
		height: 100%;
		overflow: hidden;

	}

	.not_con {
		width: 100%;
		height: 100%;
		background: url(../assets/img/notice.jpg) no-repeat center center;
		background-size: 100% 100%;
	}

	.showN-enter-active,
	.showN-leave-active {
		transition: all 2s linear;
		/* transform: translateX(0%); */
	}

	.showN-enter,
	.showN-leave {
		/* transform: translateX(0%); */
		opacity: 0;
	}

	.showN-leave-to {
		/* transform: translateX(-100%); */
		opacity: 1;
	}
</style>
