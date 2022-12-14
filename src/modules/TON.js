const
    {writeFileSync, readFileSync, readdirSync, existsSync, copyFileSync} = require('fs'),
    gradient = require('gradient-string'),
    LZString = require('./decoder'),
    characters = {
        "alia": 65,
        "diana": 66,
        "emily": 67,
        "jessica": 68,
        "clare": 69,
        "janet": 70,
        "naomi": 71,
        "pricia": 72,
        "tasha": 73,
        "kaley": 74,
        "madalyn": 75,
        "sofia": 76
    },
    characterArray = [
        "alia",
        "diana",
        "emily",
        "jessica",
        "clare",
        "janet",
        "naomi",
        "pricia",
        "tasha",
        "kaley",
        "madalyn",
        "sofia"
    ],
    local = process.env.LOCALAPPDATA || process.env.HOME
const
    parseGameDirectory = (file) =>  process.platform === "win32" ? `${local}\\User Data\\${file}` : `${local}/.config/KADOKAWA/RPGMV/${file}`,

    getGameSaveFiles = (file) => JSON.parse(LZString.decompressFromBase64(readFileSync(parseGameDirectory(file), 'utf8'))),

    writeChanges = (file, data) => writeFileSync(parseGameDirectory(file), LZString.compressToBase64(JSON.stringify(data))),

    exportGameSave = (file, output) => writeFileSync(output, JSON.stringify(getGameSaveFiles(file))),

    getFileList = () => {
        const files = process.platform === "win32" ? readdirSync(`${local}\\User Data`) : readdirSync(`${local}/.config/KADOKAWA/RPGMV/`);

        const matchingFiles = files.filter(file => file.match(/Defaultfile[\d+].rpgsave/gm));

        return {
            html: matchingFiles.map(file => `<option value="${file}">${file}</option>`).join(''),
            json: matchingFiles,
            text: matchingFiles.join(' ')
        }
    },
    getMoney = (file) => {
        let
            save = getGameSaveFiles(file),
            amount = parseInt(save["variables"]["_data"]["@a"][51].replace(/\$/g, ""))
        return isNaN(amount) ? 0 : amount
    },
    addMoney = (file, amount) => {
        let save = getGameSaveFiles(file)
        save["variables"]["_data"]["@a"][2] += parseInt(amount)
        save["variables"]["_data"]["@a"][51] = `\$${save["variables"]["_data"]["@a"][2]}`
        writeChanges(file, save)
    },
    getHeart = (file, character) => {
        let
            save = getGameSaveFiles(file),
            amount = parseInt(save["variables"]["_data"]["@a"][characters[character]])
        return isNaN(amount) ? 0 : amount
    },
    addHeart = (file, character, amount) => {
        let
            save = getGameSaveFiles(file),
            heart = save["variables"]["_data"]["@a"][characters[character]]
        if (heart + amount > 6) {
            console.log(gradient("orange", "orange")("The amount you've passed exceeds the limit. Setting it to the maximum value"))
            save["variables"]["_data"]["@a"][characters[character]] = 6
        } else save["variables"]["_data"]["@a"][characters[character]] += amount
        writeChanges(file, save)
    },
    addChestKeys = (file, amount) => {
        let save = getGameSaveFiles(file)
        save["party"]["_items"]["19"] = amount
        writeChanges(file, save)
    },
    getChestKeys = (file) => {
        let
            save = getGameSaveFiles(file),
            amount = save["party"]["_items"]["19"]
        return isNaN(amount) ? 0 : amount
    },
    changeUsername = (file, newUser) => {
        let save = getGameSaveFiles(file)
        save["actors"]["_data"]["@a"][1]["_name"] = newUser
        writeChanges(file, save)
    }
module.exports = {
    getMoney,
    addMoney,
    getHeart,
    addHeart,
    getGameSaveFiles,
    getChestKeys,
    addChestKeys,
    getFileList,
    changeUsername,
    exportGameSave,
    parseGameDirectory,
    characterArray
}