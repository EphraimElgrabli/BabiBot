import fetch from 'node-fetch';

/**
 * apikey from https://discord.pawan.krd/
 * @param {String} auth 
 */
export default function UnofficalGPT(auth) {
    this.auth = auth;

    this.completions = "https://api.pawan.krd/v1/chat/completions"
    this.images = "https://api.pawan.krd/v1/images/generations"
    this.text = "https://api.pawan.krd/v1/completions"
}

/**
 * ask question to the bot
 * @param {String} prompt 
 * @returns {Promise<{
 *              object:"text_completion",
 *              model:"text-davinci-003",
 *              choices:[{
 *                  "text":" Hi there! How can I help you?",
 *                  "index":0,
 *                  "finish_reason":"stop",
 *                  "logprobs":null}],
 *              usage:{
 *                  "prompt_tokens":7,
 *                  "completion_tokens":9,
 *                  "total_tokens":16
 *              }
 *          } | {
 *  status: false,
 *  error: 'You have run out of credits',
 *  hint: 'You can wait for your daily reset',
 *  info: 'https://gist.github.com/PawanOsman/72dddd0a12e5829da664a43fc9b9cf9a',
 *  support: 'https://discord.pawan.krd'
 *  }
 *  >}
 */
UnofficalGPT.prototype.ask = async function (prompt) {
    return new Promise((resolve, reject) => {
        fetch(this.text, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                "Authorization": this.auth
            },
            body: JSON.stringify({
                "prompt": prompt,
                "temperature": 0.7,
                "max_tokens": 256,
                "model": "text-davinci-003"
            })
        }).then(res => res.json())
            .then(json => resolve(json))
            .catch(err => reject(err))
    })
}

/**
 * ask question to the bot
 * @param {String} prompt 
 * @returns {Promise<{
 *              object:"text_completion",
 *              model:"text-davinci-003",
 *              choices:[{
 *                  "text":" Hi there! How can I help you?",
 *                  "index":0,
 *                  "finish_reason":"stop",
 *                  "logprobs":null}],
 *              usage:{
 *                  "prompt_tokens":7,
 *                  "completion_tokens":9,
 *                  "total_tokens":16
 *              }
 *          } | {
 *  status: false,
 *  error: 'You have run out of credits',
 *  hint: 'You can wait for your daily reset',
 *  info: 'https://gist.github.com/PawanOsman/72dddd0a12e5829da664a43fc9b9cf9a',
 *  support: 'https://discord.pawan.krd'
 *  }
 *  >}
 */
UnofficalGPT.prototype.ask2 = async function (prompt) {
    let data = {
        "max_tokens": 256,
        //"model": "alpaca-13b",
        "model":"vicuna-13b",
        //"model":"gpt-3.5-turbo",
        "messages": [
            {
                role: "system",
                content: "You are a male chatbot named 'Babi Bot'. Your code has written by Shilo Babila using JavaScript."
                    + process.env.MAILLIST ? `only if ask for a mail, you have the mail list at https://docs.google.com/spreadsheets/d/${process.env.MAILLIST || ""}}` : ""
            },
            {
                "role": "user",
                "content": prompt
            }
        ]
    }
    return await this.chat(data);
}



/**
 * make post request to the server
 * @param {{"messages": [
 *              {"role": "system" | "user" | "assistant",
 *               "content": "You are an helful assistant"}
 *         ]}} data 
 * @returns {Promise<{status: false, error: 'Your API key is not allowed to be used from t…ess please use /resetip on our discord server', hint: 'You can get support from https://discord.pawan.krd', info: 'https://gist.github.com/PawanOsman/72dddd0a12e5829da664a43fc9b9cf9a', support: 'https://discord.pawan.krd'}|
 * {"id": "chatcmpl-123","object": "chat.completion","created": 1677652288,"choices": [{
 *  "index": 0,"message": {
 *    "role": "assistant",
 *    "content": "\n\nHello there, how may I assist you today?",
 *  },"finish_reason": "stop"}],
 *"usage": {
 *  "prompt_tokens": 9,"completion_tokens": 12,"total_tokens": 21}
 *} | {
 *  status: false,
 *  error: 'You have run out of credits',
 *  hint: 'You can wait for your daily reset',
 *  info: 'https://gist.github.com/PawanOsman/72dddd0a12e5829da664a43fc9b9cf9a',
 *  support: 'https://discord.pawan.krd'
 *}
 *  >}
 */
UnofficalGPT.prototype.chat = async function (data) {
    return new Promise((resolve, reject) => {
        fetch(this.completions, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                "Authorization": this.auth
            },
            body: JSON.stringify(data)
        }).then(res => res.json())
            .then(json => resolve(json))
            .catch(err => reject(err))
    })
}

