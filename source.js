/**
 * Created by Алексейка on 16.01.16.
 */
var WIDTH = 800;
var HEIGHT = 600;
var ID = 1;
var canvasInfoStartScreen;
var canvasBackgroundScreen;
var canvasMobTowerBulletScreen;
var ctxBGS;
var ctxMTBS;
var ctxISS;
var MONEY = 0;
var HP = 0;
var offsetX;
var offsetY;
var currentWave = 1;
var background = new Image();
background.src = "sprite.png";
var drag = false;
var blinkText = 17;
var dragTower = {x:0,y:0,id:0};
var angle = 1;
var clickedTower = {idTower:-1, flag:false};
var gameOver = false;
var sprites = [];
var explosions = [];
var ngf;

    function newGameFrame(){
        ctxMTBS.clearRect(0,0,WIDTH,HEIGHT);
        if(drag){
            drawDragTower(ctxMTBS);
        }
        if(clickedTower.flag){
            drawTowerRadius(ctxMTBS,clickedTower.idTower)
        }
        if(gameOver){
            reset();
            document.getElementById('canvasInfoStartScreen').style.backgroundColor = "cornflowerblue";
            cancelAnimationFrame(ngf);
            canvasInfoStartScreen.removeEventListener("mousedown", mouseDown, false);
            canvasInfoStartScreen.removeEventListener("mouseup", mouseUp, false);
            newGameFrame = undefined;
            drawGameOverScreen(ctxISS);
        }
        if(blinkText < 17){
            drawBlinkText(ctxISS,blinkText);
        }
        draw();
        drawHPBars(ctxMTBS);
        drawExplosions(ctxMTBS);
        update();
        LVLtracker();
        cleanBullets();
        cleanMobs();
        cleanExplosions();
        ngf = window.requestAnimationFrame(function(){newGameFrame();});
    }

    function  drawExplosions(ctx){
        ctx.save();
        ctx.beginPath();
        var sprite = sprites[2];
        for(var i = 0; i < explosions.length; i++){
            if((sprite.length - 1 <= explosions[i].current) || explosions[i].current == -1){
                explosions[i].current = -1;
                continue;
            }
            var src = sprite[explosions[i].current];
            ctx.drawImage(background,src.x,src.y,src.w,src.h,explosions[i].x - src.w/2,
                explosions[i].y - src.h/2,src.w,src.h);
            explosions[i].current++;
        }
    }

    function cleanExplosions(){
        for(var i = 0; i < explosions.length;i++){
            if(explosions[i].current == -1) {
                explosions.splice(i,1);
            }
        }
    }

    function init(){
        drawAndInitListeners();
        loadMobs();
        loadMaps();
        loadTowers();
        loadSprites();
        drawBackScreen(ctxBGS);
        drawSS(ctxISS);
    }

    function mouseDown(event){
        var x = event.x - offsetX;
        var y = event.y - offsetY;
        var temp = checkShowDecs(x,y);
       if(temp != -1){
           drag = true;
       }
       if(drag){
           checkTowerClick(x,y);
           dragTower.x = temp.x;
           dragTower.y = temp.y;
           dragTower.id = temp.id;
           canvasInfoStartScreen.addEventListener("mousemove", mouseMove, false);
       }
    }

    function loadSprites(){
        var path = [];
        var b1 = {x:805,y:94,w:26,h:25};
        var b2 = {x:805,y:122,w:23,h:21};
        var b3 = {x:809,y:146,w:17,h:21};
        var b4 = {x:809,y:170,w:18,h:21};
        var b5 = {x:804,y:194,w:25,h:26};
        var b6 = {x:804,y:223,w:25,h:26};
        var b7 = {x:805,y:252,w:23,h:21};
        var b8 = {x:805,y:276,w:23,h:21};
        path.push(b1);
        path.push(b2);
        path.push(b3);
        path.push(b4);
        path.push(b5);
        path.push(b6);
        path.push(b7);
        path.push(b8);
        sprites.push(path);
        path = [];
        b1 =  {x:897,y:9,w:22,h:16};
        b2 =  {x:922,y:9,w:15,h:43};
        b3 =  {x:960,y:9,w:15,h:62};
        b4 =  {x:978,y:8,w:10,h:63};
       // b5 =  {x:991,y:7,w:12,h:64};
        //b6 =  {x:1010,y:13,w:3,h:58};
        //b7 =  {x:1016,y:14,w:5,h:57};
        path.push(b1);
        path.push(b2);
        path.push(b3);
        path.push(b4);
       // path.push(b5);
        sprites.push(path);
        path = [];
        b1 =  {x:897,y:59,w:34,h:35};
        b2 =  {x:897,y:97,w:29,h:29};
        b3 =  {x:901,y:129,w:25,h:25};
        b4 =  {x:897,y:157,w:27,h:31};
        b5 =  {x:894,y:228,w:36,h:37};
        b6 =  {x:894,y:308,w:37,h:43};
        b7 =  {x:895,y:405,w:39,h:45};
        b8 =  {x:898,y:502,w:38,h:47};
        b9 =  {x:852,y:112,w:37,h:52};
        path.push(b1);
        path.push(b2);
        path.push(b3);
        path.push(b4);
        path.push(b5);
        path.push(b6);
        path.push(b7);
        path.push(b8);
        path.push(b9);
        sprites.push(path);
        path = [];
        path.push({x:991,y:86,w:16,h:16});
        path.push({x:1009,y:86,w:16,h:16});
        path.push({x:1027,y:86,w:16,h:16});
        path.push({x:1045,y:86,w:16,h:16});
        path.push({x:1063,y:86,w:16,h:16});
        path.push({x:1081,y:86,w:16,h:16});
        path.push({x:1099,y:86,w:16,h:16});
        path.push({x:1117,y:86,w:16,h:16});
        sprites.push(path);
    }

    function mouseUp(event){
        var x = event.x - offsetX;
        var y = event.y - offsetY;
        checkTowerClick(x,y);
        if(drag){
            clickedTower.flag = false;
            drag = false;
            canvasInfoStartScreen.removeEventListener("mousemove", mouseMove, false);
            if(checkInBuildRange(x,y)){
                if(subMoney(allTowersType[dragTower.id].cost)){
                    var tower = clone(allTowersType[dragTower.id]);
                    tower.x = x;
                    tower.y = y;
                    allSpawnedTowers.push(tower);
                    updateMoney(ctxISS);
                }
                else {
                    blinkText = 1;
                }
            }else  console.log("Башню низя поставить, Она не в ренже");
        }
        checkShowDecs(x,y,1);

    }

    function mouseMove(event){
       var x = event.x - offsetX;
       var y = event.y - offsetY;
        if(!(x < 1 || x > 799 || y < 1 || y > 599)){
            dragTower.x = x;
            dragTower.y = y;
        }
    }

    function drawBlinkText(ctx,blink){
        if(blink == 16){
            ctx.save();
            ctx.font = '20px Comic Sans MS';
            ctx.fillStyle = "#003319";
            ctx.fillText('Money: ' + MONEY, 650, 110);
            ctx.restore();
            blinkText++;
            return;
        }
        else if(blink == 1){
            ctx.clearRect(650,90,110,27);
            ctx.save();
            ctx.fillStyle = 'red';
            ctx.font = '20px Comic Sans MS';
            ctx.fillText('Money: ' + MONEY, 650, 110);
            ctx.restore();
            blinkText++;
        }
        if(blink % 8 == 0){
            ctx.clearRect(650,90,110,27);
            ctx.save();
            ctx.fillStyle = 'red';
            ctx.font = '20px Comic Sans MS';
            ctx.fillText('Money: ' + MONEY, 650, 110);
            ctx.restore();
            blinkText++;
        }else{
            ctx.clearRect(650,90,110,27);
            blinkText++;
        }

    }

    function drawBackScreen(ctx){
        ctx.clearRect(0,0,WIDTH,HEIGHT);
        ctx.drawImage(background,0,0,800,600,0,0,800,600);
    }

    function drawTowers(ctx){
        ctx.save();
        ctx.beginPath();
        for(var i = 0; i < allSpawnedTowers.length; i++){
            var src = allSpawnedTowers[i].source;
            ctx.drawImage(background,src[0],src[1],src[2],src[3],allSpawnedTowers[i].x-19,
                allSpawnedTowers[i].y-19,src[2],src[3]);
        }
        ctx.restore();
    }

    function drawMobs(ctx){
        /*
        ctx.save();
        ctx.beginPath();
        ctx.fillStyle="blue";
        for(var i = 0; i < allSpawnedMobs.length; i++){
            ctx.arc(allSpawnedMobs[i].x, allSpawnedMobs[i].y, 10, 0, Math.PI*2);
            ctx.closePath();
            console.log(allSpawnedMobs[i].way);
        }
        ctx.fill();
        ctx.restore();
        */
        ctx.save();
        ctx.beginPath();
        var sprite = sprites[3];
        for(var i = 0; i < allSpawnedMobs.length; i++){
            var mobWay = allSpawnedMobs[i].way;
            if(mobWay == "up"){
                if(allSpawnedMobs[i].current == 1){
                    var src = sprite[2];
                    allSpawnedMobs[i].current = 0;
                }
                else{
                    src = sprite[3];
                    allSpawnedMobs[i].current = 1;
                }
            } else if (mobWay == "right"){
                if(allSpawnedMobs[i].current == 1){
                    src = sprite[6];
                    allSpawnedMobs[i].current = 0;
                }
                else{
                    src = sprite[7];
                    allSpawnedMobs[i].current = 1;
                }
            } else if (mobWay == "down"){
                if(allSpawnedMobs[i].current == 1){
                    src = sprite[4];
                    allSpawnedMobs[i].current = 0;
                }
                else{
                    src = sprite[5];
                    allSpawnedMobs[i].current = 1;
                }
            } else if (mobWay == "left"){
                if(allSpawnedMobs[i].current == 1){
                    src = sprite[0];
                    allSpawnedMobs[i].current = 0;
                }
                else{
                    src = sprite[1];
                    allSpawnedMobs[i].current = 1;
                }
            }
            ctx.drawImage(background,src.x,src.y,src.w,src.h,allSpawnedMobs[i].x - src.w/2,
                allSpawnedMobs[i].y - src.h/2,src.w,src.h);
        }
        ctx.restore();
    }

    function drawBullets(ctx){
        ctx.save();
        ctx.beginPath();
        var sprite = sprites[0];
        for(var i = 0; i < allBullets.length; i++){
            if(sprites[0].length - 1 == allBullets[i].current){
                allBullets[i].current = 0;
            }

            var src = sprite[allBullets[i].current];
            ctx.drawImage(background,src.x,src.y,src.w,src.h,allBullets[i].x - src.w/2,
                allBullets[i].y - src.h/2,src.w,src.h);
            allBullets[i].current++;

        }
        ctx.restore();
        sprite = sprites[1];
        for(i = 0; i < allLightnings.length; i++){
            if(sprites[1].length - 1 == allLightnings[i].cast){
                allLightnings.splice(i,1);
                continue;
            }
            ctx.save();

            src = sprite[allLightnings[i].cast];
           // console.log(allLightnings[i].x + " " + allLightnings[i].y);
            ctx.translate(allLightnings[i].x, allLightnings[i].y);
            ctx.rotate(allLightnings[i].angle);
          //  ctx.drawImage(background,src.x,src.y,src.w,src.h,allLightnings[i].x - src.w/2,
          //      allLightnings[i].y - src.h/2,src.w,src.h);
            ctx.drawImage(background, src.x,src.y,src.w,src.h,0,0,src.w,allLightnings[i].dist);
            //ctx.drawImage(background,src.x,src.y,src.w,src.h,allLightnings[i].x - src.w/2,
             //   allLightnings[i].y - src.h/2,src.w,src.h);
            allLightnings[i].cast++;
            ctx.restore();
        }
    }

    function drawDragTower(ctx){
        ctx.save();
        var src = allTowersType[dragTower.id].source;
        ctx.drawImage(background,src[0],src[1],src[2],src[3],dragTower.x-19,dragTower.y-19,src[2],src[3]);
        if(dragTower.x < 583){
            ctx.beginPath();
            ctx.lineWidth = 2;
            ctx.strokeStyle = 'yellow';
            ctx.setLineDash([10, 10]);
            ctx.arc(dragTower.x,dragTower.y,allTowersType[dragTower.id].range,0,Math.PI*2,false);
            ctx.stroke();
            var path = allMaps[currentMap].towerArea;
            for(var i = 0; i < path.length; i++){
                ctx.beginPath();
                ctx.setLineDash([15, 5]);
                ctx.strokeStyle = 'red';
                ctx.rect(path[i].x1,path[i].y1,path[i].x2 - path[i].x1, path[i].y2 - path[i].y1);
                ctx.stroke();
            }

         }
        ctx.restore();
    }

    function drawTowerRadius(ctx,id){
        angle+=0.5;
        if(angle > 359) angle = 1;
        ctx.save();
        ctx.translate(allSpawnedTowers[id].x, allSpawnedTowers[id].y);
        ctx.rotate(angle * Math.PI / 180);
        ctx.beginPath();
        ctx.lineWidth = 2;
        ctx.strokeStyle = 'yellow';
        ctx.setLineDash([10, 10]);
        ctx.arc(0,0,allSpawnedTowers[id].range,0,Math.PI*2,false);
        ctx.stroke();
        ctx.restore();
    }

    function drawHPBars(ctx){
        ctx.save();
        ctx.beginPath();
        ctx.fillStyle="#FF0000";
        ctx.strokeStyle = 'black';
        for(var i = 0; i < allSpawnedMobs.length; i++) {
            ctx.lineWidth = 0;
            var now = allSpawnedMobs[i].currentHp;
            var max = allSpawnedMobs[i].maxHp;
            if(now == max) continue;
            ctx.fillRect(allSpawnedMobs[i].x - 15, allSpawnedMobs[i].y + 10, (now / max) * 30, 5);
            ctx.lineWidth = 1;
            ctx.rect(allSpawnedMobs[i].x - 15,allSpawnedMobs[i].y + 10,30,5);
        }
        ctx.stroke();
        ctx.restore();
    }

    function drawGameOverScreen(ctx,value){
        var value = value || 0;
        var y = HEIGHT/2;
        ctx.clearRect(0, 0, WIDTH, HEIGHT);
        ctx.fillStyle = 'black';
        ctx.font = '60px Georgia';
        if(value == 0){
            centerText(ctx,'Game over', 0, y);
        }
        else if( value == 1){
            centerText(ctx,'Victory', 0, y);
        }

        window.requestAnimationFrame(function(){drawGameOverScreen(ctx,value);});
    }

    function addMoney(addmoney){
        MONEY += addmoney;
        updateMoney(ctxISS);
    }

    function subMoney(value){
        var temp = MONEY - value;
        if(temp < 0) return false;
        else {
            MONEY -= value;
            return true;
        }
    }

    function subLife(damage){
        HP -= damage;
        if(HP <= 0){
            gameOver = true;
        }
        updateHP(ctxISS);
    }

    function alertObj(obj) {
        var str = "";
        for(k in obj) {
            str += k+": "+ obj[k]+"\r\n";
        }
        alert(str);
    }

    function loadMobs(){
          new Mob(100,100,1,30,2);
          new Mob(501,501,1001,301,21);
          new Mob(502,501,1002,302,22);
    }

    function update(){
        updateTowers();
        updateMobs();
        updateBullets();
    }

    function draw(){
         drawTowers(ctxMTBS);
         drawMobs(ctxMTBS);
         drawBullets(ctxMTBS);
    }

    function drawAndInitListeners(){
        canvasInfoStartScreen = document.getElementById('canvasInfoStartScreen');
        canvasBackgroundScreen =  document.getElementById('canvasBackGroundScreen');
        canvasMobTowerBulletScreen =  document.getElementById('canvasMobTowerBulletScreen');
        ctxBGS = canvasBackgroundScreen.getContext('2d');
        ctxISS = canvasInfoStartScreen.getContext('2d');
        ctxMTBS = canvasMobTowerBulletScreen.getContext('2d');
        offsetX = canvasInfoStartScreen.offsetLeft;
        offsetY = canvasInfoStartScreen.offsetTop;
        canvasInfoStartScreen.addEventListener("click",function(){
            if(!startGame) {
                startGame = true;
                canvasInfoStartScreen.removeEventListener("click", mouseMove, false);
            }

        });
        canvasInfoStartScreen.addEventListener("mousedown",function(e){
            checkShowDecs(e.x - offsetX,e.y - offsetY,1);
            mouseDown(e);
        });
        canvasInfoStartScreen.addEventListener("mouseup",function(e){
            mouseUp(e);
        });
    }

    function clone(original){
            var clone = {} ;
            var i , keys = Object.getOwnPropertyNames( original ) ;
            for ( i = 0 ; i < keys.length ; i ++ ){
                clone[ keys[ i ] ] = original[ keys[ i ] ] ;
            }
            return clone ;
        }
		
		/**
 * Created by Алексейка on 17.01.16.
 */
