import Group from "./Group";

interface Item {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  group: Group | null;
}

export default Item;
