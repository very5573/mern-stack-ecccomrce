"use client";
export const dynamic = "force-dynamic";

import React, { useEffect, useState, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { useDebounce } from "use-debounce";
import API from "../../utils/axiosInstance";
import UIPagination from "../components/UI/UIPagination";
import SliderSizes from "../components/UI/Slider";
import { addCartItem } from "../../redux/slices/cartSlice";
import CategoryFilter from "../components/UI/CategoryFilter"; // ✅ NEW IMPORT

import {
  Box,
  Typography,
  Card,
  CardContent,
  Stack,
  Button,
  Rating,
} from "@mui/material";
import FilterAltIcon from "@mui/icons-material/FilterAlt";

const Product = () => {
  const dispatch = useDispatch();
  const router = useRouter();

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]); // ✅ YEH STATE AB MAIN FILE ME
  const [selectedCategory, setSelectedCategory] = useState(""); // ✅ YEH BHI

  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [priceRange, setPriceRange] = useState([0, 50000]);
  const [debouncedPriceRange] = useDebounce(priceRange, 300);

  const keyword = useSelector((state) => state?.search?.keyword) || "";
  const [debouncedKeyword] = useDebounce(keyword, 300);

  useEffect(() => {
    setPage(1);
  }, [debouncedKeyword, debouncedPriceRange, selectedCategory]);

  // ✅ ADD TO CART
  const handleAddToCart = async (productId) => {
    try {
      await dispatch(addCartItem({ productId, quantity: 1 })).unwrap();
      toast.success("🛒 Product added to cart!");
    } catch (err) {
      toast.error(err.message || "Failed to add product to cart");
    }
  };

  // ✅ FETCH PRODUCTS (CATEGORY SEPARATE HO GAYA)
  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);

      let query = `/products?page=${page}`;

      if (debouncedKeyword.trim()) {
        query += `&keyword=${debouncedKeyword.trim()}`;
      }

      if (selectedCategory) {
        query += `&categoryId=${selectedCategory}`;
      }

      query += `&price[gte]=${debouncedPriceRange[0]}&price[lte]=${debouncedPriceRange[1]}`;

      const { data } = await API.get(query);

      setProducts(data.products || []);
      const total = data.filteredProductsCount || 0;
      const perPage = data.resultPerPage || 1;

      setTotalPages(Math.ceil(total / perPage));
    } catch (err) {
      toast.error("❌ Failed to load products");
    } finally {
      setLoading(false);
    }
  }, [debouncedKeyword, debouncedPriceRange, page, selectedCategory]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  if (loading)
    return (
      <Typography variant="h6" textAlign="center" mt={10}>
        Loading…
      </Typography>
    );

  return (
    <Box className="p-6">
      {/* ✅ HEADER */}
      <Stack direction="row" justifyContent="space-between" mb={6}>
        <Typography variant="h4" fontWeight="bold">
          All Products <FilterAltIcon />
        </Typography>
      </Stack>

      <Stack direction={{ xs: "column", md: "row" }} gap={6}>
        {/* ✅ LEFT SIDEBAR */}
        <Box className="md:w-1/4 bg-white p-4 rounded-lg shadow">
          <Typography variant="h6" fontWeight="bold" mb={2}>
            Filters
          </Typography>

          {/* ✅ CATEGORY FILTER COMPONENT */}
          <CategoryFilter
            categories={categories}
            setCategories={setCategories}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
          />

          {/* ✅ PRICE FILTER */}
          <Typography variant="subtitle1">Price</Typography>
          <SliderSizes
            value={priceRange}
            onChange={(e, val) => setPriceRange(val)}
          />

          <Stack direction="row" justifyContent="space-between" mt={2}>
            <Typography>₹{priceRange[0]}</Typography>
            <Typography>₹{priceRange[1]}</Typography>
          </Stack>
        </Box>

        {/* ✅ PRODUCT LIST */}
        <Box className="md:w-3/4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((p) => (
            <Card key={p._id}>
              <Box
                className="w-full h-110 cursor-pointer"
                onClick={() => router.push(`/product/${p._id}`)}
              >
                <img
                  src={p.images?.[0]?.url || "/placeholder.png"}
                  alt={p.name}
                  className="w-full h-full object-cover"
                />
              </Box>

              <CardContent>
                <Typography fontWeight="bold">{p.name}</Typography>
                <Typography color="primary">₹{p.price}</Typography>

                <Stack direction="row" spacing={1} mt={1}>
                  <Rating value={p.ratings || 0} readOnly size="small" />
                  <Typography variant="body2">
                    ({p.numOfReviews || 0})
                  </Typography>
                </Stack>

                <Button
                  variant="contained"
                  fullWidth
                  sx={{ mt: 2 }}
                  disabled={!p.inStock}
                  onClick={() => handleAddToCart(p._id)}
                >
                  {p.inStock ? "Add to Cart" : "Out of Stock"}
                </Button>
              </CardContent>
            </Card>
          ))}
        </Box>
      </Stack>

      {/* ✅ PAGINATION */}
      <Stack mt={6} alignItems="center">
        <UIPagination
          totalPages={totalPages}
          page={page}
          onChange={(e, value) => setPage(value)}
        />
      </Stack>
    </Box>
  );
};

export default Product;
