export type CarStatus = 'draft' | 'published' | 'sold';

export type FuelType = 'Petrol' | 'Diesel' | 'Electric' | 'Hybrid' | 'Plug-in Hybrid';

export type Transmission = 'Manual' | 'Automatic';

export type BodyType = 'Sedan' | 'SUV' | 'Hatchback' | 'Coupe' | 'Convertible' | 'Wagon' | 'Van' | 'Truck';

export interface CarPhoto {
    url: string;
    order: number;
}

export interface CarEquipment {
    airConditioning?: string[];
    infotainment?: string[];
    mirrors?: string[];
    parkingAid?: string[];
    safety?: string[];
    seats?: string[];
    steeringWheel?: string[];
    wheels?: string[];
    windows?: string[];
    other?: string[];
}

export interface Car {
    id?: string;
    make: string;
    model: string;
    year: number;
    price: number;
    mileage: number;
    fuelType: FuelType;
    transmission: Transmission;
    bodyType: BodyType;
    color: string;
    vin?: string;
    description?: string;
    features?: string[];
    photos: CarPhoto[];
    videoLinks?: string[];
    status: CarStatus;
    deleted?: boolean;
    // Extended fields
    power?: string;          // e.g. "72 kW (98 Hp)"
    engineSize?: string;     // e.g. "1,797 cc"
    doors?: number;
    seats?: number;
    co2Standard?: string;    // e.g. "EU6b"
    interiorColor?: string;
    numberOfKeys?: number;
    firstRegistration?: string;  // date string
    technicalInspection?: string; // date string
    condition?: string;
    equipment?: CarEquipment;
    createdAt?: any;  // Firestore Timestamp
    updatedAt?: any;  // Firestore Timestamp
}
