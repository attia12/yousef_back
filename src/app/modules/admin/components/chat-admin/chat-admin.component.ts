import { Component } from '@angular/core';
import { EmployeeService } from '../../../employee/services/employee.service';
import { StorageService } from '../../../../auth/services/storage/storage.service';

const groupBy = <T, K extends keyof any>(arr: T[], key: (i: T) => K) =>
  arr.reduce((groups, item) => {
    (groups[key(item)] ||= []).push(item);
    return groups;
  }, {} as Record<K, T[]>);

@Component({
  selector: 'app-chat-admin',
  templateUrl: './chat-admin.component.html',
  styleUrl: './chat-admin.component.scss',
})
export class ChatAdminComponent {
  users: any = [];

  selectedUser: any = null;
  newMessage = '';
  currentUser: any;

  constructor(private employeeService: EmployeeService) {}

  ngOnInit(): void {
    this.currentUser = StorageService.getUser();

    this.getallChat();
  }
  getallChat() {
    this.employeeService.getChats().subscribe((res) => {
      console.log(res);
      const data: any = [];
      const groupedbyname = groupBy(res, (i: any) => i.name);
      Object.keys(groupedbyname).forEach((name) => {
        data.push({
          name,
          user_id: groupedbyname[name].find((el) => el.type === 'user')
            ?.user_id,
          messages: groupedbyname[name].map((el) => ({
            user: el.name,
            text: el.text,
            type: el.type,
          })),
        });
      });
      this.users = data;
      // res.foreach((el: any) => {});
    });
  }

  selectUser(user: any) {
    this.selectedUser = user;
  }

  sendMessage() {
    if (this.newMessage.trim() && this.selectedUser) {
      const now = new Date();
      const isoString = now.toISOString();
      this.employeeService
        .addChat({
          text: this.newMessage,
          user_id: this.selectedUser?.user_id,
          name: this.selectedUser?.name,
          type: 'admin',
          date: isoString,
        })
        .subscribe((res) => {
          this.selectedUser.messages.push({
            user: this.selectedUser?.name,
            text: this.newMessage,
            type: 'admin',
          });
          this.newMessage = '';
        });
    }
  }
}
