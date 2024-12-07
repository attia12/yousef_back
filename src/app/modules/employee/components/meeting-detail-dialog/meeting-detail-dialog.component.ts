import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA} from "@angular/material/dialog";

@Component({
  selector: 'app-meeting-detail-dialog',
  templateUrl: './meeting-detail-dialog.component.html',
  styleUrl: './meeting-detail-dialog.component.scss'
})
export class MeetingDetailDialogComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: any) { }

}
