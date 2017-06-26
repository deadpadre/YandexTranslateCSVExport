// ==UserScript==
// @name         YandexTranslateCSVExport
// @namespace    deadpadre
// @version      0.1
// @description  Adds a button to download favs as a csv file from yandex.translator
// @author       Daniil Tkachenko (deadpadre)
// @match        https://translate.yandex.ru/*
// @grant        none
// @updateURL    https://raw.githubusercontent.com/deadpadre/YandexTranslateCSVExport/master/YandexTranslateCSVExport.user.js
// ==/UserScript==

var SEPARATOR = ";";

// hardcoded en-ru for now, more changes to come
function processItem(itemDiv) {
    var result = "";
    result += itemDiv.querySelectorAll('[lang=en]')[0].innerHTML + SEPARATOR;
    result += itemDiv.querySelectorAll('[lang=ru]')[0].innerHTML;
    result += "\n";
    return result;
}

function extractFavs() {
    var items = document.getElementById("favContent").getElementsByClassName("fav-body");
    var arr = Array.from(items);
    var finalCSV = "";
    if (arr.length > 0) {
        console.log("A few items were found in your fav section!");
    }
    arr.forEach(function(elem) {
        finalCSV += processItem(elem);
    });
    return finalCSV;
}

// https://stackoverflow.com/a/30832210
// function to download data to a file
function download(data, filename, type) {
    var file = new Blob([data], {type: type});
    if (window.navigator.msSaveOrOpenBlob) // IE10+
        window.navigator.msSaveOrOpenBlob(file, filename);
    else { // Others
        var a = document.createElement("a"),
            url = URL.createObjectURL(file);
        a.href = url;
        // changed this line compared to the original answer
        a.download = filename + "." + type;
        document.body.appendChild(a);
        a.click();
        setTimeout(function() {
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
        }, 0);
    }
}

function addCSVButton() {
    //<div id="csvButton" role="button" class="button button_icon button_icon_share" 
    //aria-label="Выгрузить в CSV" data-tooltip="Выгрузить в CSV"></div>
    csvb = document.createElement("div");
    csvb.setAttribute("id", "csvButton");
    csvb.setAttribute("role", "button");
    csvb.setAttribute("class", "button button_icon button_icon_share");
    csvb.setAttribute("aria-label", "Выгрузить в CSV");
    csvb.setAttribute("data-tooltip", "Выгрузить в CSV");
    csvb.style.border = "none";
    var ref = document.getElementById('favFilter');
    ref.parentNode.insertBefore(csvb, ref);
    return csvb;
}

//debugger;
setTimeout(function() {
    var csv = extractFavs();
    var button = addCSVButton();
    button.onclick = function() {
        download(csv, "favs", "csv");
    };
}, 500);
