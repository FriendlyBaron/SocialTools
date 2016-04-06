# SocialTools
A Greasemonkey/Tampermonkey script that adds some extra function to Rockstar's Social Club Crew Management Page.

View info/use on reddit: https://www.reddit.com/r/GrandTheftAutoV/comments/479o5s/socialtools_a_browser_script_for_enhancements_to/

https://www.reddit.com/r/gtaonline/comments/49uz5h/socialtools_a_browser_script_for_enhancements_to/

____________________________________________________________________

Managing players in a crew can be hard. Clicking through multiple pages on Rockstar's Social Club page to find them for kicks, bans, promotions or demotions takes an annoyingly long time. **SocialTools** aims to simplify this process for crews both large and small.

Example Image: http://i.imgur.com/IfJGJGP.png

Features:

* Kick/Ban a player by typing the name, with the option to send them a message on SocialClub at the same time.
* Open the [player options page](http://i.imgur.com/vUg5XY4.png) by name.
* List all players by [Different Active Crew](http://i.imgur.com/Fi7JrOz.png) or by [Rank+Alphabetical](http://i.imgur.com/kTG9GTr.png). You can checkmark players from this list as well (makes for easy Control-F/Find of a player).
* Quickly select all players in a rank at once.
* Quickly remove friends with the press of a [single button](http://i.imgur.com/OgkWgyT.png).
* Send a mass message to multiple people in the crew

Install:

* First install [Greasemonkey](https://addons.mozilla.org/en-us/firefox/addon/greasemonkey/) (Firefox) or [Tampermonkey](https://chrome.google.com/webstore/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo) (Chrome)
* Open the [script here](https://github.com/FriendlyBaron/SocialTools/raw/master/SocialTools.user.js) and hit `install`

Usage:

* The *Kick/Ban Player* buttons allow you to type in a players name and perform the Kick/Ban. If you enter a message, it will be sent to them along with the action.
* The *Open Player Popup* will open the player-sheet for the player whose name is typed in.
* *List All with Different Active Crew* will list players with an active crew different than the current crew.
* *List All By Rank Button* will show all members by rank then by alphabet. Clicking the checkbox next to the Rank Name will select all of that rank. This action will take a few seconds when there are many players in a rank.
* In the date and rank lists, hitting the individual checkbox will toggle the checkmark on that player.
* The *Hide Player List* button will hide the previous two lists after they have been generated.
* *Hide SocialTools* will hide the secondary buttons from your the page until the page is reloaded.
* The *Message All Checked* Button will send the message entered in the 'Optional Message' Area to everyone who has been checkmarked. It takes around 15 seconds per message, but you can message as many people as you want at once.
* On your Friend's page, the *Show Delete Friend* button will add a *Delete Friend* button onto each player card. This button will instantly remove them as a friend. The *Show Delete Friend* button is a safety tool, as the *Delete Friend* button automatically confirms the deletion.

Security:

* You can see the [entire source](https://github.com/FriendlyBaron/SocialTools) on my Github, which is where you install it from.
* The script is limited to only running on the crew manage page (http://socialclub.rockstargames.com/crew/YOUR_CREW_NAME/manage/hierarchy) or your friend page (http://socialclub.rockstargames.com/friends/index) and does not do anything related to modifying or needing information from your account.

Planned/Bugs/Ideas

* I have considered doing something for temporary bans, but there's no simple way to save a countdown if you close the page.
* Report any bugs and I'll fix them ASAP
* Open to ideas for additions, even if it's a specific thing I can make a one-off version for you or at least give you the pseudocode for it.


