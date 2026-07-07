const dns = require("dns");

dns.resolveSrv(
  "_mongodb._tcp.ecommerce-cluster.dwywmyd.mongodb.net",
  (err, records) => {
    if (err) {
      console.error(err);
    } else {
      console.log(records);
    }
  },
);
