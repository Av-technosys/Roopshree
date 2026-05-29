"use server";

import { sendTemplateEmail } from "@/lib/email";
import {
  fetchOrderDetailsService,
  fetchOrdersService,
  fetchPurchasePaymentsService,
  updateOrderStatusService,
} from "@/services/admin.service";
import {
  validateOrderQuery,
  validatePaymentQuery,
} from "@/validators/admin-query.validator";

export async function fetchOrders(query: unknown = {}) {
  return fetchOrdersService(validateOrderQuery(query));
}

export async function updateOrderStatus(orderId: string, status: string) {
  return updateOrderStatusService(orderId, status);
}

export async function fetchOrderDetails(id: string) {
  return fetchOrderDetailsService(id);
}

export async function fetchPurchasePayments(query: unknown = {}) {
  return fetchPurchasePaymentsService(validatePaymentQuery(query));
}

export async function sendShippingConfirmationEmail(
  email: string,
  orderId: string,
  customerName: string,
  trackingLink: string,
  courierName: string,
) {
  return sendTemplateEmail({
    to: email,
    subject: "Roopshree - Your Order is Shipped",
    type: "user",
    template: "shipping",
    data: {
      "Customer First Name": customerName,
      "Order ID": orderId,
      "Courier Name": courierName,
      "Tracking Number": trackingLink,
      "Tracking Link": trackingLink,
    },
  });
}

export async function sendDeliveryConfirmationEmail(
  email: string,
  customerName: string,
  orderId: string,
  deliveryDate: string,
  reviewLink: string,
) {
  return sendTemplateEmail({
    to: email,
    subject: "Roopshree - Your Order Has Been Delivered",
    type: "user",
    template: "delivery",
    data: {
      "Customer First Name": customerName,
      "Order ID": orderId,
      "Delivery Date": deliveryDate,
      "Review Link": reviewLink,
    },
  });
}

export async function sendUserExperienceEmail(
  email: string,
  customerName: string,
  reviewLink: string,
) {
  return sendTemplateEmail({
    to: email,
    subject: "Roopshree - Share Your Experience",
    type: "user",
    template: "experience",
    data: {
      "Customer First Name": customerName,
      "Review Link": reviewLink,
    },
  });
}
