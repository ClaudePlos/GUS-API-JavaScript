//
// Utworzenie obiektu XMLHttpRequest
//
var XMLHttpFactories = [
			function () { return new XMLHttpRequest() },
			function () { return new ActiveXObject("Msxml2.XMLHTTP") },
			function () { return new ActiveXObject("Msxml3.XMLHTTP") },
			function () { return new ActiveXObject("Microsoft.XMLHTTP") }
		];

function createXMLHTTPObject() {
	var xmlhttp = false;
	for (var i = 0; i < XMLHttpFactories.length; i++) {
		try {
			xmlhttp = XMLHttpFactories[i]();
		}
		catch (e) {
			continue;
		}
		break;
	}

	//xmlhttp.addEventListener("load", transferComplete, false);
	//xmlhttp.addEventListener("error", transferFailed, false);
	//xmlhttp.addEventListener("abort", transferCanceled, false);

	return xmlhttp;
}

function detectmob() {
	if (navigator.userAgent.match(/Android/i)
 || navigator.userAgent.match(/webOS/i)
 || navigator.userAgent.match(/iPhone/i)
 || navigator.userAgent.match(/iPad/i)
 || navigator.userAgent.match(/iPod/i)
 || navigator.userAgent.match(/BlackBerry/i)
 || navigator.userAgent.match(/Windows Phone/i)
	) {
	return true;
  }
 else {
	return false;
  }
}


//function transferComplete(evt) {
//alert("The transfer is complete.");
//}

//function transferFailed(evt) {
//alert("An error occurred while transferring the file.");
//}

//function transferCanceled(evt) {
//alert("The transfer has been canceled by the user.");
//}

//
// pocz�tkowe
//
var statusFiltrowania;
var sid = "";; //identyfikator sesji ///
var widocznaKarta;
var xmlHttp = createXMLHTTPObject();
var pageNum = 1;
var pageSize = 25;
var recCnt = 0;
var maxPage;
var grupaCech = '';
//var _kluczuzytkownika = 'abcde12345abcde12345'; //klucz dla testu

//VRybowska
//var idButton5;
var idButtonGrey;
//var _kluczuzytkownika='aaaa?bbbbbccccccdd|?'; //klucz dla produkcji
//var _kluczuzytkownika='xxxADMINMASTERKEYxxx'; /* REMOVE BEFORE PRODUCTION */

//
// czy przekierowa� na mobiln�
//

//var m=detectmob();
//if (m==false) { document.getElementById('divMob').style.display='block'; }  //window.location.href='https://wyszukiwarkaregontest.stat.gov.pl/appBIR/index_m.aspx';  }


//var url = "https://wyszukiwarkaregon.stat.gov.pl/wsBIR/UslugaBIRzewnPubl.svc/ajaxEndpoint/"
//var url = "https://vmzadm03/wsBIR/UslugaBIRzewnPubl.svc/ajaxEndpoint/"
var url = "https://wyszukiwarkaregontest.stat.gov.pl/wsBIR/UslugaBIRzewnPubl.svc/ajaxEndpoint/"
//var url = "https://10.10.12.5:444/wsBIR_LS/UslugaBIRzewnPubl.svc/ajaxEndpoint/"


//var htmlProgress = '<table style="width: 100%; margin-left: 150px;"><tr><td>wyszukiwanie podmiot�w w bazie...<br><img src="images/progress.gif" /></td></tr></table>'

var naglowki = {
	dzial: ["Kod PKD", "Nazwa", "Przewa�aj�ce PKD"],
	lokalne: ["Regon", "Nazwa", "Wojew�dztwo", "Powiat", "Gmina", "Miejscowo��", "Ulica", "Data skre�lenia z REGON"],
	wspol: ["Regon wsp�lnika", "Imi�", "Drugie imi�", "Nazwisko", "Firma"],
  //lista: ["Regon", "Nazwa", "Wojew�dztwo", "Powiat", "Gmina", "Miejscowo��", "Kod pocztowy", "Ulica", "Typ", "Data skre�lenia z REGON"]
	lista: ["Regon", "Typ", "Nazwa", "Wojew�dztwo", "Powiat", "Gmina", "Kod pocztowy", "Miejscowo��", "Ulica", "Data skre�lenia z REGON", "Numer_nieruchomo�ci"]
}

// This function creates a standard table with column/rows
// Parameter Information
// objArray = Anytype of object array, like JSON results
// theme (optional) = A css class to add to the table (e.g. <table class="<theme>">
// enableHeader (optional) = Controls if you want to hide/show, default is show

function wygenerujHtmlTable(objArray, tableCssClass, trAltCssClass, enableHeader) {

	if (tableCssClass === undefined) {
		tableCssClass = 'mediumTable'; //default theme
	}

	if (enableHeader === undefined) {
		enableHeader = true; //default enable headers
	}

	var array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray;
	//alert(array[0]["Regon"]);
	var str = '<table class="' + tableCssClass + '">';

	// table head
	/*if (enableHeader) {
	str += '<thead><tr>';
	for (var index in array[0]) {
	str += '<th scope="col">' + index + '</th>';
	}
	str += '</tr></thead>';
	}*/

	// Nag��wek
	str += '<thead><tr>';
	for (var index in naglowki["lista"]) {
		if (naglowki["lista"][index] != "Numer_nieruchomo�ci") {
			str += '<th scope="col">' + naglowki["lista"][index] + '</th>';
		}

	}
	str += '</tr></thead>';

	var rows = 0;
	var nowrap = '';
	var page_break = '';
	// table body //tr:nth-child(even) {background: #CCC}
	//tr:nth-child(odd) {background: #FFF}
	str += '<tbody>';
	for (var i = 0; i < array.length; i++) {
		rows += 1;
		str += (i % 2 == 0) ? '<tr class="' + trAltCssClass + '">' : '<tr>';
		for (var index in array[i]) {

			if (index != "Nazwa" && index != "Ulica") { nowrap = 'nowrap'; page_break = ''; }

			else if (index == "Nazwa") {
			    nowrap = '';
			    //zbadajNazwe(array[i][index]);
			    page_break = zbadajNazwe(array[i][index]);
			    //page_break = 'style="word-wrap: break-word; "'
			}//word-break: break-all;
			else { nowrap = ''; page_break = 'style="word-wrap: break-word;"' }

			if (index != "Regon" && index != "SilosID" && index != "pageIndex" && index != "Numer_Nieruchomosci") {

				//AB 2018.12 podmiot wykre�lony
				if (index == "DataZak" && array[i][index] != "----------")
				{ str += '<td ' + nowrap + ' ' + page_break + '>' + '<b style="color:red">wpis wykre�lony</b>' + '</td>'; }//LS15I2019 zamiast podmiot wykre�lony doda�em wpis wykre�lony i bold
				else
				{ str += '<td ' + nowrap + ' ' + page_break + '>' + array[i][index] + '</td>'; }
				//AB 2018.12 koniec
				//{ str += '<td ' + nowrap + ' ' + page_break + '>' + array[i][index] + '</td>'; }
			}
		}

	// link na ca�� lini� rl = array[i]["RegonLink"].replace(array[i]["Regon"]+'</a>','&nbsp;&nbsp;wi�cej>>&nbsp;&nbsp;</a>');

		str += '</tr>';
	}
	str += '</tbody>'
	str += '</table>';


	if (rows == 100) {
		//wyswietlKomunikatDanych("Wy�wietlono pierwsze 100 rekord�w.");
	alert("Wy�wietlono pierwsze 100 rekord�w.");
	}

	return str;
}

function zbadajNazwe(nazwa) {



    var nazwyCzesci = nazwa.trim().split(/[ -]+/);

    for (i = 0; i < nazwyCzesci.length;i++)
    {


        if (nazwyCzesci[i].length>26) {


            return 'style="word-wrap: break-word; word-break: break-all;"';
        }

    }

    return 'style="word-wrap: break-word; "';

}
//VRybowska ca�a funkcja orginal
//function wygenerujHtmlTable2(objArray, tableCssClass, trAltCssClass, jakaTabela) {
//    // set optional theme parameter
//    if (tableCssClass === undefined) {
//        tableCssClass = 'mediumTable'; //default theme
//    }

//    // If the returned data is an object do nothing, else try to parse
//    var array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray;
//    var rows;
//    var str = '<table class="' + tableCssClass + '">';

//    // Nag��wek
//    str += '<thead><tr>';
//    for (var index in naglowki[jakaTabela]) {
//        str += '<td scope="col">' + naglowki[jakaTabela][index] + '</td>';
//    }
//    str += '</tr></thead>';

//    // table body //tr:nth-child(even) {background: #CCC}
//    //tr:nth-child(odd) {background: #FFF}

//    str += '<tbody>';
//    for (var i = 0; i < array.length; i++) {

//        str += (i % 2 == 0) ? '<tr class="' + trAltCssClass + '">' : '<tr>';
//        for (var index in array[i]) {
//            //VRybowska
//            //if (array[i].indexOf("<input") != -1)

//            str += '<td>' + array[i][index] + '</td>';
//            alert('array[i][index] i = '+i+", index = "+index+", " + array[i][index])
//        }
//        str += '</tr>';
//    }
//    str += '</tbody>'
//    str += '</table>';

//    return str;
//}
//VRybowska moja modyfikacja
function wygenerujHtmlTable2(objArray, tableCssClass, trAltCssClass, jakaTabela) {
	// set optional theme parameter
	if (tableCssClass === undefined) {
		tableCssClass = 'mediumTable'; //default theme
	}

	// If the returned data is an object do nothing, else try to parse
	var array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray;
	var rows;
	var strP;
	var strPrzewaz;
	var strPozost;
	var str = '<table class="' + tableCssClass + '">';

	// Nag��wek
	str += '<thead><tr>';
	for (var index in naglowki[jakaTabela]) {
		str += '<td scope="col">' + naglowki[jakaTabela][index] + '</td>';
	}
	str += '</tr></thead>';
	str += '<tbody>';
	//alert("wygenerujHtmlTable2 ");
	if (str.indexOf("Przewa�aj�ce") == -1) {
		//alert("wygenerujHtmlTable2 1");
	// table body //tr:nth-child(even) {background: #CCC}
	//tr:nth-child(odd) {background: #FFF}

	for (var i = 0; i < array.length; i++) {
		//LS
		//str += (i % 2 == 0) ? '<tr class="' + trAltCssClass + '">' : '<tr>';
		str += (i % 2 == 0) ? '<tr>' : '<tr>';
		//LS koniec
		for (var index in array[i]) {
			str += '<td>' + array[i][index] + '</td>';
		}
		str += '</tr>';
	}
	str += '</tbody>'
	str += '</table>';
	}
	else {
		//alert("wygenerujHtmlTable2 2");
		strPrzewaz = '<tr><td><strong>DZIA�ALNO�� PRZEWA�AJ�CA WG PKD</strong></td></tr><table class="' + tableCssClass + '">';

		// Nag��wek
		strPrzewaz += '<thead><tr>';
		for (var index in naglowki[jakaTabela]) {
			strPrzewaz += '<td scope="col">' + naglowki[jakaTabela][index] + '</td>';
		}
		strPrzewaz += '</tr></thead>';
		strPrzewaz = strPrzewaz.replace("Przewa�aj�ce PKD", "");
		//string.replace(szukana_wartosc, nowy_tekst)
		strPrzewaz += '<tbody>';
		for (var i = 0; i < array.length; i++) {
			strP = "";
			//         strPrzewaz += (i % 2 == 0) ? '<tr class="' + trAltCssClass + '">' : '<tr>';
			for (var index in array[i]) {
				//VRybowska
				//alert('index: ' + index);
				strP += '<td>' + array[i][index] + '</td>'
			}

			if (strP.indexOf("DZIA�ALNO�� PRZEWA�AJ�CA") != -1) {
				strPrzewaz += (i % 2 == 0) ? '<tr>' : '<tr>';
				strPrzewaz += strP.replace("DZIA�ALNO�� PRZEWA�AJ�CA", "");
				strPrzewaz += '</tr>';
			}
			//strPrzewaz += '</tr>';
		}

		strPrzewaz += '</tbody>'
		strPrzewaz += '</table>';
		str = strPrzewaz;

		strPozost = '<tr><td><strong>Pozosta�e DZIA�ALNO�CI WG PKD</strong></td></tr><table class="' + tableCssClass + '">';
		strP = "";
		// Nag��wek
		strPozost += '<thead><tr>';
		for (var index in naglowki[jakaTabela]) {
			strPozost += '<td scope="col">' + naglowki[jakaTabela][index] + '</td>';
		}

		strPozost += '</tr></thead>';
		strPozost = strPozost.replace("Przewa�aj�ce PKD", "");
		strPozost += '<tbody>';
		for (var i = 0; i < array.length; i++) {
			strP = "";
			//strPozost += (i % 2 == 0) ? '<tr class="' + trAltCssClass + '">' : '<tr>';
			for (var index in array[i]) {
				//VRybowska
				//if (array[i].indexOf("<input") != -1)
				strP += '<td>' + array[i][index] + '</td>';
			}
			if (strP.indexOf("DZIA�ALNO�� PRZEWA�AJ�CA") == -1) {
				strPozost += (i % 2 == 0) ? '<tr>' : '<tr>';
				strPozost += strP;
				strPozost += '</tr>';
			}
		}

		strPozost += '</tbody>'
		strPozost += '</table>';
		str += strPozost;
	}

	return str;
}

