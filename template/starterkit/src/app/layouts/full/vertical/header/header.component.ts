import {
    Component,
    Output,
    EventEmitter,
    Input,
    ViewEncapsulation,
} from "@angular/core";
import { CoreService } from "src/app/services/core.service";
import { MatDialog } from "@angular/material/dialog";
import { navItems } from "../sidebar/sidebar-data";
import { TranslateService } from "@ngx-translate/core";
import { TablerIconsModule } from "angular-tabler-icons";
import { MaterialModule } from "src/app/material.module";
import { Router, RouterModule } from "@angular/router";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { NgScrollbarModule } from "ngx-scrollbar";
import { MatMenuModule } from "@angular/material/menu";
import { MatButtonModule } from "@angular/material/button";
import { MatSidenavModule } from "@angular/material/sidenav";
import { AuthService } from "src/app/services/auth.service";
import { UserService } from "src/app/services/user.service";
import { HttpClient } from "@angular/common/http";
import { environment } from "src/environments/environment";

interface profiledd {
    id: number;
    img: string;
    title: string;
    subtitle: string;
    link: string;
    color: string;
}

interface apps {
    id: number;
    img: string;
    title: string;
    subtitle: string;
    link: string;
}

interface quicklinks {
    id: number;
    title: string;
    link: string;
}

@Component({
    selector: "app-header",
    standalone: true,
    imports: [
        RouterModule,
        CommonModule,
        NgScrollbarModule,
        TablerIconsModule,
        MaterialModule,
        FormsModule,
        MatMenuModule,
        MatSidenavModule,
        MatButtonModule,
    ],
    templateUrl: "./header.component.html",
    encapsulation: ViewEncapsulation.None,
})
export class HeaderComponent {
    username: string = "";
    email: string = "";
    searchText: string = "";
    navItems = navItems;
    notifications: any[] = [];
    unreadCount: number = 0;
    userId: number = 1; // Temporário, substituir pelo ID do utilizador logado

    navItemsData = navItems.filter((navitem) => navitem.displayName);

    @Input() showToggle = true;
    @Input() toggleChecked = false;
    @Output() toggleMobileNav = new EventEmitter<void>();
    @Output() toggleMobileFilterNav = new EventEmitter<void>();
    @Output() toggleCollapsed = new EventEmitter<void>();

    showFiller = false;

    public selectedLanguage: any = {
        language: "English",
        code: "en",
        type: "US",
        icon: "/assets/images/flag/icon-flag-en.svg",
    };

    public languages: any[] = [
        {
            language: "English",
            code: "en",
            type: "US",
            icon: "/assets/images/flag/icon-flag-en.svg",
        },
        {
            language: "Español",
            code: "es",
            icon: "/assets/images/flag/icon-flag-es.svg",
        },
        {
            language: "Français",
            code: "fr",
            icon: "/assets/images/flag/icon-flag-fr.svg",
        },
        {
            language: "German",
            code: "de",
            icon: "/assets/images/flag/icon-flag-de.svg",
        },
    ];

    constructor(
        private vsidenav: CoreService,
        public dialog: MatDialog,
        private translate: TranslateService,
        private authService: AuthService,
        private userService: UserService,
        private http: HttpClient,
        private router: Router
    ) {
        this.loadUserDetails();
        translate.setDefaultLang("en");
    }

    ngOnInit() {
        const token = this.authService.getToken();
        if (token) {
            this.userService.getUserDetails().subscribe(
                (userData: any) => {
                    //`any` aqui para simplificar
                    this.username = userData.username || "User";
                    this.email = userData.email || "Email";
                },
                (error) => {
                    console.error(
                        "Erro ao obter os dados do utilizador:",
                        error
                    );
                }
            );
        }

        this.fetchNotifications();
        setInterval(() => this.fetchNotifications(), 300000); // Atualiza a cada 5 minutos
    }

    fetchNotifications(): void {
        this.http
            .get(`${environment.apiUrl}/notifications/1`)
            .subscribe((response: any) => {
                this.notifications = this.sortNotifications(
                    response.notifications
                );
                this.unreadCount = response.unread_count;
            });
    }

    handleNotificationClick(notification: any): void {
        if (notification.is_read === 0) {
            // Atualiza localmente o estado para "lido"
            notification.is_read = 1;
            this.unreadCount -= 1;

            // Ordena a lista localmente
            this.notifications = this.sortNotifications(this.notifications);

            // Atualiza no backend
            this.http
                .put(
                    `${environment.apiUrl}/notifications/${notification.id}/mark-read`,
                    {}
                )
                .subscribe({
                    error: (err) => {
                        console.error(
                            "Erro ao marcar a notificação como lida:",
                            err
                        );
                    },
                });
        }

        // Redireciona baseado no tipo de notificação
        const route =
            notification.type === "new_blog_post" ? "/blog" : "/dashboard";
        this.router.navigate([route]);
    }

