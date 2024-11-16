import { Injectable, InternalServerErrorException } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { ConfigService } from '@nestjs/config';
import Handlebars from 'handlebars';
import { readFileSync } from 'fs';
import { join } from 'path';

@Injectable()
export class MailingService {
  
  constructor(private config: ConfigService) {}

  private mailTransport() {
    return nodemailer.createTransport({
      host: this.config.get('MAIL_HOST'),
      port: this.config.get('MAIL_PORT'),
      secure: this.config.get('MAIL_SECURE') == 'true',
      auth: {
        user: this.config.get('MAIL_USER'),
        pass: this.config.get('MAIL_PASS'),
      },
      from: { name: 'Support', address: 'support@bep.com' },
    });
  }

  async sendEmail(
    file: string,
    subject: string,
    address: string,
    fullname: string,
    data: any,
  ) {
    const transport = this.mailTransport();
    const html = readFileSync(
      join(process.cwd(), 'public', 'templates', file),
      {
        encoding: 'utf-8',
      },
    );

    let template = Handlebars.compile(html);
    let htmlToSend = template(data);

    try {
      return await transport.sendMail({
        sender: 'support@bep.com',
        to: [{ name: fullname, address }],
        subject,
        html: htmlToSend,
      });
    } catch (err) {
      throw new InternalServerErrorException('mail_not_sent');
    }
  }
}
