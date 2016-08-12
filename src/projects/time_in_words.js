var date = new Date();
var minutes = [
  'Punkt',
  'fünf nach',
  'zehn nach',
  'viertel',
  'zehn vor halb',
  'fünf vor halb',
  'halb',
  'fünf nach halb',
  'zehn nach halb',
  'dreiviertel',
  'zehn vor',
  'fünf vor'
];
var hours = [
  'zwölf',
  'eins',
  'zwei',
  'drei',
  'vier',
  'fünf',
  'sechs',
  'sieben',
  'acht',
  'neun',
  'zehn',
  'elf',
  'zwölf'
];
var maxLength = 0;
var longestTxt;
for(i=0; i<24; i++){
  for(j=0; j<60; j++){
    var minute = Math.floor(j/5);
    var hour = Math.floor(i/2);
    if(minute > 2){
      hour++;
    }
    //console.log('Hour: ' + i + ' Minute: ' + j );
    //var txt = 'Es ist ' + minutes[Math.floor(j/5)].txt + ' ' + hour;
    var txt = minutes[minute] + ' ' + hours[hour];
    //console.log(txt);
    if(maxLength < txt.length) {
      maxLength = txt.length;
      longestTxt = txt;
    }
  }
}
var txtArray = longestTxt.split(' ');
// split over two lines?
if(txtArray.length < 2){
  //console.log(txtArray.toString());
} else {
  //console.log(txtArray.splice(0,2).join(' '));
  //console.log(txtArray.splice(0,2).join(' '));
}

var minutes = ['Punkt','fuenf nach','zehn nach','viertel','zehn vor halb','fuenf vor halb','halb','fuenf nach halb','zehn nach halb','dreiviertel','zehn vor','fuenf vor'];
var hours =
['zwoelf','eins','zwei','drei','vier',
 'fuenf','sechs','sieben','acht','neun',
 'zehn','elf', 'zwoelf'];
var minute = Math.floor(10/5);
for(i=0;i<24;i++){
  var hour;
  if(i>12){
    hour = i-12;
  } else {
    hour = i;
  }
  console.log(hour + ' ' + hours[hour]);
}
var hour = Math.floor(20/2);
if(minute > 2){
  hour++;
}
var txt = minutes[minute] + ' ' + hours[hour];
console.log(txt);
