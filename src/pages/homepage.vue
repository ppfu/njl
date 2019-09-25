<template>
	<div id="home">
		<!-- @touchstart="down" @touchmove="move" @touchend="end" -->
		<div id="home_bg" class="home_bg">
			<v-touch class="home_bg" v-on:pinchstart="pinchstart($event)" v-bind:pinchstart-options="{direction : 'horizontal' , threshold: 50}"
			 v-on:pinchmove="pinchmove($event)" v-bind:pinchmove-options="{direction : 'horizontal' , threshold: 50}">
				<div id="home_con" class="home_con">
					<img class="bg-img" v-if="type == 1" src="../assets/img/bg-one.jpg" />
					<img class="bg-img" v-if="type == 2" src="../assets/img/bg-two.jpg" />
					<img class="bg-img" v-if="type == 3" src="../assets/img/bg-three.jpg" />
					<img class="bg-img" v-if="type == 4" src="../assets/img/bg-four.jpg" />
					<img class="build_img build_img1" v-if="type == 1" src="../assets/img/1.png" />
					<img class="build_img build_img2" v-if="type == 2" src="../assets/img/2.png" />
					<img class="build_img build_img3" v-if="type == 3" src="../assets/img/3.png" />
					<img class="build_img build_img4" v-if="type == 4" src="../assets/img/4.png" />
			<!-- 		<div @click.stop class="task_list">
						<div class="feed" v-for="(item , index) in feed" :key="item.id">
							<div>
								<a>{{index+1}}</a>
								<transition name="slide-feed">
									<div class="task_type" v-if="activeFeedIndex == index" @click="taskFinish(item,index)">
										<span>喂养+</span>
										<img src="../assets/img/jinbi.gif" />
									</div>

								</transition>
							</div>
						</div>
						<div class="feed water" v-for="(item , index) in watering" :key="item.id">
							<a>{{index+1}}</a>
							<transition name="slide-feed">
								<div class="task_type" v-if="activeIndex ==index" @click="taskFinish(item,index)">
									<span>浇水+</span>
									<img src="../assets/img/jinbi.gif" />
								</div>
							</transition>
						</div>
						<div class="feed sweep" v-for="(item , index) in clean" :key="item.id">
							<a>{{index+1}}</a>
							<transition name="slide-feed">
								<div class="task_type" v-if="activeCleanIndex ==index" @click="taskFinish(item,index)">

									<span>清扫+</span>
									<img src="../assets/img/jinbi.gif" />
								</div>
							</transition>
						</div>
						<div class="rubbish" v-show="clean != undefined">
							<img src="../assets/img/lj.png" />
						</div>

						<div class="person">
					<img src="../assets/img/ren.png" />
					</div> -->
				</div>
			</v-touch>
		</div>
		<div @click.stop class="home_header">
			<div class="account">
				<div class="header" @click="showHeader">
					<img :src="$store.state.head_portrait" />
				</div>
				<p @click="showperson">{{HomeInfo.username}}<span>LV.<a>{{HomeInfo.level}}</a></span></p>
				<!-- <span class="dengji"></span> -->
			</div>
			<div class="notice">
				<img src="../assets/img/gg.png" />
				<span>中奖浮动公告：</span>
				<span class="textBox">
					<transition name="slide">
						<a :key="number" class="text">{{notice_info}}</a>
					</transition>
				</span>

			</div>
			<div v-show="home_show" class="gold" @click="showDialog">
				<img src="../assets/img/jb.png" />
				<transition name="bounce">
					<span class="addAsset" v-show="HideAsset">{{addAssets}}</span> <!-- 增加资产 -->
				</transition>
				<span class="asset">{{assets}}</span><!-- 总资产 -->
			</div>
		</div>
		<div @click.stop v-show="home_show" class="home_left">
			<img @click="showInvite" src="../assets/img/yq.png" />
			<img @click="showTurntable" src="../assets/img/zp.png" />
		</div>
		<div @click.stop class="home_right">
			<img @click="showExplain" src="../assets/img/sm.png" />
			<img @click="showInfo" src="../assets/img/tz.png" />
		</div>
		<div @click.stop class="home_bottom">
			<div class="bottom_img">
				<img @click="showShop" src="../assets/img/sc.png" />
				<img @click="showDeal" src="../assets/img/jyx.png" />
				<img @click="showLease" src="../assets/img/zl.png" />
				<img @click="showSub" src="../assets/img/fd.png" />
				<img @click="showJour" src="../assets/img/rz.png" />
				<img @click="showRank" src="../assets/img/phb.png" />
				<img @click="showSetting" src="../assets/img/sz.png" />
			</div>
		</div>
		<!-- <div @click.stop class="task">
			<img @click="oneFinish" src="../assets/img/rw.png" />
		</div> -->
		<transition name="moveL">
			<!-- 左边云 -->
			<div v-show="cloudShow" class="yun_left"></div>
		</transition>
		<transition name="moveR">
			<!-- 右边云 -->
			<div v-show="cloudShow" class="yun_right"></div>
		</transition>
		<router-view name="child"></router-view>
		<audio :autoplay="true" :controls="true" :loop="true" ref="warningMusic" preload webkit-playsinline="true"
		 playsinline="true" id="audio">
			<source src="../assets/img/music.mp3">
		</audio>
	</div>
