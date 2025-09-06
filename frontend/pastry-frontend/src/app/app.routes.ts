import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { MenuComponent } from './pages/menu/menu.component';
import { AboutComponent } from './pages/about/about.component';
import { ContactComponent } from './pages/contact/contact.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/Register/register.component';
import { RegisterAdminComponent } from './pages/RegisterAdmin/registerAdmin.component';
import { LoginAuthyComponent} from './pages/login/loginAuthy0.component';
import { CompleteProfileComponent } from './pages/completeProfile/complete-profile.component'

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'menu', component: MenuComponent },
  { path: 'about', component: AboutComponent },
  { path: 'contact', component: ContactComponent },
  { path: 'login', component: LoginComponent},
  { path: 'register', component: RegisterComponent },
  { path: 'registerAdmin', component: RegisterAdminComponent },
  { path: 'loginAuthy', component: LoginAuthyComponent },
  { path: 'completeProfile', component: CompleteProfileComponent },
  { path: '**', redirectTo: '' }
];
