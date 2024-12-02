fetch("http://localhost:5001/items")
  .then((response) => response.json())
  .then((data) => {
    const testDataEl = document.getElementById("test-data");
    const statuses = data.map((item) => item.OrderStatus);
    const mistakeTypes = data
      .filter((item) => item.mistakeType)
      .map((item) => item.mistakeType);
    // Count occurrences of each mistake type and correct orders for the chart
    testDataEl.innerHTML = JSON.stringify(mistakeTypes);
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
    const filteredStatusCounts = Object.entries(statusCounts).filter(
      ([key, value]) => key !== "Correct"
    );

    // Extract labels and data after filtering
    const statusLabels = filteredStatusCounts.map(([key]) => key);
    const statusData = filteredStatusCounts.map(([_, value]) => value);

    // Debug: Check the filtered data
    testDataEl.innerHTML = JSON.stringify(data);

    // Cr
    ////////////////////////////////////////////////////////////////////////////////

    const ordersCheckedEl = document.getElementById("orders-checked");
    const mistakesCaughtEl = document.getElementById("total-mistakes-caught");
    const mistakePercentageEl = document.getElementById("mistake-percentage");

    const mistakesCaught = statuses.filter(
      (status) => status != "correct"
    ).length;
    const totalChecked = `${statusData[0] + mistakesCaught}`;

    // Data before Charts
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
              // "#F44336",
              // "#FF9800",
              // "#2196F3",
              // "#9C27B0",
            ],
          },
        ],
      },
    });
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // Count orders for each checker for the Checker Chart
    const filteredData = data
      // .filter((order) => order.OrderStatus !== "correct")
      .map((order) => ({
        OrderStatus: order.OrderStatus,
        OrderChecker: order.OrderChecker,
      }));

    const checkerCounts = filteredData.reduce((counts, order) => {
      const checker = order.OrderChecker;
      counts[checker] = (counts[checker] || 0) + 1;
      return counts;
    }, {});

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

    // Count mistakes for each checker for Mistake Chart

    const mistakesByChecker = filteredData
      .filter((order) => order.OrderStatus !== "correct")
      .reduce((counts, order) => {
        const checker = order.OrderChecker;
        counts[checker] = (counts[checker] || 0) + 1;
        return counts;
      }, {});

    const orderedKeys = ["checker1", "checker2", "checker3", "checker4"];

    const orderedCheckerMistakeCounts = Object.fromEntries(
      orderedKeys.map((key) => [key, mistakesByChecker[key] || 0])
    );

    // Prepare data for Mistake Chart (Bar)
    const mistakeCheckerLabels = Object.keys(orderedCheckerMistakeCounts);
    const mistakeCheckerData = Object.values(orderedCheckerMistakeCounts);
    // testDataEl.innerHTML = JSON.stringify(orderedCheckerMistakeCounts);

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
