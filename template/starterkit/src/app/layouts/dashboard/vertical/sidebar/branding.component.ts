import { Component } from '@angular/core';

@Component({
  selector: 'app-branding',
  standalone: true,
  template: `
    <div class="branding overflow-hidden">
     
      <a href="/landingpage">
        <img
        style="max-width: 210px;"
          src="../../../../../assets/images/logos/dark-logo.svg"
          class="align-middle m-2"
          alt="logo cultivua"
        />
      </a>
    </div>
  `,
})
export class BrandingComponent {
  constructor() { }
}
