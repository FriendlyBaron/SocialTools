// ==UserScript==
// @name         SocialTools
// @namespace    https://github.com/FriendlyBaron/SocialTools
// @version      1.4
// @description  SocialTools
// @author       FriendlyBaron
// @match        https://socialclub.rockstargames.com/crew/*/manage/hierarchy
// @match        http://socialclub.rockstargames.com/crew/*/manage/hierarchy
// @match        http://socialclub.rockstargames.com/friends/index
// @match        https://socialclub.rockstargames.com/friends/index
// @match        http://socialclub.rockstargames.com/friends
// @match        https://socialclub.rockstargames.com/friends
// @match        https://socialclub.rockstargames.com/member/*
// @match        http://socialclub.rockstargames.com/member/*
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

if (window.location.href == "http://socialclub.rockstargames.com/friends/index" || window.location.href == "https://socialclub.rockstargames.com/friends/index"
   || window.location.href == "https://socialclub.rockstargames.com/friends" || window.location.href == "https://socialclub.rockstargames.com/friends")
{
    $("header").append ( ' \
    <div id="PopupContainer" style="text-align:center"> \
    <hr/> \
    <form> <!-- For true form use method="POST" action="YOUR_DESIRED_URL" --> \
        <input type="text" id="message" placeholder="Optional Message"> \
        <button id="msgAllFriends" type="button"><h4>Message All Friends</h4></button> \
        <button id="showRemover" type="button"><h4>Show One-Click Delete Friend</h4></button> <!--not gonna worry about hiding these buttons, the page can just be refreshed--> \
        <button id="removeAllChecked" type="button"><h4>Remove All Checked</h4></button> \
        <button id="denyAll" type="button"><h4>Deny All Friend Requests</h4></button> \
        <h3 style="color:white" id="infoText">&nbsp;</h3> \
    </form> \
    </div> \
    ' );
}
else if (window.location.href.startsWith("https://socialclub.rockstargames.com/member") || window.location.href.startsWith("http://socialclub.rockstargames.com/member"))
{
    setTimeout(showDeleteFriendOption, 1250);
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
        <button id="messageAll" type="button"><h4>Message All Checked</h4></button> \
        <button id="playerPopup" type="button"><h4>Open Player Popup</h4></button> \
        <button id="listByActive" type="button"><h4>List All with Different Active Crew</h4></button> \
        <button id="listByRank" type="button"><h4>List All by Rank</h4></button> \
        <button id="CloseListBtn" style="text-align:center" type="button"><h4>Hide Player List</h4></button> \
        <button id="CloseDlgBtn" type="button"><h4>Hide SocialTools</h4></button> \
        <br/> \
        <br/> \
        <button id="denyAllJoin" type="button"><h4>Deny All Join Requests</h4></button> \
        <button id="denyAllJoinSpareXbox" type="button"><h4>Deny All Join Requests without a linked Xbox Account</h4></button> \
        <button id="denyAllJoinSparePSN" type="button"><h4>Deny All Join Requests without a linked PSN Account</h4></button> \
    </form> \
    </div> \
' );
    setTimeout(setQueryPlayer, 3000);
}

function setQueryPlayer()
{
    var name = localStorage.getItem("queryPlayer");
    if (name !== null && name.length > 0)
    {
        $("input[id='nickname']").val(name);
        if ($("input[id='nickname']").val() == name)
        {
            setTimeout(checkQueryPlayer, 1100, name);
            localStorage.setItem("queryPlayer","");
        }
        else
        {
            setTimeout(setQueryPlayer, 1000);
        }
    }
}

function checkQueryPlayer(name)
{
    $("a[id='searchHierarchy']")[0].click();
    if ($("label[for='check_" + name + "']").length)
    {
        if ($("label[for='check_" + name + "']").parent().attr("title") == "Deselect")
        {
            setTimeout(checkQueryPlayer, 1000, name);
        }
        else
        {
            $("label[for='check_" + name + "']").click();
            setTimeout(checkQueryPlayer, 1000, name);
        }
    }
}

