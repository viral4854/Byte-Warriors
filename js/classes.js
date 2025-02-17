class Sprit{
    constructor({position, imageSrc, scale = 1}){
        this.position = position
        this.width = 50
        this.height = 150
        this.image = new Image()
        this.image.src = imageSrc
        this.scale = scale
    }

    draw(){
        c.drawImage(this.image, this.position.x, this.position.y, this.image.width * this.scale, this.image.height * this.scale)

    }
    update(){
        this.draw()
    }
}

class Fighter {
    constructor({position, velocity, color = 'red', offset}){                   // constructor - function within the class
        this.position = position;
        this.velocity = velocity;
        this.width = 50;
        this.height = 150;
        this.lastKey;
        this.attackBox = {
            position: {
                x : this.position.x,
                y : this.position.y
            },
            offset,
            width: 100,
            height: 50
        }
        this.color = color;
        this.isAttacking;
        this.health = 100

    }

    draw(){
        c.fillStyle = this.color;  // giving our rectangle a color 
        c.fillRect(this.position.x, this.position.y, this.width, this.height) // at x and y cordinate and 50px wide and 150px tall

        //attack box while attacking
        if(this.isAttacking){
            c.fillStyle = 'green';
            c.fillRect(
                this.attackBox.position.x,
                this.attackBox.position.y,
                this.attackBox.width,
                this.attackBox.height
            )
        }
    }

    update(){
        this.draw();
        this.attackBox.position.x = this.position.x + this.attackBox.offset.x;
        this.attackBox.position.y = this.position.y; 

        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;


        if(this.position.y + this.height + this.velocity.y >= canvas.height - 96){
            this.velocity.y = 0; // as we go down the height increase, so when is bigger than canvas' we stop
            
        }
        else{
            this.velocity.y += gravity;
        }
    }

    attack(){
        this.isAttacking = true;
        setTimeout(()=>{
            this.isAttacking = false;
        }, 100)
    }
}