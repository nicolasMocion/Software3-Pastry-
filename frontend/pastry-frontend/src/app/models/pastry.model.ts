export interface Pastry {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  category: 'cake' | 'cupcake' | 'cookie' | 'bread' | 'special';
  available: boolean;
}
