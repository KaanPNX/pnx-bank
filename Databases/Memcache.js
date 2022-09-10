var Memcached = require('memcached');
var memcached = new Memcached('localhost:11211', {retries:10,retry:10000,remove:true,failOverServers:['192.168.0.103:11211']});

module.exports = memcached;