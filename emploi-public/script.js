const puppeteer = require('puppeteer');
const fs = require('fs');
(async () => {

  const browser = await puppeteer.launch({
    args: ['--no-sandbox', '--disable-setuid-sandbox'], headless: true
  });
  const page = await browser.newPage();
  var nv_array = new Array();
  for (let i = 1; i <= 15; i++) {
    await page.goto('https://www.emploi-public.ma/ar/index.asp?p=' + i);
    const data = await page.evaluate(() => {

      var array_content = new Array();


      var elements = document.querySelectorAll('.table.table-sm.table-striped tbody tr');
      elements.forEach((item) => {
        var data_key_value = {};
        data_key_value['date'] = item.getElementsByTagName('td')[1].textContent;
        data_key_value['content'] = item.getElementsByTagName('td')[2].firstElementChild.textContent;
        data_key_value['url'] = item.getElementsByTagName('td')[2].firstElementChild.href;
        array_content.push(data_key_value);
      });

      return array_content;
    });

    nv_array.push(data);
  }

  //console.log(nv_array);
  await browser.close();


  var fileStream = fs.createWriteStream("concours.txt");
  fileStream.once('open', function () {
    let x = 0;
    for (let index = 0; index < nv_array.length; index++) {
      for (let i = 0; i < nv_array[index].length; i++) {
        fileStream.write("concours numero : " + (++x));
        fileStream.write("\n Content : " + nv_array[index][i].content);
        fileStream.write("\n Date : " + nv_array[index][i].date);
        fileStream.write("\n Url : " + nv_array[index][i].url);
        fileStream.write("\n-------------------------------------------------------------\n");
      }
    }
    fileStream.end();
  });


})();
