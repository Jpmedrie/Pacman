
class Ghost {
  constructor(x,y,width,height, speed, imageX, imageY, imageWidth, imageHeight, range){
    this.x = x
    this.y = y
    this.width = width
    this.height = height
    this.speed = speed
    this.direction = DIRECTION_RIGTH
    this.nextDirection = this.direction
    this.imageX = imageX
    this.imageY = imageY
    this.imageHeight = imageHeight
    this.imageWidth = imageWidth
    this.range = range
    this.randomtargetIndex = parseInt(Math.random() * 4)
    setInterval(() => {
      this.changeRandomDirection()
    }, 10000)
  };

  isInRangeOfPacman(){
    let xDistante = Math.abs(pacman.getMapX() - this.getMapX());
    let yDistante = Math.abs(pacman.getMapY() - this.getMapY());
    if(Math.sqrt(xDistante * xDistante + yDistante*yDistante) <= this.range){
      return true;
    }
    return false;
  }

  changeRandomDirection = () => {
    let addition = 1;
    this.randomtargetIndex += addition; //parseInt(Math.random() * 4);
    this.randomtargetIndex = this.randomtargetIndex % 4;
  }

  moveProcess(){
    if(this.isInRangeOfPacman()){
      this.target = pacman
    } else {
      this.target = randomTargetsForGhosts[this.randomtargetIndex]
    }
    this.changeDirectionIfPossible();
    this.moveFowards();
    if(this.checkCollision()) {
      this.moveBackwards();
      return;
    }
  }

  moveBackwards(){
    switch(this.direction){
      case DIRECTION_RIGTH:
        this.x -= this.speed;
        break;
      case DIRECTION_UP:
        this.y += this.speed;
        break;
      case DIRECTION_LEFT:
        this.x += this.speed;
        break;  
      case DIRECTION_BOTTOM:
        this.y -= this.speed;
        break;
    }
  }
  moveFowards(){
    switch(this.direction){
      case DIRECTION_RIGTH:
        this.x += this.speed;
        break;
      case DIRECTION_UP:
        this.y -= this.speed;
        break;
      case DIRECTION_LEFT:
        this.x -= this.speed;
        break;  
      case DIRECTION_BOTTOM:
        this.y += this.speed;
        break;
    }
  }

  checkCollision(){
     let isCollided = false;
    // if(map[this.getMapY()][this.getMapX()] == 1
    // || map[this.getMapXRightSide()][this.getMapYRightSide()] == 1
    // || map[this.getMapY()][this.getMapYRightSide()] == 1
    // || map[this.getMapXRightSide()][this.getMapX()] == 1) {
    //   return true;
    // };
    // return false;

    if (
      map[parseInt(this.y / oneBlockSize)][
          parseInt(this.x / oneBlockSize)
      ] == 1 ||
      map[parseInt(this.y / oneBlockSize + 0.9999)][
          parseInt(this.x / oneBlockSize)
      ] == 1 ||
      map[parseInt(this.y / oneBlockSize)][
          parseInt(this.x / oneBlockSize + 0.9999)
      ] == 1 ||
      map[parseInt(this.y / oneBlockSize + 0.9999)][
          parseInt(this.x / oneBlockSize + 0.9999)
      ] == 1
  ) {
      isCollided = true;
  }
  return isCollided;
  };

  checkGhostCollision(){

  }

  // isInRangeOfPacman(){
  //   let xDistante = Math.abs(pacman.getmapX() - this.getmapX());
  //   let yDistante = Math.abs(pacman.getmapY() - this.getmapY());
  //   if(Math.sqrt(xDistante * xDistante + yDistante*yDistante) <= this.range){
  //     return true;
  //   }
  //   return false;
  // }

  changeDirectionIfPossible(){
    let tempDirection = this.direction;

    this.direction = this.calculateNewDirection(
      map,
      parseInt(this.target.x / oneBlockSize),
      parseInt(this.target.y / oneBlockSize)
    );

    if(typeof this.direction == "undefined"){
      this.direction = tempDirection;
      return;
    }
      //TODO: SOMETHING OFF HERE
    // if (
    //   this.getMapY() != this.getMapYRightSide() &&
    //   (this.direction == DIRECTION_LEFT ||
    //       this.direction == DIRECTION_RIGHT)
    //   ){
    //       this.direction = DIRECTION_UP;
    //   }
    //   if(
    //       this.getMapX() != this.getMapXRightSide() &&
    //       this.direction == DIRECTION_UP
    //   ){
    //       this.direction = DIRECTION_LEFT;
    //   }
      

    this.moveFowards();
    if(this.checkCollision()) {
      this.moveBackwards();
      this.direction = tempDirection;
    } else{
      this.moveBackwards();
    }
  }

  calculateNewDirection(map, destX, destY) {
    let mp = [];
    for(let i = 0; i < map.length; i++){
      mp[i] = map[i].slice();
    }

    let queue = [
      {
        x: this.getMapX(),
        y: this.getMapY(),
        rightX: this.getMapXRightSide(), // new guys here
        rightY: this.getMapYRightSide(),
        moves: []
      }
    ]

    while(queue.length > 0) {
      let poped = queue.shift();
      if(poped.x == destX && poped.y == destY) {
        return poped.moves[0]
      } else {
        mp[poped.y][poped.x] = 1;
        let neighborList = this.addNeighbours(poped, mp);
        for(let i = 0; i < neighborList.length; i++){
          queue.push(neighborList[i]);
        }
      };
    };

    return DIRECTION_UP //default
  };

  addNeighbours(poped, mp) {
    let queue = [];
    let numOfRows = mp.length;
    let numOfColumns = mp[0].length;

    if(
      poped.x - 1 >= 0 && 
      poped.x -1 <= numOfRows &&
      mp[poped.y][poped.x - 1] != 1
    ) {
      let tempMoves = poped.moves.slice();
      tempMoves.push(DIRECTION_LEFT);
      queue.push({x: poped.x -1, y: poped.y, moves: tempMoves});
    }
    if(
      poped.x + 1 >= 0 && 
      poped.x + 1 <= numOfRows &&
      mp[poped.y][poped.x + 1] != 1
    ) {
      let tempMoves = poped.moves.slice();
      tempMoves.push(DIRECTION_RIGTH);
      queue.push({x: poped.x + 1, y: poped.y, moves: tempMoves});
    }
    if(
      poped.y - 1 >= 0 && 
      poped.y -1 <= numOfRows &&
      mp[poped.y - 1][poped.x] != 1
    ) {
      let tempMoves = poped.moves.slice();
      tempMoves.push(DIRECTION_UP);
      queue.push({x: poped.x, y: poped.y - 1, moves: tempMoves});
    }
    if(
      poped.y + 1 >= 0 && 
      poped.y + 1 <= numOfRows &&
      mp[poped.y + 1][poped.x] != 1
    ) {
      let tempMoves = poped.moves.slice();
      tempMoves.push(DIRECTION_BOTTOM);
      queue.push({x: poped.x, y: poped.y + 1, moves: tempMoves});
    }

    return queue;
  }

  getMapX(){
    return parseInt(this.x / oneBlockSize);
  }
  getMapY(){
    return parseInt(this.y / oneBlockSize);
  }

  getMapXRightSide(){
    return parseInt((this.x * 0.9999 + oneBlockSize) / oneBlockSize);
  }
  getMapYRightSide(){
    return parseInt((this.y * 0.9999 + oneBlockSize) / oneBlockSize);
  }

  changeAnimation(){
    this.currentFrame = this.currentFrame == this.frameCount ? 1 : this.currentFrame + 1;
  } 

  draw(){
    canvasContext.save();
    
    canvasContext.drawImage(
      ghostFrames,
      this.imageX,
      this.imageY, 
      this.imageWidth, 
      this.imageHeight, 
      this.x, 
      this.y, 
      this.width, 
      this.height
    )
    canvasContext.restore();

    canvasContext.beginPath();
    canvasContext.strokeStyle = "red";
    canvasContext.arc(
      this.x + oneBlockSize / 2,
      this.y + oneBlockSize / 2,
      this.range*oneBlockSize,
      0,
      2*Math.PI
    );
    canvasContext.stroke();
  }
}

// let updateGhosts = () => {
//   for (let i = 0; i < ghosts.length; i++) {
//       ghosts[i].moveProcess();
//   }
// };

// let drawGhosts = () => {
//   for (let i = 0; i < ghosts.length; i++) {
//       ghosts[i].draw();
//   }
// };