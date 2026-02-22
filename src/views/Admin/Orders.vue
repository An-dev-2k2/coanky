<template>
  <div>
    <Card class="py-0">
      <Table :fields="fields" :data="data">
        <template #head-name="{ field }">
          <p class="text-center">{{ field.label }}</p>
        </template>
        <template #name="{ value }">
          <p class="text-center font-bold">{{ value }}</p>
        </template>
        <template #user="{ value }">
          <div class="flex gap-1.5 items-center">
            <div class="w-9 h-9 rounded-md bg-slate-100 overflow-hidden">
              <img :src="value.avatar" :alt="value.name" class="w-full h-full object-cover" />
            </div>
            <div class="flex flex-col">
              <p class="font-semibold">{{ value.name }}</p>
              <span class="text-xs text-slate-500">{{ value.email }}</span>
            </div>
          </div>
        </template>
        <template #image="{ item }">
          <div class="h-[71px]">
            <div class="relative aspect-video w-32 overflow-hidden h-full rounded-[10px]">
              <img class="size-full object-cover" :src="item.image" alt="Image Preview" />
            </div>
          </div>
        </template>
        <template #head-price="{ field }">
          <p class="text-center">{{ field.label }}</p>
        </template>
        <template #head-percent="{ field }">
          <p class="text-center">{{ field.label }}</p>
        </template>
        <template #price="{ value }">
          <p class="text-center font-bold text-red-600">{{ formatPrice(value) }} VNĐ</p>
        </template>
        <template #percent="{ value }">
          <p class="text-center font-bold">{{ value }}%</p>
        </template>
        <template #createdAt="{ value }">
          <p class="text-blue-500 font-medium">{{ formatDate(value) }}</p>
          <span class="text-xs text-gray-400">{{ formatTimeOnly(value) }}</span>
        </template>
      </Table>
    </Card>
  </div>
</template>

<script setup>
import Card from '@/components/Card.vue';
import Table from '@/components/Table.vue';
import { useFormat } from '@/composables/useFormat';

const { formatPrice, formatDate, formatTimeOnly } = useFormat()
const fields = [
  { key: 'index', label: "STT" },
  { key: 'user', label: "Khách hàng" },
  { key: 'name', label: "Tên tour" },
  { key: 'image', label: "Ảnh đại diện" },
  { key: 'price', label: "Giá" },
  { key: 'percent', label: "% giảm giá" },
  { key: 'createdAt', label: "Ngày tạo" },
]
const data = [
  {
    user: {
      avatar: 'https://thumbs.dreamstime.com/b/funny-avatar-cunning-emoji-flat-vector-illustration-comic-yellow-social-media-sticker-humorous-cartoon-face-smiling-mouth-162122340.jpg',
      name: 'Nguyen Van A',
      email: 'andev@gmail.com'
    },
    name: 'Tour 1',
    image: 'https://img.freepik.com/free-photo/travel-concept-with-landmarks_23-2149153256.jpg?semt=ais_user_personalization&w=740&q=80',
    price: 1000000,
    percent: 10,
    createdAt: '2026-02-22T10:03:58.745+00:00',
    updatedAt: '2026-02-22T10:03:58.745+00:00',
  }
]
</script>

<style></style>