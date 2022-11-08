let dataObj = {};
let donutChart = null;
let activeHoveredState = null;

(async function () {
  // fetch data and save
  dataObj = await fetchData();
  console.log(dataObj);
  fillData(dataObj);

  document.querySelector("tbody").addEventListener(
    "mouseover",
    function (e) {
      console.log({ target: e.target });
      const hoveredState = e.target?.parentElement?.dataset?.state;
      console.log(hoveredState);
      if (hoveredState && hoveredState !== activeHoveredState) {
        activeHoveredState = hoveredState;
        const hoveredstateData = dataObj.statewise.filter(
          (item) => item.state === hoveredState
        )[0];
        createCards(hoveredstateData);
        //console.log(donutChart.data.dataset);
        createDonutChart(hoveredstateData);
      }
    },
    true
  );

  document.querySelector("tbody").addEventListener("mouseout", function (e) {
    createCards(dataObj.statewise[0]);
    createDonutChart(dataObj.statewise[0]);
    activeHoveredState = null;
  });
})();

function fetchData() {
  return fetch("https://data.covid19india.org/data.json").then((resp) =>
    resp.json()
  );
}

function fillData(data) {
  createTable(data.statewise);
  createCards(data.statewise[0]);
  createDonutChart(data.statewise[0]);
}

function createDonutChart(chartData) {
  const data = {
    labels: [
      "active: " + chartData.active,
      "deceased: " + chartData.deaths,
      "recovered: " + chartData.recovered
    ],
    datasets: [
      {
        data: [chartData.active, chartData.deaths, chartData.recovered],
        backgroundColor: ["rgb(0,0,255)", "rgb(128,128,128)", "rgb(0,128,0)"]
      }
    ]
  };

  if (donutChart) {
    donutChart.data = data;
    donutChart.update();
  } else {
    const config = {
      type: "doughnut",
      data: data,
      options: {
        cutout: "80%",
        plugins: {
          legend: {
            position: "right",
            labels: {
              usePointStyle: true
            }
          },
          tooltip: {
            enabled: false
          }
        }
      }
    };
    donutChart = new Chart(document.getElementById("donutChart"), config);
  }
  document.getElementById("chartConfirmedText").innerText = chartData.confirmed;
}

function createCards(cardData) {
  document.querySelector(".card-confirmed span").innerText = cardData.confirmed;
  document.querySelector(".card-active span").innerText = cardData.active;
  document.querySelector(".card-recovered span").innerText = cardData.recovered;
  document.querySelector(".card-deceased span").innerText = cardData.deaths;
  document.getElementById("lastUpdated").innerText = cardData.lastupdatedtime;
}

function createTable(states) {
  console.log(states);
  const tbody = document.querySelector("tbody");
  console.log(tbody);
  states.forEach((state, index) => {
    // first item is total count
    if (index > 0) {
      const tr = document.createElement("tr");
      tr.setAttribute("data-state", state.state);
      // active: "9832"
      // confirmed: "1539065"
      // deaths: "18312"
      // deltaconfirmed: "502"
      // deltadeaths: "9"
      // deltarecovered: "691"
      // lastupdatedtime: "13/08/2021 23:27:22"
      // migratedother: "0"
      // recovered: "1510921"
      // state: "West Bengal"
      // statecode: "WB"
      // statenotes: ""
      createTd(tr, state.state);
      createTd(tr, state.confirmed);
      createTd(tr, state.active);
      createTd(tr, state.recovered);
      createTd(tr, state.deaths);
      tbody.appendChild(tr);
    }
  });
}

function createTd(tr, value) {
  const td = document.createElement("td");
  td.innerHTML = value;
  tr.appendChild(td);
}
