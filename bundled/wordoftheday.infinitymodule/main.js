const fiplab = require('fiplab');

let Parser = require('rss-parser');
let parser = new Parser();
 
(async () => {
  try{
    let feed = await parser.parseURL('https://www.merriam-webster.com/wotd/feed/rss2'); 
    let firstItem = feed.items[0];

    fiplab.exit(firstItem.title, true, {
      onclick: firstItem.link
    });

  } catch(err){
    fiplab.exit('Could not get data', false);
  }
})();
