function buildVis(div, options) {
  options = options || {}
  options.url = options.url || 'streaks.csv'
  options.start = options.start || new Date('2008-01-01')
  d3.csv(options.url)
    .row(function(d) { return {login: d.login, date: d.date}; })
    .get(function(error, rows) {
      var userDates = {},
          data = [];
      for (var i = rows.length - 1; i >= 0; i--) {
        userDates[rows[i].login] = userDates[rows[i].login] || []
        userDates[rows[i].login].push(new Date(rows[i].date))
      }
      for (var key in userDates) {
        data.push({
          name: key,
          dates: userDates[key]
        })
      }
      data.sort(function(a,b) {
        if ( a.dates.length < b.dates.length) return 1;
        if ( b.dates.length < a.dates.length) return -1;
        return 0;
      })
      var color = d3.scale.category20();
      window.eventDropsChart = d3.chart.eventDrops()
        .eventLineColor(function (datum, index) {
          return color(index);
        })
        .start(options.start)
        .width(window.innerWidth - 50);
      d3.select(div)
        .datum(data)
        .call(eventDropsChart);
    });
}
