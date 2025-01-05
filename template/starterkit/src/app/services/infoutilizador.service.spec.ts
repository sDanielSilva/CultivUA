import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { UserService } from './infoutilizador.service';

describe('UserService', () => {
    let service: UserService;
    let httpMock: HttpTestingController;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [UserService]
        });
        service = TestBed.inject(UserService);
        httpMock = TestBed.inject(HttpTestingController);
    });

    afterEach(() => {
        httpMock.verify();
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should fetch user details', () => {
        const dummyUserDetails = { firstName: 'John', lastName: 'Doe', email: 'john.doe@example.com' };

        service.getUserDetails().subscribe(userDetails => {
            expect(userDetails).toEqual(dummyUserDetails);
        });

        const req = httpMock.expectOne('http://localhost:3306/userdetails');
        expect(req.request.method).toBe('GET');
        req.flush(dummyUserDetails);
    });

    it('should update user details', () => {
        const dummyUserDetails = { firstName: 'Jane', lastName: 'Doe', email: 'jane.doe@example.com' };

        service.updateUserDetails(dummyUserDetails).subscribe(response => {
            expect(response).toEqual(dummyUserDetails);
        });

        const req = httpMock.expectOne('http://localhost:3306/atualizarutilizador');
        expect(req.request.method).toBe('PUT');
        expect(req.request.body).toEqual(dummyUserDetails);
        req.flush(dummyUserDetails);
    });
});