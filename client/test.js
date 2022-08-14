
var m = 1, i = j = 0;

function add(num){
    return num + 2;
}

 y = add(m);

 function add(num){
     return num + 3;
 }

 z = add(m);


 (function(){
     var a = b = 5;
     console.log(a)
 })()
 console.log(y);
 console.log(z);
 console.log(b);
