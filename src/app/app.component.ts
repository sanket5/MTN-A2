import { AfterViewInit, Component, ElementRef, IterableDiffers,
   OnInit, QueryList, Renderer2, ViewChild, ViewChildren } from '@angular/core';
import { gsap, TweenLite, TimelineMax } from 'gsap';
import { Draggable,  } from 'gsap/Draggable';
import { CSSPlugin } from 'gsap/CSSPlugin';



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, AfterViewInit {
  title = 'MTN-A2';
  proxy: Element;
  cellWidth = 216 ;
  numCells: number;
  cellStep: number;
  wrapWidth: number;
  baseTL: TimelineMax;
  tweenLite: TweenLite;
  animation;
  draggable: Draggable;
  picker: Element;
  titleDiv: Element;

  constructor(private render: Renderer2) {}

  @ViewChild('container', { static: false }) container: ElementRef;
  @ViewChildren('cell') cell: QueryList<ElementRef>;



  ngOnInit(): void {
    gsap.registerPlugin(Draggable);
    gsap.defaults({ ease: 'none' });

  }

  ngAfterViewInit(): void{
    this.init();
    this.createBase();
  }

  init(): void {
    this.numCells = this.cell.length;
    this.cellStep = 1 / this.numCells
    this.wrapWidth = (this.cellWidth * this.numCells);
    this.proxy = this.render.createElement('div');
    TweenLite.set(this.proxy, { x:'+=0'});
    this.picker = this.container.nativeElement;
  }

  createBase(): void {
    this.baseTL = new TimelineMax({ paused: true });
    this.createTimeline();
    this.initialCellPosition();
    this.animate();
    this.drag();
  }

  createTimeline(): void {
    TweenLite.set(this.picker, {
      width: (this.wrapWidth),
    });
  }

  initialCellPosition(): void{
    this.cell.forEach((ele, index) => {
      this.initCell(ele.nativeElement, index);
    });
  }

  animate(): void {
    this.animation = new TimelineMax({ repeat: -1, paused: true }).add(
      this.baseTL.tweenFromTo(1, 2, { immediateRender: true })
    );
  }

  drag(): void {
    console.log('draging');
    this.draggable = new Draggable(this.proxy, {
      type: 'x',
      trigger: this.picker,
      // bounds: this.picker,
      throwProps: true,
      callbackScope: this,
      cursor: 'move',
      onDrag: this.updateProgress,
      onThrowUpdate: this.updateProgress,
      snap: this.snapX,
      onThrowComplete: () => {
        console.log('onThrowComplete');
      }
    });
  }

  initCell(ele: Element, index: number): void {
    TweenLite.set(ele, {
      width: this.cellWidth ,
      scale: 0.6,
      x: -this.cellWidth*3,
    });

    let celltitleElem = ele.getElementsByClassName('item-title')
    let itemMessageEle = ele.getElementsByClassName('item-message')

    TweenLite.set(celltitleElem,{
      paddingRight:60,
      paddingLeft:60
    })

    TweenLite.set(itemMessageEle,{
      display:'none'
    })

    const tlm = gsap.timeline({ repeat: 1 })

      .to(ele, { x: `+=${this.wrapWidth}`, duration:1, }, 0)
      .to(ele, 
        {
          duration:this.cellStep,
          color: '#000000',
          scaleX: 1.266,
          scaleY: 1.191,
          // scale:1,
          repeat: 1,
          yoyo: true,
          y: 90,
          borderBottomColor: '#FFC300',
        },
        0.4
      )
      .to(celltitleElem, {
        duration:this.cellStep,
          padding: 0,
          yoyo: true,
          repeat:1
      }, 0.4)
      .to(itemMessageEle, {
          duration:this.cellStep*0.667,
          display:'block',
          yoyo:true,
          repeat:1
      }, 0.4 )

      
      //  const tlm2 = new TimelineMax({repeat:1})
      //   .to(textElem, 1 , {
      //       wordSpacing:500
      //   } ,0)

    this.baseTL.add(tlm, index * -this.cellStep);
    // this.baseTL.add(tlm2, index * -this.cellStep)
  }

  snapX(x): number {
    return Math.round(x / this.cellWidth) * this.cellWidth;
  }

  updateProgress(): void {
    console.log('updaetd');
    this.animation.progress(
      gsap.utils.wrap(0, 1, (this.draggable.x as number) / this.wrapWidth)
    );
  }

  animateSlides(direction: number): void{
    console.log(window.screen.width);
    const position = gsap.getProperty(this.proxy, 'x');
    // let x = this.snapX( ( position as number) + direction * this.cellWidth );
    let x = gsap.utils.snap( this.cellWidth, ( (position as number) + direction * this.cellWidth ) )
    // if (x> this.wrapWidth){
    //   x -= x-this.cellWidth
    // }
    // else if (x<=0){
    //   x += this.cellWidth
    // }
    console.log(x);
    
    gsap.to(this.proxy, {
        x,
        onUpdate: () => {
          // this.animation.progress( (x as number) / (this.wrapWidth ))
          gsap.to(this.animation,
            { 
              duration: this.cellStep,
              progress:gsap.utils.wrap(0, 1, (x as number) / this.wrapWidth),
              yoyo: true,              
            })
      }
    });
  }
}












// TweenLite.defaultEase = Linear.easeNone;

// var picker = document.querySelector(".picker");
// var cells = document.querySelectorAll(".cell");
// var proxy = document.createElement("div");

// var cellWidth = 450;
// //var rotationX = 90;

// var numCells = cells.length;
// var cellStep = 1 / numCells;
// var wrapWidth = cellWidth * numCells;

// var baseTl = new TimelineMax({ paused: true });

// TweenLite.set(picker, {
//   //perspective: 1100,
//   width: wrapWidth - cellWidth
// });

// for (var i = 0; i < cells.length; i++) {  
//   initCell(cells[i], i);
// }

// var animation = new TimelineMax({ repeat: -1, paused: true })
//   .add(baseTl.tweenFromTo(1, 2))

// var draggable = new Draggable(proxy, {  
//   // allowContextMenu: true,  
//   type: "x",
//   trigger: picker,
//   throwProps: true,
//   onDrag: updateProgress,
//   onThrowUpdate: updateProgress,
//   snap: { 
//     x: snapX
//   },
//   onThrowComplete: function(){
//     console.log("onThrowComplete");
//     //TODO: animation that inject selected card title
//   }
// });

// function snapX(x) {
//   return Math.round(x / cellWidth) * cellWidth;
// }

// function updateProgress() {  
//   animation.progress(this.x / wrapWidth);
// }

// function initCell(element, index) {
  
//   TweenLite.set(element, {
//     width: cellWidth,
//     scale: 0.6,
//     //rotationX: rotationX,
//     x: -cellWidth
//   });
  
//   var tl = new TimelineMax({ repeat: 1 })
//     .to(element, 1, { x: "+=" + wrapWidth/*, rotationX: -rotationX*/ }, 0)
//     .to(element, cellStep, { color: "#009688", scale: 1, repeat: 1, yoyo: true }, 0.5 - cellStep)
  
//   baseTl.add(tl, i * -cellStep);
// }



















































