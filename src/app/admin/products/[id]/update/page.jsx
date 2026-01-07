"use client";
export const dynamic = "force-dynamic";

import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { toast } from "react-toastify";
import API from "../../../../../utils/axiosInstance";

const UpdateProduct = () => {
  const router = useRouter();
  const { id } = useParams();

  const [productData, setProductData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    stock: "",
  });

  const [categories, setCategories] = useState([]);
  const [oldImages, setOldImages] = useState([]);
  const [newImages, setNewImages] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [loading, setLoading] = useState(false);

  /* ---------------- FETCH PRODUCT ---------------- */
  useEffect(() => {
    if (!id) return;

    const fetchProduct = async () => {
      try {
        const { data } = await API.get(`/admin/product/${id}`);
        const p = data.product;

        setProductData({
          name: p.name || "",
          description: p.description || "",
          price: p.price || "",
          category: p.category?._id || "",
          stock: p.stock || "",
        });

        setOldImages(p.images || []);
      } catch (err) {
        toast.error("Failed to load product");
      }
    };

    fetchProduct();
  }, [id]);

  /* ---------------- FETCH CATEGORIES ---------------- */
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await API.get("/categories");
        if (data.success) {
          setCategories(
            data.categories.map((c) => ({
              id: c._id,
              name: c.name,
            }))
          );
        }
      } catch {
        toast.error("Failed to load categories");
      }
    };
    fetchCategories();
  }, []);

  /* ---------------- HANDLERS ---------------- */
  const handleChange = (e) => {
    setProductData({ ...productData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files || []);
    const valid = [];
    const prev = [];

    files.forEach((file) => {
      if (!["image/jpeg", "image/png"].includes(file.type)) {
        toast.error(`${file.name} must be JPG or PNG`);
        return;
      }
      valid.push(file);
      prev.push(URL.createObjectURL(file));
    });

    setNewImages(valid);
    setPreviews(prev);
  };

  /* ---------------- CLOUDINARY UPLOAD ---------------- */
  const uploadImagesToCloudinary = async () => {
    const uploaded = [];
    if (!newImages.length) return uploaded;

    const sigRes = await API.get("/get-signature");
    const { signature, timestamp, folder, cloudName, apiKey } = sigRes.data;

    const CLOUDINARY_URL = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;

    for (const file of newImages) {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("timestamp", timestamp);
      fd.append("signature", signature);
      fd.append("api_key", apiKey);
      fd.append("folder", folder);

      const res = await fetch(CLOUDINARY_URL, {
        method: "POST",
        body: fd,
      });

      const img = await res.json();
      uploaded.push({
        public_id: img.public_id,
        url: img.secure_url,
      });
    }

    return uploaded;
  };

  /* ---------------- SUBMIT ---------------- */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!productData.name.trim()) return toast.error("Product name required");
    if (!productData.category) return toast.error("Select a category");

    try {
      setLoading(true);

      const uploadedImages = newImages.length
        ? await uploadImagesToCloudinary()
        : [];

      await API.put(`/admin/product/${id}`, {
        ...productData,
        images: uploadedImages.length ? uploadedImages : oldImages,
      });

      toast.success("Product updated successfully");
      router.push("/admin/products");
    } catch (err) {
      toast.error("Error updating product");
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- UI ---------------- */
  return (
    <div className="flex justify-center py-10">
      <div className="w-full max-w-2xl bg-white p-8 rounded-xl shadow-lg">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">
          Update Product
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Name */}
          <div>
            <label className="block mb-1 font-medium text-gray-700">
              Product Name
            </label>
            <input
              name="name"
              value={productData.name}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block mb-1 font-medium text-gray-700">
              Description
            </label>
            <textarea
              name="description"
              value={productData.description}
              onChange={handleChange}
              rows={4}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          {/* Price */}
          <div>
            <label className="block mb-1 font-medium text-gray-700">
              Price
            </label>
            <input
              type="number"
              name="price"
              value={productData.price}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          {/* Stock */}
          <div>
            <label className="block mb-1 font-medium text-gray-700">
              Stock
            </label>
            <input
              type="number"
              name="stock"
              value={productData.stock}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          {/* Category */}
          <div>
            <label className="block mb-1 font-medium text-gray-700">
              Category
            </label>
            <select
              value={productData.category}
              onChange={(e) =>
                setProductData({ ...productData, category: e.target.value })
              }
              className="w-full px-4 py-2 border rounded-lg bg-white focus:ring-2 focus:ring-blue-500 outline-none"
            >
              <option value="">Select category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* Upload Images */}
          <div>
            <label className="block mb-2 font-medium text-gray-700">
              Product Images
            </label>
            <button
              type="button"
              onClick={() => document.getElementById("fileInput").click()}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Upload Images
            </button>

            <input
              id="fileInput"
              type="file"
              hidden
              multiple
              accept="image/jpeg,image/png"
              onChange={handleFileChange}
            />
          </div>

          {/* Image Preview */}
          <div className="grid grid-cols-3 gap-4">
            {(previews.length
              ? previews
              : oldImages.map((img) => img.url)
            ).map((src, i) => (
              <img
                key={i}
                src={src}
                className="h-32 w-full object-cover rounded-lg border"
              />
            ))}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition disabled:opacity-60"
          >
            {loading ? "Updating..." : "Update Product"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default UpdateProduct;
