import { Routes } from "@angular/router";
import { QuizComponent } from "./quiz/quiz.component";
import { DashboardUtilizadorComponent } from "./dashboard-utilizador/dashboard-utilizador.component";
import { DashboardAdminComponent } from "./dashboardAdmin/dashboardAdmin.component";
import { ContactosComponent } from "./contactos/contactos.component";
import { BlogComponent } from "./blog/blog.component";
import { quizperguntaComponent } from "./quizpergunta/quizpergunta.component";
import { quizresultadosComponent } from "./quizresultados/quizresultados.component";
import { AppLandingpageComponent } from "./landingpage/landingpage.component";
import { AppBlogPostComponent } from "./blogpost/post.component";
import { AppCategoryListComponent } from "./categoriaAdmin/invoice-list/invoice-list.component";
import { PageNotFoundComponent } from "./404/404.component";
import { ChatBot } from "./chat-bot/chat-bot.component";
import { AppTicketlistComponent } from "./ticketAdmin/ticketlist.component";
import { KitsPlanta } from "./kits-planta/kits-planta.component";
import { PerfilUtilizadorComponent } from "./dashboardperfilutilizador/dashboardperfilutilizador.component";
import { PlantaInfo } from "./planta-info/planta-info.component";
import { AppAddCategoryComponent } from "./categoriaAdmin/add-invoice/add-invoice.component";
import { AppAddInvoiceComponent } from "./produtoAdmin/add-invoice/add-invoice.component";
import { AppInvoiceListComponent } from "./produtoAdmin/invoice-list/invoice-list.component";
import { LojaOnlineComponent } from "./loja-online/loja-online.component";
import { LojaOnlineAgradecimentoComponent } from "./loja-online-agradecimento/loja-online-agradecimento.component";
import { LojaOnlineInformacaoComponent } from "./loja-online-informacao/loja-online-informacao.component";
import { AppFooterComponent } from "../components/footer/footer.component";
import { CardDetailsComponent } from "../components/loja-online/card-details/card-details.component";

export const PagesRoutes: Routes = [
    {
        path: "loja-online/agradecimento",
        component: LojaOnlineAgradecimentoComponent,
        data: {
            title: "Loja Online - Agradecimento",
        },
    },
    {
        path: "loja-online/checkout",
        component: LojaOnlineInformacaoComponent,
        data: {
            title: "Loja Online - Checkout",
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
        path: "kits-planta/:id",
        component: KitsPlanta,
        data: {
            title: "Detalhes da Planta",
        },
    },
    {
        path: "quiz",
        component: QuizComponent,
        data: {
            title: "Quiz Page",
        },
    },
    {
        path: "loja-online",
        component: LojaOnlineComponent,
        data: {
            title: "Loja Online",
        },
    },

    {
        path: "planta-info/:id",
        component: PlantaInfo,
        data: {
            title: "Planta Info",
        },
    },
    {
        path: "perfilutilizador",
        component: PerfilUtilizadorComponent,
        data: {
            title: "Perfil Utilizador",
        },
    },
    {
        path: "kits-planta",
        component: KitsPlanta,
        data: {
            title: "Kits Planta",
        },
    },
    {
        path: "dashboard",
        component: DashboardUtilizadorComponent,
        data: {
            title: "Dashboard Utilizador",
        },
    },
    {
        path: "dashboardAdmin",
        component: DashboardAdminComponent,
        data: {
            title: "Dashboard Admin",
        },
    },
    {
        path: "contactos",
        component: ContactosComponent,
        data: {
            title: "Contactos Page",
        },
    },
    {
        path: "blog",
        component: BlogComponent,
        data: {
            title: "Blog Page",
        },
    },
    {
        path: "chat",
        component: BlogComponent,
        data: {
            title: "Chat Bot",
        },
    },
    {
        path: "blogpost",
        component: AppBlogPostComponent,
        data: {
            title: "Blog Post",
        },
    },
    {
        path: "quizpergunta",
        component: quizperguntaComponent,
        data: {
            title: "Quiz Pergunta",
        },
    },
    {
        path: "quiz",
        component: quizresultadosComponent,
        data: {
            title: "Quiz Page",
        },
    },
    {
        path: "404",
        component: PageNotFoundComponent,
        data: {
            title: "404",
        },
    },
    {
        path: "landindpage",
        component: AppLandingpageComponent,
        data: {
            title: "Landing Page",
        },
    },
    {
        path: "produtoAdmin",
        component: AppInvoiceListComponent,
    },
    {
        path: "addInvoice",
        component: AppAddInvoiceComponent,
    },
    {
        path: "categoriaAdmin",
        component: AppCategoryListComponent,
    },
    {
        path: "ticketAdmin",
        component: AppTicketlistComponent,
    },
    {
        path: "addCategory",
        component: AppAddCategoryComponent,
    },
];