var allBullets = [];
var allLightnings = [];

function Bullet(x,y,dmg,speed,id){
    this.id = ID++;
    this.x = x;
    this.y = y;
    this.size = 3;
    this.damage = dmg;
    this.speed = speed;
    this.destinationID = id;
    this.destinationX = 0;
    this.destinationY = 0;
    this.current = 0;
    allBullets.push(this);
}

function updateBullets(){
    var x0,y0,x1,y1;
    for (var i = 0; i < allBullets.length; i++) {
        var destination = allBullets[i].destinationID;
         x0 = allBullets[i].x;
         y0 = allBullets[i].y;
        if(destination == -1){
            x1 = allBullets[i].destinationX;
            y1 = allBullets[i].destinationY;
        } else {
            x1 = allSpawnedMobs[allBullets[i].destinationID].x;
            y1 = allSpawnedMobs[allBullets[i].destinationID].y;
        }
        var speed = allBullets[i].speed;
        var length = Math.sqrt((x1 - x0) * (x1 - x0) + (y1 - y0) * (y1 - y0));

        allBullets[i].x += (x1 - x0) * speed  / length;
        allBullets[i].y += (y1 - y0) * speed / length;
    }
    checkBulletHit();
}

    function checkBulletHit(){
        var x0,y0,x1,y1,dist;
        for(var i =0; i < allBullets.length; i++){//для каждой пулi
             x0 = allBullets[i].x;
             y0 = allBullets[i].y;
            // тут быстрая проверка а вдруг пуля долетела уже до финала.i
            if( allBullets[i].destinationID == -1){
                 x1 = allBullets[i].destinationX;
                 y1 = allBullets[i].destinationY;
                 dist = 5;
                if(Math.abs(x0 - x1) < dist && Math.abs(y0 - y1) < dist){
                    // прощай пуля ты никого не попала и умерла .
                    console.log("прощай пуля ты никого не попала");
                    allBullets[i].id = -1;
                    continue;
                }
            }

            for(var j = 0; j < allSpawnedMobs.length; j++){//для каждого моба
                if(allSpawnedMobs[j].id == 0) continue;//а вдруг моб уже мертв? вдруг след попала снова в него?
                 x1 = allSpawnedMobs[j].x;
                 y1 = allSpawnedMobs[j].y;
                 dist = allSpawnedMobs[j].size;//считаем если столкновение.
                if(Math.abs(x0 - x1) < dist && Math.abs(y1 - y0) < dist){
                    if((damageMob(j,allBullets[i].damage)) == 1){
                        //моб продамажился и не умер.
                        console.log("моб продамажился и не умер. А пуля гуф");
                        allBullets[i].id = -1;
                        explosions.push({x:allBullets[i].x,y:allBullets[i].y,current:0});
                        break; //выходим из цикла с мобами. Пуля попала но не убила.
                    } else {
                        allBullets[i].id = -1;//все равно убиваем пулю.
                        explosions.push({x:allBullets[i].x,y:allBullets[i].y,current:0});
                        console.log("моб продамажился и умер. как и пуля");
                        allSpawnedMobs[j].id = 0;//тут еще убиваем моба.
                        //но вдруг еще есть пули которые летят в этого моба, им надо поменять назначение
                        mobDeadUpdateID(j);
                        break;//пуля попала и убила моба нету смысла проверять остальных
                        //моб продамажился и умер.
                    }
                }
            }
        }
    }

    function cleanBullets(){
        for(var i = 0; i < allBullets.length;i++){
            if(allBullets[i].id == -1) {
                allBullets.splice(i,1);
            }
        }
    }

    function  cleanMobs() {
        for (var i = 0; i < allSpawnedMobs.length; i++) {
            if (allSpawnedMobs[i].id == 0) {
                allSpawnedMobs.splice(i,1);
            }
        }
    }

