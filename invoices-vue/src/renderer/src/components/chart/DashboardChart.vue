<template>
  <div class="canvas-con">
    <canvas :id="canvasId"></canvas>
  </div>
</template>

<script>
import Chart from 'chart.js/auto'

export default {
  name: 'LineChart',
  props: {
    chartData: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      canvasId: 'lineChart_' + Math.random().toString(36).substr(2, 9),
      chartInstance: null
    }
  },
  watch: {
    chartData: {
      deep: true,
      handler() {
        this.updateChart()
      }
    }
  },
  mounted() {
    this.$nextTick(() => this.initChart())
    console.log('Chart data on mount:', this.chartData)
  },
  beforeUnmount() {
    if (this.chartInstance) this.chartInstance.destroy()
  },
  methods: {
    initChart() {
      const ctx = document.getElementById(this.canvasId)
      this.chartInstance = new Chart(ctx, {
        type: 'line',
        data: {
          labels: this.chartData.labels,
          datasets: [
            {
              label: 'Umsatz (€)',
              data: this.chartData.values,
              borderColor: '#3ba55c',
              backgroundColor: 'rgba(59,165,92,0.1)',
              borderWidth: 3,
              fill: false,
              tension: 0.4,
              pointRadius: 5,
              pointBackgroundColor: '#3ba55c'
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: { beginAtZero: true },
            x: {}
          }
        }
      })
    },
    updateChart() {
      if (this.chartInstance) {
        this.chartInstance.data.labels = this.chartData.labels
        this.chartInstance.data.datasets[0].data = this.chartData.values
        this.chartInstance.update()
      }
    }
  }
}
</script>

<style scoped>
.canvas-con {
  width: 100%;
  height: 300px;
  position: relative;
}
</style>
