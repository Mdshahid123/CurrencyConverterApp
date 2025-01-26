const BASE_URL = "https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@2024-03-06/v1/currencies";

const dropdowns = document.querySelectorAll(".dropdown select");
const btn = document.querySelector("form button");
const fromCurr = document.querySelector(".from select");
const toCurr = document.querySelector(".to select");
const msg = document.querySelector(".msg");

// Populate dropdowns with currency options
for (let select of dropdowns) {
  for (let currCode in countryList) {
    let newOption = document.createElement("option");
    newOption.innerText = currCode;
    newOption.value = currCode;

    if (select.name === "from" && currCode === "USD") {
      newOption.selected = true;
    } else if (select.name === "to" && currCode === "INR") {
      newOption.selected = true;
    }

    select.append(newOption);
  }

  select.addEventListener("change", (evt) => {
    updateFlag(evt.target);
  });
}

// Update the exchange rate
const updateExchangeRate = async () => {
  let amount = document.querySelector(".amount input");
  let amtVal = amount.value || 1;

  const URL = `${BASE_URL}/${fromCurr.value.toLowerCase()}.json`;
  try {
    const response = await fetch(URL);
    if (!response.ok) throw new Error("Failed to fetch exchange rates");

    const data = await response.json();
    console.log("API Response:", data); // Debug API response

    const targetRate = data[fromCurr.value.toLowerCase()][toCurr.value.toLowerCase()];
    if (!targetRate) throw new Error("Rate not available for the selected currency");

    const finalAmount = (amtVal * targetRate).toFixed(2);
    msg.innerText = `${amtVal} ${fromCurr.value} = ${finalAmount} ${toCurr.value}`;
  } catch (error) {
    msg.innerText = `Error: ${error.message}`;
    console.error("Error fetching exchange rate:", error);
  }
};

// Update flag images
const updateFlag = (element) => {
  const currCode = element.value;
  const countryCode = countryList[currCode];
  if (countryCode) {
    const newSrc = `https://flagsapi.com/${countryCode}/flat/64.png`;
    const img = element.parentElement.querySelector("img");
    img.src = newSrc;
  }
};

// Handle form submission
btn.addEventListener("click", (evt) => {
  evt.preventDefault();
  updateExchangeRate();
});

// Update exchange rate on page load
window.addEventListener("load", updateExchangeRate);
