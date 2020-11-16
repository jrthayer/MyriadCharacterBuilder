test = open("MyriadAbilityInfo.txt", "r");
contents = test.read();
abilities = contents.split("*");

for index, ability in enumerate(abilities):
    abilityLines = ability.split("#");
    iterAbilityLines = iter(abilityLines);
    next(iterAbilityLines);
    for index2, line in enumerate(iterAbilityLines):
        abilityLines[index2] = line.split(" ", 1);
    abilities[index] = abilityLines;

print(abilities[1]);