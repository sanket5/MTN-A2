import { AfterViewInit, Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, AfterViewInit {
  title = 'MTN-A2';

  

  container: HTMLElement
  courosel: HTMLElement 
  pressed = false
  startx;
  x;

  constructor() { }

  ngOnInit(): void {
  }

  ngAfterViewInit(){
    this.container =  document.querySelector('.container')
    this.courosel = document.querySelector('.courosel')  

    window.addEventListener('mouseup',()=>{
      this.pressed = false
    })
  }
  select(e){ 
    this.pressed = true
    this.startx =e.offsetX - this.courosel.offsetLeft
    console.log(this.startx);
  }

  drag(e){
    this.container.style.cursor = 'grab'
  }

  mouseMove(e){
    if(!this.pressed) return;
    e.preventDefault();
    this.x = e.offsetX
    this.courosel.style.left = (this.x-this.startx)+'px';
    this.checkBoundry()
  }

  checkBoundry(){
    let outer = this.container.getBoundingClientRect()
    let inner = this.courosel.getBoundingClientRect()
    if( (parseInt(this.courosel.style.left) )> 0 ){
      this.courosel.style.left ='0px' 
    }else if(inner.right < outer.right){
      this.courosel.style.left = -(inner.width - outer.width)+'px'
      
    }

  }

  left(){
    let left = this.courosel.style.left? parseInt(this.courosel.style.left): 0
    this.courosel.style.left =(left +200 )+'px'
    this.checkBoundry()
  }

  right(){
    let left = this.courosel.style.left? parseInt(this.courosel.style.left): 0
    this.courosel.style.left =(left -200 )+'px'
    this.checkBoundry()
  }



}
