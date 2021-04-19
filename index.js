const Discord = require("discord.js");
const bot = new Discord.Client();
const firebase = require("firebase");
const express = require('express')
const app = express()
let port = process.env.PORT || 3000
const cors = require('cors')
const fileUpload = require('express-fileupload')
const path = require('path');
const functions = require('./functions')
const fs = require('fs')
app.use(cors())
app.use(fileUpload({}));


// Dev
// const config = require("./config.json");
// bot.login(config.BOT_TOKEN);
// const prefix = ":"
// const firebaseConfig = require('./configFirebase.json');



// Prod
bot.login(process.env.TOKEN)
const prefix = "!"


let firebaseConfig = {
    apiKey: process.env.APIKEY,
    authDomain: process.env.AUTHDOMAINE,
    projectId: process.env.PROJECTID,
    storageBucket: process.env.STORAGEBUCKET,
    messagingSenderId: process.env.MESSAGINGSENDERID,
    appId: process.env.APPID,
    measurementId: process.env.MEASUREMENTID
};
firebase.initializeApp(firebaseConfig.config);
let database = firebase.database()
let databaseRequest = []

// Ecoute si de nouvelles request sont ajoutées
let onlineData = firebase.database().ref('request/');
onlineData.on('value', (snapshot) => {
    console.log("valeur mise à jour")
    const data = snapshot.val();
    databaseRequest = []
    for (const property in data) {
        databaseRequest.push({"command": property, "path": data[property].path})
    }
});

app.listen(port, () => {
    console.log("Ca tourne")
})

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname + '/html/index.html'));
})

// Reception et enregistrement firebase
app.post('/fileUpload', (req, res) => {
    if (req.files.file === null) {
        res.sendFile(path.join(__dirname + '/html/index.html'))
    }
    if (functions.convert(parseInt(req.files.file.size)) < 1.01) {

        return new Promise(function (resolve, reject) {
            let filePath = './public/uploads/' + req.body.message + Date.now()
            let extension = req.files.file.name.substr(req.files.file.name.indexOf('.'));

            fs.writeFile(filePath + extension, req.files.file.data, function (err) {
                if (err) {
                    console.log(err)
                    res.sendFile(path.join(__dirname + '/html/error.html'))
                } else {
                    firebase.database().ref('request/' + req.body.message).set({
                        path: filePath + extension
                    })
                        .then(() => {
                            res.sendFile(path.join(__dirname + '/html/success.html'))
                        })
                        .catch((err) => {
                            console.log(err)
                            res.sendFile(path.join(__dirname + '/html/error.html'))
                        });
                }
            });
        })

    } else {
        res.sendFile(path.join(__dirname + '/html/error.html'))
    }
})


let isPlaying = false;
let stayWithUs = false;


bot.on('ready', function () {
    bot.user.setActivity('filtrer le sel')
    bot.user.setUsername('Naig Robot')
})

