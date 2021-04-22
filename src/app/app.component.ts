import { AfterViewInit, Component, ElementRef, IterableDiffers,
   OnInit, QueryList, Renderer2, ViewChild, ViewChildren } from '@angular/core';
import { gsap, TweenLite, TimelineMax } from 'gsap'
import { Draggable,  } from 'gsap/Draggable'
import { CSSPlugin } from 'gsap/CSSPlugin'



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, AfterViewInit {

  proxy: Element;
  cellWidth = 250;
  numCells: number;
  cellStep: number;
  wrapWidth: number;
  baseTL: TimelineMax;
  tweenLite: TweenLite;
  animation;
  draggable: Draggable;
  picker: Element;

  constructor(private render: Renderer2) {}

  @ViewChild("container", { static: false }) container: ElementRef;
  @ViewChildren("cell") cell: QueryList<ElementRef>;

  ngOnInit() {
    gsap.registerPlugin(Draggable);
    gsap.defaults({ ease: "none" });

  }

  ngAfterViewInit() {
    this.init();
    this.createBase();
  }

  init() {
    this.numCells = this.cell.length;
    this.cellStep = 1 / this.numCells;
    this.wrapWidth = this.cellWidth * this.numCells;
    this.proxy = this.render.createElement("div");
    TweenLite.set(this.proxy, { x: "+=0" });
    this.picker = this.container.nativeElement;
  }

  createBase() {
    this.baseTL = new TimelineMax({ paused: true });
    this.createTimeline();
    this.initialCellPosition();
    this.animate();
    this.drag();
  }

  createTimeline() {
    TweenLite.set(this.picker, {
      width: (this.wrapWidth - this.cellWidth) * 1.05
    });
  }

  initialCellPosition() {
    this.cell.forEach((ele, index) => {
      this.initCell(ele.nativeElement, index);
    });
  }

  animate() {
    this.animation = new TimelineMax({ repeat: -1, paused: true }).add(
      this.baseTL.tweenFromTo(1, 2, { immediateRender: true })
    );
  }

  drag() {
    console.log("draging");
    
    this.draggable = new Draggable(this.proxy, {
      type: "x",
      trigger: this.picker,
      // bounds: this.picker,
      throwProps: true,
      callbackScope: this,
      cursor: "move",
      onDrag: this.updateProgress,
      onThrowUpdate: this.updateProgress,
      snap: this.snapX,
      onThrowComplete: () => {
        console.log("onThrowComplete");
      }
    });
  }

  initCell(ele: Element, index: number) {
    TweenLite.set(ele, {
      width: this.cellWidth ,
      scale: 0.6,
      x: -this.cellWidth
    });

    const tlm = new TimelineMax({ repeat: 1 })
      .to(ele, 1, { x: `+=${this.wrapWidth}` /*, rotationX: -rotationX*/ }, 0)
      .to(ele,this.cellStep,
        {
          color: "#000000",
          scale: 1,
          repeat: 1,
          yoyo: true,
          borderColor: "#FFC000"
        },
        0.5 - this.cellStep
      );
    this.baseTL.add(tlm, index * -this.cellStep);
  }

  snapX(x): number {
    return Math.round(x / this.cellWidth) * this.cellWidth;
  }

  updateProgress() {
    console.log('updaetd');
    
    this.animation.progress(
      gsap.utils.wrap(0, 1, (this.draggable.x as number) / this.wrapWidth)
    );
  }
  
  animateSlides(direction: number) {
    let position = gsap.getProperty(this.proxy, 'x')
    console.log(position);
    
    var x = this.snapX( ( position as number) + direction * this.cellWidth  );
    console.log(x);
    TweenLite.to(this.proxy, 1, {
      x: x,
      onUpdate: () => {
        this.animation.progress( ( position as number) / this.wrapWidth);
      }
    });
  }
}




































//   title = 'MTN-A2';

//   draggable: Draggable
//   @ViewChild("courosal_inner") container: ElementRef
//   @ViewChildren("item") item: QueryList<ElementRef>;
//   noItems:number
//   step:number
//   itemWidth:number
//   wrapWidth:number
//   dummy: Element
//   selector: Element
//   baseTL: TimelineMax
//   animation;

  

//   // container: HTMLElement
//   // courosel: HTMLElement 
//   // pressed = false
//   // startx;
//   // x;


//   ///////////////////////
//   // current = 1
//   // noItems :number
//   // moveBy: number = 0
//     //////////////////////

//   constructor(private renderer: Renderer2) { }

//   ngOnInit(): void {
//     gsap.registerPlugin(CSSPlugin)
//     gsap.registerPlugin(Draggable);
//     gsap.defaults({ease:"none"})
//     console.log(this.container);
    
//     console.log(this.item);
    
//     // this.newF()
//     // document.querySelector('.collosal_inner').addEventListener( 'transitionend',()=>{
//     //   this.trackTransform()
//     // })
//   }

//   // newF(){
//   //   this.noItems= document.querySelectorAll('.item').length
//   //   document.querySelectorAll('.item')
//   //   .forEach((element:HTMLElement,index)=>{
//   //       element.style.order = (index+1)+''
//   //   })
//   // }

//   // onButton(){
//   //   this.goToNext()
//   // }

