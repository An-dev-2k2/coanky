<template>
  <div>
    <div class="mt-1 flex justify-between items-center bg-white p-4 rounded-lg shadow-sm mb-6">
      <h4 class="text-base font-semibold uppercase">Dashboard</h4>
      <div class="flex items-center gap-4">
        <div class="flex items-center gap-2">
          <span class="text-sm font-medium text-gray-600">Từ:</span>
          <input type="date" v-model="startDate"
            class="px-3 py-1.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm" />
        </div>
        <div class="flex items-center gap-2">
          <span class="text-sm font-medium text-gray-600">Đến:</span>
          <input type="date" v-model="endDate"
            class="px-3 py-1.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm" />
        </div>
        <Button @click="getDashboard" class="!py-1.5 flex items-center gap-2">
          <Search class="w-4 h-4" />
          Lọc
        </Button>
      </div>
    </div>
    <div class="mt-1">
      <h4 class="text-base font-semibold uppercase">Thống kê tổng</h4>
      <div class="grid grid-cols-4 gap-6 mt-2">
        <Card v-for="stat in stats" :key="stat.id">
          <div class="flex items-center gap-3 font-bold">
            <div class="w-8 h-8 rounded-full shadow flex justify-center items-center" :class="stat.background">
              <component :is="iconStatMap[stat.icon]" class="w-4 h-4 text-white"></component>
            </div>
            <span>{{ stat.title }}</span>
          </div>
          <div class="pt-3 flex justify-between">
            <h2 :style="`color: ${stat.color};`" class="text-3xl font-bold font-nunito flex">
              +
              <div class="ml-1 flex">
                <CountUp :endVal="stat?.current || 0" :duration="2" :useEasing="true" />
                <!-- <span>{{ formatSuffix(data?.current) }}</span> -->
              </div>
            </h2>
            <div class="flex flex-col items-center">
              <div class="flex items-center gap-2">
                <div class="w-5 h-5 rounded-full flex justify-center items-center"
                  :class="stat?.current > stat?.previous ? 'bg-green-300/60 text-green-800' : 'bg-red-300/60 text-red-800'">
                  <component class="w-3 h-3" :is="stat?.current > stat?.previous ? TrendingUp : TrendingDown">
                  </component>
                </div>
                <span class="text-xs font-semibold"
                  :class="stat?.current > stat?.previous ? 'text-green-500' : 'text-red-500'">{{ stat?.proportion }}
                  %</span>
              </div>
              <span class="text-xs text-gray-500 mt-1">Last Month</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
    <div class="grid grid-cols-12 gap-6 mt-6">
      <Card class="col-span-12">
        <ChartRevenueByDate :start-of-month="startDate" :end-of-today="endDate" :data="revenueByDate" />
      </Card>
      <Card class="col-span-6">
        <ChartRevenueAndTours :data="revenueAndTours" />
      </Card>
      <Card class="col-span-6">
        <ChartRevenueByYear :data="revenueByYear" />
      </Card>
      <Card class="col-span-5">
        <ChartTourStatus :data="tourStatus" />
      </Card>
      <Card class="col-span-7">
        <Table :fields="fieldsIconStatus" :data="dataIconStatus" />
      </Card>
      <Card class="col-span-12">
        <ChartTopTours :data="topTours" />
      </Card>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { DollarSign, Users, Handbag, TicketsPlane, TrendingUp, TrendingDown, Search } from 'lucide-vue-next';
import CountUp from 'vue-countup-v3'
import Card from '@/components/Card.vue';
import Button from '@/components/Button.vue';
import moment from 'moment';
import ChartRevenueByDate from '@/components/admin/ChartRevenueByDate.vue';
import ChartRevenueAndTours from '@/components/admin/ChartRevenueAndTours.vue';
import ChartRevenueByYear from '@/components/admin/ChartRevenueByYear.vue';
import ChartTourStatus from '@/components/admin/ChartTourStatus.vue';
import ChartTopTours from '@/components/admin/ChartTopTours.vue';
import Table from '@/components/Table.vue';
import AppAPI from '@/services/api/admin/AppAPI';

