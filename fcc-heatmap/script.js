document.addEventListener("DOMContentLoaded", () => {
  const w = 1400;
  const h = 500;
  const margin = { top: 30, right: 10, bottom: 90, left: 60 };
  const colors = ["SteelBlue", "LightSteelBlue", "Orange", "Crimson"];
  const text = ["Below 7°", "Bellow 8°", "Above 8°", "Above 9°"];
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  // SVG

  const svg = d3
    .select(".svg-container")
    .append("svg")
    .attr("width", w + margin.left + margin.right)
    .attr("height", h + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

  fetch(
    "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json"
  )
    .then((response) => {
      if (!response.ok) {
        throw new Error("Response was not ok.");
      }
      return response.json();
    })
    .then((data) => {
      const monthlyVar = data.monthlyVariance;
      const baseTemp = data.baseTemperature;
      const temp = monthlyVar.map((item) => {
        const variance = item.variance;
        return Number((baseTemp - item.variance).toFixed(2));
      });

      // Y Scale

      const yScale = d3
        .scaleBand()
        .domain([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11])
        .range([margin.top, h - margin.bottom]);

      const yAxis = d3
        .axisLeft(yScale)
        .tickValues(yScale.domain())
        .tickFormat((month) => {
          const date = new Date(0);
          date.setUTCMonth(month);
          const format = d3.utcFormat("%B");
          return format(date);
        });
      svg
        .append("g")
        .attr("id", "y-axis")
        .attr("transform", `translate(${margin.left}, 0)`)
        .call(yAxis)
        .append("text")
        .text("Months")
        .attr("transform", `translate(-70, ${h / 2}) rotate(-90)`)
        .attr("text-anchor", "middle")
        .style("fill", "black")
        .attr("class", "tag");

      // X Scale

      const years = monthlyVar.map((item) => {
        return item.year;
      });
      const xScale = d3
        .scaleBand()
        .domain(years)
        .range([margin.left, w - margin.right]);
      const xAxis = d3
        .axisBottom(xScale)
        .tickValues(xScale.domain().filter((year) => year % 10 === 0))
        .tickSize(10);
      svg
        .append("g")
        .attr("id", "x-axis")
        .attr("transform", `translate(0, ${h - margin.bottom})`)
        .call(xAxis)
        .append("text")
        .text("Years")
        .attr("text-anchor", "middle")
        .attr("transform", `translate(${w / 2}, 70)`)
        .attr("class", "tag")
        .style("fill", "black");

      // Cells

      const cellsGroup = svg.append("g").attr("class", "cells");
      cellsGroup
        .selectAll("rect")
        .data(monthlyVar)
        .enter()
        .append("rect")
        .attr("class", "cell")
        .attr("fill", (item) => {
          const variance = item.variance;
          if (variance < -1) {
            return "SteelBlue";
          } else if (variance <= 0) {
            return "LightSteelBlue";
          } else if (variance < 1) {
            return "Orange";
          } else {
            return "Crimson";
          }
        })
        .attr("data-year", (d) => d.year)
        .attr("data-month", (d) => d.month - 1)
        .attr("data-temp", (d) => baseTemp + d.variance)
        .attr("height", (h - margin.top - margin.bottom) / 12)
        .attr("y", (d) => yScale(d.month - 1))
        .attr("width", (d) => {
          const minYear = d3.min(years);
          const maxYear = d3.max(years);
          const totalYears = maxYear - minYear;
          return (w - margin.left - margin.right) / totalYears;
        })
        .attr("x", (d, i) => xScale(d.year))
        .on("mouseover", (event, d) => {
          const tooltipWidth = document.getElementById("tooltip").offsetWidth;
          tooltip
            .style("visibility", "visible")
            .style("left", `${event.pageX - tooltipWidth / 2}px`)
            .style("top", `${event.pageY - 100}px`)
            .attr("data-year", d.year)
            .html(
              `${d.year} - ${months[d.month - 1]}<br>${(
                baseTemp + d.variance
              ).toFixed(2)}°C<br>${d.variance}°C`
            );
        })
        .on("mouseout", () => {
          tooltip.style("visibility", "hidden");
        });

      // Legend

      const legend = svg
        .append("g")
        .attr("width", 200)
        .attr("height", 50)
        .attr("id", "legend")
        .attr("transform", `translate(${margin.left}, ${h - 50})`);

      // Legend Rects

      const legendColors = legend
        .selectAll("g")
        .data(colors)
        .enter()
        .append("g")
        .attr("transform", (d, i) => `translate(0, ${i * 25})`)
        .attr("y", (d, i) => i * 25)
        .attr("id", "legend-colors");
      legendColors
        .append("rect")
        .attr("width", 25)
        .attr("height", 25)
        .style("fill", (d, i) => colors[i]);
      legendColors
        .append("text")
        .attr("x", 27)
        .attr("y", 16)
        .text((d, i) => {
          return `${text[i]}`;
        })
        .style("font-size", ".7rem");

      // Tooltip

      const tooltip = d3
        .select(".svg-container")
        .append("div")
        .attr("id", "tooltip");
    })
    .catch((error) => console.log(error));
});
