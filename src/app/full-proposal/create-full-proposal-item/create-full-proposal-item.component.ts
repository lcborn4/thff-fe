//modal component

import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-create-full-proposal-item',
  templateUrl: './create-full-proposal-item.component.html',
  styleUrls: ['./create-full-proposal-item.component.css']
})
export class CreateFullProposalItemComponent implements OnInit {

  canCreateFPItem: boolean;

  constructor() {

    this.canCreateFPItem = false; //initialize to false

  }

  ngOnInit() {
  }

  getTotal() {

    return 5; //placeholder

  }

  createFPItem() {
    console.log('createFPItem')
  }


}