function przygotujRaport(objArray, pNazwaRaportu) {

	var array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray;

	//alert(pNazwaRaportu);
	switch (pNazwaRaportu) {

		//case 'DaneRaportPrawnaPubl': //VRybowska org
		case 'DaneRaportPrawnaPubl': //VRybowska modyf//09I2019 LS kasowanie _LODZ
			//alert("1 DaneRaportPrawnaPubl_LODZ");
			pokazWybranyRaport('tblRaportJPrawna');
			wypelnijPolaRaportu(array);
			break;

		case 'DaneRaportDzialalnosciPrawnejPubl':
			//alert("2 DaneRaportDzialalnosciPrawnejPubl");
			wypelnijListeRaportu(array, 'praw_dzial', 'dzial');
			break;

			//case 'DaneRaportLokalnePrawnejPubl':  //VRybowska org
	    case 'DaneRaportLokalnePrawnejPubl'://09I2019 LS kasowanie _LODZ
			//alert("3 DaneRaportLokalnePrawnejPubl_LODZ");
			wypelnijListeRaportu(array, 'praw_lok', 'lokalne');
			break;

			//case 'DaneRaportWspolnicyPrawnejPubl':
	    case 'DaneRaportWspolnicyPrawnejPubl'://09I2019 LS kasowanie _LODZ
			//alert("4 DaneRaportWspolnicyPrawnejPubl");
			wypelnijListeRaportu(array, 'praw_wspol', 'wspol');
			break;
			//case 'DaneRaportFizycznaPubl':  //VRybowska org
	    case 'DaneRaportFizycznaPubl':  //VRybowska modyf//09I2019 LS kasowanie _LODZ
			//alert("5 DaneRaportFizycznaPubl_LODZ");
			pokazWybranyRaport('tblRaportJFizyczna');
			wypelnijPolaRaportu(array);
			break;

		case 'DaneRaportDzialalnosciFizycznejPubl':
			//alert("6 DaneRaportDzialalnosciFizycznejPubl");
			wypelnijListeRaportu(array, 'fiz_dzial', 'dzial');
			break;

		case 'DaneRaportLokalneFizycznejPubl':
			//alert("7 DaneRaportLokalneFizycznejPubl");
			wypelnijListeRaportu(array, 'fiz_lok', 'lokalne');

			break;

			//case 'DaneRaportLokalnaPrawnejPubl':  //VRybowska
	    case 'DaneRaportLokalnaPrawnejPubl'://09I2019 LS kasowanie _LODZ
			//alert("8 DaneRaportLokalnaPrawnejPubl_LODZ");
			pokazWybranyRaport('tblRaportJLokalnaPrawnej');
			wypelnijPolaRaportu(array);
			break;

			//case 'DaneRaportDzialalnosciLokalnejFizycznejPubl':
	    case 'DaneRaportDzialalnosciLokalnejFizycznejPubl'://09I2019 LS kasowanie _LODZ
			//alert("9 DaneRaportDzialalnosciLokalnejFizycznejPubl");
			wypelnijListeRaportu(array, 'lokfiz_dzial', 'dzial');
			//alert('DaneRaportDzialalnosciLokalnejFizycznejPubl');
			break;

			//case 'DaneRaportLokalnaFizycznejPubl':
	    case 'DaneRaportLokalnaFizycznejPubl'://09I2019 LS kasowanie _LODZ
			//alert("10 DaneRaportLokalnaFizycznejPubl");
			pokazWybranyRaport('tblRaportJLokalnaFizycznej');
			wypelnijPolaRaportu(array);
			break;

			//case 'DaneRaportDzialalnosciLokalnejPrawnejPubl':  //VRybowska
	    case 'DaneRaportDzialalnosciLokalnejPrawnejPubl'://09I2019 LS kasowanie _LODZ
			//alert("11 DaneRaportDzialalnosciLokalnejPrawnejPubl_LODZ");
			wypelnijListeRaportu(array, 'lokpraw_dzial', 'dzial');
			break;

		default:
			///alert("default:"+pNazwaRaportu);
			break
	}
	//VRybowska szukanie id input class="button5"
	var inputValue2;
	//alert("przed addEventListener");
	var buttongrey = document.getElementsByClassName('button-gray');
	for (var i = 0; i < buttongrey.length; i++) {
		inputValue2 = document.getElementById(buttongrey[i].id);
		inputValue2.addEventListener('click', szukajIdButtonGrey);
}
	//alert("po addEventListener");

}


function szukajIdButtonGrey(e) {
	idButtonGrey = e.target.id;

}

function wypelnijListeRaportu(objArray, target, jakaTabela) {
	try {

		//document.getElementById(target).innerHTML = wygenerujHtmlTable2(objArray, "tabelaZbiorcza", "tabelaZbiorczaAltRow", jakaTabela);  VRybowska orgina�

		//VRybowska
		var valueButtonGrey = document.getElementById(idButtonGrey).value;
		if (valueButtonGrey === "zwi� list� <<") {
			//document.getElementById(idButtonGrey).value = "rozwi� list� >>";
			//document.getElementById(target).innerHTML = "";
		}
		if (valueButtonGrey === "rozwi� list� >>") {
			//document.getElementById(idButtonGrey).value = "zwi� list� <<";
		//document.getElementById(target).innerHTML = wygenerujHtmlTable2(objArray, "tabelaZbiorcza", "tabelaZbiorczaAltRow", jakaTabela);
	}
		//end VRybowska

	}
	catch (ex) {
		alert(ex);
	}

}

var regon14;
var nazwaRaportu;
var silosID = 0;
var niepodjetoDzialalnosci = 0;

function wypelnijPolaRaportu(pArray) {

	//document.getElementById("praw_wspolTable").style.display = 'none';

	//alert('wypelnijPolaRaportu');
	var typ = "";
	var silos = "";
	silosID = 0;

	for (var i = 0; i < pArray.length; i++) {

		for (var index in pArray[i]) {
			var wartosc = pArray[i][index];
			//alert("wartosc: " + wartosc);
			switch (index) {
				case "nazwaRaportu":
					{
						nazwaRaportu = wartosc;
						if (wartosc == "daneRaportPrawnaPubl" || wartosc == "daneRaportPrawnaPubl") { //VRybowska modyf//09I2019 LS kasowanie _LODZ
							typ = "praw";
							//document.getElementById("nazwaTabeliRaport").value = "tblRaportJPrawna";
							//} else if (wartosc == "daneRaportFizycznaPubl") {      // VRybowska orginal
						} else if (wartosc == "daneRaportFizycznaPubl" || wartosc == "daneRaportFizycznaPubl") {  //VRybowska modyf//09I2019 LS kasowanie _LODZ
							typ = "fiz";
							//document.getElementById("nazwaTabeliRaport").value = "tblRaportJFizyczna";
						} else if (wartosc == "daneRaportLokalnaFizycznejPubl" || wartosc == "daneRaportLokalnaFizycznejPubl") {//09I2019 LS kasowanie _LODZ
							typ = "lokfiz";
							//document.getElementById("nazwaTabeliRaport").value = "tblRaportJLokalnaFizycznej";
						} else if (wartosc == "daneRaportLokalnaPrawnejPubl" || wartosc == "daneRaportLokalnaPrawnejPubl") {//09I2019 LS kasowanie _LODZ
							typ = "lokpraw";
							//document.getElementById("nazwaTabeliRaport").value = "tblRaportJLokalnaPrawnej";
						}
						break;
					}
				case typ + "_regon9":
					{
						if (typ === "fiz")
							regon14 = wartosc + "00000";
						break;
					}
				case typ + "_regon14":
					{
						regon14 = wartosc;
						break;
					}
				case typ + "_nazwaSilosu":
					{
						silos = wartosc;
						break;
					}
				case typ + "_silos_ID":
					{
						silosID = wartosc;
						//AB zmodyfikowane 10.10.2018
						//document.getElementById("lfSilos1").style.display = 'none';
						//document.getElementById("lfSilos2").style.display = 'none';
						//document.getElementById("lfSilos3").style.display = 'none';
						//document.getElementById("lfSilos"+silosID.toString()).style.display = 'block';
						switch (silosID) {
							case "1": { document.getElementById("lfHEADER").innerHTML = "JEDNOSTKA LOKALNA OSOBY FIZYCZNEJ PROWADZ�CEJ DZIA�ALNO�� GOSPODARCZ� PODLEGAJ�C� WPISOWI DO CEIDG"; break; }
							case "2": { document.getElementById("lfHEADER").innerHTML = "JEDNOSTKA LOKALNA OSOBY FIZYCZNEJ PROWADZ�CEJ DZIA�ALNO�� ROLNICZ�"; break; }
							case "3": { document.getElementById("lfHEADER").innerHTML = "JEDNOSTKA LOKALNA OSOBY FIZYCZNEJ PROWADZ�CEJ DZIA�ALNO�� GOSPODARCZ� NIEPODLEGAJ�C� WPISOWI DO CEIDG"; break; }
							default: { document.getElementById("lfHEADER").innerHTML = "SILOS_ID = " + silosID.toLocaleString(); break; }
						}
						//AB end
						break;
					}

				case typ + "_dzialalnosci":
					{
						if (wartosc == "0") {
							document.getElementById(typ + "_dzialTable").style.display = 'none';
						} else {
							document.getElementById(typ + "_dzialTable").style.display = 'block';
						}
						break;
					}
				case typ + "_wspolnicy":
					{
						 if (wartosc == "0") {
							document.getElementById(typ + "_wspolTable").style.display = 'none';
						} else {
							document.getElementById(typ + "_wspolTable").style.display = 'block';
						}
						break;
					}
				case typ + "_jednostekLokalnych":
					{
						if (wartosc == "0") {
							document.getElementById(typ + "_lokTable").style.display = 'none';
						} else {
							document.getElementById(typ + "_lokTable").style.display = 'block';
						}
						break;
					}
					//AB 2018.12
				case "praw_nazwaPodstawowejFormyPrawnej":
					{
					    document.getElementById("pHEADER").innerHTML = wartosc.substring(wartosc.indexOf('-') + 2);
					    if (document.getElementById("pHEADER").innerHTML.trim() == '') {
					        document.getElementById("pHEADER").innerHTML = "   ";
					    }
						break;
					}
				case "lokpraw_nazwaPodstawowejFormyPrawnej":
					{
						document.getElementById("lpHEADER").innerHTML = wartosc;
						break;
					}
					//AB 2018.12 koniec 230197941
			}


			if (index == 'fizC_niepodjetoDzialalnosci' && wartosc == 'True') {
			wyswietlKomunikatDanych('Podmiot nie podj�� prezentowanej ni�ej dzia�alno�ci.');
		}
			if (index == 'fiz_niepodjetoDzialalnosci') {
		//alert(wartosc);
			wyswietlKomunikatDanych('Podmiot nie podj�� prezentowanej ni�ej dzia�alno�ci.');
		}
			//orygina�
			if (document.getElementById(index) != null) {
			    document.getElementById(index).innerHTML = wartosc;
			}
		    //AB2 zmodyfikowane 10.10.2018
            //LS 15I2019
			//if (document.getElementById(index) != null) {
			//	if (index.indexOf("_dataSkresleniazRegon") != -1 && wartosc.toString().length != 0) {
			//		document.getElementById(index).innerHTML = "podmiot wykre�lony";
			//		document.getElementById("lpHEADER").innerHTML += " - podmiot wykre�lony z rejestru REGON";
			//	} else {
			//	document.getElementById(index).innerHTML = wartosc;
			//	}
		    //}
            //LS 15I2019-koniec
			//praw_nazwaSzczegolnejFormyPrawnej
			//AB2 koniec
		}
	//13.05.2016
	//if (document.getElementById('fiz_dataSkresleniazRegonDzial').innerHTML != '' &&
		//    document.getElementById('fiz_dataZakonczeniaDzialalnosci').innerHTML == '')    {
	//    wyswietlKomunikatDanych('Podmiot nie podj�� dzia�alno�ci.');
	//}

	}

	//document.getElementById("btnZapiszRaport").onclick = function() { danePobierzJakoPlik(regon14, nazwaRaportu, 'xls', silosID); };

	if (typ == "fiz" || typ == "praw") wyczyscRaportListaLokalnych(typ);
	if (typ == "fiz" || typ == "lokfiz") zmienWidocznoscSilosu(silos, typ);

	//daty zmian - tytu�
	if (typ == "fiz") { document.getElementById("fiz_DatyZmianWRejestrzeTytul").innerHTML = '<b>DATY ZWI�ZANE Z DZIA�ALNO�CI� PODMIOTU</b>'; }
	if (typ == "praw") { document.getElementById("praw_DatyZmianWRejestrzeTytul").innerHTMLt = '<b>DATY ZWI�ZANE Z DZIA�ALNO�CI� PODMIOTU</b>'; }
	if (typ == "lokfiz") { document.getElementById("lokfiz_DatyZmianWRejestrzeTytul").innerHTML = '<b>DATY ZWI�ZANE Z DZIA�ALNO�CI� JEDNOSTKI LOKALNEJ</b>'; }
	if (typ == "lokpraw") { document.getElementById("lokpraw_DatyZmianWRejestrzeTytul").innerHTML = '<b>DATY ZWI�ZANE Z DZIA�ALNO�CI� JEDNOSTKI LOKALNEJ</b>'; }


	wyczyscRaportDzialalnosci(typ);
	if (typ == "fiz") { wyczyscRaportListaLokalnych(typ); }
	if (typ == "praw") { wyczyscRaportListaLokalnych(typ); }
	wyczyscRaportWspolnicy();

	//to poni�ej jakie� dziwne
	//if (typ == "praw" && document.getElementById("praw_linkwspol") === "undefined") {
	//    document.getElementById("praw_linkwspolTytul").style.display = 'none';
	//} else {
	//    document.getElementById("praw_linkwspolTytul").style.display = 'block';
	//}

}

