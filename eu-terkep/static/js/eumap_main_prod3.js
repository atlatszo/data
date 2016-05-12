var telepules;

var adminUnit = "megye",
    metric = "DONATION",
    timeSeries = "DONATION_TIME",
    geojson,
    stripes,
    indexHamlet;

var population,
    population_country,
    population_county,
    tourism,
    tourism_country,
    tourism_county,
    culture,
    culture_country,
    culture_county,
    unemployment,
    unemployment_country,
    unemployment_county,
    enviroment,
    enviroment_country,
    enviroment_county,
    health,
    health_country,
    health_county,
    road,
    road_country,
    road_county,
    agriculture,
    agriculture_country,
    agriculture_county,
    company,
    company_country,
    company_county,
    government,
    government_country,
    government_county,
    water,
    water_country,
    water_county,
    gas,
    gas_country,
    gas_county,
    education,
    education_country,
    education_county,
    aid,
    aid_country,
    aid_county;

var deviation,
    deviation_sum;

var detailedAll,
    detailedSum;

var pieData;
var overlayState = "plain";
var hoverState = "off";
var pieSelected;

var colorArea,
    metricPie,
    percentage;

var cityToFind;

var objectSearchedTest;

var numberOfRecords;

var county;
var area;
var ranking_country;

var rankView;

var timeSeries_detailed;
var defaultChart = "default";

var coords;

var categories = { "Vállalkozásfejlesztés": 9672.63866662,
                  "Ipar": 2685.04420263,
                  "Energetikai fejlesztések": 3591.09151724,
                  "Ár- és belvízvédelem": 3890.49797028,
                  "Önkormányzati fejlesztések": 3797.85724832,
                  "Kultúra": 671.012180251,
                  "Ivóvíz, szennyvíz, csatornázás": 9923.65443737,
                  "Mezőgazdasági fejlesztések": 125.040196724,
                  "Munkahelyteremtés, foglalkoztatás": 2068.40826998,
                  "Tudomány, kutatás": 4134.26776162,
                  "Oktatás, továbbképzés": 10754.8079567,
                  "Kategorizálatlan": 13766.4388735,
                  "Turizmus és vidékfejlesztés": 5817.76504059,
                  "Egyéb infrastruktúra fejlesztése": 2438.78632043,
                  "Egészségügy": 5189.63429823,
                  "Szociális támogatások": 6636.42536663,
                  "Közlekedés, úthálózat": 15269.0460311,
                  "Környezetvédelem": 3613.17993143,
                  "Summa": 104045.59627
}

var loader = '<div class="spinner"></div>';

/**
* Number.prototype.format(n, x, s, c)
*
* @param integer n: length of decimal
* @param integer x: length of whole part
* @param mixed   s: sections delimiter
* @param mixed   c: decimal delimiter
*/

Number.prototype.format = function(n, x, s, c) {
    var re = '\\d(?=(\\d{' + (x || 3) + '})+' + (n > 0 ? '\\D' : '$') + ')',
        num = this.toFixed(Math.max(0, ~~n));
    return (c ? num.replace('.', c) : num).replace(new RegExp(re, 'g'), '$&' + (s || ','));
}

var hufFormat = d3.locale({
    "decimal": ".",
    "thousands": " ",
    "grouping": [3],
    "currency": ["", "HUF"],
    "dateTime": "%a %b %e %X %Y",
    "date": "%m/%d/%Y",
    "time": "%H:%M:%S",
    "periods": ["de", "du"],
    "days": ["Vasárnap", "Hétfő", "Kedd", "Szerda", "Csütörtök", "Péntek", "Szombat"],
    "shortDays": ["V", "H", "K", "Sze", "Cs", "P", "Szo"],
    "months": ["Január", "Február", "Március", "Április", "Május", "Június", "Július", "Augusztus", "Szeptember", "Október", "November", "December"],
    "shortMonths": ["Jan", "Feb", "Már", "Ápr", "Máj", "Jún", "Júl", "Aug", "Sze", "Okt", "Nov", "Dec"]
});

d3.format = hufFormat.numberFormat;

function ConvertToCSV(objArray) {
    var array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray;
    var str = '';

    for (var i = 0; i < array.length; i++) {
        var line = '';
        for (var index in array[i]) {
            if (line != '') line += ','
                line += array[i][index];
        }
        str += line + '\r\n';
    }
    return str;
}

function convertHex(hex,opacity){
    hex = hex.replace('#','');
    r = parseInt(hex.substring(0,2), 16);
    g = parseInt(hex.substring(2,4), 16);
    b = parseInt(hex.substring(4,6), 16);

    result = 'rgba('+r+','+g+','+b+','+opacity/100+')';
    return result;
}

function imageLoader(image, elem) {
    var c = new Image();
    c.onload = function(){
        elem.css("background-image", "url("+ image+")");
        elem.css("background-size", "100%, 100%");
    }

    c.src = image;
}

function openDetailedLayer () {
    $.ajax({
        type: "POST",
        async: true,
        url: "categoryfind2",
        data: JSON.stringify(cityToFind, null, '\t'),
        contentType: 'application/json;charset=UTF-8',
        success: function(data) {
            pieData = data["results"];
            renderPie(data["results"]);
            population = data["population"];
            population_country = data["population_country"];
            population_county = data["population_county"];
            tourism = data["tourism"];
            tourism_country = data["tourism_country"];
            tourism_county = data["tourism_county"];
            culture = data["culture"];
            culture_country = data["culture_country"];
            culture_county = data["culture_county"];
            unemployment = data["unemployment"];
            unemployment_country = data["unemployment_country"];
            unemployment_county = data["unemployment_county"];
            enviroment = data["enviroment"];
            enviroment_country = data["enviroment_country"];
            enviroment_county = data["enviroment_county"];
            health = data["health"];
            health_country = data["health_country"];
            health_county = data["health_county"];
            road = data["road"];
            road_country = data["road_country"];
            road_county = data["road_county"];
            agriculture = data["agriculture"];
            agriculture_country = data["agriculture_country"];
            agriculture_county = data["agriculture_county"];
            company = data["company"];
            company_country = data["company_country"];
            company_county = data["company_county"];
            government = data["government"];
            government_country = data["government_country"];
            government_county = data["government_county"];
            water = data["water"];
            water_country = data["water_country"];
            water_county = data["water_county"];
            gas = data["gas"];
            gas_country = data["gas_country"];
            gas_county = data["gas_county"];
            education = data["education"];
            education_country = data["education_country"];
            education_county = data["education_county"];
            aid = data["aid"];
            aid_country = data["aid_country"];
            aid_county = data["aid_county"];
            county = data["county"];
            ranking_country = data["ranking_country"];
            area = (parseInt(data["area"])/100).toFixed(2);
            timeSeries_detailed = data["timeSeries"];
            deviation = data['deviation'];
            deviation_sum = data['deviation_sum'];
            //console.log(deviation_sum);

            detailedAll = JSON.parse(JSON.stringify(pieData));
            detailedSum = 0;
            for(var i in detailedAll) {
                    detailedSum += parseFloat(detailedAll[i].value);
            }
            //console.log(detailedSum);

            $(".county_svg").attr("class", "county_svg");
            if (cityToFind != "Budapest") {
                $(".city_name").html(cityToFind + " | <span class='thin'>" + county + " megye</span>");
            }
            else {
                $(".city_name").html(cityToFind);
            }
            $(".city_area").html(area.toString() + " km<sup class='sup_header_small'>2</sup>");
            $(".city_density").html(parseInt((parseInt(population.slice(-1)[0]['value'])).toFixed(2) / area).format(0, 3, ' ').toString() + " fő / km<sup class='sup_header_small'>2</sup>");
            if ('Summa' in ranking_country) {
                if (metric === "DONATION") {
                    $('.city_country_pos').text(JSON.parse(JSON.stringify(ranking_country['Summa'][0])));
                    $('.city_county_pos').text(JSON.parse(JSON.stringify(ranking_country['Summa'][1])));
                }
                else if (metric === "CAPITA") {
                    $('.city_country_pos').text(JSON.parse(JSON.stringify(ranking_country['Summa'][3])));
                    $('.city_county_pos').text(JSON.parse(JSON.stringify(ranking_country['Summa'][2])));
                }
                else {
                    $('.city_country_pos').text(JSON.parse(JSON.stringify(ranking_country['Summa'][3])));
                    $('.city_county_pos').text(JSON.parse(JSON.stringify(ranking_country['Summa'][2])));
                }
            }
            else {
                $('.city_country_pos').text("Nem kapott támogatást");
                $('.city_county_pos').text("Nem kapott támogatást");
            }
            $("#left_button_link").attr("href", "//adat.atlatszo.hu/eu-kereso?varos="+cityToFind);
            if (county === "Budapest") {
                $('#budapest').appendTo('#magyarorszag-compressed');
                $("#budapest").attr("class", "county_svg county_selected");
            }
            else if (county === "Pest") {
                $('#pest').appendTo('#magyarorszag-compressed');
                $("#pest").attr("class", "county_svg county_selected");
            }
            else if (county === "Tolna") {
                $('#tolna').appendTo('#magyarorszag-compressed');
                $("#tolna").attr("class", "county_svg county_selected");
            }
            else if (county === "Baranya") {
                $('#baranya').appendTo('#magyarorszag-compressed');
                $("#baranya").attr("class", "county_svg county_selected");
            }
            else if (county === "Győr-Moson-Sopron") {
                $('#gyor').appendTo('#magyarorszag-compressed');
                $("#gyor").attr("class", "county_svg county_selected");
            }
            else if (county === "Komárom-Esztergom") {
                $('#komarom').appendTo('#magyarorszag-compressed');
                $("#komarom").attr("class", "county_svg county_selected");
            }
            else if (county === "Vas") {
                $('#vas').appendTo('#magyarorszag-compressed');
                $("#vas").attr("class", "county_svg county_selected");
            }
            else if (county === "Zala") {
                $('#zala').appendTo('#magyarorszag-compressed');
                $("#zala").attr("class", "county_svg county_selected");
            }
            else if (county === "Veszprém") {
                $('#veszprem').appendTo('#magyarorszag-compressed');
                $("#veszprem").attr("class", "county_svg county_selected");
            }
            else if (county === "Nógrád") {
                $('#nograd').appendTo('#magyarorszag-compressed');
                $("#nograd").attr("class", "county_svg county_selected");
            }
            else if (county === "Fejér") {
                $('#fejer').appendTo('#magyarorszag-compressed');
                $("#fejer").attr("class", "county_svg county_selected");
            }
            else if (county === "Somogy") {
                $('#somogy').appendTo('#magyarorszag-compressed');
                $("#somogy").attr("class", "county_svg county_selected");
            }
            else if (county === "Bács-Kiskun") {
                $('#bacs').appendTo('#magyarorszag-compressed');
                $("#bacs").attr("class", "county_svg county_selected");
            }
            else if (county === "Csongrád") {
                $('#csongrad').appendTo('#magyarorszag-compressed');
                $("#csongrad").attr("class", "county_svg county_selected");
            }
            else if (county === "Békés") {
                $('#bekes').appendTo('#magyarorszag-compressed');
                $("#bekes").attr("class", "county_svg county_selected");
            }
            else if (county === "Jász-Nagykun-Szolnok") {
                $('#jasz').appendTo('#magyarorszag-compressed');
                $("#jasz").attr("class", "county_svg county_selected");
            }
            else if (county === "Heves") {
                $('#heves').appendTo('#magyarorszag-compressed');
                $("#heves").attr("class", "county_svg county_selected");
            }
            else if (county === "Borsod-Abaúj-Zemplén") {
                $('#borsod').appendTo('#magyarorszag-compressed');
                $("#borsod").attr("class", "county_svg county_selected");
            }
            else if (county === "Szabolcs-Szatmár-Bereg") {
                $('#szabolcs').appendTo('#magyarorszag-compressed');
                $("#szabolcs").attr("class", "county_svg county_selected");
            }
            else if (county === "Hajdú-Bihar") {
                $('#hajdu').appendTo('#magyarorszag-compressed');
                $("#hajdu").attr("class", "county_svg county_selected");
            }
            $('#city_added').remove();
            var width = 245;
            var height = 173;
            var projection = d3.geo.mercator()
                                .scale(8347.55)
                                .precision(.2)
                                .translate([-2340, 8125]);

            var path = d3.geo.path()
                .projection(projection);

            d3.select('#magyarorszag-compressed').append("path")
                .datum(coords)
                .attr("d", path)
                .attr("id","city_added");

            renderAreaChart(JSON.parse(JSON.stringify(population)), "#FFFFFF");
            $('.city_population').html(parseInt(population.slice(-1)[0]['value']).format(0, 3, ' ').toString() + " fő")
            $('.sk-cube-grid').hide();
            $('#close_overlay').show();
            $('.left_container').show();
            $('.middle_container').show();
            //$('#playchart').show();
        },
        error: function() {
        },
        complete: function() {

            var chart = $('#playchart').clone();
            var description = $('.leaflet-top.leaflet-right').children('.info').clone();
            $("#playchart").remove();
            $('.chart').hide();
            $('.leaflet-top.leaflet-right').hide();
            $(".description_container").html(description);
            $(".barchart_container").html(chart);
            $('.right_container').show();


            $( ".tutorial_button" ).effect( "shake", {times: 3, distance: 5}, 300);
            if ($('#detailed_overlay').is(':visible')) {
                //var chart = $('#playchart').clone();
                //$("#playchart").remove();
                //$('.chart').hide();
                //$(".right_container").html(chart);
                info.update(markersById[cityToFind]['feature']['properties']);
            }
        }
    });
}

//PIECHART START
function renderPie (dataToRender) {
    $('#pie_container').empty()

    var responsiveWidth = $('#pie_container').width();
    var responsiveHeight = $('#pie_container').height();

    /*var width = 325,
        height = 220,
        radius = Math.min(width, height) / 2;*/

    var width = responsiveWidth / 2,
        height = responsiveHeight - 30,
        radius = Math.min(width, height) / 2;

    var svg = d3.select("#pie_container")
       .append("svg")
       .attr("class", "donut")
       .append("g");

    svg.append("g")
        .attr("class", "slices");

    svg.append("g")
        .attr("class", "labels");

    svg.append("g")
        .attr("class", "lines");

    svg.attr("transform", "translate(" + width  + "," + height / 2  + ")");

    var pie = d3.layout.pie()
        .sort(null)
        .value(function(d) {
            return d.value;
        });

    var arc = d3.svg.arc()
        .outerRadius(radius * 0.8)
        .innerRadius(radius * 0.4);

    var outerArc = d3.svg.arc()
        .innerRadius(radius * 0.9)
        .outerRadius(radius * 0.9);

    var defs = svg.append("defs");

    //DROP SHADOW START
    var filter = defs.append("filter")
        .attr("id", "dropShadowPie")
        .attr("height", "200%")
        .attr("width", "200%");

    filter.append("feGaussianBlur")
        .attr("in", "SourceAlpha")
        .attr("stdDeviation", 5)
        .attr("result", "blur");

    filter.append("feOffset")
        .attr("in", "blur")
        .attr("dx", 5)
        .attr("dy", 5)
        .attr("result", "offsetBlur");

    var feMerge = filter.append("feMerge");

    feMerge.append("feMergeNode")
        .attr("in", "offsetBlur")

    feMerge.append("feMergeNode")
        .attr("in", "SourceGraphic");

    //INSET SHADOW START
    var filter2 = defs.append("filter")
        .attr("id", "inset-shadow")
        .attr("x", "-50%") //new
        .attr("y", "-50%") //new
        .attr("width", "200%") //new
        .attr("height", "200%") //new
        .attr("filterUnits", "objectBoundingBox"); //new

    filter2.append("feOffset")
        .attr("dx", "5")
        .attr("dy", "5");

    filter2.append("feGaussianBlur")
        .attr("stdDeviation", "3")
        .attr("result", "offset-blur");

    filter2.append("feComposite")
        .attr("operator", "out")
        .attr("in", "SourceGraphic")
        .attr("in2", "offset-blur")
        .attr("result", "inverse");

    filter2.append("feFlood")
        .attr("flood-color", "black")
        .attr("flood-opacity", "0.9")
        .attr("result", "color");

    filter2.append("feComposite")
        .attr("operator", "in")
        .attr("in", "color")
        .attr("in2", "inverse")
        .attr("result", "shadow");

    var feComponentTransfer = filter2.append("feComponentTransfer").attr("in", "shadow").attr("result", "shadow");

    feComponentTransfer.append("feUncA")
        .attr("type", "linear")
        .attr("slope", "0.75");

    filter2.append("feComposite")
        .attr("operator", "over")
        .attr("in", "shadow")
        .attr("in2", "SourceGraphic");

    var key = function(d){ return d.data.label; };

    function explode(d, index) {
        var offset = 16;
        var angle = (d.startAngle + d.endAngle) / 2;
        var xOff = Math.sin(angle) * offset;
        var yOff = -Math.cos(angle) * offset;
        return 'translate(' + xOff + ',' + yOff +')';
    }

    function explodeHalf(d, index) {
        var offset = 8;
        var angle = (d.startAngle + d.endAngle) / 2;
        var xOff = Math.sin(angle) * offset;
        var yOff = -Math.cos(angle) * offset;
        return 'translate(' + xOff + ',' + yOff +')';
    }

    var color = d3.scale.ordinal()
       .range(['#f34235', '#e81d62', '#9b26af', '#6639b6', '#3e50b4', '#2095f2', '#0294ff', '#00bbd3', '#009599', '#4bae4f', '#8ac249', '#ccff38', '#feea3a', '#fec006', '#fe9700', '#fe5621', '#9d9d9d', '#5f7c8a']);

    dataToRender.forEach(function(d) {
        label = d.label;
        value = +d.value;
    });

    change(dataToRender);

    function change(data) {
        var tots = d3.sum(data, function(d) {
            return d.value;
        });

        /* ------- PIE SLICES -------*/
        var slice = svg.select(".slices").selectAll("path.slice")
            .data(pie(data));

        slice.enter()
            .insert("path")
            .style("fill", function(d) { return color(d.data.label); })
            .style("stroke", '#333')
            .style("stroke-width", '0.5')
            .style("stroke-opacity", '0.7')
            .attr("class", "slice can_click")
            .attr("data-fill", function(d) { return color(d.data.label); })
            .attr("data-uid", function(d) { return d.data.label; })
            .attr("data-value", function(d) { return d.value; })
            .attr("data-perc", function(d) {return (d.value / tots); })
            .on("click", function(d){
                var clickTarget = $(this).attr('data-uid');
                if (overlayState === clickTarget) {
                    //detailsResetHighlight();
                    d3.select(this)
                        .style('opacity', '1')
                        .transition()
                        .duration(100)
                        .attr("transform", explode)
                        .style("filter", "url(#dropShadowPie)");

                    overlayState = "plain";
                }
                else if (overlayState === "plain") {
                    pieSelected = parseInt($(this).attr('data-value'));
                    overlayState = $(this).attr('data-uid');

                    $('.slice').each(function() {
                        $(this).attr('class', 'slice');
                    });

                    $(this).attr('class', 'slice can_click');
                    d3.select(this)
                        .attr("transform", explodeHalf)
                        .style("filter", "url(#inset-shadow)");

                    if (hoverState === "off") {
                        colorArea = d3.select(this).attr("data-fill");
                        metricPie = $(this).attr('data-uid');
                        percentage = $(this).attr('data-perc');
                        detailsHighlight ();

                        d3.select(this)
                            .attr("transform", explodeHalf)
                            .style('opacity', '1')
                            .style("filter", "url(#inset-shadow)");
                    }
                }
                //renderRankChart (JSON.parse(JSON.stringify(ranking2[overlayState])));
                //$('#rankheader_category').text(overlayState);
            })
            .on("mouseover", function(d) {
                if (overlayState === "plain") {
                    hoverState = "on";


                    colorArea = d3.select(this).attr("data-fill");
                    metricPie = $(this).attr('data-uid');
                    percentage = $(this).attr('data-perc');
                    if (metric === "DONATION") {
                        $('.city_country_pos').text(JSON.parse(JSON.stringify(ranking_country[metricPie][0])));
                        $('.city_county_pos').text(JSON.parse(JSON.stringify(ranking_country[metricPie][1])));
                        var value = parseFloat($(this).attr('data-value'))/9;
                        $('.info_ammount.original_info').text((value.format(0, 3, " ")).toString() + " millió Ft");
                    }
                    else if (metric === "CAPITA") {
                        $('.city_country_pos').text(JSON.parse(JSON.stringify(ranking_country[metricPie][3])));
                        $('.city_county_pos').text(JSON.parse(JSON.stringify(ranking_country[metricPie][2])));
                        var value = ((parseFloat($(this).attr('data-value'))*1000000)/9)/population.slice(-1)[0]['value'];
                        //$('.info_ammount.original_info').text(((((detailedSum*1000000)/9)/population.slice(-1)[0]['value'])).format(0, 3, " ").toString() + " Ft");
                        $('.info_ammount.original_info').text((value.format(0, 3, " ")).toString() + " Ft");
                    }
                    else if (metric === "DEVIATION_2007") {
                        $('.city_country_pos').text(JSON.parse(JSON.stringify(ranking_country[metricPie][3])));
                        $('.city_county_pos').text(JSON.parse(JSON.stringify(ranking_country[metricPie][2])));
                        var value = deviation_sum[metricPie]["2007"]
                        //$('.info_ammount.original_info').text(((((detailedSum*1000000)/9)/population.slice(-1)[0]['value'])).format(0, 3, " ").toString() + " Ft");
                        $('.info_ammount.original_info').text((value.format(0, 3, " ")).toString() + " %");
                    }
                    else if (metric === "DEVIATION_2010") {
                        $('.city_country_pos').text(JSON.parse(JSON.stringify(ranking_country[metricPie][3])));
                        $('.city_county_pos').text(JSON.parse(JSON.stringify(ranking_country[metricPie][2])));
                        var value = deviation_sum[metricPie]["2010"]
                        //$('.info_ammount.original_info').text(((((detailedSum*1000000)/9)/population.slice(-1)[0]['value'])).format(0, 3, " ").toString() + " Ft");
                        $('.info_ammount.original_info').text((value.format(0, 3, " ")).toString() + " %");
                    }
                    else if (metric === "DEVIATION_2014") {
                        $('.city_country_pos').text(JSON.parse(JSON.stringify(ranking_country[metricPie][3])));
                        $('.city_county_pos').text(JSON.parse(JSON.stringify(ranking_country[metricPie][2])));
                        var value = deviation_sum[metricPie]["2014"]
                        //$('.info_ammount.original_info').text(((((detailedSum*1000000)/9)/population.slice(-1)[0]['value'])).format(0, 3, " ").toString() + " Ft");
                        $('.info_ammount.original_info').text((value.format(0, 3, " ")).toString() + " %");
                    }
                    detailsHighlight();

                    d3.select(this)
                        .transition()
                        .delay(100)
                        .duration(100)
                        .ease('sin')
                        .attr("transform", explode)
                        .style('opacity', '1')
                        .style("filter", "url(#dropShadowPie)");
                }
            })
            .on("mouseout", function(d) {
                if (overlayState === "plain") {
                    hoverState = "off";
                    $('#area_legend').hide();
                    $('.source').removeClass('source_capita');
                    detailsResetHighlight ();
                    if (metric === "DONATION") {
                        $('.info_ammount.original_info').text((detailedSum/9).format(0, 3, " ").toString() + " millió Ft");
                    }
                    else if (metric === "CAPITA") {
                        $('.info_ammount.original_info').text(((((detailedSum*1000000)/9)/population.slice(-1)[0]['value'])).format(0, 3, " ").toString() + " Ft");
                    }
                    else if (metric === "DEVIATION_2007") {
                        var value = parseInt(deviation_sum['Summa']["2007"])
                        $('.info_ammount.original_info').text((value.format(0, 3, " ")).toString() + " %");
                    }
                    else if (metric === "DEVIATION_2010") {
                        var value = parseInt(deviation_sum['Summa']["2010"])
                        $('.info_ammount.original_info').text((value.format(0, 3, " ")).toString() + " %");
                    }
                    else if (metric === "DEVIATION_2014") {
                        var value = parseInt(deviation_sum['Summa']["2014"])
                        $('.info_ammount.original_info').text((value.format(0, 3, " ")).toString() + " %");
                    }
                    if (ranking_country) {
                        if (metric === "DONATION") {
                            $('.city_country_pos').text(JSON.parse(JSON.stringify(ranking_country['Summa'][0])));
                            $('.city_county_pos').text(JSON.parse(JSON.stringify(ranking_country['Summa'][1])));
                        }
                        else if (metric === "CAPITA") {
                            $('.city_country_pos').text(JSON.parse(JSON.stringify(ranking_country['Summa'][3])));
                            $('.city_county_pos').text(JSON.parse(JSON.stringify(ranking_country['Summa'][2])));
                        }
                        else {
                            $('.city_country_pos').text(JSON.parse(JSON.stringify(ranking_country['Summa'][3])));
                            $('.city_county_pos').text(JSON.parse(JSON.stringify(ranking_country['Summa'][2])));
                        }
                    }
                    else {
                        $('.city_country_pos').text("Nem kapott támogatást");
                        $('.city_county_pos').text("Nem kapott támogatást");
                    }

                    d3.select(this)
                        .style('opacity', '1')
                        .transition()
                        .duration(100)
                        .attr("transform", "translate(0,0)")
                        .style("filter", "");
                }
            });

        slice
            .transition().duration(1000)
            .attrTween("d", function(d) {
                this._current = this._current || d;
                var interpolate = d3.interpolate(this._current, d);
                this._current = interpolate(0);
                return function(t) {
                    return arc(interpolate(t));
                };
            })

        slice.exit()
            .remove();

        /* ------- TEXT LABELS -------*/
        var text = svg.select(".labels").selectAll("text")
            .data(pie(data), key);

        function opacityChoose(percentage, opacityfull) {
            if (percentage <= 0.03) {
                return "0";
            }
            else {
                return opacityfull;
            }
        }

        function visibilityChoose(percentage) {
            if (percentage <= 0.03) {
                return "hidden";
            }
            else {
                return "visible";
            }
        }

        text.enter().append("text")
            .attr("dy", ".35em")
            .attr("class", "label")
            .attr("data-uid", function(d) { return d.data.label; })
            .attr("data-perc", function(d) {return (d.value / tots); })
            .attr("data-visibility", function(d) {return visibilityChoose(d.value / tots); })
            .text(function(d) {
                return d.data.label;
            })
            .style('opacity', function(d) {return opacityChoose(d.value / tots, "1"); });

        function midAngle(d){
            return d.startAngle + (d.endAngle - d.startAngle)/2;
        }

        text.transition().duration(1000)
            .attrTween("transform", function(d) {
                this._current = this._current || d;
                var interpolate = d3.interpolate(this._current, d);
                this._current = interpolate(0);
                return function(t) {
                    var d2 = interpolate(t);
                    var pos = outerArc.centroid(d2);
                    pos[0] = radius * (midAngle(d2) < Math.PI ? 1 : -1);
                    return "translate("+ pos +")";
                };
            })
            .styleTween("text-anchor", function(d){
                this._current = this._current || d;
                var interpolate = d3.interpolate(this._current, d);
                this._current = interpolate(0);
                return function(t) {
                    var d2 = interpolate(t);
                    return midAngle(d2) < Math.PI ? "start":"end";
                };
            });

        text.exit()
            .remove();

        /* ------- SLICE TO TEXT POLYLINES -------*/
        var polyline = svg.select(".lines").selectAll("polyline")
            .data(pie(data), key);

        polyline.enter()
            .append("polyline")
            .attr("class", "arrow")
            .attr("data-uid", function(d) { return d.data.label; })
            .attr("data-perc", function(d) {return (d.value / tots); })
            .attr("data-visibility", function(d) {return visibilityChoose(d.value / tots); })
            .style('opacity', function(d) {return opacityChoose(d.value / tots, "0.3"); });

        polyline.transition().duration(1000)
            .attrTween("points", function(d){
                this._current = this._current || d;
                var interpolate = d3.interpolate(this._current, d);
                this._current = interpolate(0);
                return function(t) {
                    var d2 = interpolate(t);
                    var pos = outerArc.centroid(d2);
                    pos[0] = radius * 0.95 * (midAngle(d2) < Math.PI ? 1 : -1);
                    return [arc.centroid(d2), outerArc.centroid(d2), pos];
                };
            });

        polyline.exit()
            .remove();
    };
}

