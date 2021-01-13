import json;

abilityFile = open("MyriadLevelsInfo.txt", "r");
contents = abilityFile.read();

#split file into abilities
races = contents.split("@");
races.pop(0);
for index, race in enumerate(races):
    races[index] = race.split("#")[1];

with open("levels.json", "w") as file:
    json.dump(races, file);