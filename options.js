var cards;
var mycollection = [];

$(document).ready(function() {

	var myurl = chrome.extension.getURL("carddata2.json");
	$.ajax({
		url: myurl,
		datatype: "json",
		async: false,
		success: function(data) {
			cards = $.parseJSON(data);
			//alert(cards);
		}
	});	

	//chrome.storage.local.remove("hscollection");

	chrome.storage.local.get("hscollection", function(data) {
		
		console.log(data);
		console.log(chrome.runtime.lastError);

		if(typeof data.hscollection !== "undefined")
		{
			mycollection = data.hscollection;
			console.log("no error");
			//alert("savedstuff");
		}
		else
		{
			for(var x=0; x<cards.length; x++)
			{
				mycollection.push(0);
				console.log("error");

				chrome.storage.local.set({"hscollection": mycollection}, function() {
					console.log("mycollection created and saved");
				});
			}
		}


		$("#cardsets").change(function() {
			console.log($("#cardsets").val());
			$("#collectionview").html("<h1>Card collection goes here</h1>");
			createCollection();
		});

		$("#cardclasses").change(function() {
			console.log($("#cardclasses").val());
			createCollection();
		});
	});	


});

function createCollection()
{
	var cardset = $("#cardsets").val();
	var cardclass = $("#cardclasses").val();
	var tempcards;
	var newview = "";
	var maxcards;
	var cardcount = 0;

	console.log("card class: " + cardclass);

	if(cardclass == 0)
	{
		$("#collectionview").html("");
		return;
	}

	console.log("Rarity length: " + Rarity.COMMON);

	for(var rarity in Rarity)
	{
		newview += "<h1>" + toTitleCase(rarity) + "</h1>";

		for(var x=0; x < cards.length; x++)
		{
			if(cards[x].set == cardset && cards[x].playerClass == cardclass && cards[x].rarity == Rarity[rarity])
			{
				newview += "<div style='width:600px;'><div style='float:left;'><select name='numcards[" + cardcount + "]' data-cardindex='" + x + "'>";
				cardcount++;
				
				if(rarity == "LEGENDARY")
				{
					maxcards = 1;
				}
				else
				{
					maxcards = 2;
				}

				for(var y=0; y<= maxcards; y++)
				{
					if(mycollection[x] == y)
					{
						newview += "<option selected>" + y + "</option>";
					}
					else
					{
						newview += "<option>" + y + "</option>";
					}
				}


				newview += "</select></div>";

				newview += "<div style='float:left;'>" + cards[x].name + "</div><div style='clear:both;'></div></div><br/>";
			}
		}
		
	}

	$("#collectionview").html(newview);


	
}