/**
 * message from private chat
 * @param {import('@adiwajshing/baileys').proto.WebMessageInfo[]} msgs
 */
UnofficalGPT.prototype.waMsgs = async function (msgs) {
    let data = {
        "max_tokens": 256,
        "model": "gpt-3.5-turbo",
        "messages": [
            {
                role: "system",
                content: "You are a male chatbot named 'Babi Bot'. Your code has written by Shilo Babila using JavaScript."
                    + process.env.MAILLIST ? `only if ask for a mail, you have the mail list at https://docs.google.com/spreadsheets/d/${process.env.MAILLIST || ""}}` : ""
            }
        ]
    }
    for (let i = 0; i < msgs.length; i++) {
        const msg = msgs[i];
        data.messages.push({
            "role": msg.key.fromMe ? "assistant" : "user",
            "content": msg.message?.conversation || msg.message?.extendedTextMessage?.text || msg.message?.imageMessage?.caption || msg.message?.videoMessage?.caption || ""
        })
    }
    return await this.chat(data);
}

/**
 * TL:DR the conversation is a list of messages
 * @param {import('@adiwajshing/baileys').proto.WebMessageInfo[]} msgs
 * @returns {Promise<{
 *              "object":"text_completion",
*              "model":"text-davinci-003",
*              "choices":[{
*                  "text":" Hi there! How can I help you?",
*                  "index":0,
*                  "finish_reason":"stop",
*                  "logprobs":null}],
*              "usage":{
*                  "prompt_tokens":7,
*                  "completion_tokens":9,
*                  "total_tokens":16
*              }
*          }| {
*      status: false,
*      error: 'You have run out of credits',
*      hint: 'You can wait for your daily reset',
*      info: 'https://gist.github.com/PawanOsman/72dddd0a12e5829da664a43fc9b9cf9a',
*      support: 'https://discord.pawan.krd'
*    }>}
 */
UnofficalGPT.prototype.tldr = async function (msgs) {
    //let stopsChat = [];
    let prompt = "";
    for (const msg of msgs) {
        let text = msg.message?.conversation || msg.message?.extendedTextMessage?.text
            || msg.message?.imageMessage?.caption || msg.message?.videoMessage?.caption || "";
        let pushName = msg.key.fromMe ? "You" : msg.pushName
            || msg.key.remoteJid.slice(0, msg.key.remoteJid.indexOf("@")) || "Unknown";

        if (!text)
            continue;

        prompt += `${pushName}: ${text}\n`;
        //stopsChat.push(pushName);
    }
    prompt += "Summarize the conversation as briefly as possible but with as much detail as possible\n";

    // remove duplicate
    //stopsChat = [...new Set(stopsChat)];

    let data = {
        "model": "gpt-3.5-turbo",
        //"model": "text-davinci-003",
        "prompt": prompt,
        "temperature": 0.7,
        "max_tokens": 512
    }

    console.log(prompt);

    return new Promise((resolve, reject) => {
        fetch(this.text, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                "Authorization": this.auth
            },
            body: JSON.stringify(data)
        }).then(res => res.json())
            .then(json => resolve(json))
            .catch(err => reject(err))
    })
}

/**
 * generate image from prompt
 * @param {string} prompt
 * @returns {Promise<{
 *                  "created": Number,
 *                  "data": [{
 *                      "url": "https://..."
 *                  }]
 *           }| {
*  status: false,
*  error: 'You have run out of credits',
*  hint: 'You can wait for your daily reset',
*  info: 'https://gist.github.com/PawanOsman/72dddd0a12e5829da664a43fc9b9cf9a',
*  support: 'https://discord.pawan.krd'
*}>}
 */
UnofficalGPT.prototype.image = async function (prompt) {
    return new Promise((resolve, reject) => {
        fetch(this.images, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                "Authorization": this.auth
            },
            body: JSON.stringify({
                prompt,
                n: 4,
                size: "256x256"
            })
        }).then(res => res.json())
            .then(json => resolve(json))
            .catch(err => reject(err))
    })
}


async function test() {
    const gpt = new UnofficalGPT(process.env.UNOFFICALGPT_API_KEY);
    let res = await gpt.ask2("hi there how are you?");
    console.log(res);
}
//test();
//const gpt = new UnofficalGPT();
// async function example() {
//     let data = {
//         "messages": [
//             {
//                 "role": "system",
//                 "content": "You are an helful assistant"
//             },
//             {
//                 "role": "user",
//                 "content": "my name is Joe"
//             },
//             {
//                 "role": "user",
//                 "content": "what is my name?"
//             }
//         ]
//     }
//     try {
//         let res = await gpt.chat(data);
//         console.log(JSON.stringify(res, null, 2))

//     } catch (error) {
//         console.log(error)
//     }
// }
// example()