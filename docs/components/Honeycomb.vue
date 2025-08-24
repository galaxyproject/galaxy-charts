<template>
    <div class="honeycomb">
        <div v-for="(row, rIndex) in rows" :key="rIndex" class="row" :class="{ offset: rIndex % 2 === 1 }">
            <div
                v-for="(hex, hIndex) in row"
                :key="hIndex"
                class="hex"
                :style="{ backgroundImage: `url(${hex})` }"></div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from "vue";

const totalCells = 22;
const size = 130;
const rows = ref([]);

function buildHoneycomb() {
    const width = window.innerWidth;
    const cols = Math.floor(width / size);
    const hexWidth = width / Math.min(cols, totalCells);
    const hexHeight = (hexWidth * Math.sqrt(3)) / 2;

    const allImages = Array.from({ length: totalCells }, (_, i) => `examples/${i + 1}.png`);

    rows.value = [];
    let index = 0;
    while (index < totalCells) {
        rows.value.push(allImages.slice(index, index + cols));
        index += cols;
    }

    document.documentElement.style.setProperty("--hex-width", hexWidth + "px");
    document.documentElement.style.setProperty("--hex-height", hexHeight + "px");
}

onMounted(() => {
    buildHoneycomb();
    window.addEventListener("resize", buildHoneycomb);
});
</script>

<style scoped>
.honeycomb {
    position: fixed;
    top: 150px;
    display: flex;
    opacity: 0.2;
    flex-direction: column;
    transform: rotate(-10deg) rotateX(20deg) translateX(-10%);
    perspective: 1000px;
}

.row {
    display: flex;
    margin-top: calc(var(--hex-height) * -0.25);
}

.row:first-child {
    margin-top: 0;
}

.row.offset {
    margin-left: calc(var(--hex-width) / 2);
}

.hex {
    width: var(--hex-width);
    height: var(--hex-height);
    clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);
    flex-shrink: 0;
    transition:
        transform 0.2s,
        box-shadow 0.2s;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
    background-size: cover;
    background-position: center;
}
</style>
