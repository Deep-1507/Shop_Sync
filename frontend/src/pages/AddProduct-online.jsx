import { useState } from "react";
import axios from "axios";
import { useSnackbar } from "notistack";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Inputbox } from "../components/Inputbox";
import { CustomButton } from "../components/CustomButton";
import gifLogo from '../assets/A.gif';

export const AddProductonline = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [productId, setProductId] = useState("");
  const [productName, setProductName] = useState("");
  const [productQty, setProductQty] = useState("");
  const [productPrice, setProductPrice] = useState("");
  const [productDescription, setProductDes] = useState("");
  const [productImages, setProductImages] = useState([]);
  const [category, setProductCategory] = useState("");
  const [brand, setProductBrand] = useState("");
  const [sku, setProductSku] = useState("");
  const [weight, setProductWeight] = useState("");
  const [dimensions, setProductDimensions] = useState("");
  const [inStock, setProductInStock] = useState(true);
  const [tags, setProductTags] = useState([]);
  const [warranty, setProductWarranty] = useState("");
  const [color, setProductColor] = useState("");
  const [size, setProductSize] = useState("");
  const [material, setProductMaterial] = useState("");
  const [rating, setProductRating] = useState(null);
  
  const token = localStorage.getItem("token");
  const { enqueueSnackbar } = useSnackbar();

  const addProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append("productId", productId);
      formData.append("productName", productName);
      formData.append("productQty", productQty);
      formData.append("productPrice", productPrice);
      formData.append("productDescription", productDescription);
      formData.append("category", category);
      formData.append("brand", brand);
      formData.append("sku", sku);
      formData.append("weight", weight);
      formData.append("dimensions", dimensions);
      formData.append("inStock", inStock);
      formData.append("tags", tags.join(',')); // Convert array to comma-separated string
      formData.append("warranty", warranty);
      formData.append("color", color);
      formData.append("size", size);
      formData.append("material", material);
      formData.append("rating", rating);

      // Append each file with a specific field name
      productImages.forEach((file, index) => {
        formData.append(`productImages`, file);
      });

      const response = await axios.post(
        "http://localhost:3000/api/v1/online-products/create-product",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      enqueueSnackbar("Product added successfully", { variant: "success" });
    } catch (error) {
      setError(error.message);
      enqueueSnackbar("Failed to add product", { variant: "error" });
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e) => {
    setProductImages([...e.target.files]);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <div className="mb-5">
        <Navbar showStoreDashboard={true} showPdt={true} showLogout={true} />
      </div>
      <div className="bg-slate-100 shadow-2xl m-10 rounded-2xl flex">
        {/* Left side: Form */}
        <div className="w-2/3 p-10">
          <div className="text-left font-bold ml-2">
            <div className="text-4xl m-3 mt-10">Add your Products Online...</div>
          </div>
          <form className="flex flex-col justify-center" encType="multipart/form-data">
            <Inputbox label="Enter Product Id" type="text" name="productId" placeholder="Enter Product Id" onChange={(e) => setProductId(e.target.value)} />
            <Inputbox
              label="Enter Product Quantity"
              type="number"
              name="productQty"
              placeholder="Enter Product Quantity"
              onChange={(e) => setProductQty(e.target.value)}
            />
            <Inputbox label="Enter Product Price" type="text" name="productPrice" placeholder="Enter Product Price" onChange={(e) => setProductPrice(e.target.value)} />
            <Inputbox label="Enter Product Name" type="text" name="productName" placeholder="Enter Product Name" onChange={(e) => setProductName(e.target.value)} />
            <Inputbox label="Enter Product Description" type="text" name="productDes" placeholder="Enter Product Description" onChange={(e) => setProductDes(e.target.value)} />
            <Inputbox label="Enter Product Category" type="text" name="category" placeholder="Enter Product Category" onChange={(e) => setProductCategory(e.target.value)} />
            <Inputbox label="Enter Product Brand" type="text" name="brand" placeholder="Enter Product Brand" onChange={(e) => setProductBrand(e.target.value)} />
            <Inputbox label="Enter Product SKU" type="text" name="sku" placeholder="Enter Product SKU" onChange={(e) => setProductSku(e.target.value)} />
            <Inputbox label="Enter Product Weight" type="number" name="weight" placeholder="Enter Product Weight" onChange={(e) => setProductWeight(e.target.value)} />
            <Inputbox label="Enter Product Dimensions (Length, Width, Height)" type="text" name="dimensions" placeholder="Enter Product Dimensions" onChange={(e) => setProductDimensions(e.target.value)} />
            <Inputbox label="Is Product In Stock?" type="checkbox" name="inStock" onChange={(e) => setProductInStock(e.target.checked)} />
            <Inputbox label="Enter Product Tags (comma separated)" type="text" name="tags" placeholder="Enter Product Tags" onChange={(e) => setProductTags(e.target.value.split(','))} />
            <Inputbox label="Enter Product Warranty" type="text" name="warranty" placeholder="Enter Product Warranty" onChange={(e) => setProductWarranty(e.target.value)} />
            <Inputbox label="Enter Product Color" type="text" name="color" placeholder="Enter Product Color" onChange={(e) => setProductColor(e.target.value)} />
            <Inputbox label="Enter Product Size" type="text" name="size" placeholder="Enter Product Size" onChange={(e) => setProductSize(e.target.value)} />
            <Inputbox label="Enter Product Material" type="text" name="material" placeholder="Enter Product Material" onChange={(e) => setProductMaterial(e.target.value)} />
            <Inputbox label="Enter Product Rating" type="number" name="rating" placeholder="Enter Product Rating (0-5)" onChange={(e) => setProductRating(Number(e.target.value))} />

            <div className="mt-4">
              <label className="block mb-2">Upload Images:</label>
              <input
                type="file"
                multiple
                onChange={handleImageChange}
                className="border rounded p-2"
              />
            </div>

            <div className="flex justify-center items-center mt-6">
              <div className="w-full">
                <CustomButton label="Submit" onClick={addProducts} />
              </div>
            </div>
          </form>
        </div>

        {/* Right side: GIF */}
        <div className="w-1/3 flex justify-center items-center p-6">
          <img src={gifLogo} alt="logo" width={120} />
        </div>
      </div>

      <Footer />
    </div>
  );
};
