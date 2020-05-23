/*initial variable declarations. These are the global variables to be used by different functions*/
//canvas to store the element of type canvas
var canvas;

//to store the 2d context of the canvas element
var ctx;
//to store the width of the canvas
var w;
//to store the height of the canvas
var h;
//to store whether to start animation or not
var shouldAnimate=true;
//to store distance moved my our player in the current run
var distance=0;
//to  store a list of colors that our blocks can have.
var colorarr=['pink','blue','yellow','green','black','red','orange'];
//to store the number of assets loaded till now
var assets_count=0;
//to store the index corresonding to the current monster
var current_monster=0;
//to store the index corresponidng to the current background
var current_background=0;
//to store the interval after which a new block will be generated
var interval_block=900;
//to store the timestamp of previous generation of the block
var prevtimestamp=0;

/* Animation object takes care of all the animation corresponding to loading of the animation assets
Displaying our friendly monster and displaying the sprite sheet if used.
*/ 
var Animation={    

    //count:0,
    
    //delay:15,
    
    //frameindex:0,
    
    //flying:false,
    
    monster_images:[],
    
    background_images:[],

    load(){
        console.log("Assets Count = ",assets_count);
        
        console.log("loading assets !!")
        
        for(var i=1;i<=40;i++)
        {
            this.monster_images.push(new Image());
        
            this.monster_images[i-1].src=i+".png";
        
            this.monster_images[i-1].onload=()=>{
        
                assets_count++;
        
                if(assets_count==43)        {
        
                    setup();
        
                }
            }
        }
    
        for(var i=1;i<=3;i++)
        {
            this.background_images.push(new Image());
    
            this.background_images[i-1].src=i+"b.png"
    
            this.background_images[i-1].onload=()=>{
    
                assets_count++;
    
                if(assets_count==43)            {
            
                    setup();
            
                }
            }
        }
        
    },

    drawmonster(){
    
        ctx.drawImage(this.monster_images[current_monster],100,75,300,300,monster.x,monster.y,monster.width,monster.height)
    
    },
    
    // change(flying_status){
    //     this.count=0;
    //     this.flying=flying_status;
    // },

    // update(){    
    //     this.count++;
    //     if(this.count>this.delay)
    //         this.frameindex++;        
    // }

}

var monster={
    
    x:10,
    
    y:260,
    
    width:50,
    
    color:render,
    
    height:50,
    
    xspeed:0,
    
    yspeed:0,
    
    jumpSpeed:-2
}

var obstructions=[];


var controller={
    
    previous_key_state:true,

    keyUpDown(event){
    
        if(event.keyCode==38){
    
            if(event.type=="keydown")
    
                current_key_state=true;
        
            else

                current_key_state=false;
        
            if(this.previous_key_state!=current_key_state)            {

                monster.yspeed=monster.jumpSpeed;

                //Animation.change(true)
            }

            this.previous_key_state=current_key_state;
        }
    }

}


function init(){

    canvas=document.querySelector("#myCanvas");

    ctx=canvas.getContext('2d');
    
    w=canvas.width;

    h=canvas.height;
    
    window.addEventListener("keydown", controller.keyUpDown);

    window.addEventListener("keyup", controller.keyUpDown);

    Animation.load();

}

function setup(){

    console.log("Lets Setup our Game !")

    document.getElementById("selectMonster").style.display="block";

    ctx.drawImage(Animation.background_images[current_background],0,0,w,h);

    ctx.drawImage(Animation.monster_images[current_monster],0,0,w,h);
}

function rightMonster(){

    current_monster=(++current_monster<40)?current_monster:0;

    ctx.drawImage(Animation.background_images[current_background],0,0,w,h);

    ctx.drawImage(Animation.monster_images[current_monster],0,0,w,h);
}


function leftMonster(){

    current_monster=(--current_monster>0)?current_monster:39;

    ctx.drawImage(Animation.background_images[current_background],0,0,w,h);

    ctx.drawImage(Animation.monster_images[current_monster],0,0,w,h);
}


