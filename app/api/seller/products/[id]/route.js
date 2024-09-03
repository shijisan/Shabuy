// app/api/seller/products/[id]/route.js
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import jwt from "jsonwebtoken";

const SECRET_KEY = process.env.JWT_SECRET;

export async function PUT(request, { params }) {
  const token = request.headers.get("Authorization")?.replace("Bearer ", "");
  const { id } = params;
  const { name, description, price, quantity } = await request.json();

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    const sellerId = decoded.userId;

    const product = await prisma.product.updateMany({
      where: {
        id: parseInt(id, 10),
        sellerId,
        deleted: false,
      },
      data: {
        name,
        description,
        price: parseFloat(price),
        quantity: parseInt(quantity, 10),
      },
    });

    if (product.count === 0) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json(product);
  } catch (error) {
    console.error("Error updating product:", error);
    return NextResponse.json(
      { error: "Failed to update product" },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  const token = request.headers.get("Authorization")?.replace("Bearer ", "");
  const { id } = params;

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    const sellerId = decoded.userId;

    const product = await prisma.product.updateMany({
      where: {
        id: parseInt(id, 10),
        sellerId,
        deleted: false,
      },
      data: {
        deleted: true,
      },
    });

    if (product.count === 0) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("Error deleting product:", error);
    return NextResponse.json(
      { error: "Failed to delete product" },
      { status: 500 }
    );
  }
}
