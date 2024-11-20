"use strict";
// HTML Elements
const orderNumberEl = document.getElementById("order-number");
const orderContentEl = document.getElementById("order-content");
const orderPullerEl = document.getElementById("order-puller");
const orderStatusEl = document.getElementById("order-status");
// const orderCheckerEl = document.getElementById("order-checker");
const submitFormEl = document.getElementById("submit-form");

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

theButton.addEventListener("click", function () {
  const desiredNum = document.getElementById("desired-num");
  const actualNum = document.getElementById("actual-num");
  const percentageDifference = calcDifference(
    desiredNum.value,
    actualNum.value
  );
  alert(percentageDifference);
});

submitFormEl.addEventListener("click", function () {
  const orderNumber = orderNumberEl.value;
  const orderContent = orderContentEl.value;
  const orderPuller = orderPullerEl.value;
  const orderStatus = orderStatusEl.value;
  const orderCheckerEl = document.querySelector(
    'input[name="checker"]:checked'
  );
  const orderChecker = orderCheckerEl.value;

  const orderData = {
    OrderNumber: orderNumber,
    OrderContent: orderContent,
    OrderPuller: orderPuller,
    orderStatus: orderStatus,
    orderChecker: orderChecker,
  };

  if (orderStatus == "incorrect") {
    const mistakeTypeEl = document.getElementById("mistake-type");

    const mistakeType = mistakeTypeEl.value;
    // actualNum desiredNum percentageDifference
  }

  console.log(orderData);
});