//AREA CHART START
function renderAreaChart(data, colorcode) {
    $('.areachart1').remove();

    var responsiveHeight = $('.areachart_wrapper').height();
    var responsiveWidth = $('.areachart_wrapper').width();

    var margin = {top: 20, right: 20, bottom: 20, left: 70},
        width = responsiveWidth - margin.left - margin.right,
        height = (responsiveHeight -60) - margin.top - margin.bottom;

    var parseDate = d3.time.format("%Y").parse;

    var x = d3.time.scale()
        .range([0, width]);

    var y = d3.scale.linear()
        .range([height, 0]);

    var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom");

    var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left")
        .ticks(5)
        .tickFormat(d3.format(','));

    var area = d3.svg.area()
        .x(function(d) { return x(d.date); })
        .y0(height)
        .y1(function(d) { return y(d.close); });

    var areaZero = d3.svg.area()
        .x(function(d) { return x(d.date); })
        .y0(height)
        .y1(function(d) { return y(0); });

    var svg = d3.select("#areachart").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .attr("class", "areachart1")
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    data.forEach(function(d) {
            //d.date = d.date;
            d.date = parseDate(d.date);
            d.close = +d.value;
    });

    x.domain(d3.extent(data, function(d) { return d.date; }));
    //y.domain([0, d3.max(data, function(d) { return d.close; })]);
    y.domain([d3.min(data, function(d) { return d.close; })*0.9, d3.max(data, function(d) { return d.close; })]);

    function make_y_axis() {
        return d3.svg.axis()
            .scale(y)
            .orient("left")
            .ticks(5)
    }

    svg.append("g")
        .attr("class", "grid")
        .call(make_y_axis()
            .tickSize(-width, 0, 0)
            .tickFormat("")
        );

    svg.append("path")
        .datum(data)
        .attr("class", "area")
        .attr("d", areaZero)
        .transition()
        .duration(10)
        .attr("d", area)
        .style("fill", colorcode)
        .style("stroke", "#333333")
        .style("stroke-width", "1px");

    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis)
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".71em")
        .style("text-anchor", "end");

    var bisectDate = d3.bisector(function(d) { return d.date; }).left;

    var focus = svg.append("g")
        .attr("class", "focus")
        .style("display", "none");

    focus.append("rect")
        .attr("class","lineHor")
        .style("width", "1px")
        .style("fill", "rgba(0,0,0,0)")
        .style("stroke-width", "0.5px")
        .style("stroke", "#FFFFFF")
        .style("stroke-dasharray", "3 3")
        .style("opacity", "0.5");

    focus.append("rect")
        .attr("class","lineVer")
        .style("height", "1px")
        .style("stroke-width", "0.5px")
        .style("stroke", "#FFFFFF")
        .style("fill", "rgba(0,0,0,0)")
        .style("stroke-dasharray", "3 3")
        .style("opacity", "0.5");

    focus.append("circle")
        //.attr("r", 4.5);
        .attr("r", 7);

    focus.append("rect")
        .attr("class", "area_tooltip_bg")
        .attr("x", 14)
        .attr("y", -10)
        .attr("rx", "5")
        .attr("ry", "5")
        .attr("height", "20px")
        .style("fill", "rgba(0,0,0,0.6")
        .style("stroke", "#333333")
        .style("stroke-width", "1px");

    focus.append("text")
        .attr("class", "area_tooltip")
        .attr("x", 19)
        .attr("dy", ".35em");

    svg.append("rect")
        .attr("class", "overlay")
        .attr("width", width)
        .attr("height", height)
        .on("mouseover", function() { focus.style("display", null); })
        .on("mouseout", function() { focus.style("display", "none"); })
        .on("mousemove", mousemove);

    function mousemove() {
        var x0 = x.invert(d3.mouse(this)[0]),
            i = bisectDate(data, x0, 1),
            d0 = data[i - 1],
            d1 = data[i],
            d = x0 - d0.date > d1.date - x0 ? d1 : d0;

        focus.attr("transform", "translate(" + x(d.date) + "," + y(d.close) + ")");
        focus.select("text").html(d.close.format(0, 3, ' ').toString() +" " + $('#areametric').text());
        var width = $(".area_tooltip")[0].getBBox().width;
        focus.select(".area_tooltip_bg").attr("width", width+10);
        focus.select(".lineHor").attr('height', (181- y(d.close)));
        focus.select(".lineVer").attr('width', x(d.date)+1);
        focus.select(".lineVer").attr("transform", "translate(" + (x(d.date)+1)*-1 + ", 0)");
        if (x(d.date)/560 >= 0.8) {
            focus.select("text").attr("transform", "translate(" + ((width*-1)-40) + ", 0)");
            focus.select(".area_tooltip_bg").attr("transform", "translate(" + ((width*-1)-38) + ", 0)");
        }
        else {
            focus.select("text").attr("transform", "translate(0, 0)");
            focus.select(".area_tooltip_bg").attr("transform", "translate(0, 0)");
        }
    }
}

function renderAreaChartCapita(data, data2, data3, colorcode) {
    $('.areachart1').remove();

    var responsiveHeight = $('.areachart_wrapper').height();
    var responsiveWidth = $('.areachart_wrapper').width();

    var margin = {top: 20, right: 20, bottom: 20, left: 70},
        width = responsiveWidth - margin.left - margin.right,
        height = (responsiveHeight-80) - margin.top - margin.bottom;

    var parseDate = d3.time.format("%Y").parse;

    var x = d3.time.scale()
        .range([0, width]);

    var y = d3.scale.linear()
        .range([height, 0]);

    var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom");

    var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left")
        .ticks(5)
        .tickFormat(d3.format(".4f"));
        //.tickFormat(d3.format(','));

    var area = d3.svg.area()
        .x(function(d) { return x(d.date); })
        .y0(height)
        .y1(function(d) { return y(d.close); });

    var areaZero = d3.svg.area()
        .x(function(d) { return x(d.date); })
        .y0(height)
        .y1(function(d) { return y(0); });

    var line = d3.svg.line()
        .x(function(d) { return x(d.date); })
        .y(function(d) { return y(d.close); });

    var svg = d3.select("#areachart").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .attr("class", "areachart1")
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    data.forEach(function(d) {
        //d.date = d.date;
        d.date = parseDate(d.date);
        d.close = +d.value / parseInt(population.slice(-1)[0]['value']);
    });

    data2.forEach(function(d) {
        //d.date = d.date;
        d.date = parseDate(d.date);
        d.close = +d.value / parseInt(population_country.slice(-1)[0]['value']);
    });

    data3.forEach(function(d) {
        //d.date = d.date;
        d.date = parseDate(d.date);
        d.close = +d.value / parseInt(population_county.slice(-1)[0]['value']);
    });

    var minData = d3.min(data, function(d) { return d.close; });
    var minData2 = d3.min(data2, function(d) { return d.close; });
    var minData3 = d3.min(data3, function(d) { return d.close; });
    var minData_final = Math.min.apply(Math,[minData, minData2, minData3]);

    var maxData = d3.max(data, function(d) { return d.close; });
    var maxData2 = d3.max(data2, function(d) { return d.close; });
    var maxData3 = d3.max(data3, function(d) { return d.close; });
    var maxData_final = Math.max.apply(Math,[maxData, maxData2, maxData3]);


    x.domain(d3.extent(data, function(d) { return d.date; }));
    //y.domain([0, d3.max(data, function(d) { return d.close; })]);
    y.domain([(minData_final)*0.9, maxData_final]);

    function make_y_axis() {
        return d3.svg.axis()
            .scale(y)
            .orient("left")
            .ticks(5)
    }

    svg.append("g")
        .attr("class", "grid")
        .call(make_y_axis()
            .tickSize(-width, 0, 0)
            .tickFormat("")
        );

    svg.append("path")
        .datum(data2)
        .attr("class", "area_cap country")
        .attr("d", area)
        .style("stroke", "#FFFFFF")
        .style("fill", "#FFFFFF")
        .style("stroke-width", "1px");

    svg.append("path")
        .datum(data3)
        .attr("class", "area_cap county")
        .attr("d", area)
        .style("stroke", "#91BED4")
        .style("fill", "#91BED4")
        .style("stroke-width", "1px");

    /*svg.append("path")
        .datum(data)
        .attr("class", "area")
        .attr("d", areaZero)
        .transition()
        .duration(10)
        .attr("d", area)
        .style("fill", colorcode)
        .style("stroke", "#333333")
        .style("stroke-width", "1px");*/

    svg.append("path")
        .datum(data)
        .attr("class", "line")
        .attr("d", line)
        .style("stroke", colorcode)
        .style("stroke-width", "2px");

    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis)
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".71em")
        .style("text-anchor", "end");

    var bisectDate = d3.bisector(function(d) { return d.date; }).left;

    var focus = svg.append("g")
        .attr("class", "focus")
        .style("display", "none");

    focus.append("rect")
        .attr("class","lineHor")
        .style("width", "1px")
        .style("fill", "rgba(0,0,0,0)")
        .style("stroke-width", "0.5px")
        .style("stroke", "#FFFFFF")
        .style("stroke-dasharray", "3 3")
        .style("opacity", "0.5");

    focus.append("rect")
        .attr("class","lineVer")
        .style("height", "1px")
        .style("stroke-width", "0.5px")
        .style("stroke", "#FFFFFF")
        .style("fill", "rgba(0,0,0,0)")
        .style("stroke-dasharray", "3 3")
        .style("opacity", "0.5");

    focus.append("circle")
        //.attr("r", 4.5);
        .attr("r", 7);

    focus.append("rect")
        .attr("class", "area_tooltip_bg")
        .attr("x", 14)
        .attr("y", -10)
        .attr("rx", "5")
        .attr("ry", "5")
        .attr("height", "20px")
        .style("fill", "rgba(0,0,0,0.6")
        .style("stroke", "#333333")
        .style("stroke-width", "1px");


    focus.append("text")
        .attr("class", "area_tooltip")
        .attr("x", 19)
        .attr("dy", ".35em");

    svg.append("rect")
        .attr("class", "overlay")
        .attr("width", width)
        .attr("height", height)
        .on("mouseover", function() { focus.style("display", null); })
        .on("mouseout", function() { focus.style("display", "none"); })
        .on("mousemove", mousemove);

    function mousemove() {
        var x0 = x.invert(d3.mouse(this)[0]),
            i = bisectDate(data, x0, 1),
            d0 = data[i - 1],
            d1 = data[i],
            d = x0 - d0.date > d1.date - x0 ? d1 : d0;

        var e = bisectDate(data2, x0, 1),
            f0 = data2[e - 1],
            f1 = data2[e],
            g = x0 - f0.date > f1.date - x0 ? f1 : f0;

        var h = bisectDate(data3, x0, 1),
            j0 = data3[h - 1],
            j1 = data3[h],
            k = x0 - j0.date > j1.date - x0 ? j1 : j0;

        focus.attr("transform", "translate(" + x(d.date) + "," + y(d.close) + ")");
        //focus.select("text").html(d.close.format(0, 3, ' ').toString() +" " + $('#areametric').text());
        focus.select("text").html('<tspan>'+d.close.toFixed(4).toString()+' '+ $('#areametric').text()+'</tspan>');
        var width = $(".area_tooltip")[0].getBBox().width;
        focus.select(".area_tooltip_bg").attr("width", width+10);
        focus.select(".lineHor").attr('height', (181- y(d.close)));
        focus.select(".lineVer").attr('width', x(d.date)+1);
        focus.select(".lineVer").attr("transform", "translate(" + (x(d.date)+1)*-1 + ", 0)");
        if (x(d.date)/560 >= 0.8) {
            focus.select("text").attr("transform", "translate(" + ((width*-1)-40) + ", 0)");
            focus.select(".area_tooltip_bg").attr("transform", "translate(" + ((width*-1)-38) + ", 0)");
        }
        else {
            focus.select("text").attr("transform", "translate(0, 0)");
            focus.select(".area_tooltip_bg").attr("transform", "translate(0, 0)");
        }
    }
}

function tabulate(data, columns) {

    var table = d3.select(".table_wrapper").append("table")
        .attr("style", "margin-left: 25px; margin-top: 19px"),

        thead = table.append("thead"),
        tbody = table.append("tbody");

    // append the header row
    /*thead.append("tr")
        .selectAll("th")
        .data(columns)
        .enter()
        .append("th")
            .text(function(column) { return column; });*/

    // create a row for each object in the data
    var rows = tbody.selectAll("tr")
        .data(data)
        .enter()
        .append("tr");

    var counterRow = 0;

    // create a cell in each row for each column
    var cells = rows.selectAll("td")
        .data(function(row) {
            counterRow += 1
            return columns.map(function(column) {
                if (column == "rank") {
                    //return {column: column, value: row[column] +"." };
                    return {column: column, value: counterRow.toString() +"." };
                }
                else {
                    return {column: column, value: row[column] };
                }
            });
        })
        .enter()
        .append("td")
        .attr('class', 'cellright')
        .attr('id', function(d) { return d.value; })
        .html(function(d) { return d.value; });

    return table;
}

function renderRankChart (data) {

    $(".chart_wrapper").empty();
    $(".table_wrapper").empty();
    if (metric === "DONATION") {
        data.forEach(function(d) {
            //d.value = +d.capita*1000000/9;
            d.value = +d.value/9;
            d.name = d.name;
        });
    }
    else if (metric === "CAPITA") {
        data.forEach(function(d) {
            //d.value = +d.capita*1000000/9;
            d.value = +d.capita/9;
            d.name = d.name;
        });
    }
    else {
        data.forEach(function(d) {
            if (overlayState === "plain") {
                d.value = +((d.capita/9) / categories['Summa'])*100;
            }
            else {
                d.value = +((d.capita/9) / categories[metricPie])*100;
            }
            d.name = d.name;
        });
    }

    data.sort(function(a, b) {
        return b.value - a.value;
    });

    var m = [30, 180, 10, 4],
        w = 840 - m[1] - m[3],
        //h = (((data.length))*15) - m[0] - m[2];
        h = (((data.length))*30)
    var format = d3.format(",.0f");

    var x = d3.scale.linear().range([0, w]),
        y = d3.scale.ordinal().rangeRoundBands([0, h], 0.2, 0);

    var xAxis = d3.svg.axis().scale(x).orient("top").tickSize(-h).ticks(5),
        yAxis = d3.svg.axis().scale(y).orient("left").tickSize(0);

    var svg = d3.select(".chart_wrapper").append("svg")
        .attr("width", w + m[1] + m[3])
        .attr("height", h + m[0] + m[2])
        .attr('class', 'rankChart')
        .append("g")
        .attr("transform", "translate(" + m[3] + "," + m[0] + ")");

    // Set the scale domain.
    x.domain([0, d3.max(data, function(d) { return d.value; })]);
    y.domain(data.map(function(d) {
        return d.name;
    }));

    svg.append("g")
        .attr("class", "x axis ranking")
        .call(xAxis);

    svg.select(".domain").attr("transform", "scale(1,0)");

    svg.append("g")
        .attr("class", "y axis")
        .attr("transform", "translate(-1, 0)")
        .call(yAxis)
        .selectAll("text").remove();

    var bar = svg.selectAll("g.rankBar")
        .data(data)
        .enter().append("g")
        .attr("class", "rankBar")
        .attr("data-uid", function(d) { return d.name; })
        .attr("transform", function(d) { return "translate(0," + y(d.name) + ")"; });

    bar.append("rect")
        .attr("class", "rankBarRect")
        .attr("width", function(d) { return x(d.value); })
        .attr("height", y.rangeBand());

    bar.append("text")
        .attr("class", "rankingText")
        .attr("data-uid", function(d) { return d.name; })
        .attr("x", function(d) { return x(d.value); })
        .attr("y", y.rangeBand() / 2)
        .attr("text-anchor", "right")
        .attr("startOffset", "100%")
        .attr("dx", 10)
        .attr("dy", ".35em")
        .style("fill", '#FFFFFF')
        .text(function(d) {
            if (metric === "DONATION") {
                return format(d.value) + " millió Ft";
            }
            else if (metric === "CAPITA") {
                return format(d.value) + " Ft";
            }
            else {
                return format(d.value) + " %";
            }
        });

        tabulate(data, ["rank", "name"]);

}

//renderRankChart (JSON.parse(JSON.stringify(ranking2["Vállalkozásfejlesztés"])));

