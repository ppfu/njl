<template>
	<div id="deal">
		<div class="deal_content" v-show="lang_dlg">
			<img class="title" src="../assets/img/btk.png" />
			<img class="title_text" src="../assets/img/bt-jy.png" />
			<img @click="closeDialog" class="close" src="../assets/img/gb.png" />
			<!-- 租赁中心 -->
			<div v-if="center" class="back_deal">
				<div class="order" @click="showOrder">
					<img src="../assets/img/gd.png" />
				</div>
				<mt-navbar v-model="selected">
					<mt-tab-item @click.native="navTap(1)" id="1">求购列表</mt-tab-item>
					<mt-tab-item @click.native="navTap(2)" id="2">出售列表</mt-tab-item>
					<mt-tab-item @click.native="navTap(3)" id="3">交易记录</mt-tab-item>
				</mt-navbar>

				<!-- tab-container -->
				<mt-tab-container v-model="selected">

					<mt-tab-container-item id="1">
						<div class="deal_con">
							<div class="scroll_div">
								<van-pull-refresh v-model="isLoading" pulling-text="下拉刷新" loosing-text="释放更新" loading-text="正在加载..." @refresh="onRefresh">
									<div class="div" v-infinite-scroll="loadMore" infinite-scroll-disabled="loading" infinite-scroll-distance="10"
									 infinite-scroll-immediate-check="false">
										<div class="deal_list" v-for="(item,index) in dealList" :key="dealList.id">
											<h5>
												<p><img :src="item.head_portrait" alt="" /></p><span>{{item.username}}</span>
											</h5>
											<span>{{item.number}}金币</span>
											<span>{{item.price}}CNY</span>
											<button @click="showSell(item.id)">出售</button>
										</div>
									</div>
									<load-more v-if="lif" :show-loading="load" tip="正在加载..."></load-more>
									<load-more v-if="nif" :show-loading="none" tip="没有更多数据了"></load-more>
								</van-pull-refresh>
							</div>
						</div>
					</mt-tab-container-item>
					<mt-tab-container-item id="2">
						<div class="deal_con">
							<div class="scroll_div">
								<van-pull-refresh v-model="isLoading" pulling-text="下拉刷新" loosing-text="释放更新" loading-text="正在加载..." @refresh="onRefresh">
									<div class="div" v-infinite-scroll="loadMore" infinite-scroll-disabled="loading" infinite-scroll-distance="10"
									 infinite-scroll-immediate-check="false">
										<div class="deal_list" v-for="(item,index) in dealList" :key="dealList.id">
											<h5>
												<p><img :src="item.head_portrait" alt="" /></p><span>{{item.username}}</span>
											</h5>
											<span>{{item.number}}金币</span>
											<span>{{item.price}}CNY</span>
											<button @click="showPayment(item)">购买</button>
										</div>
									</div>
									<load-more v-if="lif" :show-loading="load" tip="正在加载..."></load-more>
									<load-more v-if="nif" :show-loading="none" tip="没有更多数据了"></load-more>
								</van-pull-refresh>
							</div>
						</div>
					</mt-tab-container-item>

					<mt-tab-container-item id="3">
						<div class="deal_info">
							<div class="deal_title">
								<span>用户名</span>
								<span>价格</span>
								<span>类型</span>
								<span>状态</span>
								<span>时间</span>
							</div>

							<div class="deal_con deal_lists">
								<div class="scroll_div">
									<van-pull-refresh v-model="isLoading" pulling-text="下拉刷新" loosing-text="释放更新" loading-text="正在加载..." @refresh="onRefresh">
										<div class="div" v-infinite-scroll="loadMore" infinite-scroll-disabled="loading" infinite-scroll-distance="10"
										 infinite-scroll-immediate-check="false">
											<div class="deal_list" v-for="(item,index) in dealList" :key="dealList.id">
												<h5>
													<p><img :src="item.head_portrait" alt="" /></p><span>{{item.username}}</span>
												</h5>
												<h5>{{item.number}}金币</h5>
												<span v-if="item.type == 1" :style="{color:'#B26901'}">买入</span>
												<span v-if="item.type == 2" :style="{color:'#F07923'}">卖出</span>
												<span v-if="item.type == 1 && item.status == 0"><a href="#" :style="{color:'#B26901'}" @click="showPaymentOrder(item)">待支付</a></span>
												<span v-if="item.type == 1 && item.status == 1" :style="{color:'#F07923'}">待确认</span>
												<span v-if="item.type == 2 && item.status == 0" :style="{color:'#B26901'}">待支付</span>
												<span v-if="item.type == 2 && item.status == 1" @click="showAffirm(item)" :style="{color:'#F07923'}"><a>待确认</a></span>
												<span v-if="item.status !== 0 && item.status !== 1" :style="{color:'#EFBB3F'}">已完成</span>
												<!-- <td >待支付</td> -->
												<span>{{item.time}}</span>
											</div>
										</div>
										<load-more v-if="lif" :show-loading="load" tip="正在加载..."></load-more>
										<load-more v-if="nif" :show-loading="none" tip="没有更多数据了"></load-more>
									</van-pull-refresh>
								</div>
							</div>
						</div>
					</mt-tab-container-item>
				</mt-tab-container>
			</div>
		</div>
		<!-- //出售 -->
		<div v-if="sell" class="sell_back">
			<div class="sell">
				<h4>交易密码</h4>
				<input type="password" name="" v-model="payment_password" placeholder="请输入交易密码" />
				<div class="sub_se">
					<span @click="closeSell">关闭</span>
					<span @click="sellOrder">确认</span>
				</div>
			</div>
		</div>
		<!-- 支付 -->
		<div v-if="payment" class="payment_back">
			<div class="payment">
				<div class="pa_info">
					<span>待支付金额：</span>
					<span>{{payment_money}}CNY</span>
				</div>
				<div class="pa_info">
					<span>支付宝账号：</span>
					<span>{{alipay}}</span>
				</div>
				<div class="pa_info">
					<span>微信收款码：</span>
					<span class="weixn">
            <img :src="wechat" @click="showWechat">
            <van-image-preview v-model="srcWechat" :images="w_images"  class="yulan"
						 :loop="true">
						</van-image-preview>
          </span>
				</div>
				<div class="pa_info">
					<span>上传支付截图：</span>
					<van-uploader v-model="fileList" :after-read="afterRead" multiple :max-count="1" />
				</div>
				<div class="sub_pa">
					<span @click="closeSell">关闭</span>
					<span v-if="type == 2" @click="sellOrder">确认</span>
					<span v-if="type == 3" @click="orderVoucher">确认</span>
				</div>

			</div>
		</div>
		<!-- 确认支付 -->
		<div v-if="affirm" class="payment_back">
			<div class="payment">
				<div class="pa_info">
					<span>付款金额：</span>
					<span>{{payment_money}}CNY</span>
				</div>
				<div class="pa_info">
					<span>付款截图：</span>
					<span class="van-uploader__upload">
						<img class="pa_img" @click="showPreview" :src="payment_voucher">
						<van-image-preview v-model="srcShow" :images="images" :startPosition="srcIndex" @change="onChange" class="yulan"
						 :loop="true">
							<template v-slot:srcIndex>第{{ srcIndex }}页</template>
						</van-image-preview>
					</span>
				</div>
				<div class="pa_info pa_input">
					<span>支付密码：</span>
					<input type="password" name="" v-model="payment_password" placeholder="请输入交易密码" />
				</div>
				<!-- 密码输入框 -->
				<div class="sub_pa">
					<span @click="closeSell">关闭</span>
					<span @click="orderConfirm">确认</span>
				</div>

			</div>
		</div>
	</div>
