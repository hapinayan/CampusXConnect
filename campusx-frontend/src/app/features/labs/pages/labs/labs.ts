import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-labs',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './labs.html',
  styleUrl: './labs.css'
})
export class Labs {

  selectedDate: string = '';

  labs = [
    {
      id: 1,
      name: 'Computer Lab 01',
      location: 'Computing Faculty - Ground Floor',
      capacity: 40,
      isActive: true
    },
    {
      id: 2,
      name: 'Computer Lab 02',
      location: 'Computing Faculty - First Floor',
      capacity: 35,
      isActive: true
    },
    {
      id: 3,
      name: 'Networking Lab',
      location: 'Technology Building',
      capacity: 30,
      isActive: true
    }
  ];

  selectLab(labId: number): void {
    console.log('Selected Lab ID:', labId);
  }
}
