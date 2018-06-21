const fs = require('fs');
const path = require('path');
const basePath = 'http://localhost:8080/mdwiki.html#!./out/'
const trackedFiles = ['characters.md', 'locations.md', 'items.md', 'creatures.md']
const ignoredWords = ['the', 'of', 'grey', 'cloak', 'black', 'moon', 'shadow', 'hunter', 'slave', 'rope', 'dagger', 'map', 'key', 'tunic', 'shoes'].map(value => { return value.toLowerCase() })
const mdFiles = []
let origRootPath = ''

function linkFiles(source) {
    origRootPath = source
    getFiles(source)
    // console.log(mdFiles)
    const links = createLinks(mdFiles)
    // console.log('link map', links)
    transformFiles(mdFiles, links)
}

function getFiles(baseFolder) {
    console.log('reading files from', baseFolder)
    const files = fs.readdirSync(baseFolder)
    files.forEach(function (file, index) {
        const fromPath = path.join(baseFolder, file)
        const stat = fs.statSync(fromPath)
        if (stat.isFile() && !fromPath.endsWith('.gitignore')) {
            const fileInfo = { name: file, path: fromPath }
            mdFiles.push(fileInfo)
        }
        else if (stat.isDirectory() && fromPath.indexOf('.git') == -1) {
            getFiles(fromPath)
        }
    })
}

function createLinks(mdFiles) {
    let links = []
    mdFiles.forEach((file) => {
        if (trackedFiles.indexOf(file.name) > -1) {
            const data = fs.readFileSync(file.path, 'utf8')
            var myRegexp = /[^#]#{2} (.*)/g
            var match = myRegexp.exec(data)
            while (match != null) {
                const path = basePath + file.path.replace(/\\/g, '/') + '#' + match[1].replace(/ /g, '_')
                const cleanedName = match[1].toLowerCase().replace(/[^a-zA-Z0-9 ]/g, '')
                let link = { name: cleanedName, path: path, variants: [] }
                const words = cleanedName.split(' ')
                if (words.length > 1) {
                    words.forEach(word => {
                        if (word.length > 0 && ignoredWords.indexOf(word) == -1) {
                            link.variants.push(word)
                        }
                    })
                }
                links.push(link)
                match = myRegexp.exec(data);
            }
        }
    })

    return links
}

function transformFiles(mdFiles, links) {
    // const file = mdFiles[0]
    mdFiles.forEach((file) => {
        const data = fs.readFileSync(file.path, 'utf8')

        let converted = data
        // var link = links[0]
        // console.log(link)
        links.forEach(link => {
            converted = replaceWord(converted, link.name, link.path)
            link.variants.forEach(variant => {
                converted = replaceWord(converted, variant, link.path)
            })
        })

        //write the file to the out folder
        const path = './out/' + file.path.substring(origRootPath.length+1)
        console.log('writing file', path)
        ensureDirectoryExistence(path)
        fs.writeFile(path, converted, function (err) { })

    })
}

function replaceWord(data, key, path) {
    const regex = new RegExp("(?<!#\s)(?<!\\[)(?<!#)(?<!#.+)(" + key + ")", "gi");
    return data.replace(regex, '[$1](' + path + ')')
}

function ensureDirectoryExistence(filePath) {
    var dirname = path.dirname(filePath);
    if (fs.existsSync(dirname)) {
        return true;
    }
    ensureDirectoryExistence(dirname);
    fs.mkdirSync(dirname);
}

exports.linkFiles = linkFiles