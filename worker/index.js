const keys = require('./keys');
const redis = require('redis');

const redisClient = redis.createClient({

    host: keys.redisHost,
    port: keys.redisPort,
    retry_strategy: () => 1000
});

function fib(index, memo = {}) {
    
    if(index in memo) return memo[index];
    if(index <= 2) return 1;
    memo[index] = fib(index - 1) + fib(index - 2);
    return memo[index];
}

const subscription = redisClient.duplicate();

// store in values, the index and fib value for that index

subscription.on('message', (channel, message) => {

    redisClient.hset('values', message, fib(parseInt(message)));
});

// 'insert' will cause a 'message' when a record is inserted
subscription.subscribe('insert');

