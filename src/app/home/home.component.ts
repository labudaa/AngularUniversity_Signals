import {
  Component,
  computed,
  effect,
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
  // counter = 0;
  // increment() {
  //   this.counter++;
  // }

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
  values = signal<number[]>([1, 2, 3]);
}
