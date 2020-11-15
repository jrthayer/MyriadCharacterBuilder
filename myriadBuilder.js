var file = new XMLHttpRequest();
file.open("GET", "MyriadAbilityInfo.txt");
console.log(file);
var text = file.responseText;
document.write(text);