</template>

<script>
	import {
		LoadMore
	} from "vux";
	export default {
		components: {
			LoadMore
		},
		data() {
			return {
				pageindex: 1, //默认第一页
				pwdList: [],
				oldPwdList: [],
				isDelete: false,
				ipt: "",
				lang_dlg: true,
				center: true,
				record: false,
				selected: "1",
				id: "1", //选中类型
				fileList: [],
				files: '',
				buy: false,
				sell: false,
				payment: false,
				affirm: false,
				type: '', //交易类型
				dealList: [], //交易列表
				payment_password: '', //交易密码
				buy_id: '', //购买挂单id
				sell_id: '', //销售挂单id
				payment_money: '', //待支付金额
				alipay: '', //支付宝账号
				wechat: '', //微信
				payment_voucher: '', //支付凭证图片
				order_id: '', //获取订单id
				images: [],
        w_images:[],
				srcShow: false, //图片预览付款凭证
				srcIndex: 0, //图片页面索引
        srcWechat:false,//图片预览 收款码s
				load: false, //加载图标显示
				none: false, //加载图标隐藏
				lif: true, //正在加载中 显示
				nif: false, //没有更多数据了 隐藏
				loading: true, //下拉刷新
				isLoading: false //上拉加载更多
			};
		},
		created: function() {
			// this.clickCallback(1)
			console.log(this.dealList)
		},
		//数据保存到session
		watch: {


		},
		mounted: function() {
			var that = this;
			that.getDeal();
			console.log(that.fileList)
			that.onRefresh();
		},
		methods: {
			onChange(index) {
				this.srcIndex = index;
			},
			//图片预览 付款凭证
			showPreview() {
				this.srcShow = true;
			},
      	//图片预览 收款码
      showWechat(){
        this.srcWechat = true;
      },
			//选择相应的tab，初始化数据
			navTap(i) {
				let that = this;
				that.id = i;
				that.loading = false;
				that.nif = false;
				that.pageindex = 1;
				that.dealList = [];
				that.getDeal(1);
			},
			//下拉刷新
			onRefresh() {
				let that = this;
				that.isLoading = true;
				that.loading = false;
				that.nif = false;
				that.pageindex = 1;
				that.dealList = [];
				that.getDeal(1);
			},
			//上拉加载更多
			loadMore() {
				let that = this;
				that.lif = true;
				that.pageindex++;
				that.getDeal(0);
			},
			//获取交易中心列表
			getDeal(i) {
				let that = this;
				if (i) {
					that.lif = true;
				}
				let id = that.id;
				that.type = id == 1 ? 1 : (id == 2 ? 2 : 3);
				console.log(that.type)
				// Indicator.open({
				// 	text: "加载中...",
				// });
				that
					.$http({
						url: "Trade/listInfo",
						method: "post",
						data: {
							token: sessionStorage.getItem("token"),
							type: that.type,
							p: that.pageindex
						}
					})
					.then(function(res) {
						that.lif = false;
						that.isLoading = false;
						if (res.data.code == 0) {
							//成功回调
							if (res.data.data.list != "") {
								that.dealList = that.dealList.concat(res.data.data.list);
							} else {
								that.nif = true;
								that.loading = true;
							}
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
			// 上传支付截图
			afterRead(file) {
				let that = this;
				var reader = new FileReader();
				reader.readAsDataURL(file.file); // 读取文件
				reader.onload = function(arg) {
					var formData = new FormData();
					formData.append('file', file.file);
					formData.append("token", sessionStorage.getItem("token"));
					$.ajax({
						url: 'http://njl.qilinpz.com/api/Trade/upload',
						type: 'POST',
						data: formData,
						dataType: 'JSON',
						cache: false,
						processData: false,
						contentType: false
					}).done(function(res) {
						// console.log(res)
						if (res.code == 0) {
							//成功回调
							// Toast("上传成功");
							that.files = res.data;

							console.log(that.files)
						} else {
							//失败
							Toast(res.msg);
						}
					});
				}

			},
			//订单支付
			orderVoucher() {
				console.log(123)
				let that = this;
				console.log(that.buy_id)
				console.log(that.order_id)
				//购买
				if (that.fileList == []) {
					that.$toast('请上传支付截图');
				} else {
					that
						.$http({
							url: "Trade/orderVoucher",
							method: "post",
							data: {
								token: sessionStorage.getItem("token"),
								id: that.order_id,
								payment_voucher: that.files,
							}
						})
						.then(function(res) {
							if (res.data.code == 0) {
								//成功回调
								that.$toast(res.data.msg);
								that.dealList = [];
								that.fileList = [];
								that.getDeal();
							} else {
								//失败
								that.$toast(res.data.msg);
							}
						})
						.catch(function(error) {});
				}
			},
			//订单确认
			orderConfirm() {
				let that = this;
				//购买
				if (!that.payment_password || that.payment_password == null) {
					that.$toast('请输入密码');
				} else {
					that
						.$http({
							url: "Trade/orderConfirm",
							method: "post",
							data: {
								token: sessionStorage.getItem("token"),
								id: that.sell_id,
								payment_password: that.payment_password,
							}
						})
						.then(function(res) {
							if (res.data.code == 0) {
								//成功回调
								that.$toast(res.data.msg);
								that.dealList = [];
								that.payment_password = '';
								that.getDeal();
							} else {
								//失败
								that.$toast(res.data.msg);
							}
						})
						.catch(function(error) {});
				}
			},
			//售出
			sellOrder() {
				console.log(123)
				let that = this;
				//出售
				if (!that.payment_password || that.payment_password == null) {
					that.$toast('请输入密码');
				} else {
					that
						.$http({
							url: "Trade/tradeActive",
							method: "post",
							data: {
								token: sessionStorage.getItem("token"),
								id: that.sell_id,
								payment_password: that.payment_password,
							}
						})
						.then(function(res) {
							if (res.data.code == 0) {
								//成功回调
								that.$toast(res.data.msg);
								that.dealList = [];
								that.getDeal();
								that.payment_password = '';
							} else {
								//失败
								that.$toast(res.data.msg);
							}
						})
						.catch(function(error) {});
				}
			},
			//关闭确认弹窗
			closeDialog: function() {
				var that = this;
				that.lang_dlg = false;
				that.$router.push({
					path: '/homepage'
				})
			},
			//挂单
			showOrder: function() {
				var that = this;
				that.$router.push({
					path: '/entryOrders'
				})
			},
			//出售
			showSell: function(id) {
				var that = this;
				console.log(id)
				that.sell_id = id;
				that.sell = true;
			},
			//取消出售
			closeSell: function() {
				var that = this;
				that.sell = false;
				that.payment = false;
				that.affirm = false
			},
			//挂单时支付
			showPayment: function(item) {
				var that = this;
				that.buy_id = item.id;
				// console.log(that.buy_id)
				that.payment_money = item.payment;
				// console.log(item)
				that.alipay = item.alipay;
				that.wechat = item.wechat;
        that.w_images = [];
        that.w_images.push(that.wechat);
				//获取订单id
				that
					.$http({
						url: "Trade/tradeActive",
						method: "post",
						data: {
							token: sessionStorage.getItem("token"),
							id: that.buy_id,
						}
					})
					.then(function(res) {
						console.log(res)
						if (res.data.code == 0) {
							//成功回调
							that.$toast("订单已生成，请上传支付截图");
							that.order_id = res.data.data;
							console.log(that.order_id)
							that.payment = true;
							that.dealList = [];
						} else {
							//失败
							that.$toast(res.data.msg);
						}
					})
					.catch(function(error) {});

			},
			//生成订单时支付
			showPaymentOrder: function(item) {
				var that = this;
				that.isActive = item.id;
				that.order_id = item.id;
				// console.log(that.buy_id)
				that.payment_money = item.payment;
				// console.log(item)
				that.alipay = item.alipay;
				that.wechat = item.wechat;
        that.w_images = [];
        that.w_images.push(that.wechat);
				that.payment = true;
				//获取订单id
				// that
				// 	.$http({
				// 		url: "Trade/tradeActive",
				// 		method: "post",
				// 		data: {
				// 			token: sessionStorage.getItem("token"),
				// 			id: that.buy_id,
				// 		}
				// 	})
				// 	.then(function(res) {
				// 		console.log(res)
				// 		if (res.data.code == 0) {
				// 			//成功回调
				// 			that.$toast("订单已生成，请上传支付截图");
				// 			that.order_id=res.data.data;
				// 			console.log(that.order_id)
				// 			that.payment = true;
				// 			that.dealList = [];
				// 		} else {
				// 			//失败
				// 			that.$toast(res.data.msg);
				// 		}
				// 	})
				// 	.catch(function(error) {});

			},
			//确认支付
			showAffirm: function(item) {
				var that = this;
				that.sell_id = item.id;
				that.payment_voucher = item.payment_voucher;
				that.images = [];
				that.images.push(that.payment_voucher);
				that.affirm = true;
			},


		}
	};
</script>

<style>
	#deal {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background: rgba(0, 0, 0, 0.6);
		overflow: hidden;
		z-index: 100;
		font-family: "Avenir", Helvetica, Arial, sans-serif;
	}

	.deal_content {
		position: absolute;
		top: 50%;
		left: 50%;
		margin-left: -3.5rem;
		margin-top: -2.1rem;
		width: 7rem;
		height: 4.2rem;
		background: url(../assets/img/k-1.png) no-repeat center center;
		background-size: 110% 100%;
		display: flex;
		justify-content: center;
	}

	.deal_content img.title {
		position: absolute;
		width: 6.6rem;
		height: 1rem;
		top: 0.26rem;
		left: 0.18rem;

	}

	.deal_content img.close {
		position: absolute;
		width: 0.56rem;
		right: 0.14rem;
		top: 0.2rem;
	}

	.deal_content img.title_text {
		position: absolute;
		width: 1.02rem;
		top: 0.42rem;
		left: 3.2rem;
	}

	/* 交易中心 */
	.back_deal {
		width: 68%;
		margin-top: 0.8rem;
		margin-left: -0.14rem;
		background: url(../assets/img/k-2.png) no-repeat 0 0.16rem;
		background-size: 100% 66%;
		padding-top: 0.2rem;
		position: relative;

	}

	.order {
		position: absolute;
		right: 0.2rem;
		top: 0.2rem;
	}

	.order img {
		width: 0.28rem;
	}

	.back_deal .mint-navbar {
		margin-bottom: 0.1rem;
		margin-left: 0.2rem;
		width: 2.2rem;
		background: none;
		height: 0.28rem;
	}

	.mint-navbar .mint-tab-item {
		width: 0.64rem;
		margin: 0 0.02rem;
		height: 100%;
		background: url(../assets/img/qh-2.png) no-repeat center;
		background-size: 96% 70%;
	}

	.mint-navbar .mint-tab-item .mint-tab-item-label {
		line-height: 0.05rem;

	}

	.mint-navbar .mint-tab-item .mint-tab-item-label {
		font-size: 0.1rem;
		-webkit-transform-origin-x: 0;
		-webkit-transform: scale(0.90);
		color: #F7FBED;
	}

	.mint-navbar .mint-tab-item.is-selected {
		border: none;
		background: url(../assets/img/qh-1.png) no-repeat center;
		background-size: 100% 80%;

	}

	.mint-navbar .mint-tab-item.is-selected .mint-tab-item-label {
		font-size: 0.12rem;

	}

	.deal_con {
		width: 100%;
		height: 80%;
		padding: 0 0.04rem;
		margin-top: 0.1rem;
		overflow-y: scroll;
	}

	.deal_con.deal_lists {
		margin-top: 0.48rem;
	}
	.deal_con .deal_list {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 0.11rem;
    padding: 0 0.04rem;
	}
	.deal_con .deal_list h5 {
		font-size: 0.12rem;
		color: #F07923;
		font-weight: normal;
		display: flex;
		align-items: center;
		width: 18%;
    justify-content: center;
	}

	.deal_con .deal_list h5 img {
		width: 0.22rem;
    margin-left: 0.016rem;
	}

	.deal_con .deal_list h5 span {
		width:80%;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.deal_con .deal_list p {
		width: 0.26rem;
		height: 0.26rem;
		background: #D9B16F;
		border-radius: 50%;
		display: inline-block;
	}

	.scroll_div {
		height: 100%;
		/* overflow-y: scroll; */
	}

	.deal_info {
		width: 100%;
		height: 1.8rem;
		overflow-y: scroll;
		overflow-x: hidden;
	}

	.deal_info .deal_title {
		font-weight: normal;
		color: #EE661C;
		padding: 0.1rem 0;
		position: fixed;
		background-color: #EEDFAF;
		z-index: 8;


	}

	.van-loading__text {
		color: #F07923 !important;
	}

	.weui-loadmore_line .weui-loadmore__tips {
		color: #F07923 !important;
	}

	.deal_info .deal_title span {
		font-size: 0.16rem;
		/* padding: 0 0.2rem; */
		font-weight: bold;
	}

	.deal_info .deal_title span:nth-child(1) {
		padding-left: 0.26rem;
	}

	.deal_info .deal_title span:nth-child(2) {
		padding-left: 0.66rem;
	}

	.deal_info .deal_title span:nth-child(3) {
		padding-left: 0.46rem;
	}

	.deal_info .deal_title span:nth-child(4) {
		padding-left: 0.28rem;
	}

	.deal_info .deal_title span:nth-child(5) {
		padding-left: 0.62rem;
		padding-right: 0.48rem;

	}

	.deal_con .deal_list span a {
		text-decoration: underline;
	}

	.deal_con .deal_list span {
		font-size: 0.12rem;
		color: #F07923;
		/* text-shadow: -0.001rem 0.01rem 0.006rem #B26901, 0.01rem 0.001rem 0.008rem #B26901; */

	}

	.deal_con .deal_list button {
		width: 0.5rem;
		height: 0.26rem;
		line-height: 0.26rem;
		background: none;
		background: url(../assets/img/an.png) no-repeat center;
		background-size: 100% 100%;
		font-size: 0.12rem;
		border: none;
		color: #fffdc9;
		text-shadow: 0.01rem 0.01rem 0.008rem #4e1a0d;
	}

	.deal_con table thead tr th {
		padding: 0 0.28rem;
	}

	/* 出售 */
	.sell_back,
	.payment_back {
		width: 100%;
		height: 100%;
		overflow: hidden;
		position: absolute;
		top: 0;
		left: 0;
		background: rgba(0, 0, 0, 0.6);
		z-index: 888;
	}

	.sell,
	.payment {
		position: absolute;
		top: 50%;
		left: 50%;
		margin-left: -2rem;
		margin-top: -1rem;
		width: 4rem;
		height: 2rem;
		background: url(../assets/img/b_sell.png) no-repeat center center;
		background-size: 100% 100%;
		text-align: center;

	}

	.payment {
		width: 3.6rem;
		height: 3.6rem;
		margin-left: -1.8rem;
		margin-top: -1.8rem;
		display: flex;
		flex-direction: column;
		justify-content: center;
	}

	.sell h4 {
		padding-top: 0.4rem;
		font-size: 0.18rem;
		color: #d1a729;
		right: 0;

	}

	.sell input,
	.payment input {
		width: 2.6rem;
		height: 0.5rem;
		background: url(../assets/img/sr.png) no-repeat center;
		background-size: 100% 100%;
		border: none;
		padding-left: 0.2rem;
		font-size: 0.14rem;
		color: #fff;
		margin-top: 0.2rem;
	}

	input::-webkit-input-placeholder {
		/* placeholder颜色  */
		color: #F7FBED;

	}

	.payment .pa_input input {
		width: 2.2rem;
		margin-top: 0.1rem;
	}

	.sub_se,
	.sub_pa {
		width: 100%;
		text-align: center;
		margin-top: 0.18rem;
		position: absolute;
		bottom: -0.26rem;
	}

	.sub_pa {
		bottom: -0.1rem;
	}

	.sub_se span,
	.sub_pa span {
		display: inline-block;
		width: 1.2rem;
		height: 0.68rem;
		background: url(../assets/img/an-2.png) no-repeat center;
		background-size: 100% 100%;
		text-align: center;
		line-height: 0.46rem;
		color: #fcf5de;
		font-size: 0.16rem;
		text-shadow: -0.01rem 0.012rem 0.008rem #af3415, 0.004rem 0.004rem 0.008rem #af3415, 0.004rem 0.004rem 0.008rem #af3415;
	}

	.payment .pa_info {
		width: 100%;
		padding-left: 0.68rem;
		font-size: 0.16rem;
		font-weight: bold;
		color: #D09049;
		display: flex;
		margin-top: 0.1rem;
	}

	.payment .pa_info.pa_input {
		display: flex;
		flex-direction: column;
	}

	.payment .pa_info span:nth-child(1) {
		width: 40%;
		margin-right: 0.06rem;
		display: inline-block;
		text-align: right;

	}

	.payment .pa_info .weixn {
		width: 0.8rem;
		height: 0.8rem;
		background: url(../assets/img/ewm.png) no-repeat center center;
		background-size: 100% 100%;
		border: none;
		text-align: center;
		position: relative;

	}

	.payment .pa_info img {
		position: absolute;
		display: inline-block;
		top: 0.1rem;
		left: 0.08rem;
		width: 0.64rem;
		height: 0.64rem;
	}

	.payment .pa_info .yulan img {
		width: 50%;
		height: 80%;
	}

	.van-uploader__input,
	.van-uploader__upload {
		width: 0.8rem;
		height: 0.8rem;
		background: rgba(255, 255, 255, 0.3);
		border: 0.01rem solid #D09049;
		border-radius: 0.1rem;
	}

	.van-uploader__preview-image {
		width: 0.8rem;
		height: 0.8rem;
	}

	.van-uploader__upload-icon {
		color: #D09049;
	}
</style>
