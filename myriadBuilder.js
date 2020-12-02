var file = new XMLHttpRequest();
file.open("GET", "DataParsing/ability.json");
file.send();

//GLOBAL ELEMENTS
//=================
var character = {
    text:{
        test:"hello"
    },
    stat:{
        //character level
        charLvl: 0,
        choices: [0,0],
        tabsOffset: 0,
        skillPoints: [0, []]
    },
    html:{
        charLvl: 'none',
        //Index 0 is the active tab
        //Index 1 is the active ability
        activeElements: ["none","none"],
        //skill tree index variables
        statChoiceElements: [],
        levelBtn: 'none'
    }
}

//=================

// 
file.onreadystatechange = function() {
    if (file.readyState == 4 && file.status == 200) {
        var abilityFile = JSON.parse(file.responseText);
        createWebsite(abilityFile);
        var abilityBookmarks = abilityFile[0];
        var abilities = abilityFile[1];
        //testing
        // console.log(abilityBookmarks);
        // console.log(abilities);
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
        createSkillTree(abilities, bookmarks[x], parent, navBar, x);
    }
}

//CHARACTER TABS
//================================

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
    togglePage.onclick = function(){activeElement(charPage.id, character.html.activeElements, 0);};
    
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
    character.stat.tabsOffset++;
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
    character.stat.choices[row] = indexValue;
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
    for(var x = character.stat.tabsOffset; x < tabs.length; x++){
        tabs[x].classList.add('hardLock');
    }

    //Modify selected tabs and pages
    for(var x = 0; x < character.stat.choices.length; x++)
    {
        //Removing 'hardLock' 
        pages[character.stat.choices[x]].classList.remove('hardLock');
        tabs[character.stat.choices[x]+character.stat.tabsOffset].classList.remove('hardLock');
        
        //Setting 'hardLock' on each ability tier
        var tiers = pages[character.stat.choices[x]].querySelectorAll('.tier');
        for(var y = 0; y < tiers.length; y++){
            tiers[y].classList.add('hardLock');
        }

        //setting 'hardLock' on each class ability set
        var classes = pages[character.stat.choices[x]].querySelectorAll('.classDiv');
        for(var y = 0; y < classes.length; y++){
            classes[y].classList.add('hardLock');
        }

        //set global stat choice element pages
        var page = document.querySelectorAll('.page');
        character.html.statChoiceElements.push(page[character.stat.choices[x]+character.stat.tabsOffset]);
    }

    generateCharacter(createTab);
}

function generateCharacter(parent){
    //testing
    console.log('generating Character');

    while(parent.firstChild){
        parent.removeChild(parent.lastChild);
    }
    var level = document.createElement('div');
    level.textContent = character.stat.charLvl;
    parent.appendChild(level);
    character.html.charLvl = level;

    var levelUpBtn = document.createElement('button');
    levelUpBtn.textContent = "LEVEL UP+";
    levelUpBtn.onclick = function(){levelUp();};

    character.html.levelBtn = levelUpBtn;
    
    parent.appendChild(levelUpBtn);     
}

function levelUp(){
    character.stat.charLvl++;
    character.html.charLvl.textContent = character.stat.charLvl;
    
    unlockLevel();

    //testing
    console.log(character.stat.skillPoints);
    character.html.levelBtn.classList.add('noClick', 'abilityBaseLock');
}

