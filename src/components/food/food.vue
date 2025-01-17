<template>
  <transition name="move">
    <div v-show="showFlag" class="food" ref="food">
      <div class="food-content">
        <div class="img-header">
          <img :src="food.image">
          <div class="back" @click="hide"><i class="icon-arrow_lift"></i></div>
        </div>
        <div class="content">
          <h1 class="title">{{food.name}}</h1>
          <div class="detail">
            <span class="sell-count">月售{{food.sellCount}}份</span>
            <span class="rating">好评率{{food.rating}}%</span>
          </div>
          <div class="price">
            <span class="now">￥{{food.price}}</span>
            <span class="old" v-show="food.oldPrice">￥{{food.oldPrice}}</span>
          </div>
          <div class="cartcontrol-wrapper">
            <cartcontrol :food="food" v-show="food.count>0" @cartAdd="getTarget"></cartcontrol>
          </div>
          <transition name="fade">
            <div @click="addFirst" class="buy" v-show="!food.count || food.count===0">加入购物车</div>
          </transition>
        </div>
        <split v-show="food.info"></split>
        <div class="info" v-show="food.info">
          <h1 class="title">商品介绍</h1>
          <p class="text">{{food.info}}</p>
        </div>
        <split></split>
        <div class="rating">
          <h1 class="title">商品评价</h1>
          <ratingselect @contentToggle="setOnlyContent" @ratingTypeSelect="setSelectType" :selectType="selectType" :onlyContent="onlyContent" :desc="desc" :ratings="food.ratings"></ratingselect>
          <div class="rating-wrapper">
            <ul v-show="food.ratings && food.ratings.length">
              <li v-show="needShow(rating.rateType,rating.text)" v-for="rating in food.ratings" class="rating-item border-1px">
                <div class="user">
                  <span class="name">{{rating.username}}</span>
                  <img class="avatar" :src="rating.avatar" width="12" height="12">
                </div>
                <div class="time">{{rating.rateTime | formatDate}}</div>
                <p class="text">
                  <span :class="{'icon-thumb_up':rating.rateType===0,'icon-thumb_down':rating.rateType===1}"></span>{{rating.text}}
                </p>
              </li>
            </ul>
            <div class="no-rating" v-show="!food.ratings || !food.ratings.length">暂无评价</div>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script type="text/ecmascript-6">
  import BScroll from 'better-scroll'
  import cartcontrol from '../cartcontrol/cartcontrol.vue'
  import Vue from 'vue'
  import split from '../split/split.vue'
  import ratingselect from '../ratingselect/ratingselect.vue'
  import {formatDate} from '../../common/js/date'