function wyczyscRaportListaLokalnych(typ) {
	var jednostkiTable = document.getElementById(typ + '_lok');

	while (jednostkiTable.firstChild) {
		jednostkiTable.removeChild(jednostkiTable.firstChild);
	}
}

function wyczyscRaportDzialalnosci(typ) {
	var dzialTable = document.getElementById(typ + '_dzial');

	while (dzialTable.firstChild) {
		dzialTable.removeChild(dzialTable.firstChild);
	}
}

function wyczyscRaportWspolnicy() {

	var wsTable = document.getElementById("praw_wspol");

	while (wsTable.firstChild) {
		wsTable.removeChild(wsTable.firstChild);
	}
}


function zmienWidocznoscSilosu(silosID, typJednostki) {
	switch (silosID) {
		case "1":
		case "CEIDG":
			{
				document.getElementById(typJednostki + "_dataWpisuDoRejestruEwidencji").style.display = 'block';
				document.getElementById(typJednostki + "_dataWpisuDoRejestruEwidencjiTytul").style.display = 'block';
				document.getElementById(typJednostki + "_numerwRejestrzeEwidencji").style.display = 'block';
				document.getElementById(typJednostki + "_numerwRejestrzeEwidencjiTytul").style.display = 'block';
				document.getElementById(typJednostki + "_nazwaOrganuRejestrowego").style.display = 'block';
				document.getElementById(typJednostki + "_nazwaOrganuRejestrowegoTytul").style.display = 'block';
				document.getElementById(typJednostki + "_nazwaRodzajuRejestru").style.display = 'block';
				document.getElementById(typJednostki + "_nazwaRodzajuRejestruTytul").style.display = 'block';

				if (typJednostki == "fiz") {
					document.getElementById(typJednostki + "_dataSkresleniaZRejestruEwidencji").style.display = 'block';
					document.getElementById(typJednostki + "_dataSkresleniaZRejestruEwidencjiTytul").style.display = 'block';

				}
				document.getElementById("tdSilosTytul").innerHTML = "<strong>DZIA�ALNO�� GOSPODARCZA PODLEGAJ�CA WPISOWI DO CEIDG</strong>";
		break;
			}
		case "2":
		case "Rolnicza":
			{
				document.getElementById(typJednostki + "_dataWpisuDoRejestruEwidencji").style.display = 'none';
				document.getElementById(typJednostki + "_dataWpisuDoRejestruEwidencjiTytul").style.display = 'none';
				document.getElementById(typJednostki + "_numerwRejestrzeEwidencji").style.display = 'none';
				document.getElementById(typJednostki + "_numerwRejestrzeEwidencjiTytul").style.display = 'none';
				document.getElementById(typJednostki + "_nazwaOrganuRejestrowego").style.display = 'none';
				document.getElementById(typJednostki + "_nazwaOrganuRejestrowegoTytul").style.display = 'none';
				document.getElementById(typJednostki + "_nazwaRodzajuRejestru").style.display = 'none';
				document.getElementById(typJednostki + "_nazwaRodzajuRejestruTytul").style.display = 'none';

				if (typJednostki == "fiz") {
					document.getElementById(typJednostki + "_dataSkresleniaZRejestruEwidencji").style.display = 'none';
					document.getElementById(typJednostki + "_dataSkresleniaZRejestruEwidencjiTytul").style.display = 'none';
				}
				document.getElementById("tdSilosTytul").innerHTML = "<strong>DZIA�ALNO�� ROLNICZA</strong>";
				break;
			}
		case "3":
		case "Inna":
			{
				document.getElementById(typJednostki + "_dataWpisuDoRejestruEwidencji").style.display = 'block';
				document.getElementById(typJednostki + "_dataWpisuDoRejestruEwidencjiTytul").style.display = 'block';
				document.getElementById(typJednostki + "_numerwRejestrzeEwidencji").style.display = 'block';
				document.getElementById(typJednostki + "_numerwRejestrzeEwidencjiTytul").style.display = 'block';
				document.getElementById(typJednostki + "_nazwaOrganuRejestrowego").style.display = 'block';
				document.getElementById(typJednostki + "_nazwaOrganuRejestrowegoTytul").style.display = 'block';
				document.getElementById(typJednostki + "_nazwaRodzajuRejestru").style.display = 'block';
				document.getElementById(typJednostki + "_nazwaRodzajuRejestruTytul").style.display = 'block';

				if (typJednostki == "fiz") {
					document.getElementById(typJednostki + "_dataSkresleniaZRejestruEwidencji").style.display = 'none';
					document.getElementById(typJednostki + "_dataSkresleniaZRejestruEwidencjiTytul").style.display = 'none';

				}
				document.getElementById("tdSilosTytul").innerHTML = "<strong>DZIA�ALNO�� GOSPODARCZA, KT�RA NIE JEST WPISANA DO CEIDG</strong>";
			}
			//JP 08-11-14
		default:
			{
				document.getElementById(typJednostki + "_dataWpisuDoRejestruEwidencji").style.display = 'none';
				document.getElementById(typJednostki + "_dataWpisuDoRejestruEwidencjiTytul").style.display = 'none';
				document.getElementById(typJednostki + "_numerwRejestrzeEwidencji").style.display = 'none';
				document.getElementById(typJednostki + "_numerwRejestrzeEwidencjiTytul").style.display = 'none';
				document.getElementById(typJednostki + "_nazwaOrganuRejestrowego").style.display = 'none';
				document.getElementById(typJednostki + "_nazwaOrganuRejestrowegoTytul").style.display = 'none';
				document.getElementById(typJednostki + "_nazwaRodzajuRejestru").style.display = 'none';
				document.getElementById(typJednostki + "_nazwaRodzajuRejestruTytul").style.display = 'none';

				if (typJednostki == "fiz") {
					document.getElementById(typJednostki + "_dataSkresleniaZRejestruEwidencji").style.display = 'none';
					document.getElementById(typJednostki + "_dataSkresleniaZRejestruEwidencjiTytul").style.display = 'none';
				}
				break;
			}
			//koniec JP 08-11-14
	}
}



//
// Wype�nienie listy rozwijalnej
//
function populateSelectlist(objArray, select, defaultItem) {

	var array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray;

	var objSel = document.getElementById(select);

	objSel.options.length = 0; // clear out existing items


	if (defaultItem) {

		var opt = document.createElement('option');

		opt.text = '--- rozwi� ---';
		opt.value = '-1';

		try {
			objSel.add(opt, null); // standards compliant; doesn't work in IE
		}
		catch (ex) {
			objSel.add(opt); // IE only
		}
	}

	var keys = new Array();

	for (var index in array[0]) {
		keys[keys.length] = index;
	}


	for (var i = 0; i < array.length; i++) {

		var opt = document.createElement('option');

		opt.text = array[i][keys[1]];
		opt.value = array[i][keys[0]];

		try {
			objSel.add(opt, null); // standards compliant; doesn't work in IE
		}
		catch (ex) {
			objSel.add(opt); // IE only
		}

	//if (opt.text=='Warszawa')
	//{ objSel.selectedIndex=(i+1); }
	}
}