bot.on("message", async function (message) {
    if (message.author.bot) return;
    if (!message.content.startsWith(prefix)) return;

    const commandBody = message.content.slice(prefix.length);
    const args = commandBody.split(' ');
    const command = args.shift().toLowerCase();

    if (command === "databaseLength"){
        console.log(databaseRequest.length)
    }

    if (databaseRequest.length > 0) {
        for (let i = 0; i < databaseRequest.length; i++) {
            if (command === databaseRequest[i].command) {
                if (message.member.voice.channel && !isPlaying) {
                    await message.member.voice.channel.join().then(connection => {
                        isPlaying = true;
                        const dispatcher = connection.play(databaseRequest[i].path, {volume: 0.5});

                        dispatcher.on('start', () => {
                            console.log(databaseRequest[i].command + ' is now playing!');
                        });

                        dispatcher.on('finish', () => {
                            isPlaying = false;
                            setTimeout(() => {
                                stayWithUs ? null : stayWithUs ? null : connection.disconnect();
                            }, 1000)
                            console.log(databaseRequest[i].command + ' has finished playing!');
                        });

                        dispatcher.on('error', console.error);
                    })


                }
            }
        }
    }

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
        message.reply("PONG")
    }

    if (command === "love") {
        if (message.member.voice.channel && !isPlaying) {
            await message.member.voice.channel.join().then(connection => {
                isPlaying = true;
                const dispatcher = connection.play('./audios/Love.mp3', {volume: 0.5});

                dispatcher.on('start', () => {
                    console.log('Love.mp3 is now playing!');
                });

                dispatcher.on('finish', () => {
                    isPlaying = false;
                    setTimeout(() => {
                        stayWithUs ? null : stayWithUs ? null : connection.disconnect();
                    }, 1000)
                    console.log('Love.mp3 has finished playing!');
                });

                // Always remember to handle errors appropriately!
                dispatcher.on('error', console.error);
            })


        }
    }

    if (command === "ortolan") {
        if (message.member.voice.channel && !isPlaying) {
            await message.member.voice.channel.join().then(connection => {
                isPlaying = true;
                const dispatcher = connection.play('./audios/ortolan.mp3', {volume: 0.5});

                dispatcher.on('start', () => {
                    console.log('ortolan.mp3 is now playing!');
                });

                dispatcher.on('finish', () => {
                    isPlaying = false;
                    setTimeout(() => {
                        stayWithUs ? null : stayWithUs ? null : connection.disconnect();
                    }, 1000)
                    console.log('ortolan.mp3 has finished playing!');
                });

                // Always remember to handle errors appropriately!
                dispatcher.on('error', console.error);
            })


        }
    }

    if (command === "chomage") {
        if (message.member.voice.channel && !isPlaying) {
            await message.member.voice.channel.join().then(connection => {
                isPlaying = true;
                const dispatcher = connection.play('./audios/chomage.mp3', {volume: 0.5});

                dispatcher.on('start', () => {
                    console.log('chomage.mp3 is now playing!');
                });

                dispatcher.on('finish', () => {
                    isPlaying = false;
                    setTimeout(() => {
                        stayWithUs ? null : stayWithUs ? null : connection.disconnect();
                    }, 1000)
                    console.log('chomage.mp3 has finished playing!');
                });

                // Always remember to handle errors appropriately!
                dispatcher.on('error', console.error);
            })


        }
    }

    if (command === "soupe") {
        if (message.member.voice.channel && !isPlaying) {
            await message.member.voice.channel.join().then(connection => {
                isPlaying = true;
                const dispatcher = connection.play('./audios/soupe.mp3', {volume: 0.5});

                dispatcher.on('start', () => {
                    console.log('soupe.mp3 is now playing!');
                });

                dispatcher.on('finish', () => {
                    isPlaying = false;
                    setTimeout(() => {
                        stayWithUs ? null : stayWithUs ? null : connection.disconnect();
                    }, 1000)
                    console.log('soupe.mp3 has finished playing!');
                });

                // Always remember to handle errors appropriately!
                dispatcher.on('error', console.error);
            })

        }
    }

    if (command === "nani") {
        if (message.member.voice.channel && !isPlaying) {
            await message.member.voice.channel.join().then(connection => {
                isPlaying = true;
                const dispatcher = connection.play('./audios/nani.mp3', {volume: 0.5});

                dispatcher.on('start', () => {
                    console.log('nani.mp3 is now playing!');
                });

                dispatcher.on('finish', () => {
                    isPlaying = false;
                    setTimeout(() => {
                        stayWithUs ? null : stayWithUs ? null : connection.disconnect();
                    }, 1000)
                    console.log('nani.mp3 has finished playing!');
                });

                // Always remember to handle errors appropriately!
                dispatcher.on('error', console.error);
            })

        }
    }

    if (command === "tutut") {
        if (message.member.voice.channel && !isPlaying) {
            await message.member.voice.channel.join().then(connection => {
                isPlaying = true;
                const dispatcher = connection.play('./audios/tut-tut-fils-de-pute.mp3', {volume: 0.5});

                dispatcher.on('start', () => {
                    console.log('tutut.mp3 is now playing!');
                });

                dispatcher.on('finish', () => {
                    isPlaying = false;
                    setTimeout(() => {
                        stayWithUs ? null : stayWithUs ? null : connection.disconnect();
                    }, 1000)
                    console.log('tutut.mp3 has finished playing!');
                });

                // Always remember to handle errors appropriately!
                dispatcher.on('error', console.error);
            })

        }
    }

    if (command === "prout") {
        if (message.member.voice.channel && !isPlaying) {
            await message.member.voice.channel.join().then(connection => {
                isPlaying = true;
                const dispatcher = connection.play('./audios/perfect-fart.mp3', {volume: 0.5});

                dispatcher.on('start', () => {
                    console.log('prout.mp3 is now playing!');
                });

                dispatcher.on('finish', () => {
                    isPlaying = false;
                    setTimeout(() => {
                        stayWithUs ? null : stayWithUs ? null : connection.disconnect();
                    }, 1000)
                    console.log('prout.mp3 has finished playing!');
                });

                // Always remember to handle errors appropriately!
                dispatcher.on('error', console.error);
            })

        }
    }

    if (command === "oma") {
        if (message.member.voice.channel && !isPlaying) {
            await message.member.voice.channel.join().then(connection => {
                isPlaying = true;
                const dispatcher = connection.play('./audios/oma.mp3', {volume: 0.3});

                dispatcher.on('start', () => {
                    console.log('oma.mp3 is now playing!');
                });

                dispatcher.on('finish', () => {
                    isPlaying = false;
                    setTimeout(() => {
                        stayWithUs ? null : stayWithUs ? null : connection.disconnect();
                    }, 1000)
                    console.log('oma.mp3 has finished playing!');
                });

                // Always remember to handle errors appropriately!
                dispatcher.on('error', console.error);
            })

        }
    }

    if (command === "cbo") {
        if (message.member.voice.channel && !isPlaying) {
            await message.member.voice.channel.join().then(connection => {
                isPlaying = true;
                const dispatcher = connection.play('./audios/julien.mp3', {volume: 0.5});

                dispatcher.on('start', () => {
                    console.log('cbo.mp3 is now playing!');
                });

                dispatcher.on('finish', () => {
                    isPlaying = false;
                    setTimeout(() => {
                        stayWithUs ? null : connection.disconnect();
                    }, 1000)
                    console.log('cbo.mp3 has finished playing!');
                });

                // Always remember to handle errors appropriately!
                dispatcher.on('error', console.error);
            })

        }
    }

    if (command === "croustilove") {
        if (message.member.voice.channel && !isPlaying) {
            await message.member.voice.channel.join().then(connection => {
                isPlaying = true;
                const dispatcher = connection.play('./audios/croustiLove.mp3', {volume: 0.5});

                dispatcher.on('start', () => {
                    console.log('croustiLove.mp3 is now playing!');
                });

                dispatcher.on('finish', () => {
                    isPlaying = false;
                    setTimeout(() => {
                        stayWithUs ? null : connection.disconnect();
                    }, 1000)
                    console.log('croustiLove.mp3 has finished playing!');
                });

                // Always remember to handle errors appropriately!
                dispatcher.on('error', console.error);
            })

        }
    }

    if (command === "crousti") {
        if (message.member.voice.channel && !isPlaying) {

            await message.member.voice.channel.join().then(connection => {
                isPlaying = true;
                const dispatcher = connection.play('./audios/halfSalt.mp3', {volume: 0.5});

                dispatcher.on('start', () => {
                    console.log('crousti.mp3 is now playing!');
                });

                dispatcher.on('finish', () => {
                    isPlaying = false;
                    setTimeout(() => {
                        stayWithUs ? null : connection.disconnect();
                    }, 1000)
                    console.log('crousti.mp3 has finished playing!');
                });

                // Always remember to handle errors appropriately!
                dispatcher.on('error', console.error);
            })
        }

    }

    if (command === "souffrir") {
        if (message.member.voice.channel && !isPlaying) {
            await message.member.voice.channel.join().then(connection => {
                isPlaying = true;
                const dispatcher = connection.play('./audios/souffrir.mp3', {volume: 0.5});

                dispatcher.on('start', () => {
                    console.log('souffrir.mp3 is now playing!');
                });

                dispatcher.on('finish', () => {
                    isPlaying = false;
                    setTimeout(() => {
                        stayWithUs ? null : connection.disconnect();
                    }, 1000)
                    console.log('souffrir.mp3 has finished playing!');
                });

                // Always remember to handle errors appropriately!
                dispatcher.on('error', console.error);
            })

        }
    }

    if (command === "honteux") {
        if (message.member.voice.channel && !isPlaying) {
            await message.member.voice.channel.join().then(connection => {
                isPlaying = true;
                const dispatcher = connection.play('./audios/honteux.mp3', {volume: 0.5});

                dispatcher.on('start', () => {
                    console.log('honteux.mp3 is now playing!');
                });

                dispatcher.on('finish', () => {
                    isPlaying = false;
                    setTimeout(() => {
                        stayWithUs ? null : connection.disconnect();
                    }, 1000)
                    console.log('honteux.mp3 has finished playing!');
                });

                // Always remember to handle errors appropriately!
                dispatcher.on('error', console.error);
            })

        }
    }

    if (command === "oskur") {
        if (message.member.voice.channel && !isPlaying) {
            await message.member.voice.channel.join().then(connection => {
                isPlaying = true;
                const dispatcher = connection.play('./audios/jeanne_au_secours.mp3', {volume: 0.5});

                dispatcher.on('start', () => {
                    console.log('oskur.mp3 is now playing!');
                });

                dispatcher.on('finish', () => {
                    isPlaying = false;
                    setTimeout(() => {
                        stayWithUs ? null : connection.disconnect();
                    }, 1000)
                    console.log('oskur.mp3 has finished playing!');
                });

                // Always remember to handle errors appropriately!
                dispatcher.on('error', console.error);
            })

        }
    }

    if (command === "victime") {
        if (message.member.voice.channel && !isPlaying) {
            await message.member.voice.channel.join().then(connection => {
                isPlaying = true;
                const dispatcher = connection.play('./audios/victime-boloss.mp3', {volume: 0.5});

                dispatcher.on('start', () => {
                    console.log('victime.mp3 is now playing!');
                });

                dispatcher.on('finish', () => {
                    isPlaying = false;
                    setTimeout(() => {
                        stayWithUs ? null : connection.disconnect();
                    }, 1000)
                    console.log('victime.mp3 has finished playing!');
                });

                // Always remember to handle errors appropriately!
                dispatcher.on('error', console.error);
            })

        }
    }

    if (command === "dge") {
        if (message.member.voice.channel && !isPlaying) {
            await message.member.voice.channel.join().then(connection => {
                const dispatcher = connection.play('./audios/davidge.mp3', {volume: 0.7});
                isPlaying = true;

                dispatcher.on('start', () => {
                    console.log('dge.mp3 is now playing!');
                });

                dispatcher.on('finish', () => {
                    isPlaying = false;
                    setTimeout(() => {
                        stayWithUs ? null : connection.disconnect();
                    }, 1000)
                    console.log('dge.mp3 has finished playing!');
                });

                // Always remember to handle errors appropriately!
                dispatcher.on('error', console.error);
            })

        }
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

        var my_list = [" !ping -> test", " !jail + @mention -> send user to jail", " !stay -> Naig Robot restera avec nous sur le voice", " !lesel", " !deadgame",
            " !love", " !trello", " !soupe", " !ortolan", " !nani", " !tutut", " !prout", " !oma",
            " !cbo", " !crousti", " !croustilove", " !victime", " !honteux", " !oskur", " !dge", " !chomage", " !souffrir"]
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

module.exports = {
    "firebase" : firebase
}
