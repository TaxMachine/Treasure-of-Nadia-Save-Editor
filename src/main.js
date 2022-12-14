const
    {
        mkdirSync,
        existsSync
    } = require('fs'),
    gradient = require('gradient-string'),
    readline = require('readline-sync'),
    tables = require('text-table'),
    {
        getMoney,
        addMoney,
        getHeart,
        addHeart,
        getChestKeys,
        addChestKeys,
        getFileList,
        changeUsername,
        parseGameDirectory,
        characterArray,
        exportGameSave
    } = require('./modules/TON'),
    usr = process.env.USER || process.env.username
const shell = (file) => {
    let
        command = readline.question(gradient.instagram(`┌${'─'.repeat(usr.length + 18)}┐\n│ ${usr}@TON-Save-Editor │\n├${'─'.repeat(usr.length + 18)}┘\n└>`)),
        arguments = command.split(" ")
    switch (arguments[0].toLowerCase()) {
        case "addmoney":
            if (!arguments[1]) {
                console.log(gradient("red", "red")("Invalid syntax! Try this syntax: addmoney [amount]"))
                break
            }
            if (!Number.isInteger(parseInt(arguments[1]))) {
                console.log(gradient("red", "red")("the amount you've passed is not an integer"))
                break
            }
            addMoney(file, parseInt(arguments[1]))
            console.log(gradient("green", "green")(`Successfully added ${arguments[1]} to your save file`))
            break
        case "getmoney":
            let money = getMoney(file)
            console.log(gradient.vice(`you currently have ${money}$`))
            break
        case "addheart":
            if ((!arguments[1] || !arguments[2]) || !characterArray.includes(arguments[1].toLowerCase())) {
                console.log(gradient("red", "red")(`Invalid syntax! Try using this syntax: addheart [character] [amount]`))
                break
            }
            if (!Number.isInteger(parseInt(arguments[2]))) {
                console.log(gradient("red", "red")("the amount you've passed is not an integer"))
                break
            }
            addHeart(file, arguments[1], parseInt(arguments[2]))
            console.log(gradient("green", "green")(`Successfully added ${arguments[2]} ❤️ to ${arguments[1]}`))
            break
        case "getheart":
            if (!arguments[1] || !characterArray.includes(arguments[1].toLowerCase())) {
                console.log(gradient("red", "red")(`Invalid syntax! Try using this syntax: getheart [character]`))
                break
            }
            let hearts = getHeart(file, arguments[1].toLowerCase())
            console.log(gradient.vice(`You currently have ${hearts} ❤ with ${arguments[1]}️`))
            break
        case "addkeys":
            if (!arguments[1]) {
                console.log(gradient("red", "red")("Invalid syntax! Try using this syntax: addkeys [amount]"))
                break
            }
            if (!Number.isInteger(parseInt(arguments[1]))) {
                console.log(gradient("red", "red")("the amount you've passed is not an integer"))
                break
            }
            addChestKeys(file, parseInt(arguments[1]))
            console.log(gradient("green", "green")(`Successfully added ${arguments[1]} chest keys!`))
            break
        case "getkeys":
            let keys = getChestKeys(file)
            console.log(gradient.vice(`You currently have ${keys} chest keys`))
            break
        case "changeusr":
            if (!arguments[1]) {
                console.log(gradient("red", "red")("Invalid syntax! Try using this syntax: changeusr [new username]"))
                break
            }
            changeUsername(file, arguments[1])
            console.log(gradient("green", "green")(`Successfully changed your IGN to ${arguments[1]}`))
            break
        case "characters":
            console.log(gradient.vice(characterArray.join('\n')))
            break
        case "export":
            let
                date = new Date(),
                filename = `${file}-${date.getFullYear()}-${date.getMonth()}-${date.getDay()}-${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}.json`
            exportGameSave(file, `${__dirname}/backups/TON/${filename}`)
            console.log(gradient("green", "green")(`Backup saved to ${__dirname}/backups/TON/${filename}`))
            break
        case "help":
            let cmds = tables([
                ["Command", "Argument 1", "Argument 2", "Description"],
                ["───────", "──────────", "──────────", "───────────"],
                ["getmoney", "", "", "Gets the amount of money the player has"],
                ["getheart", "character", "", "Gets the amount of heart the player has with a specific girl"],
                ["addmoney", "amount", "", "Adds the given amount of money to the player"],
                ["addheart", "character", "amount", "Adds the given amount of heart to a specific girl"],
                ["addkeys", "amount", "", "Adds the given amount of keys to the player's inventory"],
                ["getkeys", "", "", "Gets the amount of keys the player has"],
                ["characters", "", "", "Shows a list of all characters present in the game"],
                ["export", "", "", `Exports the loaded save file in ${__dirname}/backups/TON`],
                ["help", "", "", "Displays this menu"]
            ], {align: ['l', 'l', 'l', 'l']})
            console.log(gradient.atlas(cmds.toString()))
            break
        default:
            console.log(gradient('red', 'red')(`No such command: ${arguments[0]}`))
            break
    }
}

const main = async() => {
    !existsSync(`${__dirname}/backups`) ? mkdirSync(`${__dirname}/backups/TON`) : null
    let file = process.argv[2]
    if (!existsSync(parseGameDirectory(file))) {
        console.log(gradient('red', 'red')("This save file does not exists"))
        console.log(process.argv)
        let files = getFileList()
        console.log(gradient.cristal(`Here's all available save files on this device\n${files.text.replace(/ /g, "\n")}`))
        process.exit(0)
    }
    console.clear()
    let err = false
    while (!err) {
        shell(file)
    }
}

main()