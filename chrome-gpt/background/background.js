chrome.runtime.onConnect.addListener((port) => {
    port.onMessage.addListener(function (query) {
        console.log(`received query: ${query}`)

        var raw = `{\n    \"action\": \"next\",\n    \"messages\": [\n        {\n            \"id\": \"014870d5-b37f-4ae6-94c6-397fd9e79f5d\",\n            \"role\": \"user\",\n            \"content\": {\n                \"content_type\": \"text\",\n                \"parts\": [\n                    \"${query}\"\n                ]\n            }\n        }\n    ],\n    \"conversation_id\": \"0be8529f-2975-4ade-8e8d-a5e1a99e8e23\",\n    \"parent_message_id\": \"709ed8f8-7af0-4fb7-bd3b-16ae97ff12a4\",\n    \"model\": \"text-davinci-002-render\"\n}`;

        fetch("https://chat.openai.com/backend-api/conversation", {
            method: 'POST',
            headers: {
                "authorization": "Bearer ", // insert token
                "content-type": "application/json",
                "user-agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36",
            },
            body: raw,
            redirect: 'follow'
        })
            .then(response => response.text())
            .then(result => console.log(result))
            .catch(error => console.log('error', error));


        port.postMessage({ response: `response: ${query}` });
    });
});