document.head.insertAdjacentHTML('beforeend', `<template id="code-input"><style>
	:host{
		display: inline-block;
		font-size: 0;
		/*height: 25px;*/
		}
	span,i{
		/*height: 100%;*/
		display: inline-block;
		background: #333;
		color: white;
		/*padding: 5px;*/
		font-size: 30px;
		text-align: center;
		width: 40px;
		height: 40px;
	}
	.empty{
		color: silver;
	}
	.focus{
		background: #555;
	}
	i{
		/*width:3px;*/
		color: silver;
		font-style: normal;
		/*font-size: 30px;*/
	}
	input{width:0;height:0;font-size:0;border:none;outline:none;margin:0;padding:0;}
</style><input type="number"><div><span></span> <span></span> <span></span> <i>&#x2010;</i> <span></span> <span></span> <span></span></div></template>`);
window.customElements.define('code-input', class extends HTMLElement {
	constructor() {
		super();
		this.$ = q => this.shadowRoot.querySelector(q);
		this.attachShadow({mode: 'open'}).appendChild(document.querySelector('#code-input').content.cloneNode(true));
		// document.querySelector('date-input').shadowRoot.querySelectorAll('[id]').forEach(node=>this[node.id]=node);
	}
 	
	connectedCallback(){
		// document.body.addEventListener('keyup',this.input.bind(this));
		this.$('input').addEventListener('keyup',this.input.bind(this));
		this.$('input').addEventListener('blur',()=>this.focusDigit(null));
		this.$$ = x => this.shadowRoot.querySelectorAll(x);
		this.$$('span').forEach(item=>{
			item.addEventListener('click', e=>this.focusDigit(e.target));
		});
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
		this.$('input').focus();
		this.$$('span').forEach(e=>e.classList.remove('focus'));
		if(!node) return;
		if(node.tagName=='I') 
			if(dir=='left') node = node.previousElementSibling;
			else node = node.nextElementSibling;
		node.classList.add('focus');

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