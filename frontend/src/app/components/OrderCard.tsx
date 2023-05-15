import { Box, Card, Rating, Typography } from "@mui/material";
import Image from "next/image";

interface OrderProps {
  _id: string;
  products: {
    title?: string;
    price?: number;
    rating?: number;
    description?: string;
    images?: string[];
  }[];
  totalPrice?: number;
  status?: string;
}

export const OrderCard = (props: OrderProps) => {
  return (
    <Card className="border-2 flex w-4/5 m-auto justify-between items-center rounded-lg bg-white h-[200px] p-2">
      <Box display="flex" gap={2} sx={{ height: "100%" }}>
        <img
          src={props?.products?.[0]?.images?.[0] || ""}
          alt={props?.products?.[0]?.title || "product_image"}
          className="h-full"
          width={150}
          loading="lazy"
        />
        <Box>
          <Box display="flex" gap={3} alignItems="center">
            <Typography variant="h4">{props?.products?.[0]?.title}</Typography>
            <Rating name={props?._id} value={props?.products?.[0]?.rating} />
          </Box>
          <Typography variant="body1">
            {props?.products?.[0]?.description}
          </Typography>
          <Typography variant="body1">
            Total Price: {props?.totalPrice}
          </Typography>
        </Box>
      </Box>
      <Box>
        <Typography color="orangered">Status</Typography>
        <Typography>{props?.status || ""}</Typography>
      </Box>
    </Card>
  );
};
