import { NavItem } from "./nav-item/nav-item";

export const navItems: NavItem[] = [
    {
        navCap: "Dashboard Admin",
    },
    {
        displayName: "Admin",
        iconName: "background",
        bgcolor: "primary",
        route: "/dashboardAdmin",
    },
    {
        displayName: "Blog",
        iconName: "article",
        bgcolor: "primary",
        route: "/blogAdmin",
    },
    {
        displayName: "Tickets",
        iconName: "ticket",
        bgcolor: "primary",
        route: "/ticketAdmin",
    },
    {
        displayName: "Products",
        iconName: "list",
        bgcolor: "primary",
        route: "/produtoAdmin",
    },
    {
        displayName: "Categories",
        iconName: "category",
        bgcolor: "primary",
        route: "/categoriaAdmin",
    },
    {
        displayName: "Locations",
        iconName: "map-pin",
        bgcolor: "primary",
        route: "/listaLocalizacoes",
    },
    {
        displayName: "Notifications",
        iconName: "bell",
        bgcolor: "primary",
        route: "/notificationsAdmin",
    }
];
