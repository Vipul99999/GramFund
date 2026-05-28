import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../infrastructure/prisma/prisma.service';
import { createHmac } from 'crypto';
import PDFDocument from 'pdfkit';
import QRCode from 'qrcode';
import { ObjectStorageService } from './storage/object-storage.service';

@Injectable()
export class ReceiptsService {
  constructor(private readonly prisma: PrismaService, private readonly storage: ObjectStorageService) {}
  private sign(input: string) { return createHmac('sha256', process.env.RECEIPT_SIGNING_KEY as string).update(input).digest('hex'); }

  async generate(transactionId: string) {
    const tx = await this.prisma.transaction.findUnique({ where: { id: transactionId } });
    if (!tx) throw new NotFoundException('Transaction not found');
    const receiptNumber = `GF-${tx.createdAt.getUTCFullYear()}-${tx.id.slice(0, 8).toUpperCase()}`;
    const signature = this.sign(`${tx.id}|${tx.idempotencyKey}|${tx.amount}`);
    const verifyUrl = `${process.env.RECEIPT_VERIFY_BASE_URL || 'https://verify.gramfund.local'}/api/v1/receipts/verify/${tx.id}?sig=${signature}`;
    const qrDataUrl = await QRCode.toDataURL(verifyUrl);

    const doc = new PDFDocument({ size: 'A5', margin: 24 });
    const chunks: Buffer[] = [];
    doc.on('data', (c) => chunks.push(c));
    doc.text(`GramFund Receipt: ${receiptNumber}`); doc.text(`Transaction: ${tx.id}`); doc.text(`Amount: ${tx.amount.toString()}`); doc.text(`Verify: ${verifyUrl}`); doc.end();
    const pdf = await new Promise<Buffer>((resolve) => doc.on('end', () => resolve(Buffer.concat(chunks))));
    const key = `receipts/${tx.id}.pdf`;
    await this.storage.putObject(key, pdf, 'application/pdf');
    const signedUrl = this.storage.getSignedUrl(key, 3600);
    const expiresAt = new Date(Date.now() + 3600 * 1000);
    const retentionUntil = new Date(Date.now() + 365 * 24 * 3600 * 1000);
    await this.prisma.receiptArtifact.upsert({ where: { transactionId: tx.id }, create: { transactionId: tx.id, storageKey: key, signedUrl, expiresAt, retentionUntil }, update: { signedUrl, expiresAt, retentionUntil } });
    return { receiptNumber, verifyUrl, signature, qrDataUrl, signedUrl, expiresAt, retentionUntil, thermalText: `Receipt ${receiptNumber}\nAmt ${tx.amount}` };
  }

  async verify(transactionId: string, sig: string) { const tx = await this.prisma.transaction.findUnique({ where: { id: transactionId } }); if (!tx) throw new NotFoundException('Transaction not found'); const expected = this.sign(`${tx.id}|${tx.idempotencyKey}|${tx.amount}`); return { valid: sig === expected, transactionId }; }
}
