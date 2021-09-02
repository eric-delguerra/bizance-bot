const Discord = require("discord.js");
const bot = new Discord.Client();
const firebase = require("firebase");
const express = require('express')
const ytdl = require('ytdl-core')
const ytsr = require('ytsr')
const app = express()
let port = process.env.PORT || 3000
const cors = require('cors')
const fileUpload = require('express-fileupload')
app.use(cors())
app.use(fileUpload({}));
const dotenv = require('dotenv');
dotenv.config();
let devMode = false

// Dev
devMode = true
const config = require("./config.json");
bot.login(config.BOT_TOKEN);
const prefix = "?"
const firebaseConfig = require('./configFirebase.json');
const repliesFunctions = require("./playingSound");


// Prod
// bot.login(process.env.BOT_TOKEN)
// const prefix = "!"
//
// let firebaseConfig = {
//     apiKey: process.env.APIKEY,
//     authDomain: process.env.AUTHDOMAINE,
//     projectId: process.env.PROJECTID,
//     storageBucket: process.env.STORAGEBUCKET,
//     messagingSenderId: process.env.MESSAGINGSENDERID,
//     appId: process.env.APPID,
//     measurementId: process.env.MEASUREMENTID
// };

firebase.initializeApp(firebaseConfig);

app.listen(port, () => {
    console.log("Ca tourne")
})

let isPlaying = false;
let stayWithUs = false;
let musicQueue = [];
const queue = new Map();


bot.on('ready', function () {
    devMode ? bot.user.setUsername('Naig Robot upgrade') : bot.user.setUsername('Naig Robot')
    devMode ? bot.user.setActivity('filtrer les bugs') : bot.user.setActivity('filtrer le sel')
})

// Liste des commandes rentrées manuellement
let my_list_sound = ["love", "trello", "soupe", "ortolan", "nani", "tutut", "prout", "oma",
    "cbo", "crousti", "croustilove", "victime", "honteux", "oskur", "dge", "chomage", "souffrir"]
let my_list_other = [" !ping -> test", " !jail + @mention -> send user to jail", " !stay -> Naig Robot restera avec nous sur le voice", " !lesel", " !deadgame"]

