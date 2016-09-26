import { RouterModule, Routes } from '@angular/router';

import { CustomersComponent }     from './customers/customers.component';
import {TechComponent} from './technology/TechComponent';
import {CourseComponent} from './technology/CourseComponent';
const app_routes: Routes = [
  { path: '',  pathMatch:'full', redirectTo: '/customers' },
  { path: 'customers', component: CustomersComponent },
  { path: 'course', component: CourseComponent },
  { path: 'course', component: TechComponent }
];

export const app_routing = RouterModule.forRoot(app_routes);