<template>
	<div id="order">
		<div class="order_content" v-show="lang_dlg">
			<img class="title" src="../assets/img/btk.png" />
			<img class="title_text" src="../assets/img/bt-gd.png" />
			<img @click="closeDialog" class="close" src="../assets/img/gb.png" />
			<!-- 租赁中心 -->
			<div v-if="center" class="back_order">
				<div class="order-record" @click="showRecord">
					<img src="../assets/img/jl.png" />
					<span>挂单记录</span>
				</div>
				<mt-navbar v-model="selected">
					<mt-tab-item @click.native="navTap(1)" id="1">卖出金币</mt-tab-item>
					<mt-tab-item @click.native="navTap(2)" id="2">买入金币</mt-tab-item>
				</mt-navbar>
				
				<!-- tab-container -->
				<mt-tab-container v-model="selected">
					<mt-tab-container-item id="1">					
						<div class="order_con">
							<div class="or_info">
								<span>剩余金币：</span>
								<span>{{assets}}</span>
							</div>
							<div class="or_info">
								<span>卖出数量：</span>
								<input type="text" v-model="number" placeholder="请输入卖出数量" />
							</div>
							<div class="or_info">
								<span>卖出单价：</span>
								<input type="text" v-model="sell_price" placeholder="" disabled="disabled" />
							</div>
						</div>
					</mt-tab-container-item>
					<mt-tab-container-item id="2">
						<div class="order_con">
							<div class="or_info">
								<span>剩余金币：</span>
								<span>{{assets}}</span>
							</div>
							<div class="or_info">
								<span>买入数量：</span>
								<input type="text" v-model="number" placeholder="请输入买入数量" />
							</div>
							<div class="or_info">
								<span>买入单价：</span>
								<input type="text" v-model="buy_price" placeholder="" disabled="disabled"/>
							</div>
						</div>
					
					</mt-tab-container-item>
				</mt-tab-container>
				<div class="sub_order">
					<span @click="entryorder">挂单</span>
				</div>
				
					<!-- 挂单记录 -->
			
			</div>
				<div v-if="record" class="back_order">
						<div class="order_info">
						<div class="order_title">
							<span>数量</span>
							<span>金额</span>
							<span>类型</span>
							<span>时间</span>
						</div>
						<div class="scroll_div">
							<van-pull-refresh 
							v-model="isLoading" 
							pulling-text="下拉刷新"
							loosing-text="释放更新" 
							loading-text="正在加载..." 
							@refresh="onRefresh">
								<div class="div" 
								v-infinite-scroll="loadMore" 
								infinite-scroll-disabled="loading" 
								infinite-scroll-distance="10"
								infinite-scroll-immediate-check="false">
									<div class="order_lists">
										<div class="order_list" v-for="(entryItem,index) in entryList" :key="entryItem.index">
											<span>{{entryItem.number}}</span>
											<span>{{entryItem.price}}</span>
											<span>{{entryItem.typeText}}</span>
											<span>{{entryItem.time}}</span>
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
				id:"1",//买入、卖出切换
				selected:"1",
				type:'',//挂单类型
				price:'',//价格
				number:'',//数量
				assets:'',//剩余金币
				buy_price:'',//挂买单价
				sell_price:'',//挂卖单价
				pageindex:1 ,//交易记录默认第一页
				entryList:[],
				load: false, //加载图标显示
				none: false, //加载图标隐藏
				lif: true, //正在加载中 显示
				nif: false, //没有更多数据了 隐藏
				loading: true, //下拉刷新
				isLoading: false //上拉加载更多
				
			};
		},
		created: function() {

		},
		//数据保存到session
		watch: {


		},
		mounted: function() {
            let that = this; 
			that.getAssets();
			that.getEntryOrders();
			that.onRefresh();
		},
		methods: {
			//选择相应的tab，初始化数据
			navTap(i) {	 
			  let that = this;
			  that.id = i;
			  console.log(that.id)
			},
			 //获取剩余金币
			getAssets() {
				let that = this;
				that
					.$http({
						url: "Trade/userAssets",
						method: "post",
						data: {
							token: sessionStorage.getItem("token"),
						}
					})
					.then(function(res) {
						console.log(res)
						if (res.data.code == 0) {
							//成功回调
							  that.assets = res.data.data.assets;
							  that.buy_price = res.data.data.buy_price;
							  that.sell_price = res.data.data.sell_price;
							  
							  console.log(that.assets)
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
			 //挂单操作
			entryorder() {
				let that = this;
				let id = that.id;
				that.type = id == 1 ? 2 : 1;
				if(that.type == 2){
					that.price = that.buy_price;
				}else{
					that.price = that.sell_price;
				}
				if(!that.number || that.number == null) {
					that.$toast('请输入数量');
				}else if(!that.price || that.price == null){
					that.$toast('请输入价格');
				}else{
					that
						.$http({
							url: "Trade/issueList",
							method: "post",
							data: {
								token: sessionStorage.getItem("token"),
								type: that.type,
								number:that.number,
								price:that.price						
							}
						})
						.then(function(res) {
							console.log(res)
							if (res.data.code == 0) {
								//成功回调
								that.$toast(res.data.msg);
								that.getAssets();
								that.number = '';
								that.price = '';
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
				that.entryList = [];
				that.getEntryOrders(1);
			},
			//上拉加载更多
			loadMore() {
				let that = this;
				that.lif = true;
				that.pageindex++;
				that.getEntryOrders(0);
			},
			//挂单记录
			getEntryOrders(i) {
				let that = this;
				if (i) {
					that.lif = true;
				}
				that
					.$http({
						url: "Trade/myTrade",
						method: "post",
						data: {
							token: sessionStorage.getItem("token"),
							p:that.pageindex
						}
					})
					.then(function(res) {
						that.lif = false;
						that.isLoading = false;
						if (res.data.code == 0) {
							//成功回调
							if (res.data.data.list != "") {
								that.entryList = that.entryList.concat(res.data.data.list);
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
			//挂单记录
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
	#order {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background: rgba(0, 0, 0, 0.6);
		overflow: hidden;
		z-index: 100;
	}
    .scroll_div{
		height: 100%;
	}
	#order .weui-loadmore_line {
		margin-top: 0.8rem !important;
	}
	.order_content {
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
	.order_content img.title {
		position: absolute;
		width: 4.2rem;
		top: 0.02rem;
		left: 0.44rem;
		z-index: 9;
	}
	.order_content img.close {
		position: absolute;
		width: 0.46rem;
		right: 0.1rem;
		top: 0.1rem;
		z-index: 100;
	}
	.order_content img.title_text {
		position: absolute;
		width: 0.66rem;
		top: 0.24rem;
		left: 2.2rem;
		z-index: 10;
	}
	 .order-record {
		 position: absolute;
		 right: 0.1rem;
		 top: 0.4rem;
		 
	 }
	.order-record img {
		width: 0.26rem;
		margin-left: 0.2rem;
	
	}
	
	.order-record span {
		font-size: 0.14rem;
		color: #F07923;
	}
	/* 租赁中心 */
	.back_order {
		width: 68%;
		margin-top: 0.8rem;
		margin-left: -0.1rem;
		background: url(../assets/img/k-2.png) no-repeat 0 0.16rem;
		background-size: 100% 64%;
		padding-top: 0.3rem;
		position: relative;
		
	}
	.back_order .mint-navbar{
		margin-left: 0.2rem;
		width: 1.6rem;
		background: none;
		height: 0.28rem;
	}
	.back_order .mint-navbar .mint-tab-item{
		width: 0.64rem;
		margin: 0 0.02rem;
		height: 100%;
		background: url(../assets/img/qh-2.png) no-repeat center;
		background-size: 96% 70%;
	}
	.back_order .mint-navbar .mint-tab-item .mint-tab-item-label{
		line-height: 0.02rem;
		
	}
	.back_order .mint-navbar .mint-tab-item .mint-tab-item-label{
		font-size: 0.1rem;
		-webkit-transform-origin-x: 0;
		-webkit-transform: scale(0.90);
		color: #F7FBED;
	}
    .back_order .mint-navbar .mint-tab-item.is-selected{
		border: none;
		background: url(../assets/img/qh-1.png) no-repeat center;
		background-size: 100% 80%;
		
	}
	.back_order .mint-navbar .mint-tab-item.is-selected .mint-tab-item-label{
		 font-size: 0.12rem;
		
	 }
	 .order_con{
		 width: 100%;
		 margin-top: 0.2rem;
	 }
	.order_con .or_info {
			padding-left: 0.2rem;
			font-size: 0.16rem;
			color: #F07923;
			/* text-shadow: -0.001rem 0.01rem 0.006rem #B26901, 0.01rem 0.001rem 0.008rem #B26901;		 */	
			display: flex;
			align-items: center;
			margin-bottom: 0.14rem;
		}
	
		.order_con .or_info span:nth-child(1) {
			width: 32%;
			display: inline-block;
			text-align: left;
	
		}
	
		.order_con .or_info input {
			width: 60%;
			background: url(../assets/img/sr.png) no-repeat center center;
			background-size: 100% 100%;
			border: none;
			font-size: 0.14rem;
			padding-left: 0.1rem;
			/* color: #fff; */
			height: 0.34rem;
		}
		input::-webkit-input-placeholder {
	    /* placeholder颜色  */
	    color: #F7FBED;
		
	}
	 
	.sub_order {
		width: 100%;
		text-align: center;
		margin-top: 0.04rem;
	}

	.sub_order span {
		display: inline-block;
		width: 1.2rem;
		height: 0.66rem;
		background: url(../assets/img/an-2.png) no-repeat center;
		background-size: 100% 100%;
		text-align: center;
		line-height: 0.46rem;
		color: #fcf5de;
		font-size: 0.16rem;
		text-shadow: 0.004rem 0.004rem 0.01rem #4e1a0d;
	}
	/* //挂单记录 */
	/* .back_record {
		width: 68%;
	
		margin-top: 0.8rem;
		margin-left: -0.1rem;
		background: url(../assets/img/k-2.png) no-repeat 0 0.16rem;
		background-size: 100% 58%;
		padding-top: 0.2rem;
	} */
	
	.order_info {
			width: 100%;
			height: 1.66rem;
			overflow-y: scroll;
		}
		.back_order .order_title {
			font-weight: normal;
			color: #EE661C;
			padding: 0.14rem 0;
			position: fixed;
			background-color: #EEDFAF;
			z-index: 8;	
		}
		.van-loading__text{
			color: #F07923 !important;
		}
	.weui-loadmore_line .weui-loadmore__tips{
		   color: #F07923 !important;
	}
		.back_order .order_title span {
			font-size: 0.16rem;
			/* padding: 0 0.28rem; */
			font-weight: bold;
		}
	.back_order .order_title span:nth-child(1){
		padding-left: 0.2rem;
	}
	.back_order .order_title span:nth-child(2){
		padding-left: 0.4rem;
	}
	.back_order .order_title span:nth-child(3){
		padding-left: 0.48rem;
	}
	.back_order .order_title span:nth-child(4){
		padding-left: 0.56rem;
	}
	
		.back_order .order_lists {
			padding: 0 0.14rem;
			margin-top: 0.56rem;
		}
	
		.back_order .order_lists .order_list {
			font-size: 0.14rem;
			color: #F07923;
			display: flex;
			justify-content: space-between;
	
		}
	
		.back_order .order_lists .order_list {
			padding: 0.058rem 0;
		}
	
		.back_order .order_lists .order_list span:nth-child(2) {
			/* padding-left: 0.26rem; */
		}
	
	.entrymore {
		width: 100%;
		position: absolute;
		bottom: 0.86rem;
		text-align: center;
	
	}
	
	.entrymore .pagination {
		display: flex;
		/* width: 70% !important; */
		justify-content: center;
	}
	
	.entrymore .pagination li {
		margin: 0 0.08rem;
	}
	
	 .entrymore .pagination li a {
		color: #fff;
		text-shadow: 0.004rem 0.004rem 0.01rem #d1a729;
		font-size: 0.2rem;
	}
	.entrymore .pagination .page-item.active{
		background: #FCCD11;
	}
	.entrymore .pagination .page-item.active a{
		 color: #fff;
	 }
	.entrymore .pagination li.page-item {
		margin: 0 0.04rem;
		text-align: center;
		width: 0.2rem;
		height: 0.2rem;
		line-height: 0.2rem;
		border-radius: 50%;
		background: #fff;
		box-shadow: 0.01rem 0.018rem 0.01rem #d1a729;
	}
	
	.entrymore .pagination .page-item a {
		display: block;
		font-size: 0.12rem;
		color: #f7c634;
	}
</style>
