<script setup>
import DefaultTheme from "vitepress/theme";
import Honeycomb from "../../components/Honeycomb.vue";

const { Layout } = DefaultTheme;
</script>

<template>
    <Layout>
        <!-- After hero, before features -->
        <template #home-hero-after>
            <ClientOnly>
                <Honeycomb />
            </ClientOnly>
        </template>
    </Layout>
</template>