function mobDeadUpdateID(id){
    for(var i = 0; i < allBullets.length; i++){
        if (allBullets[i].destinationID == id){
            allBullets[i].destinationID = -1;
            allBullets[i].destinationX = allSpawnedMobs[id].x;
            allBullets[i].destinationY = allSpawnedMobs[id].y;
        }
    }
}
/*
function killBullet(id){
    for(var i = 0 ; i < allBullets.length;i++){
        if(allBullets[i].id == id){
                allBullets.splice(i,1);
            }
    }
}*/

function checkBulletsHit(){
    for(var i = 0; i < allBullets.length; i++){
        var id = allBullets[i].destinationID;
        var x1 = allBullets[i].x;
        var y1 = allBullets[i].y;
        if(id == -1){ //если моба нет то мі летим в точку где он был.
            var flag = false;
            for( var j = 0; j < allSpawnedMobs.length; j++){ //И проверяем на все столкновения со свеми мобами.
                var x2 = allSpawnedMobs[j].x;
                var y2 = allSpawnedMobs[j].y;
                var dist = allSpawnedMobs[j].size;
                if(Math.abs(x1 - x2) < dist && Math.abs(y1 - y2) < dist){
                    if(damageMob(j,allBullets[i].damage)){
                        killBullet(allBullets[i].id);//убиваем пулю если она нашла цель и дамажим
                        flag = true;
                        break;
                    }
                }
            }
            if(!flag){
                //летим дальше если нет столкновения  с врагом.
                var x2 = allBullets[i].destinationX;
                var y2 = allBullets[i].destinationY;
                var dist = 1;
                if(Math.abs(x1 - x2) < dist && Math.abs(y1 - y2) < dist){
                    if(damageMob(id,allBullets[i].damage))killBullet(allBullets[i].id);
                }
            }
        }
        else{ // если моб есть то тупо летим к нему
            var x2 = allSpawnedMobs[id].x;
            var y2 = allSpawnedMobs[id].y;
            var dist = allSpawnedMobs[id].size;
            if(Math.abs(x1 - x2) < dist && Math.abs(y1 - y2) < dist){
                if(damageMob(id,allBullets[i].damage))killBullet(allBullets[i].id);
            }
        }
    }
}



