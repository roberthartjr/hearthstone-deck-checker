
var cards;						// all possible cards for the collection
var mycollection = [];			// holds the card collection

$(document).ready(function() {

	var myurl = chrome.extension.getURL("carddata.json");

	// load all possible cards for a collection
	$.ajax({
		url: myurl,
		datatype: "json",
		async: false,
		success: function(data) {
			cards = $.parseJSON(data);
			//alert(cards);


			// check if a collection already exists
			chrome.storage.local.get("hscollection", function(data) {
				
				// collection exists so load it
				if(typeof data.hscollection !== "undefined")
				{
					mycollection = data.hscollection;
				}
				// collection does not yet exist
				else
				{
					// init the collection
					for(var x=0; x<cards.length; x++)
					{
						mycollection.push(0);
					}

					chrome.storage.local.set({"hscollection": mycollection}, function() {
					});
					
				}

				// if card set is changed show the collection for that set
				$("#cardsets").change(function() {
					createCollection();
				});

				// if card class is changed show the collection for that class
				$("#cardclasses").change(function() {
					createCollection();
				});
			});	





		}
	});	



});

// creates the cards in collection based on the set and class
function createCollection()
{
	var cardset = $("#cardsets").val();					// the card set to get the cards from
	var cardclass = $("#cardclasses").val();			// the card class to get the cards from
	var newview = "";									// the collection view that will be created
	var cardview = "";									// holds the elements for each card
	var rarityview = "";								// the rarity heading
	var maxcards;										// max cards for that rarity					
	var cardcount;										// total number of cards for the view
	var cardfound = false;								// a flag that checks if there are any cards for that rarity

	// if no class is selected exit function
	if(cardclass == 0)
	{
		$("#collectionview").html("");
		return;
	}

	cardcount = 0;

	// loop through all possible rarities of cards
	for(var rarity in Rarity)
	{
		cardfound = false;
		cardview = "";
		rarityview = "<h1>" + toTitleCase(rarity) + "</h1>";

		// cycle through all the cards for the current rarity
		for(var x=0; x < cards.length; x++)
		{
			// if this cards is the current set, class and, rarity
			if(cards[x].set == cardset && cards[x].playerClass == cardclass && cards[x].rarity == Rarity[rarity])
			{
				// start creating the collection view
				cardfound = true;
				cardview += "<div style='width:600px;'><div style='float:left;'><select name='numcards[" + cardcount + "]' data-cardindex='" + x + "'>";
				cardcount++;
				
				// if the card is legendary then their can only be one of them, otherwise 2
				if(rarity == "LEGENDARY")
				{
					maxcards = 1;
				}
				else
				{
					maxcards = 2;
				}

				// create a select element that lets you choose how many of the card you have
				for(var y=0; y<= maxcards; y++)
				{
					if(mycollection[x] == y)
					{
						cardview += "<option selected>" + y + "</option>";
					}
					else
					{
						cardview += "<option>" + y + "</option>";
					}
				}


				cardview += "</select></div>";

				cardview += "<div style='float:left;'>" + cards[x].name + "</div><div style='clear:both;'></div></div><br/>";

				// $("select[name='numcards[" + x + "]']").change(function() {
				// 	console.log("numcards[" + x + "] changed");
				// });
			}
		}

		// if there is at least one card for this rarity then show it
		if(cardfound == true)
		{
			newview += rarityview + cardview;
		}
		
	}

	// add a save button
	newview += "<br/><br/><div><input type='button' id='savebutton' value='Save' /></div><div id='save_result'></div>"

	// inject the collection view
	$("#collectionview").html(newview);


	// add a listener for each card that is called when the number of copies of the card is changed
	for(var x=0; x<cardcount; x++)
	{
		$("select[name='numcards[" + x + "]']").change(function() {
			updateCard(this);
		});
	}

	// saves the collection when the save button is clicked
	$("#savebutton").click(function() {
		chrome.storage.local.set({"hscollection": mycollection}, function () {
			$("#save_result").html("Collection saved!");
		});
	});


	
}

// update the number of cards in the collection
function updateCard(sel)
{
	var cardindex = $(sel).data("cardindex");
	mycollection[cardindex] = parseInt($(sel).val());
}