//HIGHLIGHT ON MOUSEOVER ON DETAILED VIEW
function detailsHighlight () {
    $('#percentage').text((percentage*100).toFixed(2).toString()+"%");
    $('.slice').each(function() {
        $(this).css('opacity', '0.2');
    });

    $('.label').each(function() {
        if ($(this).attr("data-visibility") === "visible") {
            $(this).css('opacity', '0.1');
        }
        else {
            $(this).css('opacity', '0');
        }
    });

    $('.arrow').each(function() {
        if ($(this).attr("data-visibility") === "visible") {
            $(this).css('opacity', '0.1');
        }
        else {
            $(this).css('opacity', '0');
        }
    });

    $('[data-uid="'+metricPie+'"]').each(function() {
        $(this).css('opacity', '1');
    });

    $('.city_legend').html(cityToFind + "<br>statisztikája");

    if (metricPie === "Közlekedés, úthálózat") {
        defaultChart = "custom";
        if (metric === "DONATION") {
            renderAreaChart(JSON.parse(JSON.stringify(road)), colorArea);
            $('.areaheader').html("Kiépített út és köztér hossza (<span id='areametric'>km</span>)");
            $('#area_legend').hide();
            $('.source').removeClass('source_capita');
            $('.playchart_1').remove();
            render_chart("1", JSON.parse(JSON.stringify(timeSeries_detailed[metricPie])));
        }
        else if (metric === "CAPITA") {
            renderAreaChartCapita(JSON.parse(JSON.stringify(road)), JSON.parse(JSON.stringify(road_country)), JSON.parse(JSON.stringify(road_county)), colorArea);
            $('.areaheader').html("Kiépített út és köztér hossza (<span id='areametric'>km / lakos</span>)");
            $('.city_icon_stripe').css('background-color', colorArea);
            $('#area_legend').show();
            $('.source').addClass('source_capita');
            $('.playchart_1').remove();
            render_chart("1", JSON.parse(JSON.stringify(timeSeries_detailed[metricPie])));
        }
        else {
            renderAreaChartCapita(JSON.parse(JSON.stringify(road)), JSON.parse(JSON.stringify(road_country)), JSON.parse(JSON.stringify(road_county)), colorArea);
            $('.areaheader').html("Kiépített út és köztér hossza (<span id='areametric'>km / lakos</span>)");
            $('.city_icon_stripe').css('background-color', colorArea);
            $('#area_legend').show();
            $('.source').addClass('source_capita');
            $('.playchart_1').remove();
            render_chart2("1", JSON.parse(JSON.stringify(deviation[metricPie])));
        }
    }
    else if (metricPie === "Turizmus és vidékfejlesztés") {
        defaultChart = "custom";
        if (metric === "DONATION") {
            renderAreaChart(JSON.parse(JSON.stringify(tourism)), colorArea);
            $('.areaheader').html("Vendégéjszakák száma a kereskedelmi szálláshelyeken (<span id='areametric'>db</span>)");
            $('#area_legend').hide();
            $('.source').removeClass('source_capita');
            $('.playchart_1').remove();
            render_chart("1", JSON.parse(JSON.stringify(timeSeries_detailed[metricPie])));
        }
        else if (metric === "CAPITA") {
            renderAreaChartCapita(JSON.parse(JSON.stringify(tourism)), JSON.parse(JSON.stringify(tourism_country)), JSON.parse(JSON.stringify(tourism_county)), colorArea);
            $('.areaheader').html("Vendégéjszakák száma a kereskedelmi szálláshelyeken (<span id='areametric'>db / lakos</span>)");
            $('.city_icon_stripe').css('background-color', colorArea);
            $('#area_legend').show();
            $('.source').addClass('source_capita');
            $('.playchart_1').remove();
            render_chart("1", JSON.parse(JSON.stringify(timeSeries_detailed[metricPie])));
        }
        else {
            renderAreaChartCapita(JSON.parse(JSON.stringify(tourism)), JSON.parse(JSON.stringify(tourism_country)), JSON.parse(JSON.stringify(tourism_county)), colorArea);
            $('.areaheader').html("Vendégéjszakák száma a kereskedelmi szálláshelyeken (<span id='areametric'>db / lakos</span>)");
            $('.city_icon_stripe').css('background-color', colorArea);
            $('#area_legend').show();
            $('.source').addClass('source_capita');
            $('.playchart_1').remove();
            render_chart2("1", JSON.parse(JSON.stringify(deviation[metricPie])));
        }
    }
    else if (metricPie === "Munkahelyteremtés, foglalkoztatás") {
        defaultChart = "custom";
        if (metric === "DONATION") {
            renderAreaChart(JSON.parse(JSON.stringify(unemployment)), colorArea);
            $('.areaheader').html("Regisztrált munkanélküliek száma összesen (<span id='areametric'>fő</span>)");
            $('#area_legend').hide();
            $('.source').removeClass('source_capita');
            $('.playchart_1').remove();
            render_chart("1", JSON.parse(JSON.stringify(timeSeries_detailed[metricPie])));
        }
        else if (metric === "CAPITA") {
            renderAreaChartCapita(JSON.parse(JSON.stringify(unemployment)), JSON.parse(JSON.stringify(unemployment_country)), JSON.parse(JSON.stringify(unemployment_county)), colorArea);
            $('.areaheader').html("Regisztrált munkanélküliek száma összesen (<span id='areametric'>fő / lakos</span>)");
            $('.city_icon_stripe').css('background-color', colorArea);
            $('#area_legend').show();
            $('.source').addClass('source_capita');
            $('.playchart_1').remove();
            render_chart("1", JSON.parse(JSON.stringify(timeSeries_detailed[metricPie])));
        }
        else {
            renderAreaChartCapita(JSON.parse(JSON.stringify(unemployment)), JSON.parse(JSON.stringify(unemployment_country)), JSON.parse(JSON.stringify(unemployment_county)), colorArea);
            $('.areaheader').html("Regisztrált munkanélküliek száma összesen (<span id='areametric'>fő / lakos</span>)");
            $('.city_icon_stripe').css('background-color', colorArea);
            $('#area_legend').show();
            $('.source').addClass('source_capita');
            $('.playchart_1').remove();
            render_chart2("1", JSON.parse(JSON.stringify(deviation[metricPie])));
        }
    }
    else if (metricPie === "Egészségügy") {
        defaultChart = "custom";
        if (metric === "DONATION") {
            renderAreaChart(JSON.parse(JSON.stringify(health)), colorArea);
            $('.areaheader').html("Háziorvosi ellátásban megjelentek és meglátogatottak száma (<span id='areametric'>eset</span>)");
            $('#area_legend').hide();
            $('.source').removeClass('source_capita');
            $('.playchart_1').remove();
            render_chart("1", JSON.parse(JSON.stringify(timeSeries_detailed[metricPie])));
        }
        else if (metric === "CAPITA") {
            renderAreaChartCapita(JSON.parse(JSON.stringify(health)), JSON.parse(JSON.stringify(health_country)), JSON.parse(JSON.stringify(health_county)), colorArea);
            $('.areaheader').html("Háziorvosi ellátásban megjelentek és meglátogatottak száma (<span id='areametric'>eset / lakos</span>)");
            $('.city_icon_stripe').css('background-color', colorArea);
            $('#area_legend').show();
            $('.source').addClass('source_capita');
            $('.playchart_1').remove();
            render_chart("1", JSON.parse(JSON.stringify(timeSeries_detailed[metricPie])));
        }
        else {
            renderAreaChartCapita(JSON.parse(JSON.stringify(health)), JSON.parse(JSON.stringify(health_country)), JSON.parse(JSON.stringify(health_county)), colorArea);
            $('.areaheader').html("Háziorvosi ellátásban megjelentek és meglátogatottak száma (<span id='areametric'>eset / lakos</span>)");
            $('.city_icon_stripe').css('background-color', colorArea);
            $('#area_legend').show();
            $('.source').addClass('source_capita');
            $('.playchart_1').remove();
            render_chart2("1", JSON.parse(JSON.stringify(deviation[metricPie])));
        }
    }
    else if (metricPie === "Önkormányzati fejlesztések") {
        defaultChart = "custom";
        if (metric === "DONATION") {
            renderAreaChart(JSON.parse(JSON.stringify(government)), colorArea);
            $('.areaheader').html("Önkormányzat rendelkezésére álló források (<span id='areametric'>millió Ft</span>)");
            $('#area_legend').hide();
            $('.source').removeClass('source_capita');
            $('.playchart_1').remove();
            render_chart("1", JSON.parse(JSON.stringify(timeSeries_detailed[metricPie])));
        }
        else if (metric === "CAPITA") {
            renderAreaChartCapita(JSON.parse(JSON.stringify(government)), JSON.parse(JSON.stringify(government_country)), JSON.parse(JSON.stringify(government_county)), colorArea);
            $('.areaheader').html("Önkormányzat rendelkezésére álló források (<span id='areametric'>millió Ft / lakos</span>)");
            $('.city_icon_stripe').css('background-color', colorArea);
            $('#area_legend').show();
            $('.source').addClass('source_capita');
            $('.playchart_1').remove();
            render_chart("1", JSON.parse(JSON.stringify(timeSeries_detailed[metricPie])));
        }
        else {
            renderAreaChartCapita(JSON.parse(JSON.stringify(government)), JSON.parse(JSON.stringify(government_country)), JSON.parse(JSON.stringify(government_county)), colorArea);
            $('.areaheader').html("Önkormányzat rendelkezésére álló források (<span id='areametric'>millió Ft / lakos</span>)");
            $('.city_icon_stripe').css('background-color', colorArea);
            $('#area_legend').show();
            $('.source').addClass('source_capita');
            $('.playchart_1').remove();
            render_chart2("1", JSON.parse(JSON.stringify(deviation[metricPie])));
        }
    }
    else if (metricPie === "Ivóvíz, szennyvíz, csatornázás") {
        defaultChart = "custom";
        if (metric === "DONATION") {
            renderAreaChart(JSON.parse(JSON.stringify(water)), colorArea);
            $('.areaheader').html("Szolgáltatott víz mennyisége (<span id='areametric'>ezer m<sup class='sup_header'>3</sup></span>)");
            $('#area_legend').hide();
            $('.source').removeClass('source_capita');
            $('.playchart_1').remove();
            render_chart("1", JSON.parse(JSON.stringify(timeSeries_detailed[metricPie])));
        }
        else if (metric === "CAPITA") {
            renderAreaChartCapita(JSON.parse(JSON.stringify(water)), JSON.parse(JSON.stringify(water_country)), JSON.parse(JSON.stringify(water_county)), colorArea);
            $('.areaheader').html("Szolgáltatott víz mennyisége (<span id='areametric'>ezer m<sup class='sup_header'>3</sup> / lakos</span>)");
            $('.city_icon_stripe').css('background-color', colorArea);
            $('#area_legend').show();
            $('.source').addClass('source_capita');
            $('.playchart_1').remove();
            render_chart("1", JSON.parse(JSON.stringify(timeSeries_detailed[metricPie])));
        }
        else {
            renderAreaChartCapita(JSON.parse(JSON.stringify(water)), JSON.parse(JSON.stringify(water_country)), JSON.parse(JSON.stringify(water_county)), colorArea);
            $('.areaheader').html("Szolgáltatott víz mennyisége (<span id='areametric'>ezer m<sup class='sup_header'>3</sup> / lakos</span>)");
            $('.city_icon_stripe').css('background-color', colorArea);
            $('#area_legend').show();
            $('.source').addClass('source_capita');
            $('.playchart_1').remove();
            render_chart2("1", JSON.parse(JSON.stringify(deviation[metricPie])));
        }
    }
    else if (metricPie === "Kultúra") {
        defaultChart = "custom";
        if (metric === "DONATION") {
            renderAreaChart(JSON.parse(JSON.stringify(culture)), colorArea);
            $('.areaheader').html("Kulturális rendezvényeken résztvevők száma (<span id='areametric'>fő</span>)");
            $('#area_legend').hide();
            $('.source').removeClass('source_capita');
            $('.playchart_1').remove();
            render_chart("1", JSON.parse(JSON.stringify(timeSeries_detailed[metricPie])));
        }
        else if (metric === "CAPITA") {
            renderAreaChartCapita(JSON.parse(JSON.stringify(culture)), JSON.parse(JSON.stringify(culture_country)), JSON.parse(JSON.stringify(culture_county)), colorArea);
            $('.areaheader').html("Kulturális rendezvényeken résztvevők száma (<span id='areametric'>fő / lakos</span>)");
            $('.city_icon_stripe').css('background-color', colorArea);
            $('#area_legend').show();
            $('.source').addClass('source_capita');
            $('.playchart_1').remove();
            render_chart("1", JSON.parse(JSON.stringify(timeSeries_detailed[metricPie])));
        }
        else {
            renderAreaChartCapita(JSON.parse(JSON.stringify(culture)), JSON.parse(JSON.stringify(culture_country)), JSON.parse(JSON.stringify(culture_county)), colorArea);
            $('.areaheader').html("Kulturális rendezvényeken résztvevők száma (<span id='areametric'>fő / lakos</span>)");
            $('.city_icon_stripe').css('background-color', colorArea);
            $('#area_legend').show();
            $('.source').addClass('source_capita');
            $('.playchart_1').remove();
            render_chart2("1", JSON.parse(JSON.stringify(deviation[metricPie])));
        }
    }
    else if (metricPie === "Vállalkozásfejlesztés") {
        defaultChart = "custom";
        if (metric === "DONATION") {
            renderAreaChart(JSON.parse(JSON.stringify(company)), colorArea);
            $('.areaheader').html("Regisztrált gazdasági szervezetek száma (<span id='areametric'>db</span>)");
            $('#area_legend').hide();
            $('.source').removeClass('source_capita');
            $('.playchart_1').remove();
            render_chart("1", JSON.parse(JSON.stringify(timeSeries_detailed[metricPie])));
        }
        else if (metric === "CAPITA") {
            renderAreaChartCapita(JSON.parse(JSON.stringify(company)), JSON.parse(JSON.stringify(company_country)), JSON.parse(JSON.stringify(company_county)), colorArea);
            $('.areaheader').html("Regisztrált gazdasági szervezetek száma (<span id='areametric'>db / lakos</span>)");
            $('.city_icon_stripe').css('background-color', colorArea);
            $('#area_legend').show();
            $('.source').addClass('source_capita');
            $('.playchart_1').remove();
            render_chart("1", JSON.parse(JSON.stringify(timeSeries_detailed[metricPie])));
        }
        else {
            renderAreaChartCapita(JSON.parse(JSON.stringify(company)), JSON.parse(JSON.stringify(education_country)), JSON.parse(JSON.stringify(education_county)), colorArea);
            $('.areaheader').html("Regisztrált gazdasági szervezetek száma (<span id='areametric'>db / lakos</span>)");
            $('.city_icon_stripe').css('background-color', colorArea);
            $('#area_legend').show();
            $('.source').addClass('source_capita');
            $('.playchart_1').remove();
            render_chart2("1", JSON.parse(JSON.stringify(deviation[metricPie])));
        }
    }
    else if (metricPie === "Szociális támogatások") {
        defaultChart = "custom";
        if (metric === "DONATION") {
            renderAreaChart(JSON.parse(JSON.stringify(aid)), colorArea);
            $('.areaheader').html("Átmeneti segélyre felhasznált összeg (<span id='areametric'>millió Ft</span>)");
            $('#area_legend').hide();
            $('.source').removeClass('source_capita');
            $('.playchart_1').remove();
            render_chart("1", JSON.parse(JSON.stringify(timeSeries_detailed[metricPie])));
        }
        else if (metric === "CAPITA") {
            renderAreaChartCapita(JSON.parse(JSON.stringify(aid)), JSON.parse(JSON.stringify(aid_country)), JSON.parse(JSON.stringify(aid_county)), colorArea);
            $('.areaheader').html("Átmeneti segélyre felhasznált összeg (<span id='areametric'>millió Ft / lakos</span>)");
            $('.city_icon_stripe').css('background-color', colorArea);
            $('#area_legend').show();
            $('.source').addClass('source_capita');
            $('.playchart_1').remove();
            render_chart("1", JSON.parse(JSON.stringify(timeSeries_detailed[metricPie])));
        }
        else {
            renderAreaChartCapita(JSON.parse(JSON.stringify(aid)), JSON.parse(JSON.stringify(aid_country)), JSON.parse(JSON.stringify(aid_county)), colorArea);
            $('.areaheader').html("Átmeneti segélyre felhasznált összeg (<span id='areametric'>millió Ft / lakos</span>)");
            $('.city_icon_stripe').css('background-color', colorArea);
            $('#area_legend').show();
            $('.source').addClass('source_capita');
            $('.playchart_1').remove();
            render_chart2("1", JSON.parse(JSON.stringify(deviation[metricPie])));
        }
    }
    else if (metricPie === "Energetikai fejlesztések") {
        defaultChart = "custom";
        if (metric === "DONATION") {
            renderAreaChart(JSON.parse(JSON.stringify(gas)), colorArea);
            $('.areaheader').html("Háztartások részére szolgáltatott gáz mennyisége (<span id='areametric'>ezer m<sup class='sup_header'>3</sup></span>)");
            $('#area_legend').hide();
            $('.source').removeClass('source_capita');
            $('.playchart_1').remove();
            render_chart("1", JSON.parse(JSON.stringify(timeSeries_detailed[metricPie])));
        }
        else if (metric === "CAPITA") {
            renderAreaChartCapita(JSON.parse(JSON.stringify(gas)), JSON.parse(JSON.stringify(gas_country)), JSON.parse(JSON.stringify(gas_county)), colorArea);
            $('.areaheader').html("Háztartások részére szolgáltatott gáz mennyisége (<span id='areametric'>ezer m<sup class='sup_header'>3</sup> / lakos</span>)");
            $('.city_icon_stripe').css('background-color', colorArea);
            $('#area_legend').show();
            $('.source').addClass('source_capita');
            $('.playchart_1').remove();
            render_chart("1", JSON.parse(JSON.stringify(timeSeries_detailed[metricPie])));
        }
        else {
            renderAreaChartCapita(JSON.parse(JSON.stringify(gas)), JSON.parse(JSON.stringify(gas_country)), JSON.parse(JSON.stringify(gas_county)), colorArea);
            $('.areaheader').html("Háztartások részére szolgáltatott gáz mennyisége (<span id='areametric'>ezer m<sup class='sup_header'>3</sup> / lakos</span>)");
            $('.city_icon_stripe').css('background-color', colorArea);
            $('#area_legend').show();
            $('.source').addClass('source_capita');
            $('.playchart_1').remove();
            render_chart2("1", JSON.parse(JSON.stringify(deviation[metricPie])));
        }
    }
    else if (metricPie === "Oktatás, továbbképzés") {
        defaultChart = "custom";
        if (metric === "DONATION") {
            renderAreaChart(JSON.parse(JSON.stringify(education)), colorArea);
            $('.areaheader').html("Általános iskolában tanulók száma (<span id='areametric'>fő</span>)");
            $('#area_legend').hide();
            $('.source').removeClass('source_capita');
            $('.playchart_1').remove();
            render_chart("1", JSON.parse(JSON.stringify(timeSeries_detailed[metricPie])));
        }
        else if (metric === "CAPITA") {
            renderAreaChartCapita(JSON.parse(JSON.stringify(education)), JSON.parse(JSON.stringify(education_country)), JSON.parse(JSON.stringify(education_county)), colorArea);
            $('.areaheader').html("Általános iskolában tanulók száma (<span id='areametric'>fő / lakos</span>)");
            $('.city_icon_stripe').css('background-color', colorArea);
            $('#area_legend').show();
            $('.source').addClass('source_capita');
            $('.playchart_1').remove();
            render_chart("1", JSON.parse(JSON.stringify(timeSeries_detailed[metricPie])));
        }
        else {
            renderAreaChartCapita(JSON.parse(JSON.stringify(education)), JSON.parse(JSON.stringify(education_country)), JSON.parse(JSON.stringify(education_county)), colorArea);
            $('.areaheader').html("Általános iskolában tanulók száma (<span id='areametric'>fő / lakos</span>)");
            $('.city_icon_stripe').css('background-color', colorArea);
            $('#area_legend').show();
            $('.source').addClass('source_capita');
            $('.playchart_1').remove();
            render_chart2("1", JSON.parse(JSON.stringify(deviation[metricPie])));
        }
    }
    else if (metricPie === "Környezetvédelem") {
        defaultChart = "custom";
        if (metric === "DONATION") {
            renderAreaChart(JSON.parse(JSON.stringify(enviroment)), colorArea);
            $('.areaheader').html("Szelektív hulladékgyűjtésben elszállított lak. szilárd hulladék (<span id='areametric'>ezer m<sup class='sup_header'>3</sup></span>)");
            $('#area_legend').hide();
            $('.source').removeClass('source_capita');
            $('.playchart_1').remove();
            render_chart("1", JSON.parse(JSON.stringify(timeSeries_detailed[metricPie])));
        }
        else if (metric === "CAPITA") {
            renderAreaChartCapita(JSON.parse(JSON.stringify(enviroment)), JSON.parse(JSON.stringify(enviroment_country)), JSON.parse(JSON.stringify(enviroment_county)), colorArea);
            $('.areaheader').html("Szelektív hulladékgyűjtésben elszállított lak. szilárd hulladék (<span id='areametric'>ezer m<sup class='sup_header'>3</sup> / lakos</span>)");
            $('.city_icon_stripe').css('background-color', colorArea);
            $('#area_legend').show();
            $('.source').addClass('source_capita');
            $('.playchart_1').remove();
            render_chart("1", JSON.parse(JSON.stringify(timeSeries_detailed[metricPie])));
        }
        else {
            renderAreaChartCapita(JSON.parse(JSON.stringify(enviroment)), JSON.parse(JSON.stringify(enviroment_country)), JSON.parse(JSON.stringify(enviroment_county)), colorArea);
            $('.areaheader').html("Szelektív hulladékgyűjtésben elszállított lak. szilárd hulladék (<span id='areametric'>ezer m<sup class='sup_header'>3</sup> / lakos</span>)");
            $('.city_icon_stripe').css('background-color', colorArea);
            $('#area_legend').show();
            $('.source').addClass('source_capita');
            $('.playchart_1').remove();
            render_chart2("1", JSON.parse(JSON.stringify(deviation[metricPie])));
        }
    }
    else if (metricPie === "Mezőgazdasági fejlesztések") {
        defaultChart = "custom";
        if (metric === "DONATION") {
            renderAreaChart(JSON.parse(JSON.stringify(agriculture)), colorArea);
            $('.areaheader').html("Regisztrált őstermelők száma (<span id='areametric'>db</span>)");
            $('#area_legend').hide();
            $('.source').removeClass('source_capita');
            $('.playchart_1').remove();
            render_chart("1", JSON.parse(JSON.stringify(timeSeries_detailed[metricPie])));
        }
        else if (metric === "CAPITA") {
            renderAreaChartCapita(JSON.parse(JSON.stringify(agriculture)), JSON.parse(JSON.stringify(agriculture_country)), JSON.parse(JSON.stringify(agriculture_county)), colorArea);
            $('.areaheader').html("Regisztrált őstermelők száma (<span id='areametric'>db / lakos</span>)");
            $('.city_icon_stripe').css('background-color', colorArea);
            $('#area_legend').show();
            $('.source').addClass('source_capita');
            $('.playchart_1').remove();
            render_chart("1", JSON.parse(JSON.stringify(timeSeries_detailed[metricPie])));
        }
        else {
            renderAreaChartCapita(JSON.parse(JSON.stringify(agriculture)), JSON.parse(JSON.stringify(agriculture_country)), JSON.parse(JSON.stringify(agriculture_county)), colorArea);
            $('.areaheader').html("Regisztrált őstermelők száma (<span id='areametric'>db / lakos</span>)");
            $('.city_icon_stripe').css('background-color', colorArea);
            $('#area_legend').show();
            $('.source').addClass('source_capita');
            $('.playchart_1').remove();
            render_chart2("1", JSON.parse(JSON.stringify(deviation[metricPie])));
        }
    }
    else {
        if (defaultChart === "custom") {
            defaultChart = "default";
            renderAreaChart(JSON.parse(JSON.stringify(population)), "#FFFFFF");
        }
        if (metric === "DONATION" || metric === "CAPITA") {
            $('.playchart_1').remove();
            render_chart("1", JSON.parse(JSON.stringify(timeSeries_detailed[metricPie])));
        }
        else {
            $('.playchart_1').remove();
            render_chart2("1", JSON.parse(JSON.stringify(deviation[metricPie])));
        }
        defaultChart = "default";
        $('.areaheader').html("Népesség (<span id='areametric'>fő</span>)");
        $('#area_legend').hide();
        $('.source').removeClass('source_capita');
    }
    //$('.info_ammount.original_info').css('color', colorArea);

    $('.info_category').css('background-color', colorArea);
    $('.info_category').text(metricPie);
    if (metricPie.length >= 29) {
        $('.info_category').text(metricPie.substring(0, 26) + "...");
    }
    else {
        $('.info_category').text(metricPie);
    }
    $('.info_category').show();
}

