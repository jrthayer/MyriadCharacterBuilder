import json;

abilityFile = open("MyriadRacesInfo.txt", "r");
contents = abilityFile.read();

#split file into abilities
races = contents.split("=");
races.pop(0);
raceAbilities = [];

for index, race in enumerate(races):
    raceAbilities = races[index].split("*");
    races[index] = raceAbilities;

for index, race in enumerate(races):
    for index2, raceLines in enumerate(race):
        abilityLines = raceLines.split("#");

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
        for index3, line in enumerate(iterAbilityLines):
            abilityLines[index3+1] = line.split(None,1);

        # # #remove last newline of ability
        abilityLines[len(abilityLines) - 1][1] = abilityLines[len(abilityLines) - 1][1].rstrip('\n');

        if len(abilityLines[1]) == 1:
                del abilityLines[1];

        races[index][index2] = abilityLines;

with open("races.json", "w") as file:
    json.dump(races, file);