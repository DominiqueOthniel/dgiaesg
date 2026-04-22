import type { Request, Response } from "express";
import { Application, Company } from "../models";
import { AppError } from "../middleware/errorHandler";
import asyncHandler from "../middleware/asyncHandler";
import mongoose from "mongoose";
import PDFDocument from "pdfkit";
import fs from "fs";
import path from "path";

const CERT_DIR = path.join(__dirname, "../../uploads/certificates");

// Ensure certificates directory exists
if (!fs.existsSync(CERT_DIR)) {
    fs.mkdirSync(CERT_DIR, { recursive: true });
}

// POST /api/certificates/:applicationId/generate — generate PDF certificate
export const generateCertificate = asyncHandler(async (req: Request, res: Response) => {
    const { applicationId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(applicationId as string)) {
        throw new AppError("Invalid application ID", 400);
    }

    const application = await Application.findById(applicationId)
        .populate("companyId", "name sector region logoUrl")
        .populate("labelId", "name sector logoUrl");

    if (!application) {
        throw new AppError("Application not found", 404);
    }

    if (application.status !== "approved") {
        throw new AppError("Can only generate certificates for approved applications", 400);
    }

    const company = application.companyId as any;
    const label = application.labelId as any;
    const certDate = application.reviewedAt || new Date();
    const expiryDate = application.expiresAt || new Date();
    const certId = `CERT-${application._id.toString().slice(-8).toUpperCase()}`;

    // Generate PDF
    const fileName = `certificate_${application._id}.pdf`;
    const filePath = path.join(CERT_DIR, fileName);

    const doc = new PDFDocument({
        size: "A4",
        layout: "landscape",
        margins: { top: 40, bottom: 40, left: 60, right: 60 },
    });

    const stream = fs.createWriteStream(filePath);
    doc.pipe(stream);

    // --- PDF Design ---
    // Background border
    doc.rect(20, 20, doc.page.width - 40, doc.page.height - 40)
        .lineWidth(3)
        .strokeColor("#1a365d")
        .stroke();

    doc.rect(30, 30, doc.page.width - 60, doc.page.height - 60)
        .lineWidth(1)
        .strokeColor("#d4a843")
        .stroke();

    // Header
    doc.fontSize(12)
        .fillColor("#d4a843")
        .font("Helvetica-Bold")
        .text("COOPLABEL", 0, 60, { align: "center" });

    doc.fontSize(32)
        .fillColor("#1a365d")
        .font("Helvetica-Bold")
        .text("CERTIFICAT DE CONFORMITÉ", 0, 85, { align: "center" });

    doc.moveDown(0.5);
    doc.fontSize(14)
        .fillColor("#4a5568")
        .font("Helvetica")
        .text("Certificate of Compliance", { align: "center" });

    // Decorative line
    const lineY = 145;
    doc.moveTo(200, lineY).lineTo(doc.page.width - 200, lineY)
        .lineWidth(2).strokeColor("#d4a843").stroke();

    // Body text
    doc.moveDown(2);
    doc.fontSize(13)
        .fillColor("#2d3748")
        .font("Helvetica")
        .text("Il est certifié que l'organisation", { align: "center" });

    doc.moveDown(0.5);
    doc.fontSize(26)
        .fillColor("#1a365d")
        .font("Helvetica-Bold")
        .text(company?.name || "Organisation", { align: "center" });

    doc.moveDown(0.5);
    doc.fontSize(13)
        .fillColor("#2d3748")
        .font("Helvetica")
        .text("a satisfait à l'ensemble des critères d'évaluation requis", { align: "center" });

    doc.moveDown(0.2);
    doc.text("pour l'obtention du label de certification", { align: "center" });

    doc.moveDown(0.5);
    doc.fontSize(22)
        .fillColor("#d4a843")
        .font("Helvetica-Bold")
        .text(label?.name || "Label", { align: "center" });

    doc.moveDown(1);

    // Details section
    const detailsY = doc.y;
    doc.fontSize(10)
        .fillColor("#718096")
        .font("Helvetica");

    doc.text(`Secteur: ${company?.sector || "N/A"}`, 150, detailsY);
    doc.text(`Région: ${company?.region || "N/A"}`, 150, detailsY + 18);
    doc.text(`Date d'émission: ${certDate.toLocaleDateString("fr-FR")}`, 450, detailsY);
    doc.text(`Date d'expiration: ${expiryDate.toLocaleDateString("fr-FR")}`, 450, detailsY + 18);

    // Certificate ID
    doc.moveDown(2);
    doc.fontSize(9)
        .fillColor("#a0aec0")
        .font("Helvetica")
        .text(`N° de certificat: ${certId}`, { align: "center" });

    // Bottom decorative line
    const bottomLineY = doc.page.height - 80;
    doc.moveTo(200, bottomLineY).lineTo(doc.page.width - 200, bottomLineY)
        .lineWidth(1).strokeColor("#d4a843").stroke();

    // Signature area
    doc.fontSize(10)
        .fillColor("#4a5568")
        .font("Helvetica")
        .text("Direction de la Certification", 150, bottomLineY + 15)
        .text("CoopLabel", 150, bottomLineY + 30);

    doc.text(`Émis le ${new Date().toLocaleDateString("fr-FR")}`, 450, bottomLineY + 15);

    doc.end();

    await new Promise<void>((resolve, reject) => {
        stream.on("finish", resolve);
        stream.on("error", reject);
    });

    // Update application with certificate path
    application.certificateUrl = `/uploads/certificates/${fileName}`;
    await application.save();

    res.json({
        success: true,
        message: "Certificate generated successfully",
        data: { certificateUrl: application.certificateUrl },
    });
});

