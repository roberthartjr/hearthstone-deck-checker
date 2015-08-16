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





		}
	});	

	//chrome.storage.local.remove("hscollection");




});

function createCollection()
{
	var cardset = $("#cardsets").val();
	var cardclass = $("#cardclasses").val();
	var tempcards;
	var newview = "";
	var maxcards;
	var cardcount;

	console.log("card class: " + cardclass);

	if(cardclass == 0)
	{
		$("#collectionview").html("");
		return;
	}

	console.log("Rarity length: " + Rarity.COMMON);

	cardcount = 0;

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

				// $("select[name='numcards[" + x + "]']").change(function() {
				// 	console.log("numcards[" + x + "] changed");
				// });
			}
		}
		
	}

	newview += "<br/><br/><div><input type='button' id='savebutton' value='Save' /></div>"

	//console.log("Cardcount is " + cardcount);

	//console.log("$(\"select[name='numcards[" + 0 + "]'\").change(function() {" +  "	console.log('jimmy crack corn'); " + "});");

	//var jimcrack = "<script>$(\"select[name='numcards[" + 0 + "]'\").change(function() {" +  "	console.log('jimmy crack corn'); " + "});</script>";

	$("#collectionview").html(newview);

	// for(var ty=0; ty<5; ty++)
	// {
	// 	var jimbo = document.getElementsByName("numcards[" + ty + "]");
	// 	jimbo[0].addEventListener("change", function() {
	// 		updateCard(ty);
	// 	});

	// 	// jimbo[0].onchange = function() {
	// 	// console.log("Jimbo is a dimbo" + " " + jimbo[0].name);
	// 	// };
	// }

	// var jimbo = document.getElementsByName("numcards[]");
	// console.log(jimbo);

	//$("#collectionview").append(jimcrack);

	// var jimbo = 3;

	// for(jimbo=0; jimbo<5; jimbo++)
	// {
	// 	$("select[name='numcards[" + jimbo + "]'").change(function() {	console.log('jimmy crack corn ' + jimbo); });
	// }


	//$("select[name='numcards[0]'").change(function() {	console.log('jimmy crack corn'); });
	// for(var f=0; f<cardcount; f++)
	// {
	// 	$("select[name='numcards[" + f + "]']").change(function() {
	// 		console.log("cardcount no." + f + " changed.");
	// 	});
	// }

	// $("select[name='numcards[0]']").change(function() {
	// 	console.log("select numcards[0] changed");
	// })

	// $("select[name='numcards[1]']").change(function() {
	// 	console.log("select numcards[1] changed");
	// })	

	for(var x=0; x<cardcount; x++)
	{
		$("select[name='numcards[" + x + "]']").change(function() {
			updateCard(this);
		});
	}

	$("#savebutton").click(function() {
		chrome.storage.local.set({"hscollection": mycollection}, function () {
			console.log("saved!");
		});
	});


	
}

function updateCard(sel)
{
	console.log("Cardnum: " + sel);
	//var marty = $("select[name='numcards[" + jimlo + "]']").data("cardindex").text();
	var cardindex = $(sel).data("cardindex");
	console.log("cardindex: " + cardindex);

	mycollection[cardindex] = parseInt($(sel).val());
	console.log(mycollection);
	//mycollection[cardnum] = $("select[name='numcards[" + cardnum + "]']").val();
	//console.log("Mycollection  " + cardnum + " = " + mycollection[cardnum]);
}