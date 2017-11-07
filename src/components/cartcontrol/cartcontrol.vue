<template>
  <div class="cart-control">
    <transition name="move">
      <div class="cart-decrease icon-remove_circle_outline" v-show="food.count>0" @click.stop="decreaseCart($event)"></div>
    </transition>
    <div class="cart-count" v-show="food.count>0">{{food.count}}</div>
    <div class="cart-add icon-add_circle" @click.stop="addCart($event)"></div>
  </div>
</template>

<script type="text/ecmascript-6">
  import Vue from 'vue'
  export default {
    props: {
      food: {
        type: Object
      }
    },
    methods: {
      addCart(event) {
        if (!event._constructed) { // 阻止betterScroll派发的点击事件
          return
        }
        if (!this.food.count) {
          Vue.set(this.food, 'count', 1)
        } else {
          this.food.count++
        }
        this.$emit('cartAdd', event.target) // 主动触发carAdd方法，传递数据‘event.target’
//        this.$root.eventHub.$emit('cartAdd', event.target)
      },
      decreaseCart(event) {
        if (!event._constructed) { // 阻止betterScroll派发的点击事件
          return
        }
        if (this.food.count > 0) {
          this.food.count--
        }
      }
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  .cart-control
    font-size: 0
    .cart-decrease
      display: inline-block
      padding: 6px
      font-size: 24px
      line-height: 24px
      color: rgb(0,160,220)
      &.move-enter-active,&.move-leave-active
        transition: all 0.4s ease
      &.move-enter,&.move-leave-to
        transform: translate3d(24px,0,0)
        opacity: 0
    .cart-count
      display: inline-block
      color: rgb(147,153,159)
      width: 12px
      line-height: 24px
      font-size: 10px
      vertical-align: top
      padding-top: 6px
      text-align: center
    .cart-add
      display: inline-block
      padding: 6px
      font-size: 24px
      line-height: 24px
      color: rgb(0,160,220)
</style>
