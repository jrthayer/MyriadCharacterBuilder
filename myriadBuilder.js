var file = new XMLHttpRequest();
file.open("GET", "DataParsing/ability.json");
file.send();

file.onreadystatechange = function() {
    if (file.readyState == 4 && file.status == 200) {
        var abilityFile = JSON.parse(file.responseText);
        createWebsite(abilityFile);
        var abilityBookmarks = abilityFile[0];
        var abilities = abilityFile[1];
        console.log(abilityBookmarks);
        console.log(abilities);
    }
}

function createWebsite(abilityArray){
    createSkillTree(abilityArray[1]);
}

function createSkillTree(statAbilityArray){
    statAbilityArray.forEach(ability => createAbility(ability));
}

function createAbility(index){
    var ability = document.createElement('ul');
    var test = document.createElement('li');
    test.innerHTML = index[0][1][1] + ": " + index[0][0];
    ability.appendChild(test);
    for(x = 1; x < index.length; x++){
        var line = document.createElement('li');
        line.innerHTML = index[x][0] + ": " + index[x][1];
        ability.appendChild(line);
    }
    var container = document.getElementById('container');
    container.appendChild(ability);
}


