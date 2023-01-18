// TODO - You can do all sorts of stuff with the UI in extensions -
// use React, make them pop to the side, it’s a wild world. 
// Come back to the UI later when you’re done with the rest, sidebars are fun to play with.

const saveKey = () => {
    // Get item in key_input
    const input = document.getElementById('key_input'); 
    if (input) {
        const {value} = input;
        const encodedValue = btoa(value); // TODO: Make encoding more secure.
        // Save to google storage
        chrome.storage.local.set({'openai_key': encodedValue}).then(() => {
            // Update styles
            document.getElementById('key_needed').style.display = 'none';
            document.getElementById('key_entered').style.display = 'block';      
    })
    }
}

const changeKey = () => {
    document.getElementById('key_needed').style.display = 'block';
    document.getElementById('key_entered').style.display = 'none';
}


// We use a promise here because we need to wait for the callback to be called in the chrome.storage section. 
// QUESTION - WHY ARE WE RETURNING A PROMISE HERE? Confused... 
const checkForKey = () => {
    return new Promise((resolve, reject) => {
      chrome.storage.local.get(['openai_key'], (result) => {
        resolve(result['openai_key']);
      });
    });
  };

document.getElementById('save_key_button').addEventListener('click', saveKey);
document
  .getElementById('change_key_button')
  .addEventListener('click', changeKey);

checkForKey().then((response) => {
    if (response) {
        document.getElementById('key_needed').style.display = 'none';
        document.getElementById('key_entered').style.display = 'block';
    }
});