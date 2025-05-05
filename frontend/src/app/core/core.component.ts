import { AuthService } from 'app/core/services/auth/auth.service';
import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-core',
  standalone: false,
  templateUrl: './core.component.html',
  styleUrls: ['./core.component.css']
})
export class CoreComponent implements OnInit {
  constructor(private router: Router, private aurhService: AuthService) {
    this.aurhService.loadCurrentUser();
  }

  ngOnInit() {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(event => {
        console.log('NavigationEnd event:', event);
      });
  }
}
