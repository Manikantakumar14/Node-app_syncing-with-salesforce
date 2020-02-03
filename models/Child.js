const { Pool, Client } = require('pg')
const connectionString = 'postgres://mafltrptbyumej:56d4c0065c6583486e7e62b47bb3eb6e5f7964fde2f8e7725fe4095776df6e2c@ec2-54-225-129-101.compute-1.amazonaws.com:5432/dforc3isj19lkq?ssl=true'
const pool = new Pool({
  connectionString: connectionString,
})

exports.findOnGender = (req, res, next, genderquery, agequery, countryquery) => {
  const values = ['Available'];
if(genderquery=="1"){
  var dollar = values.length+1;
  var gentext = ' AND gender__c in ($' + dollar + ') ';
  values.push('Girl');
  // var genq = ''Girl'';
}
else if(genderquery=="2"){
  var dollar = values.length+1;
  var gentext = ' AND gender__c in ($' + dollar + ') ';
  values.push('Boy');
  // var genq = ''Boy'';
}
else{
  var gentext = "";
  var genq = '';
}




if(agequery=="1"){
  var agetext = ' AND age__c between 0 and 3 '
}
else if(agequery=="2"){
  var agetext = ' AND age__c between  4 and 8 '
}
else if(agequery=="3"){
  var agetext = ' AND age__c between  9 and 13 '
}
else if(agequery=="4"){
  var agetext = ' AND age__c between  14 and 16 '
}
else{
  var agetext = ''
}


if(countryquery!="0"){
  var doll = values.length+1;
  counttext =' AND country_name__c in ($' + doll + ') ';
  values.push(countryquery);
  
}
else{
  counttext = ''
  countryquery = ''
}

// console.log(agetext);
// console.log(genq);
// console.log(gentext+'helo');

  const text = 'SELECT * FROM salesforcestaging.child__c where status__c in ($1)' + gentext  + agetext  + counttext  + 'ORDER BY id ASC limit 10'
  
  console.log(text);
  console.log(values);
  return new Promise(function (resolve, reject){
      pool.query(text, values, (err, res) => {
          if (err) {
              // logger.error('Error retrieving from db: ' + err);
              console.log('Error retrieving from db: ' + err);
              reject(0)
              return 0;
          }
          else{
            // console.log('id' + res.rows[0]) //This gives me the value to console.
                resolve(res.rows)
              return res.rows;
          }
      })
  })



// pool.query('SELECT * FROM salesforcestaging.child__c ORDER BY id ASC LIMIT 100', (err, res) => {
//    return(res);
 
// });
}


exports.findAll = (req, res, next) => {
  const text = 'SELECT * FROM salesforcestaging.child__c where status__c in ($1) ORDER BY id ASC limit 10'
  const values = ['Available']
  
  return new Promise(function (resolve, reject){
      pool.query(text, values, (err, res) => {
          if (err) {
              logger.error('Error retrieving from db: ' + err);
              console.log('Error retrieving from db: ' + err);
              reject(0)
              return 0;
          }
          else{
            // console.log('id' + res.rows[0]) //This gives me the value to console.
                resolve(res.rows)
              return res.rows;
          }
      })
  })



// pool.query('SELECT * FROM salesforcestaging.child__c ORDER BY id ASC LIMIT 100', (err, res) => {
//    return(res);
 
// });
}



// const pool = new Pool({
//   connectionString: connectionString,
// })

// var Child = {
//     findAll: function(callback) {
//         pool.query("SELECT * FROM salesforcestaging.child__c ORDER BY id ASC LIMIT 100"), function(err,result) {
//             done(err);
//             console.log("hello connected");
//             console.log(JSON.stringify(result));
//             callback(err, result.rows);
//         }
//     }


// }


