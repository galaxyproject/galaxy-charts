<template>
    <div ref="honeycombEl" class="honeycomb">
        <a
            v-for="(hex, index) in hexes"
            :key="index"
            :style="{
                '--x': hex.x,
                '--y': hex.y,
                '--delay': `${index * 0.02}s`,
                backgroundImage: `url(${hex.img})`,
            }"></a>
    </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";

const size = 130;
const totalCells = 22;
const hexes = ref([]);
const honeycombEl = ref(null);

function buildHoneycomb() {
    const width = window.innerWidth + size;
    const cols = Math.ceil(width / size);
    const rows = Math.ceil(totalCells / cols);
    const allImages = Array.from({ length: totalCells }, (_, i) => `examples/${i + 1}.png`);
    const temp = [];

    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            const i = r * cols + c;
            if (i >= totalCells) break;
            temp.push({
                img: allImages[i],
                x: c + (r % 2 ? 0.5 : 0),
                y: r * 0.8667,
            });
        }
    }

    hexes.value = temp;
}

onMounted(() => {
    buildHoneycomb();
    window.addEventListener("resize", buildHoneycomb);
});

onBeforeUnmount(() => {
    window.removeEventListener("resize", buildHoneycomb);
});
</script>

<style scoped>
/* prevent horizontal scroll globally */
html,
body {
    overflow-x: hidden;
}

.honeycomb {
    position: relative;
    top: -50px;
    left: v-bind(-size + "px");
    width: 100%;
    height: 300px;
    perspective: 1500px;
    transform: rotateX(25deg) rotateZ(-5deg);
    transform-style: preserve-3d;
    overflow: visible;
}

.honeycomb a {
    position: absolute;
    width: v-bind(size + "px");
    aspect-ratio: 1;
    background-size: cover;
    background-position: center;
    clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);
    transform: translate(calc(var(--x) * 100%), calc(var(--y) * 86.67%)) scale(1);
    transition:
        transform 0.25s ease-out,
        filter 0.25s ease-out;
    backface-visibility: hidden;
}

.honeycomb a:hover {
    transform: translate(calc(var(--x) * 100%), calc(var(--y) * 86.67%)) scale(1.2);
    z-index: 3;
}
</style>