function selectMonster(){

    document.getElementById("selectMonster").style.display="none";

    document.getElementById("selectBackground").style.display="block";

    ctx.drawImage(Animation.background_images[current_background],0,0,w,h);
}


function rightBackground(){

    current_background=(++current_background<3)?current_background:0;

    ctx.drawImage(Animation.background_images[current_background],0,0,w,h);
}


function leftBackground(){

    current_background=(--current_background>0)?current_background:2;

    ctx.drawImage(Animation.background_images[current_background],0,0,w,h);
}


function selectBackground(){

    document.getElementById("selectBackground").style.display="none";

    window.requestAnimationFrame(mainloop);
}


function newElement(){

    var y_rel=(Math.random()>0.5)?(monster.y+0.3*h*Math.random()):(monster.y-0.3*h*Math.random())

    obstruct={
        
        width:2*(Math.random()*10+8),

        height:40*Math.random(),                

        x:w-16,

        y:(y_rel>(h-20))?(h-20):y_rel,

        color:colorarr[Math.floor(Math.random()*colorarr.length)],

        speed:-3

    }

    obstructions.push(obstruct);
}

function mainloop(timestamp){

    ctx.clearRect(0,0,w,h);
    
    if(distance%100==0)
        interval_block-=20;

    if(timestamp-prevtimestamp>interval_block)
    {
        newElement();
        prevtimestamp=timestamp;
    }   
    render()
    
    if(shouldAnimate)
    {
        requestAnimationFrame(mainloop);
    }

    //Animation.update();
}


function render(){
        
    drawBackground();

    Animation.drawmonster();

    drawElements();

    showScore();

    collisionTest();
    
    movemonster();

    moveElements();
}

function drawBackground(){

    ctx.drawImage(Animation.background_images[current_background],0,0,w,h);

}

function showScore(){

    distance+=0.05;
    
    ctx.save();
    
    ctx.fillStyle='black';
    
    ctx.font='15px Arial';
    
    var msg="Distance = "+Math.round(distance);
    
    ctx.fillText(msg,300,20)

}


function movemonster(){

    monster.x+=monster.xspeed;

    monster.y+=monster.yspeed;

    if(monster.y<h-monster.height)
    {
        monster.yspeed+=.05;
    }

    if(monster.y>=h-monster.height)
    {
        //Animation.change(false)

        monster.y=h-monster.height;
    }

    if(monster.y<0)
    {
        monster.y=0;
    }
}
function drawElements(){

    obstructions.forEach(function(obstruct){
    
        ctx.save();
    
        ctx.translate(obstruct.x,obstruct.y);
    
        ctx.fillStyle=obstruct.color;
    
        ctx.fillRect(0,0,obstruct.width,obstruct.height);
    
        ctx.restore();
    
    });
}

function moveElements()
{
    var remove=0;

    obstructions.forEach(function(obstruct)
    {
        obstruct.x+=obstruct.speed;
        
        if(obstruct.x+obstruct.width<0)

            remove++;
    });

    obstructions=obstructions.slice(remove);
}


function collisionTest(){

    obstructions.forEach(function(obstruct)    {

        if((monster.x+monster.width)>=obstruct.x&& monster.x<=(obstruct.x+obstruct.width))        {

            if((monster.y+monster.height)>=obstruct.y&& monster.y<=(obstruct.y+obstruct.height))                {

                printLoser();

            }
        }
    });
}


function printLoser(){

    ctx.strokeStyle='black';
    
    ctx.font="40px Arial";
    
    ctx.strokeText("GAME OVER", 110,100);
    
    shouldAnimate=false;
    
    div=document.querySelector("#ButtonDiv");
    
    div.classList.add('disBlock');
}

function resetGame(){

    div.classList.remove('disBlock');

    shouldAnimate=false;

    ctx.clearRect(0,0,w,h);

    obstructions=[];

    shouldAnimate=true;

    distance=0;

    interval_block=900;

    mainloop();
}

window.onload=init;

