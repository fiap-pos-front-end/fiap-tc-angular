import { Component, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { SharedService } from 'mfeShell/lib-shared';

@Component({
  selector: 'app-home',
  imports: [RouterModule, ButtonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  private router = inject(Router);
  private shared: any = inject(SharedService);
  helloShared = this.shared.getHello();
  goToAngular2() {
    this.router.navigate(['/angular/home2']);
  }
}
