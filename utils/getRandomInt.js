const getRandomInt = (min, max) => {
    return Math.floor(Math.random() * (max - min)) + min;
}

exports.getRandomInt = getRandomInt