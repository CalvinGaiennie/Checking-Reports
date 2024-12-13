//HTML Elements
const dataSourceEl = document.getElementById("data-source");
// this is a place for me to view data to help as I develop. It's sometimes easier to view here than the console.
const testDataEl = document.getElementById("test-data");

//These are the locations of ps that I want to add data to at the beggining
const ordersCheckedEl = document.getElementById("orders-checked");
const mistakesCaughtEl = document.getElementById("total-mistakes-caught");
const mistakePercentageEl = document.getElementById("mistake-percentage");

let statusChart, checkerChart, mistakeCheckerChart;

//default data source is the old data in the json file
let dataSource = "../json/output.json";

////////////////////////////////////////////////////
function fetchDataAndRenderCharts() {
  fetch(dataSource)
    .then((response) => response.json())
    .then((data) => {
      //////////////////////////////////
      //// modified data for the charts
      //this is an array holding the status of every order. either correct or incorrect
      const statuses = data.map((item) => item.OrderStatus);
      //array containing a type label for every mistake
      const mistakeTypes = data
        .filter((item) => item.mistakeType)
        .map((item) => item.mistakeType);

      //this is an object containing the label and count for correct orders and all mistake types
      const statusCounts = mistakeTypes.reduce(
        (acc, type) => {
          acc[type] = (acc[type] || 0) + 1;
          return acc;
        },
        {
          Correct: statuses.filter((status) => status === "correct").length,
        }
      );
      // this arrays contains smaller arrays. each one containes the name of an error type as a string then the total count of that type as a number
      const filteredStatusCounts = Object.entries(statusCounts).filter(
        ([key, value]) => key !== "Correct"
      );

      //this array contains strings of the mistake type names
      const statusLabels = filteredStatusCounts.map(([key]) => key);

      // this array contains the counts for each mistake type as numbers
      const statusData = filteredStatusCounts.map(([_, value]) => value);

      /////
      //this array contains objects each have key value pairs for the order status (correct or incorrect) and who checked it
      const filteredData = data
        // .filter((order) => order.OrderStatus !== "correct")
        .map((order) => ({
          OrderStatus: order.OrderStatus,
          OrderChecker: order.OrderChecker,
        }));
      // this object contains the name of each checker and how many orders they checked
      const checkerCounts = filteredData.reduce((counts, order) => {
        const checker = order.OrderChecker;
        counts[checker] = (counts[checker] || 0) + 1;
        return counts;
      }, {});
      // this is an array of the checker names
      const checkerLabels = Object.keys(checkerCounts);
      //this is an array of how many orders each checker checked, only the numbers
      const checkerData = Object.values(checkerCounts);
      ////
      //this is an object containing key value pairs of the checker and how many mistakes they found
      const mistakesByChecker = filteredData
        .filter((order) => order.OrderStatus !== "correct")
        .reduce((counts, order) => {
          const checker = order.OrderChecker;
          counts[checker] = (counts[checker] || 0) + 1;
          return counts;
        }, {});
      const checkerMistakeCounts = Object.values(mistakesByChecker);
      const checkerMistakeLabels = Object.keys(mistakesByChecker);

      //Destroy Existing Charts
      if (statusChart) statusChart.destroy();
      if (checkerChart) checkerChart.destroy();
      if (mistakeCheckerChart) mistakeCheckerChart.destroy();
      ////////////////////////////////////
      //Creating the charts
      // Shows the mistakes broken down by type

      statusChart = new Chart(document.getElementById("statusChart"), {
        type: "bar",
        data: {
          labels: statusLabels,
          datasets: [
            {
              label: "Order Status and Mistake Types",
              data: statusData,
              backgroundColor: [
                "#4CAF50",
                // "#F44336",
                // "#FF9800",
                // "#2196F3",
                // "#9C27B0",
              ],
            },
          ],
        },
      });
      // Shows the number of orders checked by each checker
      checkerChart = new Chart(document.getElementById("checkerChart"), {
        type: "bar",
        data: {
          labels: checkerLabels,
          datasets: [
            {
              label: "Orders Checked by Each Checker",
              data: checkerData,
              backgroundColor: ["#F44336"],
            },
          ],
        },
        options: {
          scales: {
            y: { beginAtZero: true },
          },
        },
      });
      //Shows the number of mistakes found by each checker
      mistakeCheckerChart = new Chart(
        document.getElementById("mistakeCheckerChart"),
        {
          type: "bar",
          data: {
            labels: checkerMistakeLabels,
            datasets: [
              {
                label: "Mistakes Found by Each Checker",
                data: checkerMistakeCounts,
                backgroundColor: "#F44336",
              },
            ],
          },
          options: {
            scales: {
              y: { beginAtZero: true },
            },
          },
        }
      );
      ////////////////////////////////
      //Initial Data that is displayed in the ps before the charts
      //Get the data
      const mistakesCaught = statuses.filter(
        (status) => status != "correct"
      ).length;
      const allTypes = Object.values(statusCounts);
      const totalChecked = allTypes.reduce(
        (total, currentValue) => total + currentValue,
        0
      );
      const mistakePercentage = (mistakesCaught / totalChecked) * 100;
      //Populate the data on the page
      ordersCheckedEl.innerHTML = totalChecked;
      mistakesCaughtEl.innerHTML = mistakesCaught;

      mistakePercentageEl.innerHTML = `${parseFloat(
        mistakePercentage.toFixed(2)
      )}%`;
    })
    .catch((error) => console.error("Error fetching data for charts:", error));

  //   testDataEl.innerHTML = JSON.stringify(totalChecked);
}

//Load the page
fetchDataAndRenderCharts();

//if the user changes the data source change the source then reload the page
dataSourceEl.addEventListener("change", function () {
  dataSource = dataSourceEl.value;
  console.log(dataSource);
  fetchDataAndRenderCharts();
});
