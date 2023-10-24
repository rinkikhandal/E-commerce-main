import { StatusCodes } from "http-status-codes";
import Product from "../models/products";
import { BadRequest, NotFound } from "../errors/customApiError";
import path from "path";

const getAllProducts = async (req, res) => {
  const products = await Product.find({ deleted: false });
  return res.status(StatusCodes.OK).json({
    success: true,
    message: "product added successfully",
    data: products,
  });
};

const addProduct = async (req, res) => {
  if (!req.files) {
    throw new BadRequest("No File Uploaded");
  }

  const { image } = await uploadImage(req.files.image);

  const product = await Product.create({ ...req.body, image });
  return res.status(StatusCodes.OK).json({
    success: true,
    message: "product added successfully",
    data: product,
  });
};

const getSingleProduct = async (req, res) => {
  const { productId } = req.params;
  if (!productId) {
    throw new BadRequest("please provide a productId");
  }

  const singleProduct = await Product.findOne({
    _id: productId,
    deleted: false,
  });

  if (!singleProduct) {
    throw new NotFound("product not found");
  }

  return res.status(StatusCodes.OK).json({
    success: true,
    message: "",
    data: singleProduct,
  });
};

const updateProduct = async (req, res) => {
  const { productId } = req.params;
  if (!productId) {
    throw new BadRequest("please provide a productId");
  }

  let toUpdate = { ...req.body };

  if (req.files) {
    const { image } = await uploadImage(req.files.image);
    toUpdate = { ...toUpdate, image };
  }
  const updatedProduct = await Product.findOneAndUpdate(
    {
      _id: productId,
    },
    toUpdate,
    { new: true, runValidators: true }
  );

  if (!updatedProduct) {
    throw new NotFound("product not found");
  }

  return res.status(StatusCodes.OK).json({
    success: true,
    message: "",
    data: updatedProduct,
  });
};

const deleteProduct = async (req, res) => {
  const { productId } = req.params;
  if (!productId) {
    throw new BadRequest("please provide a productId");
  }

  const updatedProduct = await Product.findOneAndUpdate(
    {
      _id: productId,
      deleted: false,
    },
    { deleted: true },
    { new: true, runValidators: true }
  );

  if (!updatedProduct) {
    throw new NotFound("product not found");
  }

  return res.status(StatusCodes.OK).json({
    success: true,
    message: "deleted successfully",
    data: null,
  });
};

const uploadImage = async (ImageFile) => {
  const productImage = ImageFile;

  if (!productImage.mimetype.startsWith("image")) {
    throw new BadRequest("please uploaded Image");
  }

  const maxSize = 1024 * 1024;
  if (productImage.size > maxSize) {
    throw new BadRequest("Please upload Image smaller than 1MB");
  }

  const ImagePath = path.join(
    path.resolve(),
    "/uploads/" + `${productImage.name}`
  );

  await productImage.mv(ImagePath);
  return { image: `uploads/${productImage.name}` };
};

export {
  getAllProducts,
  getSingleProduct,
  addProduct,
  updateProduct,
  deleteProduct,
};
