const w = window.innerWidth;
const h = window.innerHeight;
const n = 100;

// SVG

const svg = d3.select("body").append("svg").attr("width", w).attr("height", h);

// Rect Vertical

const rectV = svg
  .append("g")
  .selectAll("rect")
  .data(d3.range(n))
  .join("rect")
  .attr("width", 10)
  .attr("height", h)
  .attr("x", (d) => d * 20)
  .attr("mask", "url(#circle-mask)");

// Mask 1

const mask1 = svg.append("mask").attr("id", "circle-mask");

// Mask 1 Rectangle

mask1.append("rect").attr("width", w).attr("height", h).attr("fill", "black");
mask1
  .append("circle")
  .attr("cx", w / 2)
  .attr("cy", h / 2)
  .attr("r", 200)
  .attr("fill", "white");

// Rect 2

const rect2 = svg
  .append("g")
  .selectAll("rect")
  .data(d3.range(100))
  .join("rect")
  .attr("width", w)
  .attr("height", 10)
  .attr("y", (d) => d * 20)
  .attr("mask", "url(#circle-mask-2");

// Mask 2

const mask2 = svg.append("mask").attr("id", "circle-mask-2");

// Rect Horizontal

mask2.append("rect").attr("width", w).attr("height", h).attr("fill", "white");
mask2
  .append("circle")
  .attr("cx", w / 2)
  .attr("cy", h / 2)
  .attr("r", 200)
  .attr("fill", "black");