const regExpYoutube = /^(?:https?:\/\/)?(?:m\.|www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/;

bot.on("message", async function (message) {
    if (message.author.bot) return;
    if (!message.content.startsWith(prefix)) return;

    const commandBody = message.content.slice(prefix.length);
    const args = commandBody.split(' ');
    const command = args.shift().toLowerCase();
    const serverQueue = queue.get(message.guild.id);


    if (command === "jail") {
        if (message.mentions.members.size) { // or message.mentions.members.size > 0
            let userToMove = message.mentions.members.first()

            //Gestion du Tosi
            if (message.author.id === "245634957081313281") {
                let random = Math.floor(Math.random() * 2) + 1
                if (random === 1) {
                    userToMove.voice.setChannel("224563297939226625")
                    message.reply("Il va nous foutre la paix comme ça.")
                } else {
                    message.member.voice.setChannel("224563297939226625")
                    message.reply("Dommage")
                }
            } else {
                // console.log(userToMove.voice)
                userToMove.voice.setChannel("224563297939226625")
                message.reply("Il va nous foutre la paix comme ça.")
            }
        }
    }

    if (command === "stay") {
        if (stayWithUs) {
            stayWithUs = false
            message.reply("Ok je m'en vais au prochain son.")
        } else {
            message.reply("Ok je reste avec vous maintenant")
            stayWithUs = true
        }
    }

    if (command === "ping") {
        repliesFunctions.ping(message)
    }

    switch (command) {
        case 'play':
            await execute(message, serverQueue);
            break;
        case 'stop':
            stop(message, serverQueue);
            break;
        case 'skip':
            skip(message, serverQueue);
            break;
    }

    async function execute(message, serverQueue) {
        let vc = message.member.voice.channel;
        if (!vc) {
            return message.channel.send("Tu dois être dans un vocal pour mettre ta musique de merde");
        } else {
            let stream
            let searchResult
            if (commandBody.slice(5).match(regExpYoutube)) {
                stream = ytdl(musicQueue[0], {filter: 'audioonly'})
            } else {
                searchResult = await ytsr(commandBody.slice(5), {limit: 1})
                stream = ytdl(searchResult.items[0].url, {filter: 'audioonly'})
            }


            if (!serverQueue) {
                const queueConstructor = {
                    txtChannel: message.channel,
                    vChannel: vc,
                    connection: null,
                    songs: [],
                    volume: 10,
                    playing: true,
                    songsTitles: []
                };
                queue.set(message.guild.id, queueConstructor);

                queueConstructor.songs.push(stream);
                queueConstructor.songsTitles.push(searchResult.items[0].title);

                try {
                    let connection = await vc.join();
                    queueConstructor.connection = connection;
                    play(message.guild, queueConstructor.songs[0]);
                } catch (err) {
                    console.error(err);
                    queue.delete(message.guild.id);
                    return message.channel.send(`Petite erreur pour rejoindre le vocal apparement ${err}`)
                }
            } else {
                serverQueue.songs.push(stream);
                serverQueue.songsTitles.push(searchResult.items[0].title);
                return message.channel.send(`Ton jolie petit son ${searchResult.items[0].title} est ajouté à la liste`);
            }
        }
    }

    function play(guild, song) {
        const serverQueue = queue.get(guild.id);
        if (!song) {
            serverQueue.vChannel.leave();
            queue.delete(guild.id);
            return;
        }
        const dispatcher = serverQueue.connection
            .play(song)
            .on('finish', () => {
                serverQueue.songs.shift();
                serverQueue.songsTitles.shift();
                play(guild, serverQueue.songs[0]);
            })
        serverQueue.txtChannel.send(`"${serverQueue.songsTitles[0]}" est en cours`)
    }

    function stop(message, serverQueue) {
        if (!message.member.voice.channel)
            return message.channel.send("Il faut être dans le vocal pour stopper le bot. Qui peut le stopper ?")
        serverQueue.songs = [];
        serverQueue.connection.dispatcher.end();
    }

    function skip(message, serverQueue) {
        if (!message.member.voice.channel)
            return message.channel.send("Il faut être dans le vocal pour pouvoir passer à la suivante");
        if (!serverQueue)
            return message.channel.send("C'est la dernière de la liste");
        serverQueue.connection.dispatcher.end();
    }

    if (my_list_sound.find(el => command === el)) {
        console.log('Son trouvé !')
        await repliesFunctions.playingRegisterSound(command, message, function (value) {
            isPlaying = value
        })
    } else {
        console.log('Le son ' + command + " n'existe pas")
    }


    if (command === "trello") {
        message.reply("Pour proposer vos idées c'est ici : https://trello.com/b/ACwYoRr7/les-id%C3%A9es-pour-le-bot")
        message.reply("Vous êtes invitez a nous rejoindre si ce n'est pas déjà fait : https://trello.com/invite/b/ACwYoRr7/105d7133012e86641368cd80bb131958/les-id%C3%A9es-pour-le-bot")

    }

    if (command === 'lesel') {
        message.channel.send({files: ['./images/basticroustiV2.gif']});
    }

    if (command === 'deadgame') {
        message.channel.send({files: ['./images/croustiOWV2.gif']});
    }

    if (command === 'helpo') {

        let my_list = my_list_other.concat(my_list_sound)
        const list = my_list.map((item, i) => `${i + 1}. ${item}`).join("\r\n")
        message.channel.send(list)
    }


})

// Create an event listener for new guild members
bot.on('guildMemberAdd', member => {
    // Send the message to a designated channel on a server:
    const channel = member.guild.channels.cache.find(ch => ch.id === '223555100096987136');
    // Do nothing if the channel wasn't found on this server
    console.log(member)
    if (!channel) return;
    // Send the message, mentioning the member
    channel.send(`Salut ${member} et bienvenue sur le serveur !`);
});
