// ==UserScript==
// @name         SocialTools
// @namespace    https://github.com/FriendlyBaron/SocialTools
// @version      1.0
// @description  SocialTools
// @author       FriendlyBaron
// @match        http://socialclub.rockstargames.com/crew/*/manage/hierarchy
// @grant        none
// @require     http://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js
// ==/UserScript==

//First time doing anything tamper/greasemonkey related. Reading on the web seemed to point to jquery making automated button clicks the easist.
//@match will allow it to run only on the crew management pages.

//todos?
//    unban
//    tempbans? would need some method for storing. greasemonkey cant write to storage. 


//reddit that dude
//You have been kicked from rGTA Cruises for not actively attending events. If you wish to rejoin our community, feel free to do so at any time. Visit www.reddit.com/r/GTAV_Cruises for more info!
//.css( "border", "3px solid red" );


//The base Jquery to form the dialog comes from here: http://stackoverflow.com/questions/11668111/how-do-i-pop-up-a-custom-form-dialog-in-a-greasemonkey-script
//--- Use jQuery to add the form in a "popup" dialog.
$("header").append ( ' \
    <div id="PopupContainer" style="text-align:center"> \
    <hr/> \
    <form> <!-- For true form use method="POST" action="YOUR_DESIRED_URL" --> \
        <input type="text" id="name" placeholder="Enter Name"> \
        <input type="text" id="message" placeholder="Optional Message"> \
        <h3 style="color:white" id="infoText">&nbsp;</h3> \
        <button id="kickButton" type="button"><h4>Kick Player</h4></button> \
        <button id="banButton" type="button"><h4>Ban Player</h4></button> \
        <button id="playerPopup" type="button"><h4>Open Player Popup</h4></button> \
        <button id="listByDate" type="button"><h4>List All by Date Joined</h4></button> \
        <button id="CloseListBtn" style="text-align:center" type="button"><h4>Hide Date List</h4></button> \
        <button id="CloseDlgBtn" type="button"><h4>Hide SocialTools</h4></button> \
    </form> \
    </div> \
' );

//the whole process for doing the kick/ban and message has to be split up function wise to allow for the pages to load. There might be a way to trigger of a callback instead but this works for now.
function sendMessage(nameStr, messageStr, kickOrBan) {
    
    $("a[title='Message']").click();
    setTimeout(writeMessage, 1500, nameStr, messageStr, kickOrBan);
}

function writeMessage(nameStr, messageStr, kickOrBan) {
    
    $("textarea[name='newMessageTextarea']").text(messageStr);
    $("a[id='btnSend']").click();
    
    if (kickOrBan === "kick")
    {
       setTimeout(performKick, 1000, nameStr); 
    }
    else
    {
       setTimeout(performBan, 1000, nameStr);
    }
    
}

function performKick(nameStr) {
    $("button:contains('kick')").click();
    
    $("#infoText").text (nameStr + " has been kicked.");
    setTimeout(confirmAction, 1500);
}

function performBan(nameStr) {
    
    $("button:contains('ban')").click();
    
    $("#infoText").text (nameStr + " has been banned.");
    setTimeout(confirmAction, 1500);
    
}

function confirmAction()
{
   $("a:contains('yes')").click(); 
   $("div[class='modal-backdrop fade in']").remove(); //The black backgrounds would stay like this: http://i.imgur.com/9Ksroda.png
}

function beginKickBan(kickOrBan)
{
    var nameStr = document.getElementById("name").value;
    var messageStr = document.getElementById("message").value;
    if (nameStr === "")
    {
        $("#infoText").text ("Enter a valid name.");
        return
    }

    if ($("label[for='check_" + nameStr + "']").length) //This is nice - You can actually force the click without having to hit 'Next' to search each page individually! We also look for the checkmark here to be sure we actually have permission to kick/ban them.
    {
        $("label[for='check_" + nameStr + "']").click() //Checkmate!
        if (!(messageStr === "Optional Message") && !(messageStr === ""))
        {
            $("i[data-nickname='" + nameStr + "']").click() //The little dots on the player card
            
            setTimeout(sendMessage, 1500, nameStr, messageStr, kickOrBan);
        }
        else
        {
            setTimeout(performKick, 1000, nameStr);   
        }
    }
    else
    {
        $("#infoText").text ("'" + nameStr + "' was not found.");
    }
}

//--- Use jQuery to activate the dialog buttons.
$("#kickButton").click ( function () {   
    beginKickBan("kick");
} );

$("#CloseDlgBtn").click ( function () {
    $("#PopupContainer").hide ();
} );

$("#banButton").click ( function () {
    beginKickBan("ban");  
} );

$("#playerPopup").click ( function () {
    
    var nameStr = document.getElementById("name").value;
    if (nameStr === "")
    {
        $("#infoText").text ("Enter a valid name.");
        return
    }

    if ($("i[data-nickname='" + nameStr + "']").length) //we check for the dots here unlike the check for the checkmark in beginKickBan so that it works for anyone.
    {
        $("i[data-nickname='" + nameStr + "']").click() //The little dots on the player card
    }
    else
    {
        $("#infoText").text ("'" + nameStr + "' was not found.");
    }
    
} );

$("#listByDate").click ( function () {   
    var players = new Array();
    $("a[class='player-card-actions']").each(function() {
        players.push({name: $(this).attr("data-nickname"), val: new Date($(this).parent().next().html().replace('Joined: ',''))}); //make an object to keep the name+date linked and sortable. we get the players name and then follow the CSS up to the parent h3, then to the sibling p below, get the html text, remove the Joined text.
    });
    
    //lazily taken from https://onpub.com/how-to-sort-an-array-of-dates-with-javascript-s7-a109
    var date_sort_asc = function (date1, date2) {
        if (date1.val > date2.val) return 1;
        if (date1.val < date2.val) return -1;
        return 0;
    };
    
    players.sort(date_sort_asc);
    
    $("header").append ( '<div id="PlayerList" style="text-align:center"> ');
    
    for (var i = 0; i < players.length; i++)
	{
        $("header").append ( '<h5 id="playerDate" style="color:white;text-align:center">' + players[i].name + ' - ' + (players[i].val.getMonth()+1) + ' ' + players[i].val.getDate() + ' ' + players[i].val.getFullYear() + ' ' +'</h5>');
	}
    $("header").append ( '</div>');
    $("#infoText").text ("List generated.");
    
} );
    
$("#CloseListBtn").click ( function () {
    $("*#playerDate").remove(); //remove every h5 listing the dates.
    $("#infoText").text ("List hidden.");
} );