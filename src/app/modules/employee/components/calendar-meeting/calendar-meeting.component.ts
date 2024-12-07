import {Component, OnInit} from '@angular/core';
import {CalendarOptions} from "@fullcalendar/core";
import {AdminService} from "../../../admin/services/admin.service";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import {StorageService} from "../../../../auth/services/storage/storage.service";
import { MeetingDetailDialogComponent } from '../meeting-detail-dialog/meeting-detail-dialog.component';
import {MatDialog} from "@angular/material/dialog";


@Component({
  selector: 'app-calendar-meeting',
  templateUrl: './calendar-meeting.component.html',
  styleUrl: './calendar-meeting.component.scss'
})
export class CalendarMeetingComponent implements OnInit{
  calendarOptions: CalendarOptions = {
    initialView: 'dayGridMonth',
    plugins: [dayGridPlugin, interactionPlugin],
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,dayGridWeek,dayGridDay'
    },
    events: [],
    editable: true,
    selectable: true,
    select: this.handleDateClick.bind(this),
    eventClick: this.handleEventClick.bind(this),

  };
  private employeeId: any;

  constructor(private meetingService: AdminService,private dialog: MatDialog) { }

  ngOnInit() {
    this.employeeId=StorageService.getUserIdFromToken();
    this.fetchMeetings();
  }

  // Fetch meetings from backend

  private fetchMeetings() {
    this.meetingService.getMeetingsByEmployeeId(this.employeeId).subscribe(
      (meetings) => {
        console.log(meetings);  // Check the structure of the data received
        const calendarEvents = meetings.map((meeting: any) => {
          // Combine the date and time fields into an ISO 8601 string
          const startDate = this.combineDateAndTime(meeting.date, meeting.time);
          const endDate = startDate;  // Assuming the end time is the same as start time for now
          console.log(meeting.employeeId);
          return {
            id: meeting.id,
            title: meeting.description,
            start: startDate,  // Use the combined start date
            end: endDate,      // Use the combined end date (same for now)
            extendedProps: {
              employeeId: meeting.employeeId,
              eventType: 'meeting',
              isOnline: meeting.online,
              meetLink: meeting.online ? meeting.meetLink : 'Offline',

            }
          };
        });

        this.calendarOptions.events=calendarEvents;
      },
      (error) => {
        console.error('Error fetching meetings:', error);
      }
    );
  }

  handleDateClick(arg: any) {
    alert('Date clicked: ' + arg.dateStr);
  }


  handleEventClick(arg: any) {
    const meetingDetails = {
      title: arg.event.title,
      start: arg.event.start,
      isOnline: arg.event.extendedProps.isOnline,
      meetLink: arg.event.extendedProps.isOnline ? arg.event.extendedProps.meetLink : null, // Only include link if online
    };

    // Open the dialog with the meeting details
    this.dialog.open(MeetingDetailDialogComponent, {
      data: meetingDetails
    });
  }


  private combineDateAndTime(date: string, time: string): string {
    // Ensure that both the date and time are in the correct format (ISO 8601)
    const formattedDate = date.substring(0, 10);  // Extract date part (yyyy-mm-dd)
    const formattedTime = time.padStart(5, '0');   // Ensure time is formatted as "HH:mm"

    // Combine the date and time into a full ISO 8601 string
    return `${formattedDate}T${formattedTime}:00.000+00:00`;
  }
}
