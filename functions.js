var Rarity = {COMMON:1, RARE:2, EPIC:3, LEGENDARY:4};
var Set = {CLASSIC:1, NAXX:2, GVG:3, BRM:4};
var playerClasses = {DRUID:1, HUNTER:2, MAGE:3, PALADIN:4, PRIEST:5, ROGUE:6, SHAMAN:7, WARLOCK:8, WARRIOR:9, NEUTRAL:10};

//Make the first letter of each word in a string uppercase
function toTitleCase(str) {
    return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
}