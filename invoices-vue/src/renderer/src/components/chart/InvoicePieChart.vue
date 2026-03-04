<template>
  <div>
    <header class="chart-header">
      <h3 class="chart-title">
        <i class="bi bi-percent icons" aria-hidden="true"></i>
      </h3>
    </header>
    <div class="chart-card chart-side">
      <canvas ref="invoicePieChart" role="img" aria-label="Rechnung Pie Chart"></canvas>
    </div>
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

      this.pieChart = new Chart(this.$refs.invoicePieChart, {
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