    sortNotifications(notifications: any[]): any[] {
        // Ordena: "não lidas" primeiro
        return notifications.sort((a, b) => a.is_read - b.is_read);
    }

    onMenuOpened(isOpened: boolean): void {
        if (isOpened) {
            this.fetchNotifications();
        }
    }


    logout() {
        this.authService.logout().subscribe(() => {
            this.router.navigate(["/login"]); // Redireciona para o login após logout
        });
    }

    loadUserDetails(): void {
        // Método que poderia ser mantido caso deseje carregar outros detalhes
        this.authService.getUserDetails().subscribe(
            (user) => {
                this.username = user.username || "User"; // Atualiza o nome de utilizador
                this.email = user.email || "Email";
            },
            (error) => {
                console.error(
                    "Erro ao carregar detalhes do utilizador:",
                    error
                );
            }
        );
    }

    openDialog() {
        const dialogRef = this.dialog.open(AppSearchDialogComponent);

        dialogRef.afterClosed().subscribe((result) => {
            console.log(`Dialog result: ${result}`);
        });
    }

    changeLanguage(lang: any): void {
        this.translate.use(lang.code);
        this.selectedLanguage = lang;
    }

    profiledd: profiledd[] = [
        {
            id: 1,
            img: "wallet",
            color: "primary",
            title: "My Profile",
            subtitle: "Account Settings",
            link: "/",
        },
        {
            id: 2,
            img: "shield",
            color: "success",
            title: "My Inbox",
            subtitle: "Messages & Email",
            link: "/",
        },
        {
            id: 3,
            img: "credit-card",
            color: "error",
            title: "My Tasks",
            subtitle: "To-do and Daily Tasks",
            link: "/",
        },
    ];
    apps: apps[] = [
        {
            id: 1,
            img: "/assets/images/svgs/icon-dd-chat.svg",
            title: "Chat Application",
            subtitle: "Messages & Emails",
            link: "/",
        },
        {
            id: 2,
            img: "/assets/images/svgs/icon-dd-cart.svg",
            title: "Todo App",
            subtitle: "Completed task",
            link: "/",
        },
        {
            id: 3,
            img: "/assets/images/svgs/icon-dd-invoice.svg",
            title: "Invoice App",
            subtitle: "Get latest invoice",
            link: "/",
        },
        {
            id: 4,
            img: "/assets/images/svgs/icon-dd-date.svg",
            title: "Calendar App",
            subtitle: "Get Dates",
            link: "/",
        },
        {
            id: 5,
            img: "/assets/images/svgs/icon-dd-mobile.svg",
            title: "Contact Application",
            subtitle: "2 Unsaved Contacts",
            link: "/",
        },
        {
            id: 6,
            img: "/assets/images/svgs/icon-dd-lifebuoy.svg",
            title: "Tickets App",
            subtitle: "Create new ticket",
            link: "/",
        },
        {
            id: 7,
            img: "/assets/images/svgs/icon-dd-message-box.svg",
            title: "Email App",
            subtitle: "Get new emails",
            link: "/",
        },
        {
            id: 8,
            img: "/assets/images/svgs/icon-dd-application.svg",
            title: "Courses",
            subtitle: "Create new course",
            link: "/",
        },
    ];

    quicklinks: quicklinks[] = [
        {
            id: 1,
            title: "Pricing Page",
            link: "/",
        },
        {
            id: 2,
            title: "Authentication Design",
            link: "/",
        },
        {
            id: 3,
            title: "Register Now",
            link: "/",
        },
        {
            id: 4,
            title: "404 Error Page",
            link: "/",
        },
        {
            id: 5,
            title: "Notes App",
            link: "/",
        },
        {
            id: 6,
            title: "Employee App",
            link: "/",
        },
        {
            id: 7,
            title: "Todo Application",
            link: "/",
        },
        {
            id: 8,
            title: "Treeview",
            link: "/",
        },
    ];
}

@Component({
    selector: "search-dialog",
    standalone: true,
    imports: [
        RouterModule,
        MaterialModule,
        TablerIconsModule,
        FormsModule,
        NgScrollbarModule,
    ],
    templateUrl: "search-dialog.component.html",
})
export class AppSearchDialogComponent {
    searchText: string = "";
    navItems = navItems;

    navItemsData = navItems.filter((navitem) => navitem.displayName);
}
