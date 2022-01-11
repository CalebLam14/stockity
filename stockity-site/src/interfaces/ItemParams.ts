import Group from "./Group";

interface ItemParams {
  name: string;
  description: string;
  price: number;
  stock: number;
  group: number | null;
}

export default ItemParams;
