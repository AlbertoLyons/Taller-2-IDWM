export interface AdressDto{
    country: string,
    city: string,
    county: string,
    address: string
}

export interface buyResponse {
    message: string;
    receipt: Receipt;
}

export interface Receipt {
    id:              number;
    country:         string;
    city:            string;
    county:          string;
    address:         string;
    boughtAt:        Date;
    totalPrice:      number;
    receiptProducts: ReceiptProduct[];
}

export interface ReceiptProduct {
    name:       string;
    type:       string;
    price:      number;
    quantity:   number;
    totalPrice: number;
}
