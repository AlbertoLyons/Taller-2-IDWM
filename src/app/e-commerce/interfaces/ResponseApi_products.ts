export interface ResponseAPIGetAllProducts {
    message:      string;
    totalRecords: number;
    totalPages:   number;
    currentPage:  number;
    pageSize:     number;
    products:     Product[];
}

export interface Product {
    id:       number;
    name:     string;
    type:     string;
    price:    number;
    stock:    number;
    imageUrl: string;
}
