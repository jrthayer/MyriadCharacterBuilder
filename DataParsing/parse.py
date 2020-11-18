
import json;

abilityFile = open("MyriadAbilityInfo.txt", "r");
contents = abilityFile.read();

#split file into abilities
abilities = contents.split("*");


bookmarks = [["DEX"], ["INT"], ["STR"], ["MAD"]];
delAbilities = [];
curStat = -1;


#split abilities into their individual lines
for index, ability in enumerate(abilities):
    #Find index values that seperate each stat tree and their ability tiers
    if "===========" in ability:
        curStat+=1;
        bookmarks[curStat].append(index);
        del abilities[index];
    elif "[Tier" in ability:
        if "[Tier4" in ability:
            classMarker = ability.split("(");
            className = classMarker[1];
            className = className.split(")");
            className = className[0];
            bookmarks[curStat].append([index, className]);
        else:
            bookmarks[curStat].append(index);
        del abilities[index];

    abilityLines = abilities[index].split("#");

    choiceAbility = False;
    #determine if ability is unordered or ordered(upgrades picked rather than incremented)
    if "-----" in abilityLines[1]:
        choiceAbility = True;
        abilityLines[1] = abilityLines[1].split("---")[0];
    #first line of ability is special case
    abilityLines[0] = [choiceAbility, ["Name" , abilityLines[0]]];
    iterAbilityLines = iter(abilityLines);
    next(iterAbilityLines);

    #split each line into key pairs
    for index2, line in enumerate(iterAbilityLines):
        abilityLines[index2+1] = line.split(None,1);

    #convert to json
    abilities[index] = abilityLines;

bookmarks = bookmarks;
abilityBookmarkList = [bookmarks, abilities];

with open("ability.json", "w") as file:
    json.dump(abilityBookmarkList, file);



#remove sepeartion entites from abilities
# print(delAbilities);
# print(sorted(delAbilities, reverse=True));
# for index in sorted(delAbilities, reverse=True):
#     del abilities[index];
#print(abilities[18]);

# print(abilityJN);


