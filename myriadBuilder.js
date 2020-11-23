var file = new XMLHttpRequest();
file.open("GET", "DataParsing/ability.json");
file.send();

//Global variables to distinguish class passives
var classPassives = [2, 2, 1, 2, 2, 2, 2, 1, 2, 1, 2, 1, 2, 1, 1, 2];
var passiveIndex = 0;

//Index 0 is the active tab
//Index 1 is the active ability
var activeElements = ["none","none"];

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
    var navBar = document.createElement('div');
    navBar.id = 'navBar';
    parent.appendChild(navBar);

    createCharacterPages(parent, navBar, bookmarks);

    for(x = 0; x < bookmarks.length; x++){
        createSkillTree(abilities, bookmarks[x], parent, navBar);
    }
}

function createCharacterPages(parent, navBar, bookmarks){
    var togglePage = document.createElement('div');
    var charPage = document.createElement('div');

    charPage.id = "create";
    charPage.classList.add('page');

    togglePage.classList.add('tab');
    togglePage.innerHTML = charPage.id;
    togglePage.onclick = function(){activeElement(charPage.id, activeElements, 0);};
    
    navBar.appendChild(togglePage);
    parent.appendChild(charPage);

    var choiceBar = document.createElement('div');
    

    for(var x = 0; x < 2; x++){
        var row = document.createElement('div');
        for(var y = 0; y < bookmarks.length; y++){
            var stat = document.createElement('img');
            stat.classList.add("statIcon");
            stat.src = "Assets/MyriadIcons/" + bookmarks[y][0] + '.png';
            row.appendChild(stat);
        }
        choiceBar.appendChild(row);
    }

    charPage.appendChild(choiceBar);
    console.log(bookmarks.length);
    console.log(bookmarks[0]);
}

function createSkillTree(abilities, bookmarks, parent, navBar){
    var toggleTree = document.createElement('img');
    var skilltreeId = bookmarks[0];

    var skilltree = document.createElement('div');
    skilltree.id = bookmarks[0];
    skilltree.classList.add('page');
    
    var icons = document.createElement('div');
    icons.classList.add('abilityIcons');

    var descs = document.createElement('div');
    descs.classList.add('abilitydescs');    

    toggleTree.classList.add('tab');
    toggleTree.src = "Assets/MyriadIcons/" + bookmarks[0] + '.png';
    toggleTree.onclick = function(){activeElement(skilltreeId, activeElements, 0);};
    
    navBar.appendChild(toggleTree);
    parent.appendChild(skilltree);

    bookmarks.shift();

    var x;
    for(x = 0; x < 4; x++){
        var tier = document.createElement('div');
        icons.appendChild(createAbilitySet(x, bookmarks, abilities, tier, descs));
    }

    var tier4 = document.createElement('div');
    tier4.classList.add('tier4');   

    for(x = 4; x < bookmarks.length - 1; x++){
        var classSet = document.createElement('div');
        tier4.appendChild(createAbilitySet(x, bookmarks, abilities, classSet, descs));
    }

    icons.appendChild(tier4);
    skilltree.appendChild(icons);
    skilltree.appendChild(descs);  
}

function createAbilitySet(index, bookmarks, abilities, abilitySet, descRoot){
    var startIndex = 0;
    var endIndex = 0;

    if(index < 4){
        abilitySet.classList.add('tier'+ index);
        abilitySet.classList.add('tier');
        if(index == 3){
            startIndex = bookmarks[index];
            endIndex = bookmarks[index+1][0];
        }
        else{
            startIndex = bookmarks[index];
            endIndex = bookmarks[index+1];
        }
    }
    else{
        var className = bookmarks[index][1];
        abilitySet.id = className;
        abilitySet.classList.add('classDiv');

        var classImg = document.createElement('img');
        classImg.classList.add('classImg');
        classImg.src = "Assets/MyriadIcons/" + className + ".png";
        abilitySet.appendChild(classImg);

        var passives = document.createElement('div');
        passives.classList.add('passiveSkills');
        abilitySet.appendChild(passives);

        for(var x = 0; x < classPassives[passiveIndex]; x++){
            createAbility(abilities[bookmarks[index][0]+x], passives, descRoot);
        } 
    
        startIndex = bookmarks[index][0] + classPassives[passiveIndex];
            
        if(index == bookmarks.length - 2){
            endIndex = bookmarks[index+1];
        }
        else{
            endIndex = bookmarks[index+1][0];
        }
        passiveIndex++;
    }
    var setAbilities = abilities.slice(startIndex, endIndex);
    setAbilities.forEach(ability => createAbility(ability, abilitySet, descRoot));

    return abilitySet;
}

function createAbility(index, parent, descRoot){
    //create ability icon
    var abilityIcon = document.createElement('img');

    var abilityPath = "Assets/MyriadIcons/" + index[0][1][1] + ".png";
    abilityIcon.src = abilityPath;
    abilityIcon.alt = index[0][1][1];
    abilityIcon.classList.add("abilityIcon");
    abilityIcon.onclick = function(){activeElement(index[0][1][1], activeElements, 1);};

    parent.appendChild(abilityIcon);

    //Create ability description
    var abilityDesc = document.createElement('div');
    abilityDesc.classList.add("abilityDesc");
    abilityDesc.id = index[0][1][1];

   
    descRoot.appendChild(abilityDesc);

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

    abilityDesc.appendChild(document.createElement('br'));
}

function activeElement(id, curActive, index){
    if(curActive[index] != "none"){
        if(id == curActive[index]){
            toggleActive(id);
            curActive[index] = "none";
        }
        else{
            toggleActive(curActive[index]);
            curActive[index] = id;
            toggleActive(curActive[index]);
        }
    }
    else{
        curActive[index] = id;
        toggleActive(id);
    }
}

function toggleActive(id){
    var element = document.getElementById(id);
    if(element.classList.contains("active")){
        element.classList.remove("active");
    }
    else{
        element.classList.add("active");
    }
}