//
//  SendRequest
//
function sendRequest(metoda, parametry, callback) {

	//            if (sid == "") {
	//                if (metoda != "zaloguj" && metoda != "pobierzCaptcha") {
	//                    if (document.getElementById('txtCaptcha').value == "") {
	//                        alert('Prosz� przepisa� kod z obrazka.');
	//                        return;
	//                    }
	//                    else {
	//                        //zaloguj();
	//                        return;
	//                    }
	//                }
	//            }
	//            else
	//            {
	progressOn();
	//}

	var xmlHttp = createXMLHTTPObject();
	xmlHttp.open("POST", url + metoda, true);
	//var xmlHttp = createCORSRequest("POST", url + metoda);
	xmlHttp.setRequestHeader("sid", sid);
	xmlHttp.setRequestHeader("Content-type", "application/json");
	console.log("KS sendRequest: " + parametry + " " + url + " " + metoda)

	xmlHttp.onerror = function() {
	    console.log("onerror")
	  };

	xmlHttp.onload = function() {
		console.log("onload")
		var text = xmlHttp.responseText;
		var obj = JSON.parse(text);
		console.log(obj);
	}

	xmlHttp.send(parametry);
	xmlHttp.onreadystatechange = function () {

		if (xmlHttp.readyState == 4) { // && xmlHttp.status == 200) {

			callback(xmlHttp.responseText);


		   // document.getElementById('txtResponse2').value += xmlHttp.responseText + '\n';

			progressOff();
		}
	}
}


//
//  SendRequestSync
//
function sendRequestSync(metoda, parametry, callback) {

	//            if (sid == "") {
	//                if (metoda != "zaloguj" && metoda != "pobierzCaptcha") {
	//                    if (document.getElementById('txtCaptcha').value == "") {
	//                        alert('Prosz� przepisa� kod z obrazka.');
	//                        return;
	//                    }
	//                    else {
	//                        //zaloguj();
	//                        return;
	//                    }
	//                }
	//            }
	//            else
	//            {
	progressOn();
	//}

	var xmlHttp = createXMLHTTPObject();
	xmlHttp.open("POST", url + metoda, false);
	xmlHttp.setRequestHeader("sid", sid);
	xmlHttp.setRequestHeader("Content-type", "application/json");
	xmlHttp.send(parametry);
	//xmlHttp.onreadystatechange = function() {

		  if (xmlHttp.readyState == 4) {
			   callback(xmlHttp.responseText);
			   progressOff();
		  }
	  else {
		   alert('sendRequestSync-b��d');
	  }

	//}


}




//
// Przygotuj parametry wyszukiwania
// dla odpowiedniej grupy cech
//
function przygotujParametry(pGrupaCech) {

	var p = {
		"pParametryWyszukiwania": {
			"NazwaPodmiotu": null,
			"NumerNieruchomosci": null,//LS
			"AdsSymbolGminy": null,
			"AdsSymbolMiejscowosci": null,
			"AdsSymbolPowiatu": null,
			"AdsSymbolUlicy": null,
			"AdsSymbolWojewodztwa": null,
			"Dzialalnosci": null,
			"PrzewazajacePKD": false,
			"Regon": null,
			"Krs": null,
			"Nip": null,
			"Regony9zn": null,
			"Regony14zn": null,
			"Krsy": null,
			"Nipy": null,
			"NumerwRejestrzeLubEwidencji": null,
			"OrganRejestrowy": null,
			"RodzajRejestru": null,
			"FormaPrawna": null
		},
		"jestWojPowGmnMiej": true
	};

	switch (pGrupaCech) {

		case "identyfikator":
			{
				if (document.getElementById("txtRegon").value != "") {
					p.pParametryWyszukiwania.Regon = document.getElementById("txtRegon").value;
				}
				if (document.getElementById("txtKrs").value != "") {
					p.pParametryWyszukiwania.Krs = document.getElementById("txtKrs").value;
				}
				if (document.getElementById("txtNip").value != "") {
					p.pParametryWyszukiwania.Nip = document.getElementById("txtNip").value;
				}

				break;
			}

		case "grupaIdentyfikatorow":
			{

				//var arrId = new Array();

				if (document.getElementById("txtIdentyfikatory").value != "") {

					//arrId = document.getElementById("txtIdentyfikatory").value.split;

					if (document.getElementById("rdbIdentyfikatorRegon9zn").checked == true) {
						p.pParametryWyszukiwania.Regony9zn = document.getElementById("txtIdentyfikatory").value;
					}

					if (document.getElementById("rdbIdentyfikatorRegon14zn").checked == true) {
						p.pParametryWyszukiwania.Regony14zn = document.getElementById("txtIdentyfikatory").value;
					}

					if (document.getElementById("rdbIdentyfikatorKrs").checked == true) {
						p.pParametryWyszukiwania.Krsy = document.getElementById("txtIdentyfikatory").value;
					}

					if (document.getElementById("rdbIdentyfikatorNip").checked == true) {
						p.pParametryWyszukiwania.Nipy = document.getElementById("txtIdentyfikatory").value;
					}
				}

				break;
			}

		case "adres":
			{

				if (document.getElementById("selWojewodztwo").value != "-1") {
					p.pParametryWyszukiwania.AdsSymbolWojewodztwa = document.getElementById("selWojewodztwo").value;
				}
				if (document.getElementById("selPowiat").value != "-1") {
					p.pParametryWyszukiwania.AdsSymbolPowiatu = document.getElementById("selPowiat").value;
				}
				if (document.getElementById("selGmina").value != "-1") {
					p.pParametryWyszukiwania.AdsSymbolGminy = document.getElementById("selGmina").value;
				}
				if (document.getElementById("selMiejscowosc").value != "-1") {
					p.pParametryWyszukiwania.AdsSymbolMiejscowosci = document.getElementById("selMiejscowosc").value;
				}
				if (document.getElementById("selUlica").value != "-1") {
					p.pParametryWyszukiwania.AdsSymbolUlicy = document.getElementById("selUlica").value;
				}
				if (document.getElementById("txtFragmentNazwy").value != "-1") {
					p.pParametryWyszukiwania.NazwaPodmiotu = document.getElementById("txtFragmentNazwy").value;
				}
				if (document.getElementById("txtNumerNieruchomosci").value != "-1") {//LS
					p.pParametryWyszukiwania.NumerNieruchomosci = document.getElementById("txtNumerNieruchomosci").value;//LS
				}//LS
				if (p.pParametryWyszukiwania.AdsSymbolGminy == null || p.pParametryWyszukiwania.AdsSymbolPowiatu == null || p.pParametryWyszukiwania.AdsSymbolWojewodztwa == null || p.pParametryWyszukiwania.AdsSymbolMiejscowosci == null) {
					p.jestWojPowGmnMiej = false;
				}

				break;
			}
		case "nazwa":
			{

				//                if (document.getElementById("txtFragmentNazwy").value != "") {
				//                    p.pParametryWyszukiwania.NazwaPodmiotu = document.getElementById("txtFragmentNazwy").value;
				//                }

				break;
			}
		case "pkd":
			{

				//if (document.getElementById("txtPKD").value != "") {
				//    p.pParametryWyszukiwania.Dzialalnosci = document.getElementById("txtPKD").value;
				//    p.pParametryWyszukiwania.PrzewazajacePKD = document.getElementById("chbPrzewazajacePKD").checked;
				//}

				break;

			}
	}

	return p;
}


//
//  Wyczy�� poprzednie kryteria wyszukiwania
//
function wyczyscWyszukiwanie(pGrupaCech) {

	pageNum = 0;

	switch (pGrupaCech) {

		case "identyfikator":
			{
				wyczyscListe("p");

				document.getElementById("selWojewodztwo").value = "-1";
				ukryjFiltryMenu();
				//document.getElementById("txtFragmentNazwy").value = "";
				document.getElementById("txtIdentyfikatory").value = "";
				document.getElementById("rdbIdentyfikatorRegon9zn").checked = false;
				document.getElementById("rdbIdentyfikatorRegon14zn").checked = false;
				document.getElementById("rdbIdentyfikatorKrs").checked = false;
				document.getElementById("rdbIdentyfikatorNip").checked = false;

				break;

			}
		case "grupaIdentyfikatorow":
			{
				wyczyscListe("p");
				document.getElementById("selWojewodztwo").value = "-1";
				//document.getElementById("txtFragmentNazwy").value = ""
				document.getElementById("txtRegon").value = "";
				document.getElementById("txtKrs").value = "";
				document.getElementById("txtNip").value = ""
				//document.getElementById("txtPKD").value = "";
				//document.getElementById("chbPrzewazajacePKD").checked = false;

				break;
			}
		case "adres":
			{
				//    ukryjFiltryMenu();
				//document.getElementById("txtFragmentNazwy").value = ""
				document.getElementById("txtIdentyfikatory").value = "";
				document.getElementById("rdbIdentyfikatorRegon9zn").checked = false;
				document.getElementById("rdbIdentyfikatorRegon14zn").checked = false;
				document.getElementById("rdbIdentyfikatorKrs").checked = false;
				document.getElementById("rdbIdentyfikatorNip").checked = false;
				document.getElementById("txtRegon").value = "";
				document.getElementById("txtKrs").value = "";
				document.getElementById("txtNip").value = ""
				//document.getElementById("txtPKD").value = "";
				//document.getElementById("chbPrzewazajacePKD").checked = false;

				break;
			}
		case "pkd":
			{
				wyczyscListe("p");
				document.getElementById("selWojewodztwo").value = "-1";
				//document.getElementById("txtFragmentNazwy").value = ""
				document.getElementById("txtIdentyfikatory").value = "";
				document.getElementById("rdbIdentyfikatorRegon9zn").checked = false;
				document.getElementById("rdbIdentyfikatorRegon14zn").checked = false;
				document.getElementById("rdbIdentyfikatorKrs").checked = false;
				document.getElementById("rdbIdentyfikatorNip").checked = false;
				document.getElementById("txtRegon").value = "";
				document.getElementById("txtKrs").value = "";
				document.getElementById("txtNip").value = "";

				break;

			}
		case "nazwa":
			{
				wyczyscListe("p");
				document.getElementById("selWojewodztwo").value = "-1";
				document.getElementById("txtIdentyfikatory").value = "";
				document.getElementById("rdbIdentyfikatorRegon9zn").checked = false;
				document.getElementById("rdbIdentyfikatorRegon14zn").checked = false;
				document.getElementById("rdbIdentyfikatorKrs").checked = false;
				document.getElementById("rdbIdentyfikatorNip").checked = false;
				document.getElementById("txtRegon").value = "";
				document.getElementById("txtKrs").value = "";
				document.getElementById("txtNip").value = "";
				//document.getElementById("txtPKD").value = "";
				//document.getElementById("chbPrzewazajacePKD").checked = false;

				break;
			}
	}
}

function wyczyscRaport() {
	document.getElementById("praw_lok").value = "-1"
}


