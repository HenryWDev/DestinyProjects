const imageDimensions = {width: window.innerWidth, height: window.innerHeight}
maxCallouts = 22
let chaosNumbers = []
selectedSet = 1


newImage()

function newImage() {
  newSelection = Math.floor(Math.random() * maxCallouts) + 1 // random integer between 1 and maxCallouts
  while (newSelection == selectedSet) {
    newSelection = Math.floor(Math.random() * maxCallouts) + 1 // random integer between 1 and maxCallouts
    console.log("same result")
  }
  selectedSet = newSelection

  mergeImages([
    {src: 'assets/AtheonMap.png', x: 0, y: 0}, // base map
    {src: 'assets/' + selectedSet + '/1.png', x: 445, y: 55}, // 1
    {src: 'assets/' + selectedSet + '/2.png', x: 765, y: 260}, // 2
    {src: 'assets/' + selectedSet + '/3.png', x: 755, y: 625}, // 3
    {src: 'assets/' + selectedSet + '/4.png', x: 430, y: 730}, // 4
    {src: 'assets/' + selectedSet + '/5.png', x: 80, y: 635}, // 5
    {src: 'assets/' + selectedSet + '/6.png', x: 95, y: 275} // 6

  ])
    .then(b64 => document.querySelector('img').src = b64);
}

function newChaosImage() {
  chaosNumbers = []
  var i;

  for (i = 0; i < 6; i++){
    chaosNumbers.push(Math.floor(Math.random() * maxCallouts) + 1)
    console.log(chaosNumbers[i])
  }
   mergeImages([
  {src: 'assets/AtheonMap.png', x: 0, y: 0}, // base map
  {src: 'assets/' + chaosNumbers[0] + '/1.png', x: 445, y: 55}, // 1
  {src: 'assets/' + chaosNumbers[1] + '/2.png', x: 95, y: 275}, // 6
  {src: 'assets/' + chaosNumbers[2] + '/3.png', x: 765, y: 260}, // 2
  {src: 'assets/' + chaosNumbers[3] + '/4.png', x: 80, y: 635}, // 5
  {src: 'assets/' + chaosNumbers[4] + '/5.png', x: 430, y: 730}, // 4
  {src: 'assets/' + chaosNumbers[5] + '/6.png', x: 755, y: 625} // 3
  ])
  .then(b64 => document.querySelector('img').src = b64);

}


/*window.onresize = () => {
  console.log("resize")
}
*/
