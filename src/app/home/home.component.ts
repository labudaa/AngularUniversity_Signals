import {
  afterNextRender,
  Component,
  computed,
  effect,
  EffectRef,
  inject,
  Injector,
  signal,
} from '@angular/core';
import { CoursesService } from '../services/courses.service';
import { Course, sortCoursesBySeqNo } from '../models/course.model';
import { MatTab, MatTabGroup } from '@angular/material/tabs';
import { CoursesCardListComponent } from '../courses-card-list/courses-card-list.component';
import { MatDialog } from '@angular/material/dialog';
import { MessagesService } from '../messages/messages.service';
import { catchError, from, throwError } from 'rxjs';
import {
  toObservable,
  toSignal,
  outputToObservable,
  outputFromObservable,
} from '@angular/core/rxjs-interop';

type CounterObject = {
  value: number;
};

@Component({
  selector: 'home',
  imports: [MatTabGroup, MatTab, CoursesCardListComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  //use of effect - in constructor so garbage collector would catch it.
  //Other way is to use injector. Example with afterNextRender
  injector = inject(Injector);
  effectRef: EffectRef | null = null;

  constructor() {
    //normal use
    effect(() => {
      console.log(`1 Counter Signal value: ${this.counterSignal()}`);
    });

    //manual cleanup for effect
    this.effectRef = effect((onCleanup) => {
      //use of signal can't be nested, for example it can't be inside setTimeout function
      const counter = this.counterSignal();
      const timeout = setTimeout(() => {
        console.log(`TIMEOUT - EffectRef: ${counter}`);
      }, 1000);

      onCleanup(() => {
        console.log('Callback - cleanup');
        clearTimeout(timeout);
      });
    });

    //use with injector
    afterNextRender(() => {
      effect(
        () => {
          console.log(`Counter Signal valuex10: ${this.tenXCounter()}`);
        },
        {
          injector: this.injector,
        }
      );
    });
  }

  counterSignal = signal(0);
  incrementSignal() {
    this.counterSignal.update((v) => v + 1);
  }

  //signal with object
  counterSignalObject = signal<CounterObject>({ value: 1 });
  incrementSignalObject() {
    this.counterSignalObject.update((v) => ({
      ...v,
      value: v.value + 1,
    }));
  }

  //signal with array
  values = signal<number[]>([0]);
  append() {
    this.values.update((values) => [...values, values[values.length - 1] + 1]);
  }

  //computed signal
  tenXCounter = computed(() => {
    const val = this.counterSignal();
    return val * 10;
  });
  hundredXCounter = computed(() => {
    const val = this.tenXCounter();
    return val * 10;
  });

  cleanup() {
    this.effectRef?.destroy();
  }

  counterVisible = signal(false);
  counterSectionVisible() {
    this.counterVisible.update((v) => !this.counterVisible());
  }
}
