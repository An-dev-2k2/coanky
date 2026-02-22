<template>
  <div>
    <span class=" font-bold">Doanh thu từ {{ startOfMonth }} đến {{ endOfToday }}</span>
    <div class="chart" ref="chartRevenueByDate"></div>
  </div>
</template>

<script setup>
import { ref, watch } from "vue";
import * as echarts from 'echarts';

const props = defineProps({
  data: {
    type: Object,
    default: () => { },
  },
  startOfMonth: {
    type: String,
    default: () => { },
  },
  endOfToday: {
    type: String,
    default: () => { },
  }
})
const chartRevenueByDate = ref(null);

watch(() => props.data, (newVal) => {
  handlerChartLine(newVal)
})

const handlerChartLine = (data) => {
  let dom = chartRevenueByDate.value;
  let myChart = echarts.init(dom, null, {
    renderer: 'canvas',
    useDirtyRect: false
  });
  let option = {
    tooltip: {
      trigger: "axis",
    },
    grid: {
      left: '3%',
      right: '3%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: {
      type: "category",
      data: data.dates,
    },
    yAxis: {
      type: "value",
    },
    series: [
      {
        data: data.revenues,
        type: "line",
        smooth: false,
        areaStyle: {},
        lineStyle: {
          color: "#4caf50", // Màu xanh success
        },
        areaStyle: {
          color: "rgba(76, 175, 80, 0.2)", // Màu xanh nhạt cho vùng dưới đường line
        },
        itemStyle: {
          color: "#4caf50", // Màu các điểm trên line
        },
      },
    ],
  }
  if (option && typeof option === 'object') {
    myChart.setOption(option);
  }

  window.addEventListener('resize', myChart.resize);
}
</script>

<style scoped>
.chart {
  height: 450px;
}
</style>
