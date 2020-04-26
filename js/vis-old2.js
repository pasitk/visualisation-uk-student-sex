d3.csv('dataset/dataset-2.csv', function (data) {
    // console.log(data);
    var destinationInput = document.getElementById("destination");
    var overAllConvertedData = processDomicilePercentageData(data, destinationInput.value, 2018);

    // Join the FeatureCollection's features array to path elements
    var domicileGroupVis = d3.select('#domicileGroup')

    var margin = {
        top: 30,
        right: 50,
        bottom: 0,
        left: 50
    };
    var width = 1000;
    var height = 200;

    var svg = domicileGroupVis.append("svg")
        .attr("viewBox", "0 0 " + width + " " + height)
        .attr("width", "100%")
        .attr("preserveAspectRatio", "xMinYMin")
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // // List of subgroups = header of the csv files = soil condition here
    var subgroups = Object.keys(overAllConvertedData[0]).slice(4);

    // Add Y axis
    var xScale = d3.scaleLinear()
        .domain([0, 100])
        .range([0, width - margin.left - margin.right]);
    // svg.append("g")
    // .call(d3.axisLeft(y));

    var barContainer = svg.append("g");
    var annotationContainer = svg.append("g")
        .attr("class", "annotation-group")
        .style('font-size', '1.5em');

    var color = d3.scaleOrdinal()
        .domain(subgroups)
        .range(['#CF142B', '#0065BF', '#f5b342']);

    var formatPercent = d3.format(".2f");

    const typeElbow = d3.annotationCustomType(
        d3.annotationLabel, {
            "className": "custom",
            "note": {
                "align": "top",
                "orientation": "leftRight"
            }
        })

    function redrawDomicileGroup(data) {
        var groups = d3.map(data, function (d) {
            return (d['Academic Year'])
        }).keys();

        //X Axis - ScaleBand
        // x.domain(groups)

        // svg.select(".x")
        //     .transition()
        //     .call(d3.axisBottom(x).tickSizeOuter(0));

        //Plot Chart
        var stackedData = d3.stack()
            .keys(subgroups)
            (data);

        // console.log(stackedData)

        var barsWithData = barContainer.selectAll("g")
            .data(stackedData)

        barsWithData.exit().remove();

        var bars = barsWithData.enter()
            .append("g")
            .attr("fill", function (d) {
                return color(d.key)
            })
            .merge(barsWithData)
            .selectAll("rect")
            .data(function (d) {
                return d
            })

        bars.exit().transition().style('opacity', 0).remove()

        bars.enter()
            .append("rect")
            .attr("y", 0)
            .attr("x", 0)
            .attr("opacity", 0)
            .on("click", function (d, i) {
                // var destinationInput = document.getElementById("destination");
                // var tempVal = d[1] - d[0];
                // console.log(tempVal);
                // if (tempVal == d.data['England']) {
                //     destinationInput.value = 'England';
                // } else if (tempVal == d.data['Northen Ireland']) {
                //     destinationInput.value = 'Northen Ireland';
                // } else if (tempVal == d.data['Scotland']) {
                //     destinationInput.value = 'Scotland';
                // } else if (tempVal == d.data['Wales']) {
                //     destinationInput.value = 'Wales';
                // }
                // destinationInput.onchange();
            }).merge(bars)
            .transition()
            .delay((d, i) => i * 100)
            .attr("x", function (d) {
                return xScale(d[0])
            })
            .attr("y", 0)
            .attr("height", 50)
            .attr("opacity", 1)
            .attr("width", function (d) {
                console.log(d);
                return xScale(d[1]) - xScale(d[0]);
            })

        //Annotation Part
        const annotations = [{
                note: {
                    label: formatPercent(data[0]['Non-European Union Percent'])+"%",
                    title: "Non-EU Countries"
                },
                data: {
                    domicile: "Non-European",
                    year: data[0]['Academic Year'],
                    mid: Number(data[0]['Total UK Percent']) + Number(data[0]['Other European Union Percent']) + Number(data[0]['Non-European Union Percent']) / 10
                },
                color: "#333333",
                dy: 125,
                dx: 0
            },
            {
                note: {
                    label: formatPercent(data[0]['Other European Union Percent'])+"%",
                    title: "Other EU Countries"
                },
                data: {
                    domicile: "Other European Union",
                    year: data[0]['Academic Year'],
                    mid: Number(data[0]['Total UK Percent']) + 1
                },
                color: "#333333",
                dy: 125,
                dx: -1
            },
            {
                note: {
                    label: formatPercent(data[0]['Total UK Percent'])+"%",
                    title: "UK"
                },
                data: {
                    domicile: "Total UK",
                    year: data[0]['Academic Year'],
                    mid: Number(data[0]['Total UK Percent']) / 100
                },
                color: "#333333",
                dy: 100,
                dx: 0
            }

        ]

        const makeAnnotations = d3.annotation()
            .notePadding(10)
            .textWrap(120)
            .type(typeElbow)
            //accessors & accessorsInverse not needed
            //if using x, y in annotations JSON
            .accessors({
                x: d => xScale(d.mid),
                y: d => 50
            })
            // .accessorsInverse({
            //     date: d => timeFormat(x.invert(d.x)),
            //     close: d => y.invert(d.y)
            // })
            .annotations(annotations)

        d3.annotation().annotations(annotations);

        annotationContainer.call(makeAnnotations);
    }

    redrawDomicileGroup(overAllConvertedData);

    var yearBar = document.getElementById("year");

    document.addEventListener("reloadAllEvent", function () {
        redrawDomicileGroup(processDomicilePercentageData(data, destinationInput.value, Number(yearBar.value)));
    })
})

