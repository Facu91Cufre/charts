document.addEventListener("DOMContentLoaded", () => {
  const w = 1000;
  const h = 400;
  const margin = {
    top: 60,
    right: 20,
    bottom: 15,
    left: 40,
  };

  // SVG

  const svg = d3
    .select(".svg-container")
    .append("svg")
    .attr("width", w + margin.left + margin.right)
    .attr("height", h + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

  // SVG Title

  svg
    .append("text")
    .text("Argentina's GDP (1983-2023)")
    .attr("x", w / 2)
    .attr("y", 5)
    .attr("text-anchor", "middle")
    .attr("id", "title");

  // SVG Subtitle

  svg
    .append("text")
    .text("Expresed in Billions of Dollars")
    .attr("x", w / 2)
    .attr("y", 30)
    .attr("text-anchor", "middle")
    .attr("id", "subtitle");

  // Tooltip

  const tooltip = d3
    .select(".svg-container")
    .append("div")
    .attr("class", "tooltip")
    .attr("id", "tooltip");

  fetch(
    "https://api.worldbank.org/v2/country/AR/indicator/NY.GDP.MKTP.CD?date=1983:2024&format=json"
  )
    .then((response) => {
      if (!response.ok) {
        throw new Error("Fetch request was not ok.");
      }
      return response.json();
    })
    .then((data) => {
      console.log(data)
      const yearGDP = data[1];
      const mappedData = yearGDP.map((year) => {
        return {
          year: Number(year.date),
          value: Number((year.value / 1000000000).toFixed(2)),
        };
      });

      // Color

      const color = d3
        .scaleLinear()
        .domain([0, d3.max(mappedData, (d) => d.value)])
        .range(["#7fcdbb", "#0c2c84"]);

      // X Scale

      const xScale = d3
        .scaleLinear()
        .domain([
          d3.min(mappedData, (d) => d.year),
          d3.max(mappedData, (d) => d.year) + 2,
        ])
        .range([margin.left, w - margin.right]);

      const xAxis = d3.axisBottom(xScale).tickFormat(d3.format("d"));

      // Y Scale

      const yScale = d3
        .scaleLinear()
        .domain([0, d3.max(mappedData, (d) => d.value) * 1.05])
        .range([h - margin.bottom, margin.top]);

      const yAxis = d3.axisLeft(yScale);

      // X & Y Axis

      svg
        .append("g")
        .attr("transform", `translate(0, ${h - margin.bottom})`)
        .attr("id", "x-axis")
        .call(xAxis);

      svg
        .append("g")
        .attr("transform", `translate(${margin.left}, 0)`)
        .attr("id", "y-axis")
        .call(yAxis);

      // Bars

      const bar = svg
        .selectAll("rect")
        .data(mappedData)
        .enter()
        .append("rect")
        .attr("width", (w - margin.left - margin.right) / mappedData.length - 2)
        .attr("height", (d, i) => h - margin.bottom - yScale(d.value))
        .attr("x", (d, i) => xScale(mappedData[i].year))
        .attr("y", (d, i) => yScale(d.value))
        .attr("class", "bar")
        .style("fill", (d) => color(d.value))
        .on("mouseover", (event, d) => {
          tooltip
            .style("opacity", 0.87)
            .style("left", event.pageX + 10 + "px")
            .style("top", event.pageY - 60 + "px")
            .html(`<b>Year:</b> ${d.year}<br><b>GDP:</b> $${d.value} Billions`);
        })
        .on("mouseout", () => {
          tooltip.style("opacity", 0);
        });
    })
    .catch((error) => {
      console.log(error);
    });
});
