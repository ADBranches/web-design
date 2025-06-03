async function getStockData() {
  const symbol = document.getElementById("symbol").value.toUpperCase();
  if (!symbol) {
    document.getElementById("summary").innerText = "Error: Please enter a stock symbol.";
    return;
  }

  try {
    const res = await fetch(`http://localhost:3000/api/stock?symbol=${symbol}`);
    
    if (!res.ok) {
      throw new Error(`HTTP error! Status: ${res.status}`);
    }

    const data = await res.json();

    if (!data["Time Series (Daily)"]) {
      document.getElementById("summary").innerText = "Error: Invalid symbol or API limit reached.";
      return;
    }

    const timeSeries = data["Time Series (Daily)"];
    const dates = Object.keys(timeSeries).slice(0, 7).reverse();
    const prices = dates.map(date => parseFloat(timeSeries[date]["4. close"]));

    const current = timeSeries[dates[dates.length - 1]];
    const summaryText = `
      Symbol: ${symbol} | 
      Latest Close: $${parseFloat(current["4. close"]).toFixed(2)} | 
      High: $${parseFloat(current["2. high"]).toFixed(2)} | 
      Low: $${parseFloat(current["3. low"]).toFixed(2)} | 
      Volume: ${current["5. volume"]}
    `;
    document.getElementById("summary").innerText = summaryText;

    renderChart(dates, prices, symbol);
  } catch (err) {
    console.error("Fetch error:", err);
    document.getElementById("summary").innerText = "Error: Failed to fetch data. Check console/logs.";
  }
}


let chart; // For keeping reference to update it

function renderChart(dates, prices, symbol) {
  const ctx = document.getElementById("chart").getContext("2d");
  if (chart) chart.destroy(); // destroy previous chart
  chart = new Chart(ctx, {
    type: "line",
    data: {
      labels: dates,
      datasets: [{
        label: `${symbol} Price`,
        data: prices,
        borderColor: "blue",
        backgroundColor: "lightblue",
        fill: true,
      }]
    },
    options: {
      responsive: true,
      scales: {
        x: { display: true },
        y: { display: true }
      }
    }
  });
}