function processDomicilePercentageData(rawData, dest, year) {
    var fullYear = year + "/" + ((year + 1) + "").slice(2);
    overallRawData = rawData.filter(function (row) {
        return (row['Domicile'] == 'Total UK' || row['Domicile'] == 'Other European Union' || row['Domicile'] == 'Non-European Union') && row['First year marker'] == 'All' && row['Level of study'] == 'All' && row['Mode of study'] == 'All' && row['Country of HE provider'] == dest && row['Academic Year'] == fullYear;
    });
    overallYears = [];
    overAllConvertedData = [];
    overallRawData.forEach(row => {
        if (!overallYears.includes(row['Academic Year'])) {
            overallYears.push(row['Academic Year']);
            overAllConvertedData.push({
                'Academic Year': row['Academic Year']
            });
        }
    });
    overallRawData.forEach(row => {
        overAllConvertedData.forEach(convertedRow => {
            if (row['Academic Year'] == convertedRow['Academic Year']) {
                if (row['Domicile'] == 'Total UK' && !('Total UK' in convertedRow)) {
                    convertedRow['Total UK'] = row['Number'];
                } else if (row['Domicile'] == 'Other European Union' && !('Other European Union' in convertedRow)) {
                    convertedRow['Other European Union'] = row['Number'];
                } else if (row['Domicile'] == 'Non-European Union' && !('Non-European Union' in convertedRow)) {
                    convertedRow['Non-European Union'] = row['Number'];
                }
            }
        });
    });
    var total = Number(overAllConvertedData[0]['Total UK']) + Number(overAllConvertedData[0]['Other European Union']) + Number(overAllConvertedData[0]['Non-European Union']);
    overAllConvertedData[0]['Total UK Percent'] = overAllConvertedData[0]['Total UK'] * 100 / total;
    overAllConvertedData[0]['Other European Union Percent'] = overAllConvertedData[0]['Other European Union'] * 100 / total;
    overAllConvertedData[0]['Non-European Union Percent'] = overAllConvertedData[0]['Non-European Union'] * 100 / total;
    console.log(overAllConvertedData);
    return overAllConvertedData
}