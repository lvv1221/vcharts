const Vcharts = {}
Vcharts.install = (Vue, options) => {
  Vue.prototype.chart = (canvasId, data, x, y, options) => {
    let canvas = document.getElementById(canvasId)
    let ctx = canvas.getContext('2d')
    console.log(ctx)
    data = dataInit(data, x, y)
    console.log(data)
  }
  let dataInit = (data, x, y) => {
    let keyName = x || 'xAxis'
    let valueName = y || 'value'
    let arr = []
    for (let obj of data) {
      let temp = {}
      let xValue = obj[x]
      let yValue = obj[y]
      Object.assign(temp, {keyName, xValue}, {valueName, yValue})
      arr.push(temp)
    }
    return arr
  }
}

export default Vcharts
