chrome.runtime.onConnect.addListener((port) => {
    port.onMessage.addListener(function (msg) {
        console.log(`received query: ${msg.query}`)

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

        fetch("https://chat.openai.com/backend-api/conversation", {
            method: 'POST',
            headers: {
                "authorization": "Bearer ", // insert token
                "content-type": "application/json",
                "user-agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36",
            },
            body: JSON.stringify(body),
            redirect: 'follow'
        })
            .then((response) => response.body)
            .then((body) => {
                const reader = body.getReader();
                reader.read()
                    .then(function processText({ done, value }) {
                        if (!done) {
                            const data = new TextDecoder().decode(value);
                            console.log(data);
                            if (data != "data: [DONE]") {
                                console.log(JSON.parse(data.substring(6)).message.content.parts[0]);
                            }
                        }
                        reader.read().then(processText);
                    })
            })
            .catch(error => console.log('error', error));

        port.postMessage({ response: `response: ${msg.query}` });
    });
});