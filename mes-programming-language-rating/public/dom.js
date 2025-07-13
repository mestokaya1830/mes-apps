 //chat side
      const ctx = document.getElementById("voteChart").getContext("2d");
      const chart = new Chart(ctx, {
        type: "bar",
        data: {
          labels: ["Current Result Of 2024"]
        },
        scales:{
          yAxis:{
            min:0,
            stepSize: 1
          }
        },
        options: {
          plugins: {
            title: {
              display: true,
              text: '2024 Rating',
              font:{size: 30},
              padding: {
                top: 0,
                bottom: 0
              }
            },
            legend: {
              display: true,
              position: 'top',
              labels: {
                color: 'blue',
                font:{size: 10}
              }
            }
          }
        }
      });
      
      const socket = io("localhost:3000");
      //get data from data.json via socket
      socket.on("update", (data) => {
        data = Object.entries(data);
        for (const [key, value] of data) {
          if (
            typeof chart.data.datasets[key] == "undefined" &&
            chart.data.datasets.length < data.length
          ) {
            chart.data.datasets.push({
              backgroundColor: value.color,
              borderColor: value.color,
              data: [value.votes],
              label: value.label,
              barPercentage: 0.5,
              categoryPercentage: 1,
              borderRadius:5
            });
          } else if (typeof chart.data.datasets[key] != "undefined") {
            chart.data.datasets[key].data = [value.votes];
          }
        }
        chart.update()
      })

      //check ip and send vote via socket
      const vote = async (index) => {
        const result = await fetch('http://localhost:3000/check-ip')
        const final = await result.json()
        if(final.result == true){
          document.querySelectorAll('button').forEach(item => {
            item.setAttribute('disabled', 'enabled')
            item.style.cursor = 'not-allowed'
          })
          alert('Sorry, you have voted before.')
        } else {
          socket.emit("vote", index)
        }
      }

      document.querySelectorAll('.voteBtns').forEach((item, index) => {
        console.log(item)
        item.addEventListener('click', () => {
          vote(index)
        })
      })