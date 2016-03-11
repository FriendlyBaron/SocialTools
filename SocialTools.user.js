// ==UserScript==
// @name         SocialTools
// @namespace    https://github.com/FriendlyBaron/SocialTools
// @version      1.2
// @description  SocialTools
// @author       FriendlyBaron
// @match        http://socialclub.rockstargames.com/crew/*/manage/hierarchy
// @match        http://socialclub.rockstargames.com/friends/index
// @grant        none
// @require     http://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js
// ==/UserScript==

//First time doing anything tamper/greasemonkey related. Reading on the web seemed to point to jquery making automated button clicks the easist.
//@match will allow it to run only on the crew management pages.

//todos?
//    unban
//    tempbans? would need some method for storing. greasemonkey cant write to storage. 


//The base Jquery to form the dialog comes from here: http://stackoverflow.com/questions/11668111/how-do-i-pop-up-a-custom-form-dialog-in-a-greasemonkey-script
//--- Use jQuery to add the form in a "popup" dialog.

if (window.location.href == "http://socialclub.rockstargames.com/friends/index") //If there is a better way to do this, let me know...
{
    $("header").append ( ' \
    <div id="PopupContainer" style="text-align:center"> \
    <hr/> \
    <form> <!-- For true form use method="POST" action="YOUR_DESIRED_URL" --> \
        <button id="showRemover" type="button"><h4>Show Delete Friend</h4></button> <!--not gonna worry about hiding these buttons, the page can just be refreshed--> \
    </form> \
    </div> \
    ' );
}
else
{
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
        <button id="listByActive" type="button"><h4>List All with Different Active Crew</h4></button> \
        <button id="listByRank" type="button"><h4>List All by Rank</h4></button> \
        <button id="CloseListBtn" style="text-align:center" type="button"><h4>Hide Player List</h4></button> \
        <button id="CloseDlgBtn" type="button"><h4>Hide SocialTools</h4></button> \
    </form> \
    </div> \
' );
}


//the whole process for doing the kick/ban and message has to be split up function wise to allow for the pages to load. There might be a way to trigger of a callback instead but this works for now.
function sendMessage(nameStr, messageStr, kickOrBan) {
    
    $("a[title='Message']").click(); //message button
    setTimeout(writeMessage, 1500, nameStr, messageStr, kickOrBan);
}

function unfriendMore() {
    
    $("a[title='More Options']").click();
    setTimeout(unfriendUnfriend, 500);
}

function unfriendUnfriend() {
    
    $("a[title='Unfriend']").click();
    setTimeout(unfriendConfirm, 1000);
}

function unfriendConfirm()
{
   $("a:contains('confirm')").click(); 
   $("div[class='modal-backdrop fade in']").remove(); //The black backgrounds would stay like this: http://i.imgur.com/9Ksroda.png
}

function writeMessage(nameStr, messageStr, kickOrBan) {
    
    $("textarea[name='newMessageTextarea']").text(messageStr); //set message text
    $("a[id='btnSend']").click(); //send
    
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
        $("#infoText").text ("'" + nameStr + "' was not found (or you don't have permission).");
    }
}

