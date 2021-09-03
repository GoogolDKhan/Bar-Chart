var width = 800,
    height = 400,
    barWidth = width / 60;

var tooltip = d3
    .select(".visHolder")
    .append("div")
    .attr("id", "tooltip")
    .style("opacity", 0);

var svgContainer = d3
    .select(".visHolder")
    .append("svg")
    .attr("width", width + 100)
    .style("height", height + 60);

d3.json(
    "https://gist.githubusercontent.com/GoogolDKhan/0a34c5e9347f85a943f98da3102d1177/raw/0583c07ba39a83fc8ebac82f16427d009a2e0dd6/IndiaGDP.json",

    function (e, data) {
        svgContainer
            .append("text")
            .attr("transform", "rotate(-90)")
            .attr("x", -300)
            .attr("y", 80)
            .text("GROSS DOMESTIC PRODUCT");

        svgContainer
            .append("text")
            .attr("x", width / 2 + 320)
            .attr("y", height + 50)
            .text("made by Sarfaraz Khan")
            .attr("class", "info");

        var years = data.india.map(function (item) {
            return item[0];
        });

        var yearsDate = data.india.map(function (item) {
            return new Date(item[0]);
        });

        var xMax = new Date(d3.max(yearsDate));
        var xScale = d3
            .scaleTime()
            .domain([d3.min(yearsDate), xMax])
            .range([0, width]);

        var xAxis = d3.axisBottom().scale(xScale);

        svgContainer
            .append("g")
            .call(xAxis)
            .attr("id", "x-axis")
            .attr("transform", "translate(60, 400)");

        var GDP = data.india.map(function (item) {
            return item[1];
        });

        var scaledGDP = [];

        var gdpMax = d3.max(GDP);

        var linearScale = d3.scaleLinear().domain([0, gdpMax]).range([0, height]);

        scaledGDP = GDP.map(function (item) {
            return linearScale(item);
        });

        var yAxisScale = d3.scaleLinear().domain([0, gdpMax]).range([height, 0]);

        var yAxis = d3.axisLeft(yAxisScale);

        svgContainer
            .append("g")
            .call(yAxis)
            .attr("id", "y-axis")
            .attr("transform", "translate(60, 0)");

        d3.select("svg")
            .selectAll("rect")
            .data(scaledGDP)
            .enter()
            .append("rect")
            .attr("data-date", function (d, i) {
                return data.india[i][0];
            })
            .attr("data-gdp", function (d, i) {
                return data.india[i][1];
            })
            .attr("class", "bar")
            .attr("x", function (d, i) {
                return xScale(yearsDate[i]);
            })
            .attr("y", function (d) {
                return height - d;
            })
            .attr("width", barWidth)
            .attr("height", function (d) {
                return d;
            })
            .style("fill", "gray")
            .attr("transform", "translate(60, 0)")
            .on("mouseover", function (d, i) {
                tooltip.transition().duration(200).style("opacity", 1);
                tooltip
                    .html(years[i] + "<br>" + "$" + GDP[i] + " Billion")
                    .attr("data-date", data.india[i][0])
                    .style("left", i * barWidth - 80 + "px")
                    .style("top", height + "px")
                    .style("transform", "translateX(60px)");
            })
            .on("mouseout", function () {
                tooltip.transition().duration(200).style("opacity", 0);
            });
    }
);
