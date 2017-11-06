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
        </div>
        <div class="cartcontrol-wrapper">
          <cartcontrol @cartAdd="_drop" :food="food" v-show="food.count>0"></cartcontrol>
        </div>
        <transition name="fade">
          <div @click="addFirst" class="buy" v-show="!food.count || food.count===0">加入购物车</div>
        </transition>
      </div>
    </div>
  </transition>
</template>

<script type="text/ecmascript-6">
  import BScroll from 'better-scroll'
  import cartcontrol from '../cartcontrol/cartcontrol.vue'
  import Vue from 'vue'

  export default {
    props: {
      food: {
        type: Object
      }
    },
    data() {
      return {
        showFlag: false
      }
    },
    components: {
      cartcontrol
    },
    methods: {
      show() {
        this.showFlag = true
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
        this.$emit('cartAdd', event.target) // 主动触发carAdd方法，传递数据‘event.target’
        Vue.set(this.food, 'count', 1)
      },
      _drop(target) {
        console.log(target)
      }
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
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
</style>
