document.head.insertAdjacentHTML('beforeend', `<template id="code-input"><style>:host{display:inline-block;font-size:0;overflow:hidden;--box-size:40px;--font-size:30px}div{white-space:nowrap;z-index:100}span,i{background:#333;color:white;display:inline-block;font-size:var(--font-size);text-align:center;vertical-align:middle;width:var(--box-size);height:var(--box-size)}.empty{color:silver}.focus{background:#555}i{color:silver;font-style:normal}input::-webkit-outer-spin-button,input::-webkit-inner-spin-button{-webkit-appearance:none}input{position:absolute;left:-1000px}</style><div><span on-tap="focusDigit"></span> <span on-tap="focusDigit"></span> <span on-tap="focusDigit"></span> <i>&#x2010;</i> <span on-tap="focusDigit"></span> <span on-tap="focusDigit"></span> <span on-tap="focusDigit"></span></div><input type="number" pattern="[0-9]*"></template>`);
			window.customElements.define('code-input', class extends HTMLElement {
				constructor() {
					super();
					this.attachShadow({mode: 'open'}).appendChild(document.querySelector('template#code-input').content.cloneNode(true));
					
				}
				$(q){return this.shadowRoot.querySelector(q)}
				$$(q){return this.shadowRoot.querySelectorAll(q)}
			 	
	connectedCallback(){
		// document.body.addEventListener('keyup',this.input.bind(this));
		this.$('input').addEventListener('keyup',e=>this.input(e));
		this.$('input').addEventListener('blur',()=>this.focusDigit(null));
		// this.$$('span').forEach(item=>{
		// 	item.addEventListener('click', e=>this.focusDigit(e.target));
		// });
		this.reset();   
	}
	reset(){
		this.$$('span').forEach(item=>{
			item.innerHTML='&#9679;'
			item.classList.add('empty');
		});
	}
	focus(){
		this.focusDigit(this.$('span')); 
	}
	focusDigit(node,dir){
		if(!node) return;
		if(node.target) node = node.target;
		this.$$('span').forEach(e=>e.classList.remove('focus'));
		if(!node) return;
		if(node.tagName=='I') 
			if(dir=='left') node = node.previousElementSibling;
			else node = node.nextElementSibling;
		node.classList.add('focus');
		this.$('input').focus();
	}
	input(event){
		var node = this.$('.focus');
		if(!node)return;
		if(event.key=='ArrowLeft') return this.focusDigit(node.previousElementSibling,'left');
		if(event.key=='ArrowRight') return this.focusDigit(node.nextElementSibling);
		if(event.key=='Backspace') {
			node.innerHTML = '&#9679;'
			node.classList.add('empty');
			return this.focusDigit(node.previousElementSibling,'left');
		}
		// console.log(event);
		if(![0,1,2,3,4,5,6,7,8,9].includes(event.key*1)) return;
		node.innerHTML = event.key;
		node.classList.remove('empty');
		this.focusDigit(node.nextElementSibling);
		this.setAttribute('value',this.getValue());
		this.value = this.getValue();
		if(!this.$$('.empty').length) this.complete();
	}
	getValue(){
		return Array.from(this.$$('span')).map(n=>n.innerHTML).join('');
	}
	complete(){
		var code = this.getValue();
		console.log('CODE',code);
		this.dispatchEvent( new CustomEvent('complete', { detail: code }) );
		// var f = this.getAttribute('on-complete');
		// if(f) eval(f)(code);
		// setTimeout(()=>eval(this.getAttribute('on-complete'))(code),50);
	}

			});