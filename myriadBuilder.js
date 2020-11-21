var file = new XMLHttpRequest();
file.open("GET", "DataParsing/ability.json");
file.send();

file.onreadystatechange = function() {
    if (file.readyState == 4 && file.status == 200) {
        var abilityFile = JSON.parse(file.responseText);
        createWebsite(abilityFile);
        var abilityBookmarks = abilityFile[0];
        var abilities = abilityFile[1];
        //testing
        console.log(abilityBookmarks);
        console.log(abilities);
    }
}

function createWebsite(abilityArray){
    //seperate json info into an array with all abilities and an array with 
    //index bookmarks
    var bookmarks = abilityArray[0];
    var abilities = abilityArray[1];
    var parent = document.getElementById('container');

    var x;
    for(x = 0; x < bookmarks.length; x++){
        createSkillTree(abilities, bookmarks[x], parent);
    }

}

function createSkillTree(abilities, bookmarks, parent){
    //testing
    console.log(bookmarks);
    console.log(bookmarks[0]);

    var skilltree = document.createElement('div');
    skilltree.id = bookmarks[0];
    skilltree.classList.add('skillTree');

    var toggleTree = document.createElement('button');
    var skilltreeId = bookmarks[0];
    
    toggleTree.innerHTML = skilltreeId;
    toggleTree.onclick = function(){test(skilltreeId);};
    
    parent.appendChild(toggleTree);
    parent.appendChild(skilltree);

    bookmarks.shift();

    var x;
    for(x = 0; x < 4; x++){
        var tier = document.createElement('div');
        var startIndex = 0;
        var endIndex = 0;

        if( x == 3){
            tier.classList.add('tier3');
            tier.classList.add('tier');
            startIndex = bookmarks[x];
            endIndex = bookmarks[x+1][0];
        }
        else{
            tier.classList.add('tier'+x);
            tier.classList.add('tier');
            startIndex = bookmarks[x];
            endIndex = bookmarks[x+1];
        }
        
        var tierAbilities = abilities.slice(startIndex, endIndex);
        tierAbilities.forEach(ability => createAbility(ability, tier));

        skilltree.appendChild(tier);
    }

    var tier4 = document.createElement('div');
    tier4.classList.add('tier4');
    tier4.classList.add('tier');   

    for(x = 4; x < bookmarks.length - 1; x++){
        var classDiv = document.createElement('div');
        var className = bookmarks[x][1];
        classDiv.classList.add(className);
        classDiv.classList.add('classSkills');
        startIndex = bookmarks[x][0];
        
        if(x == bookmarks.length - 2){
            endIndex = bookmarks[x+1];
        }
        else{
            endIndex = bookmarks[x+1][0];
        }
        

        var classAbilities = abilities.slice(startIndex, endIndex);
        classAbilities.forEach(ability => createAbility(ability, classDiv));

        tier4.appendChild(classDiv);
    }
    skilltree.appendChild(tier4);    
}

function createAbility(index, parent){
    var ability = document.createElement('div');
    ability.classList.add("ability");

    //create ability icon
    var abilityIcon = document.createElement('img');

    var abilityPath = "Assets/MyriadIcons/" + index[0][1][1] + ".png";
    abilityIcon.src = abilityPath;
    abilityIcon.alt = index[0][1][1];
    abilityIcon.classList.add("abilityIcon");
    abilityIcon.onclick = function(){test(index[0][1][1]);};

    ability.appendChild(abilityIcon);

    //Create ability description
    var abilityDesc = document.createElement('div');
    abilityDesc.classList.add("abilityDesc");
    abilityDesc.id = index[0][1][1];

   
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

    parent.appendChild(ability);
}

function test(id){
    var element = document.getElementById(id);
    if(element.classList.contains("active")){
        element.classList.remove("active");
    }
    else{
        element.classList.add("active");
    }
}