// const stats = [
//   { id: 1, title: "Tổng doanh thu", color: '#01f195', background: "bg-gradient-to-b to-[#007e83] from-[#01f195]", icon: DollarSign, current: "0", previous: "0", proportion: "0" },
//   { id: 3, title: "Tổng tour", color: '#a85139', background: "bg-gradient-to-b to-[#a85139] from-[#e0a79a]", icon: TicketsPlane, current: "0", previous: "0", proportion: "0" },
//   { id: 2, title: "Lượt đặt", color: '#ffa600', background: "bg-gradient-to-b to-[#ffa600] from-[#ffd60b]", icon: Handbag, current: "0", previous: "0", proportion: "0" },
//   { id: 4, title: "Khách hàng", color: '#4fadfe', background: "bg-gradient-to-b to-[#4fadfe] from-[#01f1fe]", icon: Users, current: "0", previous: "0", proportion: "0" },
// ]

const iconStatMap = {
  'DollarSign': DollarSign,
  'TicketsPlane': TicketsPlane,
  'Handbag': Handbag,
  'Users': Users
}

const stats = ref([])

const fieldsIconStatus = [
  { key: 'index', label: 'STT' },
  { key: 'user', label: 'Khách hàng' },
  { key: 'name', label: 'Tên ấn ký' },
  { key: 'tour', label: 'Tour' },
  { key: 'updatedAt', label: 'Ngày cập nhật' },
]

const dataIconStatus = ref([])

const revenueByDate = ref({
  dates: [],
  revenues: []
})

const revenueAndTours = ref({
  months: [],
  revenues: [],
  tours: []
})

const revenueByYear = ref({
  months: [],
  currentYear: [],
  previousYear: []
})

const tourStatus = ref({
  completed: 0,
  notCompleted: 0
})

const topTours = ref([])

const startDate = ref(moment().startOf('month').format('YYYY-MM-DD'))
const endDate = ref(moment().format('YYYY-MM-DD'))

// const generateRevenueByDate = () => {
//   const start = moment(startOfMonth.value)
//   const end = moment(endOfToday.value)

//   const dates = []
//   const revenues = []

//   let current = start.clone()

//   while (current.isSameOrBefore(end)) {
//     dates.push(current.format('YYYY-MM-DD'))
//     revenues.push(0)
//     current.add(1, 'day')
//   }

//   revenueByDate.value = {
//     dates,
//     revenues
//   }
// }

// const generateRevenueAndTours = () => {
//   const currentMonth = moment().month() + 1

//   const months = []
//   const revenues = []
//   const tours = []

//   for (let i = 1; i <= currentMonth; i++) {
//     months.push(`T${i}`)
//     revenues.push(Math.floor(Math.random() * 1000) + 500)
//     tours.push(Math.floor(Math.random() * 200) + 50)
//   }

//   revenueAndTours.value = {
//     months,
//     revenues,
//     tours
//   }
// }

// const generateRevenueByYear = () => {
//   const currentMonth = moment().month() + 1

//   const months = []
//   const currentYear = []
//   const previousYear = []

//   for (let i = 1; i <= currentMonth; i++) {
//     months.push(`T${i}`)
//     currentYear.push(Math.floor(Math.random() * 1000) + 500)
//     previousYear.push(Math.floor(Math.random() * 800) + 400)
//   }

//   revenueByYear.value = {
//     months,
//     currentYear,
//     previousYear
//   }
// }

// const generateTourStatus = () => {
//   const completed = 120
//   const notCompleted = 30

//   tourStatus.value = {
//     completed,
//     notCompleted
//   }
// }

const getDashboard = async () => {
  try {
    const body = {
      startDate: startDate.value,
      endDate: endDate.value
    }
    const { data } = await AppAPI.getDashboard(body)
    stats.value = data.stats
    revenueByDate.value = data.revenueByDate
    revenueAndTours.value = data.revenueAndTours
    revenueByYear.value = data.revenueCompare
    tourStatus.value = data.tourStatus
    topTours.value = data.topTours || []
    dataIconStatus.value = data.userIcons
  }
  catch (err) {
    console.log(err)
  }
}

onMounted(async () => {
  await getDashboard()
})
</script>