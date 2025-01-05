import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AdminDashboardService } from './dashboard-admin.service';
import { environment } from 'src/environments/environment';

describe('AdminDashboardService', () => {
    let service: AdminDashboardService;
    let httpMock: HttpTestingController;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [AdminDashboardService]
        });
        service = TestBed.inject(AdminDashboardService);
        httpMock = TestBed.inject(HttpTestingController);
    });

    afterEach(() => {
        httpMock.verify();
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should fetch dashboard stats', () => {
        const dummyStats = { users: 10, sales: 100 };
        service.getDashboardStats().subscribe(stats => {
            expect(stats).toEqual(dummyStats);
        });

        const req = httpMock.expectOne(`${environment.apiUrl}/dashboard-stats`);
        expect(req.request.method).toBe('GET');
        req.flush(dummyStats);
    });

    it('should fetch products sold by category', () => {
        const dummyData = { categoryA: 50, categoryB: 30 };
        service.getProductsSoldByCategory().subscribe(data => {
            expect(data).toEqual(dummyData);
        });

        const req = httpMock.expectOne(`${environment.apiUrl}/products-sold-by-category`);
        expect(req.request.method).toBe('GET');
        req.flush(dummyData);
    });

    it('should fetch monthly sales with parameters', () => {
        const dummySales = { January: [100, 200], February: [150, 250] };
        service.getMonthlySales(1, 2023).subscribe(sales => {
            expect(sales).toEqual(dummySales);
        });

        const req = httpMock.expectOne(`${environment.apiUrl}/monthly-sales?month=1&year=2023`);
        expect(req.request.method).toBe('GET');
        req.flush(dummySales);
    });

    it('should fetch monthly sales without parameters', () => {
        const dummySales = { January: [100, 200], February: [150, 250] };
        service.getMonthlySales().subscribe(sales => {
            expect(sales).toEqual(dummySales);
        });

        const req = httpMock.expectOne(`${environment.apiUrl}/monthly-sales`);
        expect(req.request.method).toBe('GET');
        req.flush(dummySales);
    });

    it('should fetch plant data by day', () => {
        const dummyData = { day1: { temperature: 20, humidity: 30 }, day2: { temperature: 22, humidity: 35 } };
        service.getPlantDataByDay().subscribe(data => {
            expect(data).toEqual(dummyData);
        });

        const req = httpMock.expectOne(`${environment.apiUrl}/plant-data-by-day`);
        expect(req.request.method).toBe('GET');
        req.flush(dummyData);
    });
});