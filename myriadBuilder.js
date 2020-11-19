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
    var ability = document.createElement('div');
    ability.classList.add("ability");

    //Create ability description
    var abilityDesc = document.createElement('div');
    abilityDesc.classList.add("abilityDesc");
    ability.appendChild(abilityDesc);

    var abilityHeader = document.createElement('h3');
    var table = document.createElement('table');

    abilityHeader.innerHTML = index[0][1][1] + ": " + index[0][0];
    abilityDesc.appendChild(abilityHeader);
    abilityDesc.appendChild(table);

    for(x = 1; x < index.length; x++){
        var row = document.createElement('tr');
        var cell1 = row.insertCell(0);
        var cell2 = row.insertCell(1);
        var pre1 = document.createElement('pre');
        var pre2 = document.createElement('pre');
        pre1.innerHTML = index[x][0];
        pre2.innerHTML = index[x][1];
        cell1.appendChild(pre1);
        cell2.appendChild(pre2);
        table.appendChild(row);
    }
    var container = document.getElementById('container');
    container.appendChild(ability);
}

function createAbililtyDesc(index){

}


