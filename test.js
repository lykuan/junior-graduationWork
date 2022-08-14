const url = "http://localhost:8888/user?username=tom&password=lykuan123";

let data = url.match(/(?<=\?).*/)[0];
const dataArr = data.split("&");
let obj = {};

dataArr.forEach((i) => {
  const key = i.match(/\w*(?=\=)/)[0];
  const value = i.match(/(?<=\=)\w*/)[0];
  obj[key] = value;
});
console.log(obj);
