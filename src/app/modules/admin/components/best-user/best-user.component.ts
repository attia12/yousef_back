import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {Fireworks} from "fireworks-js";
import {AdminService} from "../../services/admin.service";

@Component({
  selector: 'app-best-user',
  templateUrl: './best-user.component.html',
  styleUrl: './best-user.component.scss'
})
export class BestUserComponent implements OnInit, AfterViewInit {
  @ViewChild('fireworksContainer') fireworksContainer!: ElementRef;
  bestUser: any;

  fireworksOptions = {
    speed: 3,
    particles: 100,
    explosion: 5,
    friction: 0.98,
    sound: {
      enabled: true,
      files: [
        'https://fireworks-js.surge.sh/audio/explosion0.mp3',
        'https://fireworks-js.surge.sh/audio/explosion1.mp3',
        'https://fireworks-js.surge.sh/audio/explosion2.mp3',
      ],
    },
  };

  ngAfterViewInit() {
    const container = this.fireworksContainer.nativeElement;
    const fireworks = new Fireworks(container, this.fireworksOptions);
    fireworks.start();
  }
  constructor(private userService: AdminService) {}

  ngOnInit(): void {
    this.fetchBestUser();
  }

  fetchBestUser(): void {
    this.userService.getBestUser().subscribe(
      (response:any) => {
        this.bestUser = {
          ...response,
          profilePicture: response.image ? `data:image/jpeg;base64,${response.image}` : null,  // Display base64 image if available

        };
      },
      (error) => {
        console.error('Failed to fetch best user:', error);
      }
    );
  }

}