//RESET HIGHLIGHT ON MOUSEOVER ON DETAILED VIEW
function detailsResetHighlight() {
    $('.playchart_1').remove();
    if (metric === "DONATION" || metric === "CAPITA") {
        render_chart("1", JSON.parse(JSON.stringify(timeSeries_detailed['Summa'])));
    }
    else {
        render_chart2("1", JSON.parse(JSON.stringify(deviation['Summa'])));
    }
    $('#percentage').text("");
    $('.slice').each(function() {
        $(this).css('opacity', '1');
        $(this).attr('class', 'slice can_click');
    });

    $('.label').each(function() {
        if ($(this).attr("data-visibility") === "visible") {
            $(this).css('opacity', '1');
        }
        else {
            $(this).css('opacity', '0');
        }
    });

    $('.arrow').each(function() {
        if ($(this).attr("data-visibility") === "visible") {
            $(this).css('opacity', '0.3');
        }
        else {
            $(this).css('opacity', '0');
        }
    });

    if (defaultChart === "custom") {
        defaultChart = "default";
        renderAreaChart(JSON.parse(JSON.stringify(population)), "FFFFFF");
    }
    defaultChart = "default";
    $('.areaheader').html("Népesség (<span id='areametric'>fő</span>)");
    overlayState = "plain";
    hoverState = "off";
    //$('.info_ammount.original_info').css('color', '#91BED4');
    $('.info_category').hide();
    $('.info_category').text('');
}

//TIMESERIES BARCHART
function render_chart(songId, inputData) {

    $('.playchart_1').remove();

    var responsiveHeight = $('#playchart').height();
    var responsivewidth = $('#playchart').width();

    var margin = {top: 22, right: 25, bottom: 22, left: 65},
        width = responsivewidth - margin.left - margin.right,
        height = (responsiveHeight-110) - margin.top - margin.bottom;

    var parseDate = d3.time.format("%Y").parse
    var parseDate2 = d3.time.format("%Y").parse
    var formatDate = d3.time.format("%Y");
    var formatDate2 = d3.time.format("%Y");

    var x = d3.scale.ordinal()
        .rangeRoundBands([0, width], .1);

    var y = d3.scale.linear()
        .rangeRound([height, 0]);

    var color = d3.scale.ordinal()
        .range(["#FF665A", "#FFCA63", "#ebdecc", "#176B86", "#4D8E27"]);

    var songId = d3.selectAll("#playchart").append("svg")
        .attr("class", "playchart_" + songId)
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    songId.append("g")
        .attr("class", "background_group")

    data = JSON.parse(JSON.stringify(inputData))

    if ($('#detailed_overlay').is(':visible')) {

        if (metric === "DONATION") {
            data.forEach(function(d) {
                d.TrDate = formatDate2(parseDate(d.DA)),
                delete d.DA,
                d.EU = d.EU,
                d.KTIA = d.KT,
                delete d.KT,
                d.szechenyi = d.SZ,
                delete d.SZ,
                d.ujszechenyi = d.US,
                delete d.US,
                d.nemzeti = d.NE,
                delete d.NE
            });
        }
        else if (metric === "CAPITA") {
            data.forEach(function(d) {
                d.TrDate = formatDate2(parseDate(d.DA)),
                delete d.DA,
                d.EU = ((parseInt(d.EU)*1000000) / population.slice(-1)[0]['value']).toFixed(2),
                d.KTIA = ((parseInt(d.KT)*1000000) / population.slice(-1)[0]['value']).toFixed(2),
                delete d.KT,
                d.szechenyi = ((parseInt(d.SZ)*1000000) / population.slice(-1)[0]['value']).toFixed(2),
                delete d.SZ,
                d.ujszechenyi = ((parseInt(d.US)*1000000) / population.slice(-1)[0]['value']).toFixed(2),
                delete d.US,
                d.nemzeti = ((parseInt(d.NE)*1000000) / population.slice(-1)[0]['value']).toFixed(2),
                delete d.NE
            });
        }
    }
    else {
        data.forEach(function(d) {
            d.TrDate = formatDate2(parseDate(d.DA)),
            delete d.DA,
            d.EU = d.EU,
            d.KTIA = d.KT,
            delete d.KT,
            d.szechenyi = d.SZ,
            delete d.SZ,
            d.ujszechenyi = d.US,
            delete d.US,
            d.nemzeti = d.NE,
            delete d.NE
        });
    }

    color.domain(d3.keys(data[0]).filter(function(key) { return key !== "TrDate"; }));

    data.forEach(function(d) {
        var y0 = 0;
        d.ages = color.domain().map(function(name) { return {name: name, y0: y0, y1: y0 += +d[name], date: d["TrDate"], EU: d["EU"]}; });
        d.total = d.ages[d.ages.length - 1].y1;
        d.EU = d.ages[d.ages.length - 1].EU;
    });

    x.domain(data.map(function(d) { return d.TrDate; }));
    y.domain([0, d3.max(data, function(d) { return d.total; })]);

    var line = d3.svg.line()
        .x(function(d) { return x(d.TrDate); })
        .y(function(d) { return y(d.total); });

    var dataMiddle = Math.round((data.length-1)/2)

    var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom")
        .tickValues([data[0].TrDate, data[dataMiddle].TrDate, data[data.length -1].TrDate]);

    function make_y_axis() {
        return d3.svg.axis()
            .scale(y)
            .orient("left")
            .ticks(5)
    }

    songId.append("g")
        .attr("class", "grid")
        .call(make_y_axis()
            .tickSize(-width, 0, 0)
            .tickFormat("")
        );

    var y_max = y.domain().slice(-1)

    var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left")
        .ticks(5, "s")
        .tickFormat(d3.format(','));

    songId.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height+ ")")
        .call(xAxis);

    songId.append("g")
        .attr("class", "y axis")
        .call(yAxis);

    var xLabels = data.map(function (d) { return d.TrDate; })

    var xSeries = d3.range(1, xLabels.length + 1);
    var ySeries = data.map(function(d) { return parseFloat(d.total); });
    var ySeriesPlays = data.map(function(d) { return parseFloat(d.EU); });

    var leastSquaresCoeff = leastSquares(xSeries, ySeries);
    var leastSquaresCoeffPlays = leastSquares(xSeries, ySeriesPlays);

    var x1 = xLabels[0];
    var yCorr = 0;
    var yCorrPlays = 0;
    var y1 = leastSquaresCoeff[0] + leastSquaresCoeff[1];
    if (y1 < 0) {
        yCorr = y1 *-1;
        y1 = 0;
    }

    var y1Plays = leastSquaresCoeffPlays[0] + leastSquaresCoeffPlays[1];
    if (y1Plays < 0) {
        yCorrPlays = y1 *-1;
        y1Plays = 0;
    }
    var x2 = xLabels[xLabels.length - 1];
    var y2 = leastSquaresCoeff[0] * xSeries.length + leastSquaresCoeff[1] + yCorr;
    if (y2 < 0) {
        y2 = 0;
    }
    var y2Plays = leastSquaresCoeffPlays[0] * xSeries.length + leastSquaresCoeffPlays[1] + yCorrPlays;
    if (y2Plays < 0) {
        y2Plays = 0;
    }
    var trendData = [[x1,y1,x2,y2]];
    var trendDataPlays = [[x1,y1Plays,x2,y2Plays]];

    function leastSquares(xSeries, ySeries) {
        var reduceSumFunc = function(prev, cur) { return prev + cur; };

        var xBar = xSeries.reduce(reduceSumFunc) * 1.0 / xSeries.length;
        var yBar = ySeries.reduce(reduceSumFunc) * 1.0 / ySeries.length;

        var ssXX = xSeries.map(function(d) { return Math.pow(d - xBar, 2); })
            .reduce(reduceSumFunc);

        var ssYY = ySeries.map(function(d) { return Math.pow(d - yBar, 2); })
            .reduce(reduceSumFunc);

        var ssXY = xSeries.map(function(d, i) { return (d - xBar) * (ySeries[i] - yBar); })
            .reduce(reduceSumFunc);

        var slope = ssXY / ssXX;
        var intercept = yBar - (xBar * slope);
        var rSquare = Math.pow(ssXY, 2) / (ssXX * ssYY);

        return [slope, intercept, rSquare];
    }

    var transdate = songId.selectAll(".transdate")
        .data(data)
        .enter().append("g")
        .attr("class", "g balance_bar")
        .attr("transform", function(d) { return "translate(" + x(d.TrDate) + ",0)"; });

    if ($('#detailed_overlay').is(':visible')) {
        transdate.selectAll("rect")
            .data(function(d) { return d.ages; })
            .enter().append("rect")
            .attr("width", x.rangeBand())
            .attr("class", function(d) { return d.name +" bars"; })
            .attr("data-date", function(d) { return d.date; })
            //.attr("y", function(d) { return y(0); })
            //.attr("height", function(d) { return y(0) - y(0); })
            .style("fill", function(d) { return color(d.name); })
            //.transition()
            //.duration(100)
            .attr("y", function(d) { return (y(d.y1)-1); })
            .attr("data-selected", function(d) { return (y(d.y1)-1); })
            .attr("data-balance", function(d) {return (y(d.y1)); })
            .attr("height", function(d) { return y(d.y0) - y(d.y1); })
            .style('stroke', '#333')
            .style('opacity', '0.7')
            .style('stroke-width', '0.5');
    }
    else {
        transdate.selectAll("rect")
            .data(function(d) { return d.ages; })
            .enter().append("rect")
            .attr("width", x.rangeBand())
            .attr("class", function(d) { return d.name +" bars"; })
            .attr("data-date", function(d) { return d.date; })
            //.attr("y", function(d) { return y(0); })
            //.attr("height", function(d) { return y(0) - y(0); })
            //.transition()
            //.duration(0)
            .attr("y", function(d) { return (y(d.y1)-1); })
            .attr("data-selected", function(d) { return (y(d.y1)-1); })
            .attr("data-balance", function(d) {return (y(d.y1)); })
            .attr("height", function(d) { return y(d.y0) - y(d.y1); })
            .style("fill", function(d) { return color(d.name); })
            .style('stroke', '#333')
            .style('opacity', '0.7')
            .style('stroke-width', '0.5');
    }

    songId.selectAll(".g")
        .data(data)
        .attr("data", function(d) { return d.TrDate; })
        .attr("balance", function(d) {return d.total; });

    var trendline = songId.selectAll(".trendline")
        .data(trendData);

    trendline.enter()
        .append("line")
        .attr("class", "trendline")
        .attr("x1", function(d) { return x(d[0]); })
        .attr("y1", function(d) { return y(d[1]); })
        .attr("x2", function(d) { return x(d[2]); })
        .attr("y2", function(d) { return y(d[3]); })
        .attr("stroke", "#79DCE8")
        .attr("stroke-width", 2)
        .style("stroke-dasharray", ("3, 3"))
        .style("stroke-opacity", 0.7);

    var trendlinePlays = songId.selectAll(".trendlinePlays")
        .data(trendDataPlays);

    trendlinePlays.enter()
        .append("line")
        .attr("class", "trendlinePlays")
        .attr("x1", function(d) { return x(d[0]); })
        .attr("y1", function(d) { return y(d[1]); })
        .attr("x2", function(d) { return x(d[2]); })
        .attr("y2", function(d) { return y(d[3]); })
        .attr("stroke", "#79DCE8")
        .attr("stroke-width", 2)
        .style("stroke-dasharray", ("3, 3"))
        .style("stroke-opacity", 0.7);
}

//TIMESERIES BARCHART WITH NEGATIVE VALUES
function render_chart2(songId, inputData) {

    var margin = 20;
    var responsiveHeight = $('#playchart').height();
    var responsivewidth = $('#playchart').width();

    var margin0 = {top: 22, right: 25, bottom: 22, left: 65},
        w = responsivewidth,
        h = responsiveHeight-70;

    function barStack(seriesData) {
        var l = seriesData[0].length;
        while (l--) {
            var posBase = 0; // positive base
            var negBase = 0; // negative base

            seriesData.forEach(function(d) {
                d = d[l]
                d.size = Math.abs(d.y)
                if (d.y < 0) {
                    d.y0 = negBase
                    negBase -= d.size
                }
                else {
                    d.y0 = posBase = posBase + d.size
                }
            })
        }
        seriesData.extent = d3.extent(
            d3.merge(
                d3.merge(
                    seriesData.map(function(e) {
                        return e.map(function(f) { return [f.y0,f.y0-f.size] })
                    })
                )
            )
        )
    }

    var data = inputData;
    var color = d3.scale.ordinal()
        .range(["#4D8E27", "#FF665A", "#176B86", "#777777"]);

    var color2 = d3.scale.ordinal()
        .range(["url('#purpleStripe')", "url('#hash4_5')", "rgba(0,0,0,0)", "rgba(0,0,0,0)"]);

    var x = d3.scale.ordinal()
        .domain([2007, " ", "  ", "   ", 2011, "    ", "     ", "        ", 2015])
        .rangeRoundBands([margin0.left, w-margin0.right], .1);

    var y = d3.scale.linear()
        .range([h-margin0.top,0+margin0.bottom]);

    var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom")
        .ticks(3, 4);

    var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left")
        .tickFormat(function(d) { return d+100 + "%"; })
        .ticks(5);

    barStack(data);
    y.domain(data.extent);

    svg = d3.select("#playchart")
        .append("svg")
        .attr("class", "playchart_" + songId)
        .attr("width", w)
        .attr("height", h);

    svg.append("g")
        .attr("class", "background_group");

    var defs = svg.append("defs");

    var filter = defs.append("filter")
        .attr("id", "drop-shadow")
        .attr("height", "200%")
        .attr("width", "200%");

    filter.append("feGaussianBlur")
        .attr("in", "SourceAlpha")
        .attr("stdDeviation", 5)
        .attr("result", "blur");

    filter.append("feOffset")
        .attr("in", "blur")
        .attr("dx", 5)
        .attr("dy", 5)
        .attr("result", "offsetBlur");

    var feMerge = filter.append("feMerge");

    feMerge.append("feMergeNode")
        .attr("in", "offsetBlur")

    feMerge.append("feMergeNode")
        .attr("in", "SourceGraphic");

    function make_y_axis() {
        return d3.svg.axis()
            .scale(y)
            .orient("left")
            .ticks(5)
    }

    svg.append("g")
        .attr("class", "grid")
        .attr("transform", "translate(" + margin0.left + " 0)")
        .call(make_y_axis()
            .tickSize(-230, 0, 0)
            .tickFormat("")
        );

    function selectYear(index) {
        if (index === 0) {
            return 2007;
        }
        else if (index === 1) {
            return 2008;
        }
        else if (index === 2) {
            return 2009;
        }
        else if (index === 3) {
            return 2010;
        }
        else if (index === 4) {
            return 2011;
        }
        else if (index === 5) {
            return 2012;
        }
        else if (index === 6) {
            return 2013;
        }
        else if (index === 7) {
            return 2014;
        }
        else if (index === 8) {
            return 2015;
        }
    }

    function changeOpacity(selection) {
        if (metric === "DEVIATION_2007") {
            selection.each(function(){
                var element = d3.select(this);
                if (parseInt(element.attr('data-year')) <= 2009) {
                    element
                        .style("opacity", "0.7")
                        .style("filter", "url(#drop-shadow)");
                }
                else {
                    element
                        .style("opacity", "0.3");
                }
            });
        }
        else if (metric === "DEVIATION_2010") {
            selection.each(function(){
                var element = d3.select(this);
                if (parseInt(element.attr('data-year')) > 2009 && parseInt(element.attr('data-year')) < 2014) {
                    element
                        .style("opacity", "0.7")
                        .style("filter", "url(#drop-shadow)");
                }
                else {
                    element
                        .style("opacity", "0.3");
                }
            });
        }
        else if (metric === "DEVIATION_2014") {
            selection.each(function(){
                var element = d3.select(this);
                if (parseInt(element.attr('data-year')) >= 2014) {
                    element
                        .style("opacity", "0.7")
                        .style("filter", "url(#drop-shadow)");
                }
                else {
                    element
                        .style("opacity", "0.3");
                }
            });
        }
    }

    function changeOpacityPattern(selection) {
        if (metric === "DEVIATION_2007") {
            selection.each(function(){
                var element = d3.select(this);
                if (parseInt(element.attr('data-year')) <= 2009) {
                    element
                        .style("opacity", "0.7");
                }
                else {
                    element
                        .style("opacity", "0.3");
                }
            });
        }
        else if (metric === "DEVIATION_2010") {
            selection.each(function(){
                var element = d3.select(this);
                if (parseInt(element.attr('data-year')) > 2009 && parseInt(element.attr('data-year')) < 2014) {
                    element
                        .style("opacity", "0.7");
                }
                else {
                    element
                        .style("opacity", "0.3");
                }
            });
        }
        else if (metric === "DEVIATION_2014") {
            selection.each(function(){
                var element = d3.select(this);
                if (parseInt(element.attr('data-year')) >= 2014) {
                    element
                        .style("opacity", "0.7");
                }
                else {
                    element
                        .style("opacity", "0.3");
                }
            });
        }
    }

    svg.selectAll(".series")
        .data(data)
        .enter().append("g")
        .classed("series", true)
        .selectAll("rect")
        .data(Object)
        .enter().append("rect")
        .attr('class', 'deviationBar')
        .attr("x", function(d, i) { return x(x.domain()[i]) })
        .attr("data-year", function(d, i) { return selectYear(i) })
        .attr("data-value", function(d, i) { return d.y })
        .attr("width", x.rangeBand())
        //.attr("y", function(d) { return y(0); })
        //.attr("height", function(d) { return y(0) - y(0); })
        //.transition()
        //.duration(0)
        .attr("y", function(d) { return y(d.y0) })
        .attr("height", function(d) { return y(0) - y(d.size) })
        .style('stroke', '#333')
        .style('stroke-width', '0.5')
        .style("fill", function(d,i) { return getColor_t(parseInt(d.y)+100, "DEVIATION_2007") });

    svg.selectAll(".series2")
        .data(data)
        .enter().append("g")
        .classed("series2", true)
        .style("fill", function(d,i) { return color2(i) })
        .selectAll("rect")
        .data(Object)
        .enter().append("rect")
        .attr("class", "patternBar")
        .attr("data-year", function(d, i) { return selectYear(i) })
        .attr("x", function(d, i) { return x(x.domain()[i]) })
        .attr("width", x.rangeBand())
        .attr("y", function(d) { return y(0); })
        .attr("height", function(d) { return y(0) - y(0); })
        .transition()
        .duration(0)
        .attr("y", function(d) { return y(d.y0) })
        .attr("height", function(d) { return y(0) - y(d.size) })
        .style('stroke', '#333')
        .style('stroke-width', '0.5');

    svg.selectAll(".deviationBar")
        .call(changeOpacity);

    svg.selectAll(".patternBar")
        .call(changeOpacityPattern);

    svg.append("g")
        .attr("class", "axis x")
        .attr("transform", "translate(0 " + y(0) + ")")
        .call(xAxis);

    svg.append("g")
        .attr("class", "axis y")
        .attr("transform", "translate(" + margin0.left + " 0)")
        .call(yAxis);

    var tooltip = svg.append("g")
        .attr("class", "tooltip")
        .style("display", "none");

    tooltip.append("rect")
        .attr("width", 30)
        .attr("height", 20)
        .attr("fill", "white")
        .style("opacity", 0.5);

    tooltip.append("text")
        .attr("x", 15)
        .attr("dy", "1.2em")
        .style("text-anchor", "middle")
        .attr("font-size", "12px")
        .attr("font-weight", "bold");
}

var southWest = L.latLng(45.1423360997, 14.8645019531),
    northEast = L.latLng(49.8370967393, 25.4333496094),
    bounds = L.latLngBounds(southWest, northEast);

var map = L.map('map', {
    center: [47.162494, 19.503304],
    zoom: 7,
    maxBounds: bounds,
    minZoom: 7,
    maxZoom: 14
});

L.tileLayer('//{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a target="_blank" href="//www.openstreetmap.org/copyright">OpenStreetMap</a> | <a target="_blank" href="//www.atlatszo.hu">atlatszo.hu</a>'
}).addTo(map);

function getColor_m(d, metric) {
    if (metric === "DONATION") {
        return d >= 2675472 ? '#B10026' :
               d >= 590828  ? '#B10026' :
               d >= 477281  ? '#E31A1C' :
               d >= 411403  ? '#FC4E2A' :
               d >= 339351   ? '#FD8D3C' :
               d >= 316725   ? '#FEB24C' :
               d >= 200732   ? '#FED976' :
               d >= 1   ? '#FFFFB2' :
                '#FFFFB2';
    }
    else if (metric === "CAPITA") {
        return d >= 1543228 ? '#0C2C84' :
               d >= 1400640  ? '#0C2C84' :
               d >= 1008979  ? '#225EA8' :
               d >= 883432  ? '#1D91C0' :
               d >= 805802   ? '#41B6C4' :
               d >= 672658   ? '#7FCDBB' :
               d >= 387974   ? '#C7E9B4' :
               d >= 1   ? '#FFFFCC' :
               '#FFFFCC';
    }
}

function getColor_k(d, metric) {
    if (metric === "DONATION") {
        return d >= 2292160 ? '#B10026' :
               d >= 393346  ? '#B10026' :
               d >= 155903  ? '#E31A1C' :
               d >= 45328  ? '#FC4E2A' :
               d >= 31826  ? '#FD8D3C' :
               d >= 24723   ? '#FEB24C' :
               d >= 17620   ? '#FED976' :
               d >= 1   ? '#FFFFB2' :
               '#FFFFB2';
    }
    else if (metric === "CAPITA") {
        return d >= 6713015 ? '#0C2C84' :
               d >= 3991456  ? '#0C2C84' :
               d >= 1214538  ? '#225EA8' :
               d >= 1022784  ? '#1D91C0' :
               d >= 730618  ? '#41B6C4' :
               d >= 561674   ? '#7FCDBB' :
               d >= 280573   ? '#C7E9B4' :
               d >= 1   ? '#FFFFCC' :
               '#FFFFCC';
    }
}

function getColor_t(d, metric) {
    if (metric === "DONATION") {
        return d >= 2675472 ? '#B10026' :
               d >= 271551  ? '#B10026' :
               d >= 3316  ? '#E31A1C' :
               d >= 1828  ? '#FC4E2A' :
               d >= 592   ? '#FD8D3C' :
               d >= 361   ? '#FEB24C' :
               d >= 130   ? '#FED976' :
               d >= 1   ? '#FFFFB2' :
               d === 0   ? '#D4D4D4' :
               '#FFFFB2';
    }
    else if (metric === "CAPITA") {
        return d >= 44534232 ? '#0C2C84' :
               d >= 10738345  ? '#0C2C84' :
               d >= 1635418  ? '#225EA8' :
               d >= 864218  ? '#1D91C0' :
               d >= 429965   ? '#41B6C4' :
               d >= 280100   ? '#7FCDBB' :
               d >= 147594   ? '#C7E9B4' :
               d >= 1   ? '#FFFFCC' :
               d === 0   ? '#D4D4D4' :
               '#FFFFCC';
    }
    else if (metric === "DEVIATION_2007" || metric === "DEVIATION_2010" || metric === "DEVIATION_2014" ) {
        return d >= 200 ? '#ff4d4d' :
               d >= 175  ? '#ff4d4d' :
               d >= 150  ? '#ff7a7a' :
               d >= 125  ? '#ffa6a6' :
               d >= 75   ? '#fff2cc' :
               d >= 50   ? '#7fbfff' :
               d >= 25   ? '#40a0ff' :
               d > 0   ? '#0080ff' :
               d === 0   ? '#D4D4D4' :
               '#D4D4D4';
    }
}

