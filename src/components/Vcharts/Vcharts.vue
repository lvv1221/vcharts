<template>
  <div class="chart">
    <canvas id="canvas" :width="width" :height="height"></canvas>
  </div>
</template>

<script>
  export default {
    name: 'chart',
    props: {
      width: {
        type: Number,
        default: 500
      },
      height: {
        type: Number,
        default: 400
      },
      data: {
        type: Array,
        required: true
      },
      xAxis: {
        type: String,
        requeired: true
      },
      yAxis: {
        type: String,
        requeired: true
      },
      options: {
        type: Object
      }
    },
    data () {
      return {
        padding: 50,
        axisColor: '#eeeeee',
        bgColor: '#829dba',
        fillColor: '#72f6ff',
        ctx: {},
        canvas: {},
        yEqual: 5,
        xLength: 0,
        yLength: 0,
        yFictitious: 0,
        yRatio: 0,
        contentColor: '#bbbbbb',
        title: 'XX公司年度盈利',
        titlePosition: 'top',
        current: 0,
        currentIndex: -1,
        onceMove: -1,
        looped: null
      }
    },
    mounted () {
      this.canvas = document.getElementById('canvas')
      this.ctx = this.canvas.getContext('2d')
      this.init(this.options)
    },
    methods: {
      init (options) {
        if (options) {
          this.padding = options.padding || 50
          this.yEqual = options.yEqual || 5
          this.bgColor = options.bgColor || '#ffffff'
          this.fillColor = options.fillColor || '#1E9FFF'
          this.axisColor = options.axisColor || '#666666'
          this.contentColor = options.contentColor || '#eeeeee'
          this.titleColor = options.titleColor || '#000000'
          this.title = options.title
          this.titlePosition = options.titlePosition || 'top'
        }
        this.looping()
      },
      drawBg () {
        this.width = this.canvas.width
        this.height = this.canvas.height
        this.ctx.fillStyle = this.bgColor
        this.ctx.fillRect(0, 0, this.width, this.height)
      },
      drawXY () {
        this.ctx.beginPath()
        this.ctx.lineWidth = 1
        this.ctx.strokeStyle = this.axisColor
        // y
        this.ctx.moveTo(this.padding + 0.5, this.height - this.padding + 0.5)
        this.ctx.lineTo(this.padding + 0.5, this.padding + 0.5)
        this.ctx.stroke()
        // x
        this.ctx.moveTo(this.padding + 0.5, this.height - this.padding + 0.5)
        this.ctx.lineTo(this.width - this.padding + 0.5, this.height - this.padding + 0.5)
        this.ctx.stroke()
      },
      drawPoint () {
        this.yLength = Math.floor((this.height - this.padding * 2) / this.yEqual)
        this.xLength = Math.floor((this.width - this.padding * 2) / this.data.length)
        // xpoint
        this.ctx.beginPath()
        this.ctx.font = '12px Microsfoft YaHei'
        this.ctx.textAlign = 'center'
        this.ctx.fillStyle = this.axisColor
        for (let i = 0; i < this.data.length; i++) {
          let xAxis = this.data[i][this.xAxis]
          let xlen = this.xLength * (i + 1)
          this.ctx.moveTo(this.padding + xlen + 0.5, this.height - this.padding + 0.5)
          this.ctx.lineTo(this.padding + xlen + 0.5, this.height - this.padding + 5.5)
          this.ctx.fillText(xAxis, this.padding + xlen - this.xLength / 2, this.height - this.padding + 15)
        }
        this.ctx.stroke()
        // ypoint
        this.ctx.beginPath()
        this.ctx.font = '12px Microsoft Yahei'
        this.ctx.textAlign = 'right'
        this.ctx.fillStyle = this.axisColor
        this.yFictitious = this.getYFictitious(this.data)
        // 获取y轴上每个单位数值的长度
        this.yRatio = this.yLength / this.yFictitious
        // this.ctx.moveTo(this.padding + 0.5, this.height - this.padding + 0.5)
        // this.ctx.lineTo(this.padding - 4.5, this.height - this.padding + 0.5)
        this.ctx.fillText(0, this.padding - 10, this.height - this.padding + 5)
        for (let i = 0; i < this.yEqual; i++) {
          let y = this.yFictitious * (i + 1)
          let ylen = this.yLength * (i + 1)
          // y point & zuobiao
          this.ctx.beginPath()
          this.ctx.strokeStyle = this.axisColor
          this.ctx.moveTo(this.padding + 0.5, this.height - this.padding - ylen + 0.5)
          this.ctx.lineTo(this.padding - 4.5, this.height - this.padding - ylen + 0.5)
          this.ctx.stroke()
          this.ctx.fillText(y, this.padding - 10, this.height - this.padding - ylen + 5)
          // y line
          this.ctx.beginPath()
          this.ctx.strokeStyle = this.contentColor
          this.ctx.moveTo(this.padding + 0.5, this.height - this.padding - ylen + 0.5)
          this.ctx.lineTo(this.width - this.padding + 0.5, this.height - this.padding - ylen + 0.5)
          this.ctx.stroke()
        }
      },
      // 获取y轴坐标间的数值差
      getYFictitious (data) {
        let arr = data.slice(0)
        arr.sort((a, b) => {
          return -(a[this.yAxis] - b[this.yAxis])
        })
        let len = Math.ceil(arr[0][this.yAxis] / this.yEqual)
        let pow = len.toString().length - 1
        pow = pow > 2 ? 2 : pow
        return Math.ceil(len / Math.pow(10, pow)) * Math.pow(10, pow)
      },
      drawTitle () {
        if (this.title) {
          this.ctx.beginPath()
          this.ctx.textAlign = 'center'
          this.ctx.fillStyle = this.axisColor
          this.ctx.font = '12px Microsoft YaHei'
          if (this.titlePosition === 'bottom' && this.padding >= 40) {
            this.ctx.fillText(this.title, this.width / 2, this.height - 5)
          } else {
            this.ctx.fillText(this.title, this.width / 2, this.padding / 2)
          }
        }
      },
      looping () {
        this.looped = requestAnimationFrame(this.looping.bind(this))
        if (this.current < 100) {
          this.current = (this.current + 3) > 100 ? 100 : this.current + 3
          this.drawAnimation()
        } else {
          window.cancelAnimationFrame(this.looped)
          this.looped = null
          this.watchHover()
        }
      },
      drawAnimation () {
        for (let i = 0; i < this.data.length; i++) {
          let x = Math.ceil(this.data[i][this.yAxis] * this.current / 100 * this.yRatio)
          let y = this.height - this.padding - x
          this.data[i].left = this.padding + this.xLength * (i + 0.25)
          this.data[i].top = y
          this.data[i].right = this.padding + this.xLength * (i + 0.75)
          this.data[i].bottom = this.height - this.padding
          this.drawUpdate()
        }
      },
      drawUpdate () {
        this.drawBg()
        this.drawXY()
        this.drawPoint()
        this.drawTitle()
        this.drawChart()
      },
      drawChart () {
        this.ctx.fillStyle = this.fillColor
        for (let i = 0; i < this.data.length; i++) {
          this.ctx.fillRect(
            this.data[i].left,
            this.data[i].top,
            this.data[i].right - this.data[i].left,
            this.data[i].bottom - this.data[i].top
          )
          this.ctx.font = '12px Arial'
          this.ctx.textAlign = 'center'
          this.ctx.fillText(
            this.data[i][this.yAxis] * this.current / 100,
            this.data[i].left + this.xLength / 4,
            this.data[i].top - 5
          )
        }
      },
      watchHover () {
        this.canvas.addEventListener('mousemove', (ev) => {
          ev = ev || window.event
          this.currentIndex = -1
          for (let i = 0; i < this.data.length; i++) {
            if (ev.offsetX > this.data[i].left && ev.offsetX < this.data[i].right &&
              ev.offsetY > this.data[i].top && ev.offsetY < this.data[i].bottom) {
              this.currentIndex = i
            }
          }
          this.drawHover()
        })
      },
      drawHover () {
        if (this.currentIndex !== -1) {
          if (this.onceMove === -1) {
            this.onceMove = this.currentIndex
            this.canvas.style.cursor = 'pointer'
          }
        } else {
          if (this.onceMove !== -1) {
            this.onceMove = -1
            this.canvas.style.cursor = 'inherit'
          }
        }
      }
    }
  }
</script>

<style>

</style>
