function transformText(text) {
  var keyword = "Betriebsbedingt entfallen";

  // Check for keyword in string
  if (text.includes(keyword)) {
    // extract date from string
    var dateMatch = text.match(/\d{2}\.\d{2}\.\d{4}/);
    var date = dateMatch ? dateMatch[0] : "unbekanntes Datum";

    // Abschnitte für Finkenwerder und Teufelsbrück isolieren
    var parts = text.split(', sowie ab ');
    var fwPart = parts[0].split(' um ')[1];
    var tbPart = parts[1].split('Teufelsbrück ')[1];

    // Zeiten extrahieren
    var fwTimes = fwPart.match(/[\d:]+/g) || [];
    var tbTimes = tbPart.match(/[\d:]+/g) || [];

    // Nachricht erstellen
  var message = "Line\t| from Finkenwerder\t| from Teufelsbrück\t| Date\n";
    message += "-----------------------------------------------------------------------------------------\n";
    var maxTimes = Math.max(fwTimes.length, tbTimes.length);
    for (var i = 0; i < maxTimes; i++) {
      message += "64\t| ";
      message += ( fwTimes[i]  || "xx:xx") + "\t\t\t\t| ";
      message += ( tbTimes[i]  || "XX:xx") + "\t\t\t\t| ";
      message += date + "\n";
    }
    Logger.log(message)
    return(message)
  } else {
    Logger.log('Der Satz "Betriebsbedingt entfallen" wurde nicht gefunden.');
    return(text)
  }
}