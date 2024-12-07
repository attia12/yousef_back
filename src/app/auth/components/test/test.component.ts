import {Component, OnInit} from '@angular/core';
import {CalendarOptions} from "@fullcalendar/core";
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import {AdminService} from "../../../modules/admin/services/admin.service";
import {MeetingDialogComponent} from "../../../modules/admin/components/meeting-dialog/meeting-dialog.component";
import {MatDialog} from "@angular/material/dialog";
import {EmployeeService} from "../../../modules/employee/services/employee.service";

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrl: './test.component.scss'
})
export class TestComponent implements OnInit{

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
    select: this.handleDateSelect.bind(this),
    eventClick: this.handleEventClick.bind(this),
    eventDrop: this.handleEventDrop.bind(this),
    eventDidMount: (info) => {
      // Custom rendering logic based on eventType
      const event = info.event;
      const eventType = event.extendedProps['eventType'];

      let iconHtml = '';
      if (eventType === 'meeting') {
        iconHtml = '<span style="color: #f39c12; font-size: 18px;">📅</span>';
        event.setProp('backgroundColor', '#f39c12');
        event.setProp('borderColor', '#f39c12');
      } else if (eventType === 'project') {
        iconHtml = '<span style="color: #3498db; font-size: 18px;">💼</span>';
        event.setProp('backgroundColor', '#3498db');
        event.setProp('borderColor', '#3498db');
      }


      const eventTitleElement = info.el.querySelector('.fc-event-title');
      if (eventTitleElement) {
        eventTitleElement.innerHTML = `${iconHtml} ${event.title}`;
      }
    }
  };

  constructor(private adminService: AdminService,public dialog: MatDialog,private employeeService:EmployeeService) {}

  ngOnInit(): void {
    this.loadProjects();
    this.loadMeetings();
  }
  handleDateSelect(selectInfo: any) {
    const selectedDate = selectInfo.startStr;
    const dialogRef = this.dialog.open(MeetingDialogComponent, {
      width: '400px',
      data: { selectedDate }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('Meeting Scheduled:', result);
        this.addEventToCalendar(result);
      }
    });

  }
  private addEventToCalendar(meeting: any) {
    const newEvent = {
      id: meeting.id,
      title: meeting.description,
      start: this.combineDateAndTime(meeting.date, meeting.time),
      end: this.combineDateAndTime(meeting.date, meeting.time), // Use appropriate end date/time if available
      extendedProps: {
        employeeId: meeting.employeeId,
        eventType: 'meeting'
      }
    };

    // Update calendarOptions events dynamically
    this.calendarOptions = {
      ...this.calendarOptions,
      events: [
        ...(this.calendarOptions.events as EventSourceInit[]),
        newEvent
      ]
    };
  }


  // handleEventClick(clickInfo: any) {
  //
  //   alert(
  //     `Event: ${clickInfo.event.title}\n` +
  //     `Priority: ${clickInfo.event.extendedProps.priority}\n` +
  //     `Employee Name: ${clickInfo.event.extendedProps.employeeName}\n` +
  //     `Start Date: ${clickInfo.event.startStr}`
  //   )
  // }
  handleEventClick(clickInfo: any) {
    const event = clickInfo.event;
    const eventType = event.extendedProps.eventType;
    const employeeId = event.extendedProps.employeeId;

    if (eventType === 'meeting') {
      this.employeeService.getUserById(employeeId).subscribe(
        (employee) => {

          alert(`Meeting: ${event.title}\nEmployee: ${employee.name}\nEmail: ${employee.email}`);
        },
        (error) => {
          console.error('Error fetching employee details:', error);
          alert('Error fetching employee details');
        }
      );
    } else if (eventType === 'project') {
      alert(
          `Event: ${clickInfo.event.title}\n` +
          `Priority: ${clickInfo.event.extendedProps.priority}\n` +
           `Employee Name: ${clickInfo.event.extendedProps.employeeName}\n` +
           `Start Date: ${clickInfo.event.startStr}`
         )
    }
  }

  handleEventDrop(dropInfo: any) {
    const newStartDate = dropInfo.event.startStr; // This is the new due date
    const projectId = dropInfo.event.id; // Assuming you're using the project ID as the event ID

    // Prepare the payload for the API call
    const updatePayload = {
      id: projectId,
      dueDate: newStartDate,
    };
    console.log(updatePayload)


    this.adminService.updateProjectDueDate(updatePayload).subscribe(
      (response) => {
        console.log('Due date updated successfully:', response);

      },
      (error) => {
        console.error('Error updating due date:', error);

      }
    );
  }

  private loadProjects() {
    this.adminService.getAllProjects().subscribe(
      (projects) => {
        console.log(projects)
        const calendarEvents = projects.map((project: any) => {
          return {
            id: project.id,
            title: project.title,
            start: project.dueDate,
            extendedProps: {
              priority: project.priority,
              employeeName: project.employeeName,
              eventType: 'project'

            }
          };
        });


        this.calendarOptions.events = [
          ...this.calendarOptions.events as EventSourceInit[],  // Ensure proper typing
          ...calendarEvents
        ];
      },
      (error) => {
        console.error('Error fetching projects:', error);
      }
    );
  }


  private loadMeetings() {
    this.adminService.getMeetings().subscribe(
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

            }
          };
        });

        this.calendarOptions.events = [
          ...this.calendarOptions.events as EventSourceInit[],  // Ensure proper typing
          ...calendarEvents
        ];
      },
      (error) => {
        console.error('Error fetching meetings:', error);
      }
    );
  }

  private combineDateAndTime(date: string, time: string): string {
    // Ensure that both the date and time are in the correct format (ISO 8601)
    const formattedDate = date.substring(0, 10);  // Extract date part (yyyy-mm-dd)
    const formattedTime = time.padStart(5, '0');   // Ensure time is formatted as "HH:mm"

    // Combine the date and time into a full ISO 8601 string
    return `${formattedDate}T${formattedTime}:00.000+00:00`;
  }
}