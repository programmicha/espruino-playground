var minutes = ['Punkt',
               'fuenf nach',
               'zehn nach',
               'viertel',
               ['zehn vor', 'halb'],
               ['fuenf vor' ,'halb'],
               'halb',
               ['fuenf nach', 'halb'],
               ['zehn nach', 'halb'],
               'dreiviertel',
               'zehn vor',
               'fuenf vor'
              ];
var hours = ['zwoelf',
             'eins',
             'zwei',
             'drei',
             'vier',
             'fuenf',
             'sechs',
             'sieben',
             'acht',
             'neun',
             'zehn',
             'elf',
             'zwoelf'
            ];
function getTimesTxt(date){
  if(date.getHours() > 12){
    return [minutes[Math.floor(date.getMinutes()/5)], hours[date.getHours()-12]];
  } else {
    return [minutes[Math.floor(date.getMinutes()/5)], hours[date.getHours()]];
  }
}

var fontSize = 20;
var maxTxtLength = 20;
var colY = 10;
var colX = 5;
var txt = getTimesTxt(new Date(2016, 8, 15, 9, 20, 12));
for(i=0;i<txt.length;i++){
  if(txt[i] instanceof Array) {
    console.log(txt[i][0] + ' x:' + colX + ' y:' + colY);
    colY = colY + fontSize;
    console.log(txt[i][1] + ' x:' + colX + ' y:' + colY);
    colX = colX + txt[i][1].length + 2;
  } else {
    console.log(txt[i] + ' x:' + colX + ' y:' + colY);
    colY = colY + fontSize;
  }
}
