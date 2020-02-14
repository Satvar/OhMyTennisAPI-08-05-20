const db_library = require("../_helpers/db_library");

function calculateLocationRadius(longitude, latitude, code_postal, rayon) {
  return new Promise(async (resolve, reject) => {
    var query =
      "SELECT DISTINCT(c.Code_postal),(6371 * acos (cos ( radians(" +
      latitude +
      ") )* cos( radians( SUBSTRING_INDEX(c.coordonnees_gps, ',', -1) ) )* cos( radians( SUBSTRING_INDEX(c.coordonnees_gps, ',',1) ) - radians(" +
      longitude +
      ") )+ sin ( radians(" +
      latitude +
      ") )* sin( radians( SUBSTRING_INDEX(c.coordonnees_gps, ',', -1) ) ))) AS distance, c.coordonnees_gps FROM cities c HAVING (distance > 0 AND distance <= 20) ORDER BY distance ASC";
    db_library.execute(query).then(value => {
      if (value.length > 0) {
        var postal_code = [];
        for (let index = 0; index < value.length; index++) {
          postal_code.push(value[index].Code_postal);
        }
      } else {
        postal_code = [];
      } // End of value.length=0
      resolve(postal_code);
    });
  }); // End of Promise Function
}

module.exports = calculateLocationRadius;
