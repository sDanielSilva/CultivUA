import { Component, OnInit } from "@angular/core";
import { NotificationService } from "../../services/notification.service"; // Substituímos o TodoService
import { Router } from "@angular/router";
import { Notification } from "../../models/notification.model"; // Modelo para as notificações
import { MaterialModule } from "material.module";
import { CommonModule } from "@angular/common";
import { TablerIconsModule } from "angular-tabler-icons";

@Component({
    selector: "app-notifications",
    templateUrl: "./notifications.component.html",
    styleUrls: ["./notifications.component.scss"],
    imports: [MaterialModule, CommonModule, TablerIconsModule],
    standalone: true,
})

export class NotificationsComponent implements OnInit {
    sidePanelOpened = true;
    public showSidebar = false;
    notifications: Notification[] = [];
    filteredNotifications: Notification[] = [];
    selectedCategory = "all";

    constructor(private notificationService: NotificationService, private router: Router) { }

    ngOnInit(): void {
        const isAdmin = this.isAdmin();
        isAdmin ? this.fetchAdminNotifications() : this.fetchUserNotifications();
    }

    isOver(): boolean {
        return window.matchMedia(`(max-width: 960px)`).matches;
    }

    fetchUserNotifications(): void {
        this.notificationService.getUserNotifications().subscribe((data: Notification[]) => {
            this.notifications = data.map((notification) => ({
                ...notification,
                hover: false,
            }));
            this.notifications = data.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
            this.applyFilter(this.selectedCategory);
        });
    }

    fetchAdminNotifications(): void {
        this.notificationService.getAdminNotifications().subscribe((data: Notification[]) => {
            this.notifications = data.map((notification) => ({
                ...notification,
                hover: false,
            }));
            this.notifications = data.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
            this.applyFilter(this.selectedCategory);
        });
    }

    applyFilter(category: string): void {
        this.selectedCategory = category;
        if (category === "all") {
            this.filteredNotifications = this.notifications;
        } else if (category === "unread") {
            this.filteredNotifications = this.notifications.filter((n) => !n.is_read);
        } else if (category === "read") {
            this.filteredNotifications = this.notifications.filter((n) => n.is_read);
        }
    }

    handleNotificationClick(notification: Notification): void {
        this.markAsRead(notification.id);

        switch (notification.type) {
            case "new_blog_post":
                this.router.navigate(["/blog"]);
                break;
            case "plant_care":
                this.router.navigate(["/dashboard"]);
                break;
            case "low_stock":
                if (this.isAdmin()) this.router.navigate(["/produtoAdmin"]);
                break;
            case "new_ticket":
                if (this.isAdmin()) this.router.navigate(["/ticketAdmin"]);
                break;
            default:
                console.log("Notification type not recognized.");
        }
    }

    mapNotificationType(type: string): string {
        switch (type) {
            case "new_blog_post":
            return "New Blog Post";
            case "plant_care":
            return "Plant Care";
            case "low_stock":
            return "Low Stock";
            case "new_ticket":
            return "New Ticket";
            default:
            return "Notification";
        }
    }

    markAsRead(notificationId: number): void {
        this.notificationService.markAsRead(notificationId).subscribe(() => {
            const notification = this.notifications.find((n) => n.id === notificationId);
            if (notification) notification.is_read = true;
        });
    }

    isAdmin(): boolean {
        return sessionStorage.getItem('user_type') === 'admin';
    }

    unreadNotifications(): number {
        return this.notifications.filter((n) => !n.is_read).length;
    }
}
