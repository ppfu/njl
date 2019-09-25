<template>
	<div id="lease">
		<div class="le_content" v-show="lang_dlg">
			<img class="title" src="../assets/img/btk.png" />
			<img v-if="center" class="title_text" src="../assets/img/bt-zx.png" />
			<img v-if="record" class="title_text" src="../assets/img/bt-jl.png" />
			<img @click="closeDialog" class="close" src="../assets/img/gb.png" />
			<!-- 租赁中心 -->
			<div v-if="center" class="back_le">
				<div class="le-record" @click="showRecord">
					<img src="../assets/img/jl.png" />
					<span>收购记录</span>
				</div>
				<van-swipe @change="onChange">
					<van-swipe-item v-for="(item,index) in productList" :key="item.id">
						<div class="le_prope">
							<div class="le_left">
								<img src="../assets/img/jz.png" />
								<span>{{item.id}}</span>
							</div>
							<div class="le_right">
								<img v-if="item.id == '一级建筑'" src="../assets/img/jz-1.png" />
								<img v-if="item.id == '二级建筑'" src="../assets/img/jz-2.png" />
								<img v-if="item.id == '三级建筑'" src="../assets/img/jz-3.png" />
								<img v-if="item.id == '四级建筑'" src="../assets/img/jz-4.png" />
								<span>{{item.price}}</span>
							</div>
						</div>
					</van-swipe-item>
					<div class="custom-indicator" slot="indicator">
						{{ current}}/{{count}}
					</div>
				</van-swipe>

				<div class="sub_le">
					<span @click="closeDialog">关闭</span>
					<span @click="showLease">收购</span>
				</div>
			</div>
			<!-- 租赁记录 -->
			<div v-if="record" class="back_record">
				<div class="record_info">
					<div class="record_title">
						<span>等级</span>
						<span>价格</span>
						<span>时间</span>
					</div>
					<div class="scroll_div">
						<van-pull-refresh v-model="isLoading" pulling-text="下拉刷新" loosing-text="释放更新" loading-text="正在加载..." @refresh="onRefresh">
							<div class="div" v-infinite-scroll="loadMore" infinite-scroll-disabled="loading" infinite-scroll-distance="10"
							 infinite-scroll-immediate-check="false">
								<div class="record_lists">
									<div class="record_list" v-for="(item,index) in recordList" :key="item.index">
										<span>{{item.level}}</span>
										<span>{{item.spend}}</span>
										<span>{{item.time}}</span>
									</div>


								</div>
							</div>
							<load-more v-if="lif" :show-loading="load" tip="正在加载..."></load-more>
							<load-more v-if="nif" :show-loading="none" tip="没有更多数据了"></load-more>
						</van-pull-refresh>
					</div>
				</div>

			</div>
		
		</div>
			<!-- 租赁 -->
		<div v-if="lease" class="lease_back">
			<div class="lease">
				<h4>交易密码</h4>
				<input type="password" name="" v-model="payment_password" placeholder="请输入交易密码" />
				<div class="sub_le">
					<span @click="closeLease">关闭</span>
					<span @click="productBuy">确认</span>
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
				lang_dlg: true,
				center: true,
				record: false,
				current: 1, //建筑等级
				lease: false,
				productList: [], //建筑列表
				count: '', //建筑列表长度
				payment_password: '', //交易密码
				recordList: [], //记录列表
				page_count: 1, //页数
				pageindex: 1, //交易记录默认第一页
				load: false, //加载图标显示
				none: false, //加载图标隐藏
				lif: true, //正在加载中 显示
				nif: false, //没有更多数据了 隐藏
				loading: true, //下拉刷新
				isLoading: false //上拉加载更多
			};
		},
		inject: ['reload'], //注入reload方法
		created: function() {

		},
		//数据保存到session
		watch: {


		},
		mounted: function() {
			let that = this;
			that.getProductList();
			that.getLeaseRecord();
			// that.onRefresh();
		},
		methods: {
			onChange(index) {
				let that = this;
				that.current = index + 1;
			},
			//获取首页信息
			getProductList() {
				let that = this;
				that
					.$http({
						url: "Product/productList",
						method: "post",
						data: {
							token: sessionStorage.getItem("token")
						}
					})
					.then(function(res) {
						if (res.data.code == 0) {
							that.productList = res.data.data; //首页信息
							that.count = that.productList.length
							// console.log(that.count)
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
			//租赁操作
			productBuy() {
				let that = this;
				if (!that.payment_password || that.payment_password == null) {
					that.$toast('请输入交易密码');
				} else {
					that
						.$http({
							url: "Product/productBuy",
							method: "post",
							data: {
								token: sessionStorage.getItem("token"),
								id: that.current,
								payment_password: that.payment_password,
							}
						})
						.then(function(res) {
							console.log(res)
							if (res.data.code == 0) {
								//成功回调
								that.$toast(res.data.msg);
								that.reload()
								that.$router.push({
									path: '/homepage'
								})
								that.payment_password = '';
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
				}
			},
			//下拉刷新
			onRefresh() {
				let that = this;
				that.isLoading = true;
				that.loading = false;
				that.nif = false;
				that.pageindex = 1;
				that.recordList = [];
				that.getLeaseRecord(1);
			},
			//上拉加载更多
			loadMore() {
				let that = this;
				that.lif = true;
				that.pageindex++;
				that.getLeaseRecord(0);
			},
			//租赁记录
			getLeaseRecord(i) {
				let that = this;
				if (i) {
					that.lif = true;
				}
				that
					.$http({
						url: "Product/productLog",
						method: "post",
						data: {
							token: sessionStorage.getItem("token"),
							p: that.pageindex
						}
					})
					.then(function(res) {
						that.lif = false;
						that.isLoading = false;
						if (res.data.code == 0) {
							//成功回调
							if (res.data.data.list != "") {
								that.recordList = that.recordList.concat(res.data.data.list);
							} else {
								that.nif = true;
								that.loading = true;
							}
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
			//关闭确认弹窗
			closeDialog: function() {
				var that = this;
				that.lang_dlg = false;
				that.$router.push({
					path: '/homepage'
				})
			},
			//租赁
			showLease: function() {
				var that = this;
				// console.log(id)
				// that.sell_id = id;
				that.lease = true;
			},
			//关闭租赁
			closeLease: function() {
				var that = this;
				that.lease = false;
			},
			//租赁记录
			showRecord: function() {
				var that = this;
				that.center = false;
				console.log(that.center)
				that.record = true;

			},

		}
	};
</script>

<style>
	#lease {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background: rgba(0, 0, 0, 0.6);
		overflow: hidden;
		z-index: 100;
	}

	.custom-indicator {
		color: #F07923;
		/* text-shadow: 0.004rem 0.004rem 0.006rem #4e1a0d, 0.004rem 0.004rem 0.01rem #4e1a0d; */
	}

	.le_content {
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

	.le_content img.title {
		position: absolute;
		width: 4.2rem;
		top: 0.02rem;
		left: 0.44rem;
		z-index: 9;

	}

	.le_content img.close {
		position: absolute;
		width: 0.46rem;
		right: 0.14rem;
		top: 0.1rem;
	}

	.le_content img.title_text {
		position: absolute;
		width: 1.2rem;
		top: 0.28rem;
		left: 2rem;
		z-index: 10;
	}

	/* 租赁中心 */
	.back_le {
		width: 68%;
		margin-top: 0.8rem;
		margin-left: -0.1rem;
		background: url(../assets/img/k-2.png) no-repeat 0 0.08rem;
		background-size: 100% 54%;
		padding-top: 0.2rem;
	}

	.le-record img {
		width: 0.26rem;
		margin-left: 0.2rem;

	}

	.le-record span {
		font-size: 0.14rem;
		color: #F07923;
	}

	.le_prope {
		padding: 0 0.28rem;
		height: 0.92rem;
		display: flex;
		justify-content: space-around;
		align-items: center;
	}

	.le_prope .le_left {
		position: relative;
	}

	.le_prope .le_left img {
		width: 1rem;
	}

	.le_prope .le_left span {
		position: absolute;
		left: 0.28rem;
		top: 0.056rem;
		font-size: 0.12rem;
		color: #fff;
	}

	.le_prope .le_right {
		text-align: center;
	}

	.le_prope .le_right img {
		width: 0.76rem;
		display: block;
	}

	.le_prope .le_right span {
		font-size: 0.16rem;
		color: #F07923;
		/* text-shadow: 0.004rem 0.004rem 0.006rem #4e1a0d, 0.004rem 0.004rem 0.01rem #4e1a0d; */
	}

	.sub_le {
		width: 100%;
		text-align: center;
		margin-top: 0.06rem;

	}

	.sub_le span {
		display: inline-block;
		width: 1.2rem;
		height: 0.66rem;
		background: url(../assets/img/an-2.png) no-repeat center;
		background-size: 100% 100%;
		text-align: center;
		line-height: 0.46rem;
		color: #fcf5de;
		font-size: 0.16rem;
	}

	/* 出售 */
	.lease_back {
		width: 100%;
		height: 100%;
		position: absolute;
		top: 0;
		left: 0;
		background: rgba(0, 0, 0, 0.4);
		z-index: 888;
	}

	.lease {
		position: absolute;
		top: 50%;
		left: 50%;
		margin-left: -2rem;
		margin-top: -0.84rem;
		width: 4rem;
		height: 2rem;
		background: url(../assets/img/b_sell.png) no-repeat center center;
		background-size: 100% 100%;
		text-align: center;

	}

	.lease h4 {
		padding-top: 0.4rem;
		font-size: 0.18rem;
		color: #d1a729;
		right: 0;

	}

	.lease input {
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


	/* 租赁记录 */
	.back_record {
		width: 68%;
		margin-top: 0.8rem;
		margin-left: -0.1rem;
		background: url(../assets/img/k-2.png) no-repeat 0 0.16rem;
		background-size: 100% 62%;
		padding-top: 0.2rem;
	}

	.record_info {
		width: 100%;
		height: 1.66rem;
		overflow-y: scroll;
	}

	.back_record .record_title {
		font-weight: normal;
		color: #EE661C;
		padding: 0.14rem 0;
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

	.back_record .record_title span {
		font-size: 0.16rem;
		padding: 0 0.4rem;
		font-weight: bold;
	}

	.back_record .record_lists {
		padding: 0 0.14rem;
		margin-top: 0.50rem;
	}

	.back_record .record_lists .record_list {
		font-size: 0.14rem;
		color: #F07923;
		display: flex;
		justify-content: space-between;

	}

	.back_record .record_lists .record_list {
		padding: 0.058rem 0;
	}

	.back_record .record_lists .record_list span:nth-child(2) {
		padding-left: 0.26rem;
	}
</style>
