const { EmbedBuilder  } = require("discord.js");
const { url } = require('./config.json');

const ROLE_HOLDER_ID = "1015438258240503828";
const CH_VERIFY_ID = "1015459664147779633";
const EMOJI = "✅";

async function ready(client){
    const ch = await client.channels.fetch(CH_VERIFY_ID);

    const embed = new EmbedBuilder ()
        .setTitle('여기를 눌러 지갑을 연동하기')
        .setDescription(`위 문구를 눌러 지갑을 연동하세요.`)
        .setURL(url);
    
        ch.send({ embeds: [embed] }).then((msg) => {
            console.log("verify send ok");
            //msg.react(EMOJI);
        })
}

/* *이모지 반응하기 */
//async function reaction(reaction, user){
//    if(reaction.emoji.name == EMOJI){
//        console.log("messageReacitonAdd ok", EMOJI);
//
//        const guild = reaction.message.guild;
//        const role = guild.roles.cache.get(ROLE_HOLDER_ID);
//        const member = guild.members.cache.get(user.id);
//        await member.roles.add(role);
//    }else{
//        console.log("messageReacitonAdd unkown emoji");
//    }
//}

module.exports = {
    channel_id: CH_VERIFY_ID,
    ready,
    //reaction,
};