function getPattern(d) {
    if (metric === "DEVIATION_2007") {
        return d["2007"] === "RULER" ? 'url(#purpleStripe)' :
               d["2007"] === "UD"  ? 'url(#hash4_5)' :
               'rgba(0,0,0,0)';
    }
    else if (metric === "DEVIATION_2010") {
        return d["2010"] === "RULER" ? 'url(#purpleStripe)' :
               d["2010"] === "UD"  ? 'url(#hash4_5)' :
               'rgba(0,0,0,0)';
    }
    else if (metric === "DEVIATION_2014") {
        return d["2014"] === "RULER" ? 'url(#purpleStripe)' :
               d["2014"] === "UD"  ? 'url(#hash4_5)' :
               'rgba(0,0,0,0)';
    }
}

function stripes_style (feature) {
    if (typeof feature['properties']['DEVIATION_PATTERN'] != "undefined") {
        return {
            fillColor: getPattern(feature['properties']['DEVIATION_PATTERN']),
            fillOpacity: 0.6,
            weight: 1,
            opacity: 1,
            color: '#333333',
            dashArray: '',
            className: feature['properties']['TEL_NEV']
        };
    }
    else {
        return {
            fillColor: "#FFFFFF",
            fillOpacity: 0.6,
            weight: 1,
            opacity: 1,
            color: '#333333',
            dashArray: '',
            className: feature['properties']['TEL_NEV']
        };
    }
}

function style(feature) {
    if (adminUnit === "megye" ) {
        return {
            fillColor: getColor_m(feature['properties'][metric], metric),
            weight: 1,
            opacity: 0.8,
            color: '#333333',
            dashArray: '',
            fillOpacity: 0.6,
            className: feature['properties']['TEL_NEV']
        };
    }
    else if (adminUnit === "kisterseg") {
        return {
            fillColor: getColor_k(feature['properties'][metric], metric),
            weight: 1,
            opacity: 0.8,
            color: '#333333',
            dashArray: '',
            fillOpacity: 0.6,
            className: feature['properties']['TEL_NEV']
        };
    }
    else if (adminUnit === "telepules") {
        return {
            fillColor: getColor_t(feature['properties'][metric], metric),
            weight: 1,
            opacity: 0.8,
            color: '#333333',
            dashArray: '',
            fillOpacity: 0.6
        };
    }
}

function highlightFeature(e) {
    var layer = e.target;

    layer.setStyle({
        weight: 2,
        color: '#000000',
        dashArray: '',
        fillOpacity: 0.2,
    });

    if (!L.Browser.ie && !L.Browser.opera) {
        layer.bringToFront();
    }

    info.update(layer.feature.properties);

    $('.legend_elem').each(function(){
        $(this).removeClass("legend_featured");
        if (parseInt($(this).attr('data-range_start')) <= parseInt(layer['feature']['properties'][metric]) && parseInt($(this).attr('data-range_end')) >= parseInt(layer['feature']['properties'][metric])) {
            $(this).addClass("legend_featured");
        }
        else if (parseInt($(this).attr('data-range_start')) <= parseInt(layer['feature']['properties'][metric]) && $(this).attr('data-range_end') === "undefined") {
            $(this).addClass("legend_featured");
        }
    });
}

function resetHighlight(e) {
    geojson.resetStyle(e.target);
    $('.legend_elem').each(function(){
        $(this).removeClass("legend_featured");
    });
    info.update();
}

function toGeoJSON (target) {
    if (target instanceof L.Marker) {
        //Point
        return {
            coordinates: this.latLngToCoords(target.getLatLng()),
            type: 'Point'
        };
    }
    else if (target instanceof L.MultiPolygon || target instanceof L.MultiPolyline) {
        //MultiPolygon and MultiLineString
        var multi = [];
        var layers = target._layers;
        for (var stamp in layers) {
            multi.push(this.toGeoJSON(layers[stamp]).coordinates);
        }
        return {
            coordinates: multi,
            type: (target instanceof L.MultiPolygon) ? 'MultiPolygon': 'MultiLineString'
        };
    }
    else if (target instanceof L.Polygon) {
        //Polygon
        var coords = this.latLngsToCoords(target.getLatLngs());
        return {
            coordinates: [coords],
            type: 'Polygon'
        };
    }
    else if (target instanceof L.Polyline) {
        //Linestring
        var coords = this.latLngsToCoords(target.getLatLngs());
        return {
            coordinates: coords,
            type: 'LineString'
        };
    }
    else if (target instanceof L.FeatureGroup) {
        //Multi point and GeometryCollection
        var multi = [];
        var layers = target._layers;
        var points = true;
        for (var stamp in layers) {
            var json = this.toGeoJSON(layers[stamp]);
            multi.push(json);
            if (json.type !== 'Point') {
                points = false;
            }
        }
        if (points) {
            var coords = multi.map(function(geo){
                return geo.coordinates;
            });
            return {
                coordinates: coords,
                type: 'MultiPoint'
            };
        }
        else {
            return {
                geometries: multi,
                type: 'GeometryCollection'
            };
        }
    }
}

function latLngToCoords (latlng) {
    return [latlng.lng, latlng.lat];
}

function latLngsToCoords (arrLatlng) {
    var coords = [];
    arrLatlng.forEach(function(latlng) {
        coords.push(this.latLngToCoords(latlng));
    },
    this);
    return coords;
}

function zoomToFeature(e) {
    if (map.getZoom() >= 12 || timeSeries === "DEVIATION") {
        var layer = e.target;
        var popupContent;
        coords = toGeoJSON(layer);

        if (layer.properties && layer.properties.TEL_NEV) {
            //var popupContent =L.popup({autoPanPaddingTopLeft: L.point(10, 100), autoPanPaddingBottomRight: L.point(350, 10)}).setContent("<a href='//adat.atlatszo.hu/eu-kereso/?varos=" + encodeURIComponent(feature.properties.TEL_NEV)+"' target='_blank'><div class='popupButton' data-uid='"+feature.properties.TEL_NEV+"'>"+feature.properties.TEL_NEV+":<br>az összes pályázat listázása"+"</div></a>");
            var popupContent =L.popup({autoPanPaddingTopLeft: L.point(10, 100), autoPanPaddingBottomRight: L.point(350, 10)}).setContent("<div class='popupButton' data-uid='"+feature.properties.TEL_NEV+"'><div class='popup_big'>"+feature.properties.TEL_NEV+"</div><div class='popup_small'>részletek</div>"+"</div>");
        }
        pop = layer.bindPopup(popupContent);
        pop.openPopup();
    }
}

var markersById = {};

function onEachFeatureIndex(feature, layer) {
    markersById[feature.properties.TEL_NEV] = layer;
}

function onEachFeature(feature, layer) {
    //layer._leaflet_id = feature.id;
    markersById[feature.properties.TEL_NEV] = layer;
    layer.on('dblclick', function(e) {
        if (map.getZoom() < 12 && timeSeries != "DEVIATION") {
            var coordinates = e.target.getBounds().getCenter();
            var cM = [coordinates.lat, coordinates.lng];
            var a = map.getZoom();
            map.setView(new L.LatLng(cM[0], cM[1]),a+1, {animate: true});
        }
    });

    if (map.getZoom() >= 12 || timeSeries === "DEVIATION") {

        if (feature.properties && feature.properties.TEL_NEV) {
            //var content = L.popup({autoPanPaddingTopLeft: L.point(10, 100), autoPanPaddingBottomRight: L.point(350, 10)}).setContent("<a href='//adat.atlatszo.hu/eu-kereso/?varos=" + encodeURIComponent(feature.properties.TEL_NEV)+"' target='_blank'><div class='popupButton' data-uid='"+feature.properties.TEL_NEV+"'>"+feature.properties.TEL_NEV+":<br>az összes pályázat listázása"+"</div></a>");
            var content = L.popup({autoPanPaddingTopLeft: L.point(10, 100), autoPanPaddingBottomRight: L.point(350, 10)}).setContent("<div class='popupButton' data-uid='"+feature.properties.TEL_NEV+"'><div class='popup_big'>"+feature.properties.TEL_NEV+"</div><div class='popup_small'>részletek</div>"+"</div>");
            layer.bindPopup(content);
        }
    }

    layer.on({
        mouseover: highlightFeature,
        mouseout: resetHighlight,
        click: zoomToFeature
    });
}

var info = L.control();

var chart = L.control();

info.onAdd = function (map) {
    this._div = L.DomUtil.create('div', 'info popup');
    this.update();
    return this._div;
};

chart.onAdd = function (map) {
    this._div = L.DomUtil.create('div', 'chart');
    return this._div;
};

info.update = function (props) {
    if (props) {
        if ($('#playchart').hasClass('medium')) {
            $('.info.legend').hide();
        }
        if ($(window).height() <= 650) {
            $('.info.legend').hide();
        }
        $('#playchart').show();
    }
    else {

        if ($('.chart:hover').length === 0) {
            //UPDATE1 HERE TOOL
            $('.playchart_1').remove();
            $('#playchart').hide();
        }
        $('.info.legend').show();
    }

    if (metric === "DONATION") {

        if (props) {
            this._div.innerHTML = '<div class="info_header">'+props["TEL_NEV"]+'</div>' +
                                  '<b>' + '<h4 class="original_info">Átlagos EU támogatás (millió Ft / év)</h4>' + '</b><div class="info_wrapper"><div class="info_category"></div><div class="info_ammount original_info">' + (props[metric]/9).format(0, 3, ' ') + ' millió Ft</div></div>' +
                                  '<b>' + '<h4 class="hidden_info" >Összes EU támogatás (millió Ft / év)</h4>' + '</b><div class="info_wrapper"><div class="info_ammount hidden_info">' + (props[metric]/9).format(0, 3, ' ') + ' millió Ft</div></div>';
        }
        else {

            if ($('.chart:hover').length === 0) {
                this._div.innerHTML = 'Átlagos évenkénti EU támogatás 2007-2015.';
            }
        }
    }
    else if (metric === "CAPITA") {

        if (props) {
            this._div.innerHTML = '<div class="info_header">'+props["TEL_NEV"]+'</div>' +
                                  '<b>' + '<h4 class="original_info">Egy főre jutó EU támogatás (Ft / fő / év)</h4>' + '</b><div class="info_wrapper"><div class="info_category"></div><div class="info_ammount original_info">' + (props[metric]/9).format(0, 3, ' ') + ' Ft</div></div>';
                                  '<b>' + '<h4 class="hidden_info">Egy főre jutó EU támogatás (Ft / fő / év)</h4>' + '</b><div class="info_wrapper"><div class="info_category"></div><div class="info_ammount hidden_info">' + (props[metric]/9).format(0, 3, ' ') + ' Ft</div></div>';
        }
        else {

            if ($('.chart:hover').length === 0) {
                this._div.innerHTML = 'Egy főre jutó évi EU támogatás 2007-2015.';
            }
        }
    }
    else if (metric === "DEVIATION_2007") {

        if (props) {
            this._div.innerHTML = '<div class="info_header">'+props["TEL_NEV"]+'</div>' +
                                  '<b>' + '<h4 class="original_info">Mo. fő / év átlagához mérve <span class="deviation_years">(2007-2009)</span></h4>' + '</b><div class="info_wrapper"><div class="info_category"></div><div class="info_ammount original_info">' + parseInt(props[metric]) + ' %</div></div>' +
                                  '<b>' + '<h4 class="hidden_info" >Mo. fő / év átlagától való eltérés <span class="deviation_years">(2007-2009)</span></h4>' + '</b><div class="info_wrapper"><div class="info_ammount hidden_info">' + parseInt(props[metric]) + ' %</div></div>';
        }
        else {

            if ($('.chart:hover').length === 0) {
                this._div.innerHTML = 'Választási ciklus szerinti EU támogatás';
            }
        }
    }
    else if (metric === "DEVIATION_2010") {

        if (props) {
            this._div.innerHTML = '<div class="info_header">'+props["TEL_NEV"]+'</div>' +
                                  '<b>' + '<h4 class="original_info">Mo. fő / év átlagához mérve <span class="deviation_years">(2010-2013)</span></h4>' + '</b><div class="info_wrapper"><div class="info_category"></div><div class="info_ammount original_info">' + parseInt(props[metric]) + ' %</div></div>' +
                                  '<b>' + '<h4 class="hidden_info" >Mo. fő / év átlagától való eltérés <span class="deviation_years">(2010-2013)</span></h4>' + '</b><div class="info_wrapper"><div class="info_ammount hidden_info">' + parseInt(props[metric]) + ' %</div></div>';
        }
        else {

            if ($('.chart:hover').length === 0) {
                this._div.innerHTML = 'Választási ciklus szerinti EU támogatás';
            }
        }
    }
    else if (metric === "DEVIATION_2014") {

        if (props) {
            this._div.innerHTML = '<div class="info_header">'+props["TEL_NEV"]+'</div>' +
                                  '<b>' + '<h4 class="original_info">Mo. fő / év átlagához mérve <span class="deviation_years">(2014-2015)</span></h4>' + '</b><div class="info_wrapper"><div class="info_category"></div><div class="info_ammount original_info">' + parseInt(props[metric]) + ' %</div></div>' +
                                  '<b>' + '<h4 class="hidden_info" >Mo. fő / év átlagától való eltérés <span class="deviation_years">(2014-2015)</span></h4>' + '</b><div class="info_wrapper"><div class="info_ammount hidden_info">' + parseInt(props[metric]) + ' %</div></div>';
        }
        else {

            if ($('.chart:hover').length === 0) {
                this._div.innerHTML = 'Választási ciklus szerinti EU támogatás';
            }
        }
    }

    if (typeof props != "undefined") {
        //console.log(JSON.stringify(props.DONATION_TIME));
        if (typeof props[timeSeries] != "undefined") {
            if (timeSeries == "DONATION_TIME" || timeSeries == "CAPITA_TIME") {
                $('.playchart_1').remove();
                if ($('#detailed_overlay').is(':visible')) {
                    render_chart("1", props["DONATION_TIME"]);
                }
                else {
                    //TO DO
                    render_chart("1", props[timeSeries]);
                }
                //render_chart("1", props[timeSeries]);
                $('#playchart').show();
            }
            else if (timeSeries == "DEVIATION") {
                $('.playchart_1').remove();
                render_chart2("1", props[timeSeries]);
                $('#playchart').show();
            }
        }
        else {
            if ($('.chart:hover').length === 0) {
                $('#playchart').hide();
            }
        }
    }
};

info.addTo(map);
chart.addTo(map);

var legend = L.control({position: 'bottomright'});

legend.onAdd = function (map) {
    if (map.getZoom() <= 9) {

        if (metric === "DONATION") {
            var div = L.DomUtil.create('div', 'info legend'),
                grades = [0, 200731, 316724, 339350, 411402, 477280, 590827],
                labels = [];

            for (var i = 0; i < grades.length; i++) {
                div.innerHTML +=
                    '<div class="legend_elem" data-range_start="'+(grades[i]+1)+'" data-range_end="'+grades[i + 1]+'">'+'<div class="legend_icon" style="background:' + getColor_m(grades[i] + 1, metric) + '"></div>' +
                    '<div class="legend_text2">'+((grades[i]/9)+1).format(0, 3, ' ') + (grades[i + 1] ? ' &ndash; ' + (grades[i + 1]/9).format(0, 3, ' ') + ' millió Ft<br>' :'+ millió Ft')+'</div></div>';
            }
            return div;
        }
        else if (metric === "CAPITA") {
            var div = L.DomUtil.create('div', 'info legend'),
                grades = [0, 387974, 672658, 805802, 883432, 1008979, 1400640],
                labels = [];

            for (var i = 0; i < grades.length; i++) {
                div.innerHTML +=
                    '<div class="legend_elem" data-range_start="'+(grades[i]+1)+'" data-range_end="'+grades[i + 1]+'">'+'<div class="legend_icon" style="background:' + getColor_m(grades[i] + 1, metric) + '"></div>' +
                    '<div class="legend_text2">'+((grades[i]/9)+1).format(0, 3, ' ') + (grades[i + 1] ? ' &ndash; ' + (grades[i + 1]/9).format(0, 3, ' ') + ' Ft<br>' :'+ Ft')+'</div></div>';
            }
            return div;
        }
        else if (metric === "DEVIATION_2007" || metric === "DEVIATION_2010" || metric === "DEVIATION_2014") {
            var div = L.DomUtil.create('div', 'info legend'),
                grades = [0, 25, 50, 75, 125, 150, 175],
                labels = [];

            for (var i = 0; i < grades.length; i++) {
                div.innerHTML +=
                    '<div class="legend_elem" data-range_start="'+(grades[i]+1)+'" data-range_end="'+grades[i + 1]+'">'+'<div class="legend_icon" style="background:' + getColor_t(grades[i] + 1, metric) + '"></div>' +
                    '<div class="legend_text2">'+(grades[i]+1).format(0, 3, ' ') + (grades[i + 1] ? ' &ndash; ' + (grades[i + 1]).format(0, 3, ' ') + ' %<br>' :'+ %')+'</div></div>';
            }
            return div;
        }
    }
    else if (map.getZoom() <= 11) {

        if (metric === "DONATION") {
            var div = L.DomUtil.create('div', 'info legend'),
                grades = [0, 17620, 24723, 31826, 45328, 155903, 393346],
                labels = [];

            for (var i = 0; i < grades.length; i++) {
                div.innerHTML +=
                    '<div class="legend_elem" data-range_start="'+(grades[i]+1)+'" data-range_end="'+grades[i + 1]+'">'+'<div class="legend_icon" style="background:' + getColor_k(grades[i] + 1, metric) + '"></div>' +
                    '<div class="legend_text2">'+((grades[i]/9)+1).format(0, 3, ' ') + (grades[i + 1] ? ' &ndash; ' + (grades[i + 1]/9).format(0, 3, ' ') + ' millió Ft<br>' :'+ millió Ft')+'</div></div>';
            }
            return div;
        }
        else if (metric === "CAPITA") {
            var div = L.DomUtil.create('div', 'info legend'),
                grades = [0, 280575, 561674, 730618, 1022784, 1214538, 3991456],
                labels = [];

            for (var i = 0; i < grades.length; i++) {
                div.innerHTML +=
                    '<div class="legend_elem" data-range_start="'+(grades[i]+1)+'" data-range_end="'+grades[i + 1]+'">'+'<div class="legend_icon" style="background:' + getColor_k(grades[i] + 1, metric) + '"></div>' +
                    '<div class="legend_text2">'+((grades[i]/9)+1).format(0, 3, ' ') + (grades[i + 1] ? ' &ndash; ' + (grades[i + 1]/9).format(0, 3, ' ') + ' Ft<br>' :'+ Ft')+'</div></div>';
            }
            return div;
        }
        else if (metric === "DEVIATION_2007" || metric === "DEVIATION_2010" || metric === "DEVIATION_2014") {
            var div = L.DomUtil.create('div', 'info legend'),
                grades = [0, 25, 50, 75, 125, 150, 175],
                labels = [];

            for (var i = 0; i < grades.length; i++) {
                div.innerHTML +=
                    '<div class="legend_elem" data-range_start="'+(grades[i]+1)+'" data-range_end="'+grades[i + 1]+'">'+'<div class="legend_icon" style="background:' + getColor_t(grades[i] + 1, metric) + '"></div>' +
                    '<div class="legend_text2">'+(grades[i]+1).format(0, 3, ' ') + (grades[i + 1] ? ' &ndash; ' + (grades[i + 1]).format(0, 3, ' ') + ' %<br>' :'+ %')+'</div></div>';
            }
            return div;
        }
    }
    else {

        if (metric === "DONATION") {
            var div = L.DomUtil.create('div', 'info legend'),
                grades = [0, 130, 361, 592, 1828, 3316, 271551],
                labels = [];

            for (var i = 0; i < grades.length; i++) {
                div.innerHTML +=
                    '<div class="legend_elem" data-range_start="'+(grades[i]+1)+'" data-range_end="'+grades[i + 1]+'">'+'<div class="legend_icon" style="background:' + getColor_t(grades[i] + 1, metric) + '"></div>' +
                    '<div class="legend_text2">'+((grades[i]/9)+1).format(0, 3, ' ') + (grades[i + 1] ? ' &ndash; ' + (grades[i + 1]/9).format(0, 3, ' ') + ' millió Ft<br>' :'+ millió Ft')+'</div></div>';
            }
            return div;
        }
        else if (metric === "CAPITA") {
            var div = L.DomUtil.create('div', 'info legend'),
                grades = [0, 147594, 280175, 429965, 864218, 1635418, 10738345],
                labels = [];

            for (var i = 0; i < grades.length; i++) {
                div.innerHTML +=
                    '<div class="legend_elem" data-range_start="'+(grades[i]+1)+'" data-range_end="'+grades[i + 1]+'">'+'<div class="legend_icon" style="background:' + getColor_t(grades[i] + 1, metric) + '"></div>' +
                    '<div class="legend_text2">'+((grades[i]/9)+1).format(0, 3, ' ') + (grades[i + 1] ? ' &ndash; ' + (grades[i + 1]/9).format(0, 3, ' ') + ' Ft<br>' :'+ Ft')+'</div></div>';
                }
            return div;
        }
        else if (metric === "DEVIATION_2007" || metric === "DEVIATION_2010" || metric === "DEVIATION_2014") {
            var div = L.DomUtil.create('div', 'info legend'),
                grades = [0, 25, 50, 75, 125, 150, 175],
                labels = [];

            for (var i = 0; i < grades.length; i++) {
                div.innerHTML +=
                    '<div class="legend_elem" data-range_start="'+(grades[i]+1)+'" data-range_end="'+grades[i + 1]+'">'+'<div class="legend_icon" style="background:' + getColor_t(grades[i] + 1, metric) + '"></div>' +
                    '<div class="legend_text2">'+(grades[i]+1).format(0, 3, ' ') + (grades[i + 1] ? ' &ndash; ' + (grades[i + 1]).format(0, 3, ' ') + ' %<br>' :'+ %')+'</div></div>';
                }
                return div;
        }
    }
};

legend.addTo(map);

