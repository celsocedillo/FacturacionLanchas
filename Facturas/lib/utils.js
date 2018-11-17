
exports.cleanObjects = function(array) {
    array.forEach(x => {
      for(let key in x) {
        if (x[key] === "") {
           x[key] = null;
        }
      }
    })
}