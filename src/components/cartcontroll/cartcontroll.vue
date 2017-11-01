<template>
  <div class="cartcontroll">
    <div class="cart-decrease" v-show="food.count>0"></div>
    <div class="count" v-show="food.count>0">{{food.count}}</div>
    <div class="cart-add"></div>
  </div>
</template>

<script type="text/ecmascript-6">
  export default {
    props: {
      food: {
        type: Object
      }
    },
    created: {}
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
</style>
