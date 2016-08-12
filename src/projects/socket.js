// socket.js
var server = require("NetworkJS").create({
  create : function(host,port) {
    // Create a socket and return its index, host is a string, port is an integer.
    // If host isn't defined, create a server socket
    console.log("Create",host,port);
    return 1;
  },
  close : function(sckt) {
    // Close the socket. returns nothing
  },
  accept : function(sckt) {
    // Accept the connection on the server socket. Returns socket number or -1 if no connection
    return -1;
  },
  recv : function(sckt, maxLen) {
    // Receive data. Returns a string (even if empty).
    // If non-string returned, socket is then closed
    return null;//or "";
  },
  send : function(sckt, data) {
    // Send data (as string). Returns the number of bytes sent - 0 is ok.
    // Less than 0
    return data.length;
  }
});

server.create('foo', 1234);