var file = new XMLHttpRequest();
file.open("GET", "DataParsing/ability.json");
file.send();

file.onreadystatechange = function() {
    if (file.readyState == 4 && file.status == 200) {
        var abilityFile = JSON.parse(file.responseText);
        var abilityBookmarks = abilityFile[0];
        var abilities = abilityFile[1];
        console.log(abilityBookmarks);
        console.log(abilities);
        test(myArr);
    }
}

function test(myArr){
    // console.log(myArr.forEach(function(val,ind,ob){me(val,ind,ob)}));
}

function me(val,ind,ob){
    // console.log(val[1]);
    // console.log(ind);
    // console.log(ob);
}

// console.log(file);

