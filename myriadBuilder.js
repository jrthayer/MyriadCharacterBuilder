//GLOBAL ELEMENTS
//=================
var character = {
    text:{
        test:"hello"
    },
    stat:{
        //character level
        Level: 0,
        HP: 30,
        Sanity: 30,
        MadResist: 0,
        Focus: 2,
        Load: 3,
        Wealth: 0,
        Accuracy: 0,
        Armor: 0,
        Melee: 0,
        Light: 0,
        Blunt: 0,
        Range: 0,
        Shield: 0,
        Attire: 0
    },
    passives:{
        Level: 0,
        HP: 0,
        Sanity: 0,
        MadResist: 0,
        Focus: 0,
        Load: 0,
        Wealth: 0,
        Accuracy: 0,
        Armor: 0,
        Melee: 0,
        Light: 0,
        Blunt: 0,
        Range: 0,
        Shield: 0,
        Attire: 0
    },
    misc:{
        statChoices: [0,0],
        classChoices: [[-1,-1],[-1,-1]],
        tabsOffset: 0,
        skillPoints: [0, []],
        classPoints: [],
        numOfClasses: 0,
        statValues: [0,0,0,0]
    },
    html:{
        level: 'none',
        //Index 0 is the active tab
        //Index 1 is the active ability
        activeElements: ["none","none"],
        //skill tree index variables
        statChoiceElements: [],
        levelBtn: 'none'
    }
}

var raceFile;
var abilityFile;
var filesLoaded = 0;

var file = new XMLHttpRequest();
file.onreadystatechange = function() {
    if (file.readyState == 4 && file.status == 200) {
        abilityFile = JSON.parse(file.responseText);
        checkFilesLoaded();
    }
}
file.open("GET", "DataParsing/ability.json");
file.send();

var file2 = new XMLHttpRequest();
file2.onreadystatechange = function(){
    if (file2.readyState == 4 && file2.status == 200) {
        raceFile = JSON.parse(file2.responseText);
        checkFilesLoaded();
    }
} 
file2.open("GET", "DataParsing/races.json");
file2.send();
//=================


function checkFilesLoaded(){
    filesLoaded += 1;
    if(filesLoaded == 2){
        createWebsite(abilityFile, raceFile);
    }
}

//PAGE CREATION/INIT
//============================================================
//============================================================

//Info: Called to create the whole web page
//Parameters:
//  +abilityArray = array consisting of two arrays
//      *index 0: array of ints that represent significant 
//                break points in the index 1 array
//      *index 1: array of all individual abilities 
function createWebsite(abilityArray, raceFile){
    //seperate json info into an array with all abilities and an array with 
    //index bookmarks
    console.log(raceFile);
    var bookmarks = abilityArray[0];
    var abilities = abilityArray[1];
    var parent = document.getElementById('container');
    var x;
    var navBar = document.createElement('div');
    navBar.id = 'navBar';
    parent.appendChild(navBar);

    var descBar = document.createElement('div');
    descBar.id = 'descBar';
    parent.appendChild(descBar);

    var statArray = [];
    for(var x = 0; x < bookmarks.length; x++){
        statArray.push(bookmarks[x][0]);
    }    
    createCharacterPages(parent, navBar, statArray, raceFile, descBar);

    for(x = 0; x < bookmarks.length; x++){
        createSkillTree(abilities, bookmarks[x], parent, navBar, x, descBar);
    }
}

//CHARACTER TABS
//================================

