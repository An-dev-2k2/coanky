<template>
  <div>
    <div class="flex items-center justify-between mb-1">
      <span class="font-bold">Top tour được mua nhiều nhất</span>
      <span v-if="data && data.length" class="text-xs text-gray-400 font-medium">
        Top {{ data.length }} tour
      </span>
    </div>
    <div v-if="!data || data.length === 0" class="flex flex-col items-center justify-center h-[360px] text-gray-400">
      <svg xmlns="http://www.w3.org/2000/svg" class="w-12 h-12 mb-2 opacity-40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
          d="M9 17v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v8m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
      <span class="text-sm">Chưa có dữ liệu trong khoảng thời gian này</span>
    </div>
    <div v-else class="chart" ref="chartRef"></div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted, nextTick } from 'vue'
import * as echarts from 'echarts'

const props = defineProps({
  data: {
    type: Array,
    default: () => []
  }
})

const chartRef = ref(null)
let myChart = null

// Bảng màu gradient đẹp cho từng slice
const COLORS = [
  '#6366f1', // indigo
  '#f59e0b', // amber
  '#10b981', // emerald
  '#ef4444', // red
  '#3b82f6', // blue
  '#8b5cf6', // violet
  '#ec4899', // pink
  '#14b8a6', // teal
]

const renderChart = (data) => {
  if (!chartRef.value || !data || data.length === 0) return

  nextTick(() => {
    if (!myChart) {
      myChart = echarts.init(chartRef.value)
    }

    const seriesData = data.map((item, index) => ({
      value: item.value,
      name: item.name,
      itemStyle: {
        color: COLORS[index % COLORS.length]
      }
    }))

    const option = {
      tooltip: {
        trigger: 'item',
        backgroundColor: 'rgba(17, 24, 39, 0.9)',
        borderColor: 'rgba(255,255,255,0.1)',
        borderWidth: 1,
        textStyle: { color: '#f9fafb', fontSize: 12 },
        formatter: (params) => {
          return `<div style="font-weight:600;margin-bottom:4px">${params.name}</div>
                  <div>${params.value} lượt mua &nbsp;<span style="color:${params.color}">&#9632;</span></div>
                  <div style="color:#9ca3af;font-size:11px">${params.percent}% tổng</div>`
        }
      },
      legend: {
        orient: 'vertical',
        right: 0,
        top: 'center',
        itemWidth: 10,
        itemHeight: 10,
        borderRadius: 2,
        textStyle: {
          fontSize: 11,
          color: '#6b7280',
          width: 120,
          overflow: 'truncate'
        },
        formatter: (name) => {
          const maxLen = 20
          return name.length > maxLen ? name.substring(0, maxLen) + '…' : name
        }
      },
      series: [
        {
          name: 'Tour',
          type: 'pie',
          radius: ['38%', '68%'],
          center: ['35%', '50%'],
          avoidLabelOverlap: true,
          itemStyle: {
            borderRadius: 6,
            borderColor: '#fff',
            borderWidth: 2
          },
          label: {
            show: false
          },
          labelLine: {
            show: false
          },
          emphasis: {
            scale: true,
            scaleSize: 6,
            itemStyle: {
              shadowBlur: 16,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.25)'
            },
            label: {
              show: true,
              fontSize: 12,
              fontWeight: 'bold',
              formatter: '{d}%'
            }
          },
          data: seriesData
        }
      ]
    }

    myChart.setOption(option, true)
  })
}

watch(() => props.data, (newVal) => {
  if (newVal && newVal.length) renderChart(newVal)
}, { deep: true })

onMounted(() => {
  if (props.data && props.data.length) renderChart(props.data)
  window.addEventListener('resize', () => {
    myChart && myChart.resize()
  })
})
</script>

<style scoped>
.chart {
  height: 360px;
}
</style>
