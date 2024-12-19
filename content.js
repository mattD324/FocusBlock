//allow users to customize their Blocklist 
const blockForm = document.getElementById("blockForm");
const websiteInput = document.getElementById("websiteInput");
const blockListUI = document.getElementById("blockList");

function loadBlockList(){
    chrome.storage.sync.get("blockedSites", (data) => {
        const blockedSites = data.blockedSites || [];
        blockList.innerHTML = "";
        updateBlockListUI(blockedSites); 
    }); 
}

function blockURLrequest(blockedSites){
    chrome.runtime.sendMessage({action: "updateBlockedList",urls: blockedSites},
(response) => {
    console.log("Response: ",response); 
    if (chrome.runtime.lastError){
        console.error("runtime.lastError:", chrome.runtime.lastError); 
    }
    // if(response.success){
    //     alert('BlockedList updated!')
    // }
}); 
}
function updateBlockListUI(blockedSites){
    blockListUI.innerHTML = ''; 
    blockedSites.forEach((site,index) => {
        const li = document.createElement('li'); 
        li.textContent = site; 

        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Remove';
        deleteButton.onclick = () => removeSite(index, blockedSites);
        li.appendChild(deleteButton); 
        blockListUI.appendChild(li)
    });
}

function removeSite(index,blockedSites){
    blockedSites.splice(index, 1);
    saveBlockList(blockedSites); 
    updateBlockListUI(blockedSites); 
}

function saveBlockList(blockedSites){
    chrome.storage.sync.set({"blockedSites" : blockedSites }, ()=> {
        console.log("Blocked sites saved", blockedSites);
    }); 
    blockURLrequest(blockedSites); 
}
//event parameter is the form that was submited my the user(comes from our HTML file )
blockForm.addEventListener('submit',(event) => {
    event.preventDefault(); //prevents the form from reloading the page 
    const website = websiteInput.value.trim(); //getting user input when submit button is clicked 
    if(!website) return; 
    chrome.storage.sync.get("blockedSites", (data) =>{
        const blockedSites = data.blockedSites || []
        if (blockedSites.length === 0){
            blockedSites.push(website);
            saveBlockList(blockedSites);
            updateBlockListUI(blockedSites);
        }
        blockedSites.forEach((site) => {
            //check if user input is not already in blockedSites list 
            if(!blockedSites.includes(website)){
                blockedSites.push(website); 
                saveBlockList(blockedSites);
                updateBlockListUI(blockedSites); 
            }
        }); 
        //this will clear the input field
        websiteInput.value = ''; 
    });
})
document.addEventListener('DOMContentLoaded', loadBlockList);
