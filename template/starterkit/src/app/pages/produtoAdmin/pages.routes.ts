import { AppInvoiceListComponent } from './../../../../../main/src/app/pages/apps/invoice/invoice-list/invoice-list.component';
import { Routes } from '@angular/router';
import { StarterComponent } from '../starter/starter.component';
import { QuizComponent } from '../quiz/quiz.component';
import { DashboardUtilizadorComponent } from '../dashboard-utilizador/dashboard-utilizador.component';
import { DashboardAdminComponent } from '../dashboardAdmin/dashboardAdmin.component';
import { ContactosComponent } from '../contactos/contactos.component';
import { BlogComponent } from '../blog/blog.component';
import { quizperguntaComponent } from '../quizpergunta/quizpergunta.component';
import { AppLandingpageComponent } from '../landingpage/landingpage.component';
import { AppBlogPostComponent } from '../blogpost/post.component';
import { AppAddCategoryComponent } from '../categoriaAdmin/add-invoice/add-invoice.component';
import { AppAddInvoiceComponent } from './add-invoice/add-invoice.component';

export const PagesRoutes: Routes = [
  {
    path: '',
    component: StarterComponent,
    data: {
      title: 'Starter Page',
    },
  },
  {
    path: 'quiz',
    component: QuizComponent,
    data: {
      title: 'Quiz Page',
    },
  },
  {
    path: 'dashboard',
    component: DashboardUtilizadorComponent,
    data: {
      title: 'Dashboard Utilizador',
    },
  },
  {
    path: 'dashboardAdmin',
    component: DashboardAdminComponent,
    data: {
      title: 'Dashboard Admin',
    },
  },
  {
    path: 'contactos',
    component: ContactosComponent,
    data: {
      title: 'Contactos Page',
    },
  },
  {
    path: 'blog',
    component: BlogComponent,
    data: {
      title: 'Blog Page',
    },
  },
  {
    path: 'blogpost',
    component: AppBlogPostComponent,
    data: {
      title: 'Blog Post',
    },
  },
 {
    path: 'quizpergunta',
    component: quizperguntaComponent,
    data: {
      title: 'Quiz Pergunta',
    },
  },
  {
    path: 'landindpage',
    component: AppLandingpageComponent,
    data: {
      title: 'Landing Page',
    },
  },
  {
    path: 'invoice',
    component: AppAddCategoryComponent,
  },
  {
    path: 'addInvoice', component: AppAddInvoiceComponent
  },
  {
    path: 'produtoAdmin', component: AppAddInvoiceComponent,
  },
];
