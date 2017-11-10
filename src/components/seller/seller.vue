<template>
  <div class="seller">
    <div class="seller-content">
      <div class="overview">
        <h1 class="title">{{seller.name}}</h1>
        <div class="dec border-1px">
          <star :size="36" :score="seller.score"></star>
          <span class="text">({{seller.ratingCount}})</span>
          <span class="text">月售{{seller.sellCount}}单</span>
        </div>
        <ul class="remark">
          <li class="block">
            <h2 class="block-title">起送价</h2>
            <div class="content">
              <span class="stress">{{seller.minPrice}}</span>元
            </div>
          </li>
          <li class="block">
            <h2 class="block-title">商家配送</h2>
            <div class="content">
              <span class="stress">{{seller.deliveryPrice}}</span>元
            </div>
          </li>
          <li class="block">
            <h2 class="block-title">平均配送时间</h2>
            <div class="content">
              <span class="stress">{{seller.deliveryTime}}</span>分钟
            </div>
          </li>
        </ul>
      </div>
      <split></split>
      <div class="bulletin">
        <h1 class="title">公告与活动</h1>
        <div class="content-wrapper border-1px">
          <p class="content">{{seller.bulletin}}</p>
        </div>
      </div>
      <ul v-if="seller.supports" class="supports">
        <li class="support-item" v-for="(item,index) in seller.supports">
          <span class="icon" :class="classMap[seller.supports[index].type]"></span>
          <span class="text">{{seller.supports[index].description}}</span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import star from '../star/star.vue'
  import split from '../split/split.vue'
  export default {
    props: {
      seller: {
        type: Object
      }
    },
    data() {
      return {
        classMap: []
      }
    },
    components: {
      star,
      split
    },
    created() {
      this.classMap = ['decrease', 'discount', 'special', 'invoice', 'guarantee']
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus ">
  @import "../../common/stylus/mixin.styl"
  @import "../../common/style.css"
  .seller
    position: absolute
    top: 174px
    bottom: 0
    left: 0
    width: 100%
    overflow: hidden
    .overview
      padding: 18px
      .title
        margin-bottom: 8px
        line-height: 14px
        font-size: 14px
        color: rgb(7,17,27)
      .dec
        padding-bottom: 18px
        line-height: 18px
        font-size: 0
        border-1px(rgba(7,17,27,0.1))
        .star
          display: inline-block
          margin-right: 8px
        .text
          display: inline-block
          margin-right: 12px
          font-size: 10px
          color: rgb(77,85,93)
      .remark
        display: flex
        padding:18px 0
        .block
          flex: 1
          text-align: center
          border-right: 1px solid rgba(7,17,27,0.1)
          &:last-child
            border-right:none
          .block-title
            margin-bottom: 4px
            line-height: 10px
            font-size: 10px
            color: rgb(147,153,159)
          .content
            color: rgb(7,17,27)
            .stress
              line-height: 24px
              font-size: 24px
              font-weight: 200
    .bulletin
      padding:18px 18px 0 18px
      .title
        margin-bottom: 8px
        line-height: 14px
        font-size: 14px
        color: rgb(7,17,27)
      .content-wrapper
        padding:0 12px 16px 12px
        border-1px(rgba(7,17,27,0.1))
        .content
          line-height: 24px
          font-size: 12px
          font-weight: 200
          color: rgb(240,20,20)
    .supports
      font-size:0
      .support-item
        padding: 0 12px;
        margin-bottom: 12px;
        font-size: 0;
        .icon
          display: inline-block
          vertical-align: top
          width: 12px
          height: 12px
          margin-right: 4px
          -webkit-background-size: 12px 12px
          background-size: 12px 12px
          background-repeat:no-repeat
          &.decrease
            bg-image('decrease_1')
          &.discount
            bg-image('discount_1')
          &.guarantee
            bg-image('guarantee_1')
          &.invoice
            bg-image('invoice_1')
          &.special
            bg-image('special_1')
        .text
          line-height: 12px
          font-size: 10px
</style>
