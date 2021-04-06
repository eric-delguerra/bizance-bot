const Discord = require("discord.js");
const config = require("./config.json");
const {MessageEmbed} = require("discord.js");
const bot = new Discord.Client();

if (config){
    bot.login(config.BOT_TOKEN);
} else {
    bot.login(process.env.TOKEN)
}

const prefix = "!"

//
// 'use strict';
// const client = new Discord.Client();
// const list = client.guilds.cache.get("myServerID");
// list.members.cache.forEach(member => console.log(member.user.username));


let isPlaying = false;
let stayWithUs = false;

bot.on("message", async function (message) {
    if (message.author.bot) return;
    if (!message.content.startsWith(prefix)) return;

    const commandBody = message.content.slice(prefix.length);
    const args = commandBody.split(' ');
    const command = args.shift().toLowerCase();

    if (command === "stay") {
        if (stayWithUs) {
            stayWithUs = false
        } else {
            message.reply("Ok je reste avec vous maintenant")
            stayWithUs = true
        }
    }

    if (command === "love"){
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

    if (command === "ortolan"){
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

    if (command === "chomage"){
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

    if (command === "soupe"){
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

    if (command === "nani"){
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

    if (command === "tutut"){
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

    if (command === "prout"){
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

    if (command === "oma"){
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

    if (command === "cbo"){
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

    if (command === "crousti"){
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

    if (command === "honteux"){
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

    if (command === "oskur"){
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

    if (command === "victime"){
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

    if (command === "dge"){
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
})

