var distance = require('google-distance');
distance.apiKey = 'AIzaSyBzsoP0MjQQaObyJWw3628BjDro5bY1PRk';

// origin: '12.935164,80.233645',
// destination: '13.006806,80.240063'

var find_travel_info = function(origin,destination,mode,callback)
{
    distance.get(
    {
      origin: origin,
      destination: destination,
      mode: mode,
      units: 'metric'
    },
    function(err, data) {
      if (err) return callback(err,{});
      return callback(err,data);
    });
}

module.exports = find_travel_info;