//Info: Creates the character pages
//Parameters:
//  +parent = parent document element of the character page 
//  +navBar = navBar document element
//  +stats = array of strings that represent each stat.      
function createCharacterPages(parent, navBar, stats, raceFile, descBar){
    //page navBar tab element
    var togglePage = document.createElement('div');
    togglePage.classList.add('tab');
    
    //page div
    var charPage = document.createElement('div');
    charPage.id = "character";
    charPage.classList.add('page');
    
    //set navBar listener(needs to be after skilltree exists)
    togglePage.innerHTML = "Character";
    togglePage.onclick = function(){activeElement(charPage.id, character.html.activeElements, 0);};
    
    navBar.appendChild(togglePage);
    parent.appendChild(charPage);

    var racialSelection = document.createElement('img');
    racialSelection.src = 'Assets/MyriadIcons/Sanity.png';
    racialSelection.style.filter = "grayscale(100%)";
    racialSelection.id = 'raceImg';
    racialSelection.onclick = function(){page2tab.click();};
    charPage.appendChild(racialSelection);

    var statPointsBar = document.createElement('div');
    statPointsBar.classList.add('statPointsBar');

    var choiceTitle = document.createElement('h2');
    choiceTitle.innerHTML = "Stat Points";
    statPointsBar.appendChild(choiceTitle);

    var statValueBar = document.createElement('div');
    statValueBar.classList.add('statValueBar');

    var rowImgs = document.createElement('div');
    rowImgs.classList.add('statValueRef');

    for(let y = 0; y < stats.length; y++){
        var stat = document.createElement('img');
        // stat.classList.add('statValue');
        stat.src = "Assets/MyriadIcons/" + stats[y] + '.png';
        rowImgs.appendChild(stat);
    }
    statValueBar.appendChild(rowImgs);

    for(let x = 0; x < stats.length; x++){
        var stat = document.createElement('div');
        stat.classList.add('statValue');
        var addBtn = document.createElement('button');
        addBtn.innerHTML = "+";
        addBtn.onclick = function(){addStat(x, statNum);};
        let statNum = document.createElement('div');
        statNum.innerHTML = character.misc.statValues[x];
        var subBtn = document.createElement('button');
        subBtn.innerHTML = "-";
        subBtn.onclick = function(){subStat(x, statNum);};
        stat.appendChild(addBtn);
        stat.appendChild(statNum);
        stat.appendChild(subBtn);
        statValueBar.appendChild(stat);
    }
    statPointsBar.appendChild(statValueBar);

    charPage.appendChild(statPointsBar);

    var choiceBar = document.createElement('div');
    choiceBar.classList.add('statsChoiceBar');
    var choiceTitle = document.createElement('h2');
    choiceTitle.innerHTML = "Stat Choices";
    choiceBar.appendChild(choiceTitle);
    
    //stat choices x < 2 because each character picks two stats
    for(let x = 0; x < 2; x++){
        var row = document.createElement('div');
        let rowId = "statChoice"+ x;
        row.id = rowId;

        for(let y = 0; y < stats.length; y++){
            var stat = document.createElement('img');
            stat.classList.add("statIcon");
            if(y != 0){
                stat.classList.add('hardLock');
            }
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
    submitBtn.classList.add('abilityBaseLock', 'noClick');

    charPage.appendChild(submitBtn);

    //stat tabs offset+
    character.misc.tabsOffset++;

    //create racial tab?
    var page2tab = document.createElement('div');
    page2tab.classList.add('tab');
    
    //page div
    var charPage2 = document.createElement('div');
    charPage2.id = "character2";
    charPage2.classList.add('page');

    var race = document.createElement('div');
    race.classList.add('race');

    var descs = document.createElement('div');
    descs.classList.add('abilitydescs');
    descBar.appendChild(descs);

    for(let x = 0; x < raceFile.length; x++){
        var raceDiv = document.createElement('div');
        raceDiv.classList.add('raceDiv');
        for(var y = 0; y<raceFile[x].length; y++){
            createAbility(raceFile[x][y], raceDiv, descs, -1, -1);
            if(y == 0){
                var raceDesc = descBar.querySelector('.abilitydescs .abilityDesc:last-child');
                var raceBtn = raceDesc.querySelector('button');
                raceBtn.classList.remove('abilityBaseLock', 'noClick');
                raceBtn.onclick = function(){selectRace(raceFile, x, submitBtn);};
                raceBtn.innerHTML = "SELECT RACE";
            }
        }
        charPage2.appendChild(raceDiv);
    }

    for(var x = 0; x < raceFile.length; x++){
        
    }

    navBar.appendChild(page2tab);
    parent.appendChild(charPage2);



    //set navBar listener(needs to be after skilltree exists)
    page2tab.innerHTML = "Races";
    page2tab.onclick = function(){activeElement(charPage2.id, character.html.activeElements, 0);};
    
    //stat tabs offset+
    character.misc.tabsOffset++;
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
function createSkillTree(abilities, bookmarks, parent, navBar, stat, descBar){
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
    descBar.appendChild(descs);

    //tiers 0 - 3
    for(var x = 0; x < 4; x++){
        var tier = document.createElement('div');
        var descsTier = document.createElement('div');
        descs.appendChild(descsTier);
        icons.appendChild(tier);
        createAbilitySet(x, abilities, bookmarks, tier, descsTier, stat, x);
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
        createAbilitySet(x, abilities, bookmarks, classSet, classSetDescs, stat, x);
        classes.push(0);
    }

    //array of all skill points
    character.misc.skillPoints[1].push([0, classes]);
    character.misc.classPoints.push(0); 
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
function createAbilitySet(index, abilities, bookmarks, abilitySet, descRoot, stat, classNum){
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
        var classInfoId = className + "Info";
        abilitySet.classList.add(className);
        abilitySet.classList.add('classDiv');
        descRoot.classList.add('classDiv');
        descRoot.classList.add(className);

        var classInfoDiv = document.createElement('div');
        classInfoDiv.classList.add('classInfo');
        descRoot.appendChild(classInfoDiv);

        //class desc panel 
        var classDesc = document.createElement('div');
        var classHeader = document.createElement('h3');
        var classSelectBtn = document.createElement('button');
        classSelectBtn.classList.add('abilityBaseLock' , 'noClick');
        classSelectBtn.onclick = function(){selectClass(index-4, stat)};
        classDesc.classList.add('abilityDesc');
        classDesc.id = classInfoId;
        
        classSelectBtn.textContent = "Select Class";
        classHeader.textContent = className;
        classDesc.appendChild(classHeader);
        classDesc.appendChild(classSelectBtn);
        classInfoDiv.appendChild(classDesc);
        
        //class img
        var classIconDiv = document.createElement('div');
        classIconDiv.classList.add('classInfo');
        abilitySet.appendChild(classIconDiv);

        var classImg = document.createElement('img');
        classImg.classList.add('classImg');
        classImg.src = "Assets/MyriadIcons/" + className + ".png";
        classIconDiv.appendChild(classImg);


        classImg.onclick = function(){activeElement(classInfoId, character.html.activeElements, 1);};
        //mouse over feature
        //classImg.addEventListener("mouseover", function(){classImg.click()});

        //class passives div parents
        var passives = document.createElement('div');
        passives.classList.add('passiveSkills' , 'passiveIcons');
        abilitySet.appendChild(passives);

        var passiveDescs = document.createElement('div');
        passiveDescs.classList.add('passiveSkills');
        descRoot.appendChild(passiveDescs);

        //create passive abilities
        for(var x = 0; x < bookmarks[index][2]; x++){
            createAbility(abilities[bookmarks[index][0]+x], passives, passiveDescs, stat, classNum);
        } 
        
        //determine subset of abilities of the class without passives
        startIndex = bookmarks[index][0] + parseInt(bookmarks[index][2]);
            
        if(index == bookmarks.length - 2){
            endIndex = bookmarks[index+1];
        }
        else{
            endIndex = bookmarks[index+1][0];
        }

        //class skills/descs parent divs
        var classSkillsIcons = document.createElement('div');
        classSkillsIcons.classList.add('classSkills');
        abilitySet.appendChild(classSkillsIcons);

        var classSkillsDescs = document.createElement('div');
        classSkillsDescs.classList.add('classSkills');
        descRoot.appendChild(classSkillsDescs);

        abilitySet = classSkillsIcons;
        descRoot = classSkillsDescs;
    }
    var setAbilities = abilities.slice(startIndex, endIndex);
    setAbilities.forEach(ability => createAbility(ability, abilitySet, descRoot, stat, classNum));
}

//Info: Create each ability
//Parameters:
//  +index = 
//  +parent  = parent document element for the ability icon
//  +descRoot = parent document element for the ability desc
//  +stat = index representing which stat this ability is
function createAbility(index, parent, descRoot, stat, classNum){
    //create ability icon then set attributes, classes, events
    var abilityIcon = document.createElement('img');
    abilityIcon.src = "Assets/MyriadIcons/" + index[0][1][1] + ".png";
    // abilityIcon.src = "Assets/MyriadIcons/" + index[0][1][1] + ".png";
    abilityIcon.alt = index[0][1][1];
    abilityIcon.classList.add("abilityIcon");
    abilityIcon.onclick = function(){activeElement(index[0][1][1], character.html.activeElements, 1);};
    //mouse over feature
    //abilityIcon.addEventListener("mouseover", function(){abilityIcon.click()});
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
            row.classList.add('noClick');
            let upgradeOption = row;
            row.onclick = function(){selectUpgrade(upgradeOption, abilityDesc)};
        }
        else{
            row.classList.add('abilityBaseLock');
        }

        table.appendChild(row);
    }

    var upgradeBtn = document.createElement('button');
    if(index[0][0]){
        upgradeBtnTxt = "CHOOSE UPGRADE";
        upgradeBtn.onclick = function(){spendPoint(abilityIcon, abilityDesc, stat, classNum, true);};
    }
    else{
        upgradeBtnTxt = "UPGRADE";
        upgradeBtn.onclick = function(){spendPoint(abilityIcon, abilityDesc, stat, classNum, false);};
    }

    upgradeBtn.textContent = upgradeBtnTxt;
    upgradeBtn.classList.add('abilityBaseLock');
    upgradeBtn.classList.add('noClick');
    abilityDesc.appendChild(upgradeBtn);
}

//PAGE MODIFY
//============================================================
//============================================================

//ACTIVE ELEMENT
//================================

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

//CHARACTER MODIFICATION
//================================

function selectRace(raceFile, raceIndex, submitBtn){
    var raceImg = document.getElementById('raceImg');
    var characterTab = document.querySelector('#navBar .tab');
    submitBtn.classList.remove("noClick", "abilityBaseLock");
    characterTab.click();
    
    raceImg.src = "Assets/MyriadIcons/"+raceFile[raceIndex][0][0][1][1]+".png";

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
    character.misc.statChoices[row] = indexValue;
}

//Info: Submits user input for character creation and adds styling 
//  +Sets 'hardLock' class on tabs not selected
//  +Sets 'hardLock' class on ability tiers of tabs selected
//  +Calls generateCharacter()
function submitCharacter(){
    var createTab = document.getElementById('character');
    var raceTab = document.getElementById('character2');
    var tabs = document.querySelectorAll('.tab');
    var pages = document.querySelectorAll('.abilityIcons');

    //Setting 'hardLock' on all ability tabs and pages
    for(var x = 0; x < pages.length; x++){
        pages[x].classList.add('hardLock');
    }
    for(var x = character.misc.tabsOffset; x < tabs.length; x++){
        tabs[x].classList.add('hardLock');
    }

    //Modify selected tabs and pages
    for(var x = 0; x < character.misc.statChoices.length; x++)
    {
        //Removing 'hardLock' 
        pages[character.misc.statChoices[x]].classList.remove('hardLock');
        tabs[character.misc.statChoices[x]+character.misc.tabsOffset].classList.remove('hardLock');
        
        //Setting 'hardLock' on each ability tier
        var tiers = pages[character.misc.statChoices[x]].querySelectorAll('.tier');
        for(var y = 0; y < tiers.length; y++){
            tiers[y].classList.add('hardLock');
        }

        //setting 'hardLock' on each class ability set
        var classes = pages[character.misc.statChoices[x]].querySelectorAll('.classInfo');
        for(var y = 0; y < classes.length; y++){
            classes[y].classList.add('hardLock');
        }

        classes = pages[character.misc.statChoices[x]].querySelectorAll('.passiveSkills');
        for(var y = 0; y < classes.length; y++){
            classes[y].classList.add('hardLock');
        }

        classes = pages[character.misc.statChoices[x]].querySelectorAll('.classSkills');
        for(var y = 0; y < classes.length; y++){
            classes[y].classList.add('hardLock');
        }


        //set global stat choice element pages
        var page = document.querySelectorAll('.page');
        character.html.statChoiceElements.push(page[character.misc.statChoices[x]+character.misc.tabsOffset]);
    }
    generateCharacter(createTab, raceTab);
}

function generateCharacter(parent, parent2){
    var raceImg = document.getElementById('raceImg');
    raceImg.onclick = null;

    for(var x = 0; x < character.misc.statChoices.length; x++){
        character.misc.classPoints[character.misc.statChoices[x]]++;
    }

    while(parent.firstChild){
        parent.removeChild(parent.lastChild);
    }

    while(parent2.firstChild){
        parent2.removeChild(parent2.lastChild);
    }

    parent.appendChild(raceImg);

    var charValues = document.createElement('table');
    var body = document.createElement('tbody');
    for(var x = 0; x < Object.keys(character.stat).length; x++){
        var row = document.createElement('tr');
        for(var y = 0; y < 2; y++){
            var data = document.createElement('td');
            if(y == 0){
                data.innerHTML = Object.keys(character.stat)[x];
            }
            else{
                data.innerHTML = Object.values(character.stat)[x];
                data.id = "char"+Object.keys(character.stat)[x];
            }
            row.appendChild(data);
        }
        body.appendChild(row);
    }
    charValues.appendChild(body);
    parent.appendChild(charValues);

    // var level = document.createElement('div');
    // level.textContent = character.stat.level;
    // parent.appendChild(level);
    // character.html.level = level;

    var levelUpBtn = document.createElement('button');
    levelUpBtn.textContent = "LEVEL UP+";
    levelUpBtn.onclick = function(){levelUp();};

    character.html.levelBtn = levelUpBtn;
    
    parent.appendChild(levelUpBtn);

    createSkillPage();
    loadCharacter();
    updateStats();
}

function loadCharacter(){
    //get tree passives
    var abilityPageDescs = document.querySelectorAll('.abilitydescs .tier0');

    for(var x = 0; x < character.misc.statChoices.length; x++){
        var passives = abilityPageDescs[character.misc.statChoices[x]].querySelectorAll("* button");
        for(var y = 0; y < passives.length; y++){
            passives[y].click();
        }
    }

    console.log(character.misc.statValues.length);
    for(var x = 0; x < character.misc.statValues.length; x++){
        console.log(character.stat.Accuracy);
        if(x == 0){
            var add = parseInt(character.misc.statValues[x]) * 3;
            console.log(add);
            character.stat.Accuracy = parseInt(character.stat.Accuracy) + parseInt(add);
            console.log(character.stat.Accuracy);
        }
        else if(x == 1){
            character.stat.Focus = character.stat.Focus + character.misc.statValues[x]*1;
        }
        else if(x == 3){
            character.stat.MadResist = character.stat.MadResist + character.misc.statValues[x]*1;
        }
        else{
            //str or negative
        }
    }

    resetSkillPoints();
}

function createSkillPage(){
    var skillsPage = document.querySelector('#character2');
    var groupClasses = [[],[]];
    groupClasses[0] = ['All', 'Armor', 'Focus', 'Adrenaline', 'Wealth', 'Accuracy', 'Sanity'];
    groupClasses[1] = ['Attack', 'Move', 'Reaction', 'Free'];

    for(var x = 0; x < 2; x++){
        var title = document.createElement('h2');
        title.classList.add('skillPageTierTitle');
        skillsPage.appendChild(title);

        var btnBar = document.createElement('div');
        btnBar.classList.add('skillBtnBar');
        skillsPage.appendChild(btnBar);

        for(var y = 0; y < groupClasses[x].length; y++){
            let sortBtn = document.createElement('button');
            sortBtn.textContent = groupClasses[x][y];
            sortBtn.onclick = function(){setSkillsActive(sortBtn, sortBtn.textContent)};
            btnBar.appendChild(sortBtn);
        }

        var group = document.createElement('div');
        if(x == 0){
            group.classList.add('skillPassives');
            title.textContent = "Passives";
        }
        else{
            group.classList.add('skillActives');
            title.textContent = "Actives";
        }
        group.classList.add('skillPageTier');
        skillsPage.appendChild(group);
    }
}

//stat = which tree
//index = which class
//abilitySet = icon parent div
function selectClass(index,stat){
    if(character.misc.numOfClasses < 2){
        var classes = getClasses(stat);

        character.misc.classChoices[character.misc.numOfClasses][0] = stat;
        character.misc.classChoices[character.misc.numOfClasses][1] = index;
        //select classes and passives
        var classImg = classes[index][0][0].querySelector('img');
        classImg.classList.add('selected');


        var classPassives = classes[index][1][0].querySelectorAll('img');
        var classPassivesDescBtns = classes[index][1][1].querySelectorAll('button');
        
        for(var x = 0; x < classPassives.length; x++){
            // classPassives[x].classList.add('selected');
            classPassivesDescBtns[x].click();
        }


        //reduce class points per stat tree
        character.misc.classPoints[stat]--;
        if(character.misc.classPoints[stat] == 0){
            //LockClasses
            for(var x = 0; x < classes.length; x++){
                var classInfoImg = classes[x][0][0];
                classInfoImg.classList.add('hardLock');
                var classInfoDesc = classes[x][0][1];
                var classSelectBtn = classInfoDesc.querySelector('button');
                classSelectBtn.classList.add('max');
            }
        }

        //increment number of classes
        character.misc.numOfClasses++;
        //
        if(character.misc.numOfClasses == 2){
            //reset skill points because we messed the skillpoint values
            //when we clicked on passives
            resetSkillPoints();
            addPoints();
            unlockLevel();
        }
    }
    else{
        //testing
        console.log("select class error!");
    }
}

//SPEND POINTS
//================================
//spending points is the start of a leveling process
//should only be clickable when you have points to spend and upgrades left
function spendPoint(icon, desc, stat, classNum, choiceUpgrade){
    //change css of icon and desc
    if(icon.classList.contains('selected')){
        if(choiceUpgrade == false){
            var upgradeLock = desc.getElementsByClassName('abilityUpgradeLock');
            if(upgradeLock.length>0){
                upgradeLock[0].classList.remove('abilityUpgradeLock');
                checkAbilityMax(desc);
            }
            else{
                //testing
                console.log("clicked on ability that is MAXED!");
            }
        }
        else{
            chooseUpgrade(desc);
        }
    }
    else{
        icon.classList.add('selected');

        createSkillDouble(icon, desc, stat);

        var baseLock = desc.getElementsByClassName('abilityBaseLock');
        if(baseLock.length != 0){
            while(baseLock.length>0){
                baseLock[0].classList.remove('abilityBaseLock');
            }

            checkAbilityMax(desc);
        }
        else{
            chooseUpgrade(desc);
        }
    }

    //change classNum to classIndex
    var classIndex = classNum - 4;
    //subtract points
    if(character.stat.Level >= 4 && classIndex > -1){
        character.misc.skillPoints[1][stat][1][classIndex]--;
    }
    character.misc.skillPoints[1][stat][0]--;
    character.misc.skillPoints[0]--;

    //lock class
    if(classIndex >= 0){
        if(character.misc.skillPoints[1][stat][1][classIndex] == 0){
        var lockClass = getClass(stat, classIndex);
        lockSet(lockClass[0]);
        lockSet(lockClass[1]);
        lockSet(lockClass[2]);
        }
    }
    

    //lock levels and end level up
    if(character.misc.skillPoints[1][stat][0] == 0){
        //lock stat tree components
        lockLevel(stat);
        if(character.misc.skillPoints[0] == 0){
            //unlock level up
            resetSkillPoints();
            levelComplete();
        }
    }

    //update character stats
    updateStats();

}

function checkAbilityMax(desc){
    if(desc.getElementsByClassName('abilityUpgradeLock').length == 0){
        desc.querySelector('button').classList.add('max');
        desc.querySelector('button').textContent = "MAXED";
    }
}

function chooseUpgrade(desc){
    var upgrades = desc.querySelectorAll('.abilityUpgradeLock');
    for(var x = 0; x < upgrades.length; x++){
        upgrades[x].classList.add('option');
        upgrades[x].classList.remove('noClick');
    }
}

function selectUpgrade(row, desc){
    var upgrades = desc.querySelectorAll('.abilityUpgradeLock');
    for(var x = 0; x < upgrades.length; x++){
        upgrades[x].classList.remove('option');
    }
    row.classList.remove('abilityUpgradeLock');
    checkAbilityMax(desc);
}

//lock level can be only one page
function lockLevel(stat){
    switch(character.stat.Level){
        case 1:
            var pageTier = getPageTier('.tier1', stat);
            lockSet(pageTier);
            break;
        case 2:
        case 3:
            var pageTier = getPageTier('.tier2', stat);
            lockSet(pageTier);
            break;
        case 4:
            var pageTier = getPageTier('.tier2', stat);
            lockSet(pageTier);
            pageTier = getPageTier('.tier3', stat);
            lockSet(pageTier);
            break;
        case 5:
            var pageTier = getPageTier('.tier2', stat);
            lockSet(pageTier);

            for(var x = 0; x<character.misc.classChoices.length; x++){
                if(character.misc.classChoices[x][0] == stat){
                    var cls = getClass(character.misc.classChoices[x][0], character.misc.classChoices[x][1]);
                    lockSet(cls[0]);
                    lockSet(cls[1]);
                    lockSet(cls[2]);
                }
            }

            break;
        default:
            var pageTier = getPageTier('.tier2', stat);
            lockSet(pageTier);

            for(var x = 0; x<character.misc.classChoices.length; x++){
                if(character.misc.classChoices[x][0] == stat){
                    var cls = getClass(character.misc.classChoices[x][0], character.misc.classChoices[x][1]);
                    lockSet(cls[0]);
                    lockSet(cls[1]);
                    lockSet(cls[2]);
                }
            }
            break;
    }
}

function getPageTier(tier, stat){
    var nth = stat+character.misc.tabsOffset;
    var statPage = document.querySelectorAll('.page')[nth];

    var pageTierIcons = statPage.querySelectorAll(tier);
    var pageDescs = document.querySelectorAll('.abilitydescs');
    var pageTierDescs = pageDescs[stat+1].querySelectorAll(tier);
    
    var pageTier = [pageTierIcons[0]];
    pageTier.push(pageTierDescs[0]);
    return pageTier;
}

function lockSet(set){
    set[0].classList.add('hardLock');
        
    var descrs = set[1].querySelectorAll('.abilityDesc button');
    
    for(var x = 0; x < descrs.length; x++){
        descrs[x].classList.add('noClick', 'abilityBaseLock');
    }
}
//having no points is the end of a leveling process
function levelComplete(){
    character.html.levelBtn.classList.remove('noClick', 'abilityBaseLock');
}

//ADD POINTS/LEVEL UP
//================================

function levelUp(){
    updateStat("Level", 1);
    
    if(character.stat.Level != 5){
        unlockLevel();
        addPoints();
    }
    else{
        for(var x = 0; x<character.misc.statChoices.length; x++){
            var classes = getClasses(character.misc.statChoices[x]);
            for(var y = 0; y < classes.length; y++){
                var cls = getClass(character.misc.statChoices[x], y);
                unlockSet(cls[0]);
            }
        }
    }

    character.html.levelBtn.classList.add('noClick', 'abilityBaseLock');
}

//unlock always unlocks all selected pages
function unlockLevel(){
    switch(character.stat.Level){
        case 1:
            unlockPageTiers('.tier1');
            break;
        case 2:
        case 3:
            unlockPageTiers('.tier2');
            break;
        case 4:
            unlockPageTiers('.tier3');
            break;
        default:
            unlockPageTiers('.tier2');

            for(var x = 0; x<character.misc.classChoices.length; x++){
                var cls = getClass(character.misc.classChoices[x][0], character.misc.classChoices[x][1]);
                unlockSet(cls[0]);
                unlockSet(cls[1]);
                unlockSet(cls[2]);
            }
            break;
    }
}

function unlockPageTiers(selector){
    for(var x = 0; x < character.html.statChoiceElements.length; x++){
        var tierIcons = character.html.statChoiceElements[x].querySelectorAll(selector);
        
        var pageDescs = document.querySelectorAll('.abilitydescs');
        var pageDesc = pageDescs[character.misc.statChoices[x]+1];
        var tierDesc = pageDesc.querySelectorAll(selector);

        var tierMod = [tierIcons[0]];
        tierMod.push(tierDesc[0]);

        unlockSet(tierMod);
    }
}

function unlockSet(set){
    set[0].classList.remove('hardLock');
        
    var descrs = set[1].querySelectorAll('.abilityDesc button');
    for(var x = 0; x < descrs.length; x++){
        descrs[x].classList.remove('noClick', 'abilityBaseLock');
    }
}

//add points is at the end of a level up process
function addPoints(){
    for(var x = 0; x < character.html.statChoiceElements.length; x++){
        character.misc.skillPoints[1][character.misc.statChoices[x]][0]++;
        character.misc.skillPoints[0]++;
        if(character.stat.Level >= 5){
            character.misc.skillPoints[1][character.misc.classChoices[x][0]][1][character.misc.classChoices[x][1]]++;
        }
    }
}

//Class Selectors
//======================

function getClass(stat, classNum){
    var icons = document.querySelectorAll('.abilityIcons');
    var descs = document.querySelectorAll('.abilitydescs');
    var iconPage = icons[stat];
    var descsPage = descs[stat+1];
    var classIcons = iconPage.querySelectorAll('.classDiv');
    var classDescs = descsPage.querySelectorAll('.classDiv');
    var classInfoIcon = iconPage.querySelectorAll('.classDiv .classInfo');
    var classInfoDesc = descsPage.querySelectorAll('.classDiv .classInfo');
    var classPassiveIcon = iconPage.querySelectorAll('.classDiv .passiveSkills');
    var classPassiveDesc = descsPage.querySelectorAll('.classDiv .passiveSkills');
    var classClassIcon = iconPage.querySelectorAll('.classDiv .classSkills');
    var classClassDesc = descsPage.querySelectorAll('.classDiv .classSkills');
    var classArray = [];
    classArray.push([classInfoIcon[classNum], classInfoDesc[classNum]]);
    classArray.push([classPassiveIcon[classNum], classPassiveDesc[classNum]]);
    classArray.push([classClassIcon[classNum], classClassDesc[classNum]]);
    return classArray;
}

function getClasses(stat){
    var icons = document.querySelectorAll('.abilityIcons');
    var descs = document.querySelectorAll('.abilitydescs');
    var iconPage = icons[stat];
    var descsPage = descs[stat];
    var classIcons = iconPage.querySelectorAll('.classDiv');
    var classes = [];
    for(var x = 0; x < classIcons.length; x++){
        classes.push(getClass(stat, x));
    }
    return classes;
}

function resetSkillPoints(){
    character.misc.skillPoints[0] = 0;
    for(var x = 0; x < character.misc.skillPoints[1].length; x++){
        character.misc.skillPoints[1][x][0] = 0;
        for(var y = 0; y < character.misc.skillPoints[1][x][1].length; y++){
            character.misc.skillPoints[1][x][1][y] = 0;
        }
    }
}

//Create Elements
//======================

function createSkillDouble(icon, desc, stat){
    var copyIcon = icon.cloneNode();
    copyIcon.classList.remove('selected');
    copyIcon.onclick = function(){clickOriginal(icon);};

    switch(stat){
        case 0:
            copyIcon.classList.add('dex');
            break;
        case 1:
            copyIcon.classList.add('int');
            break;
        case 2:
            copyIcon.classList.add('str');
            break;
        case 3:
            copyIcon.classList.add('mad');
            break;
    }

    addDoubleClasses(copyIcon, desc);

    var skillsPage = document.querySelector('#character2');
    var action = copyIcon.classList.contains('skillAction');
    var adrenaline = copyIcon.classList.contains('skillAdrenaline');
    var parent;
    
    if(action){  
        parent = skillsPage.querySelector('.skillActives');
    }
    else{
        parent = skillsPage.querySelector('.skillPassives');
    }

    parent.appendChild(copyIcon);
}

function addDoubleClasses(icon, desc){
    var descArray = [];
    var rows = desc.querySelectorAll('tr');
    for(var x = 0; x < rows.length; x++){
        var cells = rows[x].querySelectorAll('td pre');
        var cellsContent = [cells[0].textContent, cells[1].textContent];
        descArray.push(cellsContent);

        icon.classList.add('skillAll');

        if(cells[0].textContent.includes('Action')){
            icon.classList.add('skillAction');
            if(cells[1].textContent.includes('Attack')){
                icon.classList.add('skillAttack');
            }
            if(cells[1].textContent.includes('Move')){
                icon.classList.add('skillMove');
            }
            if(cells[1].textContent.includes('Reaction')){
                icon.classList.add('skillReaction');
            }
            if(cells[1].textContent.includes('Free')){
                icon.classList.add('skillFree');
            }
        }

        if(cells[0].textContent.includes('Adrenaline')){
            icon.classList.add('skillAdrenaline');
        }
        if(cells[1].textContent.includes('Adrenaline')){
            icon.classList.add('skillAdrenaline');
        }

        if(cells[0].textContent.includes('Sanity')){
            icon.classList.add('skillSanity');
        }
        if(cells[1].textContent.includes('Sanity')){
            icon.classList.add('skillSanity');
        }

        if(cells[0].textContent.includes('Focus')){
            icon.classList.add('skillFocus');
        }
        if(cells[1].textContent.includes('Focus')){
            icon.classList.add('skillFocus');
        }

        if(cells[0].textContent.includes('Wealth')){
            icon.classList.add('skillWealth');
        }

        if(cells[1].textContent.includes('Accuracy')){
            icon.classList.add('skillAccuracy');
        }        
    }
}

function clickOriginal(icon){
    icon.click();
}
//NEXT UP
//+Add selected skill icons to character page
//+edit url and use it to load character

function setSkillsActive(button, name){
    //testing
    console.log(name);
    var selector = '.skill' + name;
    var allSkills = document.querySelectorAll('.skillPageTier img');
    var skills = document.querySelectorAll(selector);

    var allBtns = document.querySelectorAll('.skillBtnBar button');

    for(var x = 0; x < allBtns.length; x++){
        allBtns[x].classList.remove('btnSelected');
    }
    button.classList.add('btnSelected');

    for(var x = 0; x < allSkills.length; x++){
        allSkills[x].classList.remove('skillHighlight');
    }

    for(var x = 0; x < skills.length; x++){
        skills[x].classList.add('skillHighlight');
    }
}

function updateStat(varName, value){
    character.stat[varName] = character.stat[varName] + value;
    
    var id = "char"+varName;
    var htmlValue = document.getElementById(id);
    htmlValue.innerHTML = character.stat[varName];
}

function calcPassives(){
    for(var x = 0; x < Object.keys(character.passives).length; x++){
        character.passives[Object.keys(character.passives)[x]] = 0;
    }

    var passives = document.querySelectorAll('.skillPassives img');
    for(var x = 0; x < passives.length; x++){
        var desc = document.getElementById(passives[x].alt);
        var rows = desc.querySelectorAll('tr:not(.abilityBaseLock):not(.abilityUpgradeLock) td+td pre');
        
        for(var y = 0; y < rows.length; y++){
            for(var z = 0; z < Object.keys(character.stat).length; z++){
                if(rows[y].textContent.includes(Object.keys(character.stat)[z])){
                    var key = Object.keys(character.stat)[z];
                    var matches = rows[y].textContent.split(Object.keys(character.stat)[z]).filter(function(el) {return el.length != 0});
                    matches.pop();
                    var valueFound = false;
                    console.log("I got here");
                    console.log(matches);
                    for(var a = 0; a < matches.length; a++){
                        if(valueFound == true){
                            break;
                        }
                        var words = matches[a].split(' ').filter(function(el) {return el.length != 0});
                        console.log(words);
                        console.log(words[words.length-1]);
                        let adjacentWord = words[0];
                        console.log("adjWord"+adjacentWord);
                        console.log(key);
                        var increment = adjacentWord.split('+')[1];

                        if(increment === undefined){
                            increment = adjacentWord.split('-')[1];
                            
                            if(increment === undefined){
                                increment = 0;
                            }
                            else{
                                increment = increment.split(' ')[0];
                                increment = "-" + increment;
                                valueFound = true;
                            }
                        }
                        else{
                            valueFound = true;
                        }
                        
                        character.passives[key] = parseInt(character.passives[key]) + parseInt(increment);
                    }
                }
            }
        }
    }
}

function updateStats(){
    calcPassives();
    for(var x = 0; x < Object.keys(character.stat).length; x++){
        console.log(Object.values(character.stat)[x]);
        var total = Object.values(character.stat)[x] + Object.values(character.passives)[x];
        var name = Object.keys(character.stat)[x];
        var id = "char"+name;
        var element = document.getElementById(id);
        element.innerHTML = total;
    }
}

function addStat(index, statDisplay){
    character.misc.statValues[index] += 1;
    statDisplay.innerHTML = character.misc.statValues[index];
}

function subStat(index, statDisplay){
    character.misc.statValues[index]--;
    statDisplay.innerHTML = character.misc.statValues[index];
}

