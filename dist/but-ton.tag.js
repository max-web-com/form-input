document.head.insertAdjacentHTML('beforeend', `<template id="but-ton"><style>:host{display:inline-block;color:white;background:#333;border-radius:3px;padding:5px 10px;margin:5px;user-select:none;cursor:pointer}:host(.tapped){animation:pulse .1s linear}@keyframes pulse{from{opacity:1}50%{opacity:.5}to{opacity:1}}</style><slot>button</slot></template>`);
window.customElements.define('but-ton', class extends HTMLElement {
	constructor() {super();this.attachShadow({mode: 'open'}).appendChild(document.querySelector('template#but-ton').content.cloneNode(true));;}
	
	
 	
    connectedCallback() {
    	// console.log('button',this);
    	// this.addEventListener('tap',()=>console.log('BUTTON TAPPPPP'));
    	this.addEventListener('tap',()=>{
    		// console.log('BUTTON TAPPPPP',e.target);
    		this.classList.add('tapped');
    		setTimeout(()=>this.classList.remove('tapped'),100);
    	});
    }


});