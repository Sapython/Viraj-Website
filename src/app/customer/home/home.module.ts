import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home.component';
import { WidgetsModule } from 'src/app/widgets/widgets.module';
import { FirstSectionComponent } from './first-section/first-section.component';
import { AboutSectionComponent } from './about-section/about-section.component';
import { ProductsSectionComponent } from './products-section/products-section.component';
import { GallerySectionComponent } from './gallery-section/gallery-section.component';
import { OurStoresSectionComponent } from './our-stores-section/our-stores-section.component';
import { ContactUsSectionComponent } from './contact-us-section/contact-us-section.component';

@NgModule({
  declarations: [
    HomeComponent,
    FirstSectionComponent,
    AboutSectionComponent,
    ProductsSectionComponent,
    GallerySectionComponent,
    OurStoresSectionComponent,
    ContactUsSectionComponent,
  ],
  imports: [CommonModule, RouterModule, HomeRoutingModule, WidgetsModule],
})
export class HomeModule {}
