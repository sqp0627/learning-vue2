<template>
  <div class="goods">
    <div class="menu-wrapper" ref="menuWrapper">
      <ul>
        <li v-for="(item,index) in goods" class="menu-item" :class="{'current': currentIndex === index}" @click="selectMenu(index,$event)">
          <span class="text border-1px"><span v-show="item.type>0" class="icon" :class="classMap[item.type]"></span>{{item.name}}</span>
        </li>
      </ul>
    </div>
    <div class="foods-wrapper" ref="foodsWrapper">
      <ul>
        <li v-for="item in goods" class="food-list food-list-hook">
          <h1 class="title">{{item.name}}</h1>
          <ul>
            <li @click="selectFood(food,$event)" v-for="food in item.foods" class="foods-item border-1px">
              <div class="icon">
                <img width="57" height="57" :src="food.icon" alt="">
              </div>
              <div class="content">
                <h2 class="name">{{food.name}}</h2>
                <p class="desc">{{food.description}}</p>
                <div class="extra">
                  <span class="count">月售{{food.sellCount}}份</span><span>好评率{{food.rating}}%</span>
                </div>
                <div class="price">
                  <span class="now">￥{{food.price}}</span><span class="old" v-show="food.oldPrice">￥{{food.oldPrice}}</span>
                </div>
                <div class="cartcontrol-wapper">
                  <cartcontrol :food="food" @cartAdd="_drop"></cartcontrol> <!--//监听子组件触发的carAdd事件,然后调用_drop方法-->
                </div>
              </div>
            </li>
          </ul>
        </li>
      </ul>
    </div>
    <!--子组件通过ref绑定绑定一个引用id，方便父组件访问该子组件-->
    <shopcart ref="shopcart" :select-foods="selectFoods" :delivery-price="seller.deliveryPrice" :min-price="seller.minPrice"></shopcart>
    <food ref="food" :food="selectedFood" @cartAdd="_drop" @setTarget="_drop"></food>
  </div>
</template>

<script type="text/ecmascript-6">
  import BScroll from 'better-scroll'
  import shopcart from '../shopcart/shopcart.vue'
  import cartcontrol from '../cartcontrol/cartcontrol.vue'
  import food from '../food/food.vue'

  const ERR_OK = 0
  export default {
    props: {
      seller: {
        type: Object
      }
    },
    data() {
      return {
        goods: [],
        listHeight: [],
        scrollY: 0,
        selectedFood: {}
      }
    },
    computed: {
      currentIndex() {
        for (let i = 0; i < this.listHeight.length; i++) {
          let height1 = this.listHeight[i]
          let height2 = this.listHeight[i + 1]
          if (!height2 || (this.scrollY >= height1 && this.scrollY < height2)) {
            return i
          }
        }
        return 0
      },
      selectFoods() {
        let foods = []
        this.goods.forEach((good) => {
          good.foods.forEach((food) => {
            if (food.count) {
              foods.push(food)
            }
          })
        })
        return foods
      }
    },
    created() {
      this.classMap = ['decrease', 'discount', 'special', 'invoice', 'guarantee']
      this.$http.get('/api/goods').then((response) => {
        response = response.body
        if (response.errno === ERR_OK) {
          this.goods = response.data
          this.$nextTick(() => {
            this._initScroll()
            this._calculateHeight()
          })
        }
      })
      this.$root.eventHub.$on('cartAdd', (target) => {
//        this.$refs.shopcart.drop(target)
      })
    },
//    beforeDestroy() {
//      this.$root.eventHub.$off('cartAdd')
//    },
    methods: {
      selectMenu(index, event) {
        if (!event._constructed) { // 阻止betterScroll派发的点击事件
          return
        }
        let foodList = this.$refs.foodsWrapper.getElementsByClassName('food-list-hook')
        let el = foodList[index]
        this.foodScroll.scrollToElement(el, 300)
      },
      _initScroll() {
        this.menuScroll = new BScroll(this.$refs.menuWrapper, {
          click: true  // 初始化左侧导航菜单滚动时，允许点击事件
        })

        this.foodScroll = new BScroll(this.$refs.foodsWrapper, {
          click: true,  // 初始化食物展示列表时，允许点击事件
          probeType: 3
        })
        this.foodScroll.on('scroll', (pos) => {
          this.scrollY = Math.abs(Math.round(pos.y))
        })
      },
      _calculateHeight() {
        let foodList = this.$refs.foodsWrapper.getElementsByClassName('food-list-hook')
        let height = 0
        this.listHeight.push(height)
        for (let i = 0; i < foodList.length; i++) {
          let item = foodList[i]
          height += item.clientHeight
          this.listHeight.push(height)
        }
      },
      _drop(target) {
        this.$refs.shopcart.drop(target)  // 父组件通过绑定的引用id：shopcart来访问子组件，并调用drop方法
      },
      selectFood(food, event) {
        if (!event._constructed) { // 阻止betterScroll派发的点击事件
          return
        }
        this.selectedFood = food
        this.$refs.food.show()
      }
    },
    components: {
      shopcart,
      cartcontrol,
      food
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus ">
  @import "../../common/stylus/mixin.styl"
  .goods
    display: flex
    position: absolute
    top: 174px
    bottom: 46px
    width: 100%
    overflow: hidden
    .menu-wrapper
      flex:0 0 80px
      width: 80px
      background: #f3f5f7
      .menu-item
        display: table
        height: 54px
        width: 56px
        padding: 0 12px
        line-height: 14px
        &.current
          background: #fff
          position: relative;
          margin-top: -1px
          z-index: 10
          .text
            border-none()
            font-weight: 700
        .icon
          display: inline-block
          width: 18px
          height: 18px
          vertical-align: top
          margin-right: 2px
          -webkit-background-size: 18px 18px
          background-size: 18px 18px
          background-repeat:no-repeat
          &.decrease
            bg-image('decrease_3')
          &.discount
            bg-image('discount_3')
          &.guarantee
            bg-image('guarantee_3')
          &.invoice
            bg-image('invoice_3')
          &.special
            bg-image('special_3')
        .text
          font-size: 12px
          display:table-cell
          width: 56px
          vertical-align middle
          border-1px(rgba(7,17,27,0.1))
    .foods-wrapper
      flex:1
      .title
        padding-left: 14px
        height: 26px
        line-height: 26px
        border-left: 2px solid #d9dde1
        font-size: 12px
        color: rgb(147,153,159)
        background: #f3f5f7
      .foods-item
        display: flex
        margin: 18px
        padding-bottom: 18px
        border-1px(rgba(7,17,27,0.1))
        &:last-child
          border-none()
          margin-bottom: 0
      .icon
        flex: 0 0 57px
        margin-right: 10px
      .content
        flex: 1
        .name
          font-size: 14px
          line-height: 14px
          margin:2px 0 8px 0
          height: 14px
          color: rgb(7,17,27)

        .desc,.extra
          font-size: 10px
          height: 10px
          line-height: 10px
          color: rgb(147,153,159)
        .desc
          margin-bottom: 8px
          line-height: 12px
          height: auto
          width: 100%
        .extra
          .count
            margin-right: 12px;
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
        .cartcontrol-wapper
          position: absolute
          right: 0
          bottom: 12px
</style>
