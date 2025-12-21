<template>
  <div class="canvas-con">
    <canvas id="myChart"></canvas>
  </div>
</template>

<script>
import Chart from 'chart.js/auto'

export default {
  name: 'BarChart',
  props: {
    chartData: {
      type: Object,
      required: true
    }
  },
  data() {
    return {}
  },
  mounted() {
    this.$nextTick(() => this.initChart())
  },
  methods: {
    initChart() {
      Chart.defaults.elements.bar.borderWidth = 2
      Chart.defaults.elements.bar.borderColor = '#444'
   
      const labels = ['Bezahlt', 'Teilweise bezahlt', 'Unbezahlt', 'Überfällig']
      const backgroundColor = ['#10b981', '#60a5fa', '#f59e0b', '#ef4444']
      const data = [
        this.chartData.paid_count,
        this.chartData.partially_paid_count,
        this.chartData.unpaid_count,
        this.chartData.overdue_count
      ]

      new Chart(document.getElementById('myChart'), {
        type: 'bar',
        data: {
          labels: labels,
          datasets: [
            {
              label: 'Bar Chart',
              data: data,
              backgroundColor: backgroundColor,
              barPercentage: 0.5,
              categoryPercentage: 1,
              borderRadius: 5
            }
          ]
        },
        scales: {
          yAxis: {
            min: 0,
            stepSize: 1,
            color: '#000',
            font: { size: 12 }
          }
        },
        options: {
          plugins: {
            title: {
              display: true,
              text: 'Anzahl Rechnungen',
              font: { size: 18 },
              padding: {
                top: 20,
                bottom: 0
              }
            },
            // subtitle: {
            //   display: true,
            //   text: 'Subtitle'
            // },
            legend: {
              display: true,
              position: 'top',
              labels: {
                color: 'blue',
                font: { size: 10 }
              }
            }
          }
        }
      })
    },
  }
}
</script>

<style>
.canvas-con {
  width: 700px;
  height: 400px;
  margin: auto;
  margin-top: 50px;
  border: 1px solid #ccc;
  border-radius: 10px;
  padding: 0 10px;
}
</style>
