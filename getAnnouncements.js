function signature (json_data, api_key) {
  message = JSON.stringify(json_data)
  hmac = Utilities.computeHmacSignature(Utilities.MacAlgorithm.HMAC_SHA_1,message, api_key)
  return Utilities.base64Encode(hmac)
}

ScriptProps = PropertiesService.getScriptProperties()

function getAnnouncements() {

  
  user = ScriptProps.getProperty('username')
  api_key = ScriptProps.getProperty('api_key')


  var body = {
  'names': '64'
  };
  var headers = {
  'geofox-auth-type': 'HmacSHA1',
  'geofox-auth-user': user,
  'geofox-auth-signature': signature(body, api_key), 
  'Accept': 'application/json'
  };

  var options = {
  "method": "POST",
  "contentType": "application/json",
  "headers": headers,
  "payload": JSON.stringify(body)
  };

  var response = UrlFetchApp.fetch('https://gti.geofox.de/gti/public/getAnnouncements', options);
  var data = JSON.parse(response.getContentText());

  if (Object.hasOwn(data,'announcements')) {
  console.log(data.announcements);  
  return data.announcements;
  } 
  else {
  console.log("There are no announcements.");
  return []
  }

}

function isAnnouncementNew(id) {
    var searchTerm = 'from:hvv.announcements@gmail.com subject:"HVV Announcement ' + id + '"';
    var threads = GmailApp.search(searchTerm);
    if (threads.length === 0) {
    return true;
  } else {
    return false;
  }
}
  

function broadcast() {
  bcc_list = ScriptProps.getProperty('bcc_list')
  to_list = ScriptProps.getProperty('to_list')
  mail_options = {from: 'hvv.announcements@gmail.com', name: 'HVV Announcements', 'bcc': bcc_list}
  announcements = getAnnouncements()
  announcements.forEach((announcement, index) => {
    id = announcement.id
    if (isAnnouncementNew(id)) {
      summary = announcement.summary
      htmlText = createHTMLTable(announcement.description)
      console.log(`Announcement ${id}: Summary: ${summary}.\\n Description: ${announcement.description}`);
      if (htmlText !== announcement.description) {
        console.log("HTML transform successful")
        mail_options = {  from: 'hvv.announcements@gmail.com',
                          name: 'HVV Announcements', 
                          bcc: bcc_list, 
                          htmlBody: htmlText
                        }
        GmailApp.sendEmail(to_list,
                    `HVV Announcement ${id}`, //subject
                    "",                       //empty body
                    mail_options)             //body specified as adv option
      }
      else {
        console.log("HTML transform not successful. Sending legacy transform.")
        mail_options = { from: 'hvv.announcements@gmail.com',
                         name: 'HVV Announcements', 
                         bcc: bcc_list
                         }
        mail_body = transformText(announcement.description)
        GmailApp.sendEmail(to_list,
                    `HVV Announcement ${id}`,                                                 //subject
                    `Summary: ${summary}. The following rides are cancelled:\n${mail_body}`,  //non-HTML body
                    mail_options
                    )
      }
    }
    else {
      console.log("Announcement exists already")
    }
  });

}