map.on('zoomend', function() {
    $('.playchart_1').remove();
    $('#playchart').hide();
    info.update();

    if (timeSeries != "DEVIATION") {

        if (map.getZoom() <= 9) {
            $('body').addClass('busy');
            adminUnit = "megye";
            $.ajax({
                dataType: "json",
                async: true,
                url: "resources/megye.json",
                success: function(data) {
                    map.removeLayer(geojson);
                    geojson = L.geoJson(data, {
                        style: style,
                        onEachFeature: onEachFeature
                    });
                    geojson.addTo(map);
                },
                error: function() {
                },
                complete: function() {
                    $('body').removeClass('busy');
                }
            });
            map.removeControl(legend)
            legend.addTo(map);
        }
        else if (map.getZoom() <= 11) {
            adminUnit = "kisterseg";
            $('body').addClass('busy');
            $.ajax({
                dataType: "json",
                async: true,
                url: "resources/kisterseg.json",
                success: function(data) {
                    map.removeLayer(geojson);
                    geojson = L.geoJson(data, {
                        style: style,
                        onEachFeature: onEachFeature
                    });
                    geojson.addTo(map);
                },
                error: function() {
                    //alert('Busted!');
                },
                complete: function() {
                    $('body').removeClass('busy');
                }
            });
            map.removeControl(legend)
            legend.addTo(map);
        }
        else {
            adminUnit = "telepules";
            $('body').addClass('busy');
            $.ajax({
                dataType: "json",
                async: true,
                url: "resources/telepules.json",
                success: function(data) {
                    map.removeLayer(geojson);
                    geojson = L.geoJson(data, {
                        style: style,
                        onEachFeature: onEachFeature
                    });
                    geojson.addTo(map);
                },
                error: function() {
                    //alert('Busted!');
                },
                complete: function() {
                    $('body').removeClass('busy');
                }
            });
            map.removeControl(legend)
            legend.addTo(map);
        }
    }
});
var getUrlParameter = function getUrlParameter(sParam) {
    var sPageURL = decodeURIComponent(window.location.search.substring(1)),
        sURLVariables = sPageURL.split('&'),
        sParameterName,
        i;
    for (i = 0; i < sURLVariables.length; i++) {
        sParameterName = sURLVariables[i].split('=');

        if (sParameterName[0] === sParam) {
            return sParameterName[1] === undefined ? true : sParameterName[1];
        }
    }
};

