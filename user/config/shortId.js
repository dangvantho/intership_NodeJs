const shortId = require("short-id");
shortId.configure({
  length: 20, // The length of the id strings to generate
  algorithm: "sha1", // The hashing algoritm to use in generating keys
  salt: Math.random, // A salt value or function
});
module.exports = shortId;
