
export interface CarSpecs {
  engine: string;
  gearbox: string;
  mileage: string;
}

export interface Car {
  id: string;
  title: string;
  description: string;
  image: string;
  specs: CarSpecs;
  tags: string[];
}
