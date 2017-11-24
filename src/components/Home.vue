<template>
  <div class="home">
    <v-charts :data="data"  xAxis="year" yAxis="money"></v-charts>
  </div>
</template>

<script>
import vcharts from './Vcharts/Vcharts.vue'
export default {
  name: 'Home',
  data () {
    return {
      msg: 'Welcome to Your Vue.js App',
      data: [{
        year: '2012',
        money: 2141
      }, {
        year: '2013',
        money: 1499
      }, {
        year: '2014',
        money: 3260
      }, {
        year: '2015',
        money: 1170
      }, {
        year: '2016',
        money: 970
      }, {
        year: '2017',
        money: 2350
      }]
    }
  },
  components: {
    'v-charts': vcharts
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