$(document).ready(function(){
    $('.chart').append('<div id="playchart"> \
                            <div class="legend_header">Támogatás összesen:</div> \
                            <div class="legend_subheader"></div> \
                            <div class="chart_legend_a"> \
                                <div class="legend_left legend_chart EU" id="EU"> \
                                    <div class="legend_icon"></div> \
                                    <div class="legend_text">EU 2007-2013 tám. program</div> \
                                </div> \
                                <div class="legend_right legend_chart KTIA" id="KTIA"> \
                                    <div class="legend_icon"></div> \
                                    <div class="legend_text">Kutatási, techn.<br>és innov. alap</div> \
                                </div> \
                                <div class="legend_left legend_chart szechenyi USZ" id="szechenyi"> \
                                    <div class="legend_icon"></div> \
                                    <div class="legend_text">Új Széchenyi<br>Terv</div> \
                                </div> \
                                <div class="legend_right legend_chart ujszechenyi SZ" id="ujszechenyi"> \
                                    <div class="legend_icon"></div> \
                                    <div class="legend_text">Széchenyi<br>2020</div> \
                                </div> \
                                <div class="legend_left legend_chart nemzeti N" id="nemzeti"> \
                                    <div class="legend_icon"></div> \
                                    <div class="legend_text">Nemzeti Fej-<br>lesztési Terv</div> \
                                </div> \
                            </div> \
                            <div class="chart_legend_b"> \
                                <div class="legend_left legend_chart REIGN"> \
                                    <div class="legend_icon"></div> \
                                    <div class="legend_text">Kormánypárti polgármester</div> \
                                </div> \
                                <div class="legend_right legend_chart OPP"> \
                                    <div class="legend_icon"></div> \
                                    <div class="legend_text">Ellenzéki polgármester</div> \
                                </div> \
                                <div class="legend_left legend_chart IND"> \
                                    <div class="legend_icon"></div> \
                                    <div class="legend_text">Független polgármester</div> \
                                </div> \
                                <div class="legend_right legend_chart NA"> \
                                    <div class="legend_icon"></div> \
                                    <div class="legend_text">Nem áll rendel-kezésre információ</div> \
                                </div> \
                            </div> \
                        </div>');

    $.ui.autocomplete.prototype._renderItem = function (ul, item) {
        var img = $("<img class='search_result_thumb'>").attr("src", item.thumbnail_url);

        var srchTerm = this.term.trim().split(/\s+/).join ('|');

        var srchSong = item.song_title
        regexp_song = new RegExp ('(' + srchTerm + ')', "ig");
        var srchSong = srchSong.replace(regexp_song,"<span class='highlighted'>$1</span>");

        var $link = "<div class='search_result_wrap'><div class='search_result_title'>"+srchSong+"</div></div></div>";
        return $("<li>")
            .data( "ui-autocomplete-item", item )
            .append($link)
            .appendTo(ul);
    };

    $(".main_search").autocomplete({
        minlength: 8,
        autofocus: "true",
        appendTo: ".autocomplete_container",
        //source: autocompletelist,
        source: "searchcity?time="+$.now(),
        focus: function( event, ui ) {
            return false;
        },
        select: function( event, ui ) {
            $( ".main_search" ).val( ui.item.song_title );
            if (!telepules) {
                $.ajax({
                    dataType: "json",
                    async: true,
                    url: "resources/telepules_index.json",
                    success: function(data) {
                        telepules = data;
                        indexHamlet = L.geoJson(telepules, {onEachFeature: onEachFeatureIndex});
                    },
                    error: function() {
                        //alert('Busted!');
                    },
                    complete: function() {
                        var searchHamlet = ui.item.song_title;
                        objectSearchedTest = markersById[searchHamlet];

                        if ($('#detailed_overlay').is(':visible')) {
                            coords = toGeoJSON(objectSearchedTest);
                            cityToFind = searchHamlet;
                            $('.left_container').hide();
                            $('.middle_container').hide();
                            $('.ranking_container').hide();
                            $('.leaflet-top.leaflet-right').show();
                            $('.left_button').show();
                            $('.left_button.back').hide();
                            $('.sk-cube-grid').show();
                            overlayState = "plain";
                            hoverState = "off";
                            $('.city_legend').html(cityToFind + "<br>statisztikája");
                            $('#area_legend').hide();
                            $('#percentage').html('');
                            openDetailedLayer();
                            //TO DO: population does not get updated until info.update is called...
                            //info.update(objectSearched['feature']['properties']);
                            //info.update(objectSearchedTest['feature']['properties']);
                        }
                        var coordinates = objectSearchedTest.getBounds().getCenter();
                        var cM = [coordinates.lat, coordinates.lng];
                        map.setView(new L.LatLng(cM[0], cM[1]),12, {animate: true});
                        markersById[searchHamlet].setStyle({
                            weight: 4,
                            color: '#4D8E27',
                            dashArray: '10',
                            fillColor:"url(#hash4_4)",
                            fillOpacity: 0.2
                        });

                        setTimeout (function(){
                            markersById[searchHamlet].setStyle({
                                weight: 4,
                                color: '#4D8E27',
                                dashArray: '10',
                                fillColor:"url(#hash4_4)",
                                fillOpacity: 0.2
                            });
                        },1000);

                        $('.legend_elem').each(function(){
                            $(this).removeClass("legend_featured");
                            if (parseInt($(this).attr('data-range_start')) <= parseInt(objectSearchedTest['feature']['properties'][metric]) && parseInt($(this).attr('data-range_end')) >= parseInt(objectSearchedTest['feature']['properties'][metric])) {
                                $(this).addClass("legend_featured");
                            }
                            else if (parseInt($(this).attr('data-range_start')) <= parseInt(objectSearchedTest['feature']['properties'][metric]) && $(this).attr('data-range_end') === "undefined") {
                                $(this).addClass("legend_featured");
                            }
                        });

                        map.on('movestart', function() {
                            geojson.resetStyle(markersById[searchHamlet]);
                        });
                        info.update(objectSearchedTest['feature']['properties']);
                    }
                });
            }
            else {
                $( ".main_search" ).val( ui.item.song_title );
                var searchHamlet = ui.item.song_title;

                objectSearchedTest = markersById[searchHamlet];

                if ($('#detailed_overlay').is(':visible')) {
                    coords = toGeoJSON(objectSearchedTest);
                    cityToFind = searchHamlet;
                    $('.left_container').hide();
                    $('.middle_container').hide();
                    $('.ranking_container').hide();
                    $('.leaflet-top.leaflet-right').show();
                    $('.left_button').show();
                    $('.left_button.back').hide();
                    $('.sk-cube-grid').show();
                    overlayState = "plain";
                    hoverState = "off";
                    $('.city_legend').html(cityToFind + "<br>statisztikája");
                    $('#area_legend').hide();
                    $('#percentage').html('');
                    openDetailedLayer();
                    //TO DO: population does not get updated until info.update is called...
                    //info.update(objectSearched['feature']['properties']);
                }
                info.update(objectSearchedTest['feature']['properties']);
                var coordinates = objectSearchedTest.getBounds().getCenter();
                var cM = [coordinates.lat, coordinates.lng];
                map.setView(new L.LatLng(cM[0], cM[1]),12, {animate: true});
                markersById[searchHamlet].setStyle({
                    weight: 4,
                    color: '#4D8E27',
                    dashArray: '10',
                    fillColor:"url(#hash4_4)",
                    fillOpacity: 0.2
                });

                setTimeout (function(){
                    markersById[searchHamlet].setStyle({
                        weight: 4,
                        color: '#4D8E27',
                        dashArray: '10',
                        fillColor:"url(#hash4_4)",
                        fillOpacity: 0.2
                    });
                },1000);

                $('.legend_elem').each(function(){
                    $(this).removeClass("legend_featured");
                    if (parseInt($(this).attr('data-range_start')) <= parseInt(objectSearchedTest['feature']['properties'][metric]) && parseInt($(this).attr('data-range_end')) >= parseInt(objectSearchedTest['feature']['properties'][metric])) {
                        $(this).addClass("legend_featured");
                    }
                    else if (parseInt($(this).attr('data-range_start')) <= parseInt(objectSearchedTest['feature']['properties'][metric]) && $(this).attr('data-range_end') === "undefined") {
                        $(this).addClass("legend_featured");
                    }
                });

                map.on('movestart', function() {
                    geojson.resetStyle(markersById[searchHamlet]);
                });

            }
            return false;
        }
    });

    $('#human_logo').hover(function() {
        if (metric != "CAPITA") {
            //$('.playchart_1').remove();
            //$('#playchart').hide();
            $("#human_logo").addClass('hover_logo');

            if (!$('#detailed_overlay').is(':visible') ) {
                $('.popup.leaflet-control').addClass('hover_pop');
                $('.popup.leaflet-control').html('Egy főre jutó évi EU támogatás 2007-2015.');
                $('.popup').append(loader);
                $('#playchart').hide();
            }
        }
    },
    function() {
        $("#human_logo").removeClass('hover_logo');
        if (!$('#detailed_overlay').is(':visible') ) {
            if (!$('body').hasClass('busy')) {
                $('.popup.leaflet-control').removeClass('hover_pop');
            }

            if (metric ==="DONATION") {
                $('.popup.leaflet-control').html('Átlagos évi EU támogatás 2007-2015.');
            }
            else if (metric ==="CAPITA") {
                $('.popup.leaflet-control').html('Egy főre jutó évi EU támogatás 2007-2015.');
                $("#human_logo").addClass('active_logo');
            }
            else if (metric === "DEVIATION_2007") {
                $('.popup.leaflet-control').html('Mo. fő / év átlagához mérve <span class="deviation_years">(2007-2009)</span>');
                //$('.info h4').html('Mo. fő / év átlagához mérve <span class="deviation_years">(2007-2009)</span>');
            }
            else if (metric === "DEVIATION_2010") {
                $('.popup.leaflet-control').html('Mo. fő / év átlagához mérve <span class="deviation_years">(2010-2013)</span>');
                //$('.info h4').html('Mo. fő / év átlagához mérve <span class="deviation_years">(2010-2013)</span>');
            }
            else if (metric === "DEVIATION_2014") {
                $('.popup.leaflet-control').html('Mo. fő / év átlagához mérve <span class="deviation_years">(2014-2015)</span>');
                //$('.info h4').html('Mo. fő / év átlagához mérve <span class="deviation_years">(2014-2015)</span>');
            }
        }
        else if (metric === "CAPITA") {
            $("#human_logo").addClass('active_logo');
        }
    });

    $('#human_logo').on('click', function() {
        $('.party_selector_wrapper').hide();
        if (map.getZoom() <= 9) {
            adminUnit = "megye";
        }
        else if (map.getZoom() <= 11) {
            adminUnit = "kisterseg";
        }
        else {
            adminUnit = "telepules";
        }

        if (metric === "DEVIATION_2007" || metric === "DEVIATION_2010" || metric === "DEVIATION_2014") {
            map.removeLayer(stripes);
        }
        if (metric != "CAPITA") {
            metric = "CAPITA";
            timeSeries = "CAPITA_TIME";

            $('.chart_legend_b').hide();
            $('.chart_legend_a').show();
            $('.spinner').show();
            //map.removeLayer(geojson);
            $('.logo').each(function(){
                $(this).removeClass('active_logo');
                $(this).removeClass('hover_logo');
            });
            $("#human_logo").addClass('active_logo');
            $('.info h4').text('Egy főre jutó EU támogatás (Ft / fő / év)');

            if ($('#detailed_overlay').is(':visible')) {
                if (overlayState != "plain") {
                    detailsHighlight();
                    $('.city_country_pos').text(JSON.parse(JSON.stringify(ranking_country[overlayState][3])));
                    $('.city_county_pos').text(JSON.parse(JSON.stringify(ranking_country[overlayState][2])));
                    render_chart("1", JSON.parse(JSON.stringify(timeSeries_detailed[metricPie])));
                    var selectedValue = $('.info_ammount.original_info').text();
                    $('.info_ammount.original_info').text(((((pieSelected*1000000)/9)/population.slice(-1)[0]['value'])).format(0, 3, " ").toString() + " Ft");
                }
                else {
                    $('.city_country_pos').text(JSON.parse(JSON.stringify(ranking_country['Summa'][3])));
                    $('.city_county_pos').text(JSON.parse(JSON.stringify(ranking_country['Summa'][2])));
                    render_chart("1", JSON.parse(JSON.stringify(timeSeries_detailed['Summa'])));
                    $('.info_ammount.original_info').text(((((detailedSum*1000000)/9)/population.slice(-1)[0]['value'])).format(0, 3, " ").toString() + " Ft");
                }
            }

            if ($('.ranking_container').is(':visible')) {

                if (rankView === "country") {
                    if (overlayState != "plain") {
                        renderRankChart (JSON.parse(JSON.stringify(ranking2["total"][overlayState])));
                    }
                    else {
                        renderRankChart (JSON.parse(JSON.stringify(ranking2["total"]["Summa"])));
                    }
                    var container = $('.ranking_container'),
                    scrollTo = $('#'+cityToFind);

                    scrollTo.parent().trigger('mouseenter');

                    var playlistTop = $('.ranking_container').offset().top;
                    var playlistBottom = playlistTop + $('.ranking_container').height();

                    var elemTop = scrollTo.offset().top;
                    var elemBottom = elemTop + scrollTo.height();

                    if ((elemTop < playlistTop || elemBottom > playlistBottom) && elemTop !== 0 && playlistTop !== 0) {
                        container.animate({
                            scrollTop: scrollTo.offset().top - container.offset().top + container.scrollTop() -250
                        }, 1000);
                    }
                }
                else if (rankView === "county") {

                    if (overlayState != "plain") {
                        var countyRank = $.grep( JSON.parse(JSON.stringify(ranking2["total"][overlayState])), function( n, i ) {
                            return n.county === county;
                        });

                        renderRankChart (countyRank);
                    }
                    else {
                        var countyRank = $.grep( JSON.parse(JSON.stringify(ranking2["total"]["Summa"])), function( n, i ) {
                            return n.county === county;
                        });

                        renderRankChart (countyRank);
                    }
                    var container = $('.ranking_container'),
                    scrollTo = $('#'+cityToFind);

                    scrollTo.parent().trigger('mouseenter');

                    var playlistTop = $('.ranking_container').offset().top;
                    var playlistBottom = playlistTop + $('.ranking_container').height();

                    var elemTop = scrollTo.offset().top;
                    var elemBottom = elemTop + scrollTo.height();

                    if ((elemTop < playlistTop || elemBottom > playlistBottom) && elemTop !== 0 && playlistTop !== 0) {
                        container.animate({
                            scrollTop: scrollTo.offset().top - container.offset().top + container.scrollTop() -250
                        }, 1000);
                    }
                }
            }

            if (adminUnit === "megye") {
                $('body').addClass('busy');
                $.ajax({
                    dataType: "json",
                    async: true,
                    url: "resources/megye.json",
                    delay: 0,
                    success: function(data) {
                        map.removeLayer(geojson);
                        geojson = L.geoJson(data, {
                            style: style,
                            onEachFeature: onEachFeature
                        });
                        geojson.addTo(map);
                    },
                    error: function() {
                    },
                    complete: function() {
                        $('.spinner').remove();
                        $('.popup.leaflet-control').removeClass('hover_pop');
                        $('body').removeClass('busy');
                    }
                });
            }
            else if (adminUnit === "kisterseg") {
                $('body').addClass('busy');
                $.ajax({
                    dataType: "json",
                    async: true,
                    url: "resources/kisterseg.json",
                    delay: 0,
                    success: function(data) {
                        map.removeLayer(geojson);
                        geojson = L.geoJson(data, {
                            style: style,
                            onEachFeature: onEachFeature
                        });
                        geojson.addTo(map);
                    },
                    error: function() {
                    },
                    complete: function() {
                        $('.spinner').remove();
                        $('.popup.leaflet-control').removeClass('hover_pop');
                        $('body').removeClass('busy');
                    }
                });
            }
            else if (adminUnit === "telepules") {
                $('body').addClass('busy');
                $.ajax({
                    dataType: "json",
                    async: true,
                    url: "resources/telepules.json",
                    success: function(data) {
                        map.removeLayer(geojson);
                        geojson = L.geoJson(data, {
                            style: style,
                            onEachFeature: onEachFeature
                        });
                        geojson.addTo(map);
                    },
                    error: function() {
                    },
                    complete: function() {
                        $('.spinner').remove();
                        $('.popup.leaflet-control').removeClass('hover_pop');
                        $('body').removeClass('busy');
                    }
                });
            }
            map.removeControl(legend)
            legend.addTo(map);

        }
    });

    $('#cash_logo').hover(function() {
        if (metric != "DONATION") {
            //$('.playchart_1').remove();
            //$('#playchart').hide();
            $("#cash_logo").addClass('hover_logo');

            if (!$('#detailed_overlay').is(':visible') ) {
                $('.popup.leaflet-control').addClass('hover_pop');
                $('.popup.leaflet-control').html('Átlagos évi EU támogatás 2007-2015.');
                $('.popup').append(loader);
                $('#playchart').hide();
            }
        }
    },
    function() {
        $("#cash_logo").removeClass('hover_logo');

        if (!$('#detailed_overlay').is(':visible') ) {

            if (!$('body').hasClass('busy')) {
                $('.popup.leaflet-control').removeClass('hover_pop');
            }

            if (metric ==="DONATION") {
                $('.popup.leaflet-control').html('Átlagos évi EU támogatás 2007-2015.');
                $("#cash_logo").addClass('active_logo');
            }
            else if (metric ==="CAPITA") {
                $('.popup.leaflet-control').html('Egy főre jutó évi EU támogatás 2007-2015.');
            }
            else if (metric === "DEVIATION_2007") {
                $('.popup.leaflet-control').html('Mo. fő / év átlagához mérve <span class="deviation_years">(2007-2009)</span>');
                //$('.info h4').html('Mo. fő / év átlagához mérve <span class="deviation_years">(2007-2009)</span>');
            }
            else if (metric === "DEVIATION_2010") {
                $('.popup.leaflet-control').html('Mo. fő / év átlagához mérve <span class="deviation_years">(2010-2013)</span>');
                //$('.info h4').html('Mo. fő / év átlagához mérve <span class="deviation_years">(2010-2013)</span>');
            }
            else if (metric === "DEVIATION_2014") {
                $('.popup.leaflet-control').html('Mo. fő / év átlagához mérve <span class="deviation_years">(2014-2015)</span>');
                //$('.info h4').html('Mo. fő / év átlagához mérve <span class="deviation_years">(2014-2015)</span>');
            }
        }
        else {

            if (metric ==="DONATION") {
                $("#cash_logo").addClass('active_logo');
            }
        }
    });

    $('#cash_logo').on('click', function() {
        $('.party_selector_wrapper').hide();
        if (map.getZoom() <= 9) {
            adminUnit = "megye";
        }
        else if (map.getZoom() <= 11) {
            adminUnit = "kisterseg";
        }
        else {
            adminUnit = "telepules";
        }
        if (metric === "DEVIATION_2007" || metric === "DEVIATION_2010" || metric === "DEVIATION_2014") {
            map.removeLayer(stripes);
        }
        if(metric != "DONATION") {
            metric = "DONATION";
            timeSeries = "DONATION_TIME";
            $('.spinner').show();
            $('.chart_legend_b').hide();
            $('.chart_legend_a').show();
            $('.logo').each(function(){
                $(this).removeClass('active_logo');
                $(this).removeClass('hover_logo');
            });
            $("#cash_logo").addClass('active_logo');
            $('.info h4').text('Átlagos EU támogatás (millió Ft / év)');

            if ($('#detailed_overlay').is(':visible')) {
                if (overlayState != "plain") {
                    detailsHighlight();
                    $('.city_country_pos').text(JSON.parse(JSON.stringify(ranking_country[overlayState][0])));
                    $('.city_county_pos').text(JSON.parse(JSON.stringify(ranking_country[overlayState][1])));
                    render_chart("1", JSON.parse(JSON.stringify(timeSeries_detailed[metricPie])));
                    $('.info_ammount.original_info').text((pieSelected/9).format(0, 3, " ").toString() + " millió Ft");
                }
                else {
                    $('.city_country_pos').text(JSON.parse(JSON.stringify(ranking_country['Summa'][0])));
                    $('.city_county_pos').text(JSON.parse(JSON.stringify(ranking_country['Summa'][1])));
                    render_chart("1", JSON.parse(JSON.stringify(timeSeries_detailed['Summa'])));
                    $('.info_ammount.original_info').text((detailedSum/9).format(0, 3, " ").toString() + " millió Ft");
                }
            }

            if ($('.ranking_container').is(':visible')) {

                if (rankView === "country") {
                    if (overlayState != "plain") {
                        renderRankChart (JSON.parse(JSON.stringify(ranking2["total"][overlayState])));
                    }
                    else {
                        renderRankChart (JSON.parse(JSON.stringify(ranking2["total"]["Summa"])));
                    }
                    var container = $('.ranking_container'),
                    scrollTo = $('#'+cityToFind);

                    scrollTo.parent().trigger('mouseenter');

                    var playlistTop = $('.ranking_container').offset().top;
                    var playlistBottom = playlistTop + $('.ranking_container').height();

                    var elemTop = scrollTo.offset().top;
                    var elemBottom = elemTop + scrollTo.height();

                    if ((elemTop < playlistTop || elemBottom > playlistBottom) && elemTop !== 0 && playlistTop !== 0) {
                        container.animate({
                            scrollTop: scrollTo.offset().top - container.offset().top + container.scrollTop() -250
                        }, 1000);
                    }
                }
                else if (rankView === "county") {

                    if (overlayState != "plain") {
                        var countyRank = $.grep( JSON.parse(JSON.stringify(ranking2["total"][overlayState])), function( n, i ) {
                            return n.county === county;
                        });

                        renderRankChart (countyRank);
                    }
                    else {
                        var countyRank = $.grep( JSON.parse(JSON.stringify(ranking2["total"]["Summa"])), function( n, i ) {
                            return n.county === county;
                        });

                        renderRankChart (countyRank);
                    }
                    var container = $('.ranking_container'),
                    scrollTo = $('#'+cityToFind);

                    scrollTo.parent().trigger('mouseenter');

                    var playlistTop = $('.ranking_container').offset().top;
                    var playlistBottom = playlistTop + $('.ranking_container').height();

                    var elemTop = scrollTo.offset().top;
                    var elemBottom = elemTop + scrollTo.height();

                    if ((elemTop < playlistTop || elemBottom > playlistBottom) && elemTop !== 0 && playlistTop !== 0) {
                        container.animate({
                            scrollTop: scrollTo.offset().top - container.offset().top + container.scrollTop() -250
                        }, 1000);
                    }
                }
            }

            if (adminUnit === "megye") {
                $('body').addClass('busy');
                $.ajax({
                    dataType: "json",
                    async: true,
                    url: "resources/megye.json",
                    delay: 0,
                    success: function(data) {
                        map.removeLayer(geojson);
                        geojson = L.geoJson(data, {
                            style: style,
                            onEachFeature: onEachFeature
                        });
                        geojson.addTo(map);
                    },
                    error: function() {
                    },
                    complete: function() {
                        $('.spinner').remove();
                        $('.popup.leaflet-control').removeClass('hover_pop');
                        $('body').removeClass('busy');
                    }
                });
            }
            else if (adminUnit === "kisterseg") {
                $('body').addClass('busy');
                $.ajax({
                    dataType: "json",
                    async: true,
                    url: "resources/kisterseg.json",
                    success: function(data) {
                        map.removeLayer(geojson);
                        geojson = L.geoJson(data, {
                            style: style,
                            onEachFeature: onEachFeature
                        });
                        geojson.addTo(map);
                    },
                    error: function() {
                    },
                    complete: function() {
                        $('.spinner').remove();
                        $('.popup.leaflet-control').removeClass('hover_pop');
                        $('body').removeClass('busy');
                    }
                });
            }
            else if (adminUnit === "telepules") {
                $('body').addClass('busy');
                $.ajax({
                    dataType: "json",
                    async: true,
                    url: "resources/telepules.json",
                    success: function(data) {
                        map.removeLayer(geojson);
                            geojson = L.geoJson(data, {
                            style: style,
                            onEachFeature: onEachFeature
                        });
                        geojson.addTo(map);
                    },
                    error: function() {
                    },
                    complete: function() {
                        $('.spinner').remove();
                        $('.popup.leaflet-control').removeClass('hover_pop');
                        $('body').removeClass('busy');
                    }
                });
            }
            map.removeControl(legend)
            legend.addTo(map);

        }
    });

    $('#bank_logo').hover(function() {
        if (timeSeries != "DEVIATION") {
            $("#bank_logo").addClass('hover_logo');
            //$('.playchart_1').remove();
            //$('#playchart').hide();

            if (!$('#detailed_overlay').is(':visible') ) {
                $('.popup.leaflet-control').addClass('hover_pop');
                $('.popup.leaflet-control').html('Választási ciklus szerinti EU támogatás');
                $('.popup').append(loader);
                $('#playchart').hide();
            }
        }
    },
    function() {
        $("#bank_logo").removeClass('hover_logo');

        if (!$('#detailed_overlay').is(':visible') ) {
            if (!$('body').hasClass('busy')) {
                $('.popup.leaflet-control').removeClass('hover_pop');
            }

            if (metric ==="DONATION") {
                $('.popup.leaflet-control').html('Átlagos évi EU támogatás 2007-2015.');
            }
            else if (metric ==="CAPITA") {
                $('.popup.leaflet-control').html('Egy főre jutó évi EU támogatás 2007-2015.');
            }
            else {
                if (!$('body').hasClass('busy')) {
                    if (metric === "DEVIATION_2007") {
                        $('.popup.leaflet-control').html('Mo. fő / év átlagához mérve <span class="deviation_years">(2007-2009)</span>');
                        //$('.info h4').html('Mo. fő / év átlagához mérve <span class="deviation_years">(2007-2009)</span>');
                    }
                    else if (metric === "DEVIATION_2010") {
                        $('.popup.leaflet-control').html('Mo. fő / év átlagához mérve <span class="deviation_years">(2010-2013)</span>');
                        //$('.info h4').html('Mo. fő / év átlagához mérve <span class="deviation_years">(2010-2013)</span>');
                    }
                    else if (metric === "DEVIATION_2014") {
                        $('.popup.leaflet-control').html('Mo. fő / év átlagához mérve <span class="deviation_years">(2014-2015)</span>');
                        //$('.info h4').html('Mo. fő / év átlagához mérve <span class="deviation_years">(2014-2015)</span>');
                    }
                }
                $("#bank_logo").addClass('active_logo');
            }
        }
        else {
            if (metric != "DONATION" && metric != "CAPITA") {
                $("#bank_logo").addClass('active_logo');
            }
        }
    });

    $('#bank_logo').on('click', function() {
        $('.party_selector_wrapper').show();
        if  (timeSeries != "DEVIATION") {
            $('.spinner').show();
            var chosenParty = $("#party_selector").val();
            metric = chosenParty;
            timeSeries = "DEVIATION";
            adminUnit = "telepules";
            $('body').addClass('busy');

            if ($('#detailed_overlay').is(':visible')) {
                if (overlayState != "plain") {
                    detailsHighlight();
                    $('.playchart_1').remove();
                    render_chart2("1", JSON.parse(JSON.stringify(deviation[metricPie])));
                    if (metric === "DEVIATION_2007") {
                        var value = parseInt(deviation_sum[metricPie]["2007"])
                        $('.info_ammount.original_info').text((value.format(0, 3, " ")).toString() + " %");
                    }
                    else if (metric === "DEVIATION_2010") {
                        var value = parseInt(deviation_sum[metricPie]["2010"])
                        $('.info_ammount.original_info').text((value.format(0, 3, " ")).toString() + " %");
                    }
                    else if (metric === "DEVIATION_2014") {
                        var value = parseInt(deviation_sum[metricPie]["2014"])
                        $('.info_ammount.original_info').text((value.format(0, 3, " ")).toString() + " %");
                    }
                    $('.city_country_pos').text(JSON.parse(JSON.stringify(ranking_country[overlayState][3])));
                    $('.city_county_pos').text(JSON.parse(JSON.stringify(ranking_country[overlayState][2])));
                }
                else {
                    $('.playchart_1').remove();
                    render_chart2("1", JSON.parse(JSON.stringify(deviation['Summa'])));
                    $('.city_country_pos').text(JSON.parse(JSON.stringify(ranking_country['Summa'][3])));
                    $('.city_county_pos').text(JSON.parse(JSON.stringify(ranking_country['Summa'][2])));
                    if (metric === "DEVIATION_2007") {
                        var value = parseInt(deviation_sum['Summa']["2007"])
                        $('.info_ammount.original_info').text((value.format(0, 3, " ")).toString() + " %");
                    }
                    else if (metric === "DEVIATION_2010") {
                        var value = parseInt(deviation_sum['Summa']["2010"])
                        $('.info_ammount.original_info').text((value.format(0, 3, " ")).toString() + " %");
                    }
                    else if (metric === "DEVIATION_2014") {
                        var value = parseInt(deviation_sum['Summa']["2014"])
                        $('.info_ammount.original_info').text((value.format(0, 3, " ")).toString() + " %");
                    }
                }
            }

            $.ajax({
                dataType: "json",
                async: true,
                url: "resources/telepules.json",
                success: function(data) {
                    map.removeLayer(geojson);
                        stripes = L.geoJson(data, {
                        style: stripes_style,
                        onEachFeature: onEachFeature
                    }).addTo(map);

                    geojson = L.geoJson(data, {
                        style: style,
                        onEachFeature: onEachFeature
                    });
                    geojson.addTo(map);
                },
                error: function() {
                },
                complete: function() {
                    $('.spinner').remove();
                    $('.popup.leaflet-control').removeClass('hover_pop');
                    $('body').removeClass('busy');
                    if (!$('#detailed_overlay').is(':visible')) {
                        if (metric === "DEVIATION_2007") {
                            $('.popup.leaflet-control').html('Mo. fő / év átlagához mérve <span class="deviation_years">(2007-2009)</span>');
                            //$('.info h4').html('Mo. fő / év átlagához mérve <span class="deviation_years">(2007-2009)</span>');
                        }
                        else if (metric === "DEVIATION_2010") {
                            $('.popup.leaflet-control').html('Mo. fő / év átlagához mérve <span class="deviation_years">(2010-2013)</span>');
                            //$('.info h4').html('Mo. fő / év átlagához mérve <span class="deviation_years">(2010-2013)</span>');
                        }
                        else if (metric === "DEVIATION_2014") {
                            $('.popup.leaflet-control').html('Mo. fő / év átlagához mérve <span class="deviation_years">(2014-2015)</span>');
                            //$('.info h4').html('Mo. fő / év átlagához mérve <span class="deviation_years">(2014-2015)</span>');
                        }
                    }
                }
            });

            $('.chart_legend_a').hide();
            $('.chart_legend_b').show();
            $('.logo').each(function(){
                $(this).removeClass('active_logo');
                $(this).removeClass('hover_logo');
            });
            $("#bank_logo").addClass('active_logo');

            map.removeControl(legend)
            legend.addTo(map);
        }
    });

    $('#party_selector').on("change", function(){
        var selectedValue = $(this).val();
        if (selectedValue === "DEVIATION_2007") {
            metric = "DEVIATION_2007";
            if (!$('#detailed_overlay').is(':visible') ) {
                $('.popup').html('2007-2009. szerinti EU támogatás');
                $('.popup').append(loader);
            }
            else {
                $('.playchart_1').remove();
                $('.deviation_years').text("(2007-2009)");
                if (overlayState != "plain") {
                    render_chart2("1", JSON.parse(JSON.stringify(deviation[metricPie])));
                    var value = parseInt(deviation_sum[metricPie]["2007"])
                $('.info_ammount.original_info').text((value.format(0, 3, " ")).toString() + " %");
                }
                else {
                    render_chart2("1", JSON.parse(JSON.stringify(deviation['Summa'])));
                    var value = parseInt(deviation_sum['Summa']["2007"])
                    $('.info_ammount.original_info').text((value.format(0, 3, " ")).toString() + " %");
                }
            }
        }
        else if (selectedValue === "DEVIATION_2010") {
            metric = "DEVIATION_2010";
            if (!$('#detailed_overlay').is(':visible') ) {
                $('.popup').html('2010-2013. szerinti EU támogatás');
                $('.popup').append(loader);
            }
            else {
                $('.playchart_1').remove();
                $('.deviation_years').text("(2010-2013)");
                if (overlayState != "plain") {
                    render_chart2("1", JSON.parse(JSON.stringify(deviation[metricPie])));
                    var value = parseInt(deviation_sum[metricPie]["2010"])
                    $('.info_ammount.original_info').text((value.format(0, 3, " ")).toString() + " %");
                }
                else {
                    render_chart2("1", JSON.parse(JSON.stringify(deviation['Summa'])));
                    var value = parseInt(deviation_sum['Summa']["2010"])
                    $('.info_ammount.original_info').text((value.format(0, 3, " ")).toString() + " %");
                }
            }
        }
        else if (selectedValue === "DEVIATION_2014") {
            metric = "DEVIATION_2014";
            if (!$('#detailed_overlay').is(':visible') ) {
                $('.popup').html('2014-2015. szerinti EU támogatás');
                $('.popup').append(loader);
            }
            else {
                $('.playchart_1').remove();
                $('.deviation_years').text("(2014-2015)");
                if (overlayState != "plain") {
                    render_chart2("1", JSON.parse(JSON.stringify(deviation[metricPie])));
                    var value = parseInt(deviation_sum[metricPie]["2014"])
                    $('.info_ammount.original_info').text((value.format(0, 3, " ")).toString() + " %");
                }
                else {
                    render_chart2("1", JSON.parse(JSON.stringify(deviation['Summa'])));
                    var value = parseInt(deviation_sum['Summa']["2014"])
                    $('.info_ammount.original_info').text((value.format(0, 3, " ")).toString() + " %");
                }
            }
        }
        if (!$('#detailed_overlay').is(':visible') ) {
            $('.popup.leaflet-control').addClass('hover_pop');
            $('.spinner').show();
        }
        $('body').addClass('busy');
        $.ajax({
            dataType: "json",
            async: true,
            url: "resources/telepules.json",
            success: function(data) {
                map.removeLayer(stripes);
                map.removeLayer(geojson);

                stripes = L.geoJson(data, {
                    style: stripes_style,
                    onEachFeature: onEachFeature
                }).addTo(map);

                geojson = L.geoJson(data, {
                    style: style,
                    onEachFeature: onEachFeature
                });
                geojson.addTo(map);
            },
            error: function() {
            },
            complete: function() {
                $('.spinner').remove();
                $('.popup.leaflet-control').removeClass('hover_pop');
                $('body').removeClass('busy');
                if (metric === "DEVIATION_2007") {
                    $('.popup.leaflet-control').html('Mo. fő / év átlagához mérve <span class="deviation_years">(2007-2009)</span>');
                    //$('.info h4').html('Mo. fő / év átlagához mérve <span class="deviation_years">(2007-2009)</span>');
                }
                else if (metric === "DEVIATION_2010") {
                    $('.popup.leaflet-control').html('Mo. fő / év átlagához mérve <span class="deviation_years">(2010-2013)</span>');
                    //$('.info h4').html('Mo. fő / év átlagához mérve <span class="deviation_years">(2010-2013)</span>');
                }
                else if (metric === "DEVIATION_2014") {
                    $('.popup.leaflet-control').html('Mo. fő / év átlagához mérve <span class="deviation_years">(2014-2015)</span>');
                    //$('.info h4').html('Mo. fő / év átlagához mérve <span class="deviation_years">(2014-2015)</span>');
                }
            }
        });
    });

    var svg2 = d3.select("body").append("svg").attr("id", "d3svga")
        .attr("width", 120)
        .attr("height", 120);

    var patternSearch = svg2.append("defs")
        .append("pattern")
        .attr({ id:"hash4_4", width:"10", height:"10", patternUnits:"userSpaceOnUse", patternTransform:"rotate(60)"})
        .append("rect")
        .attr({ width:"2", height:"10", transform:"translate(0,0)", fill:"#4D8E27" });

    var patternStripeRuler = svg2.append("defs")
        .append("pattern")
        .attr({ id:"purpleStripe", width:"10", height:"10", patternUnits:"userSpaceOnUse", patternTransform:"rotate(60)"})
        .append("rect")
        //.attr({ width:"2", height:"10", transform:"translate(0,0)", fill:"#876fc1" });
        .attr({ width:"2", height:"10", transform:"translate(0,0)", fill:"rgba(51,51,51,0.9" });

    var patternDotsOpposition = svg2.append("defs")
        .append("pattern")
        .attr({ id:"hash4_5", x:"6", y:"6", width:"8", height:"8", patternUnits:"userSpaceOnUse", patternTransform:"rotate(45)"})
        .append("rect")
        //.attr({ x:"4", y:"4", width:"4", height:"4", transform:"translate(0,0)", fill:"#876fc1" });
        .attr({ x:"4", y:"4", width:"4", height:"4", transform:"translate(0,0)", fill:"rgba(51,51,51,0.9" });

    var patternHexa = svg2.append("defs")
        .append("pattern")
        .attr({ id:"hash4_6", x:"0", y:"0", width:"14", height:"25", patternUnits:"userSpaceOnUse"})
        .append("svg:image")
        .attr({ x:"0", y:"0", width:"14", height:"25"})
        .attr("xlink:href","data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI1NiIgaGVpZ2h0PSIxMDAiPgo8cmVjdCB3aWR0aD0iNTYiIGhlaWdodD0iMTAwIiBmaWxsPSIjZjhkMjAzIj48L3JlY3Q+CjxwYXRoIGQ9Ik0yOCA2NkwwIDUwTDAgMTZMMjggMEw1NiAxNkw1NiA1MEwyOCA2NkwyOCAxMDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iI2ZmZjYyOSIgc3Ryb2tlLXdpZHRoPSIyIj48L3BhdGg+CjxwYXRoIGQ9Ik0yOCAwTDI4IDM0TDAgNTBMMCA4NEwyOCAxMDBMNTYgODRMNTYgNTBMMjggMzQiIGZpbGw9Im5vbmUiIHN0cm9rZT0iI2ZmZTUwMyIgc3Ryb2tlLXdpZHRoPSIyIj48L3BhdGg+Cjwvc3ZnPg==");

    $('.chart').on('mouseleave', function(){
        if (!$('#detailed_overlay').is(':visible') ) {
            $('.playchart_1').remove();
            $('#playchart').hide();
        }
    });

    $(document).on('mouseenter', '.legend_chart', function() {
        var idSelector = String($(this).attr('id'));
        var totalMetric = 0;
        $('.bars').each(function() {
            if ($(this).is('.bars.'+idSelector)) {
                $(this).show();
                var heightB = $(this).attr('height');
                var chartHeight = $("#playchart").height();
                //$(this).attr("y", 195-heightB);
                $(this).attr("y", (chartHeight-155)-heightB);
                if ($(this).attr("height") != "0") {
                    var metricBar = $(this).attr('data-balance');
                    totalMetric += parseInt(metricBar);
                }
            }
            else {
                $(this).hide();
            }
        });
        $('.trendline').hide();
    });

    $(document).on('mouseleave', '.legend_chart', function() {
        var idSelector = String($(this).attr('id'));
        $('.bars').each(function() {
            if ($(this).is('.bars.'+idSelector)) {
                var newyPos = $(this).attr("data-selected");
                $(this).attr('y', newyPos);
                $(this).show();
            }
            else {
                $(this).show();
            }
        });
        $('.trendline').show();
        $('.info_ammount.hidden_info').hide();
        $('.info_ammount.original_info').show();
        $('h4.hidden_info').hide();
        $('h4.original_info').show();
    });

    $('.sk-cube-grid').hide();

    if (getUrlParameter('telepules') ) {
        if (!telepules) {
            $.ajax({
                dataType: "json",
                async: true,
                url: "resources/telepules_index.json",
                success: function(data) {
                    telepules = data;
                    indexHamlet = L.geoJson(telepules, {onEachFeature: onEachFeatureIndex});
                },
                error: function() {
                    //alert('Busted!');
                },
                complete: function() {
                    $('title').text('EU támogatások | '+getUrlParameter('telepules'));
                    $( ".main_search" ).val( getUrlParameter('telepules'));
                    var searchHamlet = getUrlParameter('telepules');
                    var objectSearched = markersById[searchHamlet];
                    var coordinates = objectSearched.getBounds().getCenter();
                    var cM = [coordinates.lat, coordinates.lng];
                    map.setView(new L.LatLng(cM[0], cM[1]),12, {animate: true});
                    markersById[searchHamlet].setStyle({
                        weight: 4,
                        color: '#4D8E27',
                        dashArray: '10',
                        fillColor:"url(#hash4_4)",
                        fillOpacity: 0.2
                    });
                    setTimeout (function(){
                        markersById[searchHamlet].setStyle({
                            weight: 4,
                            color: '#4D8E27',
                            dashArray: '10',
                            fillColor:"url(#hash4_4)",
                            fillOpacity: 0.2
                        });
                        info.update(objectSearched['feature']['properties']);
                    },2000);

                    $('.legend_elem').each(function(){
                        $(this).removeClass("legend_featured");
                        if (parseInt($(this).attr('data-range_start')) <= parseInt(objectSearched['feature']['properties'][metric]) && parseInt($(this).attr('data-range_end')) >= parseInt(objectSearched['feature']['properties'][metric])) {
                            $(this).addClass("legend_featured");
                        }
                        else if (parseInt($(this).attr('data-range_start')) <= parseInt(objectSearched['feature']['properties'][metric]) && $(this).attr('data-range_end') === "undefined") {
                            $(this).addClass("legend_featured");
                        }
                    });

                    map.on('movestart', function() {
                        geojson.resetStyle(markersById[searchHamlet]);
                    });

                    if (getUrlParameter('details')) {
                        var viewToSelect = getUrlParameter('details');
                        if (viewToSelect === "1") {
                            var city_url = getUrlParameter('telepules');
                            map.closePopup();
                            cityToFind = city_url;
                            $('#detailed_overlay').fadeIn(300);
                            $('.sk-cube-grid').show();
                            $('.main_search').val(cityToFind);
                            coords = toGeoJSON(objectSearched);
                            info.update(objectSearched['feature']['properties']);
                            openDetailedLayer();
                        }
                    }
                }
            });
        }
        else {
            $('title').text('EU támogatások | '+getUrlParameter('telepules'));
            $( ".main_search" ).val( getUrlParameter('telepules'));
            var searchHamlet = getUrlParameter('telepules');
            var objectSearched = markersById[searchHamlet];
            var coordinates = objectSearched.getBounds().getCenter();
            var cM = [coordinates.lat, coordinates.lng];
            map.setView(new L.LatLng(cM[0], cM[1]),12, {animate: true});
            markersById[searchHamlet].setStyle({
                weight: 4,
                color: '#4D8E27',
                dashArray: '10',
                fillColor:"url(#hash4_4)",
                fillOpacity: 0.2
            });
            setTimeout (function(){
                markersById[searchHamlet].setStyle({
                    weight: 4,
                    color: '#4D8E27',
                    dashArray: '10',
                    fillColor:"url(#hash4_4)",
                    fillOpacity: 0.2
                });
                info.update(objectSearched['feature']['properties']);
            },2000);

            $('.legend_elem').each(function(){
                $(this).removeClass("legend_featured");
                if (parseInt($(this).attr('data-range_start')) <= parseInt(objectSearched['feature']['properties'][metric]) && parseInt($(this).attr('data-range_end')) >= parseInt(objectSearched['feature']['properties'][metric])) {
                    $(this).addClass("legend_featured");
                }
                else if (parseInt($(this).attr('data-range_start')) <= parseInt(objectSearched['feature']['properties'][metric]) && $(this).attr('data-range_end') === "undefined") {
                    $(this).addClass("legend_featured");
                }
            });

            map.on('movestart', function() {
                geojson.resetStyle(markersById[searchHamlet]);
            });

            if (getUrlParameter('details')) {
                var viewToSelect = getUrlParameter('details');
                if (viewToSelect === "1") {
                    var city_url = getUrlParameter('telepules');
                    map.closePopup();
                    cityToFind = city_url;
                    $('#detailed_overlay').fadeIn(300);
                    $('.sk-cube-grid').show();
                    $('.main_search').val(cityToFind);
                    coords = toGeoJSON(objectSearched);
                    info.update(objectSearched['feature']['properties']);
                    openDetailedLayer();
                }
            }
        }
    }

    if (getUrlParameter('view')) {
        var viewToSelect = getUrlParameter('view');
        if (viewToSelect === "1") {
            metric = "DONATION";
            timeSeries = "DONATION_TIME";
            $('.logo').each(function(){
                $(this).removeClass('active_logo');
                $(this).removeClass('hover_logo');
            });
            $("#cash_logo").addClass('active_logo');
            map.removeControl(legend);
            legend.addTo(map);
            $.ajax({
                dataType: "json",
                async: true,
                url: "resources/megye.json",
                success: function(data) {
                    geojson = L.geoJson(data, {
                        style: style,
                        onEachFeature: onEachFeature
                    });
                    geojson.addTo(map);
                },
                error: function() {
                },
                complete: function() {
                }
            });
        }
        else if (viewToSelect === "2") {
            metric = "CAPITA";
            timeSeries = "CAPITA_TIME";
            $('.logo').each(function(){
                $(this).removeClass('active_logo');
                $(this).removeClass('hover_logo');
            });
            $("#human_logo").addClass('active_logo');
            map.removeControl(legend);
            legend.addTo(map);
            $.ajax({
                dataType: "json",
                async: true,
                url: "resources/megye.json",
                success: function(data) {
                    geojson = L.geoJson(data, {
                        style: style,
                        onEachFeature: onEachFeature
                    });
                    geojson.addTo(map);
                },
                error: function() {
                },
                complete: function() {
                }
            });
        }
        else if (viewToSelect === "3") {
            if (getUrlParameter('year')) {
                var year = parseInt(getUrlParameter('year'));
                if (year < 2010) {
                    metric = "DEVIATION_2007";
                    $("#party_selector").val("DEVIATION_2007");
                }
                else if (year < 2014) {
                    metric = "DEVIATION_2010";
                    $("#party_selector").val("DEVIATION_2010");
                }
                else {
                    metric = "DEVIATION_2014";
                    $("#party_selector").val("DEVIATION_2014");
                }
            }
            else {
                metric = "DEVIATION_2007";
            }
            timeSeries = "DEVIATION";
            adminUnit = "telepules";
            $('.logo').each(function(){
                $(this).removeClass('active_logo');
                $(this).removeClass('hover_logo');
            });
            $("#bank_logo").addClass('active_logo');
            $('.party_selector_wrapper').show();
            map.removeControl(legend);
            legend.addTo(map);
            $.ajax({
                dataType: "json",
                async: true,
                url: "resources/telepules.json",
                success: function(data) {
                    stripes = L.geoJson(data, {
                        style: stripes_style,
                        onEachFeature: onEachFeature
                    }).addTo(map);

                    geojson = L.geoJson(data, {
                        style: style,
                        onEachFeature: onEachFeature
                    });
                    geojson.addTo(map);
                },
                error: function() {
                },
                complete: function() {
                }
            });
            $('.chart_legend_a').hide();
            $('.chart_legend_b').show();
        }
    }
    else {
        $.ajax({
            dataType: "json",
            async: true,
            url: "resources/megye.json",
            success: function(data) {
                geojson = L.geoJson(data, {
                    style: style,
                    onEachFeature: onEachFeature
                });
                geojson.addTo(map);
            },
            error: function() {
            },
            complete: function() {
            }
        });
    }

    if (getUrlParameter('fullview')) {
        var viewToSelect = getUrlParameter('fullview');
        if (viewToSelect === "true") {
            $('#fullview').show();
            map.scrollWheelZoom.disable();
        }
    }

    $(window).on("resize", function() {
        var windowSize = $(this).width();
        if (windowSize < 440) {
            $('.chart').hide();
            $('.search_wrapper').hide();
            //$('.info').css('width', '200px');
            $('#bank_logo').css('margin-right', '0px');
            $('#header').css({'width': 'calc(100% - 63px)', 'left': '63px'});
            $('.logo_wrapper').css('width', '65px');
            $('#header_logo').css({'width': '55px', 'top': '36px', 'left': '5px'});
        }
        else if (windowSize < 700) {
            $('.search_wrapper').hide();
            $('.chart').show();
            //$('.info').css('width', '304px');
            $('#bank_logo').css('margin-right', '5px');
            $('#header').css({'width': 'calc(100% - 165px)', 'left': '165px'});
            $('.logo_wrapper').css('width', '167px');
            $('#header_logo').css({'width': '145px', 'top': '15px', 'left': '10px'});
        }
        else {
            $('.search_wrapper').show();
            $('.chart').show();
            //$('.info').css('width', '304px');
            $('#bank_logo').css('margin-right', '5px');
            $('#header').css({'width': 'calc(100% - 165px)', 'left': '165px'});
            $('.logo_wrapper').css('width', '167px');
            $('#header_logo').css({'width': '145px', 'top': '15px', 'left': '10px'});
        }

        if (windowSize > 680 && windowSize < 1279) {
            var middle = $('.middle_container').clone();
            $('.middle_container').remove();
            $('.center_holder').append(middle);

            $('.left_container').removeClass('small');
            $('.left_container').addClass('medium');

            $('.middle_container').removeClass('small');
            $('.middle_container').addClass('medium');

            $('#playchart').removeClass('small');
            $('#playchart').addClass('medium');

            $('#pie_container').removeClass('small');
            $('#pie_container').addClass('medium');

            $('.areachart_wrapper').removeClass('small');
            $('.areachart_wrapper').addClass('medium');

            $('.right_container').removeClass('small');
            $('.right_container').addClass('medium');
            $('.description_container').removeClass('small');
            $('.info').addClass('medium');

            $('.chartheader').removeClass('small');
            $('.areaheader').removeClass('small');
            $('.rankheader').removeClass('small');

            $('.pos_wrapper').addClass('medium');
            $('.help_icon_container').addClass('medium');

            $('.tutorial_button').addClass('medium');

            $('.center_holder').addClass('medium');

            $('.leaflet-right').removeClass('small');

            if ($('#detailed_overlay').is(':visible')) {
                detailsResetHighlight ();
                if (metric === "DONATION") {
                    $('.playchart_1').remove();
                    render_chart("1", JSON.parse(JSON.stringify(timeSeries_detailed['Summa'])));
                    renderPie(pieData);
                    renderAreaChart(JSON.parse(JSON.stringify(population)), "#FFFFFF");
                }
                else if (metric === "CAPITA") {
                    $('.playchart_1').remove();
                    render_chart("1", JSON.parse(JSON.stringify(timeSeries_detailed['Summa'])));
                    renderPie(pieData);
                    renderAreaChart(JSON.parse(JSON.stringify(population)), "#FFFFFF");

                }
                else {
                    $('.playchart_1').remove();
                    render_chart2("1", JSON.parse(JSON.stringify(deviation['Summa'])));
                    renderPie(pieData);
                    renderAreaChart(JSON.parse(JSON.stringify(population)), "#FFFFFF");
                }
            }

        }
        else if (windowSize <= 680) {
            var middle = $('.middle_container').clone();
            $('.middle_container').remove();
            $('.center_holder').append(middle);

            $('.left_container').removeClass('medium');
            $('.left_container').addClass('small');

            $('.middle_container').removeClass('medium');
            $('.middle_container').addClass('small');

            $('.right_container').addClass('small');
            $('.description_container').addClass('small');
            $('.info').removeClass('medium');
            $('#playchart').removeClass('medium');

            $('#pie_container').removeClass('medium');
            $('#pie_container').addClass('small');

            $('.areachart_wrapper').removeClass('medium');
            $('.areachart_wrapper').addClass('small');

            $('.chartheader').addClass('small');
            $('.areaheader').addClass('small');
            $('.rankheader').addClass('small');

            $('.pos_wrapper').addClass('medium');
            $('.help_icon_container').addClass('medium');

            $('.tutorial_button').addClass('medium');

            $('.center_holder').addClass('medium');

            $('.leaflet-right').addClass('small');

            if ($('#detailed_overlay').is(':visible')) {
                detailsResetHighlight ();
                if (metric === "DONATION") {
                    $('.playchart_1').remove();
                    render_chart("1", JSON.parse(JSON.stringify(timeSeries_detailed['Summa'])));
                    renderPie(pieData);
                    renderAreaChart(JSON.parse(JSON.stringify(population)), "#FFFFFF");
                }
                else if (metric === "CAPITA") {
                    $('.playchart_1').remove();
                    render_chart("1", JSON.parse(JSON.stringify(timeSeries_detailed['Summa'])));
                    renderPie(pieData);
                    renderAreaChart(JSON.parse(JSON.stringify(population)), "#FFFFFF");

                }
                else {
                    $('.playchart_1').remove();
                    render_chart2("1", JSON.parse(JSON.stringify(deviation['Summa'])));
                    renderPie(pieData);
                    renderAreaChart(JSON.parse(JSON.stringify(population)), "#FFFFFF");
                }
            }
        }
        else {
            var right = $('.right_container').clone();
            $('.right_container').remove();
            $('.center_holder').append(right);

            $('.left_container').removeClass('medium');
            $('.left_container').removeClass('small');

            $('.middle_container').removeClass('medium');
            $('.middle_container').removeClass('small');

            $('.right_container').removeClass('small');
            $('.right_container').removeClass('medium');
            $('.description_container').removeClass('small');

            $('#pie_container').removeClass('medium');
            $('#pie_container').removeClass('small');

            $('.areachart_wrapper').removeClass('medium');
            $('.areachart_wrapper').removeClass('small');
            $('.info').removeClass('medium');
            $('#playchart').removeClass('medium');

            $('.chartheader').removeClass('small');
            $('.areaheader').removeClass('small');
            $('.rankheader').removeClass('small');

            $('.pos_wrapper').removeClass('medium');
            $('.help_icon_container').removeClass('medium');

            $('.tutorial_button').removeClass('medium');

            $('.center_holder').removeClass('medium');

            $('.leaflet-right').removeClass('small');

            if ($('#detailed_overlay').is(':visible')) {
                detailsResetHighlight ();
                if (metric === "DONATION") {
                    $('.playchart_1').remove();
                    render_chart("1", JSON.parse(JSON.stringify(timeSeries_detailed['Summa'])));
                    renderPie(pieData);
                    renderAreaChart(JSON.parse(JSON.stringify(population)), "#FFFFFF");
                }
                else if (metric === "CAPITA") {
                    $('.playchart_1').remove();
                    render_chart("1", JSON.parse(JSON.stringify(timeSeries_detailed['Summa'])));
                    renderPie(pieData);
                    renderAreaChart(JSON.parse(JSON.stringify(population)), "#FFFFFF");

                }
                else {
                    $('.playchart_1').remove();
                    render_chart2("1", JSON.parse(JSON.stringify(deviation['Summa'])));
                    renderPie(pieData);
                    renderAreaChart(JSON.parse(JSON.stringify(population)), "#FFFFFF");
                }
            }
        }
    });

    var windowSize = $(window).width();
    if (windowSize < 440) {
        $('.chart').hide();
        $('.search_wrapper').hide();
        //$('.info').css('width', '200px');
        $('.legend_featured').css('width', '80%');
        $('#bank_logo').css('margin-right', '0px');
        $('#header').css({'width': 'calc(100% - 63px)', 'left': '63px'});
        $('.logo_wrapper').css('width', '65px');
        $('#header_logo').css({'width': '55px', 'top': '36px', 'left': '5px'});
    }
    else if (windowSize < 700) {
        $('.search_wrapper').hide();
        $('.chart').show();
        //$('.info').css('width', '304px');
        $('#bank_logo').css('margin-right', '5px');
        $('#header').css({'width': 'calc(100% - 165px)', 'left': '165px'});
        $('.logo_wrapper').css('width', '167px');
        $('#header_logo').css({'width': '145px', 'top': '15px', 'left': '10px'});
    }
    else {
        $('.search_wrapper').show();
        $('.chart').show();
        //$('.info').css('width', '304px');
        $('#bank_logo').css('margin-right', '5px');
        $('#header').css({'width': 'calc(100% - 165px)', 'left': '165px'});
        $('.logo_wrapper').css('width', '167px');
        $('#header_logo').css({'width': '145px', 'top': '15px', 'left': '10px'});
    }

    if (windowSize > 680 && windowSize < 1279) {
        var middle = $('.middle_container').clone();
        $('.middle_container').remove();
        $('.center_holder').append(middle);

        $('.left_container').removeClass('small');
        $('.left_container').addClass('medium');

        $('.middle_container').removeClass('small');
        $('.middle_container').addClass('medium');

        $('#playchart').removeClass('small');
        $('#playchart').addClass('medium');

        $('#pie_container').removeClass('small');
        $('#pie_container').addClass('medium');

        $('.areachart_wrapper').removeClass('small');
        $('.areachart_wrapper').addClass('medium');

        $('.right_container').removeClass('small');
        $('.right_container').addClass('medium');
        $('.info').addClass('medium');
        $('.description_container').removeClass('small');

        $('.pos_wrapper').addClass('medium');
        $('.help_icon_container').addClass('medium');

        $('.tutorial_button').addClass('medium');

        $('.center_holder').addClass('medium');

        $('.leaflet-right').removeClass('small');

    }
    else if (windowSize <= 680) {

        var middle = $('.middle_container').clone();
        $('.middle_container').remove();
        $('.center_holder').append(middle);

        $('.left_container').removeClass('medium');
        $('.left_container').addClass('small');

        $('.middle_container').removeClass('medium');
        $('.middle_container').addClass('small');

        $('.right_container').addClass('small');
        $('.description_container').addClass('small');

        $('#pie_container').removeClass('medium');
        $('#pie_container').addClass('small');

        $('.areachart_wrapper').removeClass('medium');
        $('.areachart_wrapper').addClass('small');

        $('.chartheader').addClass('small');
        $('.areaheader').addClass('small');
        $('.rankheader').addClass('small');

        $('.pos_wrapper').addClass('medium');
        $('.help_icon_container').addClass('medium');

        $('.tutorial_button').addClass('medium');

        $('.center_holder').addClass('medium');

        $('.leaflet-right').addClass('small');
    }
    else {
        var right = $('.right_container').clone();
        $('.right_container').remove();
        $('.center_holder').append(right);

        $('.left_container').removeClass('medium');
        $('.left_container').removeClass('small');

        $('.middle_container').removeClass('medium');
        $('.middle_container').removeClass('small');

        $('.right_container').removeClass('small');
        $('.description_container').removeClass('small');

        $('#pie_container').removeClass('medium');
        $('#pie_container').removeClass('small');

        $('.areachart_wrapper').removeClass('medium');
        $('.areachart_wrapper').removeClass('small');

        $('.pos_wrapper').removeClass('medium');
        $('.help_icon_container').removeClass('medium');

        $('.tutorial_button').removeClass('medium');

        $('.center_holder').removeClass('medium');

        $('.leaflet-right').removeClass('small');

    }

    $('#close_overlay').on('click touchstart', function(){
        $('#detailed_overlay').fadeOut(300);
        $('#close_overlay').hide(300);
        $('.left_container').hide(300);
        $('.middle_container').hide(300);
        $('.ranking_container').hide(300);
        $('.leaflet-top.leaflet-right').show(300);
        $('.left_button').show();
        $('.left_button.back').hide();
        $('#area_legend').hide();
        $('#percentage').html('');
        overlayState = "plain";
        hoverState = "off";
        $('.chart').html($('#playchart').clone());
        $('.chart').show();
    });

    $(document).on('mouseover', '.leaflet-popup', function(){
        var city = $('.popupButton').attr('data-uid');
        var layer = markersById[city];
        layer.fireEvent('mouseover');
    });

    $(document).on('mouseout', '.leaflet-popup', function(){
        var city = $('.popupButton').attr('data-uid');
        var layer = markersById[city];
        if ($('#detailed_overlay:hover').length === 0) {
            layer.fireEvent('mouseout');
        }
    });

    $('.pos_wrapper').on('mouseenter', function(){
        $(this).children('.header').addClass("hover_state");
    });

    $('.pos_wrapper').on('mouseleave', function(){
        $(this).children('.header').removeClass("hover_state");
    });

    $(document).on('click touchstart', '.popupButton', function(){
        map.closePopup();
        $('#detailed_overlay').fadeIn(300);
        $('.sk-cube-grid').show();
        cityToFind = $(this).attr('data-uid');
        $('.main_search').val(cityToFind);
        geojson.resetStyle(markersById[cityToFind]);
        openDetailedLayer();
    });

    $('.pos_wrapper').on('click', function() {
        if ($(this).hasClass('county_pos')) {
            rankView = "county";
            //if (metric === "DONATION" || metric === "CAPITA") {

                if (overlayState != "plain") {

                    var countyRank = $.grep( JSON.parse(JSON.stringify(ranking2["total"][overlayState])), function( n, i ) {
                        return n.county === county;
                    });

                    renderRankChart (countyRank);
                }
                else {
                    var countyRank = $.grep( JSON.parse(JSON.stringify(ranking2["total"]["Summa"])), function( n, i ) {
                        return n.county === county;
                    });

                    renderRankChart (countyRank);
                }
            //}
        }
        else {
            rankView = "country";
            //if (metric === "DONATION" || metric === "CAPITA") {

                if (overlayState != "plain") {
                    renderRankChart (JSON.parse(JSON.stringify(ranking2["total"][overlayState])));
                }
                else {
                    renderRankChart (JSON.parse(JSON.stringify(ranking2["total"]["Summa"])));
                }
            //}
        }
        if (overlayState != "plain") {
            $('#rankheader_category').text(overlayState);
            if (metric === "DONATION") {
                $("#rankingmetric").text("millió Ft / év");
            }
            else if (metric === "CAPITA") {
                $("#rankingmetric").text("Ft / fő / év");
            }
            else {
                $("#rankingmetric").text("országos átlaghoz mérve, 2007-2015, %");
            }
        }
        else {
            $('#rankheader_category').text("Összes támogatás");
            if (metric === "DONATION") {
                $("#rankingmetric").text("millió Ft / év");
            }
            else if (metric === "CAPITA") {
                $("#rankingmetric").text("Ft / fő / év");
            }
            else {
                $("#rankingmetric").text("országos átlaghoz mérve, 2007-2015, %");
            }
        }

        $('.middle_container').hide(300);
        $('.leaflet-top.leaflet-right').hide(300);
        $('.right_container').hide();
        $('.ranking_container').show(300);
        $('.left_button').hide();
        $('.left_button.back').show();


        var container = $('.ranking_container'),
            scrollTo = $('#'+cityToFind);

        scrollTo.parent().trigger('mouseenter');

        var playlistTop = $('.ranking_container').offset().top;
        var playlistBottom = playlistTop + $('.ranking_container').height();

        var elemTop = scrollTo.offset().top;
        var elemBottom = elemTop + scrollTo.height();

        if ((elemTop < playlistTop || elemBottom > playlistBottom) && elemTop !== 0 && playlistTop !== 0) {
            container.animate({
                scrollTop: scrollTo.offset().top - container.offset().top + container.scrollTop() -250
            }, 1000);
        }

    });

    $('.left_button.back').on('click', function() {
        $('.ranking_container').hide(300);
        $('.middle_container').show(300);
        $('.right_container').show();
        //$('.leaflet-top.leaflet-right').show(300);
        $('.left_button').show();
        $('.left_button.back').hide();
    });

    $(document).on('mouseenter', ".rankBar", function(){
        $('.rankingText').attr("class", "rankingText");
        $("tr").removeClass('row-selected');
        $('.rankBar').each(function() {
            $(this).attr('class', 'rankBar fade');
        });
        $(this).attr('class', 'rankBar');
        var cityname = $(this).attr("data-uid");
        $("tr:contains('"+cityname+"')").addClass("row-selected");
        $('.rankingText[data-uid="'+cityname+'"').attr("class", "rankingText text-selected");
    });

    $(document).on('mouseleave', ".rankBar", function(){
        $('.rankBar').each(function() {
            $(this).attr('class', 'rankBar');
        });
        $('.rankingText').attr("class", "rankingText");
        $("tr").removeClass('row-selected');
    });

    $(document).on('mouseenter', "tr", function(){
        $('.rankingText').attr("class", "rankingText");
        $("tr").removeClass('row-selected');
        $(this).addClass("row-selected");
        $('.rankBar').each(function() {
            $(this).attr('class', 'rankBar fade');
        });
        var cityname = $(this).children("td").eq(1).text();
        $(".rankBar[data-uid='"+cityname+"'").attr('class', 'rankBar');
        $("tr:contains('"+cityname+"')").addClass("row-selected");
        $('.rankingText[data-uid="'+cityname+'"').attr("class", "rankingText text-selected");
    });

    $(document).on('mouseleave', "tr", function(){
        $(this).removeClass("row-selected");
        $('.rankBar').each(function() {
            $(this).attr('class', 'rankBar');
        });
        $('.rankingText').attr("class", "rankingText");
        $("tr").removeClass('row-selected');
    });

    $(document).on('click', '.tutorial_button', function(){
        $('body').chardinJs('toggle');
    });

    $(document).on('click', '.chardinjs-show-element', function(){
        $('body').chardinJs('stop');
    });

    $(document).on('click', '.chardinjs-helper-layer', function(){
        $('body').chardinJs('stop');
    });

    var legendTimeout;
    $('.legend_left.country_legend').on('mouseover', function (event) {
        if (legendTimeout) {
            clearTimeout(legendTimeout);
        }
        event.stopPropagation();
        //$('.area_cap.county').fadeOut(300);
        $('.area_cap.county').hide();
         $('.area_cap.country').show();
    });

    $('.legend_left.country_legend').on('mouseleave', function (event) {
        legendTimeout = setTimeout($.proxy(function(){
            //$('.area_cap.county').fadeIn(300);
            $('.area_cap.country').show();
            $('.area_cap.county').show();
        }, this),100);
    });

    $('.legend_right.county_legend').on('mouseover', function (event) {
        if (legendTimeout) {
            clearTimeout(legendTimeout);
        }
        event.stopPropagation();
        //$('.area_cap.country').fadeOut(300);
        $('.area_cap.country').hide();
        $('.area_cap.county').show();
    });

    $('.legend_right.county_legend').on('mouseleave', function (event) {
        legendTimeout = setTimeout($.proxy(function(){
            //$('.area_cap.country').fadeIn(300);
            $('.area_cap.country').show();
            $('.area_cap.county').show();
        }, this),100);
    });

    $('.legend_left.city_legend_wrapper').on('mouseover', function (event) {
        if (legendTimeout) {
            clearTimeout(legendTimeout);
        }
        event.stopPropagation();
        //$('.area_cap.country').fadeOut(300);
        //$('.area_cap.county').fadeOut(300);
        $('.area_cap.country').hide();
        $('.area_cap.county').hide();
    });

    $('.legend_left.city_legend_wrapper').on('mouseleave', function (event) {
        legendTimeout = setTimeout($.proxy(function(){
            //$('.area_cap.country').fadeIn(300);
            //$('.area_cap.county').fadeIn(300);
            $('.area_cap.country').show();
            $('.area_cap.county').show();
        }, this),100);
    });
});