function unlockLevel(){
    switch(character.stat.charLvl){
        case 1:
            for(var x = 0; x < character.html.statChoiceElements.length; x++){
                var tierMod = character.html.statChoiceElements[x].querySelectorAll('.tier1');
                tierMod[0].classList.remove('hardLock');
                
                var descrs = tierMod[1].querySelectorAll('.abilityDesc button');
                for(var y = 0; y < descrs.length; y++){
                    descrs[y].classList.remove('noClick', 'abilityBaseLock');
                }
                character.stat.skillPoints[1][character.stat.choices[x]][0]++;
                character.stat.skillPoints[0]++;
            }
            break;
        case 2:
            for(var x = 0; x < character.html.statChoiceElements.length; x++){
                var tierMod = character.html.statChoiceElements[x].querySelectorAll('.tier2');
                tierMod[0].classList.remove('hardLock');

                var descrs = tierMod[1].querySelectorAll('.abilityDesc button');
                for(var y = 0; y < descrs.length; y++){
                    descrs[y].classList.remove('noClick', 'abilityBaseLock');
                }
                character.stat.skillPoints[1][character.stat.choices[x]][0]++;
                character.stat.skillPoints[0]++;
            }
            break;
        case 3:
            for(var x = 0; x < character.html.statChoiceElements.length; x++){
                var tierMod = character.html.statChoiceElements[x].querySelectorAll('.tier3');
                tierMod[0].classList.remove('hardLock');

                var descrs = tierMod[1].querySelectorAll('.abilityDesc button');
                for(var y = 0; y < descrs.length; y++){
                    descrs[y].classList.remove('noClick', 'abilityBaseLock');
                }
                character.stat.skillPoints[1][character.stat.choices[x]][0]++;
                character.stat.skillPoints[0]++;
            }
            break;
        case 4:
            for(var x = 0; x < character.html.statChoiceElements.length; x++){
                var tierMod = character.html.statChoiceElements[x].querySelectorAll('.classDiv');
                for(var y =0; y < tierMod.length; y++)
                {
                    tierMod[y].classList.remove('hardLock');
                }
            }
            break;
    }
}

function lockLevel(stat){
    var nth = stat+character.stat.tabsOffset;
    var statPage = document.querySelectorAll('.page')[nth];
    //testing
    console.log(statPage);
    switch(character.stat.charLvl){
        case 1:
            var tierMod = statPage.querySelectorAll('.tier1');
            for(var x = 0; x < tierMod.length; x++){
                
                tierMod[0].classList.add('hardLock');
                
                var descrs = tierMod[1].querySelectorAll('.abilityDesc button');
                for(var y = 0; y < descrs.length; y++){
                    descrs[y].classList.add('noClick', 'abilityBaseLock');
                }
            }
            break;
        case 2:
            var tierMod = statPage.querySelectorAll('.tier2');
            for(var x = 0; x < tierMod.length; x++){
                
                tierMod[0].classList.add('hardLock');
                
                var descrs = tierMod[1].querySelectorAll('.abilityDesc button');
                for(var y = 0; y < descrs.length; y++){
                    descrs[y].classList.add('noClick', 'abilityBaseLock');
                }
            }
            break;
        case 3:
            var tierMod = statPage.querySelectorAll('.tier3');
            for(var x = 0; x < tierMod.length; x++){
                
                tierMod[0].classList.add('hardLock');
                
                var descrs = tierMod[1].querySelectorAll('.abilityDesc button');
                for(var y = 0; y < descrs.length; y++){
                    descrs[y].classList.add('noClick', 'abilityBaseLock');
                }
            }
            break
    }
}

function levelComplete(){
    character.html.levelBtn.classList.remove('noClick', 'abilityBaseLock');
}

//SKILL TREE TABS
//================================

//Info: Creates each ability type tab
//Parameters:
//  +abilities = array of all individual abilities
//  +bookmarks = array of ints that represent significant 
//               break points in the index 1 array
//  +parent = parent document element 
//  +navBar = navBar document element
//  +stat = index representing which stat tree is being created
function createSkillTree(abilities, bookmarks, parent, navBar, stat){
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
    toggleTree.onclick = function(){activeElement(skilltreeId, character.html.activeElements, 0);};
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
        var descsTier = document.createElement('div');
        descs.appendChild(descsTier);
        icons.appendChild(tier);
        createAbilitySet(x, abilities, bookmarks, tier, descsTier, stat);
    }

    //tier 4
    var tier4 = document.createElement('div');
    var descsTier4 = document.createElement('div');
    tier4.classList.add('tier4');
    descsTier4.classList.add('tier4');
    icons.appendChild(tier4);
    descs.appendChild(descsTier4);   

    //skill point array for classes of a tree
    var classes = [];

    //class divs
    for(var x = 4; x < bookmarks.length - 1; x++){
        var classSet = document.createElement('div');
        var classSetDescs = document.createElement('div');
        tier4.appendChild(classSet);
        descsTier4.appendChild(classSetDescs);
        createAbilitySet(x, abilities, bookmarks, classSet, classSetDescs, stat);
        classes.push(0);
    }

    //array of all skill points
    character.stat.skillPoints[1].push([0, classes]); 
}

