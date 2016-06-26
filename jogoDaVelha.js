var player1, player2;
function Game() 
{
	this.jogador = 88;
	this.showTwoPlayer = function()
	{			
		document.getElementById('player2').readOnly = false;
		document.getElementById('player2').value = "";
		document.getElementById("2p").checked = true;
		document.getElementById("1p").checked = false;
	};
	this.hideTwoPlayer = function()
	{
		document.getElementById('player2').readOnly = true;
		document.getElementById('player2').value = "Prudence";
		document.getElementById("2p").checked = false;
		document.getElementById("1p").checked = true;
	};
	this.doAnimationSuaVez = function (who) 
	{
		if(who=="#j1")
		{
        	$("#j2").css({"background" : "rgb(242, 242, 242)"});
        	$("#j2").css({"color" : "#716f6f"});
        	$("#j1").css({"background" : "white"});
        	$("#j1").css({"color" : "black"});
		}
		else
		{
        	$("#j1").css({"background" : "rgb(242, 242, 242)"});
        	$("#j1").css({"color" : "#716f6f"});
        	$("#j2").css({"background" : "white"});
        	$("#j2").css({"color" : "black"});
		}
	}
	/*
		Ação de clicar em um dos quadrados
	*/
	this.marcar = function ()
	{
		if(this.value.length == 0 && !quadro.noClicks)
		{
			if(game.jogador == 88)
			{
				this.value = "x";
				game.jogador = 79;
				game.gameLoop();
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
					game.doAnimationSuaVez('#j2');
				}
			}
			else
			{
				this.value = "o";
				game.jogador = 88;
				game.gameLoop();
				game.doAnimationSuaVez('#j1');
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
		quadro.all = document.getElementsByClassName("inputBox");
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
		$("#next").css({"visibility": "visible"});
        $("#next").animate({opacity : '1'}, 500, null);
		quadro.noClicks = true;
	};
	this.doAnimationFocus = function(argument)
	{
		for(var i = 0; i < quadro.winAll.length; i++) 
		{
			for (var j = 0; j < quadro.winAll[i].length; j++) 
			{
				quadro.winAll[i][j].style.background = "#a29d9d";
				quadro.winAll[i][j].style.opacity = "0.3";
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
	this.all = null;
	this.rodada = {obj: document.getElementById("rodada"), valor: 0};
	this.winAll = [[], [], [], [], [], [], [], []];
	this.clear = function()
	{
		for(var i = 0; i < this.all.length; i++)
		{
			this.all[i].value = "";
			this.all[i].style.color = "black";
			this.all[i].style.opacity = "1";
			this.all[i].style.background = "white";
		}
		quadro.rodada.valor+=1;
		quadro.rodada.obj.innerText = quadro.rodada.valor;
		$("#next").animate({opacity: "0"}, 500, function() {
				$("#next").css({"visibility": "hidden"})
		});
		bot.numJogadas = 0;
		if(bot.playWithBot && quadro.rodada.valor % 2 != 0)
		{
			quadro.all[4].value = "o";
			bot.numJogadas+=1;
			game.gameLoop();
			game.jogador = 88;
		}
		quadro.noClicks = false;
	};
	this.isFull = function()
	{
		var cheio = true;
		for(var i = 0; i < this.all.length; i++)
		{
			if(this.all[i].value.length == 0)
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
			var texto = quadro.winAll[i][0].value + quadro.winAll[i][1].value + quadro.winAll[i][2].value;
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
	this.vezDoBot = function()
	{
		var possiveis = new Array();
		var num = bot.possivelVitoria();
		if(!quadro.noClicks)
		{
			if(num != null)
			{
				num.style.color = "black";
				num.value = "o";
			}
			else
			{
				//alert(bot.userMarcouCentro());
				if(!bot.analisarPrimeiroMovimento())
				{
					if(!bot.analisarSegundoMovimento())
					{
						for(var j = 0; j < quadro.all.length; j++)
						{
							if(quadro.all[j].value.length == 0)
							{
								possiveis.push(quadro.all[j]);
							}
						}
						var total = possiveis.length;
						var qual =  Math.floor(Math.random() * total);
						possiveis[qual].value = "o";
					}
				}
				this.numJogadas+=1;
			}
		}
	};
	this.analisarPrimeiroMovimento = function() 
	{
		if(this.numJogadas == 0 && quadro.all[4].value.length == 1)
		{
			quadro.all[0].value = "o";
			return true;
		}
		else if(this.numJogadas == 0 && quadro.all[4].value.length == 0)
		{
			quadro.all[4].value = "o";
			return true;	
		}
		return false;
	};
	this.analisarSegundoMovimento = function() 
	{
		if(this.numJogadas == 1)
		{
			var i = -1;
			if(quadro.all[2].value.length == 0)
				i = 2;
			else if(quadro.all[6].value.length == 0)
				i = 6;
			else if(quadro.all[8].value.length == 0)
				i = 8;
			if (i == -1)
			{
				return false;
			}
			else
			{
				if( quadro.all[0].value == "x" && quadro.all[8].value == "x"
						|| 
				    quadro.all[2].value == "x" && quadro.all[6].value == "x")
				{

					quadro.all[3].value = "o";	
				}
				else
				{
					if(i == 2 && quadro.all[0].value == "x" && quadro.all[7].value == "x")
						i = 6;
					quadro.all[i].value = "o";
				}
				return true;
			}
		}
		return false;
	};
	this.possivelVitoria = function() 
	{
		var onde = 42;
		var l = null;
		for (var i = 0; i < quadro.winAll.length; i++) 
		{
			var texto = quadro.winAll[i][0].value + quadro.winAll[i][1].value + quadro.winAll[i][2].value;
			if(texto == "oo")
			{
				onde = bot.quemTaVazio(quadro.winAll[i]);
				l = quadro.winAll[i][onde];
				break;
			}
			else
			{
				if(texto == "xx")
				{
					onde = bot.quemTaVazio(quadro.winAll[i]);
					l = quadro.winAll[i][onde];
				}
			}
		}
		return l;
	};
	this.quemTaVazio = function(argument) 
	{
		var index;
		for (var i = 0; i < argument.length; i++) {
			if(argument[i].value == "")
			{
				index = i;
				break;
			}
		};
		return index;
	}
}

function Player(idObjName, idObjPonto, nome, ponto) 
{
	if(nome=="")
	{
		nome = "The Doctor";
	}
	this.objNome = document.getElementById(idObjName);
	this.objNome.innerText = nome;
	this.pontos = {obj: document.getElementById(idObjPonto), valor: ponto};
	this.pontos.obj.innerText = this.pontos.valor;
}
function menu() 
{
            	/*player1 = new Player('nomeJogador1', 'pontoJogador1', 'nome1', 0);
            	player2 = new Player('nomeJogador2', 'pontoJogador2', 'nome2', 0);
            		bot.playWithBot = true;
            	game.initComponents();*/
	var title = "Menu";
	var message = "";
	var buttons =  
	{
		success: 
		{
            label: "Save",
            className: "btn-primary",
            callback: function () {
            	var nome1 = document.getElementById('player1').value;
            	var nome2 = document.getElementById('player2').value;
            	player1 = new Player('nomeJogador1', 'pontoJogador1', nome1, 0);
            	player2 = new Player('nomeJogador2', 'pontoJogador2', nome2, 0);
            	if(nome2=="Prudence")
            	{
            		bot.playWithBot = true;
            	}
            	game.doAnimationSuaVez("#j1");
            	game.initComponents();
            }
        }
    }
	message = "<div class='row'>"
                + "<div class='col-md-12 noBorder'>"
                + "Modo de Jogo:"
                + "</div>"
                + "<div class='col-md-11 col-md-offset-1 noBorder'>"
                + "<label onclick='game.hideTwoPlayer()'>"
                + "<input type='radio' name='modeGame' value='Multplayer' id='1p' checked> "
                + "Single Player"
                + "</label>"
                + "</div>"
                + "<div class='col-md-11 col-md-offset-1 noBorder'>"
                + "<label onclick='game.showTwoPlayer()'>"
                + "<input type='radio' name='modeGame' value='SinglePlayer' id='2p'> "
                + "Multplayer"
                + "</label>"
                + "</div>"
                + "<div class='col-md-6 col-xs-6 noBorder'>"
                + "<input type='text' placeholder='Jogador 1' "
                + "class='form-control input-md' id='player1' maxlength='8'>"
                + "</div>"
                + "<div class='col-md-6 col-xs-6 noBorder'>"
                + "<input type='text' placeholder='Jogador 2' "
                + "class='form-control input-md' id='player2' maxlength='8'>"
                + "</div>"
                + "</div>";

    bootbox.dialog({
    	title: title,
    	message: message,
    	buttons:buttons
    });
}