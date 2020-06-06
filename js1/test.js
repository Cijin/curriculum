const solution = require('./4').solution

let calls = []
solution((e) => {
    calls.push(e)
    return e > 5;
})