/**
 * Created by Алексейка on 24.01.16.
 */
    var infoScreen = [];

    function wrapText(context, text, marginLeft, marginTop, maxWidth, lineHeight){
        var words = text.split(" ");
        var countWords = words.length;
        var line = "";
        for (var n = 0; n < countWords; n++) {
            var testLine = line + words[n] + " ";
            var testWidth = context.measureText(testLine).width;
            if (testWidth > maxWidth) {
                context.fillText(line, marginLeft, marginTop);
                line = words[n] + " ";
                marginTop += lineHeight;
            }
            else {
                line = testLine;
            }
        }
        context.fillText(line, marginLeft, marginTop);
    }

    function updateDescription(ctx,text){
        ctx.font="16px Comic Sans MS";
        ctx.fillStyle = "#003319";
        ctx.clearRect(645,355,115,195);
        text += " ";
        wrapText(ctx,text,650,373,120,20);
    }

    //тайп - переменная которая отвечает - отрисовывать инфу по башне или нет.
    function checkShowDecs(x,y,type){
        type = type || 0;
        for( var i = 0; i < infoScreen.length; i++){
            var x1 = infoScreen[i].X1;
            var x2 = infoScreen[i].X2;
            var y1 = infoScreen[i].Y1;
            var y2 = infoScreen[i].Y2;
            if(x1 <= x && x <= x2 && y1 <= y && y <= y2){
                if(i < allTowersType.length){
                if(type) updateDescription(ctxISS,allTowersType[i].desc);
                return {x:Math.round((x1+x2)/2),y:Math.round((y1+y2)/2),id:i};
                } else return -1;
            }
        }
        return -1;
    }

    function updateHP(ctx){
        ctx.clearRect(686,65,50,25);
        ctx.save();
        ctx.font = '20px Comic Sans MS';
        ctx.fillText(HP, 687, 85);
        ctx.restore();
    }

    function updateMoney(ctx){
        ctx.clearRect(720,90,40,25);
        ctx.save();
        ctx.font = '20px Comic Sans MS';
        ctx.fillText(MONEY, 721, 110);
        ctx.restore();
    }

    function updateWave(ctx){
        ctx.clearRect(650,40,105,25);
        ctx.save();
        ctx.font = '20px Comic Sans MS';
        ctx.fillText('Wave: ' + currentWave + "/" + allMaps[0].levels.length, 650, 60);
        ctx.restore();
    }

    function drawInfoScreen(ctx) {
        ctx.font = '20px Comic Sans MS';
        ctx.fillStyle = "#003319";
        ctx.fillText('Wave: ' + currentWave + "/" + allMaps[0].levels.length, 650, 60);
        ctx.fillText('HP: ' + HP, 650, 85);
        ctx.fillText('Money: ' + MONEY, 650, 110);
        infoScreen.push({X1:644,Y1:193,X2:682,Y2:230});
        infoScreen.push({X1:684,Y1:193,X2:722,Y2:230});
        infoScreen.push({X1:724,Y1:193,X2:761,Y2:230});
        infoScreen.push({X1:644,Y1:233,X2:682,Y2:269});
        infoScreen.push({X1:684,Y1:233,X2:721,Y2:270});
        infoScreen.push({X1:725,Y1:233,X2:761,Y2:270});
        infoScreen.push({X1:644,Y1:274,X2:682,Y2:309});
        infoScreen.push({X1:684,Y1:274,X2:722,Y2:309});
        infoScreen.push({X1:723,Y1:274,X2:761,Y2:309});
        ctx.stroke();
        ctx.drawImage(background,994,147,83,58,58,477,83,58);
        ctx.drawImage(background,1077,147,64,79,465,455,64,79);
        var src = allTowersType[0].source;
        ctx.drawImage(background,src[0],src[1],src[2],src[3],644,193,src[2],src[3]);
        src = allTowersType[1].source;
        ctx.drawImage(background,src[0],src[1],src[2],src[3],684,193,src[2],src[3]);
    }

