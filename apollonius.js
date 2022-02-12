function apollonius(c1, c2, c3, s1, s2, s3){    

    v11 = 2*c2.x - 2*c1.x;
    v12 = 2*c2.y - 2*c1.y;
    v13 = c1.x*c1.x - c2.x*c2.x + c1.y*c1.y - c2.y*c2.y - c1.r*c1.r + c2.r*c2.r;
    v14 = 2*s2*c2.r - 2*s1*c1.r;

    v21 = 2*c3.x - 2*c2.x;
    v22 = 2*c3.y - 2*c2.y;
    v23 = c2.x*c2.x - c3.x*c3.x + c2.y*c2.y - c3.y*c3.y - c2.r*c2.r + c3.r*c3.r;
    v24 = 2*s3*c3.r - 2*s2*c2.r;

    if (v11 == 0 || v21 == 0) {
        return {x:-1, y:-1, r:0};
    }

    w12 = v12/v11;
    w13 = v13/v11;
    w14 = v14/v11;
    
    w22 = v22/v21-w12;
    w23 = v23/v21-w13;
    w24 = v24/v21-w14;
    
    if (w22 == 0) {
        return {x:-1, y:-1, r:0};
    }

    P = -w23/w22;
    Q = w24/w22;
    M = -w12*P-w13;
    N = w14 - w12*Q;
    
    a = N*N + Q*Q - 1;
    b = 2*M*N - 2*N*c1.x + 2*P*Q - 2*Q*c1.y + 2*s1*c1.r;
    c = c1.x*c1.x + M*M - 2*M*c1.x + P*P + c1.y*c1.y - 2*P*c1.y - c1.r*c1.r;
    
    D = b*b-4*a*c;
    if (D < 0 || a == 0) {
        return {x:-1, y:-1, r:0};
    }
    rs = (-b-Math.sqrt(D))/(2*a);

    xs = M+N*rs;
    ys = P+Q*rs;

    return {x:xs, y:ys, r:rs};
}

function sq(value){
    return value * value;
}

canvas = document.getElementById("cnvs");
ctx = canvas.getContext("2d");
function clear(){
    ctx.fillStyle = '#000000';
    ctx.fillRect(0,0,2000,2000);
}
function draw_circle(circle,width,color){
    ctx.strokeStyle = color;
    ctx.lineWidth = width;
    ctx.beginPath();
    ctx.arc(circle.x, circle.y, Math.abs(circle.r), 0, 2 * Math.PI);
    ctx.stroke();
}

cl = ['#ff0000','#ffff00','#00ff00','#00ffff','#0000ff','#ff00ff','#ffffff','#f0f0f0f'];
circles = [{x:300,y:300,r:200}, {x:800,y:300,r:100}, {x:500,y:500,r:60}];
clicked = [false, false, false];

function render(){
    clear();
    draw_circle(circles[0],4,'#ffffff');
    draw_circle(circles[1],4,'#ffffff');
    draw_circle(circles[2],4,'#ffffff');
    for (i = 0; i < 8; i++){
        s1 = (i % 2) * 2 - 1;
        s2 = (Math.floor(i/2) % 2) * 2 - 1;
        s3 = (Math.floor(i/4) % 2) * 2 - 1;
        draw_circle(apollonius(circles[0],circles[1],circles[2],s1,s2,s3),2,'#ffffff');
     }
}

document.onmouseup = function(event) {
    for (i = 0; i < 3; i++)
        clicked[i] = false;
}

document.onmousedown = function(event) {
    X = event.pageX;
    Y = event.pageY;
    for (i = 0; i < 3; i++)
        if (sq(circles[i].x-X) + sq(circles[i].y-Y) <= sq(circles[i].r))
            clicked[i] = true;
}

document.onmousemove = function(event) {
    for (j = 0; j < 3; j++) {
        if (clicked[j]){
            X = event.pageX;
            Y = event.pageY;
            // Incredibly bad way to make sure circles don't overlap, yay
            cnt = 0;
            for (i = 0; i < 3; i++) {
                if (i == j) continue;
                if (sq(X - circles[i].x) + sq(Y - circles[i].y) <= sq(circles[i].r + circles[j].r)){
                    a = (circles[i].r + circles[j].r)/Math.sqrt(sq(X - circles[i].x) + sq(Y-circles[i].y)) + 0.01;
                    X = circles[i].x + (X - circles[i].x) * a;
                    Y = circles[i].y + (Y - circles[i].y) * a;
                    cnt++;
                }
            }
            for (i = 0; i < 3; i++) {
                if (i == j) continue;
                if (sq(X - circles[i].x) + sq(Y - circles[i].y) <= sq(circles[i].r + circles[j].r)){
                    a = (circles[i].r + circles[j].r)/Math.sqrt(sq(X - circles[i].x) + sq(Y-circles[i].y)) + 0.01;
                    X = circles[i].x + (X - circles[i].x) * a;
                    Y = circles[i].y + (Y - circles[i].y) * a;
                    cnt++;
                }
            }
            if (cnt>1) continue;
            circles[j].x = X;
            circles[j].y = Y;   
        }
    }
    render();
}
