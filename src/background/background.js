import { createParser } from 'eventsource-parser'

chrome.runtime.onConnect.addListener((port) => {
    port.onMessage.addListener(async function (msg) {
        console.log(`received query: ${msg.query}`)

        // TODO: cache token
        const resp = await fetch('https://chat.openai.com/api/auth/session');
        const accessToken = (await resp.json()).accessToken;

        let body = {
            action: 'next',
            messages: [
                {
                    id: crypto.randomUUID(),
                    role: 'user',
                    content: {
                        content_type: 'text',
                        parts: [msg.query],
                    },
                },
            ],
            parent_message_id: crypto.randomUUID(),
            model: 'text-davinci-002-render',
        }

        const parser = createParser((event) => {
            if (event.type === 'event') {
                if (event.data != "[DONE]") {
                    const resp = JSON.parse(event.data);
                    port.postMessage({ response: resp.message?.content?.parts?.[0] });
                }
            }
          })
        
        fetch("https://chat.openai.com/backend-api/conversation", {
            method: 'POST',
            headers: {
                "authorization": `Bearer ${accessToken}`,
                "content-type": "application/json",
                "user-agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36",
            },
            body: JSON.stringify(body)
        })
            .then((response) => response.body)
            .then((body) => {
                const reader = body.getReader();
                reader.read()
                    .then(function processText({ done, value }) {
                        if (!done) {
                            const chunk = new TextDecoder().decode(value);
                            parser.feed(chunk)
                        }
                        reader.read().then(processText);
                    })
            })
            .catch(error => console.log('error', error));

        port.postMessage({ response: `response: ${msg.query}` });
    });
});