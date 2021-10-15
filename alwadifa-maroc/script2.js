const puppeteer = require('puppeteer');
const fs = require('fs');
(async () => {

  const browser = await puppeteer.launch({
    args: ['--no-sandbox', '--disable-setuid-sandbox'], headless: true
  });
  const page = await browser.newPage();
  await page.goto('http://www.alwadifa-maroc.com/');
  const data = await page.evaluate(() => {

    var array_content = new Array();


    var elements = document.querySelectorAll('.bloc-content.ar');
    elements.forEach((item) => {
      var data_key_value = {};
      data_key_value['date'] = item.getElementsByTagName('li')[0].textContent;
      data_key_value['content'] = item.getElementsByTagName('a')[0].textContent;
      data_key_value['url'] = item.getElementsByTagName('a')[0].href;
      array_content.push(data_key_value);
    });

    return array_content;
 
  });
  //console.log(data);
  await browser.close();
  var fileStream = fs.createWriteStream("concours.txt");
  fileStream.once('open', function () {
    let x = 0;
    for (let index = 0; index < data.length; index++) {
      fileStream.write("concours numero : " + (++x));
      fileStream.write("\n Content : " + data[index].content);
      fileStream.write("\n Date : " + data[index].date);
      fileStream.write("\n Url : " + data[index].url);
      fileStream.write("\n-------------------------------------------------------------\n");

    }
    fileStream.end();
  });

})();
