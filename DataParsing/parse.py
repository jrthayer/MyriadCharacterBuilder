test = open("MyriadAbilityInfo.txt", "r");
contents = test.read();
Abilities = contents.split("*");
print(Abilities[1]);