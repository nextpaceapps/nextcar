export interface Vehicle {
    id: string;
    title: string;
    make: string;
    model: string;
    year: number;
    price: number;
    // Add other fields from schema
}

export interface User {
    uid: string;
    email: string;
    role: 'Admin' | 'Editor' | 'Viewer';
}
