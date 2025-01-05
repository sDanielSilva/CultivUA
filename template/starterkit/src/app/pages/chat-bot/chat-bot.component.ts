import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';
import { Router } from '@angular/router';
import { MaterialModule } from 'src/app/material.module';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-chat-bot',
  templateUrl: './chat-bot.component.html',
  styleUrls: ['./chat-bot.component.css'],
  encapsulation: ViewEncapsulation.None,
  standalone: true,
  imports: [MaterialModule],
  providers: [DatePipe]
})
export class ChatBot {}
