import { Routes } from "@angular/router";
import { BlankComponent } from "./layouts/blank/blank.component";
import { FullComponent } from "./layouts/full/full.component";
import { QuizComponent } from "./pages/quiz/quiz.component";
import { DashboardUtilizadorComponent } from "./pages/dashboard-utilizador/dashboard-utilizador.component";
import { DashboardAdminComponent } from "./pages/dashboardAdmin/dashboardAdmin.component";
import { ContactosComponent } from "./pages/contactos/contactos.component";
import { BlogComponent } from "./pages/blog/blog.component";
import { quizperguntaComponent } from "./pages/quizpergunta/quizpergunta.component";
import { quizresultadosComponent } from "./pages/quizresultados/quizresultados.component";
import { AppLandingpageComponent } from "./pages/landingpage/landingpage.component";
import { AppBlogPostComponent } from "./pages/blogpost/post.component";
import { AppSideLoginComponent } from "./pages/authentication/side-login/side-login.component";
import { AppSideRegisterComponent } from "./pages/authentication/side-register/side-register.component";
import { AppCategoryListComponent } from "./pages/categoriaAdmin/invoice-list/invoice-list.component";
import { AppAddCategoryComponent } from "./pages/categoriaAdmin/add-invoice/add-invoice.component";
import { AppEditCategoryComponent } from "./pages/categoriaAdmin/edit-invoice/edit-invoice.component";
import { AppInvoiceListComponent } from "./pages/produtoAdmin/invoice-list/invoice-list.component";
import { PageNotFoundComponent } from "./pages/404/404.component";
import { ChatBot } from "./pages/chat-bot/chat-bot.component";
import { IdentificarComponent } from "./pages/identificar/identificar.component";
import { AppTicketlistComponent } from "./pages/ticketAdmin/ticketlist.component";
import { KitsPlanta } from "./pages/kits-planta/kits-planta.component";
import { AppaddplantComponent } from "./pages/planta/addplant.component";
import { PerfilUtilizadorComponent } from "./pages/dashboardperfilutilizador/dashboardperfilutilizador.component";
import { BlogAdminComponent } from "./pages/blog-admin/blog-admin.component";
import { AppAddInvoiceComponent } from "./pages/produtoAdmin/add-invoice/add-invoice.component";
import { PlantaInfo } from "./pages/planta-info/planta-info.component";
import { NotificationsComponent } from "./components/notificacoes/notifications.component";
import { DashboardComponent } from "./layouts/dashboard/dashboard.component";
import { LojaOnlineComponent } from "./pages/loja-online/loja-online.component";
import { ListLocationsComponent } from "./pages/locations/locations/list-locations/list-locations.component";
import { AddLocationComponent } from "./pages/locations/locations/add-location/add-locations.component";
import { AppEditLocationComponent } from "./pages/locations/locations/edit-locations/edit-locations.component";
import { AppEditProductComponent } from "./pages/produtoAdmin/edit-product/edit-product.component";
import { LojaOnlineAgradecimentoComponent } from "./pages/loja-online-agradecimento/loja-online-agradecimento.component";
import { LojaOnlineInformacaoComponent } from "./pages/loja-online-informacao/loja-online-informacao.component";
import { AppFooterComponent } from "./components/footer/footer.component";

import { CardDetailsComponent } from "./components/loja-online/card-details/card-details.component";

import { AuthenticationAdminComponent } from "./pages/authentication-admin/authentication-admin.component";
import { AdminGuard } from "./guards/admin.guard";


