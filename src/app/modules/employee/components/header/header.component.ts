import { Component, HostListener, Input, OnInit } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { languages, notifications, userItems } from './header-dummy-data';
import { MatDialog } from '@angular/material/dialog';
import { ProfileComponent } from '../../../../profile/profile.component';
import { StorageService } from '../../../../auth/services/storage/storage.service';
import { Router } from '@angular/router';
import { EmployeeService } from '../../services/employee.service';
import {MsalService} from "@azure/msal-angular";
import { PusherService } from '../../../admin/services/pusher.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  animations: [
    trigger('notificationOverlayAnimation', [
      state('void', style({ transform: 'translateY(-10px)', opacity: 0 })),
      transition(':enter', [
        style({ transform: 'translateY(-10px)', opacity: 0 }),
        animate('300ms ease-out', style({ transform: 'translateY(0)', opacity: 1 }))
      ]),
      transition(':leave', [
        style({ transform: 'translateY(0)', opacity: 1 }),
        animate('300ms ease-in', style({ transform: 'translateY(-10px)', opacity: 0 }))
      ])
    ]),
    trigger('badgeAnimation', [
      transition(':enter', [
        style({ transform: 'scale(0)', opacity: 0 }),
        animate('300ms ease-out', style({ transform: 'scale(1)', opacity: 1 }))
      ]),
      transition(':leave', [
        animate('300ms ease-in', style({ transform: 'scale(0)', opacity: 0 }))
      ])
    ])
  ]
})
export class HeaderComponent implements OnInit {
  @Input() collapsed = false;
  @Input() screenWidth = 0;

  canShowSearchAsOverlay = false;
  selectedLanguage: any;
  languages = languages;
  notifications: any[] = [];  // Initialise comme un tableau vide
  newNotificationsCount = 0;  // Compteur des nouvelles notifications
  userItems = userItems;
  selectedPicture: string | undefined;
  corectUserId:any;
  user: any;

  constructor(
    public dialog: MatDialog,
    private router: Router,
    private service: EmployeeService,
    private msalService: MsalService,
    private pusherService: PusherService,
  ) {

  }

  openDialog() {
    const dialogRef = this.dialog.open(ProfileComponent);
    dialogRef.afterClosed().subscribe((result) => {
      console.log(`Dialog result: ${result}`);
    });
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.checkCanShowSearchAsOverlay(window.innerWidth);
  }

  setlang(lang: any) {
    window.localStorage.setItem('LANG', JSON.stringify(lang));
    this.selectedLanguage = lang;
  }

  getUser() {
    this.service
      .getnotificationByUserId(
        this.corectUserId ? this.corectUserId :  this.user.id
      )
      .subscribe((res) => {
        console.log("notification", res)
        this.notifications = res.map((el: any) => {
          let notificationDetails = {
            icon: 'far fa-file', // Default icon for project
            subject: 'New Notification', // Default subject
            description: el.description, // Default description
            dueDate: el.dueDate,
            read: el.read // Set read status
          };

          if (el.type === 'meeting') {
            notificationDetails = {
              icon: 'far fa-calendar', // Icon for meeting
              subject: 'New Meeting',
              description: `Meeting scheduled: ${el.description} on ${el.dueDate}`,
              dueDate: el.dueDate,
              read: el.read
            };
          } else if (el.type === 'project') {
            notificationDetails = {
              icon: 'far fa-file', // Icon for project
              subject: 'New Project',
              description: `Project description: ${el.description}`,
              dueDate: el.dueDate,
              read: el.read
            };
          }

          return notificationDetails;

          //this.newNotificationsCount = this.notifications.filter(n => !n.read).length;

        });
      })
  }

  ngOnInit(): void {
    this.corectUserId=StorageService.getUserIdFromToken();
    const channel = this.pusherService.getChannel('meeting-channel');

    // Listen for the meeting-created event
    channel.bind('meeting-created', (meeting: any) => {
      this.notifications.push({
        icon: 'far fa-calendar',
        subject: 'New Meeting',
        description: `Meeting scheduled: ${meeting.description} on ${meeting.date} at ${meeting.time}`,

        read: false
      });

      this.newNotificationsCount++;
    });
    this.getUserDetail()
    this.checkCanShowSearchAsOverlay(window.innerWidth);
    this.selectedLanguage = StorageService.getlang();

    this.getUser();

    this.getUnreadCount();


  }

  logout() {
    StorageService.logout();
    this.router.navigateByUrl('/login');
  }

  message() {
    this.router.navigateByUrl('/chat');
  }

  getHeadClass(): string {
    let styleClass = '';
    if (this.collapsed && this.screenWidth > 768) {
      styleClass = 'head-trimmed';
    } else {
      styleClass = 'head-md-screen';
    }
    return styleClass;
  }

  checkCanShowSearchAsOverlay(innerWidth: number): void {
    this.canShowSearchAsOverlay = innerWidth < 845;
  }
  viewNotifications() {

    const userId = this.corectUserId || StorageService.getUser()?.id;
    if (userId) {
      this.service.markAllNotificationsAsRead(userId).subscribe(() => {
        this.getUnreadCount();

      });
    }
  }
  isLoggedIn():boolean {
    return  this.msalService.instance.getActiveAccount() != null ;
  }
  logoutMicrosoft()
  {
    this.msalService.logout();
  }

  handleLogout() {
    if(this.isLoggedIn())
    {
      this.logoutMicrosoft();

    }
    else {
      this.logout();
    }

  }
  getUnreadCount(): void {
    const userId = StorageService.getUser()?.id;
    if (userId) {
      this.service.getUnreadCount(userId).subscribe(count => {
        this.newNotificationsCount = count;
      });
    }
  }

  private getUserDetail() {
    this.service.getUserById(this.corectUserId).subscribe((res)=> {
      this.user=res;
      console.log("this the user",this.user);
    },error => {
      console.log(error)
    })
  }
}
