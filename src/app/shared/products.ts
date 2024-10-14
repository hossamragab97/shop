export class Products {
    name: string;
    description:string;
    categoryId:number;
    region:string;
    price:number;
    image:string;
  
   
    constructor() {
      this.name = null;
      this.description = null;
      this.categoryId = null;
      this.region = null;
      this.price = null;
      this.image = null;
    }
  
    public deserialize(input: any) {
      Object.assign(this, input);
      return this;
    }
  }
  