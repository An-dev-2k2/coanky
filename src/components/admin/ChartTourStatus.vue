<template>
  <div>
    <span class="font-bold">Tỷ lệ trạng thái tour</span>
    <div class="chart" ref="chartTourStatus"></div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from "vue";
import * as echarts from "echarts";

const props = defineProps({
  data: {
    type: Object,
    default: () => ({})
  }
})

const chartTourStatus = ref(null)
let myChart = null

const renderChart = (data) => {
  if (!chartTourStatus.value) return

  if (!myChart) {
    myChart = echarts.init(chartTourStatus.value)
  }

  const total = data.completed + data.notCompleted

  const option = {
    tooltip: {
      trigger: "item",
      formatter: "{b}: {c} ({d}%)"
    },
    legend: {
      bottom: 0
    },
    series: [
      {
        name: "Tour Status",
        type: "pie",
        radius: "60%",
        data: [
          { value: data.completed, name: "Hoàn thành" },
          { value: data.notCompleted, name: "Chưa hoàn thành" }
        ],
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: "rgba(0, 0, 0, 0.5)"
          }
        }
      }
    ]
  }

  myChart.setOption(option)
}

watch(() => props.data, (newVal) => {
  if (newVal) renderChart(newVal)
}, { deep: true })

onMounted(() => {
  if (props.data) renderChart(props.data)
  window.addEventListener("resize", () => {
    myChart && myChart.resize()
  })
})
</script>

<style scoped>
.chart {
  height: 400px;
}
</style>