//  const POSITIVE = 0
//  const NEGATIVE = 1
  const ALL = 2
  export default {
    props: {
      food: {
        type: Object
      }
    },
    data() {
      return {
        showFlag: false,
        selectType: ALL,
        onlyContent: false,
        desc: {
          all: '全部',
          positive: '推荐',
          negative: '吐槽'
        }
      }
    },
    components: {
      cartcontrol,
      split,
      ratingselect
    },
    methods: {
      show() {
        this.showFlag = true
        this.selectType = ALL
        this.onlyContent = false
        this.$nextTick(() => {
          if (!this.scroll) {
            this.scroll = new BScroll(this.$refs.food, {
              click: true
            })
          } else {
            this.scroll.refresh()
          }
        })
      },
      hide() {
        this.showFlag = false
      },
      addFirst(event) {
        if (!event._constructed) {
          return
        }
        Vue.set(this.food, 'count', 1)
        this.$emit('cartAdd', event.target) // 主动触发carAdd方法，传递数据‘event.target’
      },
      getTarget(target) {
        this.$emit('setTarget', target)
      },
      needShow(type, text) {
        if (this.onlyContent && text === '') { // 只显示内容并且内容不存在
          return false
        }
        if (this.selectType === ALL) { // 数据的类型和选择显示的类型相同
          return true
        } else {
          return type === this.selectType
        }
      },
      setOnlyContent(type) {
        this.onlyContent = type
        this.$nextTick(() => {
          this.scroll.refresh()
        })
      },
      setSelectType(type) {
        this.selectType = type
        this.$nextTick(() => {
          this.scroll.refresh()
        })
      }
    },
    filters: {
      formatDate(time) {
        let date = new Date(time)
        return formatDate(date, 'yyyy-MM-dd hh:mm')
      }
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/mixin.styl"
  .food
    position: fixed
    top: 0
    left: 0
    bottom: 48px
    z-index: 30
    width: 100%
    background: #fff
    &.move-enter-active,&.move-leave-active
      transition: all .2s linear
    &.move-enter,&.move-leave-to
      transform: translate3d(100%,0,0)
    .img-header
      position: relative
      width: 100%
      height:0
      padding-top:100%
      img
        position: absolute
        top: 0
        left: 0
        width: 100%
        height: 100%
      .back
        position: absolute
        top: 10px
        left: 0
        .icon-arrow_lift
          display: inline-block
          padding: 10px
          font-size: 20px
          color: #eee
    .content
      position: relative
      padding: 18px
      .title
        line-height: 14px
        font-size: 14px
        font-weight: 700
        color: rgb(7,17,27)
        margin-bottom: 8px
      .detail
        margin-bottom: 18px
        font-size: 0px
        line-height: 10px
        color: rgb(147,153,159)
        .sell-count,.rating
          font-size: 10px
        .sell-count
          margin-right: 12px
      .price
        font-weight: 700
        line-height: 24px
        .now
          margin-right: 8px
          font-size: 14px
          color: rgb(240,20,20)
        .old
          text-decoration:line-through
          font-size: 10px
          color: rgb(147,153,159)
      .cartcontrol-wrapper
        position: absolute
        right: 12px
        bottom: 12px
      .buy
        position: absolute
        right: 18px
        bottom: 18px
        z-index: 2
        height: 24px
        line-height: 24px
        padding:0 12px
        -webkit-box-sizing: border-box
        -moz-box-sizing: border-box
        box-sizing: border-box
        font-size: 10px
        border-radius: 12px
        color: #fff
        background: rgb(0,160,220)
        .fade-enter-active, .fade-leave-active
          transition: opacity .5s
        .fade-enter, .fade-leave-to
          opacity: 0
    .info
      padding: 18px
      .title
        line-height: 14px
        margin-bottom:6px
        font-size: 14px
        color: rgb(7,17,27)
      .text
        line-height: 24px
        padding:0 8px
        font-size: 12px
        color: rgb(77,85,93)
    .rating
      padding-top: 18px
      .title
        line-height: 14px
        margin-left:18px
        font-size: 14px
        color: rgb(7,17,27)
      .rating-wrapper
        padding:0 18px
        .rating-item
          position: relative
          padding:16px 0
          border-1px(rgba(7,17,27,0.2))
          .user
            position: absolute
            right: 0
            top: 16px
            font-size: 0
            line-height: 12px
            .name
              margin-right: 6px
              font-size: 10px
              color: rgb(147,153,159)
              vertical-align: top
            .avatar
              -webkit-border-radius: 50%
              -moz-border-radius: 50%
              border-radius: 50%
          .time
            margin-bottom: 6px
            font-size: 10px
            line-height: 12px
            color: rgb(147,153,159)
          .text
            line-height: 16px
            font-size: 12px
            color: rgb(7,17,27)
            .icon-thumb_up,.icon-thumb_down
              margin-right: 4px
              line-height: 24px
              font-size: 12px
            .icon-thumb_up
              color: rgb(0,160,220)
            .icon-thumb_down
              color:rgb(147,153,159)
        .no-rating
          padding:16px 0
          font-size: 12px
          color: rgb(147,153,159)
</style>