/**
 * Created by Алексейка on 16.01.16.
 */
var allMaps = [];
var currentMap = 0;
var currentMob = 0;

    function Map(start,levels,towerArea,mobPath,money,hp,totalPath){
        this.start = start;
        this.levels = levels;
        this.towerArea = towerArea.slice();
        this.mobPath = mobPath.slice();
        this.startMoney = money;
        this.startHp = hp;
        this.totalPath = totalPath;
        this.lastSpawn = new Date();
        allMaps.push(this);
    }

    function initLVL(){
        HP = allMaps[currentMap].startHp;
        updateHP(ctxISS);
        MONEY = allMaps[currentMap].startMoney;
        updateMoney(ctxISS);
        updateWave(ctxISS);
    }

    function reset(){
        allBullets = [];
        allSpawnedMobs = [];
        allSpawnedTowers = [];
        explosions = [];
    }

    function LVLtracker(){
         var levelNumber = currentWave - 1;
         var map = allMaps[currentMap];
         var level = map.levels[levelNumber];
        if((currentMob == level.quantity) && (currentWave >= map.levels.length)){
            //check are mobs alive;
            if(allSpawnedMobs.length == 0){
                if(gameOver){ return;}
                reset();
                newGameFrame = undefined;
                document.getElementById('canvasInfoStartScreen').style.backgroundColor = "cornflowerblue";
                cancelAnimationFrame(ngf);
                canvasInfoStartScreen.removeEventListener("mousedown", mouseDown, false);
                canvasInfoStartScreen.removeEventListener("mouseup", mouseUp, false);
                drawGameOverScreen(ctxISS,1);
            }
            else{
                return;
            }


        }
        if(new Date() - map.lastSpawn > level.delay){
            if(currentMob < level.quantity){
                currentMob++;
                spawnMob(level.type);
                allMaps[currentMap].lastSpawn = new Date();
            } else {
                currentWave++;
                updateWave(ctxISS);
                currentMob = 1;
            }
        }

    }

    function loadMaps(){
        var arr =[];
        arr.push({x1:100,y1:500,x2:100,y2:101,wayX:0,direction:"up"});
        arr.push({x1:100,y1:100,x2:496,y2:100,wayX:1,direction:"right"});
        arr.push({x1:497,y1:100,x2:497,y2:500,wayX:0,direction:"down"});
        var area = [{x1:115,y1:115,x2:480,y2:470}];
        var start = {x:100,y:500};
        var levels = [{type:0,quantity:5,delay:1000},{type:0,quantity:10,delay:500}];
        new Map(start,levels,area,arr,100,5, arr.length - 1);
    }

