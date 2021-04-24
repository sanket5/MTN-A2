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
    this.titleDiv = document.querySelector('.item-title');

  }

  ngAfterViewInit(): void{
    this.init();
    this.createBase();
  }

  init(): void {
    this.numCells = this.cell.length;
    this.cellStep = 1 / this.numCells;
    this.wrapWidth = (this.cellWidth * this.numCells * 1.5);
    this.proxy = this.render.createElement('div');
    TweenLite.set(this.proxy, { x: '+=0' });
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
      width: (this.wrapWidth - this.cellWidth)
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
      x: -this.cellWidth,
    });
    const textElem = ele.getElementsByClassName('item-title');
    TweenLite.set(textElem, {
      wordSpacing: 'normal'
    });

    const tlm = new TimelineMax({ repeat: 1 })
      .to(ele, 1, { x: `+=${this.wrapWidth}` }, 0)
      .to(ele, this.cellStep,
        {
          color: '#000000',
          scaleX: 1.266,
          scaleY: 1.191,
          repeat: 1,
          yoyo: true,
          translateY: 90,
          borderBottomColor: '#FFC300',
        },
        0.5 - this.cellStep
      );
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
    const position = gsap.getProperty(this.proxy, 'x');
    console.log(position);
    const x = this.snapX( ( position as number) + direction * this.cellWidth  );
    console.log(x);
    TweenLite.to(this.proxy, 1, {
      x,
      onUpdate: () => {
        this.animation.progress( ( position as number) / this.wrapWidth);
      }
    });
  }
}































































