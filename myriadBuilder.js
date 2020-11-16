var file = new XMLHttpRequest();
file.open("GET", "test.json");
file.send();

file.onreadystatechange = function() {
    if (file.readyState == 4 && file.status == 200) {
        var myArr = JSON.parse(file.responseText);
        console.log("hello");
        console.log(myArr);
        test(myArr);
    }
}

function test(myArr){
    console.log(myArr.cars.Nissan.forEach(function(val,ind,ob){me(val,ind,ob)}));

}

function me(val,ind,ob){
    console.log(val.model);
    console.log(ind);
    console.log(ob);
}

console.log(file);