//   // goToNext(){
//   //   document.querySelector(".collosal_inner").classList.add('animate')
//   //   let corosal_inner: HTMLElement = document.querySelector(".collosal_inner")
//   //   this.moveBy-=33.33
//   //   let v = 'translateX('+ this.moveBy+'%)'
//   //   console.log(v);
    
//   //   corosal_inner.style.transform = v
//   // }

//   // trackTransform(){
//   //   document.querySelector(".collosal_inner").addEventListener('transitionend', () => {
// 	// 		this.changeOrder();
// 	// 	});
//   // }

//   // changeOrder(){
//   //   if (this.current == this.noItems){
//   //       this.current =1
//   //       this.moveBy=0
//   //   }else{
//   //     this.current+=1
//   //   }

//   //   let order = 1

//   //   // change order from current to last
//   //   document.querySelectorAll('.item')
//   //   .forEach((element:HTMLElement,index)=>{
//   //      if(this.current <= this.noItems){
//   //        element.style.order = order+''
//   //        order+=1
//   //      }
//   //   })

//   //   //change oder from last to current

//   //   document.querySelectorAll('.item')
//   //   .forEach((element:HTMLElement,index)=>{
//   //      if(this.current > this.noItems){
//   //        element.style.order = order+''
//   //        order+=1
//   //      }
//   //   })


//   //   document.querySelector(".collosal_inner").classList.remove('animate')
//   //   let corosal_inner: HTMLElement = document.querySelector(".collosal_inner")
//   //   // corosal_inner.style.transform = 'translateX(0)'
//   // }


//   ngAfterViewInit(){
//     this.setUpCourosel()
//     this.animator()



//     // this.container =  document.querySelector('.container')
//     // this.courosel = document.querySelector('.courosel')  

//     // window.addEventListener('mouseup',()=>{
//     //   this.pressed = false
//     // })
//   }

//   setUpCourosel(){
//     this.noItems = this.item.length
//     this.step = 1/ this.noItems
//     this.wrapWidth = this.itemWidth*this.noItems
//     this.dummy = this.renderer.createElement("div")
//     TweenLite.set(this.dummy, { x: '+=0'})
//     this.selector = this.container.nativeElement



//   }

//   animator(){
//     this.baseTL = new TimelineMax({ paused: true});
//     this.createTwinLight()
//     this.loopAndSetInitial()
//     this.transition()
//     this.drag()

//   }

//   createTwinLight(){
//     TweenLite.set(this.selector,{
//       width: this.wrapWidth - this.itemWidth
//     })
//   }

//   loopAndSetInitial(){
//     this.item.forEach((elem,index)=>{
//       this.initItem(elem, index)
//     })
//   }

//   transition(){
//     this.animation = new TimelineMax({ repeat: -1, paused: true })
//     .add(this.baseTL.tweenFromTo(1, 2))
//   }

//   drag(){
//     this.draggable = new Draggable(this.dummy,{
//           // allowContextMenu: true,  
//       type: "x",
//       trigger: this.selector,
//       bounds: this.selector,
//       throwProps: true,
//       callbackScope: this,
//       cursor: "move",
//       onDrag: this.updateProgress,
//       onThrowUpdate: this.updateProgress,
//       snap: this.snapX,
//       onThrowComplete: function(){
//         console.log("onThrowComplete");
//         //TODO: animation that inject selected card title
//       }
//     })
//   }

//   updateProgress() {  
//     gsap.utils.wrap(0, 1, (this.draggable.x as number) / this.wrapWidth)
//   }

//   snapX(x) {
//     return Math.round(x / this.itemWidth) * this.itemWidth;
//   }

//   initItem(element, index){
//     TweenLite.set(element,{
//       width: this.itemWidth,
//       scale:"0.6",
//       x: -this.itemWidth
//     })

//     var tl1 = new TimelineMax({repeat :1 })
//       .to(element, 1, { x: "+=" + this.wrapWidth/*, rotationX: -rotationX*/ }, 0)
//       .to(element, this.step, { color: "#009688", scale: 1, repeat: 1, yoyo: true }, 0.5 - this.step)
//       this.baseTL.add( tl1, index * -this.step )
//   }



//   // select(e){ 
//   //   this.pressed = true
//   //   this.startx =e.offsetX - this.courosel.offsetLeft
//   //   console.log(this.startx);
//   // }

//   // drag(e){
//   //   this.container.style.cursor = 'grab'
//   // }

//   // mouseMove(e){
//   //   if(!this.pressed) return;
//   //   e.preventDefault();
//   //   this.x = e.offsetX
//   //   this.courosel.style.left = (this.x-this.startx)+'px';
//   //   this.checkBoundry()
//   // }

//   // checkBoundry(){
//   //   let outer = this.container.getBoundingClientRect()
//   //   let inner = this.courosel.getBoundingClientRect()
//   //   if( (parseInt(this.courosel.style.left) )> 0 ){
//   //     this.courosel.style.left ='0px' 
//   //   }else if(inner.right < outer.right){
//   //     this.courosel.style.left = -(inner.width - outer.width)+'px'
//   //   }

//   // }

//   // left(){
//   //   let left = this.courosel.style.left? parseInt(this.courosel.style.left): 0
//   //   this.courosel.style.left =(left +200 )+'px'
//   //   this.checkBoundry()
//   // }

//   // right(){
//   //   let left = this.courosel.style.left? parseInt(this.courosel.style.left): 0
//   //   this.courosel.style.left =(left -200 )+'px'
//   //   this.checkBoundry()
//   // }



// }
