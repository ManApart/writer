//const regex = /(?<!#\s)(?<!\[)(?<!#)(?<!#.+)(Breymin)/gi;
const key = 'Breymin'
const regex = new RegExp("(?<!#\s)(?<!\\[)(?<!#)(?<!#.+)("+key+")","gi");
const str = `Breymin had been so engrossed in his reading that he hadn't heard Eln's footsteps fall against the warm stone floor. It was only when the light from Eln's candle cast new shadows on Breymin's book that he realized he was not alone. 

## Breymin

## Young Breymin

Breymin smiled in the darkness and turned to face his old friend. Eln's face did not echo Breymin's joy. The candle's dark shadows carved Eln's face. [Breymin](blah#breymin)
`;
let m;

while ((m = regex.exec(str)) !== null) {
    // This is necessary to avoid infinite loops with zero-width matches
    if (m.index === regex.lastIndex) {
        regex.lastIndex++;
    }
    
    // The result can be accessed through the `m`-variable.
    m.forEach((match, groupIndex) => {
        console.log(`Found match, group ${groupIndex}: ${match}`);
    });
}

const path='test'
console.log(str.replace(regex, '[$1](' + path + ')'))