//
//  Szukaj podmiot�w w bazie DANE SZUKAJ
//
function daneSzukaj(pGrupaCech) {

	grupaCech = pGrupaCech;
	//alert(document.getElementById("txtRegon").value.length);
	//alert('daneSzukaj: ' + pGrupaCech);
	switch (pGrupaCech) {

	case "identyfikator":
		{
			//ukryjRaporty();
			//wyczyscWyszukiwanie(pGrupaCech);
			wyczyscKomunikatDanych;

			/*-------- REGON --------*/
				var param01 = document.getElementById("txtRegon").value;
				param01 = param01.trim();
				document.getElementById("txtRegon").value = param01;
				if (document.getElementById("txtRegon").value.length > 0 &&
					document.getElementById("txtRegon").value.length != 9 &&
					document.getElementById("txtRegon").value.length != 14) {
			//alert("Numer REGON ma d�ugo�� 9 lub 14 znak�w (dla jedn.lokalnej).");
			wyswietlKomunikatDanych("Numer REGON ma d�ugo�� 9 lub 14 znak�w (dla jedn.lokalnej).");
				document.getElementById('divListaJednostek').style.display = 'none';
				ukryjTopMenu();
			break;
			}
				if (document.getElementById("txtRegon").value.length > 0 &&
				isRegonValid(param01) == false) {
				wyswietlKomunikatDanych("Wprowadzony numer REGON jest nieprawid�owy.");
				document.getElementById('divListaJednostek').style.display = 'none'
				ukryjTopMenu();
				break;
			}
			/*-------- NIP --------*/
				var param02 = document.getElementById("txtNip").value;
			param02 = (param02.replace(/-/g, '')).trim();
			document.getElementById("txtNip").value = param02;
				if (document.getElementById("txtNip").value.length > 0 &&
				document.getElementById("txtNip").value.length != 10) {
			//alert("Numer NIP ma d�ugo�� 10 znak�w.");
			wyswietlKomunikatDanych("Numer NIP ma d�ugo�� 10 znak�w.");
				document.getElementById('divListaJednostek').style.display = 'none'
				ukryjTopMenu();
			break;
			}
				if (document.getElementById("txtNip").value.length > 0 &&
				isNipValid(param02) == false) {
				wyswietlKomunikatDanych("Wprowadzony numer NIP jest nieprawid�owy.");
				document.getElementById('divListaJednostek').style.display = 'none'
				ukryjTopMenu();
				break;
			}
			/*-------- KRS --------*/
				if (document.getElementById("txtKrs").value.length > 0 &&
				document.getElementById("txtKrs").value.length != 10) {
			//alert("Numer KRS ma d�ugo�� 10 znak�w.");
			wyswietlKomunikatDanych("Numer KRS ma d�ugo�� 10 znak�w.");
				document.getElementById('divListaJednostek').style.display = 'none'
				ukryjTopMenu();
			break;
			}

			var p = przygotujParametry(pGrupaCech);




			sendRequest("daneSzukaj", JSON.stringify(p), daneSzukajComplete);

			break;
		}


		case "grupaIdentyfikatorow":
		{
			var p = przygotujParametry(pGrupaCech);

			wyczyscWyszukiwanie(pGrupaCech);
			wyczyscKomunikatDanych;
			ukryjRaporty();
			//ukryjTopMenu();

			sendRequest("daneSzukaj", JSON.stringify(p), daneSzukajComplete);
		}

		case "adres":
		{
			var p = przygotujParametry(pGrupaCech);

			wyczyscWyszukiwanie(pGrupaCech);
			wyczyscKomunikatDanych;
			ukryjRaporty();
			//ukryjTopMenu();

			//if (document.getElementById("txtFragmentNazwy").value != '' && recCnt > 0) {
			//	danePobierzPoNazwie();
			//}
			//else {
				if (p.jestWojPowGmnMiej) {
					sendRequest("daneSzukaj", JSON.stringify(p), daneSzukajComplete);
				} else {
					wyswietlKomunikatDanych("B��dnie wybrane miejsce prowadzenia dzia�alno�ci. Prosz� wybra� wojew�dztwo, powiat, gmin� i miejscowo��.");
					document.getElementById('divListaJednostek').style.display = 'none'
					ukryjTopMenu();
				}
			//}

		}
	}
}

function daneSzukajComplete(result) {
  console.log("daneSzukajComplete:"+result);
	//alert("result"+result);
	statusFiltrowania = false;
	try {
		if (result.length < 15) {
			console.log("dupa");
			sendRequest("DaneKomunikat", "", daneKomunikatComplete);
			//interfejsCaptchaON();
			//pobierzCaptcha();
			//ukryjTopMenu();
			//ukryjKarty();
			//ukryjFiltryMenu();
			return;
		}


		if (result.indexOf('"enc') != -1) {

			result = bd(result);
			result = result.replace('"enc', '"');
			result = '{"d":"' + addslashes(result) + '"}';
	}

		var jsObj = eval('(' + result + ')');

		//JP 07-03-16
		var myJSONObject = JSON.parse(poprawZnakiSpecjalne(jsObj.d));
		console.log('myJSONObject ' + myJSONObject);
		danePobierzPelnyRaport(473164548, "pNazwaRaportu", 123)
		//alert(myJSONObject);
		//interfejsCaptchaOFF();
		document.getElementById("divListaJednostek").innerHTML = wygenerujHtmlTable(myJSONObject, "tabelaZbiorczaListaJednostek", "tabelaZbiorczaListaJednostekAltRow", true);


		recCnt = 0;
		if (grupaCech == 'adres') {
		//pokazTopMenu();
			danePobierzrecCnt(); //to warunkowo w zale�no�ci od wariantu wyszukiwania
		}
		//pokazWybranaKarte('divListaJednostek');
		//kryjTopMenu();
		//alert('recCnt: ' +recCnt);
		if (recCnt == 0) {
		//	document.getElementById("spanTopMenuPaging").style.display = 'none';
		}

		if (recCnt > 0) {
			if (recCnt < 100) {
				//document.getElementById("spanTopMenuPaging").style.display = 'none';
				pokazFiltryMenu();
				pokazTopMenu(); //12.wiecz�r
				// if (document.getElementById("txtFragmentNazwy").value != ''
				// 	//LS
				// 	|| document.getElementById("txtNumerNieruchomosci").value != '') {
				// 	//LS koniec
				// 	danePobierzPoNazwie();
				// 	statusFiltrowania = true;
				// }
			}
			if (recCnt > 100 && recCnt < 6000) {
				//alert('recCnt > 100 && recCnt < 6000');
				//document.getElementById("spanTopMenuPaging").style.display = 'block';
				//document.getElementById("spanPageIndex").innerHTML = pageNum + '/' + maxPage;
				pokazTopMenu();
				pokazFiltryMenu();
				// if (document.getElementById("txtFragmentNazwy").value != ''
				// 	//LS
				// 	|| document.getElementById("txtNumerNieruchomosci").value != '') {
				// 	//LS koniec
				// 	danePobierzPoNazwie();
				// 	statusFiltrowania = true;
				// }
			}
			if (recCnt > 6000) {
				wyswietlKomunikatDanych("Zbyt wiele wynik�w wyszukiwania z miejscowo�ci, prosz� wybra� ulic�.");
				ukryjFiltryMenu();
			}
		}
	}

	catch (ex) {
		alert('Wystapil blad' + ex); //'daneSzukajComplete ' + ex + '        ,     ' + result );
		//document.getElementById("divListaJednostek").innerHTML = result;

	}
}




function daneKomunikatComplete(result) {
  console.log('daneKomunikatComplete: ' + result)
	wyswietlKomunikatDanych(result);

	try {

		var jsObj = eval('(' + result + ')');
     console.log('daneKomunikatComplete:jsObj: ' + result)
		//document.getElementById("divInfoKomunikat").innerHTML = jsObj.d;
		//ukryjTopMenu();
		widocznaKarta = "";
		//ukryjKarty();
		//alert(document.getElementById("divInfoKomunikat").innerHTML);
	}

	catch (ex) {
		alert('daneKomunikatComplete ' + ex);
	}
}


//
//  Wyswietl raport o jednostce DANE POBIERZ
//
var _nazwaRaportu = '';

function danePobierzPelnyRaport(pRegon, pNazwaRaportu, pSilosID) {
 console.log("danePobierzPelnyRaport");
    _nazwaRaportu = pNazwaRaportu ; //VRybowska modyf//09I2019 LS kasowanie _LODZ
	var p = '{"pRegon":"' + pRegon + '","pNazwaRaportu":"' + pNazwaRaportu + '", "pSilosID":"' + pSilosID + '"}';
	sendRequest("DanePobierzPelnyRaport", p, danePobierzPelnyRaportComplete);


}

function danePobierzPelnyRaportComplete(result) {
  console.log('danePobierzPelnyRaportComplete ' + result);
	try {

		if (result.length < 15) {
			sendRequest("DaneKomunikat", "", daneKomunikatComplete);
			pobierzCaptcha();
			zwinCaleMenu();
			ukryjRaporty();
			//interfejsCaptchaON();
			return;
		}

		if (result.indexOf('"enc') != -1) {

			result = bd(result);
			result = result.replace('"enc', '"');
			result = '{"d":"' + addslashes(result) + '"}';
	}


		var jsObj = eval('(' + result + ')');

		if (jsObj.d === "") {

			sendRequest("daneKomunikat", "", daneKomunikatComplete);

		} else {
			//JP 07-03-16
			var myJSONObject = JSON.parse(poprawZnakiSpecjalne(jsObj.d));

			//interfejsCaptchaOFF();
			wyczyscKomunikatDanych();
			//VRybowska poczatek
			//alert("tutaj:" + _nazwaRaportu);
			var _nazwaRaportuVRybowska = _nazwaRaportu.toUpperCase();
			if (_nazwaRaportuVRybowska.indexOf("DaneRaportDzialalnosciFizycznejPUBL".toUpperCase()) != -1) {
				_nazwaRaportu = _nazwaRaportu.replace("_LODZ", "");
			}
			if (_nazwaRaportuVRybowska.indexOf("DaneRaportLokalneFizycznejPubl".toUpperCase()) != -1) {
				_nazwaRaportu = _nazwaRaportu.replace("_LODZ", "");
			}
			if (_nazwaRaportuVRybowska.indexOf("DaneRaportDzialalnosciPrawnejPubl".toUpperCase()) != -1) {
				_nazwaRaportu = _nazwaRaportu.replace("_LODZ", "");
			}
			//VRybowska koniec
			przygotujRaport(myJSONObject, _nazwaRaportu);
			pokazWybranaKarte('divRaportOJednostce');


		//13.05.2016 MP
		/*
		if (silosID==1 &&
			document.getElementById('fiz_dataSkresleniazRegonDzial').innerHTML != '' &&
					document.getElementById('fiz_dataZakonczeniaDzialalnosci').innerHTML == '')    {
			wyswietlKomunikatDanych('Podmiot nie podj�� dzia�alno�ci.');
		}
		if (silosID==1 &&
			document.getElementById('lokfiz_dataSkresleniazRegon').innerHTML != '' &&
					document.getElementById('lokfiz_dataZakonczeniaDzialalnosci').innerHTML == '')    {
				wyswietlKomunikatDanych('Podmiot nie podj�� dzia�alno�ci.');
			}
		*/
		}
	}

	catch (ex) {

		alert('danePobierzPelnyRaportComplete ' + ex + ',');

	}

}



//
//  Pobierz Next Page
//
function danePobierzNextPage() {

	if (pageNum == maxPage) {
	return;
	}
	pageNum = pageNum + 1;
	var ulID = document.getElementById("selUlica").value;
	if (ulID == '-1') { ulID = '' }

	var idw = 'W' + sid + document.getElementById("selWojewodztwo").value +
		  document.getElementById("selPowiat").value +
		  document.getElementById("selGmina").value +
		  document.getElementById("selMiejscowosc").value +
				  ulID;

	var p = '{"pNazwaParametru":"GetDane:' + idw + ':' + pageNum + '"}';

	sendRequest("GetValue", p, danePobierzNextPageComplete)
}

function danePobierzNextPageComplete(result) {

	try {

		if (result.length < 15) {
			sendRequest("DaneKomunikat", "", daneKomunikatComplete);
			//interfejsCaptchaON();
			pobierzCaptcha();
			ukryjTopMenu();
		ukryjKarty();
			return;
		}

		var jsObj = eval('(' + result + ')');

		//JP 07-03-16
		var myJSONObject = JSON.parse(poprawZnakiSpecjalne(jsObj.d));

		interfejsCaptchaOFF();
		document.getElementById("divListaJednostek").innerHTML = wygenerujHtmlTable(myJSONObject, "tabelaZbiorczaListaJednostek", "tabelaZbiorczaListaJednostekAltRow", true);
		document.getElementById("spanPageIndex").innerHTML = pageNum + '/' + maxPage;
		pokazWybranaKarte('divListaJednostek');
		pokazTopMenu();
	}

	catch (ex) {
		alert('daneSzukajComplete ' + ex);
		//document.getElementById("divListaJednostek").innerHTML = result;

	}
}


