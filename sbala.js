addEventListener('DOMContentLoaded', () => {
const grid = document.getElementById('grid');
const scoreDisplay = document.querySelector('.score');
const levelDisplay = document.querySelector('.level');
const enemiesDisplay = document.querySelector('.enemies');

const gridwidth = 10;
const tileSize = 48;

const squares = [];
let score = 0;
let level = 3; 
let playerposition = 66;
let enemies = []
let playerdirection = 'right';
let gamerunning = true;
// w = topwall, x = rightwall, y = bottomwall, z = leftwall, 
// cornerwalls = a,b,c,d,
// p = player,
// l = lanterns,
// f = firepots,
// ^ = topdoor,
// v = downndoor,
// s = stairs
//  e = enemy, 
// s = emptyspacearea
// $ = skeletor enemy
// * = slicer enemy
const maps = [
    [
        'awwwlwwww^',
        'x      $ z',
        'x        z',
        'x   f    z',
        'x        z',
        'x   $  l z',
        'xp       z',
        'x      e z',
        'cyyyyyyyyd'
    ],
    // layout for level 2
    [
        'awwwwwwwwb',
        'x   e  * z',
        'x  l     z',
        'x    $   z',
        'x      e z',
        'x  f     z',
        'v    p   z',
        'x  s   e z',
        'cyyyyyyyyd'
    ],
    // layout for level 3
    [
        'awwwwwwwwb',
        'x    * p z',
        'x  l     z',
        'v        z',
        'x  $  *  z',
        'x     f  z',
        'x   e    z',
        'x     s  z',
        'cyyyyylyyd'
    ],
    [
        'a^wwwwwwwb',
        'x  *   * z',
        'x        z',
        'x    f   l',
        'x *      z',
        'v     p  z',
        'x    s   z',
        'x $    $ z',
        'cyyyyyyyyd'
    ],
    [
        'a^wwwww^wb',
        'x*  $  $ z',
        'x*       z',
        'ls   p  *z',
        'x        z',
        'x       *z',
        'x*  f    v',
        'x*       z',
        'clyyyyyyyd'
    ]
]


function createGrid(){
    gamerunning = true
    grid.innerHTML = ''
    squares.length = 0
    enemies = []
    const currentmap = maps[level]

    for(let i = 0;i < 9; i++){
        for(let j = 0;j < 10; j++){
        const square = document.createElement('div');
        square.setAttribute('id', i * gridwidth + j)
        const char = currentmap[i][j]
        addMapelements(square, char, j, i)
        grid.appendChild(square);
        squares.push(square);
        }
    }
    createplayer()
    updateboard()
}

function addMapelements(square, char, x, y){
    switch(char){
        case 'a':
            square.classList.add('top-left-corner-wall')
        break;
        case 'w':
            square.classList.add('top-wall')
            break;
            case 'b':
                square.classList.add('top-right-corner-wall')
                break;
                case 'x':
                    square.classList.add('right-wall')
                    break;
            case 'z':
                square.classList.add('left-wall')
                break;
                case 'y':
                    square.classList.add('bottom-wall')
                    break;
                case 'v':
                    square.classList.add('center-door')
                    break;
            case 's':
                square.classList.add('stairs')
                break;
        case 'c':
            square.classList.add('bottom-left-corner-wall')
            break;
        case 'd':
            square.classList.add('bottom-right-corner-wall')
            break;
        case 'l': 
        square.classList.add('lantern')
        break
        case 'f':
            square.classList.add('firepot')
            break
            case '^':
            square.classList.add('top-door')
            break
                        case '$':
                            createskeletor(x,y)
                            break;
        case '*':
            createSlicer(x,y)
            break;
    }
}


function createplayer(){
    const playerelement = document.createElement('div');
    playerelement.classList.add('link-going-right')
    playerelement.id = 'player'
    playerelement.style.left = `${(playerposition % gridwidth) * tileSize}px`
    playerelement.style.top = `${Math.floor(playerposition / gridwidth) * tileSize}px`
    grid.appendChild(playerelement)
}

function createSlicer(x,y){
    const slicerelement = document.createElement('div');
    slicerelement.classList.add('slicer')
    slicerelement.style.left = `${x * tileSize}px`
    slicerelement.style.top = `${y * tileSize}px`

    const slicer = {
        x, 
        y, 
        direction: -1,
        type: 'slicer',
        element: slicerelement
    }
    enemies.push(slicer)
    grid.appendChild(slicerelement)
}

function createskeletor(x,y){
    const skeletorelemment = document.createElement('div');
    skeletorelemment.classList.add('skeletor')
    skeletorelemment.style.left = `${x * tileSize}px`
    skeletorelemment.style.top = `${y * tileSize}px`

    const skeletor = {
        x, 
        y,
        direction: -1,
        timer: Math.random() * 5,
        type: 'skeletor',
        element: skeletorelemment

    }


    enemies.push(skeletor)
    grid.appendChild(skeletorelemment)
}


function moveplayer(direction){
    const playerelements = document.getElementById('player');
    let newposition = playerposition
    switch(direction){
        case 'down':
            if(playerposition + gridwidth < gridwidth * 9)
                newposition = playerposition + gridwidth
                playerelements.className ='link-going-down'
                playerdirection = 'down'
        break;
        case 'up':
            if(playerposition - gridwidth >=0)
                newposition = playerposition - gridwidth
                playerelements.className = 'link-going-up'
                playerdirection = 'up'
            break;
            case 'right':
                if(playerposition % gridwidth !== gridwidth-1)
                newposition = playerposition +1
                playerelements.className = 'link-going-right'
                playerdirection = 'right'
                break;
        case 'left': 
        if(playerposition % gridwidth !==0)
            newposition = playerposition -1 
            playerelements.className = 'link-going-left'
            playerdirection = 'left'
        break;
    }


    if(canmoveto(newposition)){
        const square = squares[newposition]
        if(square.classList.contains('center-door')){
            square.classList.remove('center-door')
        }
        else if(square.classList.contains('top-door') || square.classList.contains('stairs')){
            if(enemies.length === 0){
                nextlevel()
            }
            else{
                alertmessage()
            }
            return
        }
        playerposition = newposition
        playerelements.style.left = `${(playerposition % gridwidth) * tileSize}px`
        playerelements.style.top = `${Math.floor(playerposition / gridwidth) * tileSize}px`
        checkPlayerenemycollision()
    }
    
}

function canmoveto(newposition){
    if(newposition < 0 || newposition >= squares.length) return false
    const square = squares[newposition]

    return  !square.classList.contains('left-wall') &&
            !square.classList.contains('right-wall') &&
            !square.classList.contains('top-wall') &&
            !square.classList.contains('bottom-wall') &&
            !square.classList.contains('top-right-corner-wall') &&
            !square.classList.contains('top-left-corner-wall') &&
            !square.classList.contains('bottom-right-corner-wall') &&
            !square.classList.contains('bottom-left-corner-wall') &&
            !square.classList.contains('lantern') &&
            !square.classList.contains('firepot')
}

function kaboomtokill(){
    let kaboomX = playerposition % gridwidth 
    let kaboomY = Math.floor(playerposition / gridwidth)
    switch(playerdirection){
        case 'left':
            kaboomX -= 1;
        break
        case 'right':
            kaboomX += 1;
        break
        case 'up':
            kaboomY -= 1;
        break
        case 'down':
            kaboomY += 1;
        break
    }

    if(kaboomX >= 0 && kaboomX < gridwidth && kaboomY >= 0 && kaboomY < 9){
        const kaboomelements = document.createElement('div');
        kaboomelements.className = 'kaboom';
        kaboomelements.style.left = `${kaboomX * tileSize}px`
        kaboomelements.style.top = `${kaboomY * tileSize}px`
        grid.appendChild(kaboomelements)
        checkkaboomhitenemies(kaboomX, kaboomY)

    setTimeout(()=> {
        if(kaboomelements.parentNode){
            kaboomelements.parentNode.removeChild(kaboomelements)
        }
    }, 800)
    }
}


function checkkaboomhitenemies(kaboomX, kaboomY){
    for (let i = enemies.length -1;i >= 0; i--){
        const enemieselement = enemies[i];
        const enemyX = Math.round(enemieselement.x)
        const enemyY = Math.round(enemieselement.y)
        if(enemyX === kaboomX && enemyY === kaboomY){
            if(enemieselement.element.parentNode){
                enemieselement.element.parentNode.removeChild(enemieselement.element)
            }
        enemies.splice(i, 1)
        score ++
        updateboard()
        break
        }
    }
}

function checkPlayerenemycollision(){
    const playerX = playerposition % gridwidth
    const playerY = Math.floor(playerposition / gridwidth)
    for(const enemieselement of enemies){
        const enemyX = Math.round(enemieselement.x)
        const enemyY = Math.round(enemieselement.y)
    if(enemyX === playerX && enemyY === playerY){
        gameover()
        return
    }
    }
}




function nextlevel(){
    level = (level + 1) % maps.length
    createGrid()
}


function moveenemies(deltatime){
    for(const enemieselement of enemies){
        if(enemieselement.type === 'slicer'){
            moveslicer(enemieselement, deltatime)
        }
        else if(enemieselement.type === 'skeletor'){          
            moveskeletor(enemieselement, deltatime)
        }
    }
}

function moveslicer(slicer, deltatime){
    const speed = 2 * deltatime
    const newX = slicer.x + (slicer.direction * speed)
    const Y = Math.round(slicer.y)
    if(newX < 0 || newX >= gridwidth || iswall(Math.round(newX), Y)){
        slicer.direction *= -1
    }
    else{
        slicer.x = newX
    }
    slicer.element.style.left = `${slicer.x * tileSize}px`
}

function moveskeletor(skeletor, deltatime){
    const speed = 1.6 * deltatime
    skeletor.timer -= deltatime
    if(skeletor.timer <= 0){
        skeletor.direction *= -1
        skeletor.timer = Math.random() * 5
    }

    const newy = skeletor.y + (skeletor.direction * speed)
    const x = Math.round(skeletor.x)
    if(newy < 0 || newy >= 9 || iswall(x, Math.round(newy))){
        skeletor.direction *= -1 
    }
    else{
        skeletor.y = newy
    }
    skeletor.element.style.top = `${skeletor.y * tileSize}px`

}

function iswall(x, y){
    const position = y * gridwidth + x
    if(position < 0 || position >= squares.length) return true
    const square = squares[position]
    return square.classList.contains('left-wall') ||
            square.classList.contains('right-wall') ||
            square.classList.contains('top-wall') ||
            square.classList.contains('bottom-wall') ||
            square.classList.contains('top-right-corner-wall') ||
            square.classList.contains('top-left-corner-wall') ||
            square.classList.contains('bottom-right-corner-wall') ||
            square.classList.contains('bottom-left-corner-wall') ||
            square.classList.contains('lantern') ||
            square.classList.contains('firepot')

}

function updateboard(){
    scoreDisplay.textContent = score
    levelDisplay.innerHTML = `${level + 1}`
    enemiesDisplay.innerHTML = enemies.length
}



function alertmessage(){
    grid.style.filter = `hue-rotate(0deg) saturate(2) brightness(1.6)`
    grid.style.boxShadow = `0px 10px 10px 10px`
     
    setTimeout(()=> {
        grid.style.filter =''
        grid.style.boxShadow = ''
    }, 400)

    messagefor('Defeat all enemies to continue to next level!', 'green', 2000)
}



function messagefor(text,color,duration){
    const existingmessage = document.getElementById('alertenemiesmessage')
    if(existingmessage) existingmessage.remove()
    const messageelement = document.createElement('div')
    messageelement.id = 'alertenemiesmessage'
    messageelement.innerHTML = text
    messageelement.style.color = color
    grid.appendChild(messageelement)

    setTimeout(()=> {
        if(messageelement.parentNode){
            messageelement.remove()
        }
    }, duration)
}


document.addEventListener('keydown',(event)=> {
    if(!gamerunning) return

        switch(event.code){
            case 'ArrowLeft':
                event.preventDefault()
            moveplayer('left')
            break;
            case 'ArrowRight':
                event.preventDefault()
                moveplayer('right')
                break;
        case 'ArrowUp':
            event.preventDefault()
            moveplayer('up')
            break;
        case 'ArrowDown':
            event.preventDefault()
            moveplayer('down')
            break;
        case 'Space':
            event.preventDefault()
            kaboomtokill()
            break;
    }
})


let lastTime = 0
let animationId

function gameloop(currenttime){
    const deltatime = (currenttime - lastTime) / 1000
    lastTime = currenttime 
    if(gamerunning && deltatime < 0.1){
        moveenemies(deltatime)
        checkPlayerenemycollision()
    }
    animationId = requestAnimationFrame(gameloop)
}

function gameover(){
    gamerunning = false
    messagefor(`Game Over! Final score is ${score}`, 'red', 3000)
}

createGrid()
animationId = requestAnimationFrame(gameloop)
});





