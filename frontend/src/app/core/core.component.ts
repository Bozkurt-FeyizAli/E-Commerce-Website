import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-core',
  standalone: false,
  templateUrl: './core.component.html',
  styleUrls: ['./core.component.css']
})
export class CoreComponent implements OnInit {
  constructor(private router: Router) {}

  ngOnInit() {
    if (this.router) { // Null kontrolü ekleyin
      this.router.events.subscribe(event => {
        console.log('Router event:', event);
      });
    }
  }
}
