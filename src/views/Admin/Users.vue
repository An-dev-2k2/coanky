<template>
  <div>
    <Card class="py-0">
      <Table :fields="fields" :data="data">
        <template #head-price="{ field }">
          <p class="text-center">{{ field.label }}</p>
        </template>
        <template #price="{ value }">
          <p class="text-center font-bold text-red-600">{{ formatPrice(value) }} VNĐ</p>
        </template>
        <template #user="{ value }">
          <div class="flex gap-1.5 items-center">
            <div class="w-9 h-9 rounded-md bg-slate-100 overflow-hidden">
              <img :src="value.avatar" :alt="value.name" class="w-full h-full object-cover" />
            </div>
            <div class="flex flex-col">
              <div class="flex items-center gap-2">
                <p class="font-semibold">{{ value.name }}</p>
                <span class="bg-blue-100 text-xs text-blue-900 rounded-sm px-1 py-0.5">{{ value.role }}</span>
              </div>
              <span class="text-xs text-slate-500">{{ value.email }}</span>
            </div>
          </div>
        </template>
        <template #createdAt="{ value }">
          <p class="text-blue-500 font-medium">{{ formatDate(value) }}</p>
          <span class="text-xs text-gray-400">{{ formatTimeOnly(value) }}</span>
        </template>
        <template #updatedAt="{ value }">
          <p class="text-blue-500 font-medium">{{ formatDate(value) }}</p>
          <span class="text-xs text-gray-400">{{ formatTimeOnly(value) }}</span>
        </template>
        <template #actions="{ item, index }">
          <div class="flex items-center gap-2">
            <Button variant="primary" class="!p-2">
              <Pen class="w-4 h-4" />
            </Button>
            <Button variant="danger" class="!p-2">
              <Trash2 class="w-4 h-4" />
            </Button>
          </div>
        </template>
      </Table>
    </Card>
  </div>
</template>

<script setup>
import Card from '@/components/Card.vue';
import Table from '@/components/Table.vue';
import Button from '@/components/Button.vue';
import { Pen, Trash2 } from 'lucide-vue-next';
import { useFormat } from '@/composables/useFormat';

const { formatPrice, formatDate, formatTimeOnly } = useFormat()
const fields = [
  { key: 'index', label: "STT" },
  { key: 'user', label: "Khách hàng" },
  { key: 'price', label: "Tài sản" },
  { key: 'createdAt', label: "Ngày tạo" },
  { key: 'updatedAt', label: "Ngày cập nhật" },
  { key: 'actions', label: "Thao tác" },
]
const data = [
  {
    user: {
      avatar: 'https://thumbs.dreamstime.com/b/funny-avatar-cunning-emoji-flat-vector-illustration-comic-yellow-social-media-sticker-humorous-cartoon-face-smiling-mouth-162122340.jpg',
      name: 'Nguyen Van A',
      role: 'Người dùng',
      email: 'andev@gmail.com'
    },
    price: 1000000,
    createdAt: '2026-02-22T10:03:58.745+00:00',
    updatedAt: '2026-02-22T10:03:58.745+00:00',
  },
]
</script>

<style></style>