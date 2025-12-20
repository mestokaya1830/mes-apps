<template>
  <div>
    <canvas :key="chartKey" ref="chartCanvas" width="500" height="300"></canvas>
  </div>
</template>

<script>
import Chart from 'chart.js/auto'

const centerTextPlugin = {
  id: 'centerText',
  afterDraw(chart) {
    const { ctx, chartArea } = chart
    if (!ctx || !chartArea) return
    const data = chart.data.datasets[0].data
    const total = data.reduce((a, b) => a + b, 0)

    ctx.save()
    const fontSize = (chartArea.right - chartArea.left) / 8
    ctx.font = `bold ${fontSize}px Arial`
    ctx.fillStyle = '#333'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'

    const centerX = (chartArea.left + chartArea.right) / 2
    const centerY = (chartArea.top + chartArea.bottom) / 2

    ctx.fillText(total, centerX, centerY)
    ctx.restore()
  }
}

export default {
  name: 'DoughnutChart',
  props: {
    chartData: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      chart: null,
      chartKey: 0
    }
  },
  watch: {
    chartData: {
      deep: true,
      handler() {
        this.recreateChart()
      }
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.initChart()
    })
  },
  beforeUnmount() {
    this.destroyChart()
  },
  methods: {
    destroyChart() {
      if (this.chart) {
        try {
          this.chart.destroy()
        } catch (error) {
          console.error('Chart destruction error:', error)
        }
        this.chart = null
      }
    },

    recreateChart() {
      this.destroyChart()
      this.chartKey++
      this.$nextTick(() => {
        setTimeout(() => {
          this.initChart()
        }, 50)
      })
    },

    initChart() {
      const ctx = this.$refs.chartCanvas
      if (!ctx || !this.chartData) return

      this.destroyChart()

      this.chart = new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: [
    ['Bezahlt', `${this.chartData.paid_total}`],
    ['Teilweise Bezahlt', `${this.chartData.partially_paid_total}`],
    ['Ausstehend', `${this.chartData.outstanding_total}`],
    ['Überfällig', `${this.chartData.overdue_total}`]
  ],
          datasets: [
            {
              data: [
                this.chartData.paid_count || 0,
                this.chartData.partially_paid_count || 0,
                this.chartData.outstanding_count || 0,
                this.chartData.overdue_count || 0
              ],
              backgroundColor: ['#10b981', '#60a5fa', '#f59e0b', '#ef4444'],
              borderWidth: 1
            }
          ]
        },
        options: {
          responsive: false,
          maintainAspectRatio: true,
          cutout: '60%',
          animation: false,
          plugins: {
            title: {
              display: true,
              text: 'Title'
            },
            legend: {
              position: 'right',
              labels: {
                usePointStyle: true,
                pointStyle: 'rectRounded',
                boxWidth: 24,
                boxHeight: 24,
                padding: 12,
                color: '#444',
                font: (context) => {
          // İkinci satır için küçük font
          return {
            size: context.index === 1 ? 10 : 14
          };
        }
              }
            }
          }
        },
        plugins: [centerTextPlugin]
      })
    }
  }
}
</script>
