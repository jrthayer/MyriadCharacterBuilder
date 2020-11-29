var file = new XMLHttpRequest();
file.open("GET", "DataParsing/ability.json");
file.send();

//GLOBAL ELEMENTS
//=================
//Index 0 is the active tab
//Index 1 is the active ability
var activeElements = ["none","none"];

//skill point array
var skillPoints = [];
//skill tree index variables
var statChoices = [0, 0];
var statChoiceElements = [];
var statTabsOffset = 0;
//character level
var charLvl = 0;
//=================

// 
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

//Info: Called to create the whole web page
//Parameters:
//  +abilityArray = array consisting of two arrays
//      *index 0: array of ints that represent significant 
//                break points in the index 1 array
//      *index 1: array of all individual abilities 
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

    var statArray = [];
    for(var x = 0; x < bookmarks.length; x++){
        statArray.push(bookmarks[x][0]);
    }    
    createCharacterPages(parent, navBar, statArray);

    for(x = 0; x < bookmarks.length; x++){
        createSkillTree(abilities, bookmarks[x], parent, navBar);
    }
    //testing
    console.log(skillPoints);
    console.log(statChoices);
}

//Info: Creates the character pages
//Parameters:
//  +parent = parent document element of the character page 
//  +navBar = navBar document element
//  +stats = array of strings that represent each stat.      
function createCharacterPages(parent, navBar, stats){
    //page navBar tab element
    var togglePage = document.createElement('div');
    togglePage.classList.add('tab');
    
    //page div
    var charPage = document.createElement('div');
    charPage.id = "character";
    charPage.classList.add('page');
    
    //set navBar listener(needs to be after skilltree exists)
    togglePage.innerHTML = charPage.id;
    togglePage.onclick = function(){activeElement(charPage.id, activeElements, 0);};
    
    navBar.appendChild(togglePage);
    parent.appendChild(charPage);

    var choiceBar = document.createElement('div');
    
    //stat choices x < 2 because each character picks two stats
    for(let x = 0; x < 2; x++){
        var row = document.createElement('div');
        let rowId = "statChoice"+ x;
        row.id = rowId;

        for(let y = 0; y < stats.length; y++){
            var stat = document.createElement('img');
            stat.classList.add("statIcon");
            stat.src = "Assets/MyriadIcons/" + stats[y] + '.png';
            stat.onclick = function(){setStatChoice(y, x, rowId);};
            row.appendChild(stat);
        }
        choiceBar.appendChild(row);
    }

    charPage.appendChild(choiceBar);

    //submit button
    var submitBtn = document.createElement('button');
    submitBtn.textContent = "SUBMIT";
    submitBtn.onclick = function(){submitCharacter();};

    charPage.appendChild(submitBtn);

    //stat tabs offset+
    statTabsOffset++;
}

//Info: Creates each ability type tab
//Parameters:
//  +abilities = array of all individual abilities
//  +bookmarks = array of ints that represent significant 
//               break points in the index 1 array
//  +parent = parent document element 
//  +navBar = navBar document element
function createSkillTree(abilities, bookmarks, parent, navBar){
    //page navBar tab element
    var toggleTree = document.createElement('img');
    toggleTree.classList.add('tab');
    toggleTree.src = "Assets/MyriadIcons/" + bookmarks[0] + '.png';
    navBar.appendChild(toggleTree);

    //page div
    var skilltree = document.createElement('div');
    var skilltreeId = bookmarks[0];
    skilltree.id = skilltreeId;
    skilltree.classList.add('page');
    
    parent.appendChild(skilltree);

    //set navBar listener(needs to be after skilltree exists)
    toggleTree.onclick = function(){activeElement(skilltreeId, activeElements, 0);};
    //get rid of index 0 which is a string representing that stat tree
    bookmarks.shift();

    //icons div panel
    var icons = document.createElement('div');
    icons.classList.add('abilityIcons');
    //descriptions div panel
    var descs = document.createElement('div');
    descs.classList.add('abilitydescs');   

    skilltree.appendChild(icons);
    skilltree.appendChild(descs);

    //tiers 0 - 3
    for(var x = 0; x < 4; x++){
        var tier = document.createElement('div');
        icons.appendChild(tier);
        createAbilitySet(x, abilities, bookmarks, tier, descs);
    }

    //tier 4
    var tier4 = document.createElement('div');
    tier4.classList.add('tier4');
    icons.appendChild(tier4);   

    //skill point array for classes of a tree
    var classes = [];

    //class divs
    for(var x = 4; x < bookmarks.length - 1; x++){
        var classSet = document.createElement('div');
        tier4.appendChild(classSet);
        createAbilitySet(x, abilities, bookmarks, classSet, descs);
        classes.push(0);
    }

    //array of all skill points
    skillPoints.push([0, classes]); 
}

//Info: Creates each tier of abilities
//Parameters:
//  +index = integer which represents which stat tree 
//  +abilities  = array of all individual abilities
//  +bookmarks  = array of ints that represent significant 
//                break points in the index 1 array
//  +abilitySet = icon parent document element
//  +descRoot = description parent document element
function createAbilitySet(index, abilities, bookmarks, abilitySet, descRoot){
    var startIndex = 0;
    var endIndex = 0;

    //Determine subset of abilities for each tier
    //tiers 0-3 == <4
    //tier 4(classes) == >4
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
        //Classes have special formatting
        //+appended onto new parent div
        //+includes class image
        //+class passives
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

        //create passive abilities
        for(var x = 0; x < bookmarks[index][2]; x++){
            createAbility(abilities[bookmarks[index][0]+x], passives, descRoot);
        } 
        
        //determine subset of abilities of the class without passives
        startIndex = bookmarks[index][0] + parseInt(bookmarks[index][2]);
            
        if(index == bookmarks.length - 2){
            endIndex = bookmarks[index+1];
        }
        else{
            endIndex = bookmarks[index+1][0];
        }
        console.log(startIndex+":"+endIndex);

    }
    var setAbilities = abilities.slice(startIndex, endIndex);
    setAbilities.forEach(ability => createAbility(ability, abilitySet, descRoot));
}

