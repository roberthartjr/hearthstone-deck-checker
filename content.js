(function() {
	'use strict';

	var mycollection = [];		// holds the card collection
	var cards;					// all possible cards for the collection

	var myurl = chrome.extension.getURL("carddata.json");	

	// load all possible cards for a collection
	$.ajax({
		url: myurl,
		datatype: "json",
		async: false,
		success: function(data) {
			cards = $.parseJSON(data);
			//alert(cards);
		}
	});


	// check if a collection already exists
	chrome.storage.local.get("hscollection", function(data) {
		

		// collection exists so load it
		if(typeof data.hscollection !== "undefined")
		{
			mycollection = data.hscollection;
		}
		// collection does not exist
		else
		{

			// init the collection
			for(var x=0; x<cards.length; x++)
			{
				mycollection.push(0);
			}

			chrome.storage.local.set({"hscollection": mycollection}, function() {
				console.log("mycollection created and saved");
			});



			// open options page so user can start entering collection
			if(chrome.runtime.openOptionsPage)
			{
				chrome.runtime.openOptionsPage();
			}
			else
			{
				window.open(chrome.runtime.getURL("options.html"));
			}

		}

		checkCards();		
	});



// checks if the cards in the deck at hearthpwn are in our collection and if so highlight them
// blue highlight means we have all copies of the card
// orange highlight means we have one copy of the card
function checkCards()
{

	// cycles through each card in the current deck, gets the card's name, set, copies of card, class, and rarity
	$("tr").has("td.col-name a[class*='rarity']").each(function() {

	

		var cardname = $(this).find("a").text().trim();
		var numcards = $(this).find("td.col-name").text().trim();
		var classes = $(this).find("[class*='rarity']").attr("class").split(' ');
		var rarity = 0;
		numcards = numcards.charAt(numcards.length - 1);
		var classindex = 0;
		var setindex = 1;


		// if the card is not one of the free cards
		if(classes[setindex].indexOf("set-2") == -1)
		{
			// get rarity of card
			switch(classes[classindex])
			{
				case "rarity-1":
					rarity = Rarity.COMMON;
					break;

				case "rarity-3":
					rarity = Rarity.RARE;
					break;

				case "rarity-4":
					rarity = Rarity.EPIC;
					break;

				case "rarity-5":
					rarity = Rarity.LEGENDARY;
					break;
			}

		}
		// card is a free one that every collection has, so hightlight it
		else
		{
			highlightCard(this, "highlight-all");
			return 1;
		}



		// find the card in the collection
		for(var cardindex = 0; cardindex < cards.length; cardindex++)
		{

			if(cards[cardindex].name.toUpperCase() == cardname.toUpperCase())
			{

				var num = 0;

				// get how many copies the user has in their collection
				if(typeof mycollection[cardindex] !== "undefined")
				{
					num = mycollection[cardindex];

					// if they at least have one copy
					if(num > 0)
					{
						// only has one copy of the card in their collection so highlight it in orange
						if(num < numcards)
						{
							highlightCard(this, "highlight-partial");
						}
						// has all copies of the card in their collection so highlight it in blue
						else
						{
							highlightCard(this, "highlight-all");
						}

					}
				}

				break;
			}

		}


	});

}

// highlights the card in the deck on the hearthpwn site
function highlightCard(card, cname)
{
	$(card).find("td.col-name").addClass(cname);
	$(card).find("td.col-cost").addClass(cname);		
}





}());