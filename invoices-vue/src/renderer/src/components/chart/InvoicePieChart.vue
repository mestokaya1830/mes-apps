<template>
  <div class="pie-container">
    <canvas ref="pieChart"></canvas>
  </div>
</template>

<script>
import Chart from 'chart.js/auto'

export default {
  name: 'PieChart',
  props: {
    percentData: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      pieChart: null
    }
  },
  watch: {
    percentData: {
      deep: true,
      handler() {
        if (this.pieChart) {
          this.pieChart.data.datasets[0].data = [
            this.percentData.paid_percentage,
            this.percentData.partially_paid_percentage,
            this.percentData.unpaid_percentage,
            this.percentData.overdue_percentage
          ]
          this.pieChart.update()
        }
      }
    }
  },
  mounted() {
    this.initPie()
  },

  methods: {
    initPie() {
      console.log('Initializing pie chart with data:', this.percentData)
      const labels = ['Bezahlt', 'Teilweise', 'Unbezahlt', 'Überfällig']
      const colors = ['#10b981', '#60a5fa', '#f59e0b', '#ef4444']

      this.pieChart = new Chart(this.$refs.pieChart, {
        type: 'pie',
        data: {
          labels,
          datasets: [
            {
              data: [
                parseFloat(this.percentData.paid_percentage),
                parseFloat(this.percentData.partially_paid_percentage),
                parseFloat(this.percentData.unpaid_percentage),
                parseFloat(this.percentData.overdue_percentage)
              ],
              backgroundColor: colors
            }
          ]
        },
        options: {
          responsive: false,
          maintainAspectRatio: true,
          plugins: {
            legend: { position: 'bottom', labels: { font: { size: 12 } } },
            tooltip: {
              callbacks: {
                label: function (context) {
                  return `${context.label}: ${context.raw.toFixed(1)}%`
                }
              }
            }
          }
        }
      })
    }
  }
}
</script>

<style scoped>
.pie-container {
  width: 400px;
  height: 300px;
}
</style>