function toggleCheckMark(nameStr, state)
{
    if (nameStr === "")
    {
        $("#infoText").text ("Enter a valid name.");
        return
    }

    if ($("label[for='check_" + nameStr + "']").length) //This is nice - You can actually force the click without having to hit 'Next' to search each page individually! We also look for the checkmark here to be sure we actually have permission to kick/ban them.
    {
        $("label[for='check_" + nameStr + "']").click() //Checkmate!
        if (state === "check")
        {
            $("#infoText").text ("'" + nameStr + "' has been checkmarked. Use the original SocialClub Kick/Ban/Promote/Demote for this.");
        }
        else
        {
            $("#infoText").text ("'" + nameStr + "' has been uncheckmarked.");   
        }
    }
    else
    {
        $("#infoText").text ("'" + nameStr + "' was not found (or you don't have permission).");
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

function addDeleteButtons(){

    $("i[class='scicon-menu-dots player-card-actions']").each(function() {
        
        if ($(this).find(".removeFriendClass").length < 1) //dont do anything if the player card already has the Delete Friend button
        {
            $(this).append('<br/><button id="removeFriend'+$(this).attr("data-nickname")+'" type="button" class="removeFriendClass"><h6>Delete Friend</h6></button>');

            $("[id=removeFriend"+$(this).attr("data-nickname")+"]").click ( function () {  //we have to create a button handler for each button directly since we're not adding them all at once.

                $(this).parent().children().first().next().next().click();
                setTimeout(unfriendMore, 1000);
            });
        }
    });
}

$("#showRemover").click ( function () {   
    setInterval(addDeleteButtons, 250); //On the friends page, not all of the player cards load right away, so we'll just
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

$("#listByActive").click ( function () {   
    var players = new Array();
    $("a[class='player-card-actions']").each(function() {
        players.push({name: $(this).attr("data-nickname"), val: $(this).parent().next().children().children().first().html()}); //make an object to keep the name+crew linked and sortable.
        
    });
    
    var crewName =  $("#hierarchyFilterWrapper div[class='crewTag private']").children().first().html();
    $("header").append ( '<div id="PlayerList" style="text-align:center"> ');
    
    for (var i = 0; i < players.length; i++)
	{
        //name, active crew, and input for the checkbox. Each checkbox is linked to the player for tracking purposes.
        if (crewName != players[i].val)
        {
            $("header").append ( '<h5 id="playerDate" style="color:white;text-align:center"><input id="listBox' + players[i].name + '" type="checkbox" value="' + players[i].name + '">' + players[i].name + ' - ' + players[i].val +'</h5>');
        }
    }
    $("header").append ( '</div>');
    
    $("[id^=listBox]").click ( function () {  //This looks for any element starting with listBox, so listBoxUserA and listBox420yoloswagxXx are both hit.
        if ( this.checked ) {   
            toggleCheckMark(this.value, "check");
        } else {
            toggleCheckMark(this.value, "unchecked");
        }
    });
} );



$("#listByRank").click ( function () {   
    var rank1 = new Array();
    var rank2 = new Array();
    var rank3 = new Array();
    var rank4 = new Array();
    $("#crewRankWrapper_1 a[class='player-card-actions']").each(function() {
        rank1.push({name: $(this).attr("data-nickname"), val: new Date($(this).parent().next().html().replace('Joined: ',''))});
    });
    $("#crewRankWrapper_2 a[class='player-card-actions']").each(function() {
        rank2.push({name: $(this).attr("data-nickname"), val: new Date($(this).parent().next().html().replace('Joined: ',''))});
    });
    $("#crewRankWrapper_3 a[class='player-card-actions']").each(function() {
        rank3.push({name: $(this).attr("data-nickname"), val: new Date($(this).parent().next().html().replace('Joined: ',''))});
    });
    $("#crewRankWrapper_4 a[class='player-card-actions']").each(function() {
        rank4.push({name: $(this).attr("data-nickname"), val: new Date($(this).parent().next().html().replace('Joined: ',''))});
    });
    
    //Skip sorting to keep alhpabetical
    
    $("header").append ( '<div id="PlayerList" style="text-align:center"> ');
    $("header").append ( '<hr/ id="playerDate"><h1 id="playerDate" style="color:white;text-align:center">Rank 1 <input id="selectAll" type="checkbox" value="Rank 1"></h1><br/ id="playerDate">'); //Rank 1 + the checkmark for selecting all
    for (var i = 0; i < rank1.length; i++)
	{
        $("header").append ( '<h5 id="playerDate" style="color:white;text-align:center"><input id="listBox' + rank1[i].name + '" type="checkbox" value="' + rank1[i].name + '">' + rank1[i].name + '</h5>'); //player name + checkbox
	}
    $("header").append ( '<hr/ id="playerDate"><h1 id="playerDate" style="color:white;text-align:center">Rank 2 <input id="selectAll" type="checkbox" value="Rank 2"></h1><br/ id="playerDate">');
    for (var i = 0; i < rank2.length; i++)
	{
        $("header").append ( '<h5 id="playerDate" style="color:white;text-align:center"><input id="listBox' + rank2[i].name + '" type="checkbox" value="' + rank2[i].name + '">' + rank2[i].name + '</h5>');
	}
    $("header").append ( '<hr/ id="playerDate"><h1 id="playerDate" style="color:white;text-align:center">Rank 3 <input id="selectAll" type="checkbox" value="Rank 3"></h1><br/ id="playerDate">');
    for (var i = 0; i < rank3.length; i++)
	{
        $("header").append ( '<h5 id="playerDate" style="color:white;text-align:center"><input id="listBox' + rank3[i].name + '" type="checkbox" value="' + rank3[i].name + '">' + rank3[i].name + '</h5>');
	}
    $("header").append ( '<hr/ id="playerDate"><h1 id="playerDate" style="color:white;text-align:center">Rank 4 <input id="selectAll" type="checkbox" value="Rank 4"></h1><br/ id="playerDate">');
    for (var i = 0; i < rank4.length; i++)
	{
        $("header").append ( '<h5 id="playerDate" style="color:white;text-align:center"><input id="listBox' + rank4[i].name + '" type="checkbox" value="' + rank4[i].name + '">' + rank4[i].name + '</h5>');
	}
    $("header").append ( '</div>');
    $("#infoText").text ("Rank List generated.");
    
    $("[id^=listBox]").click ( function () {  //indivudual player checkboxes again
        if ( this.checked ) {   
            toggleCheckMark(this.value, "check");
        } else {
            toggleCheckMark(this.value, "unchecked");
        }
    });
    
    $("[id^=selectAll]").click ( function () {  //the checkboxes for selecting all players in a rank
       
       var rankToUse = this.value.replace('Rank ',''); //convert the value to just the number
        
        if ( this.checked ) {   
            $("#crewRankWrapper_"+rankToUse+" a[class='player-card-actions']").each(function() { //go through each player and checkem
                toggleCheckMark($(this).attr("data-nickname"), "check");
            });
            $("#infoText").text ("All of " + this.value + " has been checkmarked. Use the normal SocialClub Kick/Ban/Promote/Demote options.");
        } else {
            $("#crewRankWrapper_"+rankToUse+" a[class='player-card-actions']").each(function() {
                toggleCheckMark($(this).attr("data-nickname"), "unchecked");
            });
            $("#infoText").text ("All of " + this.value + " has been unchecked.");
        }
    });
    
} );
    
$("#CloseListBtn").click ( function () {
    $("*#playerDate").remove(); //This ends up removing every listing (*) related to either list based off playerDate being in the ID for each.
    $("#infoText").text ("List hidden.");
} );