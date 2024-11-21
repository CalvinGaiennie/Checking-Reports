"use strict";
// HTML Elements
const orderNumberEl = document.getElementById("order-number");
const orderContentEl = document.getElementById("order-content");
const orderPullerEl = document.getElementById("order-puller");
const submitFormEl = document.getElementById("submit-form");
const correctBox = document.getElementById("correct");

//If Mistake
const mistakeDiv = document.getElementById("mistake-div");
const incorrectBox = document.getElementById("incorrect");

//If Count

const theButton = document.getElementById("the-button");
////////////////////////////////////////////////////////////
//Callback Functions

function calcDifference(desiredNum, actualNum) {
  const onePercent = desiredNum / 100;
  let difference;

  if (desiredNum > actualNum) {
    difference = desiredNum - actualNum;
  } else {
    difference = actualNum - desiredNum;
  }

  let percentageDifference = difference / onePercent;
  return percentageDifference;
}

function formatDate(date) {
  const d = new Date(date);
  const month = d.getMonth() + 1; // Months are 0-based, so add 1
  const day = d.getDate();
  const year = d.getFullYear();
  return `${month}/${day}/${year}`;
}
////////////////////////////////////////////////////////////
//Event Listeners
incorrectBox.addEventListener("change", function () {
  mistakeDiv.innerHTML = `
  <h2>Mistake Type</h2>
  <form id="mistake-type">
  <label><input type="radio" name="mistake-type" value="count-error" id="count-error"/>Count Error</label>
  <br />
  <br />
  <label
    ><input type="radio" name="mistake-type" value="wrong-item" />Wrong Item</label
  >
  <br />
  <br />
  <label
    ><input type="radio" name="mistake-type" value="damage" />Damage</label
  >
  <br />
  <br />
  <label
    ><input type="radio" name="mistake-type" value="packaging" />Packaging Error</label
  >
  </form>
  <div id=count-div></div>`;

  const countDiv = document.getElementById("count-div");

  const countRadio = document.getElementById("count-error");
  countRadio.addEventListener("change", function () {
    countDiv.innerHTML = `<h3>How many should it have been?</h3> 
    <input type="number" id='desired-num' placeholder="Desired Ammount" />
    <h3>How many are in the unit currently?</h3> 
    <input type="number" id='actual-num' placeholder="Actual Ammount"/>
    `;
  });
});

submitFormEl.addEventListener("click", function () {
  const formattedDate = formatDate(new Date());

  const orderNumber = orderNumberEl.value;
  const orderContent = orderContentEl.value;
  const orderPuller = orderPullerEl.value;
  const orderStatus = document.querySelector(
    'input[name="status"]:checked'
  ).value;
  const orderChecker = document.querySelector(
    'input[name="checker"]:checked'
  ).value;

  // Creating the order data object to send to the backend
  const orderData = {
    OrderNumber: orderNumber,
    Date: formattedDate,
    OrderContent: orderContent,
    OrderPuller: orderPuller,
    OrderStatus: orderStatus,
    OrderChecker: orderChecker,
  };

  if (orderStatus === "incorrect") {
    const mistakeType = document.querySelector(
      'input[name="mistake-type"]:checked'
    ).value;

    orderData.mistakeType = mistakeType;
    // For 'count-error', you can include the desiredNum and actualNum here
  }
  // Sending the data to the server via fetch
  fetch("http://localhost:5001/items", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(orderData), // Sending orderData instead of newItem
  })
    .then((response) => response.json())
    .then((data) => console.log("Order saved:", data))
    .catch((error) => console.error("Error saving order:", error));
});

correctBox.addEventListener("change", function () {
  mistakeDiv.innerHTML = "";
});