// GET /api/certificates/:applicationId/download — download PDF certificate
export const downloadCertificate = asyncHandler(async (req: Request, res: Response) => {
    const { applicationId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(applicationId as string)) {
        throw new AppError("Invalid application ID", 400);
    }

    const application = await Application.findById(applicationId);
    if (!application) {
        throw new AppError("Application not found", 404);
    }

    if (!application.certificateUrl) {
        throw new AppError("No certificate available for this application", 404);
    }

    const filePath = path.join(__dirname, "../../", application.certificateUrl);

    if (!fs.existsSync(filePath)) {
        throw new AppError("Certificate file not found on server", 404);
    }

    res.download(filePath, `certificate_${applicationId}.pdf`);
});

// GET /api/certificates/history/:companyId — get certification history for a company
export const getCertificationHistory = asyncHandler(async (req: Request, res: Response) => {
    const { companyId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(companyId as string)) {
        throw new AppError("Invalid company ID", 400);
    }

    const user = (req as any).user;

    // Verify access: user must be admin, or owner of the company
    const company = await Company.findById(companyId);
    if (!company) {
        throw new AppError("Company not found", 404);
    }

    const isAdmin = user.role === "admin";
    const isOwner = company.ownerId?.toString() === user._id.toString();

    if (!isAdmin && !isOwner) {
        throw new AppError("Not authorized to view this history", 403);
    }

    const applications = await Application.find({
        companyId,
        status: { $in: ["approved", "rejected", "expired"] },
    })
        .populate("labelId", "name sector logoUrl")
        .sort("-reviewedAt");

    res.json({
        success: true,
        count: applications.length,
        data: applications,
    });
});

// GET /api/certificates/badge/:companyId — generate SVG badge for a company
export const getDigitalBadge = asyncHandler(async (req: Request, res: Response) => {
    const { companyId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(companyId as string)) {
        throw new AppError("Invalid company ID", 400);
    }

    const company = await Company.findById(companyId).populate("labelId", "name");
    if (!company) {
        throw new AppError("Company not found", 404);
    }

    if (company.status !== "certified") {
        throw new AppError("Company is not currently certified", 400);
    }

    const label = company.labelId as any;
    const year = company.certificationDate
        ? new Date(company.certificationDate).getFullYear()
        : new Date().getFullYear();

    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="260" height="120" viewBox="0 0 260 120">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#1a365d;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#2d4a7c;stop-opacity:1" />
    </linearGradient>
    <linearGradient id="gold" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" style="stop-color:#d4a843;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#f0d68a;stop-opacity:1" />
    </linearGradient>
  </defs>
  <rect width="260" height="120" rx="12" fill="url(#bg)"/>
  <rect x="2" y="2" width="256" height="116" rx="10" fill="none" stroke="url(#gold)" stroke-width="1.5"/>
  <circle cx="40" cy="50" r="20" fill="none" stroke="#d4a843" stroke-width="2"/>
  <path d="M32 50 L38 56 L48 44" stroke="#d4a843" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
  <text x="70" y="42" font-family="Arial, sans-serif" font-size="10" fill="#8fa3bf" font-weight="bold" letter-spacing="2">COOPLABEL</text>
  <text x="70" y="60" font-family="Arial, sans-serif" font-size="16" fill="white" font-weight="bold">Certifié ${year}</text>
  <text x="70" y="78" font-family="Arial, sans-serif" font-size="9" fill="#8fa3bf">${label?.name || "Label"}</text>
  <rect x="15" y="92" width="230" height="1" fill="#d4a843" opacity="0.3"/>
  <text x="130" y="108" font-family="Arial, sans-serif" font-size="8" fill="#6b7f99" text-anchor="middle">${company.name}</text>
</svg>`;

    res.json({
        success: true,
        data: {
            svg,
            embedCode: `<a href="${req.protocol}://${req.get("host")}/directory/${companyId}" target="_blank" rel="noopener">${svg}</a>`,
            companyName: company.name,
            labelName: label?.name || "Label",
            year,
        },
    });
});
