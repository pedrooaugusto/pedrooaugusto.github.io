var player1, player2;
function Game() 
{
	this.jogador = 88;
	this.doAnimationSuaVez = function (who) 
	{
		if(who=="1")
		{
        	$(".score-play-1").css({"background" : "#f4f3fb"});
        	$(".score-play-2").css({"background" : "white"});
		}
		else
		{
			$(".score-play-2").css({"background" : "#f4f3fb"});
        	$(".score-play-1").css({"background" : "white"});
		}
	};
	this.formatName = function(nome)
	{
		if(nome.length > 10)
			return nome.substring(0, 1).toUpperCase()+
				nome.substring(1, 5).toLowerCase()+"...";
		return nome.substring(0, 1).toUpperCase()+
				nome.substring(1, nome.length).toLowerCase();
	};
	/*
		Ação de clicar em um dos quadrados
	*/
	this.marcar = function ()
	{
		if(this.innerText.length == 0 && !quadro.noClicks)
		{
			if(game.jogador == 88)
			{
				this.innerText = "x";
				game.jogador = 79;
				game.gameLoop();
				player1.addMovimento(this);
				if(bot.playWithBot == true)
				{
					if(!quadro.isFull())
					{
						game.jogador = 88;
						bot.vezDoBot();
						game.gameLoop();
					}
				}
				else
				{
					game.doAnimationSuaVez("2");
				}
			}
			else
			{
				this.innerText = "o";
				game.jogador = 88;
				game.gameLoop();
				game.doAnimationSuaVez("1");
			}
		}
	};
	/*
		Laço de jogo, todas as verificações que ocorrem após
		um click
	*/
	this.gameLoop = function()
	{
		if(!quadro.noClicks && quadro.anyVictory())
		{
			if(game.jogador == 79)
			{
				player1.pontos.valor +=1;
				player1.pontos.obj.innerText = player1.pontos.valor;
				game.doAnimationWin();
				if(bot.playWithBot){
					alert("Oh!<br>Envie isto pra mim:\n"+bot.historicoMovimento+"\n"+player1.historicoMovimento);
				}
			}
			else
			{
				player2.pontos.valor +=1;
				player2.pontos.obj.innerText = player2.pontos.valor;
				game.doAnimationWin();
			}
		}
		else
		{
			if(quadro.isFull())
			{
				game.doAnimationWin();
			}
		}
	};

	this.initComponents = function ()
	{
		quadro.all.push.apply(quadro.all, document.getElementsByClassName("velha-espaco"));
		for(var i = 0; i < quadro.all.length; i++) 
		{
			quadro.all[i].onclick = game.marcar;
			quadro.all[i].setAttribute("readonly", true);
		}
		quadro.winAll[0][0] = quadro.all[0];	quadro.winAll[3][0] = quadro.all[0];		
		quadro.winAll[0][1] = quadro.all[1];	quadro.winAll[3][1] = quadro.all[3];
		quadro.winAll[0][2] = quadro.all[2];	quadro.winAll[3][2] = quadro.all[6];

		quadro.winAll[1][0] = quadro.all[3];	quadro.winAll[4][0] = quadro.all[1];
		quadro.winAll[1][1] = quadro.all[4];	quadro.winAll[4][1] = quadro.all[4];
		quadro.winAll[1][2] = quadro.all[5];	quadro.winAll[4][2] = quadro.all[7];

		quadro.winAll[2][0] = quadro.all[6];	quadro.winAll[5][0] = quadro.all[2];
		quadro.winAll[2][1] = quadro.all[7];	quadro.winAll[5][1] = quadro.all[5];
		quadro.winAll[2][2] = quadro.all[8];	quadro.winAll[5][2] = quadro.all[8];

		quadro.winAll[6][0] = quadro.all[0];	quadro.winAll[7][0] = quadro.all[2];
		quadro.winAll[6][1] = quadro.all[4];	quadro.winAll[7][1] = quadro.all[4];
		quadro.winAll[6][2] = quadro.all[8];	quadro.winAll[7][2] = quadro.all[6];
	};
	this.doAnimationWin = function()
	{
		/*$("#next").css({"visibility": "visible"});
        $("#next").animate({opacity : '1'}, 500, null);*/
        $("#next").toggle(200);
		quadro.noClicks = true;
	};
	this.doAnimationFocus = function(argument)
	{
		for(var i = 0; i < quadro.winAll.length; i++) 
		{
			for (var j = 0; j < quadro.winAll[i].length; j++) 
			{
				quadro.winAll[i][j].style.background = "#fbfbfb";
				quadro.winAll[i][j].style.color = "#ccc";
				quadro.winAll[i][j].style.opacity = "0.9";
			}
		}
		for(var k = 0; k < quadro.winAll[argument].length; k++) 
		{
			quadro.winAll[argument][k].style.background = "white";
			quadro.winAll[argument][k].style.color = "red";
			quadro.winAll[argument][k].style.opacity = "1";
		}
	}
}
function Quadro() 
{
	this.noClicks = false;
	this.all = new Array();
	this.rodada = {obj: document.getElementById("rodada"), valor: -1};
	this.winAll = [[], [], [], [], [], [], [], []];
	this.clear = function()
	{
		for(var i = 0; i < this.all.length; i++)
		{
			this.all[i].innerText = "";
			this.all[i].style.color = "black";
			this.all[i].style.opacity = "1";
			this.all[i].style.background = "white";
		}
		quadro.rodada.valor+=1;
		quadro.rodada.obj.innerText = quadro.rodada.valor;
		/*$("#next").animate({opacity: "0"}, 500, function() {
				$("#next").css({"visibility": "hidden"})
		});*/
		bot.numJogadas = 0;
		player1.numJogadas = 0;
		player1.historicoMovimento = [];
		bot.historicoMovimento = [];
		quadro.noClicks = false;
		player1.primeiroMove = -1;
		if(bot.playWithBot && quadro.rodada.valor % 2 == 0)
		{
			bot.vezDoBot();
			game.gameLoop();
			game.jogador = 88;
			//player1.jogarSozinho();
		}
		/*else if(bot.playWithBot)
		{
			player1.jogarSozinho();
		}*/
	};
	this.isFull = function()
	{
		var cheio = true;
		for(var i = 0; i < this.all.length; i++)
		{
			if(this.all[i].innerText.length == 0)
			{
				cheio = false;
				break;
			}
		}
		return cheio;
	};
	this.anyVictory = function()
	{
		var oque = false;
		for (var i = 0; i < quadro.winAll.length; i++) 
		{
			var texto = quadro.winAll[i][0].innerText + quadro.winAll[i][1].innerText + quadro.winAll[i][2].innerText;
			if(texto == "ooo" || texto == "xxx")
			{
				oque = true;
				quadro.noClicks = true;
				game.doAnimationFocus(i);
				break;
			}
		}
		return oque;
	}
}
function Bot() 
{
	this.playWithBot = false;
	this.numJogadas = 0;
	this.historicoMovimento = new Array();
	this.vezDoBot = function()
	{
		if(!quadro.noClicks)
		{
			if(!bot.possivelVitoria())//Caso ninguém esteja prestes a ganhar
			{
				switch(bot.numJogadas)
				{
					case 0://Primeira jogada do bot
						if(quadro.all[4].innerText == "x")//Se o centro estiver ocupado
							bot.jogarEmLugarDisponivelAleatorio([1, 3, 5, 7]);//jogar na diagonal
						else//centro livre
						{
							quadro.all[4].innerText = "o";//jogar no centro
							this.addMovimento(quadro.all[4]);
						}
					break;
					case 1://Segunda jogada do bot (dicide-se o jogo)
						if(quadro.rodada.valor % 2 == 0)//Caso o bot tenha começado jogando
							if(player1.historicoMovimento[0][0] == 'E')//E o user tenha marcado uma esquina
								bot.jogarEmLugarDisponivelAleatorio([1, 3, 5, 7]);//Não importa, sem chances de ganhar
							else//E o user marcou um dos cantos-centro
								bot.jogarEmLugarDisponivelAleatorio([1, 3, 5, 7]);//Jogue um uma esquina e o jogo acabou
						else//Caso o humano tenha começado jogando
							if(player1.historicoMovimento[0][0] == 'E' && player1.historicoMovimento[1][0] == 'E')
								//E tenha marcado em uma esquina 2 vezes seguidas
								bot.jogarEmLugarDisponivelAleatorio([0, 2, 6, 8]);//Jogar em um dos cantos-centro que é gg
							else if(player1.historicoMovimento[0][0] == 'M')//Caso tenha roubado nosso centro
								bot.jogarEmLugarDisponivelAleatorio([1, 3, 5, 7]);//vamos para as esquinas
							else if(player1.historicoMovimento[0][0] == 'E' && player1.historicoMovimento[1][0] == 'C')
								bot.jogarIntercecaoDeDoisWins(1);
							else if(!bot.jogarIntercecaoDeDoisWins(0))
								bot.jogarEmLugarDisponivelAleatorio([1, 3, 5, 7]);
					break;
					default://O jogo acaba na segunda vez em que o bot acaba por isso, não importa
						bot.jogarEmLugarDisponivelAleatorio([42]);//não importa, vc não vai nãi vai ganhar
				}
			}
			this.numJogadas+=1;
		}
	};
	this.jogarEmLugarDisponivelAleatorio = function(excluidos)
	{
		var possiveis = new Array();
		for(var j = 0; j < quadro.all.length; j++)
			if(quadro.all[j].innerText.length == 0 && excluidos.indexOf(j) == -1)
				possiveis.push(quadro.all[j]);
		var total = possiveis.length;
		var qual =  Math.floor(Math.random() * total);
		possiveis[qual].innerText = "o";
		this.addMovimento(possiveis[qual]);
	};
	this.possivelVitoria = function() 
	{
		var who = null;
		for (var i = 0; i < quadro.winAll.length; i++) 
		{
			var texto = quadro.winAll[i][0].innerText + quadro.winAll[i][1].innerText + quadro.winAll[i][2].innerText;
			if(texto == "oo")
			{
				bot.quemTaVazio(quadro.winAll[i]);
				return true;
			}
			else if(texto == "xx")
				who = quadro.winAll[i];
		}
		if(who != null)
		{
			bot.quemTaVazio(who);
			return true;
		} 
		return false;
	};
	this.quemTaVazio = function(argument) 
	{
		for(var i = 0; i < argument.length; i++) 
			if(argument[i].innerText == "")
			{
				argument[i].innerText = "o";
				this.addMovimento(argument[i]);
			}
	};
	this.jogarIntercecaoDeDoisWins = function(n)
	{
		var winsVazios = [];
		var winUserMarcouPorUltimo;
		for (var i = 0; i < quadro.winAll.length; i++) {
			var texto = quadro.winAll[i][0].innerText + quadro.winAll[i][1].innerText + quadro.winAll[i][2].innerText;
			if(texto == "x" && quadro.winAll[i].indexOf(quadro.all[player1.historicoMovimento[n][1]]) != -1)
				winUserMarcouPorUltimo = quadro.winAll[i];
			else if(texto == "x")
			{
				winsVazios.push(quadro.winAll[i]);
			}
		}
		for (var i = 0; i < winUserMarcouPorUltimo.length; i++) {
			for (var j = 0; j < winsVazios.length; j++) {
				for (var k = 0; k < winsVazios[j].length; k++) {
					if(winUserMarcouPorUltimo.indexOf(winsVazios[j][k]) != -1)
					{
						winsVazios[j][k].innerText = "o";
						this.addMovimento(winsVazios[j][k]);
						return true;
					}
				};
			}
		}
		return false;
	};
	this.addMovimento = function(lugar)
	{
		//E = esquinas(like 0), C = centro reta (like 1), M = meio
		switch(quadro.all.indexOf(lugar))
		{
			case 0: case 2: case 6: case 8:
				this.historicoMovimento.push(['E', quadro.all.indexOf(lugar)]);
			break;
			case 4:
				this.historicoMovimento.push(['M', quadro.all.indexOf(lugar)]);
			break;
			default:
				this.historicoMovimento.push(['C', quadro.all.indexOf(lugar)]);
		}	
	};
}
function Player(idObjName, idObjPonto, nome, ponto) 
{
	if(nome=="")
	{
		nome = "The Doctor";
	}
	this.objNome = document.getElementById(idObjName);
	this.objNome.innerText = game.formatName(nome);
	this.pontos = {obj: document.getElementById(idObjPonto), valor: ponto};
	this.pontos.obj.innerText = this.pontos.valor;
	this.historicoMovimento = new Array();
	this.numJogadas = 0;
	/*
		Aqui eu não guardo onde ele jogou em si, mas em que
		classe se enquadra o lugar onde el jogou (E, M, C);
	*/
	this.addMovimento = function(lugar)
	{
		//E = esquinas(like 0), C = centro reta (like 1), M = meio
		switch(quadro.all.indexOf(lugar))
		{
			case 0: case 2: case 6: case 8:
				this.historicoMovimento.push(['E', quadro.all.indexOf(lugar)]);
			break;
			case 4:
				this.historicoMovimento.push(['M', quadro.all.indexOf(lugar)]);
			break;
			default:
				this.historicoMovimento.push(['C', quadro.all.indexOf(lugar)]);
		}	
	};
	this.jogarSozinho = function()
	{
		while(!quadro.noClicks && !quadro.anyVictory())
		{
			this.jogarEmLugarDisponivelAleatoriod([23]);
			//game.gameLoop();
			//alert(33);
		}
		//alert(11);
	};
	this.jogarEmLugarDisponivelAleatoriod = function(excluidos)
	{
		/*var possiveis = new Array();
		for(var j = 0; j < quadro.all.length; j++)
			if(quadro.all[j].innerText.length == 0 && excluidos.indexOf(j) == -1)
				possiveis.push(quadro.all[j]);
		var total = possiveis.length;
		var qual =  Math.floor(Math.random() * total);
		if(!this.possivelVitoria())
			possiveis[qual].onclick();*/
		if(!this.possivelVitoria())//Caso ninguém esteja prestes a ganhar
		{
			switch(this.numJogadas)
			{
					case 0://Primeira jogada do this
						if(quadro.all[4].innerText == "o")//Se o centro estiver ocupado
							this.jogarEmLugarDisponivelAleatorio([1, 3, 5, 7]);//jogar na diagonal
						else//centro livre
						{
							quadro.all[4].onclick();
						}
					break;
					case 1://Segunda jogada do this (dicide-se o jogo)
						if(quadro.rodada.valor % 2 != 0)//Caso o this tenha começado jogando
							if(bot.historicoMovimento[0][0] == 'E')//E o user tenha marcado uma esquina
								this.jogarEmLugarDisponivelAleatorio([1, 3, 5, 7]);//Não importa, sem chances de ganhar
							else//E o user marcou um dos cantos-centro
								this.jogarEmLugarDisponivelAleatorio([1, 3, 5, 7]);//Jogue um uma esquina e o jogo acabou
						else//Caso o humano tenha começado jogando
							if(bot.historicoMovimento[0][0] == 'E' && bot.historicoMovimento[1][0] == 'E')
								//E tenha marcado em uma esquina 2 vezes seguidas
								this.jogarEmLugarDisponivelAleatorio([0, 2, 6, 8]);//Jogar em um dos cantos-centro que é gg
							else if(bot.historicoMovimento[0][0] == 'M')//Caso tenha roubado nosso centro
								this.jogarEmLugarDisponivelAleatorio([1, 3, 5, 7]);//vamos para as esquinas
							else if(bot.historicoMovimento[0][0] == 'E' && bot.historicoMovimento[1][0] == 'C')
								this.jogarIntercecaoDeDoisWins(1);
							else if(!this.jogarIntercecaoDeDoisWins(0))
								this.jogarEmLugarDisponivelAleatorio([1, 3, 5, 7]);
					break;
					default://O jogo acaba na segunda vez em que o this acaba por isso, não importa
						this.jogarEmLugarDisponivelAleatorio([42]);//não importa, vc não vai nãi vai ganhar
			}
			this.numJogadas+=1;
		}
	};
	this.possivelVitoria = function() 
	{
		var who = null;
		for (var i = 0; i < quadro.winAll.length; i++) 
		{
			var texto = quadro.winAll[i][0].innerText + quadro.winAll[i][1].innerText + quadro.winAll[i][2].innerText;
			if(texto == "xx")
			{
				this.quemTaVazio(quadro.winAll[i]);
				return true;
			}
			else if(texto == "oo")
				who = quadro.winAll[i];
		}
		if(who != null)
		{
			this.quemTaVazio(who);
			return true;
		} 
		return false;
	};
	this.quemTaVazio = function(argument) 
	{
		for(var i = 0; i < argument.length; i++) 
			if(argument[i].innerText == "")
				argument[i].onclick();	
	};

	this.jogarIntercecaoDeDoisWins = function(n)
	{
		var winsVazios = [];
		var winUserMarcouPorUltimo;
		for (var i = 0; i < quadro.winAll.length; i++) {
			var texto = quadro.winAll[i][0].innerText + quadro.winAll[i][1].innerText + quadro.winAll[i][2].innerText;
			if(texto == "o" && quadro.winAll[i].indexOf(quadro.all[player1.historicoMovimento[n][1]]) != -1)
				winUserMarcouPorUltimo = quadro.winAll[i];
			else if(texto == "o")
			{
				winsVazios.push(quadro.winAll[i]);
			}
		}
		for (var i = 0; i < winUserMarcouPorUltimo.length; i++) {
			for (var j = 0; j < winsVazios.length; j++) {
				for (var k = 0; k < winsVazios[j].length; k++) {
					if(winUserMarcouPorUltimo.indexOf(winsVazios[j][k]) != -1)
					{
						winsVazios[j][k].onclick();
						return true;
					}
				};
			}
		}
		return false;
	};
	this.jogarEmLugarDisponivelAleatorio = function(excluidos)
	{
		var possiveis = new Array();
		for(var j = 0; j < quadro.all.length; j++)
			if(quadro.all[j].innerText.length == 0 && excluidos.indexOf(j) == -1)
				possiveis.push(quadro.all[j]);
		var total = possiveis.length;
		var qual =  Math.floor(Math.random() * total);
		possiveis[qual].onclick();
	};
}
function menu() 
{
    var nome1 = document.getElementById('input-player-1-name').value;
    var nome2 = document.getElementById('input-player-2-name').value;
    player1 = new Player('player-1-name', 'player-1-pts', nome1, 0);
    player2 = new Player('player-2-name', 'player-2-pts', nome2, 0);
    game.doAnimationSuaVez("1");
    game.initComponents();
    if(nome2=="Ana")
        bot.playWithBot = true;
    quadro.clear();
}