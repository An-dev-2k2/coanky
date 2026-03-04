<template>
  <div>
    <Card class="py-0">
      <Table :fields="fields" :data="data">
      </Table>
    </Card>
  </div>
</template>

<script setup>
import Card from '@/components/Card.vue';
import Table from '@/components/Table.vue';
import AppAPI from '@/services/api/admin/AppAPI';
import { onMounted, ref } from 'vue';

const fields = [
  { key: 'index', label: 'STT' },
  { key: 'username', label: 'Khách hàng' },
  { key: 'amount', label: 'Số tiền' },
  { key: 'description', label: 'Nội dung chuyển khoản' },
  { key: 'status', label: 'Trạng thái' },
  { key: 'createdAt', label: "Ngày tạo" },
]

const data = ref([])

const getTransactions = async () => {
  try {
    const { data: d } = await AppAPI.getTransactions()
    data.value = d
  }
  catch (error) {
    console.log(error)
  }
}

onMounted(() => {
  getTransactions()
})
</script>