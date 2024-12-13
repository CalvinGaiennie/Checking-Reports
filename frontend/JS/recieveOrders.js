// Function to fetch all items from the backend and display them
const sourceEl = document.getElementById("data-source");
let source = "../json/output.json";

function fetchDataAndRenderOrders() {
  console.log("Attempting to fetch from:", source);
  fetch(source)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      console.log("Received data:", data);
      const orderListEl = document.getElementById("order-list");
      orderListEl.innerHTML = "";
      if (data.length > 0) {
        // Loop through the items and display each one
        data.forEach((item) => {
          // console.log(item); // Log each item to ensure it's structured as expected
          const orderDiv = document.createElement("div");
          orderDiv.style.marginBottom = "20px"; // Style to separate orders
          orderDiv.innerHTML = `
         <h3>Order Number: ${item.OrderNumber}</h3>
         <p><strong>Date:</strong> ${item.Date}</p>
         <p><strong>Content:</strong> ${item.OrderContent}</p>
         <p><strong>Puller:</strong> ${item.OrderPuller}</p>
         <p><strong>Status:</strong> ${item.OrderStatus}</p>
         <p><strong>Checker:</strong> ${item.OrderChecker}</p>
         ${
           item.mistakeType
             ? `<p><strong>Mistake Type:</strong> ${item.mistakeType}</p>`
             : ""
         }
         <hr />
       `;
          orderListEl.appendChild(orderDiv);
        });
      } else {
        orderListEl.innerHTML = "<p>No orders available.</p>";
      }
    })
    .catch((error) => {
      console.error("Error fetching items:", error);
      const orderListEl = document.getElementById("order-list");
      orderListEl.innerHTML = `<p>Error loading orders: ${error.message}</p>`;
    });
}
fetchDataAndRenderOrders();
sourceEl.addEventListener("change", function () {
  source = sourceEl.value;
  console.log("Data source changed to:", source);
  fetchDataAndRenderOrders();
});