//
//  Pobierz PrevPage
//
function danePobierzPrevPage() {

	if (pageNum == 1) {
	return;
	}
	pageNum = pageNum - 1;

	var ulID = document.getElementById("selUlica").value;
	if (ulID == '-1') { ulID = '' }

	var idw = 'W' + sid + document.getElementById("selWojewodztwo").value +
		  document.getElementById("selPowiat").value +
		  document.getElementById("selGmina").value +
		  document.getElementById("selMiejscowosc").value +
				  ulID;

	var p = '{"pNazwaParametru":"GetDane:' + idw + ':' + pageNum + '"}';

	sendRequest("GetValue", p, danePobierzPrevPageComplete)
}

function danePobierzPrevPageComplete(result) {

	try {

		if (result.length < 15) {
			sendRequest("DaneKomunikat", "", daneKomunikatComplete);
			//interfejsCaptchaON();
			pobierzCaptcha();
			ukryjTopMenu();
			ukryjKarty();
			return;
		}

		var jsObj = eval('(' + result + ')');

		//JP 07-03-16
		var myJSONObject = JSON.parse(poprawZnakiSpecjalne(jsObj.d));

		interfejsCaptchaOFF();
		document.getElementById("divListaJednostek").innerHTML = wygenerujHtmlTable(myJSONObject, "tabelaZbiorczaListaJednostek", "tabelaZbiorczaListaJednostekAltRow", true);
		document.getElementById("spanPageIndex").innerHTML = pageNum + '/' + maxPage;
		pokazWybranaKarte('divListaJednostek');
		pokazTopMenu();
	}

	catch (ex) {
		alert('daneSzukajComplete ' + ex);
		//document.getElementById("divListaJednostek").innerHTML = result;

	}
}



//
//  Pobierz recCnt
//
function danePobierzrecCnt() {

	pageNum = pageNum + 1;
	var ulID = document.getElementById("selUlica").value;
	if (ulID == '-1') { ulID = '' }

	var idw = 'W' + sid + document.getElementById("selWojewodztwo").value +
		  document.getElementById("selPowiat").value +
		  document.getElementById("selGmina").value +
		  document.getElementById("selMiejscowosc").value +
				  ulID;

	var p = '{"pNazwaParametru":"GetDaneCnt:' + idw + '"}';

	sendRequestSync("GetValue", p, danePobierzrecCntComplete)
}

function danePobierzrecCntComplete(result) {

	try {

		obj = JSON.parse(result);
		recCnt = obj.d;
		maxPage = Math.floor(recCnt / pageSize) + 1;
		document.getElementById("spanRecCnt").innerHTML = recCnt;
		document.getElementById("spanPageIndex").innerHTML = pageNum + '/' + maxPage;
	}

	catch (ex) {
		//alert('danePobierzrecCntComplete ' + ex);
	}
}

//
//  Dane szukaj po nazwie
//
function danePobierzPoNazwie() {

	pageNum = pageNum + 1;
	var ulID = document.getElementById("selUlica").value;
	if (ulID == '-1') { ulID = '' }

	var idw = 'W' + sid + document.getElementById("selWojewodztwo").value +
		  document.getElementById("selPowiat").value +
		  document.getElementById("selGmina").value +
		  document.getElementById("selMiejscowosc").value +
				  ulID;

	var p = '{"pNazwaParametru":"LODZ_GetDaneAddFilter:' + idw + ':Nazwa:' + document.getElementById("txtFragmentNazwy").value + ':Numer_nieruchomosci:' + document.getElementById("txtNumerNieruchomosci").value + '"}';

	//alert(p);
	sendRequestSync("GetValue", p, danePobierzPoNazwieComplete)
}

function danePobierzPoNazwieComplete(result) {

	try {

		var jsObj = eval('(' + result + ')');
		var myJSONObject = JSON.parse(jsObj.d);

		interfejsCaptchaOFF();
		document.getElementById("divListaJednostek").innerHTML = wygenerujHtmlTable(myJSONObject, "tabelaZbiorczaListaJednostek", "tabelaZbiorczaListaJednostekAltRow", true);
		document.getElementById("spanPageIndex").innerHTML = pageNum + '/' + maxPage;
		pokazWybranaKarte('divListaJednostek');

		document.getElementById("spanTopMenuPaging").style.display = 'none';
		//ukryjTopMenu();
	}

	catch (ex) {
		alert('danePobierzrecCntComplete ' + ex);
		document.getElementById("divListaJednostek").innerHTML = result;

	}
}

function wyczyscFiltrPoNazwie() {

	document.getElementById("txtFragmentNazwy").value = '';
}

//LS
function wyczyscFiltrPoNumerNieruchomosci() {

	document.getElementById("txtNumerNieruchomosci").value = '';
}
//LS koniec

//
//  Pobierz stan danych
//
function pobierzStanDanych() {

	var p = '{"pNazwaParametru":"StanDanych"}';

	sendRequest("GetValue", p, pobierzStanDanychComplete);
}




//
//  Dane pobierz jako plik
//
function danePobierzJakoPlik(pRegon, pNazwaRaportu, pTypPliku, pSilosID) {

	_nazwaRaportu = pNazwaRaportu;

	var p = '{"pRegon":"' + pRegon + '","pNazwaRaportu":"' + pNazwaRaportu + '","pTypPliku":"' + pTypPliku + '", "pSilosID":"' + pSilosID + '"}';

	sendRequest("DanePobierzPelnyRaportJakoPlik", p, danePobierzJakoPlikComplete);

}

function danePobierzJakoPlikComplete(result) {
	var jsObj = eval('(' + result + ')');

	var daneBase64 = jsObj.d;
	var uri;

	var selFormat = document.getElementById("selFormat");
	var wybranyFormat = selFormat.options[selFormat.selectedIndex].value;

	if (wybranyFormat === "xls") {
		var template = '<html xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><head><meta charset="utf-8" /><style id=\"Classeur1_16681_Styles\">.xl4566 {color: red;}</style><!--[if gte mso 9]>' +
				  '<xsl:template name="styles"><style> col { mso-width-source:auto; } </style>' + '<xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>{worksheet}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--></head><body><h4>{caption}</h4><table>{table}</table></body></html>',
			base64 = function (s) { return window.btoa(unescape(encodeURIComponent(s))) },
			format = function (s, c) { return s.replace(/{(\w+)}/g, function (m, p) { return c[p]; }) }

		uri = 'data:application/vnd.ms-excel;base64,';

		var ctx = {
			worksheet: 'raport' || 'Worksheet',
			table: window.atob(daneBase64),
			caption: ""
		}

		if (navigator.mimeTypes && navigator.mimeTypes.length === 0) {
			zapiszPlikIE(format(template, ctx), 'regonRaport.xls', "vnd.ms-excel");
		}
		else if (navigator.mimeTypes.length > 0) {
			var a = document.createElement('a');
			a.href = uri + base64(format(template, ctx));
			a.target = '_blank';
			a.id = 'dataURLdownloader';
			a.download = 'regonRaport.xls';
			document.body.appendChild(a);
			a.click();
		}
	}
	//else if (wybranyFormat === "pdf") {
	//    uri = 'data:application/pdf;base64,';
	//    window.open(uri +  daneBase64, "", "width=600,height=600,resizable=1");
	//}

	function zapiszPlikIE(co, nazwaPliku, typ) {
		var dlg = false;
		with (document) {
			ir = createElement('iframe');
			ir.id = 'ifr';
			ir.location = 'about.blank';
			ir.style.display = 'none';
			body.appendChild(ir);
			with (getElementById('ifr').contentWindow.document) {
				open("text/" + typ, "replace");
				charset = "utf-8";
				write(co);
				close();
				dlg = execCommand('SaveAs', false, nazwaPliku);
			}
			body.removeChild(ir);
		}
		return dlg;
	}

	//vnd.openxmlformats - officedocument.spreadsheetml.sheet
}



//
//  Pobierz Captcha
//
function pobierzCaptcha() {

	sendRequest("PobierzCaptcha", "", pobierzCaptchaComplete);
}

function pobierzCaptchaComplete(result) {


	//wyczyscKomunikatDanych();

	if (result == "-1") {
	zaloguj();
	return;
	}

	if (result.length < 15) {

		interfejsCaptchaOFF();
	progressOff();
		if (document.getElementById("selWojewodztwo").options.length < 2)
		{ window.setTimeout("getWojewodztwa();", 2000); }
	}
	else {

		interfejsCaptchaON();
		wyswietlKomunikatDanych("<p style='color:Red'>W celu skorzystania z funkcjonalno�ci wyszukiwarki<br> prosimy w pierwszym kroku wpisa� kod z obrazka.</p>");

		obj = JSON.parse(result);

		var imgsrc = "data:image/bmp;base64,".concat(obj.d);
		document.getElementById('imgCaptch').src = imgsrc;

	}
}


//
//  Sprawd� wpisane Captcha
//

function sprawdzCaptcha() {

	wyczyscKomunikatDanych;

	if (sid != "") {

		var p = '{"pCaptcha":"' + 'document.getElementById("txtCaptcha").value' + '"}';

		sendRequest("SprawdzCaptcha", p, sprawdzCaptchaComplete);
	}
}

function sprawdzCaptchaComplete(result) {

	obj = JSON.parse(result);

	var booCaptchaOK = obj.d;

	if (booCaptchaOK) {

		interfejsCaptchaOFF();
		wyczyscKomunikatDanych();
		pobierzStanDanych();
		if (document.getElementById("selWojewodztwo").options.length < 2)
		{ window.setTimeout("getWojewodztwa();", 2000); }
	}
	else {
		wyswietlKomunikatDanych('Kod zabezpieczaj�cy przepisany nieprawid�owo.');
	}
}

//
//  Zaloguj i ustaw sid
//
function zaloguj() {

	document.getElementById('txtRegon').onkeypress = function (event) { onEnter(event); } //MS 2018-02-13
	document.getElementById('txtNip').onkeypress = function (event) { onEnter(event); } //MS 2018-02-13
	document.getElementById('txtKrs').onkeypress = function (event) { onEnter(event); } //MS 2018-02-13

	//var _kluczuzytkownika='aaaa?bbbbbccccccdd|?'; //klucz dla produkcji
	//var _kluczuzytkownika='xxxADMINMASTERKEYxxx'; /* REMOVE BEFORE PRODUCTION */
	// testowy: abcde12345abcde12345
	var p = '{"pKluczUzytkownika":"abcde12345abcde12345"}'; /// KLUCZ !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! Uzytkownika s

	sendRequest("Zaloguj", p, zalogujComplete);
}

function zalogujComplete(result) {
  console.log("zalogujComplete: " + result);
	if (result.length != 28) {
		wyswietlKomunikatDanych("<p style='color:Red; font-size:13px'>Usluga chwilowo niedostepna. Przepraszamy za utrudnienia.<br> W przypadku powtarzania sie problemu prosimy o zgloszenie na adres <a href='mailto:regon_bir@stat.gov.pl'><strong>regon_bir@stat.gov.pl</strong></a></p>");
	return;
	}

	obj = JSON.parse(result);
	sid = obj.d;


	if (sid == "") {

		//alert("B��d klucza u�ytkownika. Nie mo�na rozpocz�� sesji.");

	} else {

		//window.setTimeout("pobierzCaptcha();", 500);

		interfejsCaptchaOFF();
		wyczyscKomunikatDanych();
		pobierzStanDanych();
		// if (document.getElementById("selWojewodztwo").options.length < 2)
		// { window.setTimeout("getWojewodztwa();", 2000); }

		document.getElementById('txtRegon').focus(); //MS 2018-02-13
	}
}