export const routes: Routes = [
    {
        path: "",
        component: FullComponent,
        children: [
            {
                path: "",
                redirectTo: "/landingpage",
                pathMatch: "full",
                data: { title: "Landing Page" },
            },
            {
                path: "starter",
                loadChildren: () =>
                    import("./pages/pages.routes").then((m) => m.PagesRoutes),
                data: { title: "Starter" },
            },
            {
                path: "quiz",
                component: QuizComponent,
                data: {
                    title: "Quiz",
                },
            },
            {
                path: "loja-online",
                component: LojaOnlineComponent,
                data: {
                    title: "Online Store",
                },
            },
            {
                path: "loja-online/agradecimento",
                component: LojaOnlineAgradecimentoComponent,
                data: {
                    title: "Online Store - Thank You",
                },
            },
            {
                path: "loja-online/checkout",
                component: LojaOnlineInformacaoComponent,
                data: {
                    title: "Online Store - Checkout",
                },
            },
            {
                path: "footer",
                component: AppFooterComponent,
                data: {
                    title: "Footer",
                },
            },
            {
                path: "product/:id",
                component: CardDetailsComponent,
                data: {
                    title: "Product Details",
                },
            },
            {
                path: "kits-planta",
                component: KitsPlanta,
                data: {
                    title: "Plant Kits",
                    urls: [
                        { title: "Dashboard", url: "/dashboard" },
                        { title: "Plant Kits" },
                    ],
                },
            },
            {
                path: "kits-planta/:id",
                component: KitsPlanta,
                data: {
                    title: "Plant Kits Details",
                    urls: [
                        { title: "Dashboard", url: "/dashboard" },
                        { title: "Plant Kits Details" },
                    ],
                },
            },
            {
                path: "planta-info/:id",
                component: PlantaInfo,
                data: {
                    title: "Plant Information",
                    urls: [
                        { title: "Dashboard", url: "/dashboard" },
                        { title: "Plant Information" },
                    ],
                },
            },
            {
                path: "chat",
                component: ChatBot,
                data: {
                    title: "Chat Bot",
                    urls: [
                        { title: "Dashboard", url: "/dashboard" },
                        { title: "Chat Bot" },
                    ],
                },
            },
            {
                path: "contactos",
                component: ContactosComponent,
                data: {
                    title: "Contacts",
                },
            },
            {
                path: "blog",
                component: BlogComponent,
                data: {
                    title: "Blog",
                },
            },
            {
                path: "quizresultados",
                component: quizresultadosComponent,
                data: {
                    title: "Quiz Results",
                    urls: [
                        { title: "Quiz", url: "/quiz" },
                        { title: "Quiz Results" },
                    ],
                },
            },
            {
                path: "quizpergunta",
                component: quizperguntaComponent,
                data: {
                    title: "Quiz Questions",
                    urls: [
                        { title: "Quiz", url: "/quiz" },
                        { title: "Quiz Questions" },
                    ],
                },
            },
            {
                path: "blogpost",
                component: AppBlogPostComponent,
                data: {
                    title: "Blog Post",
                    urls: [
                        { title: "Blog", url: "/blog" },
                        { title: "Blog Post" },
                    ],
                },
            },
            {
                path: "blogpost/:id",
                component: AppBlogPostComponent,
                data: {
                    title: "Blog Post Details",
                    urls: [
                        { title: "Blog", url: "/blog" },
                        { title: "Blog Post Details" },
                    ],
                },
            },
            {
                path: "landingpage",
                component: AppLandingpageComponent,
                data: {
                    title: "Landing Page",
                },
            },
            {
                path: "login",
                component: AppSideLoginComponent,
                data: {
                    title: "Login",
                },
            },
            {
                path: "loginAdministrador",
                component: AuthenticationAdminComponent,
                data:{
                    title: "Admin Login",
                }
            },
            {
                path: "register",
                component: AppSideRegisterComponent,
                data: {
                    title: "Register",
                },
            },
            {
                path: "identificar",
                component: IdentificarComponent,
                data: {
                    title: "Identify",
                },
            },
            {
                path: "addplant",
                component: AppaddplantComponent,
                data: {
                    title: "Add Plant",
                    urls: [
                        { title: "Dashboard", url: "/dashboard" },
                        { title: "Add Plant" },
                    ],
                },
            },
            {
                path: "perfilutilizador",
                component: PerfilUtilizadorComponent,
                data: {
                    title: "User Profile",
                    urls: [
                        { title: "Dashboard", url: "/dashboard" },
                        { title: "User Profile" },
                    ],
                },
            },
            {
                path: "dashboard",
                component: DashboardUtilizadorComponent,
                data: {
                    title: "Dashboard",
                },
            },
            {
                path: "notifications",
                component: NotificationsComponent,
                data: {
                    title: "Notifications",
                },
            },
        ],
    },
    {
        path: "",
        component: DashboardComponent,
        children: [
            {
                path: "",
                redirectTo: "/dashboardAdmin",
                pathMatch: "full",
                data: {
                    title: "Admin Dashboard",
                },
            },
            {
                path: "dashboardAdmin",
                component: DashboardAdminComponent,
                canActivate: [AdminGuard],
                data: {
                    title: "Admin Dashboard",
                },
            },
            {
                path: "blogAdmin",
                component: BlogAdminComponent,
                canActivate: [AdminGuard],
                data: {
                    title: "Blog Admin",
                    urls: [
                        { title: "Admin Dashboard", url: "/dashboardAdmin" },
                        { title: "Blog Admin" },
                    ],
                },
            },
            {
                path: "ticketAdmin",
                component: AppTicketlistComponent,
                canActivate: [AdminGuard],
                data: {
                    title: "Ticket Admin",
                    urls: [
                        { title: "Admin Dashboard", url: "/dashboardAdmin" },
                        { title: "Ticket Admin" },
                    ],
                },
            },
            {
                path: "produtoAdmin",
                component: AppInvoiceListComponent,
                canActivate: [AdminGuard],
                data: {
                    title: "Product Admin",
                    urls: [
                        { title: "Admin Dashboard", url: "/dashboardAdmin" },
                        { title: "Product Admin" },
                    ],
                },
            },
            {
                path: "addInvoice",
                component: AppAddInvoiceComponent,
                canActivate: [AdminGuard],
                data: {
                    title: "Add Product",
                    urls: [
                        { title: "Admin Dashboard", url: "/dashboardAdmin" },
                        { title: "Add Product" },
                    ],
                },
            },
            {
                path: "produtoAdmin",
                component: AppInvoiceListComponent,
                canActivate: [AdminGuard],
                data: {
                    title: "Product Admin",
                    urls: [
                        { title: "Admin Dashboard", url: "/dashboardAdmin" },
                        { title: "Product Admin" },
                    ],
                },
            },
            {
                path: "addInvoice",
                component: AppAddInvoiceComponent,
                canActivate: [AdminGuard],
                data: {
                    title: "Add Product",
                    urls: [
                        { title: "Admin Dashboard", url: "/dashboardAdmin" },
                        { title: "Products", url: "/produtoAdmin" },
                        { title: "Add Product" },
                    ],
                },
            },
            // { path: "editInvoice/:id", component: AppEditInvoiceComponent },
            {
                path: "editProduct/:id",
                component: AppEditProductComponent,
                canActivate: [AdminGuard],
                data: {
                    title: "Edit Product",
                    urls: [
                        { title: "Admin Dashboard", url: "/dashboardAdmin" },
                        { title: "Products", url: "/produtoAdmin" },
                        { title: "Edit Product" },
                    ],
                },
            },
            {
                path: "categoriaAdmin",
                component: AppCategoryListComponent,
                canActivate: [AdminGuard],
                data: {
                    title: "Category Admin",
                    urls: [
                        { title: "Admin Dashboard", url: "/dashboardAdmin" },
                        { title: "Category Admin" },
                    ],
                },
            },
            {
                path: "addCategory",
                component: AppAddCategoryComponent,
                canActivate: [AdminGuard],
                data: {
                    title: "Add Category",
                    urls: [
                        { title: "Admin Dashboard", url: "/dashboardAdmin" },
                        { title: "Add Category" },
                    ],
                },
            },
            {
                path: "editCategory/:id",
                component: AppEditCategoryComponent,
                canActivate: [AdminGuard],
                data: {
                    title: "Edit Category",
                    urls: [
                        { title: "Admin Dashboard", url: "/dashboardAdmin" },
                        { title: "Edit Category" },
                    ],
                },
            },
            {
                path: "invoice",
                component: AppInvoiceListComponent,
                canActivate: [AdminGuard],
                data: {
                    title: "Products",
                    urls: [
                        { title: "Admin Dashboard", url: "/dashboardAdmin" },
                        { title: "Products" },
                    ],
                },
            },
            {
                path: "listaLocalizacoes",
                component: ListLocationsComponent,
                canActivate: [AdminGuard],
                data: {
                    title: "Locations",
                    urls: [
                        { title: "Admin Dashboard", url: "/dashboardAdmin" },
                        { title: "Locations" },
                    ],
                },
            },
            {
                path: "notificationsAdmin",
                component: NotificationsComponent,
                canActivate: [AdminGuard],
                data: {
                    title: "Notifications",
                    urls: [
                        { title: "Admin Dashboard", url: "/dashboardAdmin" },
                        { title: "Notifications" },
                    ],
                },
            },
            {
                path: "addLocation",
                component: AddLocationComponent,
                canActivate: [AdminGuard],
                data: {
                    title: "Add Location",
                    urls: [
                        { title: "Admin Dashboard", url: "/dashboardAdmin" },
                        { title: "Add Location" },
                    ],
                },
            },
            {
                path: "editLocation/:id",
                component: AppEditLocationComponent,
                canActivate: [AdminGuard],
                data: {
                    title: "Edit Location",
                    urls: [
                        { title: "Admin Dashboard", url: "/dashboardAdmin" },
                        { title: "Edit Location" },
                    ],
                },
            },
        ],
    },
    {
        path: "",
        component: BlankComponent,
        children: [
            {
                path: "404",
                component: PageNotFoundComponent,
                data: {
                    title: "404",
                },
            },
        ],
    },
    {
        path: "**",
        redirectTo: "404",
        data: {
            title: "Error",
        },
    },
];
