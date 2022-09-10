/** @format */

const path = require("path");

// require.main,fileName will return
// C:\Users\QAC\OneDrive\0000. Important\1.LearnSpace\1.FUNiX\2.Subjects\5.NJS101X(NodeJS)\8.NodeJs_Process\server.js
// because we our app is a module then we define main is server.js, this is the end point, that when the app run, this file will run first
// we declare when create our nodejs app(a module)
//  "name": "node_server",
//   "version": "1.0.0",
//   "description": "a server created by node",
//   "main": "server.js",
module.exports = path.dirname(require.main.filename);