//
//  Pobierz stan danych
//
function pobierzStanDanych() {

	var p = '{"pNazwaParametru":"StanDanych"}';

	sendRequest("GetValue", p, pobierzStanDanychComplete);
}

function pobierzStanDanychComplete(result) {

	obj = JSON.parse(result);

	stanDanych = obj.d;

	//alert(stanDanych);

	document.getElementById("divStanDanych").innerHTML = "stan danych na dzie�: " + stanDanych;
	document.getElementById("divStanDanych2").innerHTML = "stan danych na dzie�: " + stanDanych;
}



//
//  Pobierz wojew�dztwa
//
function getWojewodztwa() {

	sendRequest("GetWojewodztwa", "", getWojewodztwaComplete);
}

function getWojewodztwaComplete(result) {

	var jsObj = eval('(' + result + ')');

	var myJSONObject = JSON.parse(jsObj.d);

	populateSelectlist(myJSONObject, 'selWojewodztwo', true);
}


//
//  Pobierz powiaty
//
function getPowiaty(kodWojewodztwa) {

	wyczyscListe("p");

	if (kodWojewodztwa != '-1') {

		var p = '{"pKodWojewodztwa":"' + kodWojewodztwa + '"}';

		sendRequest("GetPowiaty", p, getPowiatyComplete);
	}
}

function getPowiatyComplete(result) {

	var jsObj = eval('(' + result + ')');

	var myJSONObject = JSON.parse(jsObj.d);

	populateSelectlist(myJSONObject, 'selPowiat', true);
}


//
//  Pobierz gminy
//
function getGminy(kodPowiatu, kodWojewodztwa) {

	wyczyscListe("g");

	if (kodPowiatu != '-1') {

		var p = '{"pKodPowiatu":"' + kodPowiatu + '","pKodWojewodztwa":"' + kodWojewodztwa + '"}';

		sendRequest("GetGminy", p, getGminyComplete);
	}

}

function getGminyComplete(result) {

	var jsObj = eval('(' + result + ')');

	var myJSONObject = JSON.parse(jsObj.d);

	populateSelectlist(myJSONObject, 'selGmina', true);
}


//
//  Pobierz miejscowo�ci
//
function getMiejscowosci(kodGminy, kodPowiatu, kodWojewodztwa) {

	wyczyscListe("m");

	if (kodGminy != '-1') {

		var p = '{"pKodGminy":"' + kodGminy + '","pKodPowiatu":"' + kodPowiatu + '","pKodWojewodztwa":"' + kodWojewodztwa + '"}';

		sendRequest("GetMiejscowosci", p, getMiejscowosciComplete);
	}
}

function getMiejscowosciComplete(result) {

	var jsObj = eval('(' + result + ')');

	var myJSONObject = JSON.parse(jsObj.d);

	populateSelectlist(myJSONObject, 'selMiejscowosc', true);

	//je�li jest tylko jedna to automatycznie zaznacz
	if (document.getElementById('selMiejscowosc').length == 2) {
		document.getElementById('selMiejscowosc').selectedIndex = 1;
	getUlice(document.getElementById('selMiejscowosc').value);
	}

	//getUlice('0988796');

}


//
//  Pobierz ulice
//
function getUlice(kodMiejscowosci) {

	wyczyscListe("u");

	if (kodMiejscowosci != '-1') {

		var p = '{"pKodMiejscowosci":"' + kodMiejscowosci + '"}';  // '","pKodPowiatu":"' + kodPowiatu + '","pKodWojewodztwa":"' + kodWojewodztwa + '"}';

		sendRequest("GetUlice", p, getUliceComplete);
	}
}

function getUliceComplete(result) {

	var jsObj = eval('(' + result + ')');

	var myJSONObject = JSON.parse(jsObj.d);

	populateSelectlist(myJSONObject, 'selUlica', true);
}



// dodatkowe funkcje dla UI

//
// Pokaz wybran� zak�adke
//
function pokazWybranaKarte(nazwaKarty) {

	if (nazwaKarty == "") {
		nazwaKarty = widocznaKarta;

	}

	//wyczyscKomunikatDanych();
	document.getElementById('divRaportOJednostce').style.display = 'none';
	document.getElementById('divListaJednostek').style.display = 'none';
	document.getElementById(nazwaKarty).style.display = 'block';

	//document.getElementById('spanTopMenuPaging').style.display = 'none';
	//document.getElementById('spanTopMenuLista').style.display = 'none';
	//document.getElementById('spanTopMenuDrukiZap').style.display = 'none';

	if (nazwaKarty == 'divRaportOJednostce') {
		//document.getElementById('spanTopMenuDrukiZap').style.display = 'block';
		document.getElementById('spanTopMenuLista').style.display = 'block';
		document.getElementById('spanTopMenuPaging').style.display = 'none';
	} else {
		wyczyscKomunikatDanych();
		//document.getElementById('spanTopMenuDrukiZap').style.display = 'none';
		if (recCnt > 1) { document.getElementById('spanTopMenuLista').style.display = 'none'; }http://localhost:56036/wsBIR/App_Code/classes/
			if (recCnt > 100) { document.getElementById('spanTopMenuPaging').style.display = 'block'; }
	}
	//alert(statusFiltrowania);
	if (statusFiltrowania == true) {
		document.getElementById('spanTopMenuPaging').style.display = 'none';


	}
}

function ukryjKarty() {

	document.getElementById('divRaportOJednostce').style.display = 'none';
	document.getElementById('divListaJednostek').style.display = 'none';
}

function ukryjTopMenu() {
	document.getElementById('spanTopMenu').style.display = 'none';
	//document.getElementById('spanTopMenuDrukiZap').style.display = 'none';
}
function pokazTopMenu() {
	document.getElementById('spanTopMenu').style.display = 'block';
	//document.getElementById('spanTopMenuDrukiZap').style.display = 'block';
}


function ukryjFiltryMenu() {
	wyczyscFiltrPoNazwie();
	wyczyscFiltrPoNumerNieruchomosci();
	document.getElementById('txtFragmentNazwy').disabled = 'true';
	document.getElementById('btnWyczyscFragmentNazwy').disabled = 'true';
	document.getElementById('txtNumerNieruchomosci').disabled = 'true';
	document.getElementById('btnWyczyscNumerNieruchomosci').disabled = 'true';
}
function pokazFiltryMenu() {
	//alert('pokazFiltryMenu');
	document.getElementById('txtFragmentNazwy').disabled = '';
	document.getElementById('btnWyczyscFragmentNazwy').disabled = '';
	document.getElementById('txtNumerNieruchomosci').disabled = '';
	document.getElementById('btnWyczyscNumerNieruchomosci').disabled = '';
	//alert(document.getElementById('btnWyczyscFragmentNazwy').disabled);
}

//
// Pokaz wybrany raport
//
function pokazWybranyRaport(nazwaRaportu) {
	document.getElementById('tblRaportJFizyczna').style.display = 'none';
	document.getElementById('tblRaportJPrawna').style.display = 'none';
	document.getElementById('tblRaportJLokalnaFizycznej').style.display = 'none';
	document.getElementById('tblRaportJLokalnaPrawnej').style.display = 'none';
	document.getElementById(nazwaRaportu).style.display = 'block';
}

function ukryjRaporty() {
	document.getElementById('tblRaportJFizyczna').style.display = 'none';
	document.getElementById('tblRaportJPrawna').style.display = 'none';
	document.getElementById('tblRaportJLokalnaFizycznej').style.display = 'none';
	document.getElementById('tblRaportJLokalnaPrawnej').style.display = 'none';
}

//
// WyswietlKomunikat
//
function wyswietlKomunikatDanych(tresc) {
	console.log("Tresc: " + tresc);
	//ukryjTopMenu();
	//document.getElementById("divInfoKomunikat").style.display = 'block'; 	    //13.05.2016 MP
	//document.getElementById("divInfoKomunikat").innerHTML = tresc;
}

function wyczyscKomunikatDanych() {
	//alert('wyczyscKomunikatDanych');
	//document.getElementById("divInfoKomunikat").style.display = 'none'; 	    //13.05.2016 MP
	//document.getElementById("divInfoKomunikat").innerHTML = '';
}



//
// Progressbar ON
//
function progressOn(metoda) {
	//alert('progressOn' + metoda);
	//document.getElementById("divProgressIcon").innerHTML = 'prosz� czeka�...<br><img src="images/progress.gif" />';  //htmlProgress;
	//document.getElementById("divProgressIcon").style.display = 'block';

}


//
// Progressbar OFF
//
function progressOff() {
	//document.getElementById("divProgressIcon").innerHTML = "";
	//document.getElementById("divProgressIcon").style.display = 'none';
	//alert("wmetodzie progressOff");
}


//
// Wyczy�� listy poni�ej, gdy u�ytkownik zmieni wyb�r
//
function wyczyscListe(pLista) {

	if (pLista == "w") {
		document.getElementById("selWojewodztwo").options.length = 0;
		document.getElementById("selPowiat").options.length = 0;
		document.getElementById("selGmina").options.length = 0;
		document.getElementById("selMiejscowosc").options.length = 0;
		document.getElementById("selUlica").options.length = 0;
	}

	if (pLista == "p") {
		document.getElementById("selPowiat").options.length = 0;
		document.getElementById("selGmina").options.length = 0;
		document.getElementById("selMiejscowosc").options.length = 0;
		document.getElementById("selUlica").options.length = 0;
	}

	if (pLista == "g") {
		document.getElementById("selGmina").options.length = 0;
		document.getElementById("selMiejscowosc").options.length = 0;
		document.getElementById("selUlica").options.length = 0;
	}

	if (pLista == "m") {
		document.getElementById("selMiejscowosc").options.length = 0;
		document.getElementById("selUlica").options.length = 0;
	}

	if (pLista == "u") {
		document.getElementById("selUlica").options.length = 0;
	}
}


//
// Policz identyfikatory i okre�l separator
//
function policzIdentyfikatory(oID) {

	var identyfikatory = document.getElementById("txtIdentyfikatory").value;
	var znak = '';

	for (var i = 0; i < identyfikatory.length; i++) {

		if (znak == '/n' || znak == ';' || znak == '\t') {

		}
	}

}

//
// Wstaw pierwszy element listy
//
function wstawPierwszyElementDoListy(oID) {

	var objSel = document.getElementById(oID);

	var opt = document.createElement('option');

	opt.text = '--- rozwi� ---';
	opt.value = '-1';

	try {
		objSel.add(opt, null); // standards compliant; doesn't work in IE
	}
	catch (ex) {
		objSel.add(opt); // IE only
	}
}


function zmienFormatZapisu() {
	var selFormat = document.getElementById("selFormat");
	var wybranyFormat = selFormat.options[selFormat.selectedIndex].value;

	document.getElementById("btnZapiszRaport").onclick = function () { danePobierzJakoPlik(regon14, nazwaRaportu, wybranyFormat); };
}


