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
    //enemy.update();

    //default velocity if no key is pressed
    //player movement
    player.velocity.x = 0;
    if(keys.a.pressed &&  player.lastKey === 'a'){
        player.velocity.x = -5;
    }
    else if(keys.d.pressed &&  player.lastKey === 'd'){
        player.velocity.x = 5;
    }
    
    //enemy movement
    enemy.velocity.x = 0;
    if(keys.ArrowLeft.pressed && enemy.lastKey === 'ArrowLeft'){
        enemy.velocity.x = -5;
    }
    else if(keys.ArrowRight.pressed && enemy.lastKey === 'ArrowRight'){
        enemy.velocity.x = 5;
    }

    // detect for the collision
    if(
        collision({
            rectangle1 : player,
            rectangle2 : enemy
        }) &&
        player.isAttacking
    ){
        player.isAttacking = false;
        enemy.health -= 20;
        document.querySelector('#enemyHealth').style.width = enemy.health + '%';
        console.log(' player attack');
    }

    if(
        collision({
            rectangle1 : enemy,
            rectangle2 : player
        }) &&
        enemy.isAttacking
    ){
        enemy.isAttacking = false;
        console.log(' enemy attack');
        player.health -= 20;
        document.querySelector('#playerHealth').style.width = player.health + '%';
        
    }

    // end game state
    if(enemy.health <= 0 || player.health <= 0) {
        determineWinner({player, enemy, timerId})
    }
}

animate();

window.addEventListener('keydown', (event) => {
    //console.log(event.key)
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