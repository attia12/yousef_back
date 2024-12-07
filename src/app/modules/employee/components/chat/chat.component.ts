import { Component, HostListener } from '@angular/core';
import { EmployeeService } from '../../services/employee.service';
import { StorageService } from '../../../../auth/services/storage/storage.service';

interface SideNavToggle {
  screenwidth: number;
  collapsed: boolean;
}

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.scss',
})
export class ChatComponent {
  innerWidth: any;
  messages: { type: string; text: string }[] = [];
  newMessage: string = '';
  currentUser: any;

  constructor(private employeeService: EmployeeService) {}

  sendMessage() {
    if (this.newMessage.trim()) {
      const now = new Date();
      const isoString = now.toISOString();
      this.employeeService
        .addChat({
          text: this.newMessage,
          user_id: this.currentUser?.id ?? 0,
          name:this.currentUser?.name,
          type: 'user',
          date: isoString,
        })
        .subscribe((res) => {
          console.log('testttttttt', res);

          // Add user's message
          this.messages.push({ type: 'user', text: this.newMessage });

          // Clear the input field
          this.newMessage = '';

          // Simulate a bot response
          setTimeout(() => {
            this.addBotMessage(
              'admin have received your message please wait for his response'
            );
          }, 1000); // 1-second delay to simulate thinking time
        });
    }
  }

  addBotMessage(text: string) {
    this.messages.push({ type: 'admin', text });
  }
  ngOnInit(): void {
    this.innerWidth = window.innerWidth;
    this.currentUser = StorageService.getUser();
    this.getChatByuser_id(
      StorageService.getUser()?.id ? Number(StorageService.getUser()?.id) : 0
    );
  }

  getChatByuser_id(id: number) {
    this.employeeService.getChatByUserId(id).subscribe((res) => {
      console.log(res, this.currentUser?.id);

      this.messages = res.map((el: any) => ({
        type: el?.type,
        text: el.text,
      }));
    });
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.innerWidth = window.innerWidth;
  }

  getClass() {
    return this.innerWidth < 925 ? 'row-md' : 'row';
  }

  isSideNavCollapsed = false;
  screenWidth = 0;

  onToggleSideNav(eventData: SideNavToggle) {
    this.screenWidth = eventData.screenwidth;
    this.isSideNavCollapsed = eventData.collapsed;
    // Logique de gestion de l'ouverture/fermeture du menu latéral
    // Vous pouvez utiliser eventData.screenwidth et eventData.collapsed ici
  }
}
