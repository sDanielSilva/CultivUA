import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { AuthService } from "../../services/auth.service";
import { UserService } from "../../services/user.service"; // Serviço que lida com a atualização do user
import { MaterialModule } from "material.module";
import { User } from "src/app/models/user.model";
import { MatDialog } from "@angular/material/dialog";
import { ToastService } from "src/app/services/shared/toast.service";
import { FormBuilder, FormGroup } from "@angular/forms";

@Component({
    selector: "app-newsletter",
    templateUrl: "./newsletter.component.html",
    styleUrls: ["./newsletter.component.scss"],
    imports: [MaterialModule],
    standalone: true,
})
export class NewsletterComponent implements OnInit {
    isSubscribed: boolean = false;
    isRequestInProgress: boolean = false; // Flag para evitar múltiplos cliques
    form: FormGroup;
    constructor(
        private fb: FormBuilder,
        private authService: AuthService,
        private router: Router,
        private userService: UserService,
        private dialog: MatDialog,
        private toastService: ToastService
    ) {}


    
    ngOnInit() {
        this.form = this.fb.group({
            newsletter: [false], // Define o valor inicial como false
        });

        // Verifica o estado da autenticação
        this.authService.isAuthenticated$.subscribe((isAuthenticated) => {
            if (isAuthenticated) {
                const userId = sessionStorage.getItem('user_id');
                if (userId) {
                    // Carregar o estado de subscrição quando o user estiver autenticado
                    this.userService.getUserDetailsHeader(userId).subscribe((user: User) => {
                        const isSubscribed = !!user.newsletter;  // Converte de 1/0 para booleano
                        this.form.get('newsletter')?.setValue(isSubscribed);
                    });
                } else {
                    this.toastService.show('User not authenticated!', 'error');
                }
            }
        });
    }

    toggleSubscription(isSubscribed: boolean): void {
        if (this.isRequestInProgress) {
            return; // Impede múltiplos cliques enquanto o pedido está em andamento
        }

        this.isRequestInProgress = true; // Bloqueia novas interações enquanto o pedido está em andamento

        // Alterna a subscrição
        const newSubscriptionState = !isSubscribed;
        this.form.get('newsletter')?.setValue(newSubscriptionState);

        // Atualiza a subscrição no servidor
        const userId = sessionStorage.getItem('user_id');
        if (userId) {
            this.userService.updateNewsletterSubscription(newSubscriptionState).subscribe(
                (response) => {
                    if (newSubscriptionState) {
                        this.toastService.show("You have subscribed to the newsletter!", "success");
                    } else {
                        this.toastService.show("You have unsubscribed from the newsletter!", "warning");
                    }
                },
                (error) => {
                    this.toastService.show("Error updating subscription.", "error");
                }
            ).add(() => {
                this.isRequestInProgress = false;
            });
        } else {
            this.isRequestInProgress = false;
        }
    }

    // Função de verificação de autenticação antes de ativar a subscrição
    checkSubscriptionStatus(): void {
        this.authService.isAuthenticated$.subscribe((isAuthenticated) => {
            if (!isAuthenticated) {
                this.authService.setRedirectUrl(this.router.url);
                this.router.navigate(["/login"]);
                return;
            }
    
            this.toggleSubscription(this.form.get('newsletter')?.value);
        });
    }
}