/**
 * Created by Алексейка on 16.01.16.
 */
    var allMobsType = [];
    var allSpawnedMobs = [];

    function Mob(hp,hpMax,speed,moneyCost,dmg){
        this.currentHp = hp;
        this.current = 0;
        this.way = "";
        this.maxHp = hpMax;
        this.speed = speed;
        this.moneyCost = moneyCost;
        this.damage = dmg;
        this.x = 0;
        this.y = 0;
        this.size = 10;
        this.id = 2;
        this.currentPath = 0;
        allMobsType.push(this);
    }

//ретурн 1 если моб жив
    function damageMob(id,hp){
        var currentHP = allSpawnedMobs[id].currentHp;
        currentHP -= hp;
        if(currentHP <= 0) {
            return 0;
        }
        else allSpawnedMobs[id].currentHp = currentHP;
        return 1;
    }



   //моб умер от того что дошел до конца или его убили.
    function killMob(id,flag){
        flag = flag || 1;
        if(flag == -1)  subLife(allSpawnedMobs[id].damage);
        else addMoney(allSpawnedMobs[id].moneyCost);
        mobDeadUpdateID(id);
        allSpawnedMobs[id].id = 0;
    }

function updateMobs(){
    var x0,y0,x1,y1;
    for( var i = 0;  i < allSpawnedMobs.length; i++){
        x0 = allSpawnedMobs[i].x;  // типа все ок
        y0 = allSpawnedMobs[i].y;
        x1 = allMaps[currentMap].mobPath[allSpawnedMobs[i].currentPath].x2;
        y1 = allMaps[currentMap].mobPath[allSpawnedMobs[i].currentPath].y2;
        if(Math.sqrt(Math.pow((x0 - x1),2)+ Math.pow((y1 - y0),2)) < 2){//дошел до конца пути
            if(allSpawnedMobs[i].currentPath == allMaps[currentMap].totalPath){
                killMob(i,-1); //дошел до конца отнять хп.
                continue;
            }
            else{
                allSpawnedMobs[i].currentPath++;
                allSpawnedMobs[i].way = allMaps[currentMap].mobPath[allSpawnedMobs[i].currentPath].direction;
                x0 = allMaps[currentMap].mobPath[allSpawnedMobs[i].currentPath].x1;
                y0 = allMaps[currentMap].mobPath[allSpawnedMobs[i].currentPath].y1;
                x1 = allMaps[currentMap].mobPath[allSpawnedMobs[i].currentPath].x2;
                y1 = allMaps[currentMap].mobPath[allSpawnedMobs[i].currentPath].y2;
            }
        }
        var speed = allSpawnedMobs[i].speed;//подсчет новых х у
        var length = Math.sqrt((x1 - x0) * (x1 - x0) + (y1 - y0) * (y1 - y0));
        allSpawnedMobs[i].x += (x1 - x0) * speed  / length;
        allSpawnedMobs[i].y += (y1 - y0) * speed / length;
    }
}


