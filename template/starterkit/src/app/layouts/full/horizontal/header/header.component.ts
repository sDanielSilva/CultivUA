import {
    Component,
    Output,
    EventEmitter,
    Input,
    ViewEncapsulation,
} from "@angular/core";
import { CoreService } from "src/app/services/core.service";
import { MatDialog } from "@angular/material/dialog";
import { TranslateService } from "@ngx-translate/core";
import { Router, RouterModule } from "@angular/router";
import { TablerIconsModule } from "angular-tabler-icons";
import { MaterialModule } from "src/app/material.module";
import { BrandingComponent } from "../../vertical/sidebar/branding.component";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { NgScrollbarModule } from "ngx-scrollbar";
import { MatMenuModule } from "@angular/material/menu";
import { MatButtonModule } from "@angular/material/button";
import { navItems } from "../sidebar/sidebar-data";
import { HttpClient } from "@angular/common/http";
import { AuthService } from "src/app/services/auth.service";
import { UserService } from "src/app/services/user.service";
import { environment } from "src/environments/environment";
import { CartService, CartItem } from 'src/app/services/cart-service.service';

interface profiledd {
    id: number;
    img: string;
    title: string;
    color: string;
    subtitle: string;
    link: string;
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
    selector: "app-horizontal-header",
    standalone: true,
    imports: [
        RouterModule,
        CommonModule,
        NgScrollbarModule,
        TablerIconsModule,
        MaterialModule,
        FormsModule,
        MatMenuModule,
        MatButtonModule,
        BrandingComponent,
    ],
    templateUrl: "./header.component.html",
    styleUrls: ["./header.component.scss"],
    encapsulation: ViewEncapsulation.None,
})
export class AppHorizontalHeaderComponent {
    username: string = "";
    email: string = "";
    searchText: string = "";
    navItems = navItems;
    notifications: any[] = [];
    unreadCount: number = 0;
    userId: number = 1; // Temporário, substituir pelo ID do utilizador logado
    isAuthenticated: boolean = false;
    currentRoute: string = "";
    cartOpen = false;
    cartCount: number = 0;
    total: number = 0;
    cartItems: CartItem[] = [];
    user: any = {};

    @Input() showToggle = true;
    @Input() toggleChecked = false;
    @Output() toggleMobileNav = new EventEmitter<void>();
    @Output() toggleMobileFilterNav = new EventEmitter<void>();
    @Output() toggleCollapsed = new EventEmitter<void>();

    navItemsData = navItems.filter((navitem) => navitem.displayName);

    showFiller = false;

    constructor(
        private vsidenav: CoreService,
        public dialog: MatDialog,
        private translate: TranslateService,
        private authService: AuthService,
        private userService: UserService,
        private http: HttpClient,
        private router: Router,
        private cartService: CartService
    ) {
        this.loadUserDetails();
        this.router.events.subscribe(() => {
            this.currentRoute = this.router.url;
        });
        this.authService.isAuthenticated$.subscribe((status) => {
            this.isAuthenticated = status;
            if (this.isAuthenticated) {
                this.loadUserDetails();
            } else {
                this.username = "Utilizador";
            }
        });
    }



    ngOnInit() {
        const token = this.authService.getToken();
        if (token) {
            this.isAuthenticated = true;
            this.userService.getUserDetails().subscribe(
                (userData: any) => {
                    //`any` aqui para simplificar
                    this.username = userData.username || "Utilizador";
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

        const userId = sessionStorage.getItem('user_id');
        if (userId) {
            this.userService.getUserDetailsHeader(userId).subscribe(
                (data) => {
                    this.user = data;
                },
                (error) => {
                    console.error('Error fetching user details', error);
                }
            );
        }

        this.fetchNotifications();
        setInterval(() => this.fetchNotifications(), 300000); // Atualiza a cada 5 minutos

        this.cartService.cart$.subscribe((items) => {
            // Atualiza os itens do carrinho
            this.cartItems = items;
            // Calcula o número de itens no carrinho
            this.cartCount = items.reduce((count, item) => count + item.quantity, 0);
            // Calcula o total do carrinho
            this.total = this.cartService.getCartTotal();
        });

    }

    increaseQuantity(id: number): void {
        const item = this.cartItems.find((item) => item.id === id);
        if (item) {
            this.cartService.updateQuantity(id, item.quantity + 1);
        }
    }

    decreaseQuantity(id: number): void {
        const item = this.cartItems.find((item) => item.id === id);
        if (item) {
            this.cartService.updateQuantity(id, item.quantity - 1);
        }
    }

    removeItem(id: number): void {
        this.cartService.removeFromCart(id);
    }

    checkout(): void {
        window.location.href = 'http://localhost:4200/loja-online/checkout';
    }

    fetchNotifications(): void {
        const userId = sessionStorage.getItem('user_id');
        console.log(userId);
        this.http
            .get(`${environment.apiUrl}/notifications/${userId}`)
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
        this.isAuthenticated = false;
    }

    loadUserDetails(): void {
        // Método que poderia ser mantido caso deseje carregar outros detalhes
        this.authService.getUserDetails().subscribe(
            (user) => {
                this.username = user.username || "Utilizador"; // Atualiza o nome de utilizador
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

    navigate(route: string): void {
        this.router.navigate([route]);
    }

    profiledd: profiledd[] = [
        {
            id: 1,
            img: "wallet",
            color: "primary",
            title: "Profile",
            subtitle: "User settings",
            link: "/perfilutilizador",
        },
        {
            id: 2,
            img: "shield",
            color: "success",
            title: "Inbox",
            subtitle: "Notifications and Alerts",
            link: "/notifications",
        },
    ];
}
