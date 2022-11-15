// Мировые константы

var pi = 3.141592;
var deg = pi/180;

// Конструктор player

function player(x,y,z,rx,ry) {
	this.x = x;
	this.y = y;
	this.z = z;
	this.rx = rx;
	this.ry = ry;
}

// Массив прямоугольников

var map = [
		   [0,0,1000,0,180,0,2000,200,"#F0C0FF"],
		   [0,0,-1000,0,0,0,2000,200,"#F0C0FF"],
		   [1000,0,0,0,-90,0,2000,200,"#F0C0FF"],
		   [-1000,0,0,0,90,0,2000,200,"#F0C0FF"],
		   [0,100,0,90,0,0,2000,2000,"#666666"]
]

// Нажата ли клавиша и двигается ли мышь?

var PressBack = 0;
var PressForward = 0;
var PressLeft = 0;
var PressRight = 0;
var PressUp = 0;
var MouseX = 0;
var MouseY = 0;

// Введен ли захват мыши?

var lock = false;

// На земле ли игрок?

var onGround = true;

// Привяжем новую переменную к container

var container = document.getElementById("container");

// Обработчик изменения состояния захвата курсора

document.addEventListener("pointerlockchange", (event)=>{
	lock = !lock;
});

// Обработчик захвата курсора мыши

container.onclick = function(){
	if (!lock) container.requestPointerLock();
};

// Обработчик нажатия клавиш

document.addEventListener("keydown", (event) =>{
	if (event.key == "a"){
		PressLeft = 1;
	}
	if (event.key == "w"){
		PressForward = 1;
	}
	if (event.key == "d"){
		PressRight = 1;
	}
	if (event.key == "s"){
		PressBack = 1;
	}
	if (event.keyCode == 32 && onGround){
		PressUp = 1;
	}
});

// Обработчик отжатия клавиш

document.addEventListener("keyup", (event) =>{
	if (event.key == "a"){
		PressLeft = 0;
	}
	if (event.key == "w"){
		PressForward = 0;
	}
	if (event.key == "d"){
		PressRight = 0;
	}
	if (event.key == "s"){
		PressBack = 0;
	}
	if (event.keyCode == 32){
		PressUp = 0;
	}
});

// Обработчик движения мыши

document.addEventListener("mousemove", (event)=>{
	MouseX = event.movementX;
	MouseY = event.movementY;
});

// Создаем новый объект

var pawn = new player(0,0,0,0,0);

// Привяжем новую переменную к world

var world = document.getElementById("world");

function update(){
	
	// Задаем локальные переменные смещения
	
	let dx =   (PressRight - PressLeft)*Math.cos(pawn.ry*deg) - (PressForward - PressBack)*Math.sin(pawn.ry*deg);
	let dz = - (PressForward - PressBack)*Math.cos(pawn.ry*deg) - (PressRight - PressLeft)*Math.sin(pawn.ry*deg);
	let dy = - PressUp;
	let drx = MouseY;
	let dry = - MouseX;
	
	// Обнулим смещения мыши:
	
	MouseX = MouseY = 0;
	
	// Прибавляем смещения к координатам
	
	pawn.x = pawn.x + dx;
	pawn.y = pawn.y + dy;
	pawn.z = pawn.z + dz;
	
	// Если курсор захвачен, разрешаем вращение
	
	if (lock){
		pawn.rx = pawn.rx + drx;
		pawn.ry = pawn.ry + dry;
	};

	// Изменяем координаты мира (для отображения)
	
	world.style.transform = 
	"translateZ(" + (600 - 0) + "px)" +
	"rotateX(" + (-pawn.rx) + "deg)" +
	"rotateY(" + (-pawn.ry) + "deg)" +
	"translate3d(" + (-pawn.x) + "px," + (-pawn.y) + "px," + (-pawn.z) + "px)";
	
};

function CreateNewWorld(){
	for (let i = 0; i < map.length; i++){
		
		// Создание прямоугольника и придание ему стилей
		
		let newElement = document.createElement("div");
		newElement.className = "square";
		newElement.id = "square" + i;
		newElement.style.width = map[i][6] + "px";
		newElement.style.height = map[i][7] + "px";
		newElement.style.background = map[i][8];
		newElement.style.transform = "translate3d(" +
		(600 - map[i][6]/2 + map[i][0]) + "px," +
		(400 - map[i][7]/2 + map[i][1]) + "px," +
		                    (map[i][2]) + "px)" +
		"rotateX(" + map[i][3] + "deg)" +
		"rotateY(" + map[i][4] + "deg)" +
		"rotateZ(" + map[i][5] + "deg)";
		
		// Вставка прямоугольника в world
		
		world.append(newElement);
	}
}

CreateNewWorld();
TimerGame = setInterval(update,10);