function spawnMob(id){
        var mob = clone(allMobsType[id]);
        mob.x = allMaps[currentMap].start.x;
        mob.y = allMaps[currentMap].start.y;
        mob.way = allMaps[currentMap].mobPath[0].direction;
        allSpawnedMobs.push(mob);
    }

	/**
 * Created by Алексейка on 24.01.16.
 */
var hueRGB = 0;
var fontSize = 40;
var dirHue = 1;
var dirFont = 1;
var startGame = false;

    function centerText(ctx, text,x, y) {
        var measurement = ctx.measureText(text);
        ctx.fillText(text, (x + (WIDTH - measurement.width)) / 2, y);
    }

    function drawSS(ctx) {
        updateVariables();
        drawStartScreen(ctx);
        if(!startGame){
            ngf =  window.requestAnimationFrame(function(){drawSS(ctx);});
        }
        else{
            ctx.clearRect(0,0,800,600);
            document.getElementById('canvasInfoStartScreen').style.backgroundColor = "transparent";
            drawInfoScreen(ctxISS);
            initLVL();
            cancelAnimationFrame(ngf);
            newGameFrame();

        }
    }

    function updateVariables(){
        hueRGB += dirHue;
        if(hueRGB > 254) dirHue = -1;
        else if(hueRGB == 0) dirHue = 1;
        fontSize += dirFont;
        if(fontSize > 45) dirFont = -0.15;
        else if(fontSize < 38) dirFont = 0.15;
    }

    function drawStartScreen(ctx) {
        var y = HEIGHT  / 2;
        var color2 = 'rgb(' + hueRGB + ',0,0)';
        ctx.clearRect(0, 0, WIDTH, HEIGHT);
        ctx.fillStyle = 'black';
        ctx.font = '16px monospace';
        centerText(ctx, 'Alexeyka production', 0, 30);
        ctx.fillStyle = 'yellow';
        ctx.font = fontSize + 'px monospace';
        centerText(ctx,'Awesome TD', 0, y);
        ctx.fillStyle = color2;
        ctx.font = '24px monospace';
        centerText(ctx, 'click to start', 0, y + 30);
    }
	/**
 * Created by Алексейка on 28.01.16.
 */

