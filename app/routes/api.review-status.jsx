// import { json } from "react-router";
import { authenticate } from "../shopify.server";
import prisma from "../db.server";

// GET /api/review-status
// Returns whether this shop has already submitted a review.
export async function loader({ request }) {
  const { session } = await authenticate.admin(request);
  const shop = session.shop;

  const record = await prisma.review.findUnique({
    where: { shop },
  });

  return ({ reviewed: record?.reviewed ?? false });
}

// POST /api/review-status
// Body: { rating: number }
// Saves reviewed = true (default false) + rating + shop id.
export async function action({ request }) {
  const { session } = await authenticate.admin(request);
  const shop = session.shop;

  const formData = await request.formData();
  const ratingRaw = formData.get("rating");
  const rating = ratingRaw ? Number(ratingRaw) : null;

  const record = await prisma.Review.upsert({
    where: { shop },
    update: { reviewed: true, rating },
    create: { shop, reviewed: true, rating },
  });

  return ({ success: true, reviewed: record.reviewed });
}