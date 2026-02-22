<template>
  <div>
    <h4 class="font-bold mb-4">Doanh thu & số tour bán</h4>
    <div ref="chartRef" class="chart"></div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import * as echarts from 'echarts'

const props = defineProps({
  data: Object
})

const chartRef = ref(null)
let chartInstance = null

watch(() => props.data, (val) => {
  if (!val?.months?.length) return

  if (!chartInstance) {
    chartInstance = echarts.init(chartRef.value)
  }

  chartInstance.setOption({
    tooltip: { trigger: 'axis' },
    legend: {
      data: ['Doanh thu', 'Số tour']
    },
    xAxis: {
      type: 'category',
      data: val.months
    },
    yAxis: [
      {
        type: 'value',
        name: 'Doanh thu'
      },
      {
        type: 'value',
        name: 'Số tour'
      }
    ],
    series: [
      {
        name: 'Doanh thu',
        type: 'line',
        yAxisIndex: 0,
        smooth: true,
        data: val.revenues
      },
      {
        name: 'Số tour',
        type: 'bar',
        yAxisIndex: 1,
        data: val.tours
      }
    ]
  })
})
</script>

<style scoped>
.chart {
  height: 400px;
}
</style>