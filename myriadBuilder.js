var file = new XMLHttpRequest();

// file.onload = function(){
//     console.log("load file");
//     console.log(this);
// }

// file.onerror() = function(){
//     console.log("error");
// }

file.open("GET", "MyriadAbilityInfo.txt");
file.send();
console.log(file);
var text = file.responseText;
document.write(text);