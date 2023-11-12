import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: 'dist/usa-map-filter', redirectTo: '/usa-map-filter', pathMatch: 'full' },
  { path: 'src/usa-map-filter', redirectTo: '/usa-map-filter', pathMatch: 'full' },
  // Add other routes if needed
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule { }


