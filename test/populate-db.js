function r(url, options) {
  console.log('request', url, options);
  return new Promise(function (resolve, reject) {
    if (!options) {
      options = {}
    }
    var xhr = new XMLHttpRequest();
    xhr.open(options.method || "GET", url);
    xhr.setRequestHeader("content-type", "application/json");
    if (options.data) {
      xhr.send(JSON.stringify(options.data));
    } else {
      xhr.send();
    }


    xhr.onload = function () {
      if (this.status >= 200 && this.status < 300) {
        // Performs the function "resolve" when this.status is equal to 2xx
        resolve(this.response);
      } else {
        // Performs the function "reject" when this.status is different than 2xx
        reject(this.statusText);
      }
    };
    xhr.onerror = function () {
      reject(this.statusText);
    };

  });
}
var count = 50;
var docs = [];
while (count--) {
  var doc = {
    "docType": "user",
    "name": "User" + count,
    "email": `user-${count}@gmail.com`,
    "address": "647 Kakzut Glen",
    "city": "Bigojzi",
    "state": "TX",
    "geo": "-41.1074, 95.56362",
    "avatar": "//www.gravatar.com/avatar/acf986bfb3ea9a406e5c71757e95b335",
    "description": "Wi hofpuec wu divfifav ca zafo darutjo zaigerer mob cepkaz idopaeg efbi lar pecolgan hut. Meedfug no vazhaf vogdanlo nipiaku tov sukkido tu korvefduh lahtip ib ivhorki zobacham fufivsen ge. Fedker dul vuat nigip rewu cod ipzidiv biji din nero kib libodo gusaca tipes. Kanrus jo wifo jentuzir ciwgah ka cos id wudu peldit pukzo ma aziseum."
  };
  //var myRequest = new Request('http://localhost:4987/apphub-microapp-seed', {method: 'POST', body: JSON.stringify(obj), credentials: 'same-origin'});
  //fetch(myRequest).then(resp => resp.json()).then(json => console.log(json));
  docs.push(doc);

  //TODO - If data is to large Need to post per document
  //r('/api/db', { method: 'POST', data: doc}).then(json => console.log(json))
}
r('/api/db/_bulk_docs', {
  method: 'POST',
  data: docs
}).then(json => console.log(json))
//var myRequest = new Request('/api/db', {method: 'POST', body: JSON.stringify(obj), credentials: 'same-origin'});
//fetch(myRequest).then(resp => resp.json()).then(json => console.log(json));
