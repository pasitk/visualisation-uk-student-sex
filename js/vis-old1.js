d3.csv('dataset/dataset-1.csv', function (data) {
    // console.log(data);
    var overAllConvertedData = processData(data, 2018);

    // Join the FeatureCollection's features array to path elements
    var overallVis = d3.select('#overall')

    var margin = {
        top: 20,
        right: 20,
        bottom: 30,
        left: 60
    };
    var width = 500;
    var height = 700;

    var svg = overallVis.append("svg")
        .attr("viewBox", "0 0 " + width + " " + height)
        .attr("width", "100%")
        .attr("preserveAspectRatio", "xMinYMin")
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


    // List of subgroups = header of the csv files = soil condition here
    var subgroups = Object.keys(overAllConvertedData[0]).slice(1);

    //X Axis - ScaleBand
    var x = d3.scaleBand()
        .range([0, (width - margin.left - margin.right) / 2])
        .padding(0.2);
    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + (height - margin.top - margin.bottom) + ")")
        .call(d3.axisBottom(x).tickSizeOuter(0));

    // Add Y axis
    var y = d3.scaleLinear()
        .domain([0, 2500000])
        .range([height - margin.top - margin.bottom, 0]);
    svg.append("g")
        .call(d3.axisLeft(y));

    var barContainer = svg.append("g");
    var annotationContainer = svg.append("g")
        .attr("class", "annotation-group")
        .style('font-size', '1.2em');

    var color = d3.scaleOrdinal()
        .domain(subgroups)
        .range(['#CF142B', '#DDDDDD', '#0065BF', '#00AD36']);

    var formatComma = d3.format(",");

    const typeElbow = d3.annotationCustomType(
        d3.annotationLabel, {
            "className": "custom",
            "connector": {
                "type": "elbow"
            },
            "note": {
                "align": "middle",
                "orientation": "leftRight"
            }
        })

    function redrawOverAll(data) {
        var groups = d3.map(data, function (d) {
            return (d['Academic Year'])
        }).keys();

        //X Axis - ScaleBand
        x.domain(groups)

        svg.select(".x")
            .transition()
            .call(d3.axisBottom(x).tickSizeOuter(0));

        //Plot Chart
        var stackedData = d3.stack()
            .keys(subgroups)
            (data);

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
            .attr("y", height)
            .attr("x", 0)
            .attr("opacity", 0)
            .on("click", function (d,i) {
                var destinationInput = document.getElementById("destination");
                var tempVal = d[1] - d[0];
                console.log(tempVal);
                if (tempVal == d.data['England']) {
                    destinationInput.value = 'England';
                } else if (tempVal == d.data['Northern Ireland']) {
                    destinationInput.value = 'Northern Ireland';
                } else if (tempVal == d.data['Scotland']) {
                    destinationInput.value = 'Scotland';
                } else if (tempVal == d.data['Wales']) {
                    destinationInput.value = 'Wales';
                }
                destinationInput.onchange();
            }).merge(bars)
            .transition()
            .delay((d, i) => i * 100)
            .attr("x", function (d) {
                return x(d.data['Academic Year'])
            })
            .attr("y", function (d) {
                return y(d[1])
            })
            .attr("height", function (d) {
                return y(d[0]) - y(d[1]);
            })
            .attr("opacity", 1)
            .attr("width", x.bandwidth())

        //Annotation Part
        const annotations = [{
                note: {
                    label: formatComma(data[0]['England']),
                    title: "England"
                },
                data: {
                    country: "England",
                    year: data[0]['Academic Year'],
                    mid: data[0]['England'] / 2
                },
                color: "#333333",
                dy: 0,
                dx: 100
            },
            {
                note: {
                    label: formatComma(data[0]['Northern Ireland']),
                    title: "Northern Ireland"
                },
                data: {
                    country: "Northern Ireland",
                    year: data[0]['Academic Year'],
                    mid: Number(data[0]['England']) + (data[0]['Northern Ireland'] / 2)
                },
                color: "#333333",
                dy: 60,
                dx: 100
            },
            {
                note: {
                    label: formatComma(data[0]['Scotland']),
                    title: "Scotland"
                },
                data: {
                    country: "Scotland",
                    year: data[0]['Academic Year'],
                    mid: Number(data[0]['England']) + Number(data[0]['Northern Ireland']) + (data[0]['Scotland'] / 2)
                },
                color: "#333333",
                dy: 25,
                dx: 100
            },
            {
                note: {
                    label: formatComma(data[0]['Wales']),
                    title: "Wales"
                },
                data: {
                    country: "Wales",
                    year: data[0]['Academic Year'],
                    mid: Number(data[0]['England']) + Number(data[0]['Northern Ireland']) + Number(data[0]['Scotland']) + data[0]['Wales'] / 2
                },
                color: "#333333",
                dy: 0,
                dx: 100
            }
        ]

        const makeAnnotations = d3.annotation()
            .notePadding(10)
            .textWrap(240)
            .type(typeElbow)
            //accessors & accessorsInverse not needed
            //if using x, y in annotations JSON
            .accessors({
                x: d => (x(d.year) + x.bandwidth()),
                y: d => y(d.mid)
            })
            // .accessorsInverse({
            //     date: d => timeFormat(x.invert(d.x)),
            //     close: d => y.invert(d.y)
            // })
            .annotations(annotations)

        d3.annotation().annotations(annotations);

        annotationContainer.call(makeAnnotations);
    }

    redrawOverAll(overAllConvertedData);

    var yearBar = document.getElementById("year");

    document.addEventListener("reloadAllEvent", function () {
        redrawOverAll(processData(data, Number(yearBar.value)));
    })
})

function processData(rawData, year) {
    var fullYear = year + "/" + ((year + 1) + "").slice(2);
    overallRawData = rawData.filter(function (row) {
        return row['Subject Area'] == 'Total' && row['First year marker'] == 'All' && row['Level of study'] == 'All' && row['Mode of study'] == 'All' && row['Sex'] == 'Total' && row['Country of HE provider'] != 'All' && row['Academic Year'] == fullYear;
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
                if (row['Country of HE provider'] == 'England' && !('England' in convertedRow)) {
                    convertedRow['England'] = row['Number'];
                } else if (row['Country of HE provider'] == 'Scotland' && !('Scotland' in convertedRow)) {
                    convertedRow['Scotland'] = row['Number'];
                } else if (row['Country of HE provider'] == 'Northern Ireland' && !('Northern Ireland' in convertedRow)) {
                    convertedRow['Northern Ireland'] = row['Number'];
                } else if (row['Country of HE provider'] == 'Wales' && !('Wales' in convertedRow)) {
                    convertedRow['Wales'] = row['Number'];
                }
            }
        });
    });
    // console.log(overAllConvertedData);
    return overAllConvertedData
}