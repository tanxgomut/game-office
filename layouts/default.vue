<script setup lang="ts">
import BaseHeader from '~/components/base/header.vue';

</script>
<template>
    <div class="min-h-screen flex flex-col max-w-2xl  mx-auto px-4">
        <BaseHeader />
        <div class="flex-1 max-w-2xl mx-auto px-4 w-full">
            <NuxtPage class="h-full" />
        </div>
        <BaseAppBar />
    </div>
    <BaseConfirmDialog />
</template>