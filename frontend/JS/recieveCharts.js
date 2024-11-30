fetch("http://localhost:5001/items")
  .then((response) => response.json())
  .then((data) => {
    const statuses = data.map((item) => item.OrderStatus);
    const mistakeTypes = data
      .filter((item) => item.mistakeType)
      .map((item) => item.mistakeType);

    // Count occurrences of each mistake type and correct orders for the chart
    const statusCounts = mistakeTypes.reduce(
      (acc, type) => {
        acc[type] = (acc[type] || 0) + 1;
        return acc;
      },
      {
        Correct: statuses.filter((status) => status === "correct").length,
      } // Initialize with Correct count
    );

    // Prepare data for Status Chart (Bar)
    const statusLabels = Object.keys(statusCounts);
    const statusData = Object.values(statusCounts);

    const ordersCheckedEl = document.getElementById("orders-checked");
    const mistakesCaughtEl = document.getElementById("total-mistakes-caught");
    const mistakePercentageEl = document.getElementById("mistake-percentage");

    const mistakesCaught = statuses.filter(
      (status) => status != "correct"
    ).length;
    const totalChecked = `${statusData[0] + mistakesCaught}`;

    ordersCheckedEl.innerHTML = totalChecked;
    mistakesCaughtEl.innerHTML = mistakesCaught;

    mistakePercentageEl.innerHTML = `${(mistakesCaught / totalChecked) * 100}%`;
    // Create Status Chart (Bar)
    new Chart(document.getElementById("statusChart"), {
      type: "bar",
      data: {
        labels: statusLabels,
        datasets: [
          {
            label: "Order Status and Mistake Types",
            data: statusData,
            backgroundColor: [
              "#4CAF50",
              "#F44336",
              "#FF9800",
              "#2196F3",
              "#9C27B0",
            ],
          },
        ],
      },
    });

    // Count orders for each checker for the Checker Chart
    console.log("data", data);
    // const checkerCounts = data.reduce((acc, item) => {
    //   const checker = item.checker || "Unknown"; // Use "Unknown" if no checker is specified
    //   acc[checker] = (acc[checker] || 0) + 1;
    //   return acc;
    // }, {});
    //////////////////////////////////////////////////////////////
    //this last comment does not work I need to rewrite it
    // const checkerCounts = data.filter();

    // Prepare data for Checker Chart (Bar)
    const checkerLabels = Object.keys(checkerCounts);
    const checkerData = Object.values(checkerCounts);

    // Create Checker Chart (Bar)
    new Chart(document.getElementById("checkerChart"), {
      type: "bar",
      data: {
        labels: checkerLabels,
        datasets: [
          {
            label: "Orders Checked by Each Checker",
            data: checkerData,
            backgroundColor: "#2196F3",
          },
        ],
      },
      options: {
        scales: {
          y: { beginAtZero: true },
        },
      },
    });

    // Count mistakes for each checker for Mistake Chart
    const mistakesByChecker = data.reduce((acc, item) => {
      if (item.mistakeType) {
        const checker = item.checker || "Unknown";
        acc[checker] = (acc[checker] || 0) + 1;
      }
      return acc;
    }, {});
    // Prepare data for Mistake Chart (Bar)
    const mistakeCheckerLabels = Object.keys(mistakesByChecker);
    const mistakeCheckerData = Object.values(mistakesByChecker);

    // Create Mistake Chart (Bar)
    new Chart(document.getElementById("mistakeCheckerChart"), {
      type: "bar",
      data: {
        labels: mistakeCheckerLabels,
        datasets: [
          {
            label: "Mistakes Found by Each Checker",
            data: mistakeCheckerData,
            backgroundColor: "#F44336",
          },
        ],
      },
      options: {
        scales: {
          y: { beginAtZero: true },
        },
      },
    });
  })
  .catch((error) => console.error("Error fetching data for charts:", error));
