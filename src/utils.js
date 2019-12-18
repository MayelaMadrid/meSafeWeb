export const fileToBase64 = (filename, filepath) => {
  return new Promise(resolve => {
    var file = new File([filename], filepath);
    var reader = new FileReader();
    // Read file content on file loaded event
    reader.onload = function (event) {
      resolve(event.target.result);
    };

    // Convert data to base64 
    reader.readAsDataURL(file);
  });
};


export const findColorByType = (type) => {
  if (type === "5dedecb8406b030ee5d9c041") return "Asalto";
  if (type === "5dedecb8406b030ee5d9c042") return "Robo";
  if (type === "5dedecb8406b030ee5d9c043") return "Tiroteo";
  if (type === "5dedecb8406b030ee5d9c044") return "Acoso";
  if (type === "5deeccd1c19d9931909c53fa") return "Emergencia";
  if (type === "5deecd51c19d9931909c53fb") return "Precaución";
  return "Sin especificación";
}

var rad = function (x) {
  return x * Math.PI / 180;
};

export var getDistance = function (p1, p2) {
  var R = 6378137;
  var dLat = rad(p2.lat - p1.lat);
  var dLong = rad(p2.lng - p1.lng);
  var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(rad(p1.lat)) * Math.cos(rad(p2.lat)) *
    Math.sin(dLong / 2) * Math.sin(dLong / 2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  var d = R * c;
  return d;
};