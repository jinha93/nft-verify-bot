const { token } = require('./config.json');
const { Client, GatewayIntentBits } = require("discord.js");
const Verify = require("./bot-verify.js");

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMessageReactions,
        GatewayIntentBits.MessageContent,
    ],
})

const GUILD_ID = "1015427639214878720";
const ROLE_HOLDER_ID = "1015438258240503828";
const MEMBER_ID = "1015429587141927002";
        
client.once('ready', async c => {
	console.log(`Ready! Logged in as ${c.user.tag}`);

    const guild = client.guilds.cache.get(GUILD_ID);
    //const role = guild.roles.cache.get(ROLE_HOLDER_ID);
    //const member = await guild.members.fetch(MEMBER_ID);

    //member.roles.add(role);
    //member.roles.remove(role);


    const ch_verify = guild.channels.cache.get(Verify.channel_id);
    const old_msg = await ch_verify.messages.fetch();
    ch_verify.bulkDelete(old_msg);

    Verify.ready(client);
});

//client.on("messageReactionAdd", async (reaction, user) => {
//    if(user.bot) return;                                                    //디스코드 봇인지 확인
//    if(reaction.message.partial) await reaction.message.fetch();            //리액션 메시지 통신
//    if(reaction.partial) await reaction.fetch();                            // 리액션 통신
//    if(!reaction.message.guild) return;
//
//    if(reaction.message.channelId == Verify.channel_id){
//        Verify.reaction(reaction, user);
//    } else{
//        console.error('messageReactionAdd no ch');
//    }
//})

client.on("messageCreate", async (msg) => {
    
    if(msg.author.bot) return;
    
    if(msg.content == "a"){
        msg.reply("b");
    }else{
        console.log("msg.content", msg.content);
    }
    
})

client.login(token);
console.log('login');

async function add_nft_role(user_id){
    console.log("add_nft_role", user_id);

    const guild = client.guilds.cache.get(GUILD_ID);
    const role = guild.roles.cache.get(ROLE_HOLDER_ID);
    const member = await guild.members.fetch(user_id);
    member.roles.add(role);
}

module.exports = {
    add_nft_role,
}