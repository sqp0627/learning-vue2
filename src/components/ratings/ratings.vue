<template>
  <div class="ratings" ref="ratings">
    <div class="ratings-wrapper">
      <div class="overview">
        <div class="overview-left">
          <h1 class="score">{{seller.score}}</h1>
          <div class="title">综合评分</div>
          <div class="rank">高于周边商家{{seller.rankRate}}%</div>
        </div>
        <div class="overview-right">
          <div class="score-wrapper">
            <span class="title">服务态度</span>
            <star :size="36" :score="seller.serviceScore"></star>
            <span class="score">{{seller.serviceScore}}</span>
          </div>
          <div class="score-wrapper">
            <span class="title">商品评分</span>
            <star :size="36" :score="seller.foodScore"></star>
            <span class="score">{{seller.foodScore}}</span>
          </div>
          <div class="delivery-wrapper">
            <span class="title">送达时间</span>
            <span class="delivery">{{seller.deliveryTime}}分钟</span>
          </div>
        </div>
      </div>
      <split></split>
      <retingselect @contentToggle="setOnlyContent" @ratingTypeSelect="setSelectType" :selectType="selectType" :onlyContent="onlyContent" :desc="desc" :ratings="ratings"></retingselect>
      <div class="rating-wrapper">
        <ul>
          <li v-show="needShow(rating.rateType,rating.text)" v-for="rating in ratings" class="rating-item">
            <div class="avatar">
              <img :src="rating.avatar" width="28" height="28">
            </div>
            <div class="content">
              <h1 class="name">{{rating.username}}</h1>
              <div class="star-wrapper">
                <star :size="24" :score="rating.score"></star>
                <span class="delivery">{{rating.deliveryTime}}分钟送达</span>
              </div>
              <p class="text">{{rating.text}}</p>
              <div class="recommend" v-show="rating.recommend && rating.recommend.length!==0">
                <span class="icon-thumb_up"></span>
                <span class="recommend-item" v-for="item in rating.recommend">{{item}}</span>
              </div>
              <div class="time">{{rating.rateTime | formatDate}}</div>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import star from '../star/star.vue'
  import split from '../split/split.vue'
  import retingselect from '../ratingselect/ratingselect.vue'
  import {formatDate} from '../../common/js/date'
  import BScroll from 'better-scroll'

  //  const POSITIVE = 0
  //  const NEGATIVE = 1
  const ALL = 2
  const ERR_OK = 0
  export default {
    props: {
      seller: {
        type: Object
      }
    },
    data () {
      return {
        ratings: [],
        selectType: ALL,
        onlyContent: false,
        desc: {
          all: '全部',
          positive: '满意',
          negative: '不满意'
        }
      }
    },
    components: {
      star,
      split,
      retingselect
    },
    filters: {
      formatDate(time) {
        let date = new Date(time)
        return formatDate(date, 'yyyy-MM-dd hh:mm')
      }
    },
    created () {
      this.$http.get('/api/ratings').then((response) => {
        response = response.body
        if (response.errno === ERR_OK) {
          this.ratings = response.data
          this.$nextTick(() => {
            this.scroll = new BScroll(this.$refs.ratings, {
              click: true
            })
          })
        }
      })
    },
    methods: {
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
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus ">
  @import "../../common/stylus/mixin.styl"
  .ratings
    position: absolute
    top: 174px
    bottom: 0
    left: 0
    width: 100%
    overflow: hidden
    .overview
      display: flex
      padding:18px 0
      .overview-left
        flex:0 0 137px
        width: 137px
        border-right: 1px solid rgba(7,17,27,0.1)
        text-align: center
        @media only screen and (max-width: 320px)
          flex: 0 0 100px
          width: 100px
        .score
          margin-bottom: 6px;
          line-height: 28px
          font-size: 24px
          color: rgb(255,153,0)
        .title
          margin-bottom: 8px
          line-height: 12px
          font-size: 12px
          color: rgb(7,17,27)
        .rank
          margin-bottom: 6px
          line-height: 10px
          font-size: 10px
          color: rgb(147,153,159)
      .overview-right
        flex: 1
        padding-left: 24px
        @media only screen and (max-width: 320px)
          padding-left: 6px
        .score-wrapper
          margin-bottom: 8px
          font-size: 0
          .title
            display: inline-block
            font-size: 12px
            color: rgb(7,17,27)
            vertical-align: top
            line-height: 18px
          .star
            display: inline-block
            margin:0 12px
            vertical-align: top
            .star-item
              margin-right: 8px;
          .score
            display: inline-block
            font-size: 12px
            color: rgb(255,153,0)
            line-height: 18px
            vertical-align: top
        .delivery-wrapper
          font-size: 0
          .title
            font-size: 12px
            color: rgb(7,17,27)
          .delivery
            margin-left: 14px
            font-size: 12px
            color: rgb(147,153,159)
    .rating-wrapper
      padding: 0 18px
      .rating-item
        display: flex
        padding:18px 0
        border-1px(rgba(7,17,27,0.1))
        .avatar
          margin-right: 12px
          flex: 0 0 28px
          width: 28px
          height: 28px
          img
            -webkit-border-radius: 50%
            -moz-border-radius: 50%
            border-radius: 50%

        .content
          flex: 1
          position: relative
          .name
            margin-bottom: 4px
            line-height: 12px
            font-size:10px
            color: rgb(7,17,27)
          .star-wrapper
            margin-bottom: 6px
            font-size: 0
            .star
              display: inline-block
              margin-right: 6px;
            .delivery
              display: inline-block
              line-height: 12px
              font-size: 10px
              font-weight: 200
              color: rgb(147,153,159)
          .text
            line-height: 18px
            font-size: 12px
            color: rgb(7,17,27)
          .recommend
            margin-top: 8px
            font-size:0
            .icon-thumb_up
              margin-right: 6px
              line-height: 16px
              font-size: 12px
              color: rgb(0,160,220)
            .recommend-item
              display: inline-block
              margin-right: 6px
              margin-bottom: 4px
              padding: 0 6px
              line-height: 16px
              font-size: 9px
              color: rgb(147,153,159)
              background: #fff
              border:1px solid rgba(7,17,27,0.1)
              -webkit-border-radius: 2px
              -moz-border-radius: 2px
              border-radius: 2px
          .time
            position: absolute
            top: 0
            right:0
            line-height: 12px
            font-size: 10px
            font-weight: 200
            color: rgb(147,153,159)
</style>
