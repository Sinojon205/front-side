import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {NgForm} from "@angular/forms";

@Component({
  selector: 'add-server',
  templateUrl: './add-server.component.html',
  styleUrls: ['./add-server.component.css']
})
export class AddServerComponent implements OnInit {
  @Output() action: EventEmitter<any> = new EventEmitter<any>()
  adding = false;

  constructor() {
  }

  ngOnInit(): void {
  }

  addData(saveForm: NgForm) {
    this.adding = true;
    this.action.emit(saveForm.value);
  }
}
