var gameLoop;
var ctx, canvas, bola, barra, botao1, botao2, tratarColisoes, W, H;
var listaDeObstaculos = new Array();
var primeiraVez = true;
var cheat = true;
var opcoes = 
{
	sons:{ligado: true, tipo: 'lol'},
	disposicaoObstaculo: 'Normal'
}
function Canvas(width_canvas, height_canvas)
{
	/*
		Essa classe representa a tela de jogo
		e todas as funções relacionadas a ela
	*/
	this.objeto = document.getElementById("canvas");
	this.width = width_canvas;
	this.height = height_canvas;
	this.frames = 30;
	this.gravidade = 1;
	this.keys = [];
	this.limparTela = function()
	{
		ctx.clearRect(0, 0, this.width, this.height);
	};
	this.drawCoordenadas = function() 
	{
		ctx.beginPath();
			ctx.shadowBlur = 0;
			ctx.shadowColor = "";
			ctx.fillStyle = "white";
			ctx.font = "16px Arial";
			//ctx.fillText(exibirCoordenadas(barra),500, 400);
			//ctx.fillText(exibirCoordenadas(bola), 500, 450);
		ctx.closePath();
	};
	this.algumMovimento = function () 
	{
	    if (canvas.keys[39]) 
	    {
	       if (barra.velocidade.x < barra.velocidade.limite) 
	       {
	            barra.velocidade.x+=((W*0.15)/6)/3;
	        }
	    }
	    if (canvas.keys[37])
		{
		    if (barra.velocidade.x > -barra.velocidade.limite) 
		    {
		        barra.velocidade.x-=((W*0.15)/6)/3;
		    }
		}
       	barra.velocidade.x *= 0.8;
	};
	this.eventos = 
	{
		startx : 0,
    	dist : 0,
		movimentoMouse: function()//Caso o mouse seja utilizado para mover a barra 
		{
			//barra.posicao.x = event.pageX - $(event.target).offset().left - barra.dimensao.x/2;
		},
		keyboardEntrada: function()//Caso o teclado seja utilizado para mover a barra
		{
			if(event.keyCode == 39)
			{
				barra.posicao.x += barra.velocidade.x;
			}
			if(event.keyCode == 37)
			{
				barra.posicao.x -= barra.velocidade.x;
			}
		},
		mouseUp: function(ex)
		{
			var e = ex.changedTouches[0];
			var mouseAtualmenteX = e.pageX - $(event.target).offset().left;
			var mouseAtualmenteY = e.pageY - $(event.target).offset().top;
			if(mouseAtualmenteX > botao1.posicao.x && mouseAtualmenteX < parseInt(botao1.posicao.x + botao1.dimensao.x) && 
				mouseAtualmenteY > botao1.posicao.y && mouseAtualmenteY < parseInt(botao1.posicao.y + botao1.dimensao.y))
			{
				canvas.keys[37] = false;
			}
			else if(mouseAtualmenteX > botao2.posicao.x && mouseAtualmenteX < parseInt(botao2.posicao.x + botao2.dimensao.x) && 
				mouseAtualmenteY > botao2.posicao.y && mouseAtualmenteY < parseInt(botao2.posicao.y + botao2.dimensao.y))
			{
				canvas.keys[39] = false;
			}
		},
		mouseDown: function(ex)
		{
			var e = ex.changedTouches[0];
			this.startx = parseInt(e.clientX);
			var mouseAtualmenteX = e.pageX - $(event.target).offset().left;
			var mouseAtualmenteY = e.pageY - $(event.target).offset().top;
			//alert(e.clientX +" > "+ botao1.posicao.x +" && "+ e.clientX +" < "+ parseInt(botao1.posicao.x + botao1.dimensao.x) +" && "+ 
				//(e.clientY) +" > "+ botao1.posicao.y +" && "+ (e.clientY-55) +" < "+ parseInt(botao1.posicao.y + botao1.dimensao.y));
			//barra.posicao.x = this.startx - barra.dimensao.x/2;
			//alert(botao1.posicao.y +" lol "+ botao1.dimensao.y);
			if(mouseAtualmenteX > botao1.posicao.x && mouseAtualmenteX < parseInt(botao1.posicao.x + botao1.dimensao.x) && 
				mouseAtualmenteY > botao1.posicao.y && mouseAtualmenteY < parseInt(botao1.posicao.y + botao1.dimensao.y))
			{
				canvas.keys[39] = false;
				canvas.keys[37] = true;
				//alert(42);
			}
			else if(mouseAtualmenteX > botao2.posicao.x && mouseAtualmenteX < parseInt(botao2.posicao.x + botao2.dimensao.x) && 
				mouseAtualmenteX > botao2.posicao.y && mouseAtualmenteY < parseInt(botao2.posicao.y + botao2.dimensao.y))
			{
				canvas.keys[37] = false;
				canvas.keys[39] = true;
				//alert(33);
			}
		},
		touchMove: function(ex)
		{
			var e = ex.changedTouches[0];
			var dist = parseInt(e.clientX - barra.dimensao.x/2);
			//barra.posicao.x = dist;
		}
	};
};
function Bola()
{
	this.nome = "Bola";
	this.velocidade = {x: 0, y: (W*0.016)/4, xC: (W*0.016)/1.6, yC: ((W*0.016)/1.8)};
	this.dimensao = {x: W*0.016, y: W*0.016};
	this.posicao = {x: W/2, y: H*0.6};
	this.raio = W*0.010;
	this.restituicao = -1;
	this.cor = "white";
	this.vidas = 6;
	this.colisoes = {emColisao: true, quantas: 0, vel: {y: (W*0.016)/4, x: (W*0.016)/3}};
	this.multKill = 0;
	this.draw = function() 
	{
		ctx.beginPath();
			//ctx.shadowBlur = 15;
			//ctx.shadowColor = "lightgray";
			ctx.fillStyle = this.cor;
			ctx.arc(this.posicao.x + this.dimensao.x*0.5, this.posicao.y + this.dimensao.x*0.5,
				this.raio, 0, Math.PI*2, true);
			ctx.fill();
	    	/*ctx.fillStyle = "green";
	    	ctx.fillRect(bola.posicao.x, bola.posicao.y, bola.dimensao.x, bola.dimensao.y);*/
	    ctx.closePath();
	    ctx.beginPath();
	    	ctx.fillStyle = "white";
	    	for(var i = 1; i < this.vidas + 1; i++)
	    	{
	    		ctx.arc(i*(W*0.01)*2, 15, W*0.009, 0, Math.PI*2, true);
	    	}
	    	ctx.fill();
	    ctx.closePath();
	}
};
function Barra() 
{
	this.nome = "Barra";
	this.velocidade = {x: 0, y: 0, limite: (W*0.15)/6};
	this.dimensao = {x: W*0.15, y: H*0.03};
	this.posicao = {x: 0, y:H*0.9};
	this.draw = function () 
	{
		ctx.beginPath();
			ctx.shadowBlur = 0;
			ctx.shadowColor = "";
			bg = ctx.createLinearGradient(0,0,100,50);
			bg.addColorStop(0, "blue");
			bg.addColorStop(1, "royalblue");
			ctx.fillStyle = bg;
			ctx.fillRect(this.posicao.x, this.posicao.y, this.dimensao.x, this.dimensao.y);
			ctx.fillStyle = "lightgray";
			ctx.font = "16px Segoe UI Light";
			ctx.fillText(canvas.keys[39]+" "+canvas.keys[37], canvas.width - 190, canvas.height - 10);
			/*ctx.fillRect(this.posicao.x, this.posicao.y, this.dimensao.x * 0.35, this.dimensao.y);
			ctx.fillStyle = "red";
			ctx.fillRect(this.posicao.x + this.dimensao.x*0.35, this.posicao.y, this.dimensao.x * 0.3,
				this.dimensao.y);
			ctx.fillStyle = "yellow";
			ctx.fillRect(this.posicao.x + this.dimensao.x *0.65, this.posicao.y, this.dimensao.x * 0.35,
				this.dimensao.y);*/
		ctx.closePath();
	}
};
function Obstaculo() 
{
	this.nome = "Obstaculo";
	this.posicao = {x: 42, y: 42};
	this.dimensao = {x: 42, y: 42};
	this.cor = "royalblue";
	this.draw = function()
	{
		ctx.beginPath();
			ctx.shadowBlur = 0;
			ctx.shadowColor = "";
			ctx.fillStyle = this.cor;
			ctx.fillRect(this.posicao.x, this.posicao.y, this.dimensao.x, this.dimensao.y);
		ctx.closePath();
	};
	this.getCalculatedDimension = function(num, total)
	{
        var div = Math.floor((total/num));
        if(div * num != total)
        {
            var diff = (total - (div*num));
            num+=(diff/div);
            return num;
        }
        else
        {
            return num;
        }
	}
};
function gerarObstaculos()
{
	if(opcoes.disposicaoObstaculo == "Normal")
	{
        var widthObstaculo = new Obstaculo().getCalculatedDimension(W*0.15, W*0.95);
        var heightObstaculo = new Obstaculo().getCalculatedDimension(H*0.035, H*0.95);
        //alert(widthObstaculo);
        var linhas = Math.floor(W/widthObstaculo);
        var colunas = Math.floor((H*0.25)/(heightObstaculo));
        //alert(linhas+" "+colunas);
        var espacamento = ((W*0.05)/(linhas+1));
        var espacamento2 = ((H*0.05)/(colunas+1));
		for(var i = 0; i < linhas; i++)
		{
			for(var j = 0; j < colunas; j++)
			{
				var r = Math.floor(Math.random() * 255);
				var g = Math.floor(Math.random() * 255);
				var b = Math.floor(Math.random() * 255);
				var obs = new Obstaculo();
                var x = (i * widthObstaculo)+(espacamento*(i+1));
                var y = (j * heightObstaculo)+(espacamento2*(j+1));
        		obs.posicao.x = x;
        		obs.posicao.y = y+H*0.15;
        		obs.dimensao.x = widthObstaculo;//120
        		obs.dimensao.y = heightObstaculo;
        		obs.cor = "rgb("+r+", "+g+", "+b+")";
        		listaDeObstaculos.push(obs);
        	}
        }
    }
    else
    {
        var heightObstaculo = new Obstaculo().getCalculatedDimension(H*0.035, H*0.95);
        var colunas = Math.floor((H*0.25)/(heightObstaculo));
        var espacamento = ((W*0.003));
    	for(var i = 0; i < colunas; i++)
    	{
    		var total = 0;
    		do
    		{
    			var r = Math.floor(Math.random() * 255);
    			var g = Math.floor(Math.random() * 255);
    			var b = Math.floor(Math.random() * 255);
    			var obs = new Obstaculo();
    			obs.posicao.x = total + espacamento;
        		obs.posicao.y = (i*heightObstaculo+(espacamento*(i+1)));//Chutes
        		var w = Math.floor(Math.random() * W*0.3 + 60);
        		w = (total + w + espacamento >= W - espacamento ? ((W - total) - espacamento) : w);
        		obs.dimensao.x = w - 5;
        		obs.dimensao.y = heightObstaculo;
        		obs.cor = "rgb("+r+", "+g+", "+b+")";
        		listaDeObstaculos.push(obs);
        		total = total + w + espacamento;
        	}while(total < (W - espacamento));
        }
    }
};
function exibirCoordenadas(obj) 
{
	var cordenadas = obj.nome.toUpperCase() + " = { posicao: {x: "+obj.posicao.x+", y: "+
	obj.posicao.y+"}, dimensao: {x: "+obj.dimensao.x+", y: "+obj.dimensao.y+"}}";
	return cordenadas;
};
function ColisaoComUnidades() 
{
	this.algumaColisao = function()
	{
		var alguma = false;
		if(this.barraColidiu())
		{
			//A Clara morreu!!! Quem você acha que vai ser a proxíma companion?
			alguma = true;//O que alguém vai fazer com isso?
		}
		if(this.bolaColisaoTerreno())
		{
			bola.colisoes.quantas += 1;
			new Sons().tocarParede();
			alguma = true;
		}
		if(this.bolaColisaoBarra())
		{
			new Sons().tocarBarra();
			bola.colisoes.quantas += 1;
			bola.multKill = 0;
			alguma = true;
		}
		if(this.bolaColisaoObstaculo())
		{
			bola.colisoes.quantas += 1;
			if(opcoes.sons.tipo == "google")
			{
				new Sons().tocarObstaculo();
			}
			alguma = true;
		}
		if(bola.colisoes.emColisao && bola.colisoes.quantas > 5)
		{
			bola.velocidade.y = (bola.velocidade.y > 0 ? bola.velocidade.yC : -(bola.velocidade.yC));
			bola.velocidade.x = (bola.velocidade.x > 0 ? bola.velocidade.xC : -(bola.velocidade.xC));
			bola.colisoes.quantas = 0;
			bola.colisoes.emColisao = false;
		}
		return alguma;
	};
	this.colidiu = function (objeto2, objeto1, margemErro, valor)//Checar colisão com ou sem margem de erro
	{
		/*
			Colisão parece simples matamática basica, e é, o problema é quando
			quando seu algoritmo só consegue ver quadrados e você quer círculos
			então vc mostra um circulo pro usuário mas que internamente é
			tratado como um quadro e ambos compartilham o mesmo centro. 
			Ai vc vai codificar a frase acima e vê seu circulo adentrando
			25% dentro de tudo. Depois de 1 semana reescrevendo essa função
			vc descobre que na verdade o centro do círculo era o vertice
			superior esquerdo do quadrado '-'
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
			if(x1 < x2 && (x1 + w1*valor) < x2 || (y1 < y2 && (y1 + h1 * valor) < y2))
			{
				return false;
			}
			else
			{
				if((x2 + w2) < (x1 + w1*(1 - valor)) || (y2 + h2) < (y1 + h1 * (1 - valor)))
				{
					return false;
				}
			}
		}
		return true;
	};
	this.barraColidiu = function ()//Caso a barra colida com as paredes
	{
		if(barra.posicao.x >= canvas.width - barra.dimensao.x)
		{
			barra.posicao.x = canvas.width - barra.dimensao.x;
			return true;
		}
		if(barra.posicao.x < 0)
		{
			barra.posicao.x = 0;
			return true;
		}
		return false;
	};
	this.bolaColisaoTerreno = function ()
	{
		if(bola.posicao.y >= canvas.height)//Colisão chão
		{
			bola.velocidade.x = 0;
			bola.velocidade.y = bola.colisoes.vel.y;
			bola.posicao.y = canvas.height/2;
			bola.posicao.x = canvas.width/2;
			bola.colisoes.emColisao = true;
			bola.colisoes.quantas = 0;
			new Sons().tocarShutDown();
			bola.vidas -=1;
			if(bola.vidas <= 0)
			{	
				clearTimeout(gameLoop);
			}
			return false;
		}
	    if(bola.posicao.y < bola.raio)//Colisão teto
	    {
	    	bola.velocidade.y *= bola.restituicao;
	    	bola.posicao.y = bola.raio;
	    	return true;
	    }
	    if(bola.posicao.x > canvas.width - bola.raio)//Colisão lado direito
	    {
	    	bola.velocidade.x *= bola.restituicao;
	    	bola.posicao.x = canvas.width - bola.raio;
	    	return true;
	    }
	    if(bola.posicao.x < 0 + bola.raio)//Colisão lado esquerdo
	    {
	    	bola.velocidade.x *= bola.restituicao;
	    	bola.posicao.x = bola.raio;
	    	return true;
	    }
	    return false;
	};
	this.bolaColisaoBarra = function ()
	{
		if(this.colidiu(barra, bola, true, 0.80))
		{
			bola.velocidade.y *= bola.restituicao;
			bola.velocidade.x = this.parteDaBola(barra);
			bola.posicao.y = barra.posicao.y - bola.raio*2;
			multKill = 0;
			return true;
      		//bola.posicao.y = barra.posicao.y - bola.raio*2;
      	}
      	return false;
    };
	this.bolaColisaoObstaculo = function()
	{
	  	var houveColisao = false;
	  	for (var i = 0; i < listaDeObstaculos.length; i++) 
	  	{
	  		if(this.colidiu(listaDeObstaculos[i], bola, false, 1))
	  		{
	  			bola.velocidade.y *= bola.restituicao;
	  			bola.velocidade.x = this.parteDaBola(listaDeObstaculos[i]);
	  			listaDeObstaculos.splice(i, 1);
	  			houveColisao = true;
	  			if(opcoes.sons.tipo == "lol")
	  				switch(multKill)
	  			{
	  				case 0:
	  				new Sons().tocarSingleKill();
	  				break;
	  				case 1:
	  				new Sons().tocarDoubleKill();
	  				break;
	  				case 2:
	  				new Sons().tocarTripleKill();
	  				break;
	  				case 3:
	  				new Sons().tocarQuadraKill();
	  				break;
	  				case 4:
	  				new Sons().tocarPentaKill();
	  				multKill = -1;
	  				break;	
	  			}
	  			multKill++;
	  			break;
	  		}
	  	}
	  	return houveColisao;
	};
  	this.parteDaBola = function(barra)
  	{
  		var gambi;
  		if(bola.colisoes.emColisao)
  			gambi = bola.colisoes.vel.x;
  		else
  			gambi = bola.velocidade.xC;
  		if(bola.posicao.x < barra.posicao.x + (barra.dimensao.x * 0.35))
  			return gambi * (-1);
  		else if(bola.posicao.x + bola.dimensao.x < barra.posicao.x + (barra.dimensao.x * 0.7))
  			return 0;
  		return gambi;
  	};
};
function Sons() 
{
	this.colisaoBarra = document.getElementById("barra");
	this.colisaoObstaculo = document.getElementById("obstaculo");
	this.colisaoParede = document.getElementById("parede");
	this.shutDown = document.getElementById("shutDown");
	this.singleKill = document.getElementById("singleKill");
	this.doubleKill = document.getElementById("doubleKill");
	this.tripleKill = document.getElementById("tripleKill");
	this.quadraKill = document.getElementById("quadraKill");
	this.pentaKill = document.getElementById("pentaKill");
	this.ace = document.getElementById("ace");
	this.tocarAce = function() 
	{
		if(opcoes.sons.ligado)
		{
			this.ace.play();
		}
	}
	this.tocarBarra = function()
	{
		if(opcoes.sons.ligado)
		{
			this.colisaoBarra.play();
		}
	}
	this.tocarObstaculo = function()
	{
		if(opcoes.sons.ligado)
		{
			this.colisaoObstaculo.play();
		}
	}
	this.tocarParede = function()
	{
		if(opcoes.sons.ligado)
		{
			this.colisaoParede.play();
		}
	}
	this.tocarSingleKill = function() 
	{
		if(opcoes.sons.ligado)
		{
			if(cheat)
			{
				this.singleKill.currentTime = 0;
			}
			this.singleKill.play();
		}
	}
	this.tocarDoubleKill = function() 
	{
		if(opcoes.sons.ligado)
		{
			if(cheat)
			{
				this.singleKill.currentTime = 0;
			}
			this.doubleKill.play();
		}
	}
	this.tocarTripleKill = function() 
	{
		if(opcoes.sons.ligado)
		{
			if(cheat)
			{
				this.singleKill.currentTime = 0;
				this.doubleKill.currentTime = 0;
			}
			this.tripleKill.play();
		}
	}
	this.tocarQuadraKill = function() 
	{
		if(opcoes.sons.ligado)
		{
			if(cheat)
			{
				this.singleKill.currentTime = 0;
				this.doubleKill.currentTime = 0;
				this.tripleKill.currentTime = 0;
			}
			this.quadraKill.play();
		}
	}
	this.tocarPentaKill = function() 
	{
		if(opcoes.sons.ligado)
		{
			if(cheat)
			{
				this.singleKill.currentTime = 0;
				this.doubleKill.currentTime = 0;
				this.tripleKill.currentTime = 0;
				this.quadraKill.currentTime = 0;
			}
			this.pentaKill.play();
		}
	}
	this.tocarShutDown = function() 
	{
		if(opcoes.sons.ligado)
		{
			this.shutDown.play();
		}
	}
};
function initComponents(w, h) 
{
	W = w;
	H = h;
	canvas = new Canvas(w, h);
	ctx = canvas.objeto.getContext("2d");
	bola = new Bola();
	barra = new Barra();
	botao1 = new Botao("←", W*0.005, H*0.6);
	botao2 = new Botao("→", W*0.85, H*0.6);
	canvas.keys[37] = false;
	canvas.keys[39] = false;
	tratarColisoes = new ColisaoComUnidades();
	gerarObstaculos();
	canvas.drawCoordenadas();
	//window.addEventListener("keydown", canvas.eventos.keyboardEntrada, false);
	window.addEventListener("keydown", function (e) {
	    	canvas.keys[e.keyCode] = true;
	});
	window.addEventListener("keyup", function (e) {
	    	canvas.keys[e.keyCode] = false;
	});
	canvas.objeto.addEventListener("touchstart", function (e) {
	    	//canvas.keys[e.keyCode] = true;
	    	canvas.eventos.mouseDown(e);
	});
	canvas.objeto.addEventListener("touchend", function (e) {
	    	//canvas.keys[e.keyCode] = false;
	    	canvas.eventos.mouseUp(e);
	});
	/*window.addEventListener("touchmove", function (e) {
	    	//canvas.keys[e.keyCode] = false;
	    	canvas.eventos.touchMove(e);
	});*/
	canvas.objeto.addEventListener("mousemove", canvas.eventos.movimentoMouse, false);
	for(var i = 0; i < listaDeObstaculos.length; i++)//Desenar obstaculos
	{
		listaDeObstaculos[i].draw();
	}
	bola.draw();
	barra.draw();
	botao1.draw();
	botao2.draw();
	gameLoop = setInterval("loop()", 1000/canvas.frames);
}
function loop() 
{	
	tratarColisoes.algumaColisao();
	canvas.algumMovimento();
	barra.posicao.x += barra.velocidade.x;
	bola.posicao.y += bola.velocidade.y;
	bola.posicao.x += bola.velocidade.x;
	canvas.limparTela();
	canvas.drawCoordenadas();
	for(var i = 0; i < listaDeObstaculos.length; i++)//Desenar obstaculos
	{
		listaDeObstaculos[i].draw();
	}
	bola.draw();
	barra.draw();
	botao1.draw();
	botao2.draw();
	if(bola.vidas <= 0)
	{	
	   	clearTimeout(gameLoop);
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		drawTARDIS();
	}
	if(listaDeObstaculos.length == 0)
	{
	   	clearTimeout(gameLoop);
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		new Sons().tocarAce();
		vencedor();
	}
}
function drawTARDIS()//Tédio...
{
	ctx.beginPath();

	ctx.fillStyle = "white";
	ctx.rect(((W/2)-(W*0.03)/2), H/5.5, W*0.03, W*0.032);
	ctx.fill();
	ctx.fillStyle = "royalblue";
	ctx.fillRect(canvas.width/2 - (W/9)/2, canvas.height/3.9, W/9, H/49);
	ctx.fillRect(canvas.width/2 - (W/8)/2, canvas.height/3.6, W/8, H/49);
	ctx.fillRect(canvas.width/2 - (W/6.5)/2, canvas.height/3.3, W/6.5, H/49);
	ctx.fillRect(canvas.width/2 - (W/6.5)/2, canvas.height/3, W/6.5, H/2.6);
	ctx.fillStyle = "black";
	ctx.fillRect(canvas.width/2 - (W/6.8)/2, canvas.height/3.2, W/6.8, H/24.75);
	ctx.fillStyle = "lightgray";
	ctx.fillRect(canvas.width/2 - (W/6.8)/2, canvas.height/2.75, W/23.5, H/10);
	ctx.strokeStyle ="#383838";
	ctx.lineWidth= 0.7;
	ctx.moveTo(canvas.width/2 - (W/6.8)/2, canvas.height*0.4);
	ctx.lineTo(canvas.width/2 - (W/6.8)/4.5, canvas.height*0.4);
	ctx.moveTo(canvas.width/2 - W/16, canvas.height*0.365);
	ctx.lineTo(canvas.width/2 - W/16, canvas.height*0.463);
	ctx.moveTo(canvas.width/2 - W/23, canvas.height*0.365);
	ctx.lineTo(canvas.width/2 - W/23, canvas.height*0.463);
	ctx.stroke();
	ctx.fillRect(canvas.width/2 + (W/6.8)/5, canvas.height/2.75, W/23.5, H/10);
	ctx.moveTo(canvas.width/2 + (W/6.8)/5, canvas.height*0.4);
	ctx.lineTo(canvas.width/2 + (W/6.8)/2.05, canvas.height*0.4);
	ctx.moveTo(canvas.width/2 + W/16, canvas.height*0.365);
	ctx.lineTo(canvas.width/2 + W/16, canvas.height*0.463);
	ctx.moveTo(canvas.width/2 + W/23, canvas.height*0.365);
	ctx.lineTo(canvas.width/2 + W/23, canvas.height*0.463);
	ctx.stroke();
	ctx.strokeStyle = "black";
	ctx.fillStyle = "royalblue";
	ctx.fillRect(canvas.width/2 - (W/5.85)/2, canvas.height/1.4, W/5.85, H/49.5);
	ctx.fillRect(canvas.width/2 - (W/4.68)/2, canvas.height/1.36, W/4.68, H/49.5);
	ctx.moveTo(canvas.width/2, canvas.height/3.2);
	ctx.lineTo(canvas.width/2, canvas.height/4 + 240);
	ctx.stroke();
	ctx.fillStyle = "white";
	ctx.font = W*0.012+"px Segoe UI Light";
	ctx.fillText("GAME OVER", canvas.width/2 - (W/15)/2, canvas.height/2.9);
	ctx.closePath();
	ctx.beginPath();
	ctx.fillStyle = "rgba(0, 0, 0, 0.8)";
	ctx.arc(canvas.width/2 + (W*0.005)*3, canvas.height/2 + (W*0.005)*5, W*0.005, 0, Math.PI*2, true);
	ctx.fill();
	ctx.fillStyle = "red";
	ctx.fillRect(canvas.width/8, canvas.height/4, W/5, H/12);
	ctx.font = W*0.025+"px Segoe UI Light";
	ctx.fillStyle = "white";
	ctx.fillText("RETRY", canvas.width/5.2, canvas.height/3.2);
	ctx.closePath();
}
function Botao(texto, lx, ly)
{
	this.nome = "Botão";
	this.texto = texto;
	this.dimensao = {x: W/7, y: H*0.15};
	this.posicao = {x: lx, y: ly};
	this.cor = "rgba(31, 32, 33, 0.05)";
	this.draw = function()
	{
		ctx.beginPath();
			ctx.shadowBlur = 0.5;
			ctx.shadowColor = "white";
			ctx.fillStyle = this.cor;
			ctx.fillRect(this.posicao.x, this.posicao.y, this.dimensao.x, this.dimensao.y);
			ctx.shadowBlur = 0;
			ctx.shadowColor = "blue";
			ctx.font = W*0.08+"px Segoe UI Light";
			ctx.fillStyle = "white";
			ctx.fillText(this.texto, this.posicao.x+(this.dimensao.x/4), this.posicao.y+(this.dimensao.y/1.2));
		ctx.closePath();
	};
}
