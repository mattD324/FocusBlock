chrome.runtime.onMessage.addListener((message, sender,sendResponse)=>{
    console.log("in background")
    if (message.action === "updateBlockedList"){
        //this will be an array of the user's blocked URLs 
        const userUrls = message.urls; 
        
        const rules = userUrls.map((url,index)=> ({
            id: index + 1,
            priority: 1,
            action: {type: "block"}, 
            condition: {urlFilter: url}
        })); 
        chrome.declarativeNetRequest.updateDynamicRules({
            removeRuleIds: rules.map((rule) => rule.id), // removes old rules 
            addRules: rules 
        },
        ()=> {
            console.log("updated blocked list"); 
            sendResponse({sucess: true}); 
        }); 
        return true; 
    }
}); 