//Info: Creates each tier of abilities
//Parameters:
//  +index = integer which represents which ability tier 
//  +abilities  = array of all individual abilities
//  +bookmarks  = array of ints that represent significant 
//                break points in the index 1 array
//  +abilitySet = icon parent document element
//  +descRoot = description parent document element
//  +stat = index representing which stat this ability set is of
function createAbilitySet(index, abilities, bookmarks, abilitySet, descRoot, stat){
    var startIndex = 0;
    var endIndex = 0;

    //Determine subset of abilities for each tier
    //tiers 0-3 == <4
    //tier 4(classes) == >4
    if(index < 4){
        abilitySet.classList.add('tier'+ index);
        abilitySet.classList.add('tier');
        descRoot.classList.add('tier'+ index);
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
        abilitySet.classList.add(className);
        abilitySet.classList.add('classDiv');
        descRoot.classList.add('classDiv');
        descRoot.classList.add(className);

        var classImg = document.createElement('img');
        classImg.classList.add('classImg');
        classImg.src = "Assets/MyriadIcons/" + className + ".png";
        abilitySet.appendChild(classImg);

        var passives = document.createElement('div');
        passives.classList.add('passiveSkills');
        abilitySet.appendChild(passives);

        //create passive abilities
        for(var x = 0; x < bookmarks[index][2]; x++){
            createAbility(abilities[bookmarks[index][0]+x], passives, descRoot, stat);
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
    setAbilities.forEach(ability => createAbility(ability, abilitySet, descRoot, stat));
}

//Info: Create each ability
//Parameters:
//  +index = 
//  +parent  = parent document element for the ability icon
//  +descRoot = parent document element for the ability desc
//  +stat = index representing which stat this ability is
function createAbility(index, parent, descRoot, stat){
    //create ability icon then set attributes, classes, events
    var abilityIcon = document.createElement('img');
    abilityIcon.src = "Assets/MyriadIcons/" + index[0][1][1] + ".png";
    // abilityIcon.src = "Assets/MyriadIcons/" + index[0][1][1] + ".png";
    abilityIcon.alt = index[0][1][1];
    abilityIcon.classList.add("abilityIcon");
    abilityIcon.onclick = function(){activeElement(index[0][1][1], character.html.activeElements, 1);};
    parent.appendChild(abilityIcon);

    //Create ability description
    var abilityDesc = document.createElement('div');
    abilityDesc.classList.add("abilityDesc");
    abilityDesc.id = index[0][1][1];
    descRoot.appendChild(abilityDesc);

    //populate ability description
    var abilityHeader = document.createElement('h3');
    var table = document.createElement('table');

    abilityHeader.innerHTML = index[0][1][1];
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

        if(index[x][0].includes('Skill+')){
            row.classList.add('abilityUpgradeLock');
        }
        else{
            row.classList.add('abilityBaseLock');
        }

        table.appendChild(row);
    }

    var upgradeBtn = document.createElement('button');
    if(index[0][0]){
        upgradeBtnTxt = "CHOOSE UPGRADE";
    }
    else{
        upgradeBtnTxt = "UPGRADE";
    }

    upgradeBtn.textContent = upgradeBtnTxt;
    upgradeBtn.classList.add('abilityBaseLock');
    upgradeBtn.classList.add('noClick');
    upgradeBtn.onclick = function(){spendPoint(stat);};
    abilityDesc.appendChild(upgradeBtn);
}

function spendPoint(stat){
    console.log(stat);
    console.log(character.stat.skillPoints);
    character.stat.skillPoints[1][stat][0]--;
    character.stat.skillPoints[0]--;
    if(character.stat.skillPoints[1][stat][0] == 0){
        //lock stat tree components
        lockLevel(stat);
        if(character.stat.skillPoints[0] == 0){
            //unlock level up
            levelComplete();
        }
    }
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



