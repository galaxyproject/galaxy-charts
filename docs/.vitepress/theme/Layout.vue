<script setup>
import DefaultTheme from "vitepress/theme";
import Honeycomb from "../../components/Honeycomb.vue";

const { Layout } = DefaultTheme;
</script>

<template>
    <Layout>
        <template #home-hero-before>
            <ClientOnly>
                <Honeycomb />
            </ClientOnly>
        </template>
    </Layout>
</template>
