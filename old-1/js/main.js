"use strict";(function(){$($('.owl-carousel')[0]).owlCarousel({loop:true,margin:5,nav:false,dots:false,responsive:{0:{items:2},700:{items:4},1000:{items:3},1200:{items:4}}});$($('.owl-carousel')[1]).owlCarousel({loop:true,margin:0,nav:false,dots:false,responsive:{0:{items:1},600:{items:1},1000:{items:1}}});})();(function(){$('.button-collapse').sideNav();$('#message').val("");})();(function(){$.fn.scrollingTo=function(opts){let defaults={animationTime:1000,easing:'',topSpace:0,callbackBeforeTransition:function(){},callbackAfterTransition:function(){}};let config=$.extend({},defaults,opts);$(this).on('click',function(e){var eventVal=e;e.preventDefault();let $section=$(document).find($(this).data('section'));if($section.length<1){return false;}if($('html, body').is(':animated')){$('html, body').stop(true,true);}let scrollPos=$section.offset().top;if($(window).scrollTop()==(scrollPos+config.topSpace)){return false;}config.callbackBeforeTransition(eventVal,$section);let newScrollPos=(scrollPos-config.topSpace);$('html, body').animate({'scrollTop':(newScrollPos+'px')},config.animationTime,config.easing,function(){config.callbackAfterTransition(eventVal,$section);});return $(this);});$(this).data('scrollOps',config);return $(this);};})();(function(){let sections=$("section");function getActiveSectionLength(section,sections){return sections.index(section);}if(sections.length>0){sections.waypoint({handler:function(event,direction){let active_section,active_section_index,prev_section_index,scrollDirection;active_section=$(this);active_section_index=getActiveSectionLength($(this),sections);prev_section_index=(active_section_index-1);if(direction==="up"){scrollDirection="up";if(prev_section_index<0){active_section=active_section;}else{active_section=sections.eq(prev_section_index);}}else{scrollDirection="Down";}if(active_section.attr('id')!='landing'){let active_link=$('.ka-ka[href="#'+active_section.attr("id")+'"]');active_link.parent('li').addClass("current").siblings().removeClass("current");}else{$('.ka-ka').parent('li').removeClass('current');}},offset:'35%'});}})();function owlNav(action){$('.owl-carousel').trigger(action);}function showBack(onde){$(onde+' .back').animate({height:'100%'},300,function(){$(onde+' .edu-item-back-header').css('display','block');$(onde+' .edu-item-back-header div').css('display','block');$(onde+' .edu-item-back-info').css('display','block');});}function closeBack(onde){$(onde+' .edu-item-back-header').css('display','none');$(onde+' .edu-item-back-header div').css('display','none');$(onde+' .edu-item-back-info').css('display','none');$(onde+' .back').animate({height:'0%'},300);}$(document).ready(function(){$('.modal-trigger').leanModal();let tam=window.matchMedia("(max-width: 800px)").matches;let maxHeight=$(".skill-chart").height()-(tam?135:140);$("div[skill-percent]").each(function(){let value=$(this).attr('skill-percent');$(this).find('.skill-height-value').text((value*100).toFixed(0)+"%");$(this).find('.skill-height').css('height',((maxHeight)*value)+"px");});$("#gallery-content>div").on('mouseover',function(){$(this).find('.disc').css('opacity','0.5');$(this).find('.header').css('height','30%');});$("#gallery-content>div").on('mouseout',function(){$(this).find('.disc').css('opacity','1');$(this).find('.header').css('height','0%');});$(".modal-trigger").on('click',function(){$(".modal-info").focus();$("#myModal").scrollTop(0);let imgs=$(this).attr('modal-images').split(',');let tags=$(this).attr('modal-tags').split(',');let buttons=$(this).attr('modal-buttons').split(',');let title=$(this).attr('modal-title');let text=$(this).attr('modal-text');$(".imgs-modal-1").attr('src','img/'+imgs[0]);$(".imgs-modal-2").attr('src','img/'+imgs[1]);$(".imgs-modal-1").css({'width':'auto','max-width':'100%'});$(".imgs-modal-2").css({'width':'auto','max-width':'100%'});$('.modal-techs').html("");tags.forEach(function(a,b,c){$('.modal-techs').append("<div>"+a+"</div>");});if(buttons[0]=="null")$(".modal-btn-access").attr('disabled','disabled');else{$(".modal-btn-access").removeAttr('disabled');$(".modal-btn-access").attr('href',buttons[0]);}if(buttons[1]=="null")$(".modal-btn-github").attr('disabled','disabled');else{$(".modal-btn-github").removeAttr('disabled');$(".modal-btn-github").attr('href',buttons[1]);}$('.modal-text').html(text);$('.modal-title').text(title);});$('.ka-ka').scrollingTo({easing:'easeOutQuart',animationTime:1800,callbackBeforeTransition:function(e){if(e.currentTarget.hash!==""){if(e.currentTarget.hash!=='#landing'){$(e.currentTarget).parent().addClass('current').siblings().removeClass('current');}else
$('.current').removeClass('current');}$('.button-collapse').sideNav('hide');},callbackAfterTransition:function(e){if(e.currentTarget.hash!==""){if(e.currentTarget.hash==='#landing'){window.location.hash='';}else{window.location.hash=e.currentTarget.hash;}}}});$('.down').scrollingTo({easing:'easeOutQuart',animationTime:1300,callbackBeforeTransition:function(e){},callbackAfterTransition:function(e){window.location.hash=e.currentTarget.hash;}});$('.contact-submit-button').on('click',function(){event.preventDefault();if(document.getElementById('contactForm').checkValidity()){ajaxPost(function(xhr,status){alert("Sua menssagem foi enviada com sucesso!");$("html, body").animate({scrollTop:0},"slow");window.location.hash="#";});}else{alert("Preencha todos os campos corretamente");}});$("#skills-next-button").on("click", function(){owlNav($(this).attr("data"));});$("#skills-prev-button").on("click", function(){owlNav($(this).attr("data"));});});function ajaxPost(callback){var form=document.getElementById("contactForm");var url=form.action,xhr=new XMLHttpRequest();var params=[].filter.call(form.elements,function(el){return typeof(el.checked)==='undefined'||el.checked;});xhr.open("POST",url);xhr.setRequestHeader("Content-type","application/x-www-form-urlencoded");xhr.onload=callback.bind(xhr);xhr.send($(form).serialize());}