var allSpawnedTowers = [];
var allTowersType = [];

    function Tower(ids,description, cost,bulletSpeed, bulletDamage, attackSpeed, radius, sources) {
        this.x = 0;
        this.y = 0;
        this.id = ids;
        this.cost = cost;
        this.desc = description;
        this.bulletSpeed = bulletSpeed;
        this.damage = bulletDamage;
        this.attackSpeed = attackSpeed;
        this.range = radius;
        this.source = sources;
        this.lastDate = new Date();
        allTowersType.push(this);
    }

    function checkTowerClick(x,y){
        for(var i = 0; i < allSpawnedTowers.length; i++){
            var xTow = allSpawnedTowers[i].x;
            var yTow = allSpawnedTowers[i].y;
            var dist = Math.sqrt(Math.pow((xTow - x),2) + Math.pow((yTow - y),2));
            if(dist < 18){
                clickedTower.idTower = i;
                clickedTower.flag = true;
                return true;
            }
        }
        clickedTower.flag = false;
    }

    function loadTowers() {

         var bSpeed = 4;
         var bSpeed1 = 6;
         var bDamage = 10;
         var bDamage1 = 50;
         var cost1 = 5;
         var cost2 = 10;
         var AS = 1500;
         var AS1 = 3000;
         var range = 100;
         var range1 = 75;//75
         var source1 = [802,0,39,38];
         var source2 = [802,40,39,38];
         var desc = "Р‘Р°С€РЅСЏ СЃС‚СЂРµР»СЏСЋС‰Р°СЏ СЌРЅРµСЂРіРѕСЃС„РµСЂРѕР№ РЈСЂРѕРЅ: " + bDamage + ", Р”Р°Р»СЊРЅ.: " + range +
            ", РЎРєРѕСЂ: СЃСЂРµРґРЅСЏСЏ.";
         var desc1 = "Р‘Р°С€РЅСЏ СЃС‚СЂРµР»СЏСЋС‰Р°СЏ РјРѕР»РЅРёРµР№ РЈСЂРѕРЅ: " + bDamage1 + ", Р”Р°Р»СЊРЅ.: " + range1 +
            ", РЎРєРѕСЂ: РјР°Р»Р°СЏ.";
         new Tower(0,desc,cost1,bSpeed,bDamage,AS,range,source1);
         new Tower(1,desc1,cost2,bSpeed1,bDamage1,AS1,range1,source2);
    }

    function checkDelay(id) {
        var newDate = new Date();
        return (newDate - allSpawnedTowers[id].lastDate > allSpawnedTowers[id].attackSpeed);
    }

    function fire(idMob, idTower) {
        if(allSpawnedTowers[idTower].id == 0) {
            new Bullet(allSpawnedTowers[idTower].x, allSpawnedTowers[idTower].y,
                allSpawnedTowers[idTower].damage, allSpawnedTowers[idTower].bulletSpeed, idMob);
            allSpawnedTowers[idTower].lastDate = new Date();
        }
        else if(allSpawnedTowers[idTower].id == 1){
            var x0 = allSpawnedTowers[idTower].x;
            var x1 = allSpawnedMobs[idMob].x;
            var y0 = allSpawnedTowers[idTower].y;
            var y1 = allSpawnedMobs[idMob].y;
            var dist = x0 - x1;
            var dist2 = y0 - y1;
            var angleInDegrees = Math.atan(dist2 / dist) * 180 / Math.PI;
            if(x1 > x0 ){
                var angle = (angleInDegrees - 90) * Math.PI / 180;
            }
            else {
                angle = (angleInDegrees - 90) * Math.PI / 180 +  Math.PI;
            }

            var distance = Math.sqrt(Math.pow((x0 - x1), 2) + Math.pow((y0 - y1), 2));
            allLightnings.push({x:x0,y:y0,cast:0,angle : angle,dist:distance});
            allSpawnedTowers[idTower].lastDate = new Date();
            var res = damageMob(idMob,allSpawnedTowers[idTower].damage);
            if(res == 0){
                allSpawnedMobs[idMob].id = 0;//тут еще убиваем моба.
                //но вдруг еще есть пули которые летят в этого моба, им надо поменять назначение
                mobDeadUpdateID(idMob);
            }
        }
    }

    function checkMobsInRadius(idTower) {
        var xTow = allSpawnedTowers[idTower].x;
        var yTow = allSpawnedTowers[idTower].y;
        var radius = allSpawnedTowers[idTower].range;
        for (var i = 0; i < allSpawnedMobs.length; i++) {
            var dist = Math.sqrt(Math.pow((xTow - allSpawnedMobs[i].x), 2) + Math.pow((yTow - allSpawnedMobs[i].y), 2));
            if (dist < radius) return i;
        }
        return -1;
    }

    function updateTowers() {
        for (var i = 0; i < allSpawnedTowers.length; i++) {
            if (!checkDelay(i)) continue;
            var res = checkMobsInRadius(i);
            if (res != -1) {
                fire(res, i);
            }
        }
    }

    function checkInBuildRange(x, y) {
        var buildArea = allMaps[currentMap].towerArea;
        for (var i = 0; i < buildArea.length; i++) {
            if (buildArea[i].x1 < x - 19 && x + 19 < buildArea[i].x2 && buildArea[i].y1
                < y  - 19 && y + 19 < buildArea[i].y2 ){
                for(var j = 0; j < allSpawnedTowers.length;j++){
                    var dist = Math.sqrt(Math.pow((x - allSpawnedTowers[j].x), 2)
                        + Math.pow((y - allSpawnedTowers[j].y), 2));
                    if(dist < 40){
                        return false;
                    }
                }
                return true;
            }
        }
        return false;
    }