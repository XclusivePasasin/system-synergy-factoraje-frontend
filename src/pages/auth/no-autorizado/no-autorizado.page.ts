import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './no-autorizado.page.html',
  standalone: true,
  imports: [RouterModule],
  styleUrls: ['./no-autorizado.page.scss']
})
export class UnAuthorizedPage {
  constructor(private router: Router) {}


}