function zwinMenu(menu) {

	if (document.getElementById('tblWyszukiwaniePoAdresie').style.display == '')
	{ document.getElementById('tblWyszukiwaniePoAdresie').style.display = 'none'; }

	if (document.getElementById('tblWyszukiwaniePoIdentyfikatorach').style.display == '')
	{ document.getElementById('tblWyszukiwaniePoIdentyfikatorach').style.display = 'none'; }

	if (menu == 'tblWyszukiwaniePoAdresie') {
		if (document.getElementById('tblWyszukiwaniePoAdresie').style.display == 'none') {
			document.getElementById('tblWyszukiwaniePoAdresie').style.display = 'block';
			document.getElementById('tblWyszukiwaniePoIdentyfikatorach').style.display = 'none';
			document.getElementById('tblWyszukiwaniePoIdentyfikatorze').style.display = 'none';
			ukryjFiltryMenu();// 28XI2018 LS
		}
		else {
			document.getElementById('tblWyszukiwaniePoAdresie').style.display = 'none';
		}
	}

	if (menu == 'tblWyszukiwaniePoIdentyfikatorach') {
		if (document.getElementById('tblWyszukiwaniePoIdentyfikatorach').style.display == 'none') {
			document.getElementById('tblWyszukiwaniePoIdentyfikatorach').style.display = 'block';
			document.getElementById('tblWyszukiwaniePoAdresie').style.display = 'none';
			document.getElementById('tblWyszukiwaniePoIdentyfikatorze').style.display = 'none';
		}
		else {
			document.getElementById('tblWyszukiwaniePoIdentyfikatorach').style.display = 'none';
		}
	}

	if (menu == 'tblWyszukiwaniePoIdentyfikatorze') {
		if (document.getElementById('tblWyszukiwaniePoIdentyfikatorze').style.display == 'none') {
			document.getElementById('tblWyszukiwaniePoIdentyfikatorze').style.display = 'block';
			document.getElementById('tblWyszukiwaniePoIdentyfikatorach').style.display = 'none';
			document.getElementById('tblWyszukiwaniePoAdresie').style.display = 'none';
		}
		else {
			document.getElementById('tblWyszukiwaniePoIdentyfikatorze').style.display = 'none';
		}
	}


}

function zwinCaleMenu() {
	var items = document.getElementsByName('elementMenu');
	for (var i = 0; i < items.length; i++) {

		items[i].checked = false;

	}
}

//var widocznaKarta;

function interfejsCaptchaON() {

	ukryjTopMenu();

	if (document.getElementById('divRaportOJednostce').style.display == 'block' ||
		document.getElementById('divRaportOJednostce').style.display == '')
		{ widocznaKarta = 'divRaportOJednostce'; }
		if (document.getElementById('divListaJednostek').style.display == 'block' ||
			document.getElementById('divListaJednostek').style.display == '')
		{ widocznaKarta = 'divListaJednostek'; }

	//document.getElementById('imgCaptch').src = "images/dobraCapcha.gif";
	//document.getElementById("tblCaptcha").style.display = "block";
	//document.getElementById('imgCaptch').textContent = "V";
	//document.getElementById("divInfoLogowanie").innerHTML = "";
	//document.getElementById("txtCaptcha").value = "";

	//document.getElementById("divInfoLogowanie").innerHTML = "";
	//document.getElementById("txtCaptcha").value = "";
	//document.getElementById("elementWyszukajNazwa").setAttribute("disabled", "disabled");
	//document.getElementById("elementWyszukajAdres").setAttribute("disabled", "disabled");
	//document.getElementById("elementWyszukajIdent").setAttribute("disabled", "disabled");
	//document.getElementById("elementWyszukajNazwaLabel").setAttribute("class", "disabled");
	//document.getElementById("elementWyszukajAdresLabel").setAttribute("class", "disabled");
	//document.getElementById("elementWyszukajIdentLabel").setAttribute("class", "disabled");
	document.getElementById("txtRegon").disabled = true;
	document.getElementById("txtNip").disabled = true;
	document.getElementById("txtKrs").disabled = true;
	document.getElementById("btnSzukaj").disabled = true;
	zwinCaleMenu();
}

function interfejsCaptchaOFF() {
 //alert('w metodzie interfejsCaptchaOFF');

	//pokazTopMenu();
	if (widocznaKarta != "") {
	//document.getElementById(widocznaKarta).style.display = 'block';
	}

	//document.getElementById('imgCaptch').src = "images/dobraCapcha.gif";
	//document.getElementById("tblCaptcha").style.display = "none";
	//document.getElementById('imgCaptch').textContent = "V";
	//document.getElementById("divInfoLogowanie").innerHTML = "";
	//document.getElementById("txtCaptcha").value = "";
	//document.getElementById("divInfoLogowanie").innerHTML = "";
	//document.getElementById("txtCaptcha").value = "";
	//document.getElementById("elementWyszukajNazwa").removeAttribute("disabled");
	//document.getElementById("elementWyszukajAdres").removeAttribute("disabled");
	//document.getElementById("elementWyszukajIdent").removeAttribute("disabled");
	//document.getElementById("elementWyszukajNazwaLabel").removeAttribute("class");
	//document.getElementById("elementWyszukajAdresLabel").removeAttribute("class");
	//document.getElementById("elementWyszukajIdentLabel").removeAttribute("class");
	document.getElementById("txtRegon").disabled = false;
	document.getElementById("txtNip").disabled = false;
	document.getElementById("txtKrs").disabled = false;
	document.getElementById("btnSzukaj").disabled = false;

}

//JP 2016-03-07
function poprawZnakiSpecjalne(json) {

//MS UWAGA - funkcjonalnosc funkcji poprawZnakiSpecjalne() powina byc prawdpodobnie w MyXMLJSON.vb

	var znakiSpecjalne = json.match(/[\\][^\"\/]/g);

	if (znakiSpecjalne != null) {
		for (var i = 0; i < znakiSpecjalne.length; i++) {
			json = json.replace(znakiSpecjalne[i], "\\" + znakiSpecjalne[i]);
		}
	}
	json = json.replace(/\t+/g, " "); //MS 29-05-2017 usuwanie TAB (z nazwy)
	// below is a VERY naughty work-around...! MS 2018-07-17
	json = json.replace(/ \\\\\\\\\\ /g, " \\\\\\\\\\\\ ");

	json = json.replace(/a\\\\\\\\ /g, "a\\\\ ");
	json = json.replace(/a\\\\\\\ /g, "a\\\\\\ ");
	json = json.replace(/a\\\\\\ /g, "a\\\\ ");
	json = json.replace(/b\\ /g, "b\\\\ ");
	json = json.replace(/c\\ /g, "c\\\\ ");
	json = json.replace(/1\\\\\\ /g, "1\\\\ ");
	json = json.replace(/A\\\\\\\\ /g, "A\\\\ ");
	json = json.replace(/A\\\\\\\ /g, "A\\\\\\ ");
	json = json.replace(/A\\\\\\ /g, "A\\\\ ");
	json = json.replace(/B\\ /g, "B\\\\ ");
	json = json.replace(/C\\ /g, "C\\\\ ");
	json = json.replace(/2\\ /g, "2\\\\ ");

	json = json.replace(/\\","Wojewodztwo":"/g, "\\\\\",\"Wojewodztwo\":\"");
	json = json.replace(/\\","fiz_dataPowstania":"/g, "\\\\\",\"fiz_dataPowstania\":\"");

	json = json.replace(/\\","fiz_numerTelefonu":"/g, "\\\\\",\"fiz_numerTelefonu\":\"");
	json = json.replace(/\\\\\\","fiz_numerTelefonu":"/g, "\\\\\",\"fiz_numerTelefonu\":\"");

	return json;
}

//MS 2018-02-13
function isRegonValid(regonCandid) {

	if (regonCandid.length == 0)
	return true;

	if (regonCandid.length > 0 &&
				!regonCandid.match(/^\d+$/)) { // znaki inne ni� cyfry."
				return false;
	}

	weightsForRegon9A = new Array(8, 9, 2, 3, 4, 5, 6, 7);
	weightsForRegon14A = new Array(2, 4, 8, 5, 0, 9, 7, 3, 6, 1, 2, 4, 8);
	var weightA = new Array();
	var weightsDigitsProduct = 0;
	var len = regonCandid.length;

	if (len == 9) {
		weightA = weightsForRegon9A;
	}
	else if (len == 14) {
		weightA = weightsForRegon14A;
	}
	else {
		alert(internalErrMsg + " 690.");
	}

	var i = 0;
	do {
		for (i = 0; i < len - 1; i++) {
			//	Uwaga: Netscape i IExpolorer w parseInt
			//	traktuje 0123 jako zapis oktalny,
			//	dlatego wymuszam traktowanie dziesietne
			weightsDigitsProduct +=
				parseInt(regonCandid.substring(i, i + 1), 10) * weightA[i];
		}
		var controlDigitCalculated = weightsDigitsProduct % 11;
		if (controlDigitCalculated == 10) { controlDigitCalculated = 0 };
		var controlDigitEntered = parseInt(regonCandid.substring(len - 1, len), 10);

		if (controlDigitCalculated != controlDigitEntered) {
			return false;
		}
		if (len == 14) {
			regonCandid = regonCandid.substring(0, 9);
			len = 9;
			weightsDigitsProduct = 0;
			weightA = weightsForRegon9A;
		}

	} while (i == 13);// (i==13)==>(len==14) -
	//REGON-14 sprawdzany jest tak�e wg wagi dla REGON-9
	//(ze wzgl�du na b��dn� wag�=0 dla REGON-14

	return true;
}

//MS 2018-02-13
function isNipValid(nipCandid) {

	if (nipCandid.length == 0)
	return true;

	if (nipCandid.length > 0 &&
				!nipCandid.match(/^\d+$/)) { // znaki inne ni� cyfry."
				return false;
	}

	//sprawdzenie cyfry kontrolnej
	sum = 6 * nipCandid[0] +
	5 * nipCandid[1] +
	7 * nipCandid[2] +
	2 * nipCandid[3] +
	3 * nipCandid[4] +
	4 * nipCandid[5] +
	5 * nipCandid[6] +
	6 * nipCandid[7] +
	7 * nipCandid[8];
	sum %= 11;
	if (nipCandid[9] != sum)
		return false;

	return true;
}


//MS 2018-02-13
function onEnter(inputEvent) {

	var event = null;
	var keyCode = null;

	if (typeof (inputEvent) == 'undefined') { //IE
		event = window.event;
	}
	else { //FF & OP
		event = inputEvent;
	}

	if (event.keyCode) { //code of the key in IE
		keyCode = event.keyCode;
	} else if (event.which) { //code of the key in Mozilla
		keyCode = event.which;
	}
	if (keyCode == 13) { // ENTER_key
		return daneSzukaj('identyfikator');
		//return false;
	}
	return true;
}

//MS 2018-08-07
if (typeof String.prototype.trim !== 'function') {
	String.prototype.trim = function () {
	return this.replace(/^\s+|\s+$/g, '');
  }
}
// end of MS' code

function loading0() {

	var m = detectmob();
	if (m == true) { document.getElementById('divMob').style.display = 'block'; }  //window.location.href='https://wyszukiwarkaregontest.stat.gov.pl/appBIR/index_m.aspx';  }

}

function loading() {

	//document.getElementById('divProgressIcon').innerHTML += '.';

	//if (document.getElementById("divProgressIcon").innerHTML.length > 22)
	//{ document.getElementById("divProgressIcon").innerHTML = "prosz� czeka�." }

}

setTimeout('loading0();', 700);
setInterval('loading();', 700);

function HamburgerONOFF(x) {
	//x.classList.toggle("change");

	if (document.getElementById('ulKontrast').style.display == 'block') {

		document.getElementById('ulKontrast').style.display = '';
		document.getElementById('menu-iconI').classList.remove('fa-times');
		document.getElementById('menu-iconI').classList.add('fa-bars');
	}
	else {
		document.getElementById('ulKontrast').style.display = 'block';
		document.getElementById('menu-iconI').classList.remove('fa-bars');
		document.getElementById('menu-iconI').classList.add('fa-times');
	}


}


//document.onload += window.setTimeout("pobierzCaptcha();", 500);6:34 PM 11/13/2014
