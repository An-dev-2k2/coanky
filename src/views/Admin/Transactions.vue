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

const fields = [
  { key: 'index', label: 'STT' },
  { key: 'user', label: 'Khách hàng' },
  { key: 'price', label: 'Số tiền' },
  { key: 'description', label: 'Nội dung chuyển khoản' },
  { key: 'status', label: 'Trạng thái' },
  { key: 'createdAt', label: "Ngày tạo" },
]

const data = []
</script>

<style></style>