<template>
	<div id="app">
		<!--  <transition :name="transitionName"> -->
		<!-- <keep-alive> -->
			<router-view v-if="isRouterAlive" name="main">

			</router-view>
		<!-- </keep-alive> -->

		<!-- </transition> -->
	</div>
</template>

<script>
	import {
		MessageBox
	} from 'mint-ui';
	export default {
		name: "App",
		provide() {
			return {
				reload: this.reload
			}
		},
		data() {
			return {
				transitionName: "",
				timedown: this.arr,
				isRouterAlive: true
			};
		},
		created() {},
		watch: {
			// 使用watch 监听$router的变化
			$route(to, from) {
				clearInterval(window.t);
				clearInterval(window.t1);
				//如果to索引大于from索引,判断为前进状态,反之则为后退状态
				if (to.fullPath.indexOf("index") == -1) {
					clearInterval(window.tt0);
					clearInterval(window.tt1);
				}
				if (!(to.meta.none == "true" && from.meta.none == "true")) {
					if (to.meta.index >= from.meta.index) {
						//设置动画名称
						// this.transitionName = "slide-left";
					} else {
						// this.transitionName = "slide-right";
					}
				} else {
					// this.transitionName = "";
				}
			}
		},
		components: {
			MessageBox
		},
		mounted() {
			let that = this;

			/**
			 * 横竖屏
			 * @param {Object}
			 */
			function changeOrientation($print) {
				var width = document.documentElement.clientWidth;
				var height = document.documentElement.clientHeight;
				if (width < height) {
					$print.width(height);
					$print.height(width);
					$print.css('top', (height - width) / 2);
					$print.css('left', 0 - (height - width) / 2);
					$print.css('transform', 'rotate(90deg)');
					$print.css('transform-origin', '50% 50%');
				}
				var evt = "onorientationchange" in window ? "orientationchange" : "resize";
				window.addEventListener(evt, function() {
					setTimeout(function() {
						var width = document.documentElement.clientWidth;
						var height = document.documentElement.clientHeight;
						if (width > height) {
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
							$print.css('transform', 'rotate(90deg)');
							$print.css('transform-origin', '50% 50%');
						}
					}, 300);
				}, false);
			}
			changeOrientation($("#app"));


			// app返回键
			document.addEventListener("plusready", function() {
				var webview = plus.webview.currentWebview();
				plus.key.addEventListener("backbutton", function() {

					webview.canBack(function(e) {
						if (e.canBack) {
							that.$dialog.confirm({
								message: '确定要退出游戏吗?'
							}).then(() => {
								webview.close(); //hide,quit
								plus.runtime.quit();
							}).catch(() => {
								// on cancel
							});
							// plus.runtime.quit();
						} else {
							// webview.close(); //hide,quit
							// plus.runtime.quit();
							// document.plusReady(function() {
							// 	//首页返回键处理
							// 	//处理逻辑：1秒内，连续两次按返回键，则退出应用；
							// 	var first = null;
							// 	plus.key.addEventListener(
							// 		"backbutton",
							// 		function() {
							// 			//首次按键，提示‘再按一次退出应用’
							// 			if (!first) {
							// 				first = new Date().getTime();
							// 				alert("再按一次退出应用");
							// 				setTimeout(function() {
							// 					first = null;
							// 				}, 1000);
							// 			} else {
							// 				if (new Date().getTime() - first < 1500) {
							// 					plus.runtime.quit();
							// 				}
							// 			}
							// 		},
							// 		false
							// 	);
							// });
						}
					});
				});
			});


		},
		methods: {
			reload() {
				let that = this;
				that.isRouterAlive = false
				that.$nextTick(function() {
					that.isRouterAlive = true
				})
			}
		},

	};
</script>
<style>
	@import "./assets/iconfont/iconfont.css";
	@import "./common/font/font.css";

	/* 横竖屏 样式*/
	@media screen and (orientation: portrait) {
		#app {
			-webkit-transform: rotate(-90deg);
			-moz-transform: rotate(-90deg);
			-ms-transform: rotate(-90deg);
			transform: rotate(-90deg);
			width: 100vh;
			height: 100vh;
			/*  去掉overflow 微信显示正常，但是浏览器有问题，竖屏时强制横屏缩小 */
			overflow: hidden;
		}
	}

	@media screen and (orientation: landscape) {
		#app {
			-webkit-transform: rotate(0);
			-moz-transform: rotate(0);
			-ms-transform: rotate(0);
			transform: rotate(0);
		}
	}

	#app {
		font-family: "Avenir", Helvetica, Arial, sans-serif;
		-webkit-font-smoothing: antialiased;
		-moz-osx-font-smoothing: grayscale;
		color: #2c3e50;
		position: fixed;
		left: 0;
		bottom: 0;
	}

	body {
		background: #fff;
		/* font-family: FZCT; */
		position: fixed !important;
	}

	input,
	textarea,
	select,
	button,
	a:focus {
		outline: none;
	}

	#app,
	.main {
		width: 100%;
		height: 100%;
		overflow: hidden;
	}

	a {
		text-decoration: none;
	}

	ul {
		list-style: none;
	}

	.van-dialog {
		width: 50% !important;
	}

	/* .slide-right-enter-active,
.slide-right-leave-active,
.slide-left-enter-active,
.slide-left-leave-active {
  will-change: transform;
  transition: all 500ms;
  position: absolute;
}
.slide-right-enter {
  opacity: 0;
  transform: translate3d(-100%, 0, 0);
}
.slide-right-leave-active {
  opacity: 0;
  transform: translate3d(100%, 0, 0);
}
.slide-left-enter {
  opacity: 0;
  transform: translate3d(100%, 0, 0);
}
.slide-left-leave-active {
  opacity: 0;
  transform: translate3d(-100%, 0, 0);
} */
</style>
