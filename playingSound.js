const fs = require('fs')
const ytdl = require('ytdl-core')

module.exports = {
    ping: function (message) {
        message.reply('PONG')
    },
    playingRegisterSound: async function (commande, message, isPlaying) {

        if (message.member.voice.channel) {
            await message.member.voice.channel.join().then(connection => {
                isPlaying(true);
                const dispatcher = connection.play('./audios/' + commande + '.mp3', {volume: 0.5});

                dispatcher.on('start', () => {
                    console.log(commande + '.mp3 is now playing!');
                });

                dispatcher.on('finish', () => {
                    isPlaying(false)
                    console.log(commande + '.mp3 has finished playing!');
                });

                // Always remember to handle errors appropriately!
                dispatcher.on('error', console.error);
            })
        }
    },
    playingSoundFromUrl: function (url, message, isPlaying) {
        if (message.member.voice.channel) {
            message.member.voice.channel.join().then(connection => {
                isPlaying(true);
                const stream = ytdl(url, {filter: 'audioonly'})
                const dispatcher = connection.play(stream, {volume: 0.5});

                dispatcher.on('start', () => {
                    console.log('.mp3 is now playing!');
                });

                dispatcher.on('finish', () => {
                    isPlaying(false)
                    console.log('.mp3 has finished playing!');
                });

                // Always remember to handle errors appropriately!
                dispatcher.on('error', console.error);


            })
        }
    }
}