</template>

<script>
	export default {
		components: {

		},
		data() {
			return {
				lang_dlg: true,
				home_show: true,
				home_hide: true,
				cloudShow: true,
				showball: false,
				bgInfo: {
					scale: 1,
					bodyWidth: '',
					bodyHeight: '',
					bgWidth: '',
					bgHeight: '',
				},
				HomeInfo: [], //首页数据
				head_portrait: '', //用户头像
				assets: '', //用户资产
				notice: [], //浮动公告
				notice_info: '', //浮动公告
				number: 0, //浮动公告第几条
				type: '', //房屋图片
				watering: [], //浇水任务列表
				clean: [], //清扫任务
				feed: [], //喂养任务
				HideAsset: true,
				// showAsset: true,
				time: 0,
				addAssets: '', //增加金币
				activeIndex: '', //点击当前浇水任务
				activeCleanIndex: '', //点击当前清扫任务
				activeFeedIndex: '', //点击当前喂养任务
				total_asstes: '', //总资产
				scaleArr: [1, 2], //移动第一个数字 第二个数字
				sum: 1,


			};
		},
		// 		created: function() {
		// 			
		// 
		// 		},
		activated: function() {
			var that = this;
			that.getHomeInfo();
		},

		watch: {

		},
		mounted: function() {
			var that = this;
			that.assets = Number(that.$store.state.assets);
			// that.$store.commit("addAssets");
			// that.total_asstes = (that.assets).toFixed(2)
			console.log(that.assets)
			// console.log(that.type)
			that.bgInfo.bgWidth = $(window).width(),
				that.bgInfo.bgHeight = $(window).height(),
				that.bgInfo.bodyWidth = $(window).width(),
				that.bgInfo.bodyHeight = $(window).height();
			that.getHomeInfo();
			that.startMove();
			that.cloudHide();
			that.getTask();
			that.playAudio();
			//锁屏
			// document.addEventListener('visibilitychange', function() {
			//   // var audio = document.getElementById("audio");
			//   // console.log(audio)
			//   if(document.hidden) {
			//     that.closeAudio();
			//     console.log("页面非激活,暂定播放");
			//   } else {
			//    that.playAudio();
			//     console.log("页面激活， 继续播放")
			//   }
			// })	
						function handleVisibilityChange() {
							if (document.hidden) {
								 that.closeAudio();
								 console.log("页面非激活,暂定播放");
							} else {
								that.playAudio();
								console.log("页面激活， 继续播放")
							}
						}
			
						document.addEventListener("visibilitychange", handleVisibilityChange, false);
			



		},
		methods: {
			// tapBig: function() {
			// 	let that = this;
			// 	if (that.bgInfo.scale <= 1.9) {
			// 		that.bgInfo.scale += 0.1;
			// 		that.bgInfo.scale = Number(that.bgInfo.scale.toFixed(1));
			// 		that.bgInfo.bgWidth = that.bgInfo.bodyWidth * that.bgInfo.scale;
			// 		that.bgInfo.bgHeight = that.bgInfo.bodyHeight * that.bgInfo.scale;
			// 		$(".home_con").css("width", that.bgInfo.bgWidth);
			// 		$(".home_con").css("height", that.bgInfo.bgHeight);
			// 		console.log(that.bgInfo.scale, that.bgInfo.bgWidth, that.bgInfo.bgHeight);
			// 	}
			// },
			// 双击放



			//播放音乐
			playAudio() {
				let _this = this;
				// console.log("播放音乐");
				let musicDom = document.getElementsByTagName('audio')[0];
				musicDom.load(); //因为source标签不能直接更改路径，所以整个audio标签必须重新加载一次
			},
			//关闭音乐播放器   
			closeAudio() {
				let _this = this;
				console.log("关闭音乐播放器");
				let musicDom = document.getElementsByTagName('audio')[0];
				musicDom.pause();
				// _this.$refs.warningMusic.pause();
			},
			//获取任务列表
			getTask() {
				let that = this;
				that
					.$http({
						url: "Home/taskList",
						method: "post",
						data: {
							token: sessionStorage.getItem("token")
						}
					})
					.then(function(res) {
						if (res.data.code == 0) {
							that.watering = res.data.data.watering; //浇水任务
							that.clean = res.data.data.clean; //清扫任务
							that.feed = res.data.data.feed; //喂养任务
							if (that.watering != undefined) {
								that.activeIndex = that.watering.length - 1;
								console.log(that.activeIndex)
							}
							if (that.clean != undefined) {
								that.activeCleanIndex = that.clean.length - 1;
								// console.log(that.activeIndex)
							}
							if (that.feed != undefined) {
								that.activeFeedIndex = that.feed.length - 1;
								// console.log(that.activeIndex)
							}
							console.log(that.feed)
							// console.log(that.assets)
						} else {
							//失败
							that.$toast(res.data.msg);
						}
					})
					.catch(function(error) {
						that.$toast({
							message: "网络连接失",
							position: "bottom",
							duration: 5000
						});
					});
			},
			//获取s首页信息
			getHomeInfo() {
				let that = this;
				that
					.$http({
						url: "Home/index",
						method: "post",
						data: {
							token: sessionStorage.getItem("token")
						}
					})
					.then(function(res) {
						console.log(res)
						if (res.data.code == 0) {
							that.HomeInfo = res.data.data; //首页信息
							that.head_portrait = that.HomeInfo.head_portrait; //首页头像
							window.localStorage.setItem('head_portrait', that.head_portrait);
							that.assets = that.HomeInfo.assets.toFixed(2); //用户资产
							window.localStorage.setItem('assets', that.assets);
							that.notice = res.data.data.notice; //浮动公告列表
							that.type = res.data.data.type; //房屋图片
							// console.log(that.notice)
							// that.type = 1;
							// that.task = res.data.data.task; //任务列表

							// window.localStorage.setItem('task', JSON.stringify(that.task));
							// that.task_type = res.data.data.task.type;
							// // console.log(that.task)
							// console.log(that.notice)
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
			//浮动公告滚动
			startMove() {
				var that = this;
				// console.log(that.notice.length)
				if (that.notice.length >= 0) {
					let timer = setTimeout(() => {
						if (that.number === that.notice.length - 1) {
							that.number = 0;
						} else {
							that.number += 1;
						}
						that.notice_info = that.notice[that.number].content;
						that.startMove();
					}, 2000); // 滚动不需要停顿则将2000改成动画持续时间
				}



			},
			//云消失
			cloudHide() {
				let that = this;
				that.cloudShow = false;
			},
			pinchstart(e) {
				let that = this;
				that.sum = 0;
				that.scaleArr = [1, 2];
			},
			pinchmove(e) {
				let that = this;
				var scale = Number(e.scale);
				that.scaleArr.shift(); //删除第一项
				that.scaleArr.push(scale); //向后添加一项
				that.sum = that.scaleArr[1] - that.scaleArr[0];
				if (that.sum != 0) {
					that.big(that.sum);
				}
			},
			//点击放大
			big(sum) {
				var that = this;
				var num = that.bgInfo.scale + sum;
				if (num > 1 && num < 2) {
					that.bgInfo.scale = num;
				}
				that.bgInfo.bgWidth = that.bgInfo.bodyWidth * that.bgInfo.scale;
				that.bgInfo.bgHeight = that.bgInfo.bodyHeight * that.bgInfo.scale;
				$(".home_con").css("width", that.bgInfo.bgWidth);
				$(".home_con").css("height", that.bgInfo.bgHeight);
			},

			//复原
			recover() {
				var that = this;
				if (that.bgInfo.scale > 1) {
					that.bgInfo.scale = 1;
					that.bgInfo.bgWidth = that.bgInfo.bodyWidth * that.bgInfo.scale;
					that.bgInfo.bgHeight = that.bgInfo.bodyHeight * that.bgInfo.scale;
					$(".home_con").css("width", that.bgInfo.bgWidth);
					$(".home_con").css("height", that.bgInfo.bgHeight);
				}
			},
			//完成任务
			taskFinish(item, index) {
				let that = this;
				console.log(item.type)
				// that.getTask();
				let task_id = item.id;
				let task_money = Number(item.money);
				console.log(task_money);
				window.localStorage.setItem('task_money', task_money);
				that.$http({
						url: "Home/taskFinish",
						method: "post",
						data: {
							token: sessionStorage.getItem("token"),
							id: task_id,
						}
					})
					.then(function(res) {
						if (res.data.code == 0) {
							// that.$store.commit("addAssets");
							if (item.type == 1) {
								if (that.activeIndex == index) {
									setTimeout(function() {
										that.watering.splice(index, 1);
										that.$toast(res.data.msg);
									}, 1200);
									console.log(that.watering);
								}
								that.activeIndex--;
							} else if (item.type == 2) {
								console.log(that.activeCleanIndex, index);
								if (that.activeCleanIndex == index) {
									setTimeout(function() {
										that.clean.splice(index, 1);
										that.$toast(res.data.msg);
									}, 1200);
									console.log(that.clean);
								}
								that.activeCleanIndex--;
							} else if (item.type == 3) {
								console.log(that.activeFeedIndex, index);
								if (that.activeFeedIndex == index) {
									setTimeout(function() {
										that.feed.splice(index, 1);
										that.$toast(res.data.msg);
									}, 1200);
									console.log(that.feed);
								}
								that.activeFeedIndex--;
							}
							// 成功回调
							setTimeout(function() {
								that.HideAsset = false;
							}, 500);
							that.addAssets = '+' + task_money;
							that.assets = (+that.assets) + (+task_money);
							that.assets = Number((that.assets).toFixed(2));
							window.localStorage.setItem('assets', that.assets);
							console.log(that.assets)
						} else {
							//失败
							that.$toast(res.data.msg);
						}
					})
					.catch(function(error) {});

			},
			//一键完成任务
			oneFinish() {
				let that = this;
				// window.localStorage.setItem('task_money', "");
				var waterAss = 0; //浇水资产
				if (that.watering != undefined) {
					for (var i = 0; i < that.watering.length; i++) {
						waterAss += Number(that.watering[i].money);
						// console.log(that.watering)
						// console.log(waterAss)
					}
				}
				var feedAss = 0; //喂养资产
				if (that.feed != undefined) {
					for (var i = 0; i < that.feed.length; i++) {
						feedAss += Number(that.feed[i].money);
						// console.log(feedAss)
					}
				}
				var cleanAss = 0; //喂养资产
				if (that.clean != undefined) {
					for (var i = 0; i < that.clean.length; i++) {
						cleanAss += Number(that.clean[i].money);

					}
				}
				var assetOne = ((+waterAss) + (+feedAss) + (+cleanAss)).toFixed(2);
				console.log(assetOne)
				window.localStorage.setItem('assetOne', assetOne);
				that.$http({
						url: "Home/oneFinish",
						method: "post",
						data: {
							token: sessionStorage.getItem("token"),
						}
					})
					.then(function(res) {
						console.log(res)
						if (res.data.code == 0) {
							//成功回调							
							that.addAssets = "+" + assetOne;
							that.assets = (+that.assets) + (+assetOne);
							window.localStorage.setItem('assets', that.assets);
							// that.$store.commit("addAssets");
							that.getTask();
						} else {
							//失败
							that.$toast(res.data.msg);
						}
					})
					.catch(function(error) {});

			},
			//弹出确认弹窗资产
			showDialog: function() {
				var that = this;
				that.recover();
				that.$router.push({
					path: '/property'
				})

			},
			//个人资料
			showperson: function() {
				var that = this;
				that.recover();
				that.$router.push({
					path: '/personalData'
				})

			},
			//头像
			showHeader: function() {
				var that = this;
				that.recover();
				that.$router.push({
					path: '/portrait'
				})

			},
			//租赁中心
			showLease: function() {
				var that = this;
				that.recover();
				that.$router.push({
					path: '/lease'
				})

			},
			//交易中心
			showDeal: function() {
				var that = this;
				that.recover();
				that.$router.push({
					path: '/deal'
				})

			},
			//我的分店
			showSub: function() {
				var that = this;
				that.recover();
				that.$router.push({
					path: '/subbranch'
				})

			},
			//经营日志
			showJour: function() {
				var that = this;
				that.recover();
				that.$router.push({
					path: '/journal'
				})

			},
			//系统通知
			showInfo: function() {
				var that = this;
				that.recover();
				that.$router.push({
					path: '/inform',
				})

			},
			//游戏说明
			showExplain: function() {
				var that = this;
				that.recover();
				that.$router.push({
					path: '/gameExplain',
				})

			},
			//设置
			showSetting: function() {
				var that = this;
				that.recover();
				that.$router.push({
					path: '/setting',
				})

			},
			//转盘
			showTurntable: function() {
				var that = this;
				that.recover();
				that.$router.push({
					path: '/turntable',
				})

			},
			//邀请好友
			showInvite: function() {
				var that = this;
				that.recover();
				that.$router.push({
					path: '/invite',
				})

			},
			//排行榜
			showRank: function() {
				var that = this;
				that.recover();
				that.$router.push({
					path: '/ranking',
				})

			},
			//商城
			showShop: function() {
				var that = this;
				that.recover();
				that.$router.push({
					path: '/shopping',
				})

			},

		}
	};
</script>

<style scoped="scoped">
	#home {
		width: 100vw;
		height: 100vh;
		/* overflow: hidden; */
		/* position: relative;
		display: flex;
		justify-content: center;
		align-items: center; */
		overflow: hidden;
	}

	#audio {
		position: absolute;
		z-index: -99;
		opacity: 0;
	}

	/* 左边云 */
	.yun_left {
		width: 100%;
		height: 100%;
		background: url(../assets/img/yun-left.png) no-repeat;
		/* background: #FF0000; */
		background-size: 100% 100%;
		position: absolute;
		left: 0;
		top: 0;
		z-index: 9999;
	}

	.moveL-enter-active,
	.moveL-leave-active {
		transition: all 4s linear;
		transform: translateX(0%);
	}

	.moveL-enter,
	.moveL-leave {
		transform: translateX(0%);
		opacity: 1;
	}

	.moveL-leave-to {
		transform: translateX(-100%);
		opacity: 0;
	}

	/* 右边云 */
	.yun_right {
		width: 100%;
		height: 100%;
		background: url(../assets/img/yun-right.png) no-repeat;
		/* background: #FF0000; */
		background-size: 100% 100%;
		position: absolute;
		right: 0;
		top: 0;
		z-index: 9999;
	}

	.moveR-enter-active,
	.moveR-leave-active {
		transition: all 4s linear;
		transform: translateX(0%);
	}

	.moveR-enter,
	.moveR-leave {
		transform: translateX(0%);
		opacity: 1;
	}

	.moveR-leave-to {
		transform: translateX(100%);
		opacity: 0;
	}

	.home_bg {
		position: absolute;
		width: 100%;
		height: 100%;
		overflow: scroll;
		touch-action: auto !important;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		font-size: 0;
		line-height: 0;
	}

	/* .one_bg {
		background: url(../assets/img/bg-one.jpg) no-repeat 0 0 /100% 100%;
	}

	.two_bg {
		background: url(../assets/img/bg-two.jpg) no-repeat 0 0 /100% 100%;
	}

	.three_bg {
		background: url(../assets/img/bg-three.jpg) no-repeat 0 0 /100% 100%;
	}

	.four_bg {
		background: url(../assets/img/bg-four.jpg) no-repeat 0 0 /100% 100%;
	} */

	.home_con {
		position: relative;
		width: 100%;
		height: 100%;
		/* overflow: hidden; */
	}

	.home_con img.build_img {
		position: absolute;
	}

	.build_img1,
	.build_img2,
	.build_img3 {
		left: 0;
		right: 0;
		bottom: 0;
		top: 0;
		width: 70%;
		height: auto;
		margin: auto;
	}

	.build_img4 {
		width: 84%;
		height: 100%;
		left: 0;
		bottom: 0;
	}

	.bg-img {
		position: absolute;
		width: 100%;
		height: 100%;
	}

	.home_con .feed {
		position: absolute;
		top: 66%;
		left: 16%;
	}

	.home_con .feed .task_type {
		width: 0.6rem;
		height: 0.22rem;
		background: rgba(60, 60, 60, 0.3);
		border-radius: 0.2rem;
		border: 1px solid #fff;
	}

	.home_con .feed a {
		position: absolute;
		width: 0.16rem;
		height: 0.16rem;
		text-align: center;
		line-height: 0.16rem;
		border-radius: 0.1rem;
		top: -0.14rem;
		left: -0.06rem;
		background: red;
		font-size: 0.12rem;
		color: #fff;
		z-index: 99;

	}

	/* 喂养动画 */
	.slide-feed-enter-active {
		animation: slide-feed-in 0.6s;
	}

	.slide-feed-leave-active {
		animation: slide-feed-in 0.6s reverse;
	}

	@keyframes slide-feed-in {
		0% {
			transform: translateY(0);
			opacity: 1;
		}

		50% {
			transform: translateY(-0.16rem);
			opacity: 1;
		}

		100% {
			transform: translateY(0);
			opacity: 0.5;
		}
	}

	/* 	.slide-feed-enter-active {
		transition: all 0.6s cubic-bezier(1.0, 0.5, 0.8, 1.0);
		transform: translateY(4rem);
		opacity: 1;
	}
   .slide-feed-enter {
   	transform: translateY(0rem);
   	opacity: 1;
   }
   
	.slide-feed-leave-active {
		transition: all 0.6s cubic-bezier(1.0, 0.5, 0.8, 1.0);
		transform: translateY(-4rem);
		opacity: 1;
	}

	.slide-feed-leave-to

	
		{
		transform: translateY(0rem);
		opacity: 0;
	}
 */

	.home_con .water {
		top: 42%;
		left: 54%;
	}

	.home_con .sweep {
		top: 48%;
		left: 68%;
	}

	.home_con .rubbish {
		width: 0.24rem;
		position: absolute;
		top: 53%;
		left: 72%;
	}

	.home_con .feed img {
		width: 0.126rem;
		position: absolute;
		right: 0.04rem;
		top: -0.04rem;
	}

	.home_con .feed span {
		font-size: 10px;
		color: #fff;
		position: absolute;
		left: 0.12rem;
		top: 0.12rem;


	}

	.home_header {
		position: fixed;
		width: 100%;
		top: 0;
		left: 0;
		display: flex;
		justify-content: space-between;
		/* align-items: flex-end; */
		z-index: 99;
	}

	.account {
		position: absolute;
		top: 0.08rem;
		left: 0;
		/* width: 40%; */
		height: 0.6rem;
		background: url(../assets/img/yhm.png) no-repeat center;
		background-size: 100% 100%;
		position: relative;
		display: flex;

	}

	.account p {
		/* position: absolute; */
		/* top: 0.1rem; */
		font-size: 0.14rem;
		font-weight: bold;
		/* left: 0.6rem; */
		margin-top: 0.08rem;
		margin-left: 0.1rem;
		color: #DE7B0A;
		padding-right: 0.2rem;
	}

	.account span {
		font-size: 0.12rem;
		padding-left: 0.06rem;
	}

	.account span a {
		text-shadow: 0.004rem 0.004rem 0.01rem #4e1a0d, 0.004rem 0.004rem 0.01rem #4e1a0d;
		color: #fff;
	}

	.header {
		display: inline-block;
		/* position: absolute; */
		top: 0.02rem;
		left: 0.04rem;
		width: 0.48rem;
		height: 0.48rem;
		border-radius: 50%;
		border: 2px solid #672A1C;
		text-align: center;
	}

	.header img {
		width: 86%;
		height: 90%;
	}

	.notice {
		width: 50%;
		height: 0.44rem;
		background: url(../assets/img/gg-bg.png) no-repeat center;
		background-size: 100%;
		display: flex;
		align-items: center;
		margin-top: 0.3rem;
	}

	.notice img {
		display: inline-block;
		width: 0.32rem;
		margin-left: 0.2rem;
	}

	.notice span {
		font-size: 0.14rem;
		/* line-height: 0.2rem; */
		color: #fff;
	}

	.notice .textBox {
		width: 56%;
		height: 0.26rem;
		line-height: 0.26rem;
		overflow: hidden;
		position: relative;
	}

	.notice .textBox .text {
		width: 100%;
		height: 100%;
		position: absolute;
	}

	/* 公告动画 */
	.slide-enter-active,
	.slide-leave-active {
		transition: all 0.5s linear;
	}

	.slide-enter {
		transform: translateY(20px) scale(1);
		opacity: 1;
	}

	.slide-leave-to {
		transform: translateY(-20px) scale(0.8);
		opacity: 0;
	}

	.gold {
		width: 1.2rem;
		height: 0.28rem;
		background: url(../assets/img/jdt.png) no-repeat center;
		background-size: 100%;
		margin-top: 0.1rem;
		margin-right: 0.2rem;
		position: relative;
	}

	.gold img {
		width: 0.26rem;
		display: inline-block;
	}

	.gold span.asset {
		position: absolute;
		top: 0.06rem;
		left: 0.4rem;
		font-size: 0.12rem;
		color: #C07036;
		/* s */
	}

	.gold span.addAsset {
		position: absolute;
		top: 0.04rem;
		right: 0.06rem;
		font-size: 0.18rem;
		color: #C07036;
		/* opacity: 0; */
		/* s */
	}

	.bounce-enter-active,
	.bounce-leave-active {
		transition: all 0.5s linear;
	}

	.bounce-enter {
		transform: translateX(-20px) scale(1);
		opacity: 1;
	}

	.bounce-leave-to {
		transform: translateX(20px) scale(2);
		opacity: 0;
	}

	/* 	.bounce-enter-active {
		animation: bounce-in 2s;
	}

	.bounce-leave-active {
		animation: bounce-in 1s;
	}

	@keyframes bounce-in {
		0% {
			transform: scale(0);
			opacity: 0;
		}

		100% {
			transform: scale(1.5);
			opacity: 0.6;
		}

		100% {
			transform: scale(1);
			opacity: 1;
		}
	} */

	.home_left {
		position: fixed;
		left: 0.1rem;
		top: 28%;
		z-index: 99;
	}

	.home_left img,
	.home_right img {
		display: block;
		width: 0.5rem;
		margin: 0.28rem 0;
	}

	.home_right {
		position: fixed;
		right: 0.1rem;
		top: 28%;
		z-index: 99;
	}

	.home_bottom {
		position: fixed;
		bottom: 0;
		left: 50%;
		margin-left: -2.4rem;
		width: 4.8rem;
		height: 0.38rem;
		background: rgba(255, 255, 255, 0.5);
		border-radius: 0.2rem 0.2rem 0 0;
		z-index: 99;
	}

	.home_bottom .bottom_img {
		width: 100%;
		position: absolute;
		top: -0.2rem;
		display: flex;
		justify-content: space-around;
		padding: 0 0.08rem;
	}

	.home_bottom .bottom_img img {
		display: inline-block;
		width: 0.48rem;
		height: 100%;
	}

	.home_bottom .bottom_img img:nth-child(2) {
		width: 0.48rem;
		height: 0.458rem;
		margin-top: 0.032rem;
	}

	.home_bottom .bottom_img img:nth-child(3) {
		width: 0.56rem;
		height: 0.486rem;
	}

	.home_bottom .bottom_img img:nth-child(4) {
		width: 0.6rem;
		height: 0.438rem;
		margin-top: 0.046rem;
	}

	.home_bottom .bottom_img img:nth-child(5) {
		width: 0.52rem;
		height: 0.55rem;
		margin-top: -0.06rem;
	}

	.home_bottom .bottom_img img:nth-child(6) {
		width: 0.38rem;
		margin-top: -0.01rem;
	}

	.home_bottom .bottom_img img:nth-child(7) {
		width: 0.4rem;
		margin-top: -0.018rem;
	}

	.task {
		position: fixed;
		bottom: 0.1rem;
		right: 0.3rem;
		width: 0.5rem;
		z-index: 99;
	}

	.task img {
		width: 100%;
	}



	/* 弹窗 */
	.weui-dialog {}
</style>
