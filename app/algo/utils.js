let MersenneTwisterClass = require('./rng');
const MersenneTwister = new MersenneTwisterClass();
let shuffle = (array) => {
    let c_idx = array.length,temp_val,r_idx;

    while(0 != c_idx){
        r_idx = Math.floor(MersenneTwister.random()*c_idx);
        c_idx -= 1;
        temp_val = array[c_idx];
        array[c_idx] = array[r_idx];
        array[r_idx] = temp_val;
    }
    return array;
}

module.exports = {
    shuffle:shuffle
}