//the whole process for doing the kick/ban and message has to be split up function wise to allow for the pages to load. There might be a way to trigger of a callback instead but this works for now.
function sendMessage(nameStr, messageStr, kickOrBan) {

    $("a[title='Message']").click(); //message button
    setTimeout(writeMessage, 1500, nameStr, messageStr, kickOrBan);
}

function unfriendMore() {

    $("a[title='More Options']")[0].click();
    setTimeout(unfriendUnfriend, 500);
}

function unfriendUnfriend() {

    $("a[title='Unfriend']")[0].click();
    setTimeout(unfriendConfirm, 1000);
}

function unfriendConfirm()
{
   $("a:contains('confirm')")[0].click();
   setTimeout(wipeBlack, 1000);
}

function wipeBlack()
{
    $("div[class='modal-backdrop fade in']").remove(); //The black backgrounds would stay like this: http://i.imgur.com/9Ksroda.png
}

function showDeleteFriendOption() {
    $("li[id='btnDeleteFriend'").append ( ' \
            <button id="removeFriendNormal" type="button">One Click Delete Friend</button> \
    ' );
    $("div[class='split-button end btnDeleteFriend'").append ( ' \
            <button id="removeFriendHiddenProfile" type="button">One Click Delete Friend</button> \
    ' );

    $("#removeFriendNormal").click ( function () {
        setTimeout(confirmRemoveFriend, 2000);
    } );
    $("#removeFriendHiddenProfile").click ( function () {
        setTimeout(confirmRemoveFriend, 2000);
    } );

    setTimeout(showManageOption, 500);
}

function showManageOption() {
    $("div[class='crewCard featureCard lightCard']").each(function() {
        if ($(this).find(".promoteClass").length < 1)
        {
            var crewID = $(this).children().first().children().first().attr("data-id");
            $(this).children().first().children().first().next().children().first().next().next().children().first().after('<br/><button id="promote'+crewID+'" type="button" class="promoteClass"><h6>Manage in this Crew</h6></button>    ');

            $("[id=promote"+crewID+"]").click ( function () {
                var playerName = $("div[class='user-data']").children().first().text();
                var crewTag = $(this).parent().children().first().attr("href");
                localStorage.setItem("queryPlayer", playerName);
                var newWindow = window.open("https://socialclub.rockstargames.com"+crewTag+"/manage/hierarchy");
            });
        }
    });
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
   setTimeout(wipeBlack, 1000);
}

function beginKickBan(kickOrBan)
{
    var nameStr = document.getElementById("name").value;
    var messageStr = document.getElementById("message").value;
    if (nameStr === "")
    {
        $("#infoText").text ("Enter a valid name.");
        return;
    }

    if ($("label[for='check_" + nameStr + "']").length) //This is nice - You can actually force the click without having to hit 'Next' to search each page individually! We also look for the checkmark here to be sure we actually have permission to kick/ban them.
    {
        $("label[for='check_" + nameStr + "']").click(); //Checkmate!
        if (!(messageStr === "Optional Message") && !(messageStr === ""))
        {
            $("i[data-nickname='" + nameStr + "']").click(); //The little dots on the player card

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
        return;
    }

    if ($("label[for='check_" + nameStr + "']").length) //This is nice - You can actually force the click without having to hit 'Next' to search each page individually! We also look for the checkmark here to be sure we actually have permission to kick/ban them.
    {
        $("label[for='check_" + nameStr + "']").click(); //Checkmate!
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

$("#messageAll").click ( function () {
    var players = new Array();
    var enabled = false;
    var finalPlayer = "";
    var count = 0;

    /*
    //-----
    //http://stackoverflow.com/questions/11003761/notepad-add-to-every-line
    var registered = [
        "EDDI2142",
        "Ganjalo",
        "TheTerminat0r"
    ];
    */
    //-----

    $("div[title='Deselect']").each(function() {
        //players.push($(this).next());

        //-----ADVANCED - UNCOMMENT THIS BLOCK AND THE "registered" LIST - ONLY PEOPLE NOT ON THE LIST WILL BE MESSAGED-----
        /*
        var isRegistered=false;

        for(var i=0;i<registered.length;i++) {
            if($(this).next().attr("data-nickname")==registered[i])
            {
                isRegistered=true;
            }
        }

        if(!isRegistered)
        {
            //players.push($(this).next());
            $(this).next().css( "border", "3px solid red" );
        }
        */
        //-----END ADVANCED-----

        //-----NORMAL SECTION-----
        if (count < 101 && ((document.getElementById("name").value === "" && !enabled) || (document.getElementById("name").value !== "Enter Name" && $(this).next().attr("data-nickname") === document.getElementById("name").value && !enabled))) //this section is for resuming messaging, if less than NAME then it doesn't include them
        {
            enabled = true;
            players.push($(this).next());
            count++;
        }
        else if (enabled)
        {
            if (count < 100)
            {
                players.push($(this).next());
            }
            else
            {
                enabled = false;
                finalPlayer = $(this).next().attr("data-nickname");
            }
            count++;
        }
        //-----END NORMAL SECTION-----
    });
    messageFromListClickDots(players, finalPlayer);
} );

$("#msgAllFriends").click ( function () {
    var players = new Array();
    $("i[class='scicon-menu-dots player-card-actions']").each(function() {
        players.push($(this));
    });
    if (players.length != $("div[class='inner clearfix']").children().first().children().first().html().replace(/[{()}]/g, '')) //http://i.imgur.com/TQeGpzd.png
    {
        $("#infoText").text ("Detected " + players.length + " friends, but you have " + $("div[class='inner clearfix']").children().first().children().first().html().replace(/[{()}]/g, '') + " friends. Please scroll down all the way before beginning messaging");
    }
    messageFromListClickDots(players, "");
} );

$("#removeAllChecked").click ( function () {
    var checkmarkList = new Array();
    $("[id^=friendBox]").each(function() {
        if($(this).is(':checked'))
        {
            checkmarkList.push($(this).val());
        }
    });
    removeListOfFriends(checkmarkList);
} );

$("#denyAll").click ( function () {
    var denyList = new Array();
    $("div[class='scicon-menu-dots player-card-actions']").each(function() {
        denyList.push($(this).attr("data-nickname"));
    });
    denyRequests(denyList);
} );


function confirmRemoveFriend() {

    $("a[id='btnConfirm']")[0].click();
}


function denyRequests(denyList) {
    if (denyList.length < 1)
    {
        $("#infoText").text ("Finished with Request Denial.");
        return;
    }
    else
    {
        $("#infoText").text (denyList.length + " left to deny.");
    }
    $("[div[data-nickname='" + denyList[0] + "']").click();
    setTimeout(denyRequestReject, 4000, denyList);
}

function denyRequestReject(denyList) {

    $("a[class='btnRejectFriend rejectRequest']")[0].click();
    denyList.shift();
    setTimeout(denyRequests, 11500, denyList);
}

function removeListOfFriends(checkmarkList) {
    if (checkmarkList.length < 1)
    {
        $("#infoText").text ("Finished with Friend Removal.");
        return;
    }
    else
    {
        $("#infoText").text (checkmarkList.length + " left to remove.");
    }
    if ($("[i[data-nickname='" + checkmarkList[0] + "']").length ) {
        $("[i[data-nickname='" + checkmarkList[0] + "']").click();
        setTimeout(removeListOfFriendsMore, 2000, checkmarkList);
    }
    else
    {
        $('html, body').animate({ scrollTop: $(document).height() }, 250);
        setTimeout(removeListOfFriends, 500, checkmarkList);
    }
}

function removeListOfFriendsMore(checkmarkList) {

    $("a[title='More Options']")[0].click();
    setTimeout(removeListOfFriendsDeleteBtn, 2000, checkmarkList);
}

function removeListOfFriendsDeleteBtn(checkmarkList) {

    $("a[title='Unfriend']")[0].click();
    setTimeout(removeListOfFriendsConfirm, 2000, checkmarkList);
}

function removeListOfFriendsConfirm(checkmarkList) {

    $("a[id='btnConfirm']")[0].click();
    checkmarkList.shift();
    setTimeout(removeListOfFriends, 11000, checkmarkList);
}

function messageFromListClickDots(players, finalPlayer) {

    if (players.length < 1)
    {
        $("#infoText").text ("Done with mass messaging. Enter " + finalPlayer + " to continue where you left off");
        return;
    }
    else
    {
        $("#infoText").text ("" + players.length + " messages left");
    }

    var messageStr = document.getElementById("message").value;
    if (!(messageStr === "Optional Message") && !(messageStr === ""))
    {
        players[0].click();
        setTimeout(messageFromListClickMessage, 5000, players, finalPlayer);
    }
    else
    {
        $("#infoText").text ("Enter a message.");
        return;
    }
}

function messageFromListClickMessage(players, finalPlayer) {

    $("a[title='Message']")[0].click(); //message button
    setTimeout(messageFromListWriteMessage, 5000, players, finalPlayer);
}

function messageFromListWriteMessage(players, finalPlayer) {

    $("textarea[name='newMessageTextarea']").text(document.getElementById("message").value); //set message text
    setTimeout(messageFromListClickSendMessage, 1000, players, finalPlayer);
}

function messageFromListClickSendMessage(players, finalPlayer) {

    $("button[id='btnSend']").click(); //send
    players.shift();
    setTimeout(messageFromListClickDots, 5000, players, finalPlayer);
}

function addDeleteButtons(){

    $("i[class='scicon-menu-dots player-card-actions']").each(function() {

        if ($(this).find(".removeFriendClass").length < 1) //dont do anything if the player card already has the Delete Friend button
        {
            $(this).append('<br/><button id="removeFriend'+($(this).attr("data-nickname")).replace(/\./g, "-")+'" type="button" class="removeFriendClass"><h6>Delete Friend</h6></button>    ');

            $(this).parent().children().first().next().children().first().next().after('<input id="friendBox' + $(this).attr("data-nickname") + '" type="checkbox" value="' + $(this).attr("data-nickname") + '">');

            $("[id=removeFriend"+($(this).attr("data-nickname")).replace(/\./g, "-")+"]").click ( function () {  //we have to create a button handler for each button directly since we're not adding them all at once.

                $(this).parent().children().first().next().next().click();
                setTimeout(unfriendMore, 1000);
            });
        }
    });
    $("div[class='scicon-menu-dots player-card-actions']").each(function() {
        if ($(this).find(".denyFriendClass").length < 1) //dont do anything if the player card already has the Deny Friend button
        {
            $(this).append('<br/><button id="denyFriend'+($(this).attr("data-nickname")).replace(/\./g, "-")+'" type="button" class="denyFriendClass"><h6>Deny Friend</h6></button>    ');

            $(this).parent().children().first().next().children().first().next().after('<input id="denyBox' + $(this).attr("data-nickname") + '" type="checkbox" value="' + $(this).attr("data-nickname") + '">');

            $("[id=denyFriend"+($(this).attr("data-nickname")).replace(/\./g, "-")+"]").click ( function () {  //we have to create a button handler for each button directly since we're not adding them all at once.

                //$(this).parent().children().first().next().css( "border", "3px solid red" );
                //$(this).parent().children().first().next().next().click();
                setTimeout(denyReject, 1000);
            });
        }
    });
}

function denyReject() {

    $("a[class='btnRejectFriend rejectRequest']").click();
}

$("#showRemover").click ( function () {
    setInterval(addDeleteButtons, 250);
} );

$("#playerPopup").click ( function () {

    var nameStr = document.getElementById("name").value;
    if (nameStr === "")
    {
        $("#infoText").text ("Enter a valid name.");
        return;
    }

    if ($("i[data-nickname='" + nameStr + "']").length) //we check for the dots here unlike the check for the checkmark in beginKickBan so that it works for anyone.
    {
        $("i[data-nickname='" + nameStr + "']").click(); //The little dots on the player card
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

$("#denyAllJoin").click ( function () {

    var rank5 = new Array();

    $("#crewRankWrapper_5 i[class='scicon-menu-dots player-card-actions']").each(function() {

        rank5.push($(this).attr("data-nickname"));
    });

    setTimeout(denyCrewJoinBegin, 1000, rank5, "No linked type specified");
} );

$("#denyAllJoinSparePSN").click ( function () {

    var rank5 = new Array();

    $("#crewRankWrapper_5 i[class='scicon-menu-dots player-card-actions']").each(function() {

        rank5.push($(this).attr("data-nickname"));
    });

    setTimeout(denyCrewJoinBegin, 1000, rank5, "PSN", 0);
} );

$("#denyAllJoinSpareXbox").click ( function () {

    var rank5 = new Array();

    $("#crewRankWrapper_5 i[class='scicon-menu-dots player-card-actions']").each(function() {

        rank5.push($(this).attr("data-nickname"));
    });

    setTimeout(denyCrewJoinBegin, 1000, rank5, "XBOX", 0);
} );


function denyCrewJoinBegin(listToDeny, flag, count) {

    if (listToDeny.length < 1)
    {
        $("#infoText").text ("Denied/Accepted all crew join requests.");
        return;
    }
    else if (count > 99)
    {
        $("#infoText").text ("Denied/Accepted 100 requests (Rockstar limit), refresh the page and reselect.");
        return;
    }
    else
    {
        $("#infoText").text ("" + listToDeny.length + " left to deny if they do not have a linked account: " + flag);
    }

    count++;

    $("i[data-nickname='"+listToDeny[0]+"'").click();
    setTimeout(denyCrewJoinCheckAcceptReject, 5000, listToDeny, flag, count);
}

function denyCrewJoinCheckAcceptReject(listToDeny, flag, count) {

    if($("a[title='Reject Crew Request']").length)
    {
        if($(".accounts " + flag).length)
        {
            $("a[title='Invite to Crew']")[0].click();
            setTimeout(denyCrewJoinCancel, 5000, listToDeny, flag, count);
        }
        else
        {
            $("a[title='Reject Crew Request']")[0].click();
            setTimeout(denyCrewJoinCancel, 5000, listToDeny, flag, count);
        }
    }
    else
    {
        $("#infoText").text ("Could not open profile for " + listToDeny[0] + ", it is probably private");
        listToDeny.shift();
        setTimeout(denyCrewJoinBegin, 5000, listToDeny, flag, count);
    }
}

function denyCrewJoinCancel(listToDeny, flag, count) {

    $("a[title='Cancel']")[0].click();
    listToDeny.shift();
    setTimeout(denyCrewJoinBegin, 5500, listToDeny, flag, count);
}

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
    $("header").append ( '<hr/ id="playerDate"><h1 id="playerDate" style="color:white;text-align:center">Rank 1</h1><h4 id="playerDate" style="color:white;text-align:center">Select all in this rank: <input id="selectAll" type="checkbox" value="Rank 1"></h4><h4 id="playerDate" style="color:white;text-align:center">Select all with different active crew: <input id="selectDifferentAll" type="checkbox" value="Rank 1"></h4><br/ id="playerDate">'); //Rank 1 + the checkmark for selecting all
    for (var i = 0; i < rank1.length; i++)
	{
        $("header").append ( '<h5 id="playerDate" style="color:white;text-align:center"><input id="listBox' + rank1[i].name + '" type="checkbox" value="' + rank1[i].name + '">' + rank1[i].name + '</h5>'); //player name + checkbox
	}
    $("header").append ( '<hr/ id="playerDate"><h1 id="playerDate" style="color:white;text-align:center">Rank 2</h1><h4 id="playerDate" style="color:white;text-align:center">Select all in this rank: <input id="selectAll" type="checkbox" value="Rank 2"></h4><h4 id="playerDate" style="color:white;text-align:center">Select all with different active crew: <input id="selectDifferentAll" type="checkbox" value="Rank 2"></h4><br/ id="playerDate">');
    for (var i = 0; i < rank2.length; i++)
	{
        $("header").append ( '<h5 id="playerDate" style="color:white;text-align:center"><input id="listBox' + rank2[i].name + '" type="checkbox" value="' + rank2[i].name + '">' + rank2[i].name + '</h5>');
	}
    $("header").append ( '<hr/ id="playerDate"><h1 id="playerDate" style="color:white;text-align:center">Rank 3</h1><h4 id="playerDate" style="color:white;text-align:center">Select all in this rank: <input id="selectAll" type="checkbox" value="Rank 3"></h4><h4 id="playerDate" style="color:white;text-align:center">Select all with different active crew: <input id="selectDifferentAll" type="checkbox" value="Rank 3"></h4><br/ id="playerDate">');
    for (var i = 0; i < rank3.length; i++)
	{
        $("header").append ( '<h5 id="playerDate" style="color:white;text-align:center"><input id="listBox' + rank3[i].name + '" type="checkbox" value="' + rank3[i].name + '">' + rank3[i].name + '</h5>');
	}
    $("header").append ( '<hr/ id="playerDate"><h1 id="playerDate" style="color:white;text-align:center">Rank 4</h1><h4 id="playerDate" style="color:white;text-align:center">Select all in this rank: <input id="selectAll" type="checkbox" value="Rank 4"></h4><h4 id="playerDate" style="color:white;text-align:center">Select all with different active crew: <input id="selectDifferentAll" type="checkbox" value="Rank 4"></h4><br/ id="playerDate">');
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

                //-----ADVANCED - UNCOMMENT THIS BLOCK AND COMMENT NORMAL BLOCK TO SELECT PLAYERS *NOT* ON THE "registered" LIST-----
                /*var registered = [
                    "name1",
                    "name2",
                    "name3"
                ];

                var isRegistered=false;

                for(var i=0;i<registered.length;i++) {
                    if($(this).attr("data-nickname").toUpperCase()==registered[i].toUpperCase())
                    {
                        isRegistered=true;
                    }
                }

                if(!isRegistered)
                {
                    toggleCheckMark($(this).attr("data-nickname"), "check");
                }
                */
                //-----END ADVANCED-----

                //-----NORMAL-----
                toggleCheckMark($(this).attr("data-nickname"), "check");
                //-----END NORMAL-----
            });
            $("#infoText").text ("All of " + this.value + " has been checkmarked. Use the normal SocialClub Kick/Ban/Promote/Demote options.");
        } else {
            $("#crewRankWrapper_"+rankToUse+" a[class='player-card-actions']").each(function() {
                toggleCheckMark($(this).attr("data-nickname"), "unchecked");
            });
            $("#infoText").text ("All of " + this.value + " has been unchecked.");
        }
    });

    $("[id^=selectDifferentAll]").click ( function () {  //the checkboxes for selecting all players in a rank

       var rankToUse = this.value.replace('Rank ',''); //convert the value to just the number
       var crewName =  $("#hierarchyFilterWrapper div[class='crewTag private']").children().first().html();

        if ( this.checked ) {
            $("#crewRankWrapper_"+rankToUse+" a[class='player-card-actions']").each(function() { //go through each player and checkem
                $(this).parent().next().children().first().children().first().css( "border", "3px solid red" );
                if (crewName != $(this).parent().next().children().first().children().first().html())
                {
                    toggleCheckMark($(this).attr("data-nickname"), "check");
                }
            });
            $("#infoText").text ("All of " + this.value + " with a different active crew has been checkmarked. Use the normal SocialClub Kick/Ban/Promote/Demote options.");
        } else {
            $("#crewRankWrapper_"+rankToUse+" a[class='player-card-actions']").each(function() {
                if (crewName != $(this).parent().next().children().first().children().first().html())
                {
                    toggleCheckMark($(this).attr("data-nickname"), "unchecked");
                }
            });
            $("#infoText").text ("All of " + this.value + " with a different active crew has been unchecked.");
        }
    });

} );

$("#CloseListBtn").click ( function () {
    $("*#playerDate").remove(); //This ends up removing every listing (*) related to either list based off playerDate being in the ID for each.
    $("#infoText").text ("List hidden.");
} );