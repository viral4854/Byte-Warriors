const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');

canvas.width = 1024;
canvas.height = 576;

c.fillRect(0, 0, canvas.width, canvas.height);
const gravity = 0.2;


const background = new Sprit({
    position:{
        x: 0,
        y: 0
    },
    imageSrc: './images/background.png'
})

const shop = new Sprit({
    position:{
        x: 600,
        y: 128
    },
    imageSrc: './images/shop.png',
    scale : 2.75,
    framesMax : 6,
})

const player = new Fighter({
    position: {
        x: 0,
        y: 0
    },
    velocity: {
        x: 0,
        y: 0
    },
    offset:{
        x:0,
        y:0 
    },
    imageSrc: './images/samuraiMack/idle.png',
    framesMax : 8,
    scale : 2.5,
    offset: {
        x: 215,
        y: 157
    },
    sprites: {
        idle: {
            imageSrc: './images/samuraiMack/idle.png',
            framesMax: 8,
        },
        run : {
            imageSrc: './images/samuraiMack/run.png',
            framesMax: 8,
        },
        jump : {
            imageSrc: './images/samuraiMack/jump.png',
            framesMax: 2,
        },
        fall : {
            imageSrc: './images/samuraiMack/Fall.png',
            framesMax: 2,
        },
        attack1 : {
            imageSrc: './images/samuraiMack/Attack1.png',
            framesMax: 6,
        },
        takeHit : {
            imageSrc: './images/samuraiMack/Take Hit - white silhouette.png',
            framesMax: 4,
        },
        death : {
            imageSrc: './images/samuraiMack/Death.png',
            framesMax: 6,
        }  
    },
    attackBox: {
        offset:{
            x: 100,
            y: 50
        },
        width : 160,
        height : 50
    }
});


const enemy = new Fighter({
    position: {
        x: 400,
        y: 100
    },
    velocity: {
        x: 0,
        y: 0
    },
    color:'blue',
    offset:{
        x:-50,
        y:0 
    },
    imageSrc: './images/kenji/idle.png',
    framesMax : 4,
    scale : 2.5,
    offset: {
        x: 215,
        y: 167
    },
    sprites: {
        idle: {
            imageSrc: './images/kenji/idle.png',
            framesMax: 4,
        },
        run : {
            imageSrc: './images/kenji/run.png',
            framesMax: 8,
        },
        jump : {
            imageSrc: './images/kenji/jump.png',
            framesMax: 2,
        },
        fall : {
            imageSrc: './images/kenji/Fall.png',
            framesMax: 2,
        },
        attack1 : {
            imageSrc: './images/kenji/Attack1.png',
            framesMax: 4,
        },
        takeHit : {
            imageSrc: './images/kenji/Take Hit.png',
            framesMax: 3,
        },
        death : {
            imageSrc: './images/kenji/Death.png',
            framesMax: 7,
        }
    },
    attackBox: {
        offset:{
            x: -160,
            y: 50
        },
        width : 160,
        height : 50
    }
});

console.log(enemy);

const keys = {
    a: {
        pressed: false
    },
    d: {
        pressed: false
    },
    ArrowLeft: {
        pressed: false
    },
    ArrowRight:{
        pressed: false
    }

}


decreaseTimer();

let lastKey;

function animate(){
    window.requestAnimationFrame(animate) // recursion
    c.fillStyle = 'black';
    c.fillRect(0, 0, canvas.width, canvas.height);
    background.update();
    shop.update();
    player.update();
    enemy.update();

    //default velocity if no key is pressed
    //player movement
    player.velocity.x = 0;
    enemy.velocity.x = 0;
    
    if(keys.a.pressed &&  player.lastKey === 'a'){
        player.velocity.x = -5
        player.switchSprite('run')
    }
    else if(keys.d.pressed &&  player.lastKey === 'd'){
        player.velocity.x = 5
        player.switchSprite('run')
    }
    else{
        player.switchSprite('idle')
    }
    // jumping and falling
    if(player.velocity.y < 0){
        player.switchSprite('jump')
    } else if(player.velocity.y > 0){
        player.switchSprite('fall')
    }
    
    //enemy movement
    
    if(keys.ArrowLeft.pressed && enemy.lastKey === 'ArrowLeft'){
        enemy.velocity.x = -5;
        enemy.switchSprite('run')
    }
    else if(keys.ArrowRight.pressed && enemy.lastKey === 'ArrowRight'){
        enemy.velocity.x = 5;
        enemy.switchSprite('run')
    }
    else{
        enemy.switchSprite('idle')
    }

    //enemy jumping 
    if(enemy.velocity.y < 0){
        enemy.switchSprite('jump')
    } else if(enemy.velocity.y > 0){
        enemy.switchSprite('fall')
    }

    // detect for the collision & enemy take hit
    if(
        collision({
            rectangle1 : player,
            rectangle2 : enemy
        }) &&
        player.isAttacking && player.framesCurrent === 4
    ){  
        enemy.takeHit()
        player.isAttacking = false;
        document.querySelector('#enemyHealth').style.width = enemy.health + '%';
        //console.log(' player attack');
    }

    //if player misses
    if(player.isAttacking && player.framesCurrent === 4){
        player.isAttacking = false
    }

    // player gets hit

    if(
        collision({
            rectangle1 : enemy,
            rectangle2 : player
        }) &&
        enemy.isAttacking && enemy.framesCurrent == 2
    ){
        player.takeHit()
        enemy.isAttacking = false;
        //console.log(' enemy attack');
        
        document.querySelector('#playerHealth').style.width = player.health + '%';
        
    }
    // if enemy misses
    if(enemy.isAttacking && enemy.framesCurrent === 2){
        enemy.isAttacking = false
    }

    // end game state
    if(enemy.health <= 0 || player.health <= 0) {
        determineWinner({player, enemy, timerId})
    }
}

animate();

window.addEventListener('keydown', (event) => {
    //console.log(event.key)
    if(!player.dead){
    switch(event.key){
        case 'd':
            keys.d.pressed = true;
            player.lastKey = 'd';
            break;
        case 'a':
            keys.a.pressed = true;
            player.lastKey = 'a';
            break;
        case 'w':
            player.velocity.y = -10;
            break;
        case ' ':
            player.attack();
            break;
    }
    }   
    if(!enemy.dead){

    switch(event.key){  
        case 'ArrowRight':
            keys.ArrowRight.pressed = true;
            enemy.lastKey = 'ArrowRight';
            break;
        case 'ArrowLeft':
            keys.ArrowLeft.pressed = true;
            enemy.lastKey = 'ArrowLeft';
            break;
        case 'ArrowUp':
            enemy.velocity.y = -10;
            break;
        case 'ArrowDown':
            enemy.attack();
            break;
    }
}
});

window.addEventListener('keyup', (event) => {
    switch(event.key){
        case 'd':
            keys.d.pressed = false;
            break;
        case 'a':
            keys.a.pressed = false;
            break;

        case 'ArrowRight':
            keys.ArrowRight.pressed = false;
            break;
        case 'ArrowLeft':
            keys.ArrowLeft.pressed = false;
            break;

    }
});