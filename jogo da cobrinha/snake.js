
//Inicializando as variáeis globais

//ctx == context; onde eu desenho as coisas
var canvas, gameLoop, cobra, ctx, moeda, header, colisao, 
	tempoMoeda, animation, HEIGHT, WIDTH;
var valoresPC = {
	cobra:{
		dimensao: {x: 0.03, y: 0.03}
	},
	partes:{
		dimensao:{x: 0.0125, y: 0.0125}
	},
	moeda:{
		dimensao:{x: 0.02, y:0.02},
		raio: 0.01,
		movimento:{
			trig: {sinDivide: 20, cosDivide: 15},
			amplitude: 20,
			top: 10
		}
	},
	animation:{
		loseAlert:{
			box:{
				dimensao: {x: 0.3, y: 0.1},
				posicao: {x: 0.3/2, y: 0.2}			
			},
			texto:{
				posicao: {x: 0, y: 0.2+(0.6*0.1)},
				font: 0.02
			}
		}
	},
	header:{
		dimensao:{x: 1, y: 0.1},
		pontos:{
			posicao:{x: 0, y: 0},
			font: 0.02
		},
		info:{
			posicao:{x: 0, y: 0}
		}
	}
};
var valoresMobile = {
	cobra:{
		dimensao: {x: 0, y: 0}
	}
}
var currentValores = valoresPC;
function Cobra()
/*
	O objeto cobra
	este objeto é em si a cabeça da cobra
	e possui um campo chamado parte que é
	na verdade a calda.
*/
{
	this.nome = "Cobra";
	this.partes = new Array();
	this.posicao = {x: WIDTH*0.2, y: HEIGHT*0.3};
	this.dimensao = {x: currentValores.cobra.dimensao.x*WIDTH, y: currentValores.cobra.dimensao.y*WIDTH};
	this.perdeSeMorrer = {//Cuida de quantas unit a cobra perde se o tempo acabar
		atual : -1, att: function(){this.atual = Math.floor((cobra.partes.length)/2);}
	};
	this.velocidade = {x: this.dimensao.x, y: 0, padrao: this.dimensao.x};
	this.cor = "#C51212";
	this.draw = function ()//Desenhar cobra 
	{
		ctx.beginPath();
			ctx.shadowBlur = 2;
			ctx.shadowColor = "white";
			ctx.fillStyle = this.cor;
			ctx.fillRect(this.posicao.x, this.posicao.y, this.dimensao.x, this.dimensao.y);
		ctx.closePath();
		for (var i = 0; i < this.partes.length; i++)//Desenhar os filhos
			this.partes[i].draw();
	};
	this.killSomeChild = function()
	{
		for(var i = 0; i < this.perdeSeMorrer.atual; i++)
		{
			this.partes.pop(this.partes[i]);
		}
		/*
			Abaixo temos gambiarra
			Se a cobra pegasse uma unit no meio da animação
			loseSomeChilds() essa unit era incluida no final do vetor.
			O problema é que depois que a loseSomeChilds() acaba
			ela chama o killSomeChilds() para tirar os últimos x do vetor
			só que a unit que ela acabou de pegar acaba sendo morta tbm
			o que não era pra acontecer...
			Então depois eu pinto todo mundo de branco de novo...		
		*/
		for (var i = 0; i < this.partes.length; i++)
		{
			this.partes[i].cor = "white";
			this.partes[i].enabled = true;
		}
		this.perdeSeMorrer.att();
	};
	this.move = function()//Move-se cabeça e depois a calda 
	{
		this.movimentoContinuo();
		this.movimentarFilhos();
	}
	this.movimentoContinuo = function()//Movimentando a cabeça
	{
		this.posicao.x += this.velocidade.x;
		this.posicao.y += this.velocidade.y;
	};
	this.movimentarFilhos = function()
	/*
		Reorganiza a posição de todos dando ideia de que todos
		cabeça e calda se movem quando na verdade só a calda
		se cabeça se move, os filhos(calda) apenas copiam o movimento
	*/
	{
		var auX = this.posicao.x + (this.dimensao.x/2)  -  this.partes[0].dimensao.x/2,
			 auY = this.posicao.y + (this.dimensao.y/2) - this.partes[0].dimensao.y/2, ggX, ggY;
		for (var i = 0; i < this.partes.length; i++) 
		{
			ggX = this.partes[i].posicao.x;
			ggY = this.partes[i].posicao.y ;
			this.partes[i].posicao.x = auX;
			this.partes[i].posicao.y = auY;
			auX = ggX;
			auY = ggY;
		}
	}
	this.turn = 
	{
		choose: function(where)
		{
			var vxy = {};
			if(where == 38)
				vxy = cobra.turn.top();
			if(where == 39)
				vxy = cobra.turn.right();
			if(where == 40)
				vxy = cobra.turn.bottom();
			if(where == 37)
				vxy = cobra.turn.left();
			if(vxy != null){
				cobra.velocidade.x = vxy.x;
				cobra.velocidade.y = vxy.y;	
			};
		},
		left: function()
		{
			if(!(cobra.velocidade.x > 0))
				return {x: cobra.velocidade.padrao*(-1), y: 0};
		},
		right: function()
		{
			if(!(cobra.velocidade.x < 0))
				return {x: cobra.velocidade.padrao, y: 0};
		},
		top: function()
		{
			if(!(cobra.velocidade.y > 0))
				return {x: 0, y: cobra.velocidade.padrao*(-1)};
		},
		bottom: function()
		{
			if(!(cobra.velocidade.y < 0))
				return {x: 0, y: cobra.velocidade.padrao};
		}
	}
}
function Animation()
{
	/*
		Foi criada com intuito de colocar algumas animações
		e exibir informações na tela por algum tempo
	*/
	this.segundosPast = {past:0, padrao: 2};
	this.loop = null;
	this.loseIsAlive = false;
	this.drawYouLoseBecauseLoseSomeChilds = function()
	{
		ctx.beginPath();
			ctx.shadowBlur = -1;
			ctx.shadowColor = "black";
			ctx.fillStyle = "#4d2c9c";
			ctx.fillRect(WIDTH/2-currentValores.animation.loseAlert.box.posicao.x*WIDTH, 
				currentValores.animation.loseAlert.box.posicao.y*HEIGHT, 
				currentValores.animation.loseAlert.box.dimensao.x*WIDTH, 
				currentValores.animation.loseAlert.box.dimensao.y*HEIGHT);
		ctx.closePath();
		ctx.beginPath();
			ctx.shadowBlur = 3;
			ctx.shadowColor = "lightgray";
			ctx.fillStyle = "white";
			ctx.font = "bold "+currentValores.animation.loseAlert.texto.font*WIDTH+"px Segoe UI Light";
			//URL the beatles 'jA6Z1QJA6EA'
			var texto = "You're going to lose this girl!";
			ctx.fillText(texto, WIDTH/2 - ctx.measureText(texto).width/2, 
				currentValores.animation.loseAlert.texto.posicao.y*HEIGHT);
			ctx.shadowBlur = 0;
			ctx.shadowColor = "white";
			ctx.fillStyle = "white";
			ctx.font = (currentValores.animation.loseAlert.texto.font*WIDTH)*0.5+"px Segoe UI Light";
			ctx.fillText("youtu.be/jA6Z1QJA6EA", 
				WIDTH/2 - currentValores.animation.loseAlert.box.posicao.x*WIDTH, 
				currentValores.animation.loseAlert.box.posicao.y*HEIGHT-2);
		ctx.closePath();
	};
	this.draw = function()
	{
		if(this.loseIsAlive)
			this.drawYouLoseBecauseLoseSomeChilds();
	}
	this.controleLoseSomeChilds = function()
	{
		if(this.segundosPast.past == this.segundosPast.padrao)
		{
			clearTimeout(this.loop);
			this.segundosPast.past = 0;
			this.loop = null;
			this.loseIsAlive = false;
			cobra.killSomeChild();
		}
		else
			this.segundosPast.past += 1;
	}
	this.youLoseStart = function()
	{
		this.loseIsAlive = true;
		for (var i = cobra.partes.length-1; i >= cobra.partes.length - cobra.perdeSeMorrer.atual; i--)
			cobra.partes[i].enabled = false;
		this.loop = setInterval("animation.controleLoseSomeChilds()", 1000);
	}
}
function Partes()//Partes que compeem a cobra
{
	this.nome = "Parte";
	this.numero = 42;
	this.posicao = {x: 42, y: 42};
	this.dimensao = {x:currentValores.partes.dimensao.x*WIDTH, y: currentValores.partes.dimensao.y*WIDTH};
	this.cor = "white";
	this.enabled = true;
	this.draw = function()
	{
		ctx.beginPath();
			ctx.shadowBlur = 2;
			ctx.shadowColor = "white";
			ctx.fillStyle = this.cor = this.prestesMorrer();
			ctx.fillRect(this.posicao.x, this.posicao.y, this.dimensao.x, this.dimensao.y);
		ctx.closePath();
	},
	this.prestesMorrer = function()
	{
		if(this.enabled)
			return "white";
		else
			if(this.cor=="white")
				return "#2E1961";
			else
				return "white";
	}
}
function Moeda()//O 'negocio' que a cobra precisa 'comer' para ficar grande
{
	this.nome = "Moeda";
	this.numero = 42;
	this.posicao = {x: 75, y: 100};
	this.originalPosition = {x: WIDTH/2, y:HEIGHT/2};
	this.dimensao = {x: currentValores.moeda.dimensao.x*WIDTH, y: currentValores.moeda.dimensao.y*WIDTH};
	this.cor = "rgba(243, 221, 30, 1)";
	this.raio = currentValores.moeda.raio*WIDTH;
	this.trig = currentValores.moeda.movimento.trig;
	/*Só um lugar onde guardar o top current*/
	this.consta = 0;
	/*
		É como se fosse até onde a animação pode ir
		dada a sua posição original quanto maior
		mais ela pode se distanciar de la. Isso
		acaba influênciando na velocidade
	*/
	this.amplitude = currentValores.moeda.movimento.amplitude;
	this.generate = function()
	/*
		Gera uma moeda em uma posiçção aleatória.
		A posição aletória vai ser sempre um múltiplo de 30,
		assim ajuda a cobra a pegar moeda, já que a cobra
		anda de 30 em 30 unidades.
	*/
	{
		var c = cobra.velocidade.padrao;
		this.posicao.x = Math.round(Math.floor(Math.random()*(canvas.width - c))/c)*c;
		this.posicao.y = Math.round(Math.floor(Math.random()*(canvas.height - c))/c)*c;
		this.originalPosition.x = this.posicao.x;
		this.originalPosition.y = this.posicao.y;
	};
	this.track = function (x, y, top, ampl)
	/*
		Escrita por matemáticos para matemáticos, não sei como isso funciona
		Só sei que: y = sin(x), é furada
	*/
	{
		/*
			var top;
				velocidade com que o movimento é completado
				quanto maior mais rapido ele completa um ciclo
				quanto menor mais lentamente, se deixar muito
				rapido ele passa a apenas sumir de deixa de ser
				uma animacao...
		*/
       	var top = top + currentValores.moeda.movimento.top;
       	var x  = x + ampl * Math.sin(top / this.trig.sinDivide);
       	var y = (top / this.screenHeight < 0.65) ? y + 10 : 1 + y + ampl * Math.cos(top / this.trig.cosDivide);
       	if (x < 5)
       		x = 5;
       	if (x > canvas.width - 5)
       		x = canvas.width - 5;
       	if (y < HEIGHT*currentValores.header.dimensao.y)
       		y = HEIGHT*currentValores.header.dimensao.y;
       	if (y > canvas.height - 5)
       		y = canvas.height - 5;
       	return {x, top, y};
    };
	this.someAnimation = function()
	/*
		Me diz as novas coordenadas com base na função acima
	*/
	{
		var coisas = this.track(this.originalPosition.x, this.originalPosition.y,
			this.consta, this.amplitude);
		this.posicao.x = coisas.x;
		this.posicao.y = coisas.y;
		this.consta = coisas.top;
	}
	this.draw = function()
	{
		this.someAnimation();
		ctx.beginPath();
			ctx.fillStyle = this.cor;
			ctx.shadowBlur = 8;
			ctx.shadowColor = "gold";
   			ctx.arc(this.posicao.x + this.dimensao.x*0.5, this.posicao.y + this.dimensao.x*0.5,
   					this.raio, 0, Math.PI*2, true);
    		ctx.fill();
		ctx.closePath();
	}
}
function Header()
{
	this.nome = "Header";
	this.posicao = {x: 0, y: 0};
	this.dimensao = {x:WIDTH, y: HEIGHT*currentValores.header.dimensao.y};
	this.cor = "black";
	this.draw = function()
	{
		ctx.beginPath();
			ctx.shadowBlur = 2;
			ctx.shadowColor = "white";
			ctx.fillStyle = this.cor;
			ctx.fillRect(this.posicao.x, this.posicao.y, this.dimensao.x, this.dimensao.y);
			ctx.font = currentValores.header.pontos.font*WIDTH+"px Segoe UI Light";
			ctx.shadowBlur = 0;
			ctx.fillStyle = "white";
			ctx.fillText("Pontos: "+(cobra.partes.length), 0.1*WIDTH,
				this.dimensao.y*0.7);
			ctx.fillText(tempoMoeda.getInfo(), 0.2*WIDTH, this.dimensao.y*0.7);
		ctx.closePath();
	}
}
function exibirCoordenadas(obj)
/*
	**PARAM:   O objeto que você deseja saber as coordenadas
	**RETORNA: Um texto com as coordenadas

	Para debug; exibe as coordenadas de um dado objeto na tela.
	Usado para saber onde a moeda foi parar, na fase de testes.
*/
{
	var cordenadas = obj.nome.toUpperCase() + " = { posicao: {x: "+obj.posicao.x+", y: "+
		obj.posicao.y+"}, dimensao: {x: "+obj.dimensao.x+", y: "+obj.dimensao.y+"}}";
	return cordenadas;
}
function loop()
/*
	Assim como todo game este também possui um loop infinito
	é onde tudo acontece, só que está bem compactado
*/
{
	canvas.limparTela();
	colisao.algumaColisao();
	animation.draw();
	cobra.move();
	cobra.draw();
	moeda.draw();
	header.draw();
	ctx.fillStyle = "white";
	var n0 = (canvas.height > canvas.width ? "500%" : "200%");
	ctx.font = n0+" Segoe UI Light";
	//ctx.fillText(exibirCoordenadas(moeda), 80, 290);
	ctx.shadowBlur = 0;
	//ctx.fillText("Pontos: "+(cobra.partes.length), canvas.width*0.1, canvas.height * 0.08);
	//ctx.fillText(ctx.measureText("OLA").width, 300, 200);
	//tempoMoeda.runnable();
}
function tempoParaPegarMoeda() 
{
	/*
		Cuida do time para pegar a moeda e tudo ele que faz de mais
	*/
	this.texto = "00:00";
	this.segundos = {segundos: 5, padrao:5};
	this.loop = null;
	this.realLoop = function()
	{
		this.segundos.segundos--;
		if (this.segundos.segundos < 0) 
		{
			this.segundos.segundos = this.segundos.padrao;
			moeda.generate();
			animation.youLoseStart();
		}
	}
	this.getInfo = function()
	{
		/*ctx.font = "200% Segoe UI Light";
		ctx.fillText("Left: "+this.segundos.segundos+"sec. to lose: "+cobra.perdeSeMorrer.atual+"uni.",
			canvas.width*0.4, canvas.height * 0.08);*/		
		return "Left: "+this.segundos.segundos+"sec. to lose: "+cobra.perdeSeMorrer.atual+"uni.";
	}
	this.comecar = function()
	{
		this.segundos.segundos = this.segundos.padrao;
		this.loop = setInterval("tempoMoeda.realLoop()", 1000);
	}
	this.recomecar = function()
	{
		clearTimeout(this.loop);
		this.loop = null;
		this.comecar();
	}
}
function initComponents(w, h)
/*
	Inicia os componentes;
	Carrega as variaveis, começa o loop
	desenha um pouco da cobra, desenha uma moeda
	e adiciona os eventos do teclado na tela
*/
{
	WIDTH = w;
	HEIGHT = h;
	canvas = new Canvas();
	tempoMoeda = new tempoParaPegarMoeda();
	cobra = new Cobra();
	moeda = new Moeda();
	header = new Header();
	colisao = new tratarColisoes();
	animation = new Animation();
	var parte1 = new Partes();
	parte1.posicao.x = 210;
	parte1.posicao.y = 60;
	
	var parte2 = new Partes();
	parte2.posicao.x = 180;
	parte2.posicao.y = 60;
	
	var parte3 = new Partes();
	parte3.posicao.x = 150;
	parte3.posicao.y = 60;
	
	cobra.partes.push(parte1, parte2, parte3);
	cobra.perdeSeMorrer.att();
	ctx = canvas.objeto.getContext("2d");
	window.addEventListener("keydown", function (e) 
	{
		canvas.eventos.movimentoSeta(e);
	});
	window.addEventListener("keyup", function (e) {
		switch(e.keyCode)
		{
			case 37: case 38: case 39: case 40:
				canvas.keys[e.keyCode] = false;
			break;	
		}
	});
	cobra.draw();
	header.draw();
	tempoMoeda.comecar();
	gameLoop = setInterval("loop()", 1000/canvas.frames);
}
function tratarColisoes()
/*
	Classe herdada de um outro projeto;
	Se mostra muito eficaz em dectar colisões
*/
{
	this.algumaColisao = function () 
	{
		if(this.cobraColisaoBody())
			return true;
		else if(this.cobraColisaoCoin())
			return true;
		else if(this.limitesTelaX())
			return true;
		else if(this.limitesTelaX2())
			return true;
		else if(this.limitesTelaY())
			return true;
		else if(this.limitesTelaY2())
			return true;
	}
	this.cobraColisaoCoin = function ()
	{
		/*
			Gera uma nova moeda, deixa a cobra maior, reinicia o contador,
			atualiza quantas units a cobra vai perde se o tempo acabar
			e muda o movimento circular para outro caso as units sejam maior
			15
		*/
		if(this.colidiu(cobra, moeda, false, 0))
		{
			var p = new Partes();
			cobra.partes.push(p);
			moeda.generate();
			tempoMoeda.recomecar();
			if((cobra.partes.length) % 4 == 0)
				cobra.perdeSeMorrer.att();
			if(cobra.partes.length > 15)
			{
				moeda.trig.sinDivide = 20;
				moeda.trig.cosDivide = 25;
				moeda.amplitude = 50;
			}
			return true;
		}
		else
			return false;
	};
	this.cobraColisaoBody = function()
	/*
		Encerra o jogo
	*/
	{
		for (var i = 1; i < cobra.partes.length; i++) 
		{
			if(cobra.partes[i].enabled)
			{
				if(this.colidiu(cobra, cobra.partes[i], false, 0))
				{
					clearTimeout(gameLoop);
					return true;
				}
			}
		}
	};
	this.limitesTelaX = function()
	{
		if(cobra.posicao.x > canvas.width - 30)
		{
			cobra.posicao.x = 0;
			return true;
		}
	}

	this.limitesTelaX2 = function()
	{
		if(cobra.posicao.x < 0)
		{
			cobra.posicao.x = canvas.width - 30;
			return true;
		}
	}

	this.limitesTelaY = function()
	{
		if(cobra.posicao.y > canvas.height)
		{
			cobra.posicao.y = HEIGHT*currentValores.header.dimensao.y;
			return true;
		}
	}

	this.limitesTelaY2 = function()
	{
		if(cobra.posicao.y+20 < HEIGHT*currentValores.header.dimensao.y)
		{
			cobra.posicao.y = HEIGHT*0.935;
			return true;
		}
	}
	this.colidiu = function (objeto2, objeto1, margemErro, valor)//Checar colisão com ou sem margem de erro
	{
		/*
			Colisão parece simples matamática basica, e é, o problema é quando
			para o computador tudo é um fodendoo ponto sem dimensão.
		*/
		var x1 = parseInt(objeto1.posicao.x);	
		var y1 = parseInt(objeto1.posicao.y);
		var w1 = parseInt(objeto1.dimensao.x);
		var h1 = parseInt(objeto1.dimensao.y);

		var x2 = parseInt(objeto2.posicao.x);	
		var y2 = parseInt(objeto2.posicao.y);
		var w2 = parseInt(objeto2.dimensao.x);
		var h2 = parseInt(objeto2.dimensao.y);
		if((x2 > x1 + w1 || y2 > y1 + h1) || (x2 + w2 < x1 || y2 + h2 < y1))
		{
			return false;
		}
		if(margemErro)
		{
			if(x1 < x2 && (x1 + w1*valor) < x2)
			{
				return false;
			}
			else
			{
				if((x2 + w2) < (x1 + w1*(1 - valor)))
				{
					return false;
				}
			}
		}
		return true;
	};
}
function Canvas()
{
	this.objeto = document.getElementById("canvas");
	this.width = WIDTH;
	this.height = HEIGHT;
	this.frames = 8;//8
	this.keys = [];
	this.keys[39] = false;
	this.keys[37] = false;
	this.keys[38] = false;
	this.keys[40] = false;
	this.limparTela = function()
	{
		ctx.clearRect(0, 0, this.width, this.height);
	};
	this.eventos = 
	{
		movimentoSeta: function(e)
		{	
			if(!(canvas.keys[37] || canvas.keys[38] || canvas.keys[39] || canvas.keys[40]))
			{
				if([37, 38, 39, 40].indexOf(e.keyCode) != -1)
				{
					cobra.turn.choose(e.keyCode);
					canvas.keys[e.keyCode] = true;
				}
			}	
		}
	}
}