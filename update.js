const linker = require('./linker')
const fs = require('fs')

if (!process.argv[2]){
    console.error("Please provide the path to your story repo")
    process.exit(1)
}

copyWebFiles()

linker.linkFiles(process.argv[2])


function copyWebFiles(){
    fs.createReadStream('mdwiki.html').pipe(fs.createWriteStream('./out/mdwiki.html'));
}