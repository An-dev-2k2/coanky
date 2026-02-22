<template>
  <div>
    <h4 class="font-bold mb-4">Doanh thu năm nay vs năm trước</h4>
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
      data: ['Năm nay', 'Năm trước']
    },
    xAxis: {
      type: 'category',
      data: val.months
    },
    yAxis: {
      type: 'value'
    },
    series: [
      {
        name: 'Năm nay',
        type: 'line',
        smooth: true,
        data: val.currentYear
      },
      {
        name: 'Năm trước',
        type: 'line',
        smooth: true,
        data: val.previousYear
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