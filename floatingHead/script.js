const canvas = document.querySelector('canvas')
const context = canvas.getContext('2d')
const imageDimensions = {width: 310, height: 343}


canvas.width = window.innerWidth
canvas.height = window.innerHeight

context.translate(window.innerWidth / 2, window.innerHeight / 2)

const image = new Image()
image.src = './assets/smile.png'

const loopImage = 35
const offsetDistance = 200
let currentOffset = 0

const movementRange = 200

const mouseOffset = {
  x:0,
  y: 0
}

const movementOffset = {
  x: 0,
  y: 0
}

image.onload = () => {
  startLooping()
}

window.onresize = () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  context.setTransform(1, 0, 0, 1, 0, 0);
  context.translate(window.innerWidth / 2, window.innerHeight / 2);
}

window.addEventListener('mousemove', onMouseMove)

function draw(offset) {
  context.drawImage(image,
    -imageDimensions.width / 2 - offset/2 + movementOffset.x,
    -imageDimensions.height / 2 - offset/2 + movementOffset.y,
    imageDimensions.width + offset,
    imageDimensions.height + offset);
}

function onMouseMove(e){
  mouseOffset.x = (e.clientX - window.innerWidth / 2) / window.innerWidth / 2 * movementRange
  mouseOffset.y = (e.clientY - window.innerHeight / 2) / window.innerHeight / 2 * movementRange
}

function lerp(start, end, amount){
  return start*(1-amount)+end*amount
}

function loopDraw() {

  movementOffset.x=lerp(movementOffset.x, mouseOffset.x, 0.05)
  movementOffset.y=lerp(movementOffset.y, mouseOffset.y, 0.05)

  for(let i = loopImage; i >= 1; i--){
    draw(i * offsetDistance + currentOffset)
  }
  draw(offsetDistance)
  currentOffset++
  if(currentOffset >= offsetDistance){
    currentOffset = 0
  }
  requestAnimationFrame(loopDraw)
}

function startLooping() {
  requestAnimationFrame(loopDraw)
}
