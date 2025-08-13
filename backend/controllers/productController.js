


//function to add product
import { v2 as cloudinary } from "cloudinary";
import productModel from "../models/productModel.js";

const addProduct = async (req, res) => {
    try {
        const { name, description, price, category, subCategory, sizes, bestseller } = req.body;

        console.log("📦 Product Data Received:");
        console.log("Name:", name);
        console.log("Description:", description);
        console.log("Price:", price);
        console.log("Category:", category);
        console.log("SubCategory:", subCategory);
        console.log("Sizes (raw):", sizes);
        console.log("Bestseller:", bestseller);

        if (!req.file) {
            return res.status(400).json({ success: false, message: "Image is required" });
        }

        console.log("🖼️ Multer File Info:", req.file.originalname, req.file.mimetype);

        // Function to upload to Cloudinary
        const cloudinaryUpload = () => {
            return new Promise((resolve, reject) => {
                const stream = cloudinary.uploader.upload_stream(
                    { folder: "products" },
                    (error, result) => {
                        if (error) reject(error);
                        else resolve(result);
                    }
                );
                stream.end(req.file.buffer);
            });
        };

        const cloudinaryResult = await cloudinaryUpload();

        // Log the Cloudinary image URL in terminal
        console.log("✅ Cloudinary Image URL:", cloudinaryResult.secure_url);

        res.json({
            success: true,
            message: "Image uploaded successfully",
            imageUrl: cloudinaryResult.secure_url
        });

        const productData={
            name,
            description,
            category,
            price: Number(price),
            subCategory,
            bestseller: bestseller==="true"?true : false,
            sizes: JSON.parse(sizes),
            image:cloudinaryResult.secure_url,
            date:Date.now()
        }

        console.log(productData)

        const product=new productModel(productData);
        await product.save()

        res.json({success:true,message:"Product Added"})

    } catch (error) {
        console.error("❌ Error uploading product:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};



//function for list product
const listProduct=async(req,res)=>{
    try {
        const products=await productModel.find({});
        res.json({success:true,products})
    } catch (error) {
        console.error("❌ Error", error);
        res.status(500).json({ success: false, message: error.message });
    }
}

//function for removing product
const removeProduct=async(req,res)=>{
    try {
        await productModel.findByIdAndDelete(req.body.id)
        res.json({success:true,message:"Product Removed"})
    } catch (error) {
        console.error("❌ Error", error);
        res.status(500).json({ success: false, message: error.message });
    }
}

//function for single product info
const singleProduct=async(req,res)=>{
    try {
        const {productId}=req.body
        const product=await productModel.findById(productId)
        res.json({success:true,product})
    } catch (error) {
        console.error("❌ Error", error);
        res.status(500).json({ success: false, message: error.message });
    }
}

export {listProduct,addProduct,removeProduct,singleProduct}