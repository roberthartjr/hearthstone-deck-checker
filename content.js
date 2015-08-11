(function() {
	'use strict';

	console.log("Hello from the content script!");

	var firstHref = $("a[href^='http']").eq(0).attr("href");

	// var cards = [{name:"Druid of the Claw", num:2, index:0}];
	// cards.push({name:"Ancient of Lore", num:1, index:1});
	var mycollection = [2,1];
	//mycollection = [{num:2}, {num:1}];

	var cards;
	var myurl = chrome.extension.getURL("carddata.json");
	$.ajax({
		url: myurl,
		datatype: "json",
		async: false,
		success: function(data) {
			cards = $.parseJSON(data);
			//alert(cards);
		}
	});

	//alert(cards);

	var Rarity = {COMMON:1, RARE:2, EPIC:3, LEGENDARY:4};

	//var savedstuff = [];

	// for(var x=0; x<1000; x++)
	// {
	// 	savedstuff.push(x);
	// }

	// chrome.storage.local.set({"hscollection": savedstuff}, function() {
	// 	alert("saved");
	// } );

	//localStorage.setItem("hscollection", JSON.stringify(savedstuff));


	var savedstuff;

	chrome.storage.local.get("hscollection", function(data) {
		savedstuff = data.hscollection;
		alert(savedstuff);
	});


	//alert(savedstuff);

	// var savedstuff = JSON.parse(localStorage.getItem("hscollection"));
	// alert(savedstuff);


	//console.log(firstHref);

	//alert("joe");

	//$("div.deck-description p").hide();
	//$("div.deck-description p:first").text("Hello DUDE!");
	var jim;
	//jim = $("table.listing-cards-tabular").html();
	//alert($("table.listing-cards-tabular").html());
	//$("div.deck-description p:first").html(jim);
	//jim = $(jim).find("p").html();
	//alert(jim);
	//$("div.deck-description p:first").html(jim);

	jim = $("table.listing-cards-tabular");
	//jim = $(jim).find("tr a");
	//$("div.deck-description p:first").html(jim);


	// $(jim).find("td.col-name, td.col-cost").each(function() {

	// 	alert($(this).html());
	// 	$(this).addClass("cardsx");
	// 	var cardrow = $(this).html().trim();

	// 	//alert($(cardrow).find("a").text());
	// 	var name = $(cardrow).find("a").text().trim();
	// 	alert(name);
	// 	//alert(cardrow);

	// 	var result = cardrow.lastIndexOf("×");
	// 	//console.log(cardrow + "br/");

		
	// 	var number = cardrow.charAt(result + 2);
	// 	alert(number);
	

	//});


	// $(jim).find("tr.even, tr.odd").each(function() {

	// 	var row = $(this);

	// 	var name = $(row).find("a:not(.set-2)").text().trim();
	// 	var number = $(row).html().charAt(($(row).html().lastIndexOf("×")) + 2);
	// 	alert(name);
	// 	alert(number);
	// 	$(row).find("td.col-name").addClass("missing-primary");
	// 	$(row).find("td.col-cost").addClass("missing-primary");

	// })


$("tr").has("td.col-name a:not(.set-2)[class*='rarity']").each(function() {

	//alert($(this).html());
	//$("div.deck-description p:first").html($(this));
	

	//var row = $(this);
	var cardname = $(this).find("a").text().trim();
	//alert(cardname);
	var numcards = $(this).find("td.col-name").text().trim();
	var classes = $(this).find("[class*='rarity']").attr("class").split(' ');
	var rarity;
	numcards = numcards.charAt(numcards.length - 1);
	//alert(numcards);

	//alert(classes);

	for(var newclass in classes)
	{
		if(classes[newclass].indexOf("rarity") != -1)
		{
			//alert(classes[newclass]);

			switch(classes[newclass])
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

			//alert(rarity);
		}

	}

	var cardfound = false;
	for(var cardindex in cards)
	{
		//alert(cards[cardindex].name.toUpperCase());
		//alert(cardname.toUpperCase());
		if(cards[cardindex].name.toUpperCase() == cardname.toUpperCase())
		{
			//alert(cardname);
			var num = 0;

			// for(var x=0; x<mycollection.length; x++)
			// {
			// 	if(cards[cardindex].cardpos == mycollection[x] )
			// 	{
			// 		num++;
			// 		cardfound = true;
			// 		//alert(num);
			// 	}
			// }

			num = mycollection[cardindex];
			cardfound = true;

			if(num > 0 && num < numcards)
			{
				$(this).find("td.col-name").addClass("missing-secondary");
				$(this).find("td.col-cost").addClass("missing-secondary");
				//alert($(row).html());
			}

			break;
		}
	}

	if(cardfound == false)
	{
		$(this).find("td.col-name").addClass("missing-primary");
		$(this).find("td.col-cost").addClass("missing-primary");		
	}
	//alert(name);
	//alert(number);
	//alert(rarity);
	//$("div.deck-description p:first").html(this);
})





}());