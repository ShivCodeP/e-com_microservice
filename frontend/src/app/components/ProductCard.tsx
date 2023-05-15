import {
  Box,
  Button,
  Card,
  CircularProgress,
  Rating,
  Typography,
} from "@mui/material";
import { useAddToCart } from "../Hooks/product/product.hooks";

interface ProductProps {
  _id: string;
  title?: string;
  price?: number;
  rating?: number;
  description?: string;
  images?: string[];
}

export const ProductCard = (props: ProductProps) => {
  const { mutate: addToCart, isLoading: addingToCart } = useAddToCart();
  const handleAddToCart = () => {
    addToCart({ payload: { _id: props?._id } });
  };

  return (
    <Card className="border-2 rounded-lg bg-white w-full h-[400px] p-3">
      <img
        src={props?.images?.[0] || ""}
        alt={props?.title || "prduct_image"}
        className="w-full h-3/5"
        loading="lazy"
      />
      <Box display="flex" gap={3} alignItems="center">
        <Typography variant="h4">{props?.title}</Typography>
        <Rating name={props?._id} value={props?.rating} />
      </Box>
      <Typography variant="body1">{props?.description}</Typography>
      <Box display="flex" gap={3} alignItems="center" marginTop={3}>
        <Button
          variant="contained"
          color="primary"
          className="rounded w-40"
          onClick={handleAddToCart}
          disabled={addingToCart}
        >
          {!addingToCart ? "Add to Cart" : <CircularProgress size={30} />}
        </Button>
        <Button variant="contained" color="primary" className="rounded w-40">
          Buy Now
        </Button>
      </Box>
    </Card>
  );
};
