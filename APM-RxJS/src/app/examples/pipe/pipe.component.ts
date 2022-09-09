import { Component, OnInit } from '@angular/core';
//https://stackblitz.com/angular/mdddbxenrer?file=src%2Fapp%2Fapp.component.html
@Component({
  selector: 'pm-pipe',
  templateUrl: './pipe.component.html',
  styleUrls: ['./pipe.component.css'],
})
export class PipeComponent implements OnInit {
  birthday = new Date(1988, 3, 15); // April 15, 1988

  constructor() {}

  ngOnInit(): void {}
  toggle = true; // start with true == shortDate

  get format() {
    return this.toggle ? 'shortDate' : 'fullDate';
  }
  toggleFormat() {
    this.toggle = !this.toggle;
  }
}