//Info: Create each ability
//Parameters:
//  +index = integer which represents which ability this is
//  +parent  = parent document element for the ability icon
//  +descRoot = parent document element for the ability desc
function createAbility(index, parent, descRoot){
    //create ability icon then set attributes, classes, events
    var abilityIcon = document.createElement('img');
    abilityIcon.src = "Assets/MyriadIcons/" + index[0][1][1] + ".png";
    // abilityIcon.src = "Assets/MyriadIcons/" + index[0][1][1] + ".png";
    abilityIcon.alt = index[0][1][1];
    abilityIcon.classList.add("abilityIcon");
    abilityIcon.onclick = function(){activeElement(index[0][1][1], activeElements, 1);};
    parent.appendChild(abilityIcon);

    //Create ability description
    var abilityDesc = document.createElement('div');
    abilityDesc.classList.add("abilityDesc");
    abilityDesc.id = index[0][1][1];
    descRoot.appendChild(abilityDesc);

    //populate ability description
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

//Info: Sets an icon or tab to active
//Parameters:
//  +id = id of new active element 
//  +curActive = array which consists of the ids of currently active elements
//      *index 0: active tab
//      *index 1: active ability
//  +index = determines if tab or ability is being set to active,
//           refer to index values described above
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

//Info: Toggles "active" css class on an element
//Parameters:
//  +id = id of element
function toggleActive(id){
    var element = document.getElementById(id);
    if(element.classList.contains("active")){
        element.classList.remove("active");
    }
    else{
        element.classList.add("active");
    }
}

//Info: 
//Parameters:
//  +indexValue = index of button choosen
//  +row = number representing which stat choice row is being set
//  +parentName = id string of div element containing set of stat buttons
function setStatChoice(indexValue, row, parentName){
    var rowElement = document.querySelectorAll("#"+parentName+" img");
    rowElement.forEach((statBtn) => {
        statBtn.classList.add('hardLock');
    });

    rowElement[indexValue].classList.remove('hardLock');

    //global variable being set
    statChoices[row] = indexValue;
    
    //testing
    console.log(statChoices);
}

//Info: Submits user input for character creation and adds styling 
//  +Sets 'hardLock' class on tabs not selected
//  +Sets 'hardLock' class on ability tiers of tabs selected
//  +Calls generateCharacter()
function submitCharacter(){
    var createTab = document.getElementById('character');
    var tabs = document.querySelectorAll('.tab');
    var pages = document.querySelectorAll('.abilityIcons');

    //Setting 'hardLock' on all ability tabs and pages
    for(var x = 0; x < pages.length; x++){
        pages[x].classList.add('hardLock');
    }
    for(var x = statTabsOffset; x < tabs.length; x++){
        tabs[x].classList.add('hardLock');
    }

    //Modify selected tabs and pages
    for(var x = 0; x < statChoices.length; x++)
    {
        //Removing 'hardLock' 
        pages[statChoices[x]].classList.remove('hardLock');
        tabs[statChoices[x]+statTabsOffset].classList.remove('hardLock');
        
        //Setting 'hardLock' on each ability tier
        var tiers = pages[statChoices[x]].querySelectorAll('.tier');
        for(var y = 0; y < tiers.length; y++){
            tiers[y].classList.add('hardLock');
        }

        //setting 'hardLock' on each class ability set
        var classes = pages[statChoices[x]].querySelectorAll('.classDiv');
        for(var y = 0; y < classes.length; y++){
            classes[y].classList.add('hardLock');
        }

        //set global stat choice elements
        statChoiceElements.push(pages[statChoices[x]]);
    }

    //testing
    console.log(statChoiceElements);
    generateCharacter(createTab);
}

function generateCharacter(parent){
    //testing
    console.log('generating Character');

    while(parent.firstChild){
        parent.removeChild(parent.lastChild);
    }
    var level = document.createElement('div');
    level.textContent = charLvl;
    parent.appendChild(level);

    var levelUpBtn = document.createElement('button');
    levelUpBtn.textContent = "LEVEL UP+";
    levelUpBtn.onclick = function(){levelUp();};
    
    parent.appendChild(levelUpBtn);    
}

function levelUp(){
    charLvl++;
    var pages = document.querySelectorAll('.abilityIcons');
    //testing
    console.log(charLvl);
    switch(charLvl){
        case 1:
            for(var x = 0; x < statChoiceElements.length; x++){
                var tierMod = statChoiceElements[x].querySelectorAll('.tier1');
                tierMod[0].classList.remove('hardLock');
            }
            //testing
            console.log('tier1');
            break;
        case 2:
            for(var x = 0; x < statChoiceElements.length; x++){
                var tierMod = statChoiceElements[x].querySelectorAll('.tier2');
                tierMod[0].classList.remove('hardLock');
            }
            //testing
            console.log('tier2');
            break;
        case 3:
            for(var x = 0; x < statChoiceElements.length; x++){
                var tierMod = statChoiceElements[x].querySelectorAll('.tier3');
                tierMod[0].classList.remove('hardLock');
            }
            //testing
            console.log('tier3');
            break;
        case 4:
            for(var x = 0; x < statChoiceElements.length; x++){
                var tierMod = statChoiceElements[x].querySelectorAll('.classDiv');
                for(var y =0; y < tierMod.length; y++)
                {
                    tierMod[y].classList.remove('hardLock');
                }
            }
            break;
    }
}