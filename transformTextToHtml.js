let message1 = "Betriebsbedingt entfallen heute 23.11.2023 die Abfahrten der Linie 64 um 15:02+15:32+16:02+16:32+17:02+17:32+18:02 Uhr ab Finkenwerder, sowie ab Teufelsbrück um 15:20+15:50+16:20+16:50+17:20+17:50 Uhr. "
let message2 = "Am 22.11.2023 entfallen die Abfahrten der Linie 64 um 15:02+15:32+16:02+16:32+17:02+17:32+18:02 Uhr ab Finkenwerder, sowie ab Teufelsbrück um 15:20+15:50+16:20+16:50+17:20+17:50 Uhr. "
function createHTMLTable(text) {
  // Extrahieren Sie die Zeiten für Finkenwerder und Teufelsbrück
  const keyword = "entfallen"
  if (text.includes(keyword)) {
    var dateMatch = text.match(/\d{2}\.\d{2}\.\d{4}/);

    var date = dateMatch ? dateMatch[0] : "unbekanntes Datum";
    var parts = text.split(', sowie ab ');
    var fwPart = parts[0].split(' um ')[1];
    var tbPart = parts[1].split(' um ')[1];
    var fwTimes = fwPart.match(/[\d:]+/g) || [];
    var tbTimes = tbPart.match(/[\d:]+/g) || [];

    // Erstellen Sie eine HTML-Tabelle
    var table = "<table style='width:20%' border=1>";
    table += "<tr><th>TBF<br>&#8595;<br>RPF</th><th>RPF<br>&#8595;<br>TBF</th></tr>";
    for (var i = 0; i < Math.max(fwTimes.length, tbTimes.length); i++) {
      // Add Rüschpark times
      var timeParts = fwTimes[i].split(':');
      var date = new Date();
      date.setHours(timeParts[0]);
      date.setMinutes(timeParts[1]);
      date.setMinutes(date.getMinutes() + 5); // Add 5 minutes
      var newTime = ("0" + date.getHours()).slice(-2) + ":" + ("0" + date.getMinutes()).slice(-2); // Add leading zero to hours and minutes
      table += "<tr>";
      
      table += "<td align='center'>" + (tbTimes[i] || "") + "</td>";
      table += "<td align='center' >" + newTime + "</td>";
      
      
      table += "</tr>";
    }
    table += "</table>";
    var text = "<p>Today, on <b>" + dateMatch + "</b>, the following ferry schedules are NOT serviced: </p>" 


    // Fügen Sie die Tabelle zum Dokument hinzu
    document.body.innerHTML += text
    document.body.innerHTML += table;
  }
}

createHTMLTable(message1)
