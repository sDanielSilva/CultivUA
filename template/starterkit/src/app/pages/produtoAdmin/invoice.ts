export class InvoiceList {
  constructor(
    public id: number = 0,
    public name: string = '',
    public categories_id: string = '',
    public price: number = 0,
    public stock: number = 0,
    public imagem: string = '',
    public threshold: number = 0,
  ) {}
}
