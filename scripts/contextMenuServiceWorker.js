// Function to get + decode API key
const getKey = () => {
  return new Promise((resolve, reject) => {
    chrome.storage.local.get(["openai_key"], (result) => {
      if (result["openai_key"]) {
        const decodedKey = atob(result["openai_key"]);

        // Question - why do we have to resolve here?
        resolve(decodedKey);
      }
    });
  });
};

// Setup our generate function
const generate = async (prompt) => {
  // Get your API key from storage
  const key = await getKey();
  const url = "https://api.openai.com/v1/completions";

  // Call completions endpoint
  const completionResponse = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${key}`,
    },
    body: JSON.stringify({
      model: "text-davinci-003",
      prompt: prompt,
      max_tokens: 1250,
      temperature: 0.7,
    }),
  });

  // Select the top choice and send back
  const completion = await completionResponse.json();
  return completion.choices.pop();
};

const generateCompletionAction = async (info) => {
  try {
    const { selectionText } = info;
    const basePromptPrefix = `
        Summarize the contents into a couple of bullet points.
    
        Text:
        `;

    // Calls GPT-3
    const baseCompletion = await generate(
      `${basePromptPrefix}${selectionText}`
    );
    console.log(baseCompletion.text);

    // // Add your second prompt here
    // const secondPrompt = `
    // Take the table of contents and title of the blog post below and generate a blog post written in thwe style of Paul Graham. Make it feel like a story. Don't just list the points. Go deep into each one. Explain why.
    
    // Title: ${selectionText}
    
    // Table of Contents: ${baseCompletion.text}
    
    // Blog Post:
    // `;

    // // Call your second prompt
    // const secondPromptCompletion = await generate(secondPrompt);
    // console.log(secondPromptCompletion.text);

  } catch (error) {
    console.log(error);
  }
};

chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "context-run",
    title: "TLDR this",
    contexts: ["selection"],
  });
});

// Add listener
chrome.contextMenus.onClicked.